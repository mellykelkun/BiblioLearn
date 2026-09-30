'use strict';

const { fiche, texte, code, liste, decomposition, alerte, comparaison, liens } = require('./outils');

module.exports = [
  fiche({
    id: 'node-runtime', domaine: 'node', categorie: 'Fondamentaux', titre: 'Node.js ou navigateur',
    resume: 'Situer le runtime Node.js et distinguer ses API de celles fournies par un navigateur.',
    tags: ['node', 'runtime', 'browser', 'v8', 'global', 'window'],
    sections: [
      texte('Définition', 'Node.js est un environnement d’exécution JavaScript construit autour du moteur V8. Il permet notamment de créer des serveurs, outils en ligne de commande et scripts. JavaScript est le langage ; Node.js et le navigateur sont deux environnements qui fournissent des API différentes.'),
      comparaison('Environnements', ['Capacité', 'Navigateur', 'Node.js'], [
        ['Interface de page', 'document, window, DOM', 'Absent par défaut'],
        ['Fichiers locaux', 'Accès très limité', 'node:fs'],
        ['Processus', 'Absent', 'process'],
        ['HTTP sortant', 'fetch avec règles navigateur', 'fetch et modules réseau'],
        ['Variables globales', 'globalThis, window', 'globalThis, global']
      ]),
      code('Identifier le runtime', 'JavaScript', 'console.log(process.version);\nconsole.log(process.platform);\nconsole.log(typeof document); // "undefined" dans Node.js'),
      alerte('erreur', 'Erreur fréquente', 'document is not defined signifie souvent qu’un code prévu pour le navigateur s’exécute dans Node.js. Installer une bibliothèque ne crée pas automatiquement un DOM.'),
      liens({ label: 'Node.js — Introduction', url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs' })
    ], associes: ['node-process', 'node-fs', 'js-event-loop']
  }),
  fiche({
    id: 'node-process', domaine: 'node', categorie: 'Processus', titre: 'process, arguments et variables d’environnement',
    resume: 'Lire le contexte d’exécution d’un programme Node.js et terminer avec un code explicite.',
    tags: ['process', 'argv', 'env', 'exitCode', 'environment'],
    sections: [
      code('Arguments et environnement', 'Node.js', 'const fichier = process.argv[2];\nconst port = Number(process.env.PORT) || 3000;\n\nif (!fichier) {\n  console.error("Usage : node index.js <fichier>");\n  process.exitCode = 1;\n}'),
      decomposition('Propriétés', [
        { terme: 'process.argv', explication: 'tableau : exécutable Node, chemin du script, puis arguments utilisateur.' },
        { terme: 'process.env', explication: 'objet de chaînes contenant les variables d’environnement accessibles au processus.' },
        { terme: 'process.cwd()', explication: 'dossier depuis lequel la commande a été lancée.' },
        { terme: 'process.exitCode', explication: 'code renvoyé après que le travail en attente s’est terminé.' }
      ]),
      alerte('attention', 'Valeurs d’environnement', 'Toutes les valeurs de process.env sont des chaînes ou undefined. Convertir et valider les nombres et booléens ; ne jamais supposer que "false" devient automatiquement false.'),
      alerte('bonne-pratique', 'Arrêt propre', 'Préférer process.exitCode = 1 à process.exit(1) lorsqu’un nettoyage ou des sorties asynchrones doivent encore se terminer.'),
      liens({ label: 'Node.js — Process', url: 'https://nodejs.org/api/process.html' })
    ], associes: ['node-runtime', 'npm-scripts', 'express-demarrage']
  }),
  fiche({
    id: 'node-fs', domaine: 'node', categorie: 'Système de fichiers', titre: 'Lire et écrire avec node:fs/promises',
    resume: 'Accéder aux fichiers sans bloquer la boucle d’événements et gérer encodage et erreurs.',
    tags: ['fs', 'readFile', 'writeFile', 'filesystem', 'promise', 'utf8'],
    sections: [
      code('Exemple commenté', 'Node.js', 'const { readFile, writeFile } = require("node:fs/promises");\n\nasync function ajouterVisite() {\n  // utf8 demande directement une chaîne plutôt qu’un Buffer.\n  const texte = await readFile("./stats.json", "utf8");\n  // Le fichier est du texte : on le transforme en objet JavaScript.\n  const stats = JSON.parse(texte);\n  stats.visites += 1;\n  // On réécrit un JSON lisible avec deux espaces d’indentation.\n  await writeFile("./stats.json", JSON.stringify(stats, null, 2));\n}\n\n// Une erreur de lecture ou d’écriture est traitée ici.\najouterVisite().catch(console.error);'),
      decomposition('Paramètres et retours', [
        { terme: 'readFile(chemin, "utf8")', explication: 'retourne une Promise de chaîne ; sans encodage, retourne un Buffer.' },
        { terme: 'writeFile(chemin, contenu)', explication: 'écrit en remplaçant le fichier existant et retourne une Promise sans valeur utile.' },
        { terme: 'await', explication: 'reprend avec le résultat ou lève l’erreur de la Promise.' }
      ]),
      alerte('erreur', 'Erreurs possibles', 'ENOENT indique souvent un chemin absent ; EACCES un problème de permission. Un chemin relatif est résolu depuis process.cwd(), pas forcément depuis le dossier du module.'),
      alerte('bonne-pratique', 'Serveur', 'Éviter readFileSync() et writeFileSync() dans une route HTTP : ces appels bloquent le processus pendant l’accès au disque.'),
      liens({ label: 'Node.js — File system', url: 'https://nodejs.org/api/fs.html' })
    ], associes: ['node-path', 'js-promises', 'node-process']
  }),
  fiche({
    id: 'node-path', domaine: 'node', categorie: 'Système de fichiers', titre: 'Construire un chemin avec node:path',
    resume: 'Assembler des chemins portables et distinguer dossier courant du processus et dossier du module.',
    tags: ['path', 'join', 'resolve', 'dirname', 'basename', '__dirname'],
    sections: [
      code('CommonJS', 'Node.js', 'const path = require("node:path");\n\nconst cheminPublic = path.join(__dirname, "public", "index.html");\nconst extension = path.extname(cheminPublic); // ".html"\nconst nom = path.basename(cheminPublic);      // "index.html"'),
      comparaison('join() ou resolve() ?', ['Méthode', 'Comportement', 'Usage'], [
        ['path.join()', 'Assemble et normalise les segments', 'Construire depuis une base connue'],
        ['path.resolve()', 'Produit un chemin absolu, depuis cwd si nécessaire', 'Résoudre une destination absolue'],
        ['path.dirname()', 'Retire le dernier segment', 'Obtenir le dossier parent'],
        ['path.basename()', 'Retourne le dernier segment', 'Obtenir le nom de fichier']
      ]),
      alerte('attention', 'Portabilité', 'Ne pas concaténer les chemins avec "/". path.join() gère les séparateurs et normalise . ou ...'),
      liens({ label: 'Node.js — Path', url: 'https://nodejs.org/api/path.html' })
    ], associes: ['node-fs', 'express-statique', 'node-modules']
  }),
  fiche({
    id: 'node-events', domaine: 'node', categorie: 'Événements', titre: 'EventEmitter',
    resume: 'Émettre des événements nommés et découpler un producteur de plusieurs écouteurs.',
    tags: ['events', 'eventemitter', 'emit', 'on', 'once'], niveau: 'Intermédiaire',
    sections: [
      code('Exemple', 'Node.js', 'const { EventEmitter } = require("node:events");\nconst bus = new EventEmitter();\n\nbus.on("commande:cree", (commande) => {\n  console.log(`Commande ${commande.id}`);\n});\n\nbus.emit("commande:cree", { id: 42 });'),
      texte('Fonctionnement', 'emit() appelle de façon synchrone les écouteurs enregistrés pour ce nom, dans leur ordre d’inscription. EventEmitter ne crée ni file distribuée ni persistance : si personne n’écoute, l’événement est simplement perdu.'),
      alerte('erreur', 'Événement error', 'Un EventEmitter qui émet "error" sans écouteur associé provoque une exception. Prévoir un traitement quand l’émetteur peut signaler une erreur.'),
      liens({ label: 'Node.js — Events', url: 'https://nodejs.org/api/events.html' })
    ], associes: ['dom-evenements', 'node-runtime', 'js-event-loop']
  }),
  fiche({
    id: 'node-modules', domaine: 'node', categorie: 'Modules', titre: 'CommonJS et ES Modules dans Node.js',
    resume: 'Comprendre require/module.exports et import/export, puis choisir un système cohérent.',
    tags: ['commonjs', 'esm', 'require', 'import', 'module.exports', 'type module'],
    sections: [
      code('CommonJS', 'Node.js', '// calcul.js\nfunction doubler(nombre) { return nombre * 2; }\nmodule.exports = { doubler };\n\n// app.js\nconst { doubler } = require("./calcul");'),
      code('ES Modules', 'Node.js', '// calcul.js\nexport function doubler(nombre) { return nombre * 2; }\n\n// app.js\nimport { doubler } from "./calcul.js";'),
      texte('Configuration', 'Dans Node.js, package.json avec "type": "module" traite les .js comme ES Modules. Sans ce champ, les .js sont généralement CommonJS. Les extensions .mjs et .cjs permettent un choix explicite fichier par fichier.'),
      alerte('bonne-pratique', 'Projet neuf', 'ES Modules suit le standard JavaScript. CommonJS reste important à connaître pour maintenir beaucoup de projets Node existants. Choisir un format principal et consulter la forme d’export réelle d’un package.'),
      liens({ label: 'Node.js — Modules CommonJS', url: 'https://nodejs.org/api/modules.html' }, { label: 'Node.js — ES Modules', url: 'https://nodejs.org/api/esm.html' })
    ], associes: ['js-modules', 'npm-package-json', 'node-path']
  }),
  fiche({
    id: 'npm-package-json', domaine: 'npm', categorie: 'Projet', titre: 'npm init et package.json',
    resume: 'Décrire un projet Node.js, ses commandes, son point d’entrée et ses dépendances.',
    tags: ['npm init', 'package.json', 'scripts', 'main', 'type', 'private'],
    sections: [
      code('Initialisation', 'Bash', 'npm init -y\nnpm install express\nnpm install --save-dev nodemon'),
      code('package.json minimal', 'JSON', '{\n  "name": "mon-projet",\n  "version": "1.0.0",\n  "private": true,\n  "scripts": {\n    "start": "node server.js",\n    "dev": "nodemon server.js"\n  },\n  "dependencies": {\n    "express": "^4.22.3"\n  },\n  "devDependencies": {\n    "nodemon": "^3.1.14"\n  }\n}'),
      decomposition('Champs', [
        { terme: 'name / version', explication: 'identité du package ; indispensables s’il est publié.' },
        { terme: 'private: true', explication: 'empêche une publication npm accidentelle.' },
        { terme: 'scripts', explication: 'commandes reproductibles lancées avec npm run nom.' },
        { terme: 'dependencies', explication: 'paquets requis par l’application en production.' },
        { terme: 'devDependencies', explication: 'outils nécessaires au développement ou aux tests.' }
      ]),
      liens({ label: 'npm Docs — package.json', url: 'https://docs.npmjs.com/cli/configuring-npm/package-json' })
    ], associes: ['npm-dependances', 'npm-scripts', 'node-modules']
  }),
  fiche({
    id: 'npm-dependances', domaine: 'npm', categorie: 'Packages', titre: 'dependencies et devDependencies',
    resume: 'Installer un package dans la bonne catégorie et comprendre le rôle du lockfile.',
    tags: ['npm install', 'save-dev', 'dependencies', 'devdependencies', 'package-lock'],
    sections: [
      code('Commandes', 'Bash', 'npm install express\nnpm install --save-dev nodemon\n\n# Reproduire exactement le lockfile en CI\nnpm ci'),
      comparaison('Catégories', ['Catégorie', 'Contient', 'Exemples'], [
        ['dependencies', 'Nécessaire à l’exécution', 'express, zod, pg'],
        ['devDependencies', 'Développement et qualité', 'nodemon, eslint, vitest'],
        ['peerDependencies', 'Contrat avec le projet consommateur', 'plugin React'],
        ['optionalDependencies', 'Échec d’installation toléré', 'optimisation spécifique']
      ]),
      texte('package-lock.json', 'Le lockfile décrit l’arbre précis installé, y compris les dépendances transitives et leur intégrité. Il doit généralement être versionné pour une application afin de rendre les installations reproductibles.'),
      alerte('erreur', 'Erreur fréquente', 'Modifier package.json manuellement sans actualiser package-lock.json crée un décalage. Laisser npm gérer les deux fichiers, puis vérifier le diff.'),
      liens({ label: 'npm Docs — npm install', url: 'https://docs.npmjs.com/cli/commands/npm-install' }, { label: 'npm Docs — package-lock.json', url: 'https://docs.npmjs.com/cli/configuring-npm/package-lock-json' })
    ], associes: ['npm-package-json', 'npm-semver', 'express-demarrage']
  }),
  fiche({
    id: 'npm-scripts', domaine: 'npm', categorie: 'Scripts', titre: 'Scripts npm et Nodemon',
    resume: 'Centraliser les commandes du projet et relancer le serveur automatiquement en développement.',
    tags: ['npm run', 'scripts', 'nodemon', 'dev', 'start'],
    sections: [
      code('Configuration', 'JSON', '{\n  "scripts": {\n    "start": "node server.js",\n    "dev": "nodemon server.js",\n    "check": "node --check server.js"\n  }\n}'),
      code('Utilisation', 'Bash', 'npm run dev\nnpm run check\nnpm start'),
      texte('Fonctionnement', 'npm ajoute node_modules/.bin au PATH du script. Il est donc inutile d’installer Nodemon globalement : la version du projet est utilisée, ce qui rend la commande reproductible.'),
      alerte('bonne-pratique', 'Séparer les intentions', 'start doit lancer l’application normalement. dev peut ajouter le rechargement et le diagnostic. Les outils de développement appartiennent à devDependencies.'),
      liens({ label: 'npm Docs — Scripts', url: 'https://docs.npmjs.com/cli/using-npm/scripts' }, { label: 'Nodemon — README officiel', url: 'https://github.com/remy/nodemon#nodemon' })
    ], associes: ['npm-package-json', 'node-process', 'express-demarrage']
  }),
  fiche({
    id: 'npm-semver', domaine: 'npm', categorie: 'Packages', titre: 'Versions sémantiques et plages npm',
    resume: 'Lire 2.4.1, ^2.4.1 et ~2.4.1 sans confondre version déclarée et version verrouillée.',
    tags: ['semver', 'version', 'caret', 'tilde', 'major', 'minor', 'patch'],
    sections: [
      decomposition('MAJOR.MINOR.PATCH', [
        { terme: 'MAJOR', explication: 'changement incompatible de l’API publique.' },
        { terme: 'MINOR', explication: 'fonctionnalité rétrocompatible.' },
        { terme: 'PATCH', explication: 'correction rétrocompatible.' }
      ]),
      comparaison('Plages courantes', ['Notation', 'Exemple', 'Autorise normalement'], [
        ['Version exacte', '2.4.1', 'Seulement 2.4.1'],
        ['Caret ^', '^2.4.1', '>=2.4.1 et <3.0.0'],
        ['Tilde ~', '~2.4.1', '>=2.4.1 et <2.5.0'],
        ['Astérisque', '2.x', 'Toutes les 2.* compatibles avec la plage']
      ]),
      alerte('attention', 'Version zéro', 'Avant 1.0.0, les règles du caret sont plus restrictives car une version mineure peut représenter une rupture. Toujours consulter le projet et le lockfile.'),
      liens({ label: 'npm Docs — Semantic versioning', url: 'https://docs.npmjs.com/about-semantic-versioning' })
    ], associes: ['npm-dependances', 'npm-package-json']
  }),
  fiche({
    id: 'http-requete-reponse', domaine: 'http', categorie: 'Fondamentaux', titre: 'Cycle requête-réponse HTTP',
    resume: 'Décomposer le message envoyé au serveur et la réponse qu’il retourne.',
    tags: ['http', 'request', 'response', 'url', 'headers', 'body'],
    sections: [
      texte('Définition', 'HTTP est un protocole applicatif fondé sur des messages. Un client envoie une requête composée d’une méthode, d’une cible, d’en-têtes et éventuellement d’un corps. Le serveur renvoie un statut, des en-têtes et éventuellement un corps.'),
      code('Échange simplifié', 'HTTP', 'GET /api/livres/42 HTTP/1.1\nHost: localhost:3000\nAccept: application/json\n\nHTTP/1.1 200 OK\nContent-Type: application/json; charset=utf-8\n\n{"id":42,"titre":"Le Web"}'),
      decomposition('Parties', [
        { terme: 'GET', explication: 'méthode : intention de lecture.' },
        { terme: '/api/livres/42', explication: 'cible de la ressource.' },
        { terme: 'Accept', explication: 'format que le client sait recevoir.' },
        { terme: '200 OK', explication: 'résultat de la tentative, distinct du contenu métier.' },
        { terme: 'Content-Type', explication: 'format réel du corps de réponse.' }
      ]),
      alerte('retenir', 'Sans état', 'HTTP est sans état au niveau du protocole : chaque requête doit contenir le contexte nécessaire. Cookies, sessions et jetons ajoutent une continuité au-dessus de ce mécanisme.'),
      liens({ label: 'MDN — Vue d’ensemble HTTP', url: 'https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/Overview' })
    ], associes: ['http-methodes', 'http-status', 'http-headers-cors']
  }),
  fiche({
    id: 'http-methodes', domaine: 'http', categorie: 'Méthodes', titre: 'GET, POST, PUT, PATCH et DELETE',
    resume: 'Exprimer l’intention d’une opération et comprendre sûreté et idempotence.',
    tags: ['get', 'post', 'put', 'patch', 'delete', 'idempotent', 'safe'],
    sections: [
      comparaison('Conséquences pratiques', ['Méthode', 'Intention', 'Idempotente', 'Corps courant'], [
        ['GET', 'Lire', 'Oui', 'Non'],
        ['POST', 'Créer ou déclencher', 'Non en général', 'Oui'],
        ['PUT', 'Remplacer à une URI connue', 'Oui', 'Oui, ressource complète'],
        ['PATCH', 'Modifier partiellement', 'Selon le format', 'Oui, changements'],
        ['DELETE', 'Supprimer', 'Oui', 'Rare']
      ]),
      texte('Idempotence', 'Répéter une opération idempotente produit le même état final qu’une seule exécution. Cela ne signifie pas que toutes les réponses sont identiques : un second DELETE peut renvoyer 404, mais la ressource reste absente.'),
      alerte('erreur', 'Erreur de conception', 'Un GET ne doit pas supprimer, envoyer un e-mail ou modifier un panier. Navigateurs, robots et caches peuvent répéter ou précharger des GET.'),
      liens({ label: 'MDN — Méthodes HTTP', url: 'https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Methods' })
    ], associes: ['http-rest', 'express-routes', 'html-formulaires']
  }),
  fiche({
    id: 'http-status', domaine: 'http', categorie: 'Réponses', titre: 'Codes de statut HTTP',
    resume: 'Choisir un statut qui résume correctement le résultat avant même de lire le corps.',
    tags: ['status', '200', '201', '204', '400', '404', '500'],
    sections: [
      liste('Familles', ['1xx : information provisoire.', '2xx : succès.', '3xx : redirection ou cache.', '4xx : la requête du client ne peut pas être satisfaite telle quelle.', '5xx : le serveur a échoué à traiter une requête acceptable.']),
      comparaison('Statuts utiles', ['Statut', 'Sens', 'Exemple'], [
        ['200 OK', 'Succès avec représentation', 'GET réussi'],
        ['201 Created', 'Ressource créée', 'POST avec en-tête Location'],
        ['204 No Content', 'Succès sans corps', 'DELETE réussi'],
        ['400 Bad Request', 'Requête mal formée', 'JSON invalide'],
        ['401 Unauthorized', 'Authentification requise/invalide', 'Jeton absent'],
        ['403 Forbidden', 'Identité connue mais accès refusé', 'Rôle insuffisant'],
        ['404 Not Found', 'Ressource absente', 'Identifiant inconnu'],
        ['409 Conflict', 'Conflit avec l’état courant', 'E-mail déjà utilisé'],
        ['500 Internal Server Error', 'Erreur serveur inattendue', 'Exception non gérée']
      ]),
      alerte('erreur', 'Toujours 200', 'Renvoyer 200 avec { success: false } empêche les clients, caches et outils d’observation de comprendre le résultat HTTP. Utiliser un statut approprié et un corps d’erreur stable.'),
      liens({ label: 'MDN — Codes de statut', url: 'https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Status' })
    ], associes: ['http-requete-reponse', 'express-erreurs', 'http-rest']
  }),
  fiche({
    id: 'http-headers-cors', domaine: 'http', categorie: 'En-têtes', titre: 'En-têtes HTTP et CORS',
    resume: 'Décrire les messages HTTP et comprendre pourquoi le navigateur bloque certaines origines.',
    tags: ['headers', 'content-type', 'accept', 'authorization', 'cors', 'origin'],
    sections: [
      liste('En-têtes fréquents', ['Content-Type décrit le format du corps envoyé.', 'Accept indique les formats de réponse acceptés.', 'Authorization transporte des informations d’authentification selon un schéma.', 'Cache-Control guide le stockage et la réutilisation.', 'Location désigne une ressource créée ou une redirection.', 'Origin indique l’origine d’une requête navigateur concernée par CORS.']),
      texte('CORS', 'La politique de même origine protège le navigateur. CORS est le mécanisme par lequel un serveur autorise explicitement certaines lectures depuis une autre origine. Ce n’est ni une authentification ni un pare-feu : les clients non navigateurs ne sont pas bloqués de la même façon.'),
      alerte('erreur', 'Mauvaise solution', 'Ajouter Access-Control-Allow-Origin: * partout ne corrige pas une architecture. Identifier l’origine attendue, les méthodes, en-têtes et éventuels credentials, puis autoriser le minimum.'),
      liens({ label: 'MDN — En-têtes HTTP', url: 'https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Headers' }, { label: 'MDN — CORS', url: 'https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/CORS' })
    ], associes: ['http-requete-reponse', 'js-fetch', 'express-middleware']
  }),
  fiche({
    id: 'http-rest', domaine: 'http', categorie: 'API', titre: 'Concevoir une API REST simple',
    resume: 'Modéliser des ressources avec des URL cohérentes, les méthodes HTTP et des réponses prévisibles.',
    tags: ['rest', 'api', 'resource', 'endpoint', 'crud', 'json'],
    sections: [
      code('Contrat de ressources', 'HTTP', 'GET    /api/livres       # collection\nPOST   /api/livres       # création\nGET    /api/livres/42    # élément\nPATCH  /api/livres/42    # modification partielle\nDELETE /api/livres/42    # suppression'),
      liste('Principes pratiques', ['Nommer des ressources avec des noms stables, souvent au pluriel.', 'Employer la méthode HTTP pour l’action au lieu de verbes dans toutes les URL.', 'Valider paramètres et corps à la frontière.', 'Renvoyer statuts, en-têtes et format d’erreur cohérents.', 'Prévoir pagination, filtres et tri pour les collections qui grandissent.', 'Versionner seulement lorsqu’une rupture de contrat l’exige réellement.']),
      alerte('attention', 'REST n’est pas CRUD seulement', 'REST décrit des contraintes d’architecture autour de ressources, représentations, interface uniforme et absence d’état serveur de conversation. Une API JSON avec de bonnes conventions peut être utile sans revendiquer un REST “pur”.'),
      liens({ label: 'MDN — Ressources et URI', url: 'https://developer.mozilla.org/fr/docs/Web/URI' })
    ], associes: ['http-methodes', 'http-status', 'express-routes']
  }),
  fiche({
    id: 'express-demarrage', domaine: 'express', categorie: 'Démarrage', titre: 'Créer un serveur Express',
    resume: 'Instancier une application, déclarer une réponse et écouter un port sans cacher ce qui se passe.',
    tags: ['express', 'app', 'listen', 'server', 'port'],
    sections: [
      code('Serveur minimal', 'Node.js', 'const express = require("express");\n\nconst app = express();\nconst port = Number(process.env.PORT) || 3000;\n\napp.get("/", (requete, reponse) => {\n  reponse.send("Bonjour");\n});\n\napp.listen(port, () => {\n  console.log(`Serveur : http://localhost:${port}`);\n});'),
      decomposition('Décomposition', [
        { terme: 'express()', explication: 'crée la fonction application et son système de middleware.' },
        { terme: 'app.get()', explication: 'enregistre un traitement pour GET et un chemin.' },
        { terme: 'request', explication: 'représente la requête entrante enrichie par Express.' },
        { terme: 'response', explication: 'construit et envoie la réponse HTTP.' },
        { terme: 'app.listen()', explication: 'crée un serveur HTTP qui accepte les connexions sur le port.' }
      ]),
      alerte('erreur', 'Port déjà utilisé', 'EADDRINUSE signifie qu’un processus écoute déjà ce port. Arrêter ce processus ou fournir un autre PORT ; lancer plusieurs serveurs identiques ne résout pas le conflit.'),
      liens({ label: 'Express — Hello world', url: 'https://expressjs.com/en/starter/hello-world.html' })
    ], associes: ['express-routes', 'express-middleware', 'node-process']
  }),
  fiche({
    id: 'express-routes', domaine: 'express', categorie: 'Routage', titre: 'Routes Express et paramètres',
    resume: 'Associer méthode et chemin, puis distinguer params, query et body.',
    tags: ['app.get', 'app.post', 'route', 'params', 'query', 'body'],
    sections: [
      code('Exemples commentés', 'Node.js', '// :id est un paramètre de chemin.\napp.get("/api/livres/:id", (req, res) => {\n  const id = Number(req.params.id);\n  // Les valeurs de query sont toujours des chaînes au départ.\n  const details = req.query.details === "true";\n  res.json({ id, details });\n});\n\napp.post("/api/livres", (req, res) => {\n  // express.json() doit être déclaré avant cette route.\n  res.status(201).json(req.body);\n});'),
      comparaison('Où lire la donnée ?', ['Source', 'Exemple URL/message', 'Express'], [
        ['Paramètre de chemin', '/livres/42', 'req.params.id'],
        ['Chaîne de requête', '/livres?tri=titre', 'req.query.tri'],
        ['Corps JSON', '{"titre":"…"}', 'req.body après express.json()'],
        ['En-tête', 'Authorization: Bearer …', 'req.get("authorization")']
      ]),
      alerte('erreur', 'Tout arrive non validé', 'req.params.id et req.query.page sont des chaînes. req.body vient du client. Convertir, valider les types et refuser les champs inattendus avant la logique métier.'),
      liens({ label: 'Express — Basic routing', url: 'https://expressjs.com/en/starter/basic-routing.html' }, { label: 'Express — API Request', url: 'https://expressjs.com/en/api.html#req' })
    ], associes: ['express-donnees', 'http-methodes', 'http-rest']
  }),
  fiche({
    id: 'express-middleware', domaine: 'express', categorie: 'Middleware', titre: 'app.use() et middleware',
    resume: 'Former une chaîne de traitements qui enrichit, refuse ou transmet la requête.',
    tags: ['app.use', 'middleware', 'next', 'logger', 'authentication'],
    sections: [
      code('Middleware de journalisation', 'Node.js', 'function journaliser(req, res, next) {\n  const debut = Date.now();\n\n  res.on("finish", () => {\n    console.log(req.method, req.originalUrl, res.statusCode, `${Date.now() - debut}ms`);\n  });\n\n  next();\n}\n\napp.use(journaliser);'),
      decomposition('Contrat', [
        { terme: 'req', explication: 'requête courante, partageable avec les traitements suivants.' },
        { terme: 'res', explication: 'réponse ; envoyer une réponse termine normalement le cycle.' },
        { terme: 'next()', explication: 'passe au prochain middleware ou à la prochaine route correspondante.' },
        { terme: 'app.use()', explication: 'enregistre le middleware, globalement ou sous un préfixe de chemin.' }
      ]),
      alerte('erreur', 'Requête qui ne finit jamais', 'Un middleware doit soit envoyer une réponse, soit appeler next(), soit transmettre une erreur. Oublier les trois laisse le client attendre jusqu’au timeout.'),
      alerte('bonne-pratique', 'Ordre', 'Express parcourt les middlewares dans leur ordre de déclaration. Placer le parsing avant les routes qui lisent req.body, et le gestionnaire d’erreurs après les routes.'),
      liens({ label: 'Express — Using middleware', url: 'https://expressjs.com/en/guide/using-middleware.html' })
    ], associes: ['express-donnees', 'express-erreurs', 'http-headers-cors']
  }),
  fiche({
    id: 'express-donnees', domaine: 'express', categorie: 'Middleware', titre: 'express.json() et données entrantes',
    resume: 'Parser un corps JSON, limiter sa taille et ne pas confondre parsing avec validation.',
    tags: ['express.json', 'body parser', 'req.body', 'json', 'validation'],
    sections: [
      code('Configuration', 'Node.js', 'app.use(express.json({ limit: "100kb" }));\n\napp.post("/api/utilisateurs", (req, res) => {\n  const { nom, email } = req.body;\n\n  if (typeof nom !== "string" || typeof email !== "string") {\n    return res.status(400).json({ erreur: "nom et email sont requis" });\n  }\n\n  return res.status(201).json({ nom, email });\n});'),
      texte('Fonctionnement', 'express.json() lit les requêtes dont le Content-Type correspond au JSON, transforme le texte en valeur JavaScript puis affecte req.body. Une syntaxe JSON invalide est transmise au mécanisme d’erreur.'),
      alerte('attention', 'Parsing ≠ validation', 'Un JSON valide peut contenir des types, longueurs ou propriétés interdits. req.body reste une entrée non fiable ; valider avant de l’utiliser dans une requête SQL, un fichier ou la logique métier.'),
      liens({ label: 'Express — express.json()', url: 'https://expressjs.com/en/api.html#express.json' })
    ], associes: ['express-middleware', 'express-routes', 'js-json']
  }),
  fiche({
    id: 'express-erreurs', domaine: 'express', categorie: 'Erreurs', titre: 'Gérer les erreurs dans Express',
    resume: 'Centraliser les réponses d’erreur et éviter les doubles envois ou les détails sensibles.',
    tags: ['error middleware', 'next error', '500', 'headersSent'],
    sections: [
      code('Gestionnaire final', 'Node.js', 'app.use((erreur, req, res, next) => {\n  console.error(erreur);\n\n  if (res.headersSent) {\n    return next(erreur);\n  }\n\n  return res.status(500).json({\n    erreur: "Une erreur interne est survenue"\n  });\n});'),
      decomposition('Signature spéciale', [
        { terme: '(erreur, req, res, next)', explication: 'quatre paramètres : Express reconnaît ainsi un middleware d’erreur.' },
        { terme: 'next(erreur)', explication: 'saute les middlewares ordinaires jusqu’au gestionnaire d’erreurs.' },
        { terme: 'res.headersSent', explication: 'indique qu’une partie de la réponse est déjà partie ; déléguer au gestionnaire par défaut.' }
      ]),
      alerte('erreur', 'Fuite d’information', 'Ne pas renvoyer la stack, une requête SQL ou des secrets au client en production. Journaliser le contexte côté serveur et répondre avec un message stable et non sensible.'),
      liens({ label: 'Express — Error handling', url: 'https://expressjs.com/en/guide/error-handling.html' })
    ], associes: ['js-erreurs', 'http-status', 'express-middleware']
  }),
  fiche({
    id: 'express-statique', domaine: 'express', categorie: 'Fichiers', titre: 'Servir des fichiers avec express.static()',
    resume: 'Exposer HTML, CSS, JavaScript et images depuis un dossier sans écrire une route par fichier.',
    tags: ['express.static', 'static files', 'public', 'sendFile', 'path'],
    sections: [
      code('Configuration', 'Node.js', 'const path = require("node:path");\n\nconst dossierPublic = path.join(__dirname, "public");\napp.use(express.static(dossierPublic));'),
      texte('Résultat', 'Une requête GET /styles.css peut être satisfaite par public/styles.css. Le nom du dossier public ne fait pas partie de l’URL. Express vérifie le chemin, le type de contenu et les mécanismes de cache appropriés.'),
      alerte('attention', 'Ce qui devient public', 'Tout fichier sous le dossier exposé peut être demandé par un client. Ne jamais y placer .env, secrets, sources privées ou sauvegardes.'),
      liens({ label: 'Express — Static files', url: 'https://expressjs.com/en/starter/static-files.html' })
    ], associes: ['express-demarrage', 'node-path', 'http-headers-cors']
  })
];
