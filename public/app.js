const app = document.querySelector('#app');
const dialog = document.querySelector('#dialog');
const dialogContent = document.querySelector('#dialog-content');
const toast = document.querySelector('#toast');
const helpIcon = `<svg class="help-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 19.25a7.75 7.75 0 1 1 5.2-2l.55 3.5-3.25-1.7a7.8 7.8 0 0 1-2.5.2Z"/><path d="M8.8 9.7a1.8 1.8 0 1 1 3.1 1.25c-.85.8-1.4 1.15-1.4 2.3"/><path d="M10.5 15.8h.01"/><path class="help-spark" d="m19 2 .65 1.8 1.85.7-1.85.7L19 7l-.65-1.8-1.85-.7 1.85-.7L19 2Z"/></svg>`;
const homeEqualizer = `<svg class="home-equalizer" viewBox="0 0 85 45" aria-hidden="true"><rect x="0" y="12.5" width="5" height="20" rx="2.5"/><rect x="10" y="8.5" width="5" height="28" rx="2.5"/><rect x="20" y="5" width="5" height="35" rx="2.5"/><rect x="30" y="8.5" width="5" height="28" rx="2.5"/><rect x="40" y="12.5" width="5" height="20" rx="2.5"/><rect x="50" y="5" width="5" height="35" rx="2.5"/><rect x="60" y="12.5" width="5" height="20" rx="2.5"/><rect x="70" y="8.5" width="5" height="28" rx="2.5"/><rect x="80" y="5" width="5" height="35" rx="2.5"/></svg>`;
const backIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5 4 11l6 6M4 11h9a6 6 0 0 1 0 12h-2"/></svg>`;
const brandMarkup = `<a class="wordmark" href="#" data-action="home" aria-label="MelodyMasters accueil"><span class="brand-mark">${homeEqualizer}</span> Melody<span>Masters</span></a>`;
const audio = new Audio();
audio.preload = 'auto';
audio.addEventListener('error', replaceUnavailableTrack);

const categoryInfo = {
	all: { label: 'Tous styles', short: 'MIX', icon: '✦' },
	pop: {
		label: 'Pop',
		short: 'POP',
		icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="2.5" width="8" height="13" rx="4"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3m-4 0h8"/></svg>`,
	},
	rap: {
		label: 'Rap & Hip-hop',
		short: 'RAP',
		icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="13" height="18" rx="2"/><circle cx="9.5" cy="9" r="3"/><circle cx="9.5" cy="16.5" r="2"/><path d="M19 8a5 5 0 0 1 0 8m2-11a9 9 0 0 1 0 14"/></svg>`,
	},
	rock: {
		label: 'Rock',
		short: 'ROCK',
		icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m19 2 3 3-2.5 2.5-3-3L19 2Z"/><path d="m17 6-5.5 5.5M12 11.5 10 10l-2 .8-1.8-.5-2.4 2.4.5 1.8-.8 2L5 19l2.5 1.5 2-.8 1.8.5 2.4-2.4-.5-1.8.8-2-2-2.5Z"/><path d="m7.5 15.5 2 2m1-4 2 2"/></svg>`,
	},
	metal: { label: 'Metal', short: 'METAL', icon: '♬' },
	chanson: {
		label: 'Chanson française',
		short: 'FR',
		icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2-3 5h6l-3-5Zm-2 5L5 22m9-15 5 15M8 12h8m-9 4h10M4 22h16"/></svg>`,
	},
	electro: {
		label: 'Dance & Électro',
		short: 'DANCE',
		icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v3M9 5h6"/><circle cx="12" cy="14" r="8"/><path d="m7 8 10 12M17 8 7 20M4 14h16M12 6v16"/></svg>`,
	},
	soul: {
		label: 'R&B & Soul',
		short: 'SOUL',
		icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 2h5v2h-2v9a5 5 0 0 1-5 5H8l-3 4H2l2.5-6a3 3 0 0 1 2.8-2H9V7H7V4h4"/><path d="M14 8h3m-3 3h3m-4 3h3"/></svg>`,
	},
	latino: {
		label: 'Latino',
		short: 'LATINO',
		icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 2C2 2 1 4 2 7c.8 2 2.8 3.8 4.5 5L10 8.5 8.2 4.5C7.4 2.7 6.2 2 5 2Zm11 0c-3 0-4 2-3 5 .8 2 2.8 3.8 4.5 5L21 8.5l-1.8-4C18.4 2.7 17.2 2 16 2Z"/><path d="m6.5 11-3 10m5-10 3 9m5.5-9-3 10m5-10 3 9"/><circle cx="5" cy="5" r=".7" fill="currentColor" stroke="none"/><circle cx="16" cy="5" r=".7" fill="currentColor" stroke="none"/></svg>`,
	},
};
const generationOptions = [
	['60', '60s'],
	['70', '70s'],
	['80', '80s'],
	['90', '90s'],
	['2000', '2000s'],
	['2010', '2010s'],
	['2020', '2020s'],
];
const reputationOptions = [
	['very-known', 'Très connus'],
	['known', 'Connus'],
	['less-known', 'Moins connus'],
];
const defaults = {
	clipLength: 20,
	repertoire: ['fr', 'international'],
	reputations: reputationOptions.map(([value]) => value),
	generations: generationOptions.map(([value]) => value),
	count: 50,
};

function createDefaultCriteria(category = null) {
	return {
		...defaults,
		category,
		repertoire: category === 'chanson' ? ['fr'] : [...defaults.repertoire],
		reputations: [...defaults.reputations],
		generations: [...defaults.generations],
	};
}

const state = {
	screen: 'home',
	criteria: createDefaultCriteria(),
	availability: 'checking',
	availabilityError: '',
	party: null,
	trackIndex: 0,
	timer: null,
	timerDeadline: 0,
	timerRemaining: 0,
	paused: false,
	backgroundPaused: false,
	connectionError: '',
	confirmationWasPlaying: false,
	confirmationWasPaused: false,
	quitDialogOpen: false,
	countdownTimeout: null,
	countdownActive: false,
	audioPrestarted: false,
	currentTrack: null,
	wakeLock: null,
	toastTimeout: null,
	availabilityRevision: 0,
};

function escapeHtml(value = '') {
	return String(value).replace(
		/[&<>"']/g,
		(character) =>
			({
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;',
			})[character],
	);
}

function selectedCategory() {
	return categoryInfo[state.criteria.category] ?? categoryInfo.all;
}

function formatDuration(seconds) {
	const minutes = Math.floor(seconds / 60);
	const remaining = seconds % 60;
	return minutes
		? `${minutes} min${remaining ? ` ${remaining} s` : ''}`
		: `${remaining} s`;
}

function estimateDuration() {
	return state.criteria.count * (Number(state.criteria.clipLength) + 10);
}

function selectedGenerationsLabel() {
	const allSelected =
		state.criteria.generations.length === generationOptions.length;
	if (allSelected) return 'Toutes les générations';
	return generationOptions
		.filter(([value]) => state.criteria.generations.includes(value))
		.map(([, label]) => label)
		.join(', ');
}

function button(label, action, kind = 'secondary', extra = '') {
	return `<button type="button" class="button ${kind} ${extra}" data-action="${action}">${label}</button>`;
}

function renderHome() {
	return `
    <section class="screen home-screen">
      <header class="topbar">${brandMarkup}<span class="top-note">LE BLIND TEST MUSICAL</span></header>
      <div class="hero">
        <h1>À vous de<br><span>reconnaître.</span></h1>
        <p class="hero-copy">Les premières notes suffiront-elles ? Choisissez votre univers, tendez l’oreille et laissez-vous surprendre.</p>
        ${button('Jouer', 'categories', 'primary', 'hero-button')}
        <button class="text-button" data-action="how">Comment ça marche ${helpIcon}</button>
        <div class="home-art" aria-hidden="true"><div class="record"><div class="record-label">MM</div></div><div class="spark spark-a">✦</div><div class="spark spark-b">♫</div>${homeEqualizer}</div>
        <div class="home-footnote"><span>◉</span> Jouez en solo, gratuitement et sans compte</div>
      </div>
      <footer class="site-footer"><span>Données et extraits fournis par Deezer</span><span><button class="footer-link" data-action="legal">Mentions légales</button><button class="footer-link" data-action="privacy">Confidentialité</button></span></footer>
    </section>`;
}

function renderCategories() {
	const cards = Object.entries(categoryInfo)
		.map(
			([key, category]) => `
    <button type="button" class="category-card ${key === 'all' ? 'wide' : ''}" data-action="category" data-category="${key}">
      <span class="category-icon">${category.icon}</span><span class="category-name">${category.label}</span>
    </button>`,
		)
		.join('');
	return `
    <section class="screen">
      <header class="topbar category-topbar">${brandMarkup}</header>
      <header class="page-head"><button class="back-button" data-action="home" aria-label="Retour à l’accueil">${backIcon}</button><div><span class="eyebrow">VOTRE SOIRÉE COMMENCE</span><h1>Choisissez votre <span>style.</span></h1></div></header>
      <p class="page-intro">Un univers musical pour commencer. Vous pourrez régler la partie juste après.</p>
      <div class="category-grid">${cards}</div>
      <div class="page-bottom">${button('Retour à l’accueil', 'home')}</div>
    </section>`;
}

function optionButtons(options, selected, group) {
	return options
		.map(
			([value, label]) => `
    <button type="button" class="chip ${selected.includes(value) ? 'selected' : ''}" aria-pressed="${selected.includes(value)}" data-action="toggle-option" data-group="${group}" data-value="${value}">
      ${label}
    </button>`,
		)
		.join('');
}

function renderCriteria() {
	const category = selectedCategory();
	const lockedFrench = state.criteria.category === 'chanson';
	const durationOptions = [10, 15, 20, 25]
		.map(
			(length) => `
    <button class="chip ${Number(state.criteria.clipLength) === length ? 'selected' : ''}" aria-pressed="${Number(state.criteria.clipLength) === length}" data-action="duration" data-value="${length}">${length} s</button>`,
		)
		.join('');
	const repertoire = lockedFrench
		? `
    <div class="chip-row centered-chips"><button class="chip selected" aria-pressed="true" disabled>Français</button></div>`
		: `
    <div class="chip-row centered-chips">
      ${[
				['fr', 'Français'],
				['international', 'International'],
			]
				.map(
					([value, label]) =>
						`<button class="chip ${state.criteria.repertoire.includes(value) ? 'selected' : ''}" aria-pressed="${state.criteria.repertoire.includes(value)}" data-action="repertoire" data-value="${value}">${label}</button>`,
				)
				.join('')}
    </div>`;
	const availability =
		state.availability === 'unavailable'
			? `<div class="notice error-notice" role="status"><span>!</span><div><strong>Ces critères sont trop restrictifs.</strong><p>Modifiez-les pour continuer : réduisez le nombre d’extraits ou ajoutez des générations.</p></div></div>`
			: state.availability === 'checking'
				? `<div class="availability subtle" role="status"><span class="equalizer loading-equalizer" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span> Vérification des titres en arrière-plan…</div>`
				: state.availabilityError
					? `<div class="notice error-notice" role="alert"><span>!</span><div><strong>Vérification impossible.</strong><p>${escapeHtml(state.availabilityError)}</p><button class="inline-action" data-action="retry-availability">Réessayer</button></div></div>`
					: `<div class="availability"><span class="availability-dot"></span> ${state.availability === 'tolerated' ? 'Sélection possible — artistes similaires parfois rapprochés' : 'Sélection disponible'}</div>`;
	return `
    <section class="screen">
      <header class="page-head"><button class="back-button" data-action="categories" aria-label="Retour aux catégories">${backIcon}</button><div><span class="eyebrow">VOTRE PARTIE, VOS RÈGLES</span><h1>Quelques <span>réglages.</span></h1></div></header>
      <div class="settings-actions"><button class="text-button theme-button" data-action="theme" aria-pressed="${document.body.classList.contains('light-theme')}">Changer de thème</button><button class="selected-category" data-action="categories"><span class="mini-icon">${category.icon}</span><span><small>VOTRE STYLE</small><strong>${category.label}</strong></span><span class="change-link">Changer de thème</span></button></div>
      <div class="settings-list">
        <section class="setting"><div class="setting-heading"><div><span class="setting-number">01</span><h2>Durée de l’extrait</h2></div></div><div class="chip-row centered-chips">${durationOptions}</div></section>
        <section class="setting"><div class="setting-heading"><div><span class="setting-number">02</span><h2>Répertoire</h2></div></div>${repertoire}</section>
        <section class="setting"><div class="setting-heading"><div><span class="setting-number">03</span><h2>Notoriété</h2><button class="info-button info-inline" data-action="info" data-topic="reputation" aria-label="Aide sur la notoriété">${helpIcon}</button></div></div><div class="chip-row wrap">${optionButtons(reputationOptions, state.criteria.reputations, 'reputations')}</div></section>
        <section class="setting"><div class="setting-heading"><div><span class="setting-number">04</span><h2>Générations</h2></div></div><div class="chip-row wrap centered-chips">${optionButtons(generationOptions, state.criteria.generations, 'generations')}</div></section>
        <section class="setting count-setting"><div class="setting-heading"><div><span class="setting-number">05</span><h2>Nombre d’extraits</h2></div><span class="setting-hint">Par pas de 10</span></div><div class="stepper"><button class="step-button" data-action="count" data-delta="-10" aria-label="Retirer 10 extraits" ${state.criteria.count <= 10 ? 'disabled' : ''}>−</button><strong>${state.criteria.count}</strong><span>extraits</span><button class="step-button" data-action="count" data-delta="10" aria-label="Ajouter 10 extraits" ${state.criteria.count >= 100 ? 'disabled' : ''}>+</button></div><div class="count-limits"><span>Minimum : 10</span><span>Maximum : 100</span></div></section>
      </div>
      <div class="estimate-card"><span class="estimate-icon">◷</span><span>Votre partie dure environ</span><strong>${formatDuration(estimateDuration())}</strong></div>
      ${availability}
      <div class="button-stack">${button('Lancer la partie', 'launch', 'primary')}${button('Retour aux catégories', 'categories')}</div>
    </section>`;
}

function renderStart() {
	const category = selectedCategory();
	const pending = state.preparing;
	return `
    <section class="screen centered-screen">
      <button class="back-button standalone-back" data-action="criteria" aria-label="Retour aux critères">${backIcon}</button>
      <span class="eyebrow">C’EST BIENTÔT À VOUS</span><h1>La partie <span>commence.</span></h1>
      <div class="summary-card">
        <div class="summary-visual"><div class="equalizer summary-equalizer" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
        <div class="summary-row"><span>Style</span><strong>${category.label}</strong></div>
        <div class="summary-row"><span>Générations</span><strong>${escapeHtml(selectedGenerationsLabel())}</strong></div>
        <div class="summary-row"><span>Extraits</span><strong>${state.criteria.count}</strong></div>
        <div class="summary-row"><span>Durée des extraits</span><strong>${state.criteria.clipLength} secondes</strong></div>
      </div>
      ${pending ? `<div class="availability" role="status"><span class="equalizer loading-equalizer" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span> Préparation de la partie…</div>` : state.prepareError ? `<div class="notice error-notice" role="alert"><span>!</span><div><strong>Préparation impossible.</strong><p>${escapeHtml(state.prepareError)}</p></div></div>` : ''}
      <div class="button-stack start-actions"><p class="page-intro centered center-note">Appuyer sur démarrer et activer le son.</p>${button(pending ? 'Préparation…' : state.prepareError ? 'Réessayer' : 'Démarrer', 'start-game', 'primary', pending ? 'disabled' : '')}${button('Modifier les critères', 'criteria')}</div>
    </section>`;
}

function progressMarkup() {
	const total = state.party?.tracks.length ?? state.criteria.count;
	const value = Math.min(state.trackIndex + 1, total);
	return `<div class="progress-head"><span class="progress-label">Extrait ${value} sur ${total}</span><div class="progress-track" role="progressbar" aria-label="Progression des extraits" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${value}"><span style="width:${Math.round((value / total) * 100)}%"></span></div><button class="icon-button exit-button" data-action="quit" aria-label="Quitter la partie">×</button></div>`;
}

function renderListen() {
	const seconds = Math.max(0, Math.ceil(state.timerRemaining / 1000));
	return `
    <section class="screen game-screen">
      ${progressMarkup()}
      <div class="game-stage">
        <div class="listen-equalizer equalizer ${state.paused ? '' : 'loading-equalizer'}" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <span class="eyebrow">${state.paused ? 'EN PAUSE' : 'ÉCOUTEZ BIEN'}</span>
        <div class="countdown" role="timer" aria-live="off">${String(seconds).padStart(2, '0')}<small>s</small></div>
        <p class="subtle">${state.paused ? 'Le son et le décompte sont en pause.' : 'Le titre sera révélé à la fin de l’extrait.'}</p>
        ${state.connectionError ? `<div class="notice error-notice connection-notice" role="alert"><span>!</span><div><strong>Connexion perdue</strong><p>${escapeHtml(state.connectionError)}</p><button class="inline-action" data-action="retry-current">Reprendre</button></div></div>` : ''}
      </div>
      <div class="button-stack game-controls">${button(state.paused ? 'Reprendre' : 'Pause', 'pause', 'secondary')}${button('Passer à la réponse', 'reveal', 'primary')}</div>
    </section>`;
}

function renderAnswer() {
	const track = state.currentTrack ?? {};
	const seconds = Math.max(0, Math.ceil(state.timerRemaining / 1000));
	const contributors =
		track.contributors?.filter((name) => name && name !== track.artist) ?? [];
	const artistLine = [track.artist, ...contributors].join(' feat. ');
	const albumImage = track.cover
		? `<img src="${escapeHtml(track.cover)}" alt="Pochette de l’album ${escapeHtml(track.album)}" referrerpolicy="no-referrer">`
		: `<div class="cover-placeholder" role="img" aria-label="Pochette indisponible">♫</div>`;
	return `
    <section class="screen game-screen answer-screen">
      ${progressMarkup()}
      <div class="answer-content">
        <span class="eyebrow">AVIEZ-VOUS TROUVÉ ?</span>
        <div class="album-cover">${albumImage}</div>
        <div class="track-metadata" aria-live="polite"><h1 title="${escapeHtml(track.title)}">${escapeHtml(track.title)}</h1><p title="${escapeHtml(artistLine)}">${escapeHtml(artistLine)}</p><span>${escapeHtml(track.album)} · ${escapeHtml(track.year)}</span></div>
        <div class="answer-timer ${state.trackIndex === (state.party?.tracks.length ?? 0) - 1 ? 'final-timer' : ''}">${state.trackIndex < (state.party?.tracks.length ?? 0) - 1 ? '<span>Prochain extrait dans</span>' : ''}<strong>${seconds}<small>s</small></strong></div>
      </div>
      <div class="button-stack game-controls">${button(state.trackIndex === (state.party?.tracks.length ?? 0) - 1 ? 'Voir les résultats' : 'Suivant', 'next', 'primary')}</div>
    </section>`;
}

function renderDone() {
	return `
    <section class="screen centered-screen done-screen">
      <span class="eyebrow">BRAVO, C’EST DANS LA BOÎTE</span>
      <h1>Partie <span>terminée.</span></h1><p class="page-intro centered">La musique n’attend que vous pour une nouvelle manche.</p>
      <div class="summary-card done-summary">
        <div class="summary-row"><span>Style</span><strong>${selectedCategory().label}</strong></div>
        <div class="summary-row"><span>Extraits écoutés</span><strong>${state.party?.tracks.length ?? state.criteria.count}</strong></div>
        <div class="summary-row"><span>Générations</span><strong>${escapeHtml(selectedGenerationsLabel())}</strong></div>
      </div>
      <div class="button-stack">${button('Rejouer', 'replay', 'primary')}${button('Changer de catégorie', 'categories')}</div>
    </section>`;
}

function render() {
	const screens = {
		home: renderHome,
		categories: renderCategories,
		criteria: renderCriteria,
		start: renderStart,
		countdown: renderCountdown,
		'connection-lost': renderConnectionLost,
		listen: renderListen,
		answer: renderAnswer,
		done: renderDone,
	};
	app.innerHTML = (screens[state.screen] ?? renderHome)();
	if (state.backgroundPaused) showBackgroundPause();
}

async function api(path, body) {
	const response = await fetch(path, {
		method: body === undefined ? 'GET' : 'POST',
		headers: body === undefined ? {} : { 'content-type': 'application/json' },
		body: body === undefined ? undefined : JSON.stringify(body),
	});
	const payload = await response.json();
	if (!response.ok)
		throw new Error(payload.error || `Erreur serveur (${response.status}).`);
	return payload;
}

function criteriaPayload() {
	return {
		category: state.criteria.category,
		clipLength: Number(state.criteria.clipLength),
		repertoire: [...state.criteria.repertoire],
		reputations: state.criteria.reputations,
		generations: state.criteria.generations,
		count: Number(state.criteria.count),
	};
}

let availabilityTimer;
async function refreshAvailability() {
	window.clearTimeout(availabilityTimer);
	const revision = ++state.availabilityRevision;
	state.availability = 'checking';
	state.availabilityError = '';
	render();
	availabilityTimer = window.setTimeout(async () => {
		try {
			const result = await api('/api/availability', criteriaPayload());
			if (revision === state.availabilityRevision)
				state.availability = result.status;
		} catch (error) {
			if (revision === state.availabilityRevision) {
				state.availability = 'error';
				state.availabilityError = error.message;
			}
		} finally {
			if (
				revision === state.availabilityRevision &&
				state.screen === 'criteria'
			)
				render();
		}
	}, 250);
}

async function prepareParty() {
	state.preparing = true;
	state.prepareError = '';
	state.party = null;
	render();
	try {
		state.party = await api('/api/party', criteriaPayload());
		state.party.tracks[0].preview = state.party.firstPreview;
		delete state.party.firstPreview;
	} catch (error) {
		state.prepareError = error.message;
	} finally {
		state.preparing = false;
		if (state.screen === 'start') render();
	}
}

function goToCriteria(category = state.criteria.category) {
	state.criteria = createDefaultCriteria(category);
	state.screen = 'criteria';
	refreshAvailability();
}

function openDialog(title, text, actions = '') {
	dialogContent.innerHTML = `<span class="eyebrow">MELODYMASTERS</span><h2>${escapeHtml(title)}</h2><p>${text}</p>${actions}`;
	if (!dialog.open) dialog.showModal();
}

function showToast(message) {
	toast.textContent = message;
	toast.classList.add('visible');
	window.clearTimeout(state.toastTimeout);
	state.toastTimeout = window.setTimeout(
		() => toast.classList.remove('visible'),
		2800,
	);
}

function stopTimer() {
	window.clearInterval(state.timer);
	state.timer = null;
}

function updateTimerDisplay() {
	const timerDisplay = document.querySelector(
		state.screen === 'listen' ? '.countdown' : '.answer-timer strong',
	);
	const value = timerDisplay?.firstChild;
	if (!value || value.nodeType !== Node.TEXT_NODE) return;
	const seconds = Math.max(0, Math.ceil(state.timerRemaining / 1000));
	value.textContent =
		state.screen === 'listen'
			? String(seconds).padStart(2, '0')
			: String(seconds);
}

function startTimer(milliseconds, onComplete) {
	stopTimer();
	state.timerRemaining = milliseconds;
	state.timerDeadline = Date.now() + milliseconds;
	state.timer = window.setInterval(() => {
		if (state.paused || state.backgroundPaused) return;
		state.timerRemaining = Math.max(0, state.timerDeadline - Date.now());
		const previousSecond = Math.ceil((state.timerRemaining + 100) / 1000);
		const currentSecond = Math.ceil(state.timerRemaining / 1000);
		if (previousSecond !== currentSecond || state.timerRemaining === 0) {
			updateTimerDisplay();
		}
		if (state.timerRemaining <= 0) {
			stopTimer();
			onComplete();
		}
	}, 100);
}

function freezeTimer() {
	if (!state.timer) return;
	state.timerRemaining = Math.max(0, state.timerDeadline - Date.now());
}

async function continueAfterQuitDialog() {
	const shouldResumeAudio = state.confirmationWasPlaying;
	state.quitDialogOpen = false;
	state.paused = state.confirmationWasPaused;
	if (shouldResumeAudio) {
		try {
			await audio.play();
			state.paused = false;
			state.timerDeadline = Date.now() + state.timerRemaining;
		} catch (error) {
			state.paused = true;
			showToast(`Reprise audio impossible : ${error.message}`);
		}
	}
	state.confirmationWasPlaying = false;
	state.confirmationWasPaused = false;
	if (['listen', 'answer'].includes(state.screen)) render();
}

async function requestWakeLock() {
	if (!('wakeLock' in navigator)) return;
	try {
		state.wakeLock = await navigator.wakeLock.request('screen');
	} catch {
		showToast(
			'Le maintien de l’écran allumé n’est pas disponible sur cet appareil.',
		);
	}
}

function beginCountdown() {
	state.countdown = 3;
	state.countdownActive = true;
	state.screen = 'countdown';
	render();
	const tick = () => {
		if (state.screen !== 'countdown' || !state.countdownActive) return;
		state.countdown -= 1;
		if (state.countdown <= 0) {
			state.countdownActive = false;
			startTrack();
			return;
		}
		render();
		state.countdownTimeout = window.setTimeout(tick, 1000);
	};
	state.countdownTimeout = window.setTimeout(tick, 1000);
}

function renderCountdown() {
	return `
    <section class="screen centered-screen countdown-screen">
      <span class="eyebrow">LA PARTIE COMMENCE DANS</span>
      <strong class="countdown-number" aria-live="assertive">${state.countdown}</strong>
      <p class="page-intro centered">Préparez-vous à écouter.</p>
    </section>`;
}

function startTrack() {
	if (!state.party?.tracks?.length) {
		state.prepareError = 'La sélection de titres n’est pas prête. Réessayez.';
		render();
		return;
	}
	state.screen = 'listen';
	state.trackIndex = 0;
	state.paused = false;
	state.backgroundPaused = false;
	state.currentTrack = state.party.tracks[0];
	if (audio.src !== state.currentTrack.preview)
		audio.src = state.currentTrack.preview;
	audio.currentTime = 0;
	audio.muted = false;
	audio.volume = 1;
	if (!state.audioPrestarted || audio.paused) {
		audio
			.play()
			.catch((error) => showToast(`Lecture impossible : ${error.message}`));
	}
	state.audioPrestarted = false;
	render();
	startTimer(Number(state.criteria.clipLength) * 1000, revealAnswer);
}

function revealAnswer() {
	if (state.screen !== 'listen') return;
	state.screen = 'answer';
	state.paused = false;
	render();
	startTimer(8000, goNext);
}

function goNext() {
	if (state.screen !== 'answer') return;
	stopTimer();
	if (state.trackIndex + 1 >= state.party.tracks.length) {
		finishGame();
		return;
	}
	state.screen = 'transition';
	state.trackIndex += 1;
	renderTransition();
	window.setTimeout(() => {
		if (state.screen !== 'transition') return;
		loadNextTrack();
	}, 2000);
}

async function loadNextTrack() {
	const index = state.trackIndex;
	try {
		const result = await api(`/api/party/${state.party.id}/track/${index}`);
		if (!['transition', 'connection-lost'].includes(state.screen)) return;
		state.party.tracks[index].preview = result.preview;
	} catch (error) {
		if (!['transition', 'connection-lost'].includes(state.screen)) return;
		try {
			const replacement = await api(
				`/api/party/${state.party.id}/replacement`,
				{},
			);
			if (!['transition', 'connection-lost'].includes(state.screen)) return;
			state.party.tracks[index] = replacement.track;
		} catch (replacementError) {
			state.screen = 'connection-lost';
			state.connectionError = replacementError.message || error.message;
			renderConnectionLost();
			return;
		}
	}
	state.connectionError = '';
	state.currentTrack = state.party.tracks[index];
	audio.src = state.currentTrack.preview;
	audio.currentTime = 0;
	state.screen = 'listen';
	render();
	audio
		.play()
		.catch((error) => showToast(`Lecture impossible : ${error.message}`));
	startTimer(Number(state.criteria.clipLength) * 1000, revealAnswer);
}

function renderTransition() {
	app.innerHTML = `<section class="screen centered-screen transition-screen"><div class="record small-record"><div class="record-label">MM</div></div><span class="eyebrow">PRÉPAREZ-VOUS !</span><h1>Extrait <span>${state.trackIndex + 1}</span></h1><div class="equalizer loading-equalizer" aria-label="Chargement"><i></i><i></i><i></i><i></i><i></i></div></section>`;
}

function renderConnectionLost() {
	app.innerHTML = `<section class="screen centered-screen connection-screen">${progressMarkup()}<div class="connection-card"><span class="eyebrow">CONNEXION NÉCESSAIRE</span><h1>Connexion <span>perdue.</span></h1><p>${escapeHtml(state.connectionError || 'La connexion à Deezer a été interrompue.')}</p>${button('Reprendre', 'retry-track', 'primary')}</div></section>`;
}

function finishGame() {
	stopTimer();
	audio.pause();
	state.screen = 'done';
	state.paused = false;
	state.wakeLock?.release().catch(() => {});
	state.wakeLock = null;
	render();
}

async function replaceUnavailableTrack() {
	if (!['listen', 'answer'].includes(state.screen) || !state.party?.id) return;
	try {
		const result = await api(`/api/party/${state.party.id}/replacement`, {});
		const replacement = result.track;
		if (state.screen === 'listen' || state.screen === 'answer') {
			state.party.tracks[state.trackIndex] = replacement;
			state.currentTrack = replacement;
			const wasPlaying = !state.paused && !state.backgroundPaused;
			audio.src = replacement.preview;
			if (wasPlaying) await audio.play();
			state.connectionError = '';
			if (state.timer) state.timerDeadline = Date.now() + state.timerRemaining;
			if (state.screen === 'answer') render();
		}
	} catch (error) {
		freezeTimer();
		state.connectionError = error.message;
		state.paused = true;
		audio.pause();
		render();
	}
}

function showBackgroundPause() {
	if (document.querySelector('.background-overlay')) return;
	const overlay = document.createElement('div');
	overlay.className = 'background-overlay';
	overlay.innerHTML = `<div class="pause-card"><span class="eyebrow">PARTIE EN PAUSE</span><h2>On reprend ?</h2><p>Votre progression est conservée.</p><button type="button" class="button primary" data-action="resume-background">Reprendre</button></div>`;
	document.body.append(overlay);
}

function changeMultiSelection(group, value) {
	const current = state.criteria[group];
	const options =
		group === 'generations' ? generationOptions : reputationOptions;
	if (current.length === 1 && current.includes(value)) {
		showToast(
			group === 'generations'
				? 'Gardez au moins une génération.'
				: 'Gardez au moins un niveau de notoriété.',
		);
		return;
	}
	if (current.length === options.length && current.includes(value)) {
		state.criteria[group] = [value];
	} else {
		state.criteria[group] = current.includes(value)
			? current.filter((item) => item !== value)
			: [...current, value];
	}
	refreshAvailability();
}

function toggleRepertoire(value) {
	if (
		state.criteria.repertoire.length === 1 &&
		state.criteria.repertoire.includes(value)
	) {
		showToast('Sélectionnez au moins un répertoire.');
		return;
	}
	state.criteria.repertoire = state.criteria.repertoire.includes(value)
		? state.criteria.repertoire.filter((item) => item !== value)
		: [...state.criteria.repertoire, value];
	refreshAvailability();
}

function showHelp(topic) {
	if (topic !== 'reputation') return;
	openDialog(
		'Notoriété',
		'Les niveaux sont estimés à partir du classement de popularité Deezer. Le mélange reste aléatoire.',
	);
}

document.addEventListener('click', async (event) => {
	const target = event.target.closest('[data-action]');
	if (!target || target.disabled) return;
	const action = target.dataset.action;
	if (action === 'home') {
		state.screen = 'home';
		render();
	} else if (action === 'categories') {
		state.screen = 'categories';
		render();
	} else if (action === 'category') {
		goToCriteria(target.dataset.category);
	} else if (action === 'criteria') {
		state.screen = 'criteria';
		refreshAvailability();
	} else if (action === 'launch') {
		state.screen = 'start';
		render();
		prepareParty();
	} else if (action === 'toggle-option') {
		changeMultiSelection(target.dataset.group, target.dataset.value);
	} else if (action === 'duration') {
		state.criteria.clipLength = Number(target.dataset.value);
		refreshAvailability();
	} else if (action === 'repertoire') {
		toggleRepertoire(target.dataset.value);
	} else if (action === 'theme') {
		document.body.classList.toggle('light-theme');
		target.setAttribute(
			'aria-pressed',
			String(document.body.classList.contains('light-theme')),
		);
	} else if (action === 'count') {
		state.criteria.count = Math.max(
			10,
			Math.min(100, state.criteria.count + Number(target.dataset.delta)),
		);
		refreshAvailability();
	} else if (action === 'retry-availability') {
		refreshAvailability();
	} else if (action === 'info') {
		showHelp(target.dataset.topic);
	} else if (action === 'how') {
		openDialog(
			'Comment ça marche ?',
			'Choisissez un style musical et quelques critères. Écoutez chaque extrait sans indice, puis découvrez le titre, l’artiste et l’album. Pas de compte, pas de score : juste le plaisir de jouer.',
		);
	} else if (action === 'legal' || action === 'privacy') {
		openDialog(
			action === 'legal' ? 'Mentions légales' : 'Confidentialité',
			'Le contenu juridique de cette page reste à renseigner avant toute mise en ligne publique.',
		);
	} else if (action === 'start-game') {
		if (state.preparing) return;
		if (!state.party) {
			prepareParty();
			return;
		}
		audio.src = state.party.tracks[0].preview;
		audio.currentTime = 0;
		audio.muted = true;
		state.audioPrestarted = true;
		audio.play().catch((error) => {
			state.audioPrestarted = false;
			showToast(`Activation audio impossible : ${error.message}`);
		});
		requestWakeLock();
		beginCountdown();
	} else if (action === 'pause') {
		if (!state.paused) {
			freezeTimer();
			state.paused = true;
			audio.pause();
			render();
		} else {
			try {
				await audio.play();
				state.paused = false;
				state.timerDeadline = Date.now() + state.timerRemaining;
				render();
			} catch (error) {
				showToast(`Reprise audio impossible : ${error.message}`);
			}
		}
	} else if (action === 'reveal') {
		revealAnswer();
	} else if (action === 'next') {
		goNext();
	} else if (action === 'retry-track') {
		state.connectionError = '';
		state.screen = 'transition';
		renderTransition();
		loadNextTrack();
	} else if (action === 'retry-current') {
		state.paused = false;
		await replaceUnavailableTrack();
	} else if (action === 'quit') {
		freezeTimer();
		state.confirmationWasPlaying =
			!audio.paused && !state.paused && !state.backgroundPaused;
		state.confirmationWasPaused = state.paused;
		state.paused = true;
		state.quitDialogOpen = true;
		audio.pause();
		openDialog(
			'Quitter la partie ?',
			'Votre progression sera perdue.',
			`<div class="dialog-actions"><button type="button" class="button secondary" data-action="stay">Continuer</button><button type="button" class="button danger" data-action="confirm-quit">Quitter</button></div>`,
		);
	} else if (action === 'stay') {
		state.quitDialogOpen = false;
		dialog.close();
		await continueAfterQuitDialog();
	} else if (action === 'confirm-quit') {
		state.quitDialogOpen = false;
		dialog.close();
		stopTimer();
		window.clearTimeout(state.countdownTimeout);
		state.countdownActive = false;
		audio.pause();
		state.paused = false;
		state.backgroundPaused = false;
		state.party = null;
		state.screen = 'categories';
		state.wakeLock?.release().catch(() => {});
		state.wakeLock = null;
		render();
	} else if (action === 'replay') {
		state.criteria = createDefaultCriteria(state.criteria.category);
		state.availability = 'checking';
		state.availabilityError = '';
		state.screen = 'start';
		render();
		prepareParty();
	} else if (action === 'resume-background') {
		try {
			await audio.play();
			state.backgroundPaused = false;
			state.timerDeadline = Date.now() + state.timerRemaining;
			document.querySelector('.background-overlay')?.remove();
			if (state.screen === 'listen') render();
		} catch (error) {
			showToast(`Reprise audio impossible : ${error.message}`);
		}
	}
});

document.addEventListener('visibilitychange', () => {
	if (document.hidden && ['listen', 'answer'].includes(state.screen)) {
		freezeTimer();
		state.backgroundPaused = true;
		audio.pause();
		showBackgroundPause();
	}
});

dialog.addEventListener('click', (event) => {
	if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
	if (state.quitDialogOpen) continueAfterQuitDialog();
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
	navigator.serviceWorker
		.register('/sw.js')
		.catch((error) =>
			console.error('Service worker registration failed:', error),
		);
}

render();
