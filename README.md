# MelodyMasters

MVP web installable de blind test musical, solo et sans compte. L'application sert les extraits depuis les résultats de playlists Deezer, sans catalogue de morceaux renseigné à la main.

## Démarrer en local

Prérequis : Node.js 18 ou plus récent.

```powershell
npm start
```

Ouvrir ensuite <http://localhost:4173>. Le serveur écoute le port `4173` par défaut ; la variable d'environnement `PORT` permet de le remplacer. Les appels à Deezer passent par le serveur local, et une connexion Internet est nécessaire pour composer et jouer une partie.

## Parcours livré

- Accueil, règles, catégories (dont Metal), critères réinitialisés à chaque partie, préparation et lancement d'une partie.
- Lecture des extraits, pause/reprise, réponse automatique, progression, transition, fin de partie et nouvelle sélection.
- Vérification des titres non bloquante, compte à rebours sur le même écran, progression stable entre écoute et réponse, commandes de pause/reprise et de sortie.
- Thèmes sombre et clair, sélection indépendante des répertoires français et international, et nombre d'extraits réglable de 10 à 100.
- Les critères ne sont pas enregistrés entre les parties.
- Application installable (manifest et shell mis en cache). Le cache ne permet pas de jouer hors connexion.
- Relais Deezer côté serveur, mise en cache temporaire des playlists, filtres de titres et réserve de remplacement.

Les recherches de playlists sont configurées dans `catalog-sources.json`. Leur contenu est récupéré dynamiquement auprès de Deezer ; les dates et types d'albums sont enrichis depuis les fiches d'albums, puis gardés en cache mémoire 24 h. Les catalogues de playlists sont gardés 10 min. Les liens audio sont rafraîchis au lancement puis à chaque nouvel extrait, car ils peuvent expirer. Le relais limite les appels à 45 requêtes par fenêtre glissante de 5 s.

Le classement par répertoire dépend des recherches de sources configurées (Deezer ne donne pas de langue fiable sur chaque titre) ; les niveaux de notoriété sont estimés à partir du rang Deezer. Le cache est en mémoire et ne constitue pas encore l'index régénéré périodiquement décrit dans la spécification technique. Les heuristiques (dont la détection des compilations et des rééditions) et les conditions d'utilisation des extraits doivent être validées avant une publication publique.

Les pages Mentions légales et Confidentialité affichent volontairement un rappel de contenu à renseigner : aucun texte juridique n'était fourni. Le nom et la direction artistique MelodyMasters reprennent le nom des maquettes ; le design applique le thème sombre Disco néon du design system.

## Vérifications

```powershell
npm test
node --check server.js
node --check public/app.js
```
