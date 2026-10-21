import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, "public");
const sources = JSON.parse(await readFile(path.join(root, "catalog-sources.json"), "utf8"));
const catalogCache = new Map();
const albumCache = new Map();
const parties = new Map();
const cacheTtl = 10 * 60 * 1000;
const albumCacheTtl = 24 * 60 * 60 * 1000;
const apiRequestTimes = [];
const generations = ["60", "70", "80", "90", "2000", "2010", "2020"];
const reputations = ["very-known", "known", "less-known"];
const categories = Object.keys(sources);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function badRequest(response, message) {
  sendJson(response, 400, { error: message });
}

async function readBody(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 16_384) throw new Error("La requête est trop volumineuse.");
  }
  return body ? JSON.parse(body) : {};
}

function normalizedTitle(value = "") {
  return value.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ").trim();
}

function trackYear(track) {
  const year = Number(track.album?.release_date?.slice(0, 4));
  return Number.isInteger(year) ? year : 0;
}

function decadeFor(year) {
  if (year >= 1960 && year < 1970) return "60";
  if (year >= 1970 && year < 1980) return "70";
  if (year >= 1980 && year < 1990) return "80";
  if (year >= 1990 && year < 2000) return "90";
  if (year >= 2000 && year < 2010) return "2000";
  if (year >= 2010 && year < 2020) return "2010";
  if (year >= 2020 && year < 2030) return "2020";
  return null;
}

function notorietyFor(track) {
  const rank = Number(track.rank) || 0;
  if (rank >= 700_000) return "very-known";
  if (rank >= 350_000) return "known";
  return "less-known";
}

function artistsFor(track) {
  const contributors = Array.isArray(track.contributors) ? track.contributors : [];
  const names = [track.artist?.name, ...contributors.map((artist) => artist.name)]
    .filter(Boolean);
  return [...new Set(names.map(normalizedTitle))];
}

function isEligible(track) {
  const title = `${track.title ?? ""} ${track.title_short ?? ""}`;
  const albumName = track.album?.title ?? "";
  const isSoundtrack = /soundtrack|original motion picture|bande originale|\bost\b|music from/i.test(albumName);
  const isCompilation = /compilation/i.test(track.album?.record_type ?? track.album?.type ?? "");
  return Boolean(
    track.id &&
    track.preview &&
    trackYear(track) &&
    !/\blive\b|remaster(?:ed)?/i.test(title) &&
    (!isCompilation || isSoundtrack)
  );
}

function cleanCatalog(entries) {
  const unique = new Map();
  for (const entry of entries) {
    const track = entry.track;
    if (!isEligible(track)) continue;
    const identity = track.isrc || `${normalizedTitle(track.artist?.name)}:${normalizedTitle(track.title)}`;
    const existing = unique.get(identity);
    if (!existing) unique.set(identity, entry);
    else existing.repertoires = [...new Set([...existing.repertoires, ...entry.repertoires])];
  }
  return [...unique.values()];
}

async function deezerJson(url) {
  await waitForApiSlot();
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  } catch (error) {
    throw new Error(`Impossible de joindre Deezer : ${error.message}`);
  }
  if (!response.ok) throw new Error(`Deezer a répondu avec le statut ${response.status}.`);
  const payload = await response.json();
  if (payload.error) {
    throw new Error(`Deezer : ${payload.error.message || "la requête a échoué."}`);
  }
  return payload;
}

async function waitForApiSlot() {
  while (true) {
    const now = Date.now();
    while (apiRequestTimes.length && now - apiRequestTimes[0] >= 5000) {
      apiRequestTimes.shift();
    }
    if (apiRequestTimes.length < 45) {
      apiRequestTimes.push(now);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, Math.max(25, apiRequestTimes[0] + 5000 - now)));
  }
}

async function mapConcurrent(items, concurrency, callback) {
  const results = new Array(items.length);
  let nextIndex = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await callback(items[index]);
    }
  }));
  return results;
}

async function getAlbumDetails(albumId) {
  const key = String(albumId);
  const cached = albumCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.promise;
  const url = new URL(`https://api.deezer.com/album/${encodeURIComponent(key)}`);
  const promise = deezerJson(url).then((album) => album.release_date ? album : null);
  albumCache.set(key, { promise, expiresAt: Date.now() + albumCacheTtl });
  try {
    return await promise;
  } catch (error) {
    albumCache.delete(key);
    throw error;
  }
}

async function getTrackDetails(trackId) {
  const url = new URL(`https://api.deezer.com/track/${encodeURIComponent(trackId)}`);
  return deezerJson(url);
}

async function searchPlaylistTracks(query) {
  const playlistSearch = new URL("https://api.deezer.com/search/playlist");
  playlistSearch.searchParams.set("q", query);
  playlistSearch.searchParams.set("limit", "5");
  const result = await deezerJson(playlistSearch);
  const playlists = (result.data ?? []).slice(0, 2);
  const batches = await Promise.all(playlists.map(async (playlist) => {
    const url = new URL(`https://api.deezer.com/playlist/${playlist.id}/tracks`);
    url.searchParams.set("limit", "50");
    const tracks = await deezerJson(url);
    return tracks.data ?? [];
  }));
  return batches.flat();
}

async function getCatalog(category, repertoire) {
  const selectedRepertoires = [...repertoire].sort();
  const key = `${category}:${selectedRepertoires.join(",")}`;
  const cached = catalogCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.promise ?? cached.entries;
  const promise = buildCatalog(category, selectedRepertoires);
  catalogCache.set(key, { promise, expiresAt: Date.now() + cacheTtl });
  try {
    const entries = await promise;
    catalogCache.set(key, { entries, expiresAt: Date.now() + cacheTtl });
    return entries;
  } catch (error) {
    catalogCache.delete(key);
    throw error;
  }
}

async function buildCatalog(category, selectedRepertoires) {
  const categorySources = sources[category];
  if (!categorySources) throw new Error("Cette catégorie n’existe pas.");
  const sourceEntries = await Promise.all(selectedRepertoires.flatMap((sourceRepertoire) => {
    const queries = categorySources[sourceRepertoire] ?? [];
    return queries.map(async (query) => {
      const tracks = await searchPlaylistTracks(query);
      return tracks.map((track) => ({
        track,
        repertoires: [sourceRepertoire]
      }));
    });
  }));
  const candidates = new Map();
  for (const entry of sourceEntries.flat()) {
    const track = entry.track;
    if (!track.preview || !track.album?.id || /\blive\b|remaster(?:ed)?/i.test(track.title ?? "")) continue;
    const identity = track.isrc || `${normalizedTitle(track.artist?.name)}:${normalizedTitle(track.title)}`;
    const existing = candidates.get(identity);
    if (existing) existing.repertoires = [...new Set([...existing.repertoires, ...entry.repertoires])];
    else candidates.set(identity, entry);
  }
  const uniqueCandidates = [...candidates.values()];
  const albumIds = [...new Set(uniqueCandidates.map(({ track }) => String(track.album.id)))];
  const albumDetails = await mapConcurrent(albumIds, 8, getAlbumDetails);
  const albumsById = new Map(albumIds.map((id, index) => [id, albumDetails[index]]));
  const enrichedEntries = uniqueCandidates.flatMap((entry) => {
    const album = albumsById.get(String(entry.track.album.id));
    if (!album) return [];
    return [{
      ...entry,
      track: {
        ...entry.track,
        album: {
          ...entry.track.album,
          release_date: album.release_date,
          record_type: album.record_type,
          type: album.record_type,
          cover_big: album.cover_big ?? entry.track.album.cover_big
        }
      }
    }];
  });
  const entries = cleanCatalog(enrichedEntries);
  return entries;
}

function validateCriteria(criteria) {
  if (!criteria || typeof criteria !== "object") return "Critères manquants.";
  if (!categories.includes(criteria.category)) return "Catégorie inconnue.";
  if (!Array.isArray(criteria.repertoire) || !criteria.repertoire.length ||
      criteria.repertoire.some((item) => !["fr", "international"].includes(item)) ||
      new Set(criteria.repertoire).size !== criteria.repertoire.length) {
    return "Sélectionnez au moins un répertoire valide.";
  }
  if (criteria.category === "chanson" &&
      (criteria.repertoire.length !== 1 || criteria.repertoire[0] !== "fr")) {
    return "La chanson française utilise le répertoire français.";
  }
  if (![10, 15, 20, 25].includes(criteria.clipLength)) return "Durée d’extrait invalide.";
  if (!Number.isInteger(criteria.count) || criteria.count < 10 || criteria.count > 100 || criteria.count % 10 !== 0) {
    return "Le nombre d’extraits doit être compris entre 10 et 100, par pas de 10.";
  }
  if (!Array.isArray(criteria.generations) || !criteria.generations.length ||
      criteria.generations.some((item) => !generations.includes(item))) {
    return "Sélectionnez au moins une génération valide.";
  }
  if (!Array.isArray(criteria.reputations) || !criteria.reputations.length ||
      criteria.reputations.some((item) => !reputations.includes(item))) {
    return "Sélectionnez au moins un niveau de notoriété valide.";
  }
  return null;
}

function filterCatalog(entries, criteria) {
  const selectedGenerations = new Set(criteria.generations);
  const selectedReputations = new Set(criteria.reputations);
  const selectedRepertoires = new Set(criteria.repertoire);
  return entries.filter(({ track, repertoires }) =>
    repertoires.some((repertoire) => selectedRepertoires.has(repertoire)) &&
    selectedGenerations.has(decadeFor(trackYear(track))) &&
    selectedReputations.has(notorietyFor(track))
  );
}

function compose(entries, count) {
  const candidates = [...entries];
  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [candidates[index], candidates[other]] = [candidates[other], candidates[index]];
  }
  const selected = [];
  const usedArtists = new Set();
  for (const entry of candidates) {
    const artists = artistsFor(entry.track);
    if (artists.some((artist) => usedArtists.has(artist))) {
      continue;
    }
    selected.push(entry);
    artists.forEach((artist) => usedArtists.add(artist));
    if (selected.length === count) break;
  }
  if (selected.length < count) {
    const selectedIds = new Set(selected.map(({ track }) => track.id));
    const relaxed = candidates.filter(({ track }) => !selectedIds.has(track.id));
    for (const entry of relaxed) {
      if (selected.length === count) break;
      selected.push(entry);
    }
  }
  const tracks = selected.slice(0, count).map(({ track }) => ({
    id: track.id,
    title: track.title,
    artist: track.artist?.name ?? "Artiste inconnu",
    contributors: (track.contributors ?? []).map((artist) => artist.name).filter(Boolean),
    album: track.album?.title ?? "Album inconnu",
    year: trackYear(track),
    cover: track.album?.cover_big ?? track.album?.cover_medium ?? "",
    preview: track.preview
  }));
  const selectedTrackIds = new Set(selected.map(({ track }) => track.id));
  const selectedArtists = new Set(selected.flatMap(({ track }) => artistsFor(track)));
  const reserveTracks = candidates
    .filter(({ track }) =>
      !selectedTrackIds.has(track.id) &&
      !artistsFor(track).some((artist) => selectedArtists.has(artist))
    )
    .map(({ track }) => ({
      id: track.id,
      title: track.title,
      artist: track.artist?.name ?? "Artiste inconnu",
      contributors: (track.contributors ?? []).map((artist) => artist.name).filter(Boolean),
      album: track.album?.title ?? "Album inconnu",
      year: trackYear(track),
      cover: track.album?.cover_big ?? track.album?.cover_medium ?? "",
      preview: track.preview
    }));
  return { tracks, reserves: reserveTracks };
}

async function handleApi(request, response, url) {
  if (url.pathname === "/api/health" && request.method === "GET") {
    return sendJson(response, 200, { ok: true });
  }

  if (url.pathname === "/api/availability" && request.method === "POST") {
    const criteria = await readBody(request);
    const validationError = validateCriteria(criteria);
    if (validationError) return badRequest(response, validationError);
    const entries = filterCatalog(await getCatalog(criteria.category, criteria.repertoire), criteria);
    const requested = criteria.count;
    const distinctArtists = new Set(entries.flatMap(({ track }) => artistsFor(track))).size;
    const strict = distinctArtists >= requested && entries.length >= Math.ceil(requested * 1.15);
    const tolerated = distinctArtists >= Math.ceil(requested * 0.6) && entries.length >= Math.ceil(requested * 1.15);
    return sendJson(response, 200, {
      status: strict ? "normal" : tolerated ? "tolerated" : "unavailable",
      availableTracks: entries.length
    });
  }

  if (url.pathname === "/api/party" && request.method === "POST") {
    const criteria = await readBody(request);
    const validationError = validateCriteria(criteria);
    if (validationError) return badRequest(response, validationError);
    const entries = filterCatalog(await getCatalog(criteria.category, criteria.repertoire), criteria);
    const distinctArtists = new Set(entries.flatMap(({ track }) => artistsFor(track))).size;
    const canCompose = distinctArtists >= Math.ceil(criteria.count * 0.6) &&
      entries.length >= Math.ceil(criteria.count * 1.15);
    if (!canCompose) {
      return sendJson(response, 409, {
        error: "Ces critères sont trop restrictifs pour composer une partie. Modifiez-les pour continuer."
      });
    }
    const { tracks, reserves } = compose(entries, criteria.count);
    if (tracks.length !== criteria.count) {
      return sendJson(response, 409, { error: "Deezer ne fournit pas assez de titres pour cette partie." });
    }
    const firstTrack = await getTrackDetails(tracks[0].id);
    if (!firstTrack.preview) {
      return sendJson(response, 502, { error: "Deezer ne fournit plus d’extrait audio pour le premier titre." });
    }
    tracks[0].preview = firstTrack.preview;
    const id = randomUUID();
    parties.set(id, { tracks, reserves, expiresAt: Date.now() + 60 * 60 * 1000 });
    const publicTracks = tracks.map(({ preview, ...track }) => track);
    return sendJson(response, 200, { id, tracks: publicTracks, firstPreview: firstTrack.preview });
  }

  const trackMatch = url.pathname.match(/^\/api\/party\/([0-9a-f-]+)\/track\/(\d+)$/i);
  if (trackMatch && request.method === "GET") {
    const party = parties.get(trackMatch[1]);
    if (!party || party.expiresAt <= Date.now()) {
      parties.delete(trackMatch[1]);
      return sendJson(response, 404, { error: "La sélection de cette partie n’est plus disponible." });
    }
    const track = party.tracks[Number(trackMatch[2])];
    if (!track) return sendJson(response, 404, { error: "Cet extrait n’existe pas dans la partie." });
    const details = await getTrackDetails(track.id);
    if (!details.preview) return sendJson(response, 404, { error: "Deezer ne fournit aucun extrait pour ce titre." });
    return sendJson(response, 200, { preview: details.preview });
  }

  const replacementMatch = url.pathname.match(/^\/api\/party\/([0-9a-f-]+)\/replacement$/i);
  if (replacementMatch && request.method === "POST") {
    const party = parties.get(replacementMatch[1]);
    if (!party || party.expiresAt <= Date.now()) {
      parties.delete(replacementMatch[1]);
      return sendJson(response, 404, { error: "La réserve de cette partie n’est plus disponible." });
    }
    const replacement = party.reserves.shift();
    if (!replacement) return sendJson(response, 404, { error: "Aucun extrait de remplacement n’est disponible." });
    const details = await getTrackDetails(replacement.id);
    if (!details.preview) return sendJson(response, 404, { error: "L’extrait de remplacement ne possède plus de lien audio." });
    replacement.preview = details.preview;
    const currentIndex = party.tracks.findIndex((track) => track.id === replacement.id);
    if (currentIndex >= 0) party.tracks[currentIndex] = replacement;
    return sendJson(response, 200, { track: replacement });
  }

  return sendJson(response, 404, { error: "Route API introuvable." });
}

async function serveStatic(response, pathname) {
  const requestedPath = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const resolvedPath = path.resolve(publicDir, `.${requestedPath}`);
  if (!resolvedPath.startsWith(`${publicDir}${path.sep}`)) {
    response.writeHead(403);
    return response.end("Interdit");
  }
  try {
    const body = await readFile(resolvedPath);
    response.writeHead(200, {
      "content-type": mimeTypes[path.extname(resolvedPath)] ?? "application/octet-stream",
      "cache-control": ["index.html", "app.js", "app.css", "sw.js"].includes(path.basename(resolvedPath))
        ? "no-cache"
        : "public, max-age=3600"
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Fichier introuvable.");
  }
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  try {
    if (url.pathname.startsWith("/api/")) await handleApi(request, response, url);
    else if (request.method === "GET") await serveStatic(response, url.pathname);
    else sendJson(response, 405, { error: "Méthode non autorisée." });
  } catch (error) {
    sendJson(response, 502, {
      error: error instanceof SyntaxError ? "La requête reçue n’est pas un JSON valide." : error.message
    });
  }
});

const port = Number(process.env.PORT) || 4173;
server.listen(port, () => {
  console.log(`MelodyMasters disponible sur http://localhost:${port}`);
});
