'use strict';
const defis = require('./ateliers-defis');

/*
 * Banque de pratique générée à partir de parcours courts.
 * Chaque thème produit un atelier complet : objectif, préparation,
 * implémentation et validation. Les 120 ateliers restent des entrées
 * indépendantes dans l’API et pourront être migrés sans transformation.
 */

function ajouterDuree(duree, supplement = 15) {
  const correspondance = String(duree || '').match(/(\d+)\s*min/);
  return correspondance ? `${Number(correspondance[1]) + supplement} min` : duree;
}

function enrichirEtapes(etapes) {
  if (etapes.length >= 4) return etapes;
  return [...etapes, {
    titre: 'Débrief et transfert',
    explication: 'Après la validation, suivez la donnée de bout en bout : qui la produit, quel type elle a, où elle est validée, comment elle est transformée, où elle est transmise ou stockée et quel message apparaît en cas d’échec. Écrivez ensuite la décision prise, le cas dans lequel elle serait mauvaise et la variante à tester dans votre propre infrastructure.',
    langage: 'Markdown',
    code: '# Contrat de donnée\n- Entrée et type :\n- Validation :\n- Transformation :\n- Sortie et transport :\n- Donnée sensible à exclure :\n- Infrastructure : local / navigateur / serveur / CI\n- Variante à essayer ensuite :'
  }];
}

function atelier({ id, titre, domaine, niveau = 'Débutant', duree = '35 min', objectif, outils, prerequis, structure, etapes, validation, indice, associes }) {
  return { id, titre, domaine, niveau, duree: ajouterDuree(duree), objectif, outils, prerequis, structure, etapes: enrichirEtapes(etapes), validation, indice, associes };
}

function slugifier(texte) {
  return texte.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const fichiers = {
  html: ['index.html'], css: ['index.html', 'styles.css'], javascript: ['index.html', 'app.js'], dom: ['index.html', 'app.js'],
  node: ['main.js'], npm: ['package.json', 'index.js'], http: ['requêtes.http'], express: ['server.js', 'package.json'],
  shell: ['exercice.sh'], typescript: ['index.ts', 'tsconfig.json'], react: ['App.jsx'], nextjs: ['app/page.tsx'],
  vue: ['App.vue'], angular: ['app.component.ts'], 'css-outils': ['index.html', 'styles.css']
};
const langages = { html: 'HTML', css: 'CSS', javascript: 'JavaScript', dom: 'JavaScript', node: 'JavaScript', npm: 'JSON / Bash', http: 'HTTP', express: 'JavaScript', shell: 'Bash', typescript: 'TypeScript', react: 'JSX', nextjs: 'TSX', vue: 'Vue', angular: 'TypeScript', 'css-outils': 'HTML / CSS' };
const fichesParDefi = {
  html: ['html-semantique','html-focus-accessible','html-formulaires','html-tableaux','html-liens-images','html-dialog-details','html-document','html-semantique'],
  css: ['css-selecteurs','css-grid','css-flexbox','css-variables','css-responsive','css-container-queries','css-typographie','css-selecteurs'],
  javascript: ['js-objets','js-conditions','js-tableaux','js-map-filter-reduce','js-erreurs','js-modules','js-promises','js-boucles'],
  dom: ['dom-modification','dom-delegation','dom-evenements','html-dialog-details','dom-evenements','dom-mutation-observer','dom-evenements','dom-formulaires'],
  node: ['node-process','node-fs','node-fs','node-streams','node-process','node-runtime','node-process','node-process'],
  npm: ['npm-package-json','npm-scripts','npm-semver','npm-package-json','npm-publish-package','npm-ci-lockfile','npm-update-outdated-audit','npm-publish-package'],
  http: ['http-requete-reponse','http-status','http-status','http-headers-cors','http-rest','http-cache-etag','http-cookies-sessions','http-methodes'],
  express: ['express-routes','express-middleware','express-donnees','express-erreurs','express-routes','http-rest','express-demarrage','express-securite-base'],
  shell: ['shell-grep-rg-find','shell-pipes-redirections','shell-terminal','shell-env-path','shell-permissions','shell-pipes-redirections','shell-terminal','git-cycle'],
  typescript: ['typescript-types','typescript-narrowing','typescript-narrowing','typescript-generiques','typescript-types-utilitaires','typescript-frontiere-api','typescript-types','typescript-configuration-stricte'],
  react: ['react-composants','react-etat','react-composants','react-etat','react-effets','react-architecture-etat','react-effets','react-accessibilite-rendu'],
  nextjs: ['next-routage','next-routage','next-rendu','next-routage','next-rendu','next-rendu','next-etats-chargement-erreurs','next-etats-chargement-erreurs'],
  vue: ['vue-composants','vue-composants','vue-reactivite','vue-reactivite','vue-reactivite','vue-composables-testables','vue-composants','vue-composants'],
  angular: ['angular-composants','angular-composants','angular-composants','angular-services','angular-formulaires-reactifs','angular-services','angular-composants','angular-services-tests'],
  'css-outils': ['tailwind-utilitaires','tailwind-utilitaires','bootstrap-composants','tailwind-utilitaires','css-outils-comparaison','css-variables','css-outils-comparaison','css-outils-comparaison']
};

const parcours = [
  { domaine: 'html', associe: 'html-semantique', themes: ['Landmarks de page', 'Navigation au clavier', 'Formulaire d’inscription', 'Tableau de données', 'Média avec sous-titres', 'Accordéon natif', 'Page multilingue', 'Audit HTML'] },
  { domaine: 'css', associe: 'css-selecteurs', themes: ['Sélecteurs lisibles', 'Grille responsive', 'Flexbox et alignement', 'Variables de thème', 'Animation respectueuse', 'Container query', 'Typographie fluide', 'Débogage de cascade'] },
  { domaine: 'javascript', associe: 'js-fonctions', themes: ['Destructuration de données', 'Validation de formulaire', 'Tri stable', 'Recherche accentuée', 'Gestion d’erreur', 'Module réutilisable', 'Itération asynchrone', 'Mesure de performance'] },
  { domaine: 'dom', associe: 'dom-evenements', themes: ['Liste interactive', 'Délégation de clics', 'Menu accessible', 'Dialog contrôlé', 'Drag and drop', 'Observer le DOM', 'Raccourci clavier', 'État URL'] },
  { domaine: 'node', associe: 'node-runtime', themes: ['CLI avec arguments', 'Lecture de fichier', 'Écriture atomique', 'Flux de données', 'Processus enfant', 'Serveur HTTP natif', 'Gestion des signaux', 'Journal structuré'] },
  { domaine: 'npm', associe: 'npm-package-json', themes: ['Package privé', 'Script de qualité', 'Dépendance exacte', 'Workspace local', 'Commande bin', 'Lockfile reproductible', 'Audit de package', 'Publication simulée'] },
  { domaine: 'http', associe: 'http-requete-reponse', themes: ['Cycle requête-réponse', 'Statuts cohérents', 'Headers de cache', 'Pagination API', 'Idempotence', 'CORS raisonné', 'Upload de fichier', 'Client curl documenté'] },
  { domaine: 'express', associe: 'express-routes', themes: ['Route paramétrée', 'Middleware de logs', 'Validation JSON', 'Erreur centralisée', 'Pagination serveur', 'Ressource REST', 'Healthcheck complet', 'Limite de débit'] },
  { domaine: 'shell', associe: 'shell-pipes-redirections', themes: ['Pipeline de recherche', 'Rapport avec redirection', 'Archive de projet', 'Variables sûres', 'Permissions minimales', 'xargs contrôlé', 'Alias de travail', 'Journal Git'] },
  { domaine: 'typescript', associe: 'typescript-types', themes: ['Type d’objet', 'Union discriminée', 'Narrowing par guard', 'Type générique', 'Type utilitaire', 'API typée', 'Enum sans surprise', 'Configuration stricte'] },
  { domaine: 'react', associe: 'react-composants', themes: ['Composant de carte', 'État local', 'Liste avec clé', 'Formulaire contrôlé', 'Effet nettoyé', 'Hook personnalisé', 'Chargement asynchrone', 'Accessibilité React'] },
  { domaine: 'nextjs', associe: 'next-routage', themes: ['Route dynamique', 'Layout partagé', 'Page serveur', 'Metadata de page', 'Formulaire progressif', 'Image optimisée', 'État de chargement', '404 explicite'] },
  { domaine: 'vue', associe: 'vue-composants', themes: ['Composant props', 'Événement enfant', 'Liste réactive', 'Computed lisible', 'Watch ciblé', 'Composable partagé', 'Formulaire Vue', 'Transition d’interface'] },
  { domaine: 'angular', associe: 'angular-composants', themes: ['Composant standalone', 'Input typé', 'Output d’action', 'Service injectable', 'Formulaire réactif', 'Guard de route', 'Pipe de présentation', 'Test de composant'] },
  { domaine: 'css-outils', associe: 'css-outils-comparaison', themes: ['Grille utilitaire', 'Composant Tailwind', 'Thème Bootstrap', 'Responsive par classes', 'États focus', 'Espacement cohérent', 'Composant mixte', 'Migration CSS vers utilitaires'] }
];

function creerAtelier(parcoursCourant, theme, index) {
  const domaine = parcoursCourant.domaine;
  const defi = defis[domaine]?.[index];
  if (!defi) throw new Error(`Défi spécifique manquant : ${domaine} ${index + 1}`);
  const slug = slugifier(theme);
  const id = 'atelier-plus-' + domaine + '-' + String(index + 1).padStart(2, '0') + '-' + slug;
  const dossier = 'atelier-' + slug;
  return atelier({
    id,
    titre: 'Construire : ' + theme,
    domaine,
    niveau: index > 4 ? 'Intermédiaire' : 'Débutant',
    duree: index > 4 ? '60 min' : '45 min',
    objectif: defi.attendu,
    outils: ['Éditeur de code', 'Terminal', domaine === 'html' || domaine === 'css' ? 'Navigateur et DevTools' : 'Documentation officielle'],
    prerequis: ['Lire la fiche utile liée à cet atelier', 'Savoir créer un dossier de projet', 'Pouvoir expliquer le résultat attendu avant de coder'],
    structure: [dossier + '/README.md', ...(fichiers[domaine] || ['index.js']).map((fichier) => dossier + '/' + fichier)],
    etapes: [
      { titre: 'Préparer le résultat attendu', explication: `Avant de coder « ${theme} », écrivez ce que la personne verra et comment vous vérifierez le résultat.`, langage: 'Markdown', code: `# ${theme}\n\nRésultat attendu : ${defi.attendu}\n\nCas à provoquer : ${defi.panne}` },
      { titre: 'Construire et compléter', explication: `Ce code est un point de départ propre à « ${theme} ». Complétez-le dans les fichiers indiqués, puis faites-le fonctionner.`, langage: langages[domaine], code: defi.code },
      { titre: 'Tester une panne réelle', explication: `Vérifiez d’abord : ${defi.attendu} Puis provoquez ce problème : ${defi.panne}`, langage: 'Protocole', code: `1. Observer le résultat normal.\n2. ${defi.panne}\n3. Lire le message ou l’état obtenu.\n4. Réparer et vérifier à nouveau.` },
      { titre: 'Expliquer et transférer', explication: `Racontez pourquoi votre solution fonctionne et ce qui change dans le cas cassé de « ${theme} ».`, langage: 'Markdown', code: `# Bilan : ${theme}\n- Ce que j’ai construit :\n- Résultat observé : ${defi.attendu}\n- Panne reproduite : ${defi.panne}\n- Correction appliquée :\n- Si le projet grandit, je vérifierai :` }
    ],
    validation: [
      defi.attendu,
      `Le cas cassé a été reproduit puis corrigé : ${defi.panne}`,
      'Le résultat et sa vérification sont expliqués dans README.md.'
    ],
    indice: `Commencez par vérifier le résultat normal. Ensuite, reproduisez exactement ce cas : ${defi.panne}`,
    associes: [fichesParDefi[domaine][index]]
  });
}

module.exports = parcours.flatMap((parcoursCourant) => parcoursCourant.themes.map((theme, index) => creerAtelier(parcoursCourant, theme, index)));
