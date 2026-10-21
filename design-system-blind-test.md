# Blind Test · Design system « Disco néon »

Version MVP · Interface sombre uniquement · Smartphone (390 px) à TV (1280 px et plus)

## 1. Principes

- **Vivant** : fond aubergine nuit, halos discrets, boule disco.
- **Universel** : même composition du smartphone à la TV, sans compte.
- **Inclusif** : contrastes AA, sélection jamais signalée par la couleur seule, pause sur le décompte automatique.
- **Une couleur = un rôle** :
  - **Soleil** : action principale.
  - **Magenta** : identité, titres, ondes sonores.
  - **Cyan** : temps, progression, sélection.
  - **Crème** : texte.

## 2. Couleurs

### 2.1 Marque (3 nuances : clair, base, sombre)

| Rôle | Clair | Base | Sombre |
|---|---|---|---|
| Soleil | `#FFE29A` | `#FFBF3F` | `#D99A12` |
| Magenta | `#FF9BEF` | `#FF3CE0` | `#C41FAB` |
| Cyan | `#8FF7FF` | `#2EF2FF` | `#12B5C2` |

La nuance sombre sert aux états pressés.

### 2.2 Neutres et surfaces

| Jeton | Valeur | Usage |
|---|---|---|
| `nuit/900` | `#12071A` | Bas du dégradé de fond |
| `nuit/700` | `#1A0B24` | Fond principal |
| `violet/600` | `#2E1450` | Haut du dégradé de fond |
| `surface` | blanc 6 % | Cartes, boutons secondaires |
| `surface/hover` | blanc 10 % | Survol |
| `surface/actif` | blanc 16 % | Appui |
| `bordure` | `#C9B6DB` à 55 % | Bordures des éléments interactifs |

Le fond de page est un dégradé à 165° : `#2E1450` → `#1A0B24` (55 %) → `#12071A`.

### 2.3 Texte

| Jeton | Valeur | Usage |
|---|---|---|
| `texte` | `#FFF6F1` | Texte principal |
| `texte/doux` | `#C9B6DB` | Texte secondaire |
| `texte/off` | `#9885B0` | Désactivé |
| `sur-soleil` | `#1A0B24` | Texte sur fond Soleil plein |

### 2.4 États

| État | Valeur |
|---|---|
| Succès | `#5DE6A8` |
| Erreur | `#FF6B7A` |
| Alerte | `#FF9A4D` |
| Info | = Cyan |

Les états ont leurs propres teintes, jamais celles des rôles de marque.

### 2.5 Halos

Deux ombres, uniquement magenta ou cyan, jamais en aplat :

```css
--halo-magenta: 0 0 6px #FF3CE059, 0 0 18px #FF3CE026;
--halo-cyan:    0 0 6px #2EF2FF59, 0 0 18px #2EF2FF26;
--halo-texte-magenta: 0 0 6px #FF3CE066, 0 0 18px #FF3CE033;
```

## 3. Typographie

| Usage | Police | Graisse |
|---|---|---|
| Titres et chiffres (dont le compte à rebours) | **Ultra** | 400 |
| Texte, boutons, tableaux | **Outfit** | 400 / 500 / 600 |

- Corps : 16 px minimum sur mobile, 24 px sur TV.
- Surtitres (eyebrow) : 16 px, 600, majuscules, espacement 0,14 em, `texte/doux`.
- Titres de page : Ultra 40 px (mobile), première ligne crème, seconde ligne magenta avec halo.
- Titre d'accueil : Ultra 80 px. Compte à rebours : Ultra 104 px (mobile), 150 px (TV).
- Solution de repli : `Ultra, serif` et `Outfit, sans-serif`.

## 4. Formes et espacements

- Rayon des cartes : **24 px**. Boutons et options : **999 px** (pilule).
- Zone tactile : **44 px minimum**. Bouton principal : **56 px** de haut.
- Marges de page : 24 px (mobile), 48 px (TV). Espacement entre blocs : 20 px.
- Grille des catégories : 2 colonnes, 14 px d'écart, cartes de 120 px minimum.

## 5. Composants

### Boutons

| Variante | Fond | Bordure | Texte |
|---|---|---|---|
| Primaire | Soleil à 14 % | 1,5 px Soleil | Soleil, 600 |
| Secondaire | `surface` | 1,5 px `bordure` | Crème, 600 |
| Compact (« Accueil », « Catégories », « Pause ») | `surface` | 1,5 px `bordure` | Crème, 600, 44 px de haut |

Tous les boutons partagent la même hauteur, le même rayon et le même voile. Pas de halo sur les boutons.

### Option (chip)

- Repos : bordure `bordure`, texte crème, 44 px de haut.
- Sélectionnée : bordure et texte Cyan, **coche** avant le texte, `halo-cyan`.
- Attribut `aria-pressed` à `true` ou `false`.

### Carte de catégorie

- Toutes les cartes sont identiques : fond `surface`, bordure 1,5 px `bordure`, rayon 24 px.
- Contenu : pastille crème en haut (80S, FR, RAP…), nom en Ultra 20 px en bas.
- Sélectionnée : bordure Magenta, `halo-magenta`, pastille Magenta avec coche.

### Barre de progression

- Piste : blanc 35 %, 8 px, arrondie.
- Remplissage : dégradé 90° Magenta → Cyan.
- `role="progressbar"` avec `aria-valuenow`.

### Anneau de compte à rebours

- Cercle avec bordure Cyan (épaisseur = diamètre ÷ 28, minimum 6 px), `halo-cyan` et lueur intérieure légère.
- Chiffre en Ultra Cyan. Tailles : 180 px (départ), 240 px (écoute mobile), 320 px (écoute TV), 96 px (compteur de réponse).
- `role="timer"` et `aria-live="off"`.

### Ondes sonores

- 11 barres Magenta, 8 px de large, hauteurs variables, `halo-magenta`. Décoratives : `aria-hidden="true"`.

### Pochette

- Carré de rapport 1:1, rayon 24 px, `halo-magenta`. Emplacement dégradé Magenta → violet → Cyan jusqu'à la connexion à Spotify.
- `role="img"` avec description.

### Tableau récapitulatif

- Colonnes : `#` (Cyan), Titre avec artiste en dessous, Année alignée à droite.
- Lignes séparées par un filet `bordure` à 18 %. Zone défilante, hauteur maximale 470 px.

## 6. Écrans de l'MVP

1. **Accueil** : surtitre, titre « Blind Test », phrase d'accroche, bouton « Jouer », mention « Sans compte ».
2. **Catégories** (étape 1 / 2) : 8 cartes identiques, bouton « Accueil ».
3. **Règles** (étape 2 / 2) : durée (5, 10, 20, 30 s), nombre d'extraits (5, 10, 15, 20), temporalité (Toutes, 60-70, 80-90, 2000+, Récent), difficulté (Très connu, Connu, Moins connu, Mélange), langue (Français, International, Mixte). Boutons « Lancer la partie » et « Retour aux catégories ».
4. **Départ** : récapitulatif de la partie, anneau 3-2-1.
5. **Écoute** : « Extrait 3 / 10 », barre de progression, ondes, décompte en secondes, bouton « Passer à la réponse », bouton « Catégories ».
6. **Réponse** : pochette, titre, artiste, album et année, extrait diffusé environ 5 s de plus, minuteur « Extrait suivant dans… », boutons « Pause » et « Extrait suivant ».
7. **Fin de partie** : tableau des extraits, boutons « Rejouer » et « Choisir une catégorie ».

Versions TV (1280 × 720) pour l'écoute et la réponse : même composition, texte à 24 px minimum.

## 7. Accessibilité

Contrastes calculés sur le fond `nuit/700` (niveau AA : 4,5 : 1 pour le texte, 3 : 1 pour les bordures et les pistes) :

| Élément | Ratio |
|---|---|
| Texte | 17,6 : 1 |
| Texte doux | 10 : 1 |
| Soleil | 11,4 : 1 |
| Magenta | 6,2 : 1 |
| Cyan | 13,7 : 1 |
| Erreur | 6,8 : 1 |
| Bordures | 3,8 : 1 |
| Piste de progression | 3,2 : 1 |

Règles :
- La sélection n'est jamais signalée par la couleur seule : coche et bord.
- Focus clavier visible : contour crème de 3 px, décalé de 3 px.
- Le décompte automatique de la réponse peut être mis en pause.
- Le décompte n'est pas annoncé seconde par seconde. Seuls le titre révélé et « Extrait suivant » le sont (`aria-live="polite"`).
- Halos et ondes figés si l'utilisateur demande de réduire les animations.
- Le magenta sur surface violette (4,5 : 1) est réservé aux titres de 24 px et plus.
- À prévoir en V2 : un mode visuel pour les personnes sourdes ou malentendantes.

## 8. Variables CSS de départ

```css
:root {
  --nuit-900: #12071A;
  --nuit-700: #1A0B24;
  --violet-600: #2E1450;

  --soleil: #FFBF3F;  --soleil-clair: #FFE29A;  --soleil-sombre: #D99A12;
  --magenta: #FF3CE0; --magenta-clair: #FF9BEF; --magenta-sombre: #C41FAB;
  --cyan: #2EF2FF;    --cyan-clair: #8FF7FF;    --cyan-sombre: #12B5C2;

  --texte: #FFF6F1;
  --texte-doux: #C9B6DB;
  --texte-off: #9885B0;
  --sur-soleil: #1A0B24;

  --surface: rgba(255,255,255,.06);
  --surface-hover: rgba(255,255,255,.10);
  --surface-actif: rgba(255,255,255,.16);
  --bordure: rgba(201,182,219,.55);

  --succes: #5DE6A8;
  --erreur: #FF6B7A;
  --alerte: #FF9A4D;

  --halo-magenta: 0 0 6px #FF3CE059, 0 0 18px #FF3CE026;
  --halo-cyan: 0 0 6px #2EF2FF59, 0 0 18px #2EF2FF26;

  --rayon-carte: 24px;
  --rayon-pilule: 999px;
  --cible-min: 44px;

  --font-titre: Ultra, serif;
  --font-texte: Outfit, sans-serif;
}

body {
  background: linear-gradient(165deg, var(--violet-600) 0%, var(--nuit-700) 55%, var(--nuit-900) 100%);
  color: var(--texte);
  font-family: var(--font-texte);
  font-size: 16px;
}

button:focus-visible { outline: 3px solid var(--texte); outline-offset: 3px; }

@media (min-width: 1280px) { body { font-size: 24px; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
```
