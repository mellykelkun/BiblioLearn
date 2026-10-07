'use strict';

const { parcours, niveaux } = require('./parcours');
const dependances = {
  'html-attributs': ['html-document'], 'html-texte-listes': ['html-document'],
  'html-liens-images': ['html-attributs'], 'html-semantique': ['html-texte-listes'],
  'html-formulaires': ['html-attributs'], 'css-selecteurs': ['html-attributs'],
  'css-box-model': ['css-selecteurs'], 'css-typographie': ['css-selecteurs'],
  'css-flexbox': ['css-box-model'], 'css-grid': ['css-box-model'], 'css-responsive': ['css-flexbox'],
  'js-types': ['js-variables'], 'js-egalite': ['js-types'], 'js-conditions': ['js-egalite'],
  'js-fonctions': ['js-variables'], 'js-tableaux': ['js-types'], 'js-boucles': ['js-conditions', 'js-tableaux'],
  'js-map-filter-reduce': ['js-fonctions', 'js-tableaux'], 'js-objets': ['js-types'],
  'js-json': ['js-objets'], 'js-erreurs': ['js-fonctions'], 'js-promises': ['js-fonctions', 'js-erreurs'],
  'js-fetch': ['js-promises', 'http-requete-reponse', 'http-status'], 'js-event-loop': ['js-promises'],
  'dom-selection': ['html-document', 'js-variables'], 'dom-modification': ['dom-selection'],
  'dom-evenements': ['dom-selection', 'js-fonctions'], 'dom-formulaires': ['dom-evenements', 'html-formulaires'],
  'http-methodes': ['http-requete-reponse'], 'http-status': ['http-requete-reponse'],
  'node-fs': ['node-runtime'], 'node-process': ['node-runtime'], 'npm-package-json': ['node-runtime'],
  'express-demarrage': ['node-runtime', 'npm-package-json', 'http-requete-reponse'],
  'express-routes': ['express-demarrage', 'http-methodes'], 'express-donnees': ['express-routes', 'js-json'],
  'express-middleware': ['express-routes'], 'express-erreurs': ['express-middleware', 'js-erreurs'],
  'express-securite-base': ['express-donnees', 'http-cookies-sessions']
};

function normaliserConnaissance(element, type) {
  const sources = element.sources || element.liens || (element.sections || []).filter(s => s.type === 'liens').flatMap(s => s.elements);
  return {
    ...element, type,
    niveauPedagogique: element.niveauPedagogique ?? (/avanc|approfond|confirm/i.test(element.niveau || '') ? 4 : 1),
    prerequis: type === 'atelier' ? (element.prerequisIds || element.associes || []) : (element.prerequis || (type === 'fiche' ? dependances[element.id] : null) || []),
    ...(type === 'atelier' ? { prerequisLibelles: element.prerequis || [] } : {}),
    debloque: [], termesNouveaux: element.termesNouveaux || [],
    parcours: parcours.filter(p => p.etapes.some(e => e.fiches.includes(element.id))).map(p => p.id),
    competences: element.competences || [], difficulte: element.difficulte || 'progressif',
    tempsEstime: element.tempsEstime || (Number.parseInt(element.duree, 10) || 20),
    maturiteEditoriale: element.maturiteEditoriale || 'structured',
    provenance: element.provenance || 'historique', sources,
    ...(type === 'atelier' ? { format: element.format || 'atelier', assistance: element.assistance || 'guidee' } : {})
  };
}

function migrerReference(entree, generee) {
  if (!generee) return normaliserConnaissance({ ...entree, article: entree.article || [] }, 'reference');
  // La couverture est conservée. Les phrases et syntaxes de substitution restent
  // dans l'historique Git, mais ne sont plus distribuées comme enseignement.
  const { id, terme, categorie, famille, niveau, aliases, associes, liens, source } = entree;
  return normaliserConnaissance({
    id, terme, categorie, famille, niveau, aliases, associes, liens, source,
    resume: `Retrouver ${terme} dans la documentation ${categorie}.`,
    definition: '', article: [], exemples: [], roles: [], pourquoiUtiliser: [], nePasUtiliser: [],
    avertissements: [], scenarios: [], structure: [], typesDonnees: [], cycleDonnees: '',
    exercice: { etapes: [], validation: [] }, maturiteEditoriale: 'draft', provenance: 'notice-generee'
  }, 'reference');
}

function construireGraphe(elements) {
  const index = new Map(elements.map(e => [`${e.type}/${e.id}`, e]));
  if (index.size !== elements.length) throw new Error('Identifiants de connaissances dupliqués');
  for (const element of elements) {
    for (const id of element.prerequis) {
      if (!index.has(`fiche/${id}`)) throw new Error(`Prérequis inconnu : ${element.id} → ${id}`);
      index.get(`fiche/${id}`).debloque.push(`${element.type}/${element.id}`);
    }
  }
  const visites = new Set(), pile = new Set();
  function visiter(id) {
    if (pile.has(id)) throw new Error(`Cycle de prérequis : ${[...pile, id].join(' → ')}`);
    if (visites.has(id)) return;
    pile.add(id);
    index.get(id).prerequis.forEach(p => visiter(`fiche/${p}`));
    pile.delete(id); visites.add(id);
  }
  index.forEach((_, id) => visiter(id));
}

module.exports = { normaliserConnaissance, migrerReference, construireGraphe, parcours, niveaux };
