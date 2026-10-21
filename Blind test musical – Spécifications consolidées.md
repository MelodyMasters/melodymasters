# Blind test musical – Spécifications consolidées (V0 → V3)

Version consolidée du 15 octobre 2026 · Public francophone · V0 : mobile, portrait · Nom du jeu et ton éditorial : à définir

## 1. Vision et périmètre

Jeu de blind test musical jouable sur un seul écran. Le joueur choisit un style, règle quelques critères, puis écoute des extraits sans aucune information. La réponse (titre, artiste, album, année, pochette) s'affiche ensuite pendant que la musique continue quelques secondes.

**Principes**

- Aucun compte, aucun score, aucune publicité en V0.
- Le contenu musical vient au maximum de l'API Deezer, sans base de titres saisie à la main.
- V0 : mobile uniquement, orientation portrait. Les autres formats seront traités après les tests utilisateurs.
- Public visé en priorité : francophone.
- Diffusion sur TV : le joueur diffuse son téléphone ou son ordinateur (Chromecast, AirPlay, HDMI). Aucune application ni navigation à la télécommande dans la TV.

## 2. Feuille de route

| Version | Contenu |
| --- | --- |
| **V0 (MVP)** | Accueil, catégories, critères, écran de lancement, écoute, réponse, fin de partie. Solo, sans compte |
| **V2** | Jeu à plusieurs sur un seul écran (joueurs ou équipes), point culture, récapitulatif de fin de partie, vibration d'avertissement, 4 catégories supplémentaires |
| **V3** | Comptes, favoris, export vers les plateformes de streaming, backoffice contributeurs, catégories spéciales |
| **Plus tard** | Multi-appareils par code de partie, smartphone en manette, bouton « Signaler », autres langues, décennies antérieures, paysage et grands écrans |

## 3. Parcours et écrans V0

Parcours : Accueil → Catégories → Critères → « La partie commence » → \[Écoute → Réponse\] × N → Fin de partie.

### 3.1 Accueil

- Nom ou logo du jeu, accroche courte (ton à définir).
- Bouton principal « Jouer » vers la page Catégories.
- Lien « Comment ça marche » : fenêtre avec les règles en 3 ou 4 lignes.
- Thème unique « Default » (sombre), sans bascule de thème.
- Pied de page : mentions légales, confidentialité, mention « Données et extraits fournis par Deezer » (à valider selon les conditions d'usage de Deezer).
- Pas de raccourci « Rejouer » sur cette page.

### 3.2 Catégories

- Grille de cartes à deux colonnes en portrait. « Tous styles » en carte pleine largeur, en haut.
- Un seul choix possible : le toucher d'une carte mène directement à la page Critères.
- Les 8 catégories V0 : Tous styles, Pop, Rap & Hip-hop, Rock, Chanson/Variété française (nom à revoir), Dance & Électro, R&B & Soul, Latino.
- Flèche de retour vers l'Accueil. En cas d'erreur réseau : message clair et bouton « Réessayer ».
- La catégorie française verrouille le critère Répertoire sur « Français », avec une explication dans l'info-bulle.

### 3.3 Critères

La catégorie choisie est rappelée en haut, avec un lien pour la changer. Les critères sont classés du moins restrictif au plus restrictif.

| # | Critère | Contrôle | Options | Défaut |
| --- | --- | --- | --- | --- |
| 1 | Durée de l'extrait | Choix unique | 10, 15, 20, 25 s | 20 s |
| 2 | Répertoire | Choix unique | Français, International, Les deux | Les deux |
| 3 | Notoriété | Multi-sélection | Très connus, Connus, Moins connus | Les 3 cochées |
| 4 | Générations | Multi-sélection | 60, 70, 80, 90, 2000, 2010, 2020 | Toutes cochées |
| 5 | Nombre d'extraits | Stepper − / + par pas de 10 | 10 à 100 | 50 |

**Comportement des pastilles (Notoriété et Générations)**

- Pas d'option « Toutes » : toutes les pastilles sont cochées par défaut.
- Premier appui alors que tout est coché : seule la pastille touchée reste sélectionnée.
- Appuis suivants : la pastille s'ajoute ou se retire.
- La dernière pastille ne peut pas être décochée : message d'erreur « Gardez au moins une génération » (ou équivalent pour la notoriété). La vibration est reportée en V2.
- Un lien discret « Tout sélectionner » est prévu en option, à trancher au design.
- Une icône ⓘ ouvre une info-bulle d'aide. Sur téléphone, elle s'ouvre uniquement au toucher, jamais automatiquement.
- Les derniers critères sont mémorisés sur l'appareil (sans compte).

**Récapitulatif dynamique** : phrase du type « La partie dure environ X min » (ton à définir). Durée estimée : nombre d'extraits × (durée de l'extrait + 8 s de réponse + \~2 s de transition). Exemple : 50 extraits de 20 s ≈ 25 min.

**Boutons** : « Lancer la partie » (principal, désactivé si l'état est « indisponible ») et retour aux catégories.

### 3.4 « La partie commence »

- Résumé : catégorie, générations, nombre d'extraits, durée de l'extrait.
- Bouton « Démarrer » : seule entrée dans le jeu. Il débloque le son sur mobile, active le blocage de la mise en veille et lance la préparation.
- Message « Préparation de la partie… » puis décompte 3, 2, 1.
- Flèche de retour vers la page Critères. Erreur ou délai dépassé : message et bouton « Réessayer ».
- Le serveur compose toute la sélection avant le décompte (règles de doublons et d'artistes appliquées une seule fois). Les liens audio ne sont récupérés que pour les extraits à venir.

### 3.5 Écoute

- En-tête : barre de progression visuelle avec le texte à côté (« 12 / 50 »), et icône pour quitter.
- Centre : animation décorative (vinyle ou ondes, non synchronisée au son). Aucune information sur le titre.
- Décompte du temps d'écoute restant, en grand, avec anneau ou barre.
- Bouton Pause / Reprendre : gèle le son et le décompte, l'écran affiche « En pause ».
- Bouton « Passer à la réponse » : affiche directement la réponse, le son continue là où il en est.
- Quitter : fenêtre de confirmation (« La progression sera perdue »), puis retour aux catégories.
- Fondu d'entrée léger. Pause automatique si l'application passe en arrière-plan.
- En multijoueur (V2), la pause et le passage direct à la réponse sont désactivés.

### 3.6 Réponse

- Contenu : pochette (grande), titre, artiste (featuring inclus), album, année. Textes limités à 2 lignes, tronqués proprement.
- Le son continue avec un fondu de sortie, à la fin du délai ou à la fin des 30 s de l'extrait, selon ce qui arrive en premier. Avec un extrait de 25 s, la musique s'arrête donc 5 s après le début de la réponse.
- Timer de 8 s visible (barre de progression), qui déclenche le passage automatique à l'extrait suivant.
- Bouton « Suivant » en grand, en bas de l'écran (zone du pouce).
- Barre et texte de progression conservés.
- Zone réservée sous les informations pour les modales V2 (point culture, joueurs).
- Écran de transition d'environ 2 s (« Extrait 13 ») pour précharger l'extrait suivant.

### 3.7 Fin de partie (V0)

- Titre « Partie terminée » et résumé : catégorie, nombre d'extraits, générations choisies.
- Boutons « Rejouer » (mêmes critères, nouvelle sélection) et « Changer de catégorie ».
- Le tableau récapitulatif des extraits arrive en V2, sans réécoute. L'historique de la partie est déjà mémorisé en V0.

### 3.8 Gestion des incidents

- Extrait inaccessible : remplacé automatiquement et sans bruit par un titre de réserve. Le compteur ne change pas.
- Connexion perdue : message « Connexion perdue » et bouton « Reprendre » à l'extrait en cours.
- Application en arrière-plan : la partie se met en attente sans perte de progression.

## 4. Règles de sélection des titres

**Source et catalogue « semi-dynamique »**

- Un fichier de configuration liste, par catégorie, des playlists sources Deezer. Aucune base de titres n'est saisie manuellement.
- Un script génère automatiquement un index (identifiant, année, popularité, répertoire, artistes, ISRC, type d'album), rafraîchi régulièrement, sur le serveur.
- Le jeu nécessite toujours une connexion Internet. L'index n'est pas stocké sur l'appareil du joueur et ne rend pas le jeu jouable hors ligne.

**Filtres d'exclusion**

- Titre sans extrait audio : exclu.
- Titres dont le nom contient Remastered/Remaster ou Live (y compris « Live at… » et « – Live ») : exclus.
- Albums de type compilation : exclus, sauf bandes originales (voir ci-dessous).
- Rééditions silencieuses : contrôle de cohérence entre l'année de l'album et l'année contenue dans le code ISRC (heuristique, à valider en test). En cas de doute, le titre est écarté.

**Bandes originales (BO)**

- Les compilations identifiées comme BO sont acceptées dans toutes les catégories (genre Films/jeux vidéo de Deezer, ou mots-clés « Soundtrack », « Original Motion Picture », « Bande originale », « OST », « Music from »).
- Garde-fou : l'année de l'ISRC doit être proche de celle de l'album, pour écarter les anciens tubes repris dans une BO.
- Une catégorie spéciale « Films & Séries » avec critères contraints sera définie après le premier périmètre.

**Doublons et artistes**

- Un même titre n'apparaît qu'une fois par partie (détection par ISRC, ou artiste + titre nettoyé).
- Un artiste n'apparaît qu'une fois par partie, featuring compris, quelle que soit la taille de la partie.
- Assouplissement automatique si les artistes manquent : d'abord retour possible avec au moins 15 titres d'écart, sinon écart maximal possible. Jamais de titre en double.

**Répertoire (Français / International)**

- Deezer ne fournit pas la langue. Le répertoire est déterminé par la source : playlists et classements francophones pour « Français », classements internationaux pour « International ».
- Un titre présent dans les deux sources reste éligible dans les deux filtres.

**Notoriété**

- Calculée à partir du score de popularité de Deezer, découpée en 3 niveaux (tiers) au sein de chaque catégorie.
- Les titres sortent dans un ordre aléatoire, quelle que soit la notoriété choisie.

**Générations**

- Décennies 60 à 2020, pilotées par un paramètre pour pouvoir ajouter des décennies antérieures. Année tirée de la fiche du titre ou de l'album.

## 5. États de disponibilité des critères

L'état est recalculé par le serveur après chaque choix, à partir de l'index. N est le nombre d'extraits demandé. Les seuils sont des valeurs de départ, à calibrer pendant les tests.

| État | Condition | Visible pour le joueur |
| --- | --- | --- |
| Normal | Artistes distincts ≥ N et titres ≥ N + 15 % | Rien. Règle d'artiste stricte |
| Toléré | Artistes distincts ≥ 60 % de N et titres ≥ N + 15 % | Rien. Règle assouplie en silence |
| Indisponible | En dessous des seuils précédents | Message d'erreur, bouton « Lancer la partie » désactivé |

- Message : « Ces critères sont trop restrictifs pour composer une partie. Modifiez-les pour continuer », avec une piste (réduire le nombre d'extraits, ajouter des générations).
- Si un choix rend le nombre d'extraits déjà posé impossible, celui-ci est ajusté automatiquement avec un message.
- L'état « Limité » n'est pas affiché afin de garder une expérience fluide.

## 6. Architecture technique

**Principes**

- Application web responsive (PWA), portrait uniquement en V0, colonne centrée sur grand écran avec fond pleine largeur.
- Un petit serveur intermédiaire entre l'application et Deezer : cache, composition des parties, génération de l'index. Il évite aussi que toutes les parties partagent la même limite de requêtes de Deezer.
- Aucune base d'utilisateurs en V0. Stockage local limité aux derniers critères.

**API Deezer (public, sans authentification)**

- Extraits audio de 30 s, donc extrait + prolongation de réponse ≤ 30 s.
- Limite d'environ 50 requêtes par 5 secondes : cache serveur indispensable.
- L'année de sortie n'est fournie que dans la fiche détaillée d'un titre : deux appels par titre candidat (fiche titre et fiche album). L'index est donc généré hors ligne, et la préparation d'une partie se fait progressivement.
- La recherche est plafonnée à 2 000 résultats par requête.
- Les liens audio peuvent être temporaires : récupérés au lancement de la partie.
- Le navigateur ne peut probablement pas appeler Deezer directement : le serveur sert de relais (à vérifier au développement).

**Audio et appareil**

- Démarrage du son par un geste utilisateur (bouton « Démarrer »), indispensable sur mobile.
- Préchargement de l'extrait suivant (environ 0,5 Mo).
- Blocage de la mise en veille (Wake Lock) pendant la partie.
- Animation de l'écoute décorative, non réactive au son.
- Thème unique « Default » défini dans le design system, appliqué via des variables de couleurs.

**Pourquoi pas Spotify**

- Mode développement réservé aux comptes Premium, limité à 5 utilisateurs autorisés. Le mode public (extended quota) est destiné aux organisations d'environ 250 000 utilisateurs actifs mensuels.
- Le lecteur web de Spotify exige un compte Premium côté joueur et ne fonctionne pas dans les navigateurs mobiles iOS.
- Spotify reste envisagé plus tard pour l'export vers les playlists (V3), via une couche d'abstraction.

## 7. Catégories

| Rang | Catégorie | Statut |
| --- | --- | --- |
| 1 | Tous styles | V0 |
| 2 | Pop | V0 |
| 3 | Rap & Hip-hop | V0 |
| 4 | Rock (métal inclus) | V0 |
| 5 | Chanson / Variété française (nom à revoir) | V0, répertoire verrouillé sur Français |
| 6 | Dance & Électro | V0 |
| 7 | R&B & Soul | V0 |
| 8 | Latino | V0 |
| 9 | Afro | Mise à jour future |
| 10 | Reggae & Dancehall | Mise à jour future |
| 11 | Films & Séries (BO) | Catégorie spéciale, à définir |
| 12 | Jazz & Blues | Mise à jour future |

Choix fondé sur le poids du pop et du rap (environ un tiers des écoutes en streaming chacun en France en 2025) et sur l'intérêt pour un blind test. Pas de catégorie « Rap français » séparée : Rap & Hip-hop avec Répertoire « Français » suffit. La combinaison Rap & Hip-hop avec Répertoire « International » aura moins de titres. Les noms des catégories seront revus au moment de définir le ton de l'application.

## 8. Évolutions V2

**Jeu à plusieurs sur un seul écran**

- Création de joueurs ou d'équipes avant la partie.
- À la réponse, une modale fermable listant les joueurs ou équipes s'ouvre automatiquement. Plusieurs équipes peuvent recevoir un point pour un même extrait. Aucune règle de points n'est définie à ce stade.
- Bouton « Valider sans point » si personne n'a trouvé.
- Le passage à l'extrait suivant est bloqué tant que les points ne sont pas validés. Si la modale est fermée avant validation, un bouton « Attribuer les points » permet de la rouvrir.
- Le timer de 8 s sert uniquement au fondu du son : il ne déclenche plus le passage au suivant.
- Pause et « Passer à la réponse » désactivés.
- Toute modale ouverte met le timer en pause. Il repart à la fermeture.

**Point culture**

- Un bouton secondaire sur l'écran de réponse ouvre une modale fermable. Si aucune source ne renvoie de texte, le bouton n'apparaît pas.
- Sources gratuites en cascade : la première qui renvoie un texte est la seule utilisée. Ordre : Wikipédia FR, Last.fm, puis MusicBrainz/Wikidata (faits structurés intégrés à une phrase modèle).
- Le titre est retrouvé via l'ISRC (Deezer → MusicBrainz → Wikidata → Wikipédia).
- Texte court (une à deux phrases, environ 250 caractères, coupé en fin de phrase), sans réécriture payante.
- Texte uniquement en français : une source dont le texte n'est pas en français est ignorée. À revoir si d'autres langues sont ajoutées.
- La source est toujours affichée sous forme de lien cliquable vers la page concernée. Mention de la source obligatoire pour Wikipédia et Last.fm.

**Récapitulatif de fin de partie**

- Tableau des extraits diffusés (numéro, pochette, titre, artiste, année), sans réécoute. Éventuellement l'album.

**Autres**

- Vibration d'avertissement quand la dernière pastille ne peut pas être décochée.
- Quatre catégories supplémentaires : Afro, Reggae & Dancehall, Jazz & Blues, et une catégorie BO si elle est validée.

## 9. Évolutions V3 et plus tard

- **Comptes** : création de compte, nécessaire aux favoris et à l'export.
- **Favoris et export** : liste de favoris importable dans les plateformes de streaming, ou ajout direct. Version simple sans compte possible via des liens par titre.
- **Backoffice contributeurs** : proposition de catégories additionnelles, avec modération.
- **Catégories spéciales** : indépendantes des catégories de base, avec critères modulables (exemple : Films & Séries).
- **Multi-appareils** : jouer à plusieurs sur plusieurs appareils avec un code de partie (connexion temps réel).
- **Smartphone en manette** : même brique technique que le multi-appareils, avec éventuellement l'écran TV en récepteur.
- **Signaler un titre** : bouton de signalement d'erreur.
- **Générations** : ajout de décennies antérieures aux années 60.
- **Langues** : ajout d'autres langues (à revoir pour le point culture).
- **Affichage** : paysage et grands écrans, après les tests utilisateurs.

## 10. Points ouverts et à vérifier

- Nom du jeu, ton éditorial, noms des catégories et textes : à définir avec l'identité de l'app.
- Seuils des états de disponibilité : à calibrer en test (valeurs de départ ci-dessus).
- Fiabilité du contrôle ISRC / année pour les rééditions et les BO : à mesurer sur de vrais titres.
- Conditions d'usage de Deezer (mention, usage des extraits, limites) : à lire avant le lancement.
- Appel direct à Deezer depuis le navigateur ou besoin d'un relais serveur : à confirmer au développement.
- Diffusion en miroir du téléphone : bandes noires éventuelles dues au système, à observer en test.
- Durée de la réponse (8 s) et de la transition (2 s) : à valider en test.
- Taille de la bibliothèque disponible par catégorie après filtres, notamment Rap & Hip-hop en International et la catégorie française.
- Licences et mentions des sources du point culture (V2).
- Interprétation du dernier point des règles de points de la V2 (« pas de règles de points pour le moment ») : à confirmer.
