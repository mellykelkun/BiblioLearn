# Bibliolearn

Bibliolearn est un parcours progressif pour apprendre le développement web, complété par des ateliers et une référence technique. L’interface est construite en HTML, CSS et JavaScript vanilla ; Express sert les fichiers et le catalogue documentaire. La progression personnelle reste dans le navigateur.

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
npm run build:catalogue # régénérer le JSON utilisé en mode statique/hors ligne
```

## Architecture

```text
.
├── public/
│   ├── index.html             # structure de l’interface
│   ├── styles.css             # design clair, lisible et responsive
│   ├── app.js                 # navigation, recherche et progression
│   ├── manifest.webmanifest   # installation PWA
│   └── sw.js                  # lecture hors ligne après la première visite
├── scripts/
│   ├── verifier-catalogue.js  # contrôle les fiches et leurs liens internes
│   ├── test-pedagogie.js      # unicité des exercices et synchronisation du JSON
│   └── construire-catalogue.js # publication statique du catalogue
├── src/data/
│   ├── index.js               # domaines, agrégation et validation
│   ├── outils.js              # constructeurs et sessions guidées
│   ├── pedagogie*.js          # modèles mentaux, défis et corrigés propres aux 113 leçons
│   ├── ateliers-defis.js      # points de départ et validations propres aux 120 défis
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

Le navigateur charge le catalogue depuis `GET /api/documentation` et peut utiliser `public/documentation.json` en secours. La recherche s’exécute dans le navigateur. Les fiches récemment ouvertes, maîtrisées ou marquées « À revoir » sont enregistrées dans `localStorage` et ne quittent pas l’appareil.

Le parcours débutant guide 35 leçons dans un ordre explicite : HTML, CSS, JavaScript/DOM, puis échanges réseau et serveur. Chacune des 113 leçons conserve sa documentation d’origine et ajoute un modèle mental, une situation, un défi et un corrigé propres à la notion. Les cinq étapes visibles pointent vers cinq parties différentes ; leurs durées sont indicatives. Le catalogue contient 129 ateliers, dont 120 défis avec leur propre code de départ, panne à reproduire et résultat à vérifier.

## Installer et partager

Le manifeste et le service worker rendent le site installable depuis les navigateurs compatibles. Le bouton « Installer » utilise l’invite du navigateur lorsqu’elle est disponible et donne des instructions de repli ailleurs. Une proposition discrète apparaît après un court délai et peut être remise à plus tard. Les fichiers de l’interface et le catalogue public sont mis en cache pour permettre la consultation hors ligne après une première visite complète. Une connexion est nécessaire pour obtenir les mises à jour.

Le bouton « Partager » propose le partage natif sur les appareils compatibles, ou copie le lien de la page ou de la leçon en cours. Les marqueurs personnels ne sont pas inclus dans ce lien.

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
5. Vérifier les fiches liées dans `associes`, puis lancer `npm run build:catalogue` et `npm run check`.

## Ajouter une fiche

1. Choisir le fichier correspondant au domaine dans `src/data/`.
2. Ajouter un objet créé avec `fiche({ ... })`.
3. Composer uniquement les sections utiles : `texte`, `code`, `liste`, `decomposition`, `comparaison`, `alerte` et `liens`.
4. Rédiger une entrée de guide pédagogique unique dans `pedagogie*.js` : modèle mental, situation, défi et corrigé.
5. Ajouter les identifiants des fiches liées dans `associes`.
6. Lancer `npm run build:catalogue` puis `npm run check`.

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

Les tests du catalogue vérifient l’unicité des guides, des codes d’atelier, les cibles des sessions, la synchronisation du JSON statique et les fichiers PWA. La vérification manuelle doit compléter ces tests sur ordinateur et mobile : navigation, recherche, lecture des corrigés, installation, partage et réouverture hors ligne.

## Ressource PDF

Le PDF HTML historique mentionné dans le cahier des charges n’était pas présent dans le dossier lors de la reconstruction. La fiche « Reconnaître le HTML obsolète » couvre déjà `FONT`, `CENTER`, `BLINK`, `FRAMESET`, `bgcolor`, `background` et `align` en les présentant uniquement comme syntaxes historiques. Le PDF pourra être analysé et servir à compléter les fiches dès qu’il sera ajouté au projet.
