'use strict';

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
  return [...etapes, {
    titre: 'Débrief et transfert',
    explication: 'Après la validation, écrivez la décision prise, le cas dans lequel elle serait mauvaise et la variante à tester dans votre propre infrastructure. Cette étape transforme une recette en savoir réutilisable.',
    langage: 'Markdown',
    code: '# Décision retenue\n- Infrastructure : local / navigateur / serveur / CI\n- Cas limite testé :\n- Variante à essayer ensuite :'
  }];
}

function atelier({ id, titre, domaine, niveau = 'Débutant', duree = '35 min', objectif, outils, prerequis, structure, etapes, validation, indice, associes }) {
  return { id, titre, domaine, niveau, duree: ajouterDuree(duree), objectif, outils, prerequis, structure, etapes: enrichirEtapes(etapes), validation, indice, associes };
}

function slugifier(texte) {
  return texte.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const exemples = {
  html: '<main>\n  <h1>Mon écran</h1>\n  <p>Un contenu compréhensible.</p>\n</main>',
  css: '.composant {\n  display: grid;\n  gap: 1rem;\n  color: #243447;\n}',
  javascript: 'const resultat = donnees.filter((element) => element.actif);\nconsole.log(resultat);',
  dom: 'const bouton = document.querySelector("#action");\nbouton.addEventListener("click", () => {\n  document.body.classList.toggle("is-active");\n});',
  node: 'const { readFile } = require("node:fs/promises");\nconst contenu = await readFile("./donnees.txt", "utf8");\nconsole.log(contenu);',
  npm: 'npm init -y\nnpm install --save-dev outil\nnpm run check',
  http: 'curl -i http://localhost:3000/api/ressource\n# Observer le statut et Content-Type',
  express: 'app.get("/api/ressource", (req, res) => {\n  res.json({ statut: "ok" });\n});',
  shell: 'pwd\nfind . -maxdepth 2 -type f -print\nrg "motif" .',
  typescript: 'type Element = { id: string; actif: boolean };\nconst element: Element = { id: "demo", actif: true };',
  react: 'function Carte({ titre }) {\n  return <article><h2>{titre}</h2></article>;\n}',
  nextjs: 'export default function Page() {\n  return <main><h1>Page rendue</h1></main>;\n}',
  vue: '<script setup>\nconst titre = "Composant Vue";\n</script>\n<template><h1>{{ titre }}</h1></template>',
  angular: '@Component({\n  selector: "app-carte",\n  template: "<h2>{{ titre }}</h2>"\n})',
  'css-outils': '<div class="flex gap-4 rounded-lg p-4">\n  <h2>Composant utilitaire</h2>\n</div>'
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
  const slug = slugifier(theme);
  const id = 'atelier-plus-' + domaine + '-' + String(index + 1).padStart(2, '0') + '-' + slug;
  const exemple = exemples[domaine];
  const dossier = 'atelier-' + slug;
  return atelier({
    id,
    titre: 'Construire : ' + theme,
    domaine,
    niveau: index > 4 ? 'Intermédiaire' : 'Débutant',
    duree: index > 4 ? '45 min' : '30 min',
    objectif: 'Réaliser un mini-projet sur « ' + theme + ' », puis vérifier son comportement avec un résultat observable.',
    outils: ['Éditeur de code', 'Terminal', domaine === 'html' || domaine === 'css' ? 'Navigateur et DevTools' : 'Documentation officielle'],
    prerequis: ['Lire la fiche associée', 'Savoir créer un dossier de projet', 'Pouvoir expliquer le résultat attendu avant de coder'],
    structure: [dossier + '/README.md', dossier + '/index.' + (domaine === 'html' ? 'html' : domaine === 'css' ? 'css' : 'js'), dossier + '/tests/'],
    etapes: [
      { titre: 'Formuler le contrat', explication: 'Écrivez ce que l’utilisateur doit voir ou ce que la commande doit produire. Ajoutez un cas nominal et un cas limite.', langage: 'Markdown', code: '# ' + theme + '\n\n## Résultat attendu\n- Cas nominal : le comportement principal est observable.\n- Cas limite : l’erreur ou l’absence de donnée est expliquée.\n\n## Critère mesurable\nNoter une observation avant de modifier le code.' },
      { titre: 'Construire une première version', explication: 'Partez d’une petite implémentation, puis adaptez-la au thème. Gardez les données et les responsabilités séparées pour pouvoir tester chaque morceau.', langage: domaine === 'shell' ? 'Bash' : domaine === 'typescript' ? 'TypeScript' : domaine === 'html' || domaine === 'css' ? domaine.toUpperCase() : 'JavaScript', code: exemple },
      { titre: 'Casser puis vérifier', explication: 'Introduisez volontairement une erreur simple, lisez le message, corrigez-la et notez la règle retenue dans README.md.', langage: 'Bash', code: 'node --check index.js 2>/dev/null || true\nprintf "Sujet : ' + theme + '\\n"\nrg -n "TODO|FIXME|console\\.log" . || true\n# Vérifier aussi le cas limite décrit dans le contrat' }
    ],
    validation: [
      'Le cas nominal produit le résultat annoncé dans le contrat.',
      'Le cas limite est traité avec un message ou un état visible.',
      'Le code est relisible après une pause de cinq minutes.',
      'README.md explique la commande ou le geste de vérification.'
    ],
    indice: 'Réduisez le problème à une donnée d’entrée, une transformation et une observation. Si le résultat est ambigu, ajoutez un log ou un test ciblé avant de modifier plusieurs fichiers.',
    associes: [parcoursCourant.associe]
  });
}

module.exports = parcours.flatMap((parcoursCourant) => parcoursCourant.themes.map((theme, index) => creerAtelier(parcoursCourant, theme, index)));
