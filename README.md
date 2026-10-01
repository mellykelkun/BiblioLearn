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
│   ├── styles.css             # design clair, lisible et responsive
│   └── app.js                 # navigation, recherche et progression
├── scripts/
│   └── verifier-catalogue.js  # contrôle les fiches et leurs liens internes
├── src/data/
│   ├── index.js               # domaines, agrégation et validation
│   ├── outils.js              # constructeurs et sessions guidées
│   ├── profils.js             # approfondissement par écosystème
│   ├── fiches-approfondissement.js # sessions et notions avancées
│   ├── fiches-complementaires.js # accessibilité, sécurité et pratique avancée
│   ├── fiches-fondamentaux.js # HTML et CSS
│   ├── fiches-javascript-dom.js
│   ├── fiches-backend.js      # Node.js, npm, HTTP et Express
│   └── fiches-frontend.js     # TypeScript et frameworks frontend
│   ├── fiches-shell.js        # Terminal, Bash, npm avancé et Git
│   ├── ateliers.js            # exercices guidés de construction
│   ├── ateliers-plus.js       # banque générée de 120 ateliers supplémentaires
│   └── fiches-ecosystemes.js  # parcours frontend approfondis
├── scripts/generer-migration.js # export SQL du catalogue
└── supabase/migrations/       # schéma et données Bibliolearn isolés
└── server.js                  # serveur Express et API locale
```

Le navigateur charge le catalogue depuis `GET /api/documentation`. La recherche est entièrement locale. Les fiches récemment ouvertes, maîtrisées ou marquées « À revoir » sont enregistrées dans `localStorage` et ne quittent jamais la machine.

Chaque leçon expose désormais cinq sessions (« Comprendre », « Vocabulaire », « Construire », « Choisir selon le scénario », « Vérifier et transférer ») qui pointent vers les sections de la fiche. Les fiches reçoivent aussi une explication approfondie, un cycle de donnée (demander, valider, transformer, transmettre, stocker, observer), une grille de décisions, deux mini-exercices de code, un exercice de transfert, une mise en situation et une question de contrôle. Le catalogue contient 113 fiches, 350 exemples et 129 ateliers. Chaque atelier dure 15 minutes de plus et se termine par un débrief sur le type de donnée, la validation, le transport, la sécurité et l’infrastructure visée.

## Migration Supabase optionnelle

Le contenu peut être stocké dans Supabase sans modifier les autres tables : la migration utilise uniquement les tables préfixées `bibliolearn_` et active une lecture publique en RLS. Le serveur continue d’utiliser le catalogue local si `SUPABASE_URL` ou `SUPABASE_ANON_KEY` manque, ou si Supabase est indisponible.

```bash
npm run generate:migration
SUPABASE_URL=https://... SUPABASE_ANON_KEY=... npm start
```

La migration est générée depuis les données JavaScript afin d’éviter une divergence entre le mode local et le mode distant. Elle crée les domaines, les leçons, les sessions intégrées dans les leçons et les ateliers guidés.

L’entrée « Ateliers pratiques » propose des exercices orientés production : carte HTML/CSS, interaction DOM, recherche locale, serveur Node, API Express, package npm, commandes shell, `fetch` et premier cycle Git. Chaque atelier indique les outils nécessaires, les prérequis, l’arborescence à créer, des étapes commentées, des commandes exécutables et une checklist de validation. La progression des ateliers est également conservée localement.

## Ajouter un atelier

1. Ajouter un objet `atelier({ ... })` dans `src/data/ateliers.js`.
2. Décrire un objectif concret, les outils, les prérequis et une structure de fichiers.
3. Découper le travail en étapes courtes avec `titre`, `explication`, `langage` et `code`.
4. Terminer par des critères de validation et un indice de dépannage.
5. Vérifier les fiches liées dans `associes`, puis lancer `npm run check`.

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
