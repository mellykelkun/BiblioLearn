# Bibliolearn

Bibliolearn est une bibliothèque locale pour apprendre, réviser et retrouver rapidement les fondamentaux du développement web. L’interface est construite en HTML, CSS et JavaScript vanilla ; Express sert les fichiers et le catalogue documentaire.

## Démarrer

Prérequis : Node.js 18 ou plus récent.

```bash
npm install
npm run dev
```

Ouvrir ensuite <http://localhost:3000>. Pour utiliser un autre port :

```bash
PORT=3001 npm run dev
```

## Commandes

```bash
npm run dev     # serveur avec redémarrage Nodemon
npm start       # serveur sans Nodemon
npm run check   # syntaxe JavaScript + intégrité du catalogue
```

## Architecture

```text
.
├── public/
│   ├── index.html             # structure de l’interface
│   ├── styles.css             # design sombre et responsive
│   └── app.js                 # navigation, recherche et progression
├── scripts/
│   └── verifier-catalogue.js  # contrôle les fiches et leurs liens internes
├── src/data/
│   ├── index.js               # domaines, agrégation et validation
│   ├── outils.js              # petits constructeurs de sections
│   ├── fiches-fondamentaux.js # HTML et CSS
│   ├── fiches-javascript-dom.js
│   ├── fiches-backend.js      # Node.js, npm, HTTP et Express
│   └── fiches-frontend.js     # TypeScript et frameworks frontend
└── server.js                  # serveur Express et API locale
```

Le navigateur charge le catalogue depuis `GET /api/documentation`. La recherche est entièrement locale. Les fiches récemment ouvertes, maîtrisées ou marquées « À revoir » sont enregistrées dans `localStorage` et ne quittent jamais la machine.

## Ajouter une fiche

1. Choisir le fichier correspondant au domaine dans `src/data/`.
2. Ajouter un objet créé avec `fiche({ ... })`.
3. Composer uniquement les sections utiles : `texte`, `code`, `liste`, `decomposition`, `comparaison`, `alerte` et `liens`.
4. Ajouter les identifiants des fiches liées dans `associes`.
5. Lancer `npm run check`.

Exemple minimal :

```js
fiche({
  id: 'js-exemple',
  domaine: 'javascript',
  categorie: 'Fondamentaux',
  titre: 'Une notion JavaScript',
  resume: 'Résumé affiché dans les listes et la recherche.',
  tags: ['javascript', 'exemple'],
  sections: [
    texte('Définition', 'Explication concise.'),
    code('Syntaxe', 'JavaScript', 'const exemple = true;'),
    liens({ label: 'Documentation officielle', url: 'https://developer.mozilla.org/' })
  ],
  associes: ['js-variables']
})
```

## Ressource PDF

Le PDF HTML historique mentionné dans le cahier des charges n’était pas présent dans le dossier lors de la reconstruction. La fiche « Reconnaître le HTML obsolète » couvre déjà `FONT`, `CENTER`, `BLINK`, `FRAMESET`, `bgcolor`, `background` et `align` en les présentant uniquement comme syntaxes historiques. Le PDF pourra être analysé et servir à compléter les fiches dès qu’il sera ajouté au projet.
