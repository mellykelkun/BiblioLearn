'use strict';

const programmes = require('./nouveaux-parcours');
const environnements = require('./environnements');

const types = {
  python: ['str', 'int', 'float', 'bool', 'list', 'dict', 'None', 'fichier', 'réponse HTTP'],
  java: ['String', 'int', 'double', 'boolean', 'List', 'record', 'exception', 'fichier'],
  springboot: ['requête HTTP', 'paramètre', 'DTO JSON', 'statut', 'erreur', 'entité'],
  cpp: ['int', 'double', 'bool', 'std::string', 'std::vector', 'référence', 'fichier'],
  csharp: ['string', 'int', 'decimal', 'bool', 'List', 'record', 'Task', 'JSON'],
  php: ['string', 'int', 'float', 'bool', 'array', 'null', 'entrée HTTP', 'JSON']
};

function referenceNotion(domaine, programme, notion) {
  return {
    id: 'ref-' + domaine + '-' + notion.id,
    terme: programme.nom + ' — ' + notion.titre,
    categorie: 'Langages et frameworks',
    famille: programme.nom,
    niveau: 'Débutant → junior',
    aliases: [notion.titre, domaine + ' ' + notion.id.replaceAll('-', ' ')],
    resume: notion.idee,
    definition: notion.idee + ' Le geste central est visible dans l’exemple ; il faut aussi prévoir le résultat nominal et le cas qui échoue.',
    article: [
      programme.contexte,
      'Dans un projet : ' + notion.application,
      'Le résultat attendu est : ' + notion.attendu + ' Un résultat doit être converti seulement à la frontière où la couche suivante en a besoin.'
    ],
    roles: [
      'Comprendre cette notion permet de : ' + notion.application,
      'Elle transforme une entrée typée en un résultat vérifiable avant son affichage, sa transmission ou son stockage.'
    ],
    pourquoiUtiliser: [notion.idee, 'Une vérification concrète rend le comportement reproductible : ' + notion.attendu],
    nePasUtiliser: ['N’utilisez pas ce fragment hors du runtime ou du projet décrit dans la préparation.', 'Ne remplacez pas la validation des données réelles par la réussite de l’exemple minimal.'],
    avertissements: [notion.panne, 'La console, l’API et le stockage ne sont pas la même destination : ne transmettez que les champs nécessaires.', 'Les versions des outils évoluent ; contrôlez la documentation officielle et la commande de vérification.'],
    scenarios: [
      { cas: 'Comprendre le premier résultat', decision: 'Exécuter le fragment dans un dossier d’essai', pourquoi: notion.attendu, application: notion.application },
      { cas: 'L’entrée est absente ou incorrecte', decision: 'Reproduire puis traiter le cas limite', pourquoi: notion.panne, application: 'Afficher une erreur utile sans secret.' },
      { cas: 'Le résultat rejoint un autre module', decision: 'Documenter type, conversion et propriétaire de la validation', pourquoi: 'Une frontière explicite évite les ambiguïtés.', application: notion.application }
    ],
    structure: [programme.contexte, 'Placez ce comportement dans un module nommé après l’avoir vérifié isolément ; gardez le code d’entrée/sortie séparé de la règle.', 'Dans un projet partagé, ajoutez un test du résultat et du cas limite.'],
    typesDonnees: types[domaine],
    cycleDonnees: 'Entrée de ' + notion.titre + ' → validation du type et de la forme → traitement → ' + notion.attendu + ' → affichage, transport ou stockage selon le scénario. ' + notion.panne,
    exemples: [{ titre: 'Point de départ : ' + notion.titre, langage: programme.langage, contenu: notion.code, explication: notion.attendu + ' Cas à reproduire : ' + notion.panne }],
    exercice: {
      duree: '30 min',
      objectif: 'Tester ' + notion.titre + ' avant de le placer dans un projet.',
      contexte: notion.application,
      etapes: ['Préparez le runtime indiqué et notez la commande qui vérifie sa présence.', 'Reproduisez le code et prédisez : ' + notion.attendu, 'Reproduisez le cas limite : ' + notion.panne, 'Écrivez où la valeur doit être validée et quel résultat peut être transmis.'],
      validation: [notion.attendu, 'Le cas limite est expliqué sans masquer le diagnostic.', 'La donnée transmise ne contient que les champs nécessaires.']
    },
    environnement: environnements.domaines[domaine],
    associes: [],
    liens: [{ label: 'Documentation officielle — ' + programme.nom, url: programme.source }]
  };
}

function referenceLangage(domaine, programme) {
  return {
    id: 'ref-langage-' + domaine, terme: programme.nom, categorie: 'Langages et frameworks', famille: programme.nom, niveau: 'Débutant',
    aliases: [domaine, programme.nom + ' environnement'],
    resume: programme.contexte, definition: programme.contexte + ' Son installation, son mode d’exécution et ses premiers pièges doivent être compris avant de choisir une bibliothèque.',
    article: [programme.contexte, 'Commencez par une leçon de base, puis traitez une entrée réelle et un cas d’échec. Les dix notions associées couvrent les valeurs, la logique, les données et la qualité.', 'Choisissez cet environnement quand ses contraintes de déploiement, d’équipe et de données conviennent au projet ; évitez de l’adopter uniquement parce qu’un exemple le montre.'],
    roles: [programme.contexte, 'Fournir un environnement pour écrire, vérifier et exécuter le code.', 'Transmettre un résultat typé à la couche suivante.'],
    pourquoiUtiliser: ['Le programme peut être développé et testé selon un cycle reproductible.', 'La documentation officielle décrit les versions et les prérequis réels.'],
    nePasUtiliser: ['N’ajoutez pas cet environnement à un projet qui n’en a pas besoin.', 'N’installez pas une chaîne complète pour lire une simple référence.'],
    avertissements: ['Un éditeur ne remplace pas le runtime ou le compilateur.', 'Les instructions diffèrent entre Windows, Linux et macOS ; choisissez le système et le shell réels.'],
    scenarios: [
      { cas: 'Découverte', decision: 'Installer l’outil officiel et vérifier sa version', pourquoi: 'Écarter un problème de poste avant de déboguer le code.', application: 'Premier exemple local.' },
      { cas: 'Projet d’équipe', decision: 'Versionner manifeste et tests', pourquoi: 'Rendre la construction reproductible.', application: 'Livraison partagée.' },
      { cas: 'Production', decision: 'Choisir runtime, sécurité et observabilité selon le besoin', pourquoi: 'Le code seul ne garantit pas l’exploitation.', application: 'Service utilisé par des visiteurs.' }
    ],
    structure: [programme.contexte, 'Organiser les modules par responsabilité et séparer entrée, logique, sortie et configuration.'],
    typesDonnees: types[domaine],
    cycleDonnees: 'Entrée → validation → logique dans ' + programme.nom + ' → résultat typé → réponse, fichier ou autre service. Ne transmettez pas de secret inutile.',
    exemples: [{ titre: 'Premier exemple', langage: programme.langage, contenu: programme.sujets[0].code, explication: programme.sujets[0].attendu }],
    exercice: { duree: '30 min', objectif: 'Démarrer ' + programme.nom + ' sur votre système.', contexte: 'Préparer un poste d’apprentissage sans modifier un projet existant.', etapes: ['Lisez la préparation propre à votre système.', 'Vérifiez la version de l’outil.', 'Exécutez le premier exemple dans un dossier isolé.', 'Notez le résultat et un échec rencontré.'], validation: ['L’outil répond à sa commande de vérification.', 'Le premier résultat est expliqué.', 'Le dossier d’essai est isolé.'] },
    environnement: environnements.domaines[domaine], associes: [],
    liens: [{ label: 'Documentation officielle — ' + programme.nom, url: programme.source }]
  };
}

function referenceOutil(id, outil) {
  const exempleWindows = outil.verifier.windows;
  const exempleUnix = outil.verifier.linux;
  return {
    id: 'ref-outil-' + id, terme: outil.nom, categorie: 'Installation et outils', famille: 'Poste de développement', niveau: 'Débutant',
    aliases: outil.references,
    resume: outil.role, definition: outil.role + ' ' + outil.pourquoi,
    article: [outil.pourquoi, 'Windows : ' + outil.systemes.windows.ouvrir, 'Linux : ' + outil.systemes.linux.ouvrir, 'macOS : ' + outil.systemes.mac.ouvrir],
    roles: [outil.role, 'Confirmer que la commande est accessible dans le terminal réellement utilisé.', 'Fournir un environnement reproductible avant les ateliers.'],
    pourquoiUtiliser: [outil.pourquoi, 'Une commande de version ou de contrôle distingue l’installation du bon fonctionnement de l’exercice.'],
    nePasUtiliser: ['N’installez pas cet outil si le parcours choisi ne le demande pas.', 'Ne modifiez pas votre configuration système pour masquer une erreur de dossier ou de projet.'],
    avertissements: [outil.attention, outil.systemes.windows.diagnostic, outil.systemes.linux.diagnostic],
    scenarios: [
      { cas: 'Windows', decision: outil.systemes.windows.ouvrir, pourquoi: outil.systemes.windows.diagnostic, application: exempleWindows },
      { cas: 'Linux', decision: outil.systemes.linux.ouvrir, pourquoi: outil.systemes.linux.diagnostic, application: exempleUnix },
      { cas: 'macOS', decision: outil.systemes.mac.ouvrir, pourquoi: outil.systemes.mac.diagnostic, application: outil.verifier.mac }
    ],
    structure: ['Installez l’outil hors du dépôt, puis conservez dans le projet seulement les fichiers de configuration et les dépendances nécessaires.', 'Notez la version requise dans le README ou le manifeste.'],
    typesDonnees: ['version', 'fichier', 'commande', 'code de sortie', 'message de diagnostic'],
    cycleDonnees: 'Choix du système → installation officielle → nouveau terminal → commande de vérification → petit exercice → lecture du résultat et de l’erreur.',
    exemples: [{ titre: 'Vérifier sur Windows PowerShell', langage: 'PowerShell', contenu: exempleWindows, explication: 'Cette vérification ne déploie ni ne supprime de fichier.' }, { titre: 'Vérifier sur Linux/macOS', langage: 'Bash / zsh', contenu: exempleUnix, explication: 'Si la commande est introuvable, lisez le diagnostic du système avant de réinstaller.' }],
    exercice: { duree: '25 min', objectif: 'Préparer et contrôler ' + outil.nom + '.', contexte: 'Un atelier demande un outil que votre terminal ne voit pas encore.', etapes: ['Lisez la procédure correspondant à votre système.', 'Installez depuis la source officielle si nécessaire.', 'Rouvrez le terminal et lancez la commande de vérification.', 'Notez le chemin, le résultat et une erreur possible.'], validation: ['La commande de vérification répond.', 'Le terminal et le dossier utilisés sont identifiés.', 'Aucun script inconnu ni secret n’a été exposé.'] },
    environnement: [id], associes: [],
    liens: outil.sources
  };
}

module.exports = [
  ...Object.entries(programmes).flatMap(([domaine, programme]) => [
    referenceLangage(domaine, programme),
    ...programme.sujets.map((notion) => referenceNotion(domaine, programme, notion))
  ]),
  ...Object.entries(environnements.outils).map(([id, outil]) => referenceOutil(id, outil))
];
