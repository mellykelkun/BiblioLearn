'use strict';

const fondations = [
  { titre: 'Construire une page lisible', description: 'Donner un sens aux titres, au texte et aux liens.', fiches: ['html-document', 'html-texte-listes', 'html-attributs', 'html-liens-images', 'html-semantique', 'html-formulaires'] },
  { titre: 'Organiser une page sur tous les écrans', description: 'Comprendre les dimensions avant de choisir une disposition.', fiches: ['css-selecteurs', 'css-box-model', 'css-typographie', 'css-flexbox', 'css-grid', 'css-responsive'] },
  { titre: 'Réagir aux actions du lecteur', description: 'Manipuler des valeurs, puis relier les instructions à la page.', fiches: ['js-variables', 'js-types', 'js-egalite', 'js-conditions', 'js-fonctions', 'js-tableaux', 'js-boucles', 'dom-selection', 'dom-modification', 'dom-evenements', 'dom-formulaires'] },
  { titre: 'Échanger des données avec un serveur', description: 'Suivre une demande, une réponse et les erreurs possibles.', fiches: ['js-json', 'js-erreurs', 'js-callbacks', 'js-synchronisme', 'js-promises', 'http-requete-reponse', 'http-methodes', 'http-status', 'js-fetch', 'node-runtime', 'npm-package-json', 'express-demarrage', 'express-routes', 'express-donnees'] }
];
const parcours = [
  { id: 'zero', titre: 'Commencer sans avoir jamais codé', niveau: 'Niveau 0', competence: 'Retrouver un fichier, expliquer une demande web et diagnostiquer une première erreur.', etapes: [{ titre: 'Prendre ses premiers repères', description: 'Aucun langage ni outil de programmation à connaître au départ.', fiches: ['zero-ordinateur', 'zero-fichiers', 'zero-programme', 'zero-page-complete', 'zero-web', 'zero-terminal', 'zero-naviguer-dossiers', 'zero-outils', 'zero-erreurs', 'zero-sauvegarde'] }, ...fondations] },
  { id: 'fondations', titre: 'Reprendre les fondamentaux du web', niveau: 'Fondations', competence: 'Construire une page, la rendre interactive et expliquer ses échanges réseau.', etapes: fondations },
  { id: 'frontend', titre: 'Construire une interface utilisable', niveau: 'Autonome → junior', competence: 'Livrer une interface lisible sur mobile et au clavier, avec des erreurs compréhensibles.', etapes: [...fondations.slice(0, 3), { titre: 'Fiabiliser l’interface', description: 'Tester le clavier, les données et les chargements.', fiches: ['html-focus-accessible', 'js-fetch', 'javascript-abort-controller', 'typescript-types', 'typescript-frontiere-api'] }] },
  { id: 'backend', titre: 'Construire et protéger un service', niveau: 'Junior → intermédiaire', competence: 'Valider une entrée, contrôler les droits et tester les réponses normales et en erreur.', etapes: [{ titre: 'Comprendre les échanges', description: 'Suivre une donnée du client au serveur.', fiches: ['http-requete-reponse', 'http-methodes', 'http-status', 'node-runtime', 'node-fs', 'npm-package-json'] }, { titre: 'Traiter les demandes', description: 'Délimiter routes, traitement et erreurs.', fiches: ['express-demarrage', 'express-routes', 'express-donnees', 'express-middleware', 'express-erreurs', 'express-securite-base', 'http-cookies-sessions', 'php-pdo'] }] },
  { id: 'fullstack', titre: 'Relier une interface à son service', niveau: 'Junior → intermédiaire', competence: 'Tracer une donnée de sa saisie à sa réponse et vérifier chaque frontière.', etapes: fondations.concat({ titre: 'Protéger le trajet des données', description: 'Vérifier types, erreurs et autorisations.', fiches: ['typescript-frontiere-api', 'express-erreurs', 'express-securite-base', 'http-cookies-sessions'] }) },
  { id: 'systemes', titre: 'Exécuter et diagnostiquer un programme', niveau: 'Autonome → intermédiaire', competence: 'Retrouver un fichier, expliquer un processus, lire une erreur et reproduire une installation.', etapes: [{ titre: 'Se repérer et exécuter', description: 'Comprendre une commande avant de la lancer.', fiches: ['shell-premier-terminal', 'shell-pwd-ls-cd', 'shell-installer-verifier-outil', 'shell-env-path', 'node-process', 'shell-permissions'] }, { titre: 'Rendre son travail reproductible', description: 'Sauvegarder les changements et vérifier les dépendances.', fiches: ['git-cycle', 'npm-ci-lockfile', 'shell-curl', 'http-cache-etag', 'node-cli-check-watch'] }] }
];

// Chaque parcours spécialisé va du premier programme à un cas de qualité plus
// exigeant. Les preuves décrivent un résultat observable, pas un titre acquis.
function etape(titre, description, fiches, preuve) { return { titre, description, fiches, preuve }; }
parcours.push(
  { id: 'python', titre: 'Programmer et traiter des données avec Python', niveau: 'Niveau 0 → confirmé', competence: 'Écrire un script, traiter des fichiers et des données, puis tester une règle et une transaction.', suite: 'springboot', etapes: [
    etape('Se placer et exécuter', 'Un dossier, un interpréteur, une sortie observable.', ['zero-naviguer-dossiers', 'shell-premier-terminal', 'python-variables-types', 'python-conditions', 'python-listes-boucles'], 'Lancer un fichier .py et expliquer sa sortie pour trois entrées.'),
    etape('Écrire une logique réutilisable', 'Séparer valeurs, fonctions et données nommées.', ['python-fonctions', 'python-dictionnaires', 'python-exceptions', 'python-chemins-erreurs'], 'Une fonction rend un résultat et signale distinctement une entrée invalide.'),
    etape('Gérer ressources et dépendances', 'Lire un fichier, choisir un environnement et observer HTTP.', ['python-fichiers-json', 'python-venv-pip', 'python-http-client'], 'Le script fonctionne depuis le dossier annoncé et explique une panne de fichier ou de réseau.'),
    etape('Fiabiliser les données', 'Tester les limites, défendre un invariant et grouper les écritures.', ['python-tests', 'python-dataclass-invariant', 'python-sqlite-transaction'], 'Un test échoue sur une donnée invalide ; une transaction n’écrit pas à moitié.')
  ] },
  { id: 'java', titre: 'Construire des programmes typés avec Java', niveau: 'Débutant → confirmé', competence: 'Compiler un programme, modéliser ses données et traiter les absences sans masquer les pannes.', suite: 'springboot', etapes: [
    etape('Compiler sans deviner', 'Relier fichier, classe, package et exécution.', ['java-jdk-main', 'java-fichier-classe-package', 'java-types', 'java-conditions'], 'Compiler puis exécuter depuis le bon dossier ; expliquer une erreur de nom de classe.'),
    etape('Structurer la logique', 'Méthodes, records, interfaces et collections.', ['java-listes', 'java-methodes', 'java-classes-records', 'java-interfaces', 'java-map-frequences'], 'Une classe transmet un résultat typé et un compteur traite une clé absente.'),
    etape('Lire et transformer', 'Fichiers, flux, exceptions et absence.', ['java-fichiers', 'java-exceptions', 'java-streams', 'java-optional-absence'], 'Un fichier absent et une recherche vide donnent deux traitements distincts.')
  ] },
  { id: 'springboot', titre: 'Créer un service HTTP avec Java et Spring Boot', niveau: 'Autonome → professionnel', competence: 'Livrer des routes bornées, des DTO publics et des tests de règles et de réponses.', suite: 'fullstack-java', etapes: [
    etape('Mettre en route', 'Projet généré, routes et paramètres.', ['java-jdk-main', 'springboot-initializr', 'springboot-controller-get', 'springboot-path-variable', 'springboot-query-param'], 'GET répond sur la route annoncée et une valeur de chemin est contrôlée.'),
    etape('Définir le contrat API', 'Entrée validée, sortie limitée, erreur cohérente.', ['springboot-json-dto', 'springboot-validation', 'springboot-erreurs-http', 'springboot-pagination-borne', 'springboot-dto-frontiere'], 'Une requête invalide reçoit 400 ; aucun champ privé ne sort dans le JSON.'),
    etape('Distinguer métier et stockage', 'Service testable, repository et base de développement.', ['springboot-service', 'springboot-repository', 'springboot-service-test-isole', 'springboot-tests'], 'Les tests démontrent une règle et un cas HTTP sans dépendre d’une base de production.')
  ] },
  { id: 'cpp', titre: 'Comprendre compilation, mémoire et propriété en C++', niveau: 'Débutant → confirmé', competence: 'Construire un binaire, choisir des structures sûres et expliquer la durée de vie des objets.', suite: 'systemes', etapes: [
    etape('Compiler et lire les types', 'Séparer source, compilation et exécution.', ['cpp-compiler-main', 'cpp-compilation-liaison', 'cpp-types', 'cpp-conditions'], 'Le même code source compile avec les options annoncées et ses résultats sont prédits.'),
    etape('Organiser les données', 'Vecteurs, fonctions, classes et références.', ['cpp-vector', 'cpp-vector-borne', 'cpp-fonctions', 'cpp-references', 'cpp-classes'], 'Une entrée hors borne ne provoque pas un accès mémoire indéfini.'),
    etape('Gérer les ressources', 'Algorithmes, fichiers, RAII et propriété.', ['cpp-algorithmes', 'cpp-fichiers', 'cpp-raii', 'cpp-unique-ptr-propriete'], 'Un objet et sa ressource sont libérés à la bonne portée sans copie de propriétaire.')
  ] },
  { id: 'csharp', titre: 'Écrire des applications fiables avec C# et .NET', niveau: 'Débutant → confirmé', competence: 'Créer un projet, contrôler les valeurs absentes et attendre une opération avec annulation.', suite: 'systemes', etapes: [
    etape('Démarrer le SDK', 'Comprendre projet, programme et types.', ['csharp-sdk-console', 'csharp-projet-programme', 'csharp-types-null', 'csharp-conditions'], 'dotnet run lance le projet et une saisie mal formée ne devient pas un nombre.'),
    etape('Faire circuler les données', 'Méthodes, collections, records, JSON et fichiers.', ['csharp-methodes', 'csharp-collections-linq', 'csharp-records', 'csharp-json', 'csharp-fichiers'], 'Une sortie JSON expose seulement les champs choisis.'),
    etape('Traiter les limites', 'Exceptions, null, asynchronisme et annulation.', ['csharp-exceptions', 'csharp-nullable-frontiere', 'csharp-async', 'csharp-annulation-task'], 'Une valeur absente et une annulation attendue produisent des comportements distincts.')
  ] },
  { id: 'php', titre: 'Construire des réponses web et manipuler les données avec PHP', niveau: 'Débutant → confirmé', competence: 'Traiter un formulaire, écrire avec PDO et protéger les secrets des comptes.', suite: 'fullstack-php', etapes: [
    etape('Exécuter et raisonner', 'CLI, variables, conditions et fonctions.', ['php-cli', 'php-types', 'php-conditions', 'php-tableaux', 'php-fonctions'], 'Un fichier PHP s’exécute dans le bon contexte et transmet une valeur par return.'),
    etape('Répondre à une requête', 'Formulaires, échappement et JSON.', ['html-formulaires', 'php-formulaires', 'php-formulaire-sortie', 'php-json'], 'Une valeur saisie s’affiche comme texte et une erreur porte le bon statut.'),
    etape('Stocker et protéger', 'Fichiers, Composer, PDO et comptes.', ['php-fichiers', 'php-composer', 'php-pdo', 'php-pdo-transaction', 'php-password-hash'], 'Une écriture incomplète est annulée ; le mot de passe n’est jamais stocké en clair.')
  ] },
  { id: 'vue', titre: 'Créer une interface avec Vue', niveau: 'Fondations → autonome', competence: 'Construire un composant réactif et isoler une logique testable.', suite: 'fullstack', etapes: [
    etape('Préparer la page', 'Structure et état initial lisibles.', ['html-document', 'css-responsive', 'vue-composants'], 'La page fonctionne sur écran étroit et au clavier.'),
    etape('Gérer et dériver l’état', 'Réactivité, valeur calculée et composable.', ['vue-reactivite', 'vue-valeur-derivee', 'vue-composables-testables', 'vue-liste-identite', 'vue-formulaire-modele'], 'Un changement d’entrée actualise la valeur dérivée ; un tri conserve la saisie de chaque ligne.')
  ] },
  { id: 'angular', titre: 'Structurer une interface avec Angular', niveau: 'Fondations → autonome', competence: 'Relier composant, service et formulaire contrôlé avec une vérification isolée.', suite: 'fullstack', etapes: [
    etape('Lire un composant', 'Template, imports et données.', ['typescript-types', 'angular-composants', 'angular-imports-autonomes'], 'Le template utilise seulement les dépendances déclarées.'),
    etape('Séparer et valider', 'Service, formulaire et test.', ['angular-services', 'angular-signal-derive', 'angular-formulaires-reactifs', 'angular-formulaire-test-limite', 'angular-services-tests'], 'Une entrée invalide reste refusée et la règle du service est testée.')
  ] },
  { id: 'react-next', titre: 'Construire et livrer une interface avec React et Next.js', niveau: 'Fondations → intermédiaire', competence: 'Choisir l’emplacement de l’état et le rendu d’une page selon le besoin.', suite: 'fullstack', etapes: [
    etape('Construire les composants', 'Choix du framework, props, état, effets et rendu accessible.', ['frontend-choisir', 'react-composants', 'react-etat', 'react-effets', 'react-etat-derive', 'react-architecture-etat', 'react-accessibilite-rendu', 'react-formulaire-etats', 'react-key-reinitialisation'], 'Une interaction produit une mise à jour sans état contradictoire et utilisable au clavier.'),
    etape('Rendre et charger', 'Routes, données, cache et états d’erreur.', ['next-routage', 'next-rendu', 'next-frontiere-composants', 'next-cache-donnees', 'next-etats-chargement-erreurs', 'nextjs-route-handler-validation'], 'Le chargement, l’absence et l’erreur ont chacun une réponse visible ; une API rejette une entrée invalide.')
  ] },
  { id: 'typescript', titre: 'Rendre les contrats de données explicites avec TypeScript', niveau: 'Fondations → intermédiaire', competence: 'Décrire les types, contrôler une entrée inconnue et transmettre succès ou erreur sans cast trompeur.', suite: 'react-next', etapes: [
    etape('Écrire les premières formes', 'Types, réduction et génériques.', ['typescript-types', 'typescript-narrowing', 'typescript-generiques'], 'Le compilateur refuse un appel qui mélange texte et nombre.'),
    etape('Défendre les frontières', 'Configuration stricte, données inconnues et résultat discriminé.', ['typescript-configuration-stricte', 'typescript-frontiere-unknown', 'typescript-frontiere-api', 'typescript-union-resultat', 'typescript-types-utilitaires'], 'Une réponse JSON inattendue est refusée à l’exécution et son échec est typé.')
  ] },
  { id: 'sql', titre: 'Questionner et protéger des données avec SQL', niveau: 'Fondations → confirmé', competence: 'Créer un schéma, lire et relier ses données, puis contrôler intégrité, transaction et plan de requête.', suite: 'fullstack-php', etapes: [
    etape('Définir et lire', 'Table, colonnes, filtres et valeurs liées.', ['sql-table-contrainte', 'sql-select-where', 'sql-parametre'], 'Une requête retourne seulement les colonnes utiles et une entrée externe ne modifie pas le SQL.'),
    etape('Relier et compter', 'Jointure, groupe, ordre et page.', ['sql-jointure', 'sql-grouper-compter', 'sql-ordre-pagination'], 'Un livre rejoint le bon auteur ; une page possède un ordre stable.'),
    etape('Garantir et évoluer', 'Clé étrangère, transaction, index et migration.', ['sql-cle-etrangere', 'sql-transaction', 'sql-index-plan', 'sql-migration-donnees'], 'Une écriture invalide est refusée ; une opération incomplète est annulée et un index est justifié par un plan.')
  ] },
  { id: 'fullstack-java', titre: 'Relier une interface web à une API Java', niveau: 'Autonome → professionnel', competence: 'Suivre une saisie HTML jusqu’à une réponse Spring Boot validée et testée.', etapes: [
    etape('Créer le contrat côté navigateur', 'HTML, interaction et HTTP.', ['html-formulaires', 'dom-formulaires', 'http-requete-reponse', 'js-fetch'], 'La requête envoyée correspond aux champs annoncés et gère un 400.'),
    etape('Traiter et vérifier côté serveur', 'DTO, service, persistance et cas d’erreur.', ['springboot-json-dto', 'springboot-validation', 'springboot-service', 'springboot-repository', 'springboot-tests', 'springboot-pagination-borne'], 'Le même cas est vérifié de la saisie à la réponse, y compris une entrée invalide.')
  ] },
  { id: 'fullstack-php', titre: 'Relier une interface web à PHP', niveau: 'Fondations → confirmé', competence: 'Envoyer un formulaire, valider au serveur et stocker sans concaténer les entrées au SQL.', etapes: [
    etape('Comprendre la frontière', 'Structure du formulaire et transfert HTTP.', ['html-formulaires', 'html-formulaire-transmission', 'http-methodes', 'php-formulaires'], 'Une requête directe invalide est rejetée même si le navigateur accepte le formulaire.'),
    etape('Produire une réponse sûre', 'Sortie HTML, JSON et stockage.', ['php-formulaire-sortie', 'php-json', 'php-pdo', 'php-pdo-transaction', 'php-password-hash'], 'Le texte saisi ne devient pas du HTML et la base reste cohérente après un échec.')
  ] }
);

const groupesParcours = {
  'Commencer': ['zero', 'fondations'],
  'Fondations web': ['html', 'css', 'javascript', 'dom'],
  'Interfaces': ['frontend', 'typescript', 'react-next', 'vue', 'angular', 'css-outils'],
  'Services et full-stack': ['backend', 'node-npm', 'http-express', 'springboot', 'fullstack', 'fullstack-java', 'fullstack-php'],
  'Langages': ['python', 'java', 'cpp', 'csharp', 'php'],
  'Données et outils': ['sql', 'shell', 'terminal-git', 'systemes']
};

parcours.push(
  { id: 'html', titre: 'Structurer une page accessible avec HTML', niveau: 'Niveau 0 → autonome', competence: 'Écrire une page complète, un formulaire utilisable et une structure qui garde son sens sans styles.', suite: 'css', etapes: [
    etape('Créer le document', 'Document, texte, attributs, liens et images.', ['zero-page-complete', 'html-document', 'html-texte-listes', 'html-attributs', 'html-liens-images'], 'La page s’ouvre localement, possède un titre et des liens utilisables au clavier.'),
    etape('Donner le bon sens', 'Sections, tableaux et éléments natifs.', ['html-semantique', 'html-tableaux', 'html-dialog-details', 'html-obsolete'], 'Chaque élément correspond au rôle de son contenu ; aucun élément obsolète ne remplace une structure adaptée.'),
    etape('Faire saisir sans perdre l’utilisateur', 'Formulaire, transmission et focus.', ['html-formulaires', 'html-formulaire-transmission', 'html-focus-accessible'], 'Un champ lié à son label transmet la clé attendue et le focus reste visible.')
  ] },
  { id: 'css', titre: 'Composer une présentation CSS robuste', niveau: 'Fondations → intermédiaire', competence: 'Expliquer la cascade et produire une mise en page lisible à différentes tailles et directions.', suite: 'javascript', etapes: [
    etape('Comprendre les règles', 'Sélecteurs, cascade, dimensions et typographie.', ['css-selecteurs', 'css-box-model', 'css-typographie', 'css-cascade-debug'], 'Une déclaration inattendue est expliquée dans les outils du navigateur avant correction.'),
    etape('Placer les éléments', 'Flexbox, Grid et adaptation.', ['css-flexbox', 'css-grid', 'css-responsive'], 'La page ne déborde pas à 320 px et l’ordre de lecture reste cohérent.'),
    etape('Rendre le composant adaptable', 'Variables, conteneurs et propriétés logiques.', ['css-variables', 'css-container-queries', 'css-proprietes-logiques'], 'Un composant s’adapte à son conteneur et à la direction du texte sans duplication excessive.')
  ] },
  { id: 'javascript', titre: 'Raisonner et programmer en JavaScript', niveau: 'Fondations → confirmé', competence: 'Écrire des fonctions qui rendent une valeur, traiter les données et expliquer l’asynchronisme.', suite: 'dom', etapes: [
    etape('Suivre les valeurs', 'Variables, types, égalité, conditions et boucles.', ['js-variables', 'js-types', 'js-egalite', 'js-conditions', 'js-boucles', 'js-retour-portee'], 'Pour trois entrées, le résultat de chaque branche est prédit puis vérifié.'),
    etape('Transformer les données', 'Fonctions, tableaux, objets et formats.', ['js-fonctions', 'js-tableaux', 'js-map-filter-reduce', 'js-objets', 'js-destructuration-avancee', 'js-json'], 'Une fonction pure transforme une collection sans confondre affichage et retour.'),
    etape('Gérer le temps et les erreurs', 'Callbacks, promesses, fetch, annulation et boucle d’événements.', ['js-erreurs', 'js-callbacks', 'js-synchronisme', 'js-promises', 'js-fetch', 'javascript-abort-controller', 'js-event-loop'], 'Une requête lente, absente ou annulée produit un état distinct et compréhensible.'),
    etape('Organiser et formater', 'Modules, expressions régulières et dates.', ['js-modules', 'js-regexp-pratique', 'js-date-intl'], 'Le code est réparti en modules et les cas limites de format sont testés.')
  ] },
  { id: 'dom', titre: 'Relier JavaScript aux interactions de la page', niveau: 'Fondations → intermédiaire', competence: 'Lire et modifier le DOM, gérer un formulaire et distinguer cible et propagation d’un événement.', suite: 'frontend', etapes: [
    etape('Sélectionner et modifier', 'Nœuds, texte et état visible.', ['dom-selection', 'dom-modification'], 'Une donnée saisie apparaît comme texte, sans interprétation HTML involontaire.'),
    etape('Répondre aux actions', 'Événements, formulaire et délégation.', ['dom-evenements', 'dom-formulaires', 'dom-delegation', 'dom-evenement-cible'], 'Un clic sur un élément enfant déclenche l’action correcte et le formulaire gère une entrée invalide.'),
    etape('Observer un changement externe', 'MutationObserver et coût d’observation.', ['dom-mutation-observer'], 'L’observation s’arrête quand elle n’est plus nécessaire et ne crée pas de boucle de mutations.')
  ] },
  { id: 'node-npm', titre: 'Exécuter et organiser un projet Node.js', niveau: 'Fondations → intermédiaire', competence: 'Distinguer processus, chemins et modules, puis reproduire les dépendances avec npm.', suite: 'http-express', etapes: [
    etape('Comprendre le processus', 'Runtime, dossier courant, chemins et fichiers.', ['node-runtime', 'node-process', 'node-path', 'node-fs', 'node-chemins-processus'], 'Le script retrouve sa ressource même lorsqu’il est lancé depuis un autre dossier.'),
    etape('Faire circuler le travail', 'Modules, événements, flux et vérification CLI.', ['node-modules', 'node-events', 'node-streams', 'node-cli-check-watch'], 'Un gros fichier est traité sans supposer qu’il tient entièrement en mémoire.'),
    etape('Rendre l’installation reproductible', 'Manifeste, versions, scripts et lockfile.', ['npm-package-json', 'npm-init-install', 'npm-dependances', 'npm-semver', 'npm-scripts', 'npm-cli-scripts', 'npm-ci-lockfile', 'npm-script-verification'], 'Un autre poste peut installer et lancer le même script depuis le manifeste et le lockfile.'),
    etape('Entretenir et publier prudemment', 'Audit, mises à jour et distribution.', ['npm-update-outdated-audit', 'npm-publish-package'], 'La version publiée et ses fichiers sont vérifiés avant de rendre le package public.')
  ] },
  { id: 'http-express', titre: 'Comprendre HTTP et écrire une API Express', niveau: 'Fondations → professionnel', competence: 'Construire une API qui distingue les statuts, valide les entrées et protège chaque frontière.', suite: 'fullstack', etapes: [
    etape('Lire le protocole', 'Requête, méthode, statut et en-têtes.', ['http-requete-reponse', 'http-methodes', 'http-status', 'http-contrat-reponse', 'http-headers-cors'], 'Le client explique la différence entre 200, 400, 404 et 500 sans lire uniquement le corps.'),
    etape('Définir le contrat', 'REST, cache, session et cookies.', ['http-rest', 'http-cache-etag', 'http-cookies-sessions'], 'Une ressource absente, une réponse mise en cache et une session expirée ont des traitements distincts.'),
    etape('Construire le serveur', 'Routes, middleware, données et fichiers.', ['express-demarrage', 'express-routes', 'express-middleware', 'express-donnees', 'express-statique'], 'Une route normale et une route invalide produisent les statuts et corps annoncés.'),
    etape('Valider et protéger', 'Entrées, erreurs et contrôle des droits.', ['express-frontiere-entree', 'express-erreurs', 'express-securite-base'], 'Une entrée mal formée n’est pas écrite et une erreur interne ne révèle aucun secret.')
  ] },
  { id: 'terminal-git', titre: 'Se repérer, diagnostiquer et versionner au terminal', niveau: 'Niveau 0 → autonome', competence: 'Naviguer sans risque, lire une sortie, utiliser les chemins et conserver un historique Git.', suite: 'systemes', etapes: [
    etape('Ouvrir et se placer', 'Différences PowerShell/Bash et dossier courant.', ['zero-terminal', 'zero-naviguer-dossiers', 'shell-premier-terminal', 'shell-powershell-bash', 'shell-terminal', 'shell-pwd-ls-cd'], 'Avant d’écrire, le dossier courant et la cible sont confirmés.'),
    etape('Manipuler des fichiers', 'Création, copie, lecture, recherche et guillemets.', ['shell-mkdir-touch', 'shell-cp-mv-rm', 'shell-cat-less-head-tail', 'shell-grep-rg-find', 'shell-chemins-cites'], 'Un chemin avec espaces fonctionne et aucune commande de suppression n’est lancée sur une cible inconnue.'),
    etape('Composer des commandes', 'Pipes, droits, réseau et variables.', ['shell-pipes-redirections', 'shell-permissions', 'shell-curl', 'shell-env-path', 'shell-installer-verifier-outil'], 'Une commande HTTP affiche son statut et une variable d’environnement est distinguée du texte du script.'),
    etape('Garder une trace', 'Diff, commit et retour à un état connu.', ['git-cycle'], 'Un changement utile est committé et l’historique permet de retrouver son intention.')
  ] },
  { id: 'css-outils', titre: 'Choisir et contrôler un outil de styles', niveau: 'Autonome → intermédiaire', competence: 'Comparer CSS écrit à la main, classes utilitaires et composants de framework sans perdre l’accessibilité.', suite: 'frontend', etapes: [
    etape('Choisir consciemment', 'Comparer les contraintes et vérifier le CSS réellement chargé.', ['css-outils-comparaison', 'css-outils-couche-style', 'tailwind-utilitaires'], 'Une classe qui ne produit aucun style est diagnostiquée à partir de la feuille chargée.'),
    etape('Assembler et livrer', 'Composants et chaîne de construction.', ['bootstrap-composants', 'frontend-bundler-build'], 'La version de production conserve les styles utiles et le composant reste utilisable au clavier.')
  ] }
);

for (const p of parcours) p.famille = Object.entries(groupesParcours).find(([, ids]) => ids.includes(p.id))?.[0] || 'Autres parcours';

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
