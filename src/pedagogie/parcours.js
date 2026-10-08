'use strict';

const fondations = [
  { titre: 'Construire une page lisible', description: 'Donner un sens aux titres, au texte et aux liens.', fiches: ['html-document', 'html-texte-listes', 'html-attributs', 'html-liens-images', 'html-semantique', 'html-formulaires'] },
  { titre: 'Organiser une page sur tous les écrans', description: 'Comprendre les dimensions avant de choisir une disposition.', fiches: ['css-selecteurs', 'css-box-model', 'css-typographie', 'css-flexbox', 'css-grid', 'css-responsive'] },
  { titre: 'Réagir aux actions du lecteur', description: 'Manipuler des valeurs, puis relier les instructions à la page.', fiches: ['js-variables', 'js-types', 'js-egalite', 'js-conditions', 'js-fonctions', 'js-tableaux', 'js-boucles', 'dom-selection', 'dom-modification', 'dom-evenements', 'dom-formulaires'] },
  { titre: 'Échanger des données avec un serveur', description: 'Suivre une demande, une réponse et les erreurs possibles.', fiches: ['js-json', 'js-erreurs', 'js-callbacks', 'js-synchronisme', 'js-promises', 'http-requete-reponse', 'http-methodes', 'http-status', 'js-fetch', 'node-runtime', 'npm-package-json', 'express-demarrage', 'express-routes', 'express-donnees'] }
];
const parcours = [
  { id: 'zero', titre: 'Commencer sans avoir jamais codé', niveau: 'Niveau 0', competence: 'Retrouver un fichier, expliquer une demande web et diagnostiquer une première erreur.', etapes: [{ titre: 'Prendre ses premiers repères', description: 'Aucun langage ni outil de programmation à connaître au départ.', fiches: ['zero-ordinateur', 'zero-fichiers', 'zero-programme', 'zero-web', 'zero-terminal', 'zero-outils', 'zero-erreurs', 'zero-sauvegarde'] }, ...fondations] },
  { id: 'fondations', titre: 'Reprendre les fondamentaux du web', niveau: 'Fondations', competence: 'Construire une page, la rendre interactive et expliquer ses échanges réseau.', etapes: fondations },
  { id: 'frontend', titre: 'Construire une interface utilisable', niveau: 'Autonome → junior', competence: 'Livrer une interface lisible sur mobile et au clavier, avec des erreurs compréhensibles.', etapes: [...fondations.slice(0, 3), { titre: 'Fiabiliser l’interface', description: 'Tester le clavier, les données et les chargements.', fiches: ['html-focus-accessible', 'js-fetch', 'javascript-abort-controller', 'typescript-types', 'typescript-frontiere-api'] }] },
  { id: 'backend', titre: 'Construire et protéger un service', niveau: 'Junior → intermédiaire', competence: 'Valider une entrée, contrôler les droits et tester les réponses normales et en erreur.', etapes: [{ titre: 'Comprendre les échanges', description: 'Suivre une donnée du client au serveur.', fiches: ['http-requete-reponse', 'http-methodes', 'http-status', 'node-runtime', 'node-fs', 'npm-package-json'] }, { titre: 'Traiter les demandes', description: 'Délimiter routes, traitement et erreurs.', fiches: ['express-demarrage', 'express-routes', 'express-donnees', 'express-middleware', 'express-erreurs', 'express-securite-base', 'http-cookies-sessions', 'php-pdo'] }] },
  { id: 'fullstack', titre: 'Relier une interface à son service', niveau: 'Junior → intermédiaire', competence: 'Tracer une donnée de sa saisie à sa réponse et vérifier chaque frontière.', etapes: fondations.concat({ titre: 'Protéger le trajet des données', description: 'Vérifier types, erreurs et autorisations.', fiches: ['typescript-frontiere-api', 'express-erreurs', 'express-securite-base', 'http-cookies-sessions'] }) },
  { id: 'systemes', titre: 'Exécuter et diagnostiquer un programme', niveau: 'Autonome → intermédiaire', competence: 'Retrouver un fichier, expliquer un processus, lire une erreur et reproduire une installation.', etapes: [{ titre: 'Se repérer et exécuter', description: 'Comprendre une commande avant de la lancer.', fiches: ['shell-premier-terminal', 'shell-pwd-ls-cd', 'shell-installer-verifier-outil', 'shell-env-path', 'node-process', 'shell-permissions'] }, { titre: 'Rendre son travail reproductible', description: 'Sauvegarder les changements et vérifier les dépendances.', fiches: ['git-cycle', 'npm-ci-lockfile', 'shell-curl', 'http-cache-etag', 'node-cli-check-watch'] }] }
];

const niveaux = [
  ['Niveau 0', 'Créer, retrouver et sauvegarder un fichier ; distinguer une instruction de son résultat.'],
  ['Fondations', 'Expliquer un exemple, prédire sa sortie et corriger une erreur simple.'],
  ['Autonome', 'Réaliser une petite fonctionnalité à partir d’un besoin et consulter ses sources.'],
  ['Junior', 'Construire sans tutoriel, tester les cas limites et expliquer ses choix en revue.'],
  ['Intermédiaire', 'Découper un projet, diagnostiquer un défaut et faire évoluer les données.'],
  ['Confirmé', 'Justifier une architecture et comparer fiabilité, coût et performance.'],
  ['Professionnel', 'Préparer une livraison, vérifier les droits, observer la production et prévoir un retour arrière.'],
  ['Approfondissement', 'Mesurer et expliquer les mécanismes internes avec des expériences reproductibles.']
].map(([titre, competence], niveau) => ({ niveau, titre, competence }));

module.exports = { parcours, niveaux, fondations };
