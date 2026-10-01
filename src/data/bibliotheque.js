'use strict';

/*
 * Bibliothèque technique interne.
 *
 * Les entrées sont fabriquées à partir de profils pédagogiques et de fiches
 * courtes propres à chaque terme. Cela permet de garder un format homogène
 * pour la recherche, l'affichage et une future synchronisation Supabase,
 * tout en conservant une explication différente pour chaque notion.
 */

const profils = {
  web: {
    nom: 'Web et navigateur',
    role: 'Relier une intention utilisateur à une interface lisible, accessible et capable de transporter des données.',
    structure: 'On le retrouve généralement dans public/, src/ui/, les feuilles de style, les composants et la couche d’accès aux API.',
    types: ['texte', 'attributs HTML', 'nœuds DOM', 'objets JSON', 'événements utilisateur', 'réponses HTTP'],
    pourquoi: ['Il rend le comportement visible dans le navigateur.', 'Il aide à séparer structure, présentation, interaction et transport.', 'Il constitue le contrat que le serveur et l’utilisateur comprennent.'],
    eviter: ['Ne pas l’utiliser comme remplacement d’une validation serveur.', 'Ne pas entasser toute la logique métier dans le navigateur lorsque la donnée doit rester fiable ou secrète.'],
    avertissements: ['Le navigateur est contrôlé par l’utilisateur : toute donnée reçue doit être considérée comme modifiable.', 'Les performances et l’accessibilité font partie du fonctionnement, pas d’un bonus esthétique.'],
    scenarios: [
      { cas: 'Page principalement documentaire', decision: 'Privilégier HTML sémantique et CSS simple', pourquoi: 'Le contenu reste indexable, accessible et facile à maintenir.' },
      { cas: 'Interface très interactive', decision: 'Ajouter une couche JavaScript ou un framework avec état explicite', pourquoi: 'Les transitions et les états deviennent traçables.' },
      { cas: 'Donnée sensible ou décision métier', decision: 'Envoyer l’intention au serveur puis revalider', pourquoi: 'Le client ne peut pas être la source de vérité.' }
    ],
    exercice: 'Construire une petite interface qui reçoit une donnée, la vérifie, l’affiche sans injection puis explique le chemin parcouru.',
    url: 'https://developer.mozilla.org/fr/docs/Web'
  },
  langage: {
    nom: 'Langages et exécution',
    role: 'Décrire les valeurs, les fonctions, le temps d’exécution et les erreurs qui font vivre une application.',
    structure: 'On le retrouve dans les modules métier, les fonctions utilitaires, les tests et les adaptateurs qui transforment les données.',
    types: ['string', 'number', 'boolean', 'null', 'undefined', 'object', 'array', 'Promise', 'Error'],
    pourquoi: ['Une règle de langage bien comprise évite les corrections au hasard.', 'Les types et les flux asynchrones rendent les contrats plus explicites.', 'La logique peut ensuite être testée indépendamment de l’interface.'],
    eviter: ['Ne pas utiliser un type ou une abstraction uniquement parce qu’elle est à la mode.', 'Ne pas masquer une erreur avec un cast ou un catch vide.'],
    avertissements: ['Une valeur venant du réseau est souvent un texte ou un objet incomplet, même si l’IDE l’annonce autrement.', 'L’ordre d’exécution asynchrone doit être vérifié avec des logs ou des tests ciblés.'],
    scenarios: [
      { cas: 'Règle pure avec les mêmes entrées', decision: 'Écrire une fonction pure et la tester', pourquoi: 'Le résultat est prévisible et facile à rejouer.' },
      { cas: 'Opération réseau ou fichier', decision: 'Retourner une Promise et traiter succès et erreur', pourquoi: 'L’appel dépend d’un système extérieur.' },
      { cas: 'Contrat partagé entre plusieurs équipes', decision: 'Définir un type, un schéma ou une validation', pourquoi: 'L’erreur est arrêtée près de la frontière.' }
    ],
    exercice: 'Prendre une entrée inconnue, la normaliser, appliquer une règle et écrire un test pour le cas nominal et deux cas limites.',
    url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript'
  },
  frontend: {
    nom: 'Écosystème frontend',
    role: 'Organiser une interface en composants, états, effets et contrats de données compréhensibles par l’équipe.',
    structure: 'Un projet organise souvent ses composants dans src/components, ses pages dans src/pages ou app, et ses appels dans src/services ou src/lib.',
    types: ['props', 'état local', 'état partagé', 'réponse API', 'état de chargement', 'état d’erreur', 'événements'],
    pourquoi: ['Il découpe une interface complexe en responsabilités testables.', 'Il rend visibles les moments de chargement, succès, vide et erreur.', 'Il évite que chaque composant invente sa propre manière de récupérer une donnée.'],
    eviter: ['Ne pas mettre toutes les données dans un store global par réflexe.', 'Ne pas déclencher un effet pour calculer une valeur dérivée qui peut être calculée pendant le rendu.'],
    avertissements: ['Un rendu client ne protège ni un secret ni une règle d’autorisation.', 'Une interface doit expliquer ce qu’elle fait pendant l’attente : une absence de message ressemble à une panne.'],
    scenarios: [
      { cas: 'Valeur utilisée par un seul composant', decision: 'État local ou variable dérivée', pourquoi: 'Le périmètre reste petit et lisible.' },
      { cas: 'Même donnée dans plusieurs écrans', decision: 'Cache ou store partagé avec une source claire', pourquoi: 'On évite les copies divergentes.' },
      { cas: 'Donnée distante', decision: 'Séparer chargement, succès, vide et erreur', pourquoi: 'L’utilisateur comprend toujours l’état réel de l’appel.' }
    ],
    exercice: 'Créer un composant qui reçoit une donnée distante, affiche quatre états et transmet une action au parent sans mélanger rendu et accès réseau.',
    url: 'https://developer.mozilla.org/fr/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks'
  },
  backend: {
    nom: 'Backend et API',
    role: 'Recevoir une intention, vérifier son identité et ses données, exécuter une règle puis renvoyer une réponse stable.',
    structure: 'Une API claire sépare routes, contrôleurs, services métier, accès aux données, validation et gestion centralisée des erreurs.',
    types: ['requête HTTP', 'paramètres', 'query string', 'JSON', 'statuts HTTP', 'erreurs structurées', 'flux binaires'],
    pourquoi: ['Il centralise les règles que le client ne doit pas pouvoir contourner.', 'Il donne plusieurs clients un contrat commun.', 'Il permet d’observer, limiter et faire évoluer un traitement.'],
    eviter: ['Ne pas exposer directement une table ou une erreur interne sans filtrage.', 'Ne pas faire confiance au nom d’un bouton, à un rôle envoyé par le navigateur ou à un identifiant non vérifié.'],
    avertissements: ['Une réponse HTTP doit indiquer le résultat, pas seulement contenir du texte.', 'Une API publique doit gérer authentification, autorisation, validation, limites et logs sans secrets.'],
    scenarios: [
      { cas: 'Lecture simple et cacheable', decision: 'GET avec réponse versionnée et pagination', pourquoi: 'Le client, le CDN et les outils comprennent l’intention.' },
      { cas: 'Création ou changement', decision: 'POST, PUT ou PATCH avec validation et idempotence réfléchie', pourquoi: 'Le serveur peut expliquer précisément ce qui est accepté.' },
      { cas: 'Traitement long', decision: 'Mettre en file puis retourner un identifiant de suivi', pourquoi: 'Le délai ne bloque pas la requête et peut être repris.' }
    ],
    exercice: 'Écrire une route qui valide une entrée, appelle un service, renvoie les bons statuts et masque l’erreur interne tout en conservant un identifiant de trace.',
    url: 'https://developer.mozilla.org/fr/docs/Web/HTTP'
  },
  donnees: {
    nom: 'Données et persistance',
    role: 'Conserver une information avec un modèle, une contrainte, une durée de vie et un propriétaire clairement définis.',
    structure: 'La donnée traverse souvent une validation, un service, un dépôt ou client de base, puis une réponse qui ne contient que les champs nécessaires.',
    types: ['ligne relationnelle', 'objet JSON', 'identifiant', 'date ISO', 'enum', 'fichier', 'cache', 'événement'],
    pourquoi: ['Le modèle rend les conséquences d’une décision visibles.', 'Les contraintes évitent de réparer plus tard des données incohérentes.', 'La persistance permet de retrouver le résultat après un redémarrage.'],
    eviter: ['Ne pas stocker une donnée uniquement parce que cela paraît pratique.', 'Ne pas choisir JSON, SQL, cache ou fichier sans regarder les recherches, la volumétrie et les garanties attendues.'],
    avertissements: ['Une migration est du code : elle doit être relue, versionnée et testée sur une copie.', 'Les données personnelles ont une durée de conservation et un accès à limiter.'],
    scenarios: [
      { cas: 'Relations et recherches régulières', decision: 'Modèle relationnel avec index ciblés', pourquoi: 'Les contraintes et jointures protègent la cohérence.' },
      { cas: 'Document flexible peu joint', decision: 'JSON documenté et validé', pourquoi: 'La structure évolue sans créer des colonnes artificielles.' },
      { cas: 'Donnée temporaire ou recalculable', decision: 'Cache avec expiration', pourquoi: 'On réduit le coût sans traiter le cache comme la vérité.' }
    ],
    exercice: 'Définir le chemin d’une donnée de formulaire jusqu’à sa lecture : type, validation, stockage, index, transformation de sortie et suppression.',
    url: 'https://www.postgresql.org/docs/current/'
  },
  securite: {
    nom: 'Sécurité et confiance',
    role: 'Réduire les possibilités d’abus en contrôlant identité, droits, entrées, sorties, secrets et traces.',
    structure: 'La sécurité se place aux frontières : navigateur, API, service, base, stockage de fichiers, variables d’environnement et logs.',
    types: ['identité', 'session', 'jeton', 'permission', 'secret', 'entrée non fiable', 'sortie encodée', 'audit'],
    pourquoi: ['Elle protège les utilisateurs et la continuité du service.', 'Elle réduit les erreurs humaines en faisant appliquer les règles par le système.', 'Elle transforme un incident impossible à comprendre en événement observable.'],
    eviter: ['Ne pas inventer une cryptographie maison.', 'Ne pas envoyer un secret au client ni journaliser un mot de passe, un jeton complet ou une donnée sensible.'],
    avertissements: ['Cacher un bouton ne constitue pas une autorisation.', 'La sécurité concerne aussi les dépendances, les sauvegardes, les environnements de test et les accès internes.'],
    scenarios: [
      { cas: 'Utilisateur connecté', decision: 'Authentifier puis autoriser chaque opération sensible', pourquoi: 'Être connu ne signifie pas avoir tous les droits.' },
      { cas: 'Entrée venant du public', decision: 'Valider forme, taille, type et contexte avant traitement', pourquoi: 'Les données peuvent être malveillantes ou simplement incomplètes.' },
      { cas: 'Secret nécessaire à un serveur', decision: 'Variable d’environnement ou gestionnaire de secrets', pourquoi: 'Le secret ne doit pas vivre dans Git ou dans le bundle client.' }
    ],
    exercice: 'Cartographier une requête sensible, puis ajouter validation, autorisation, limitation, journalisation sans révéler de donnée privée.',
    url: 'https://owasp.org/www-project-top-ten/'
  },
  infrastructure: {
    nom: 'Infrastructure et exploitation',
    role: 'Faire fonctionner le code de manière reproductible, observable et proportionnée au trafic et au risque.',
    structure: 'Le code, la configuration, le build, le déploiement, le réseau, le stockage et la supervision doivent avoir des responsabilités séparées.',
    types: ['processus', 'conteneur', 'image', 'artefact', 'variable d’environnement', 'log', 'métrique', 'trace', 'healthcheck'],
    pourquoi: ['Il réduit l’écart entre la machine du développeur et la production.', 'Il permet de détecter une panne et de revenir à une version connue.', 'Il aide à choisir le coût et la complexité nécessaires, pas ceux qui impressionnent.'],
    eviter: ['Ne pas ajouter une couche d’infrastructure sans besoin mesurable.', 'Ne pas considérer un déploiement réussi comme une preuve que la fonctionnalité est correcte.'],
    avertissements: ['Chaque service supplémentaire ajoute des accès, des pannes possibles et des frais.', 'Une sauvegarde jamais restaurée est une hypothèse, pas une garantie.'],
    scenarios: [
      { cas: 'Site statique ou SPA', decision: 'CDN et déploiement simple', pourquoi: 'Le contenu se distribue vite avec peu d’opérations.' },
      { cas: 'API avec état ou travail long', decision: 'Service serveur, base et éventuellement file de tâches', pourquoi: 'Chaque responsabilité possède son cycle de vie.' },
      { cas: 'Incident ou lenteur', decision: 'Logs corrélés, métriques et traces avant optimisation', pourquoi: 'On corrige le chemin réellement coûteux.' }
    ],
    exercice: 'Décrire le trajet d’un commit jusqu’à un utilisateur, puis ajouter un healthcheck, un log utile, une variable de configuration et un plan de retour arrière.',
    url: 'https://12factor.net/fr/'
  },
  outils: {
    nom: 'Outils, packages et qualité',
    role: 'Automatiser les tâches répétitives, installer des dépendances reproductibles et donner un retour rapide à l’équipe.',
    structure: 'Les scripts vivent dans package.json ou Makefile, la configuration dans des fichiers dédiés et les contrôles dans CI avant le déploiement.',
    types: ['fichier', 'commande', 'package', 'version', 'artefact', 'résultat de test', 'rapport de lint'],
    pourquoi: ['Un bon outil rend une intention répétable par toute l’équipe.', 'Les verrous de versions et les tests réduisent les surprises.', 'L’automatisation libère du temps pour comprendre le produit.'],
    eviter: ['Ne pas installer un package pour trois lignes sans vérifier sa maintenance et sa surface de risque.', 'Ne pas désactiver un contrôle parce qu’il signale une vraie ambiguïté.'],
    avertissements: ['Une dépendance est du code exécuté dans votre chaîne : son origine et ses permissions comptent.', 'Une commande destructive doit annoncer sa cible et être testée sur un environnement sûr.'],
    scenarios: [
      { cas: 'Action fréquente par plusieurs personnes', decision: 'Créer un script nommé et documenté', pourquoi: 'La procédure devient observable et reproductible.' },
      { cas: 'Modification de code', decision: 'Lint, formatage et tests automatisés', pourquoi: 'Les erreurs simples sont arrêtées avant revue ou production.' },
      { cas: 'Besoin d’une dépendance', decision: 'Comparer maintenance, taille, licence et alternative native', pourquoi: 'Le coût ne se limite pas à l’installation.' }
    ],
    exercice: 'Créer une commande de projet qui installe, vérifie, teste et construit sans dépendre de l’état caché de votre machine.',
    url: 'https://docs.npmjs.com/'
  }
};

const graines = [
  { id: 'html', terme: 'HTML', categorie: 'web', langage: 'HTML', focus: 'décrit la structure et le sens d’une page', code: '<main>\n  <h1>Catalogue</h1>\n  <p>Une page lisible par un humain et une machine.</p>\n</main>', aliases: ['markup', 'page web'], related: ['semantique-html', 'accessibilite-web'] },
  { id: 'semantique-html', terme: 'HTML sémantique', categorie: 'web', langage: 'HTML', focus: 'choisit un élément selon son rôle plutôt que selon son apparence', code: '<article>\n  <header><h2>Leçon</h2></header>\n  <p>Le contenu possède une structure compréhensible.</p>\n</article>', aliases: ['landmark', 'balises sémantiques'], related: ['html', 'accessibilite-web'] },
  { id: 'css', terme: 'CSS', categorie: 'web', langage: 'CSS', focus: 'décrit la présentation, la cascade et les adaptations de l’interface', code: '.card {\n  display: grid;\n  gap: 1rem;\n  color: #172331;\n}', aliases: ['feuilles de style'], related: ['flexbox', 'css-grid'] },
  { id: 'flexbox', terme: 'Flexbox', categorie: 'web', langage: 'CSS', focus: 'aligne des éléments sur un axe avec une répartition flexible', code: '.toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: .75rem;\n}', aliases: ['flex'], related: ['css', 'responsive-design'] },
  { id: 'css-grid', terme: 'CSS Grid', categorie: 'web', langage: 'CSS', focus: 'organise une interface en lignes et colonnes explicites', code: '.layout {\n  display: grid;\n  grid-template-columns: 240px minmax(0, 1fr);\n  gap: 2rem;\n}', aliases: ['grid'], related: ['css', 'flexbox'] },
  { id: 'responsive-design', terme: 'Responsive design', categorie: 'web', langage: 'CSS', focus: 'adapte la mise en page à la largeur, au zoom et au contexte d’utilisation', code: '@media (max-width: 760px) {\n  .layout { grid-template-columns: 1fr; }\n}', aliases: ['responsive', 'mobile first'], related: ['css', 'accessibilite-web'] },
  { id: 'dom', terme: 'DOM', categorie: 'web', langage: 'JavaScript', focus: 'représente le document comme un arbre de nœuds manipulables', code: 'const titre = document.querySelector(\'h1\');\ntitre.textContent = \'Catalogue chargé\';', aliases: ['Document Object Model'], related: ['evenements-dom', 'fetch'] },
  { id: 'evenements-dom', terme: 'Événements DOM', categorie: 'web', langage: 'JavaScript', focus: 'réagit à une action utilisateur ou à un événement du navigateur', code: 'document.querySelector(\'button\').addEventListener(\'click\', () => {\n  console.log(\'Action demandée\');\n});', aliases: ['event listener', 'click'], related: ['dom', 'accessibilite-web'] },
  { id: 'accessibilite-web', terme: 'Accessibilité web', categorie: 'web', langage: 'HTML', focus: 'permet à des personnes et des outils différents d’utiliser l’interface', code: '<button type="button" aria-label="Ouvrir la recherche">⌕</button>', aliases: ['a11y', 'WCAG'], related: ['semantique-html', 'responsive-design'] },
  { id: 'json', terme: 'JSON', categorie: 'web', langage: 'JSON', focus: 'transporte une structure de données textuelle entre systèmes', code: '{\n  "id": "lesson-1",\n  "title": "Comprendre une donnée"\n}', aliases: ['JavaScript Object Notation'], related: ['fetch', 'validation-schema'] },
  { id: 'fetch', terme: 'fetch()', categorie: 'web', langage: 'JavaScript', focus: 'envoie une requête HTTP depuis le navigateur ou un runtime compatible', code: 'const reponse = await fetch(\'/api/lessons\');\nif (!reponse.ok) throw new Error(\'Lecture impossible\');\nconst donnees = await reponse.json();', aliases: ['Fetch API', 'appel API'], related: ['rest-api', 'cors'] },
  { id: 'cors', terme: 'CORS', categorie: 'web', langage: 'HTTP', focus: 'contrôle les appels entre origines différentes dans un navigateur', code: 'Access-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Methods: GET, POST', aliases: ['Cross-Origin Resource Sharing'], related: ['fetch', 'securite-cors'] },

  { id: 'javascript', terme: 'JavaScript', categorie: 'langage', langage: 'JavaScript', focus: 'exprime la logique exécutée dans le navigateur, le serveur ou des outils', code: 'function saluer(nom) {\n  return `Bonjour ${nom}`;\n}\n\nconsole.log(saluer(\'Awa\'));', aliases: ['JS', 'ECMAScript'], related: ['types-js', 'modules-js'] },
  { id: 'types-js', terme: 'Types JavaScript', categorie: 'langage', langage: 'JavaScript', focus: 'décrit la nature d’une valeur et les opérations qu’elle accepte', code: 'const actif = true;\nconst compteur = 3;\nconst profil = { nom: \'Awa\' };\n\nconsole.log(typeof compteur);', aliases: ['primitive', 'typeof'], related: ['javascript', 'typescript'] },
  { id: 'tableaux-js', terme: 'Tableaux JavaScript', categorie: 'langage', langage: 'JavaScript', focus: 'regroupe des valeurs ordonnées et permet de les parcourir', code: 'const scores = [12, 18, 9];\nconst valides = scores.filter((score) => score >= 10);', aliases: ['Array', 'liste'], related: ['map-filter-reduce', 'types-js'] },
  { id: 'map-filter-reduce', terme: 'map(), filter(), reduce()', categorie: 'langage', langage: 'JavaScript', focus: 'transforme, sélectionne ou agrège une collection sans modifier la source', code: 'const total = commandes\n  .filter((commande) => commande.statut === \'payee\')\n  .reduce((somme, commande) => somme + commande.montant, 0);', aliases: ['itération', 'fonctions de collection'], related: ['tableaux-js', 'fonctions-js'] },
  { id: 'fonctions-js', terme: 'Fonctions JavaScript', categorie: 'langage', langage: 'JavaScript', focus: 'encapsule une intention réutilisable avec des entrées et un résultat', code: 'function calculerTTC(prix, taux = 0.2) {\n  return prix * (1 + taux);\n}', aliases: ['fonction pure', 'callback'], related: ['javascript', 'tests-unitaires'] },
  { id: 'promises-js', terme: 'Promise', categorie: 'langage', langage: 'JavaScript', focus: 'représente le résultat futur d’une opération asynchrone', code: 'const resultat = new Promise((resolve) => {\n  setTimeout(() => resolve(\'prêt\'), 100);\n});', aliases: ['promesse', 'asynchrone'], related: ['async-await', 'event-loop'] },
  { id: 'async-await', terme: 'async / await', categorie: 'langage', langage: 'JavaScript', focus: 'rend lisible l’attente d’une Promise tout en gardant un traitement asynchrone', code: 'async function charger() {\n  try {\n    const reponse = await fetch(\'/api/data\');\n    return await reponse.json();\n  } catch (erreur) {\n    console.error(erreur);\n  }\n}', aliases: ['await', 'asynchronisme'], related: ['promises-js', 'gestion-erreurs'] },
  { id: 'event-loop', terme: 'Event loop', categorie: 'langage', langage: 'JavaScript', focus: 'coordonne la pile d’exécution, les tâches et les callbacks asynchrones', code: 'console.log(\'A\');\nsetTimeout(() => console.log(\'C\'), 0);\nconsole.log(\'B\');\n// A, B, puis C', aliases: ['boucle d’événements', 'microtasks'], related: ['promises-js', 'node-runtime'] },
  { id: 'modules-js', terme: 'Modules JavaScript', categorie: 'langage', langage: 'JavaScript', focus: 'sépare et expose explicitement les responsabilités d’un fichier', code: '// calcul.js\nexport function additionner(a, b) { return a + b; }\n\n// app.js\nimport { additionner } from \'./calcul.js\';', aliases: ['import', 'export', 'ES modules'], related: ['javascript', 'npm'] },
  { id: 'gestion-erreurs', terme: 'Gestion des erreurs', categorie: 'langage', langage: 'JavaScript', focus: 'transforme un échec technique en décision observable et compréhensible', code: 'try {\n  await sauvegarder(donnee);\n} catch (erreur) {\n  throw new Error(\'La sauvegarde a échoué\', { cause: erreur });\n}', aliases: ['try catch', 'Error'], related: ['async-await', 'logs'] },
  { id: 'regex', terme: 'Expression régulière', categorie: 'langage', langage: 'JavaScript', focus: 'cherche ou vérifie un motif textuel avec une syntaxe compacte', code: 'const motif = /^[a-z0-9._-]+@[a-z0-9.-]+\\.[a-z]{2,}$/i;\nconsole.log(motif.test(email));', aliases: ['RegExp', 'regex'], related: ['validation-schema', 'types-js'] },
  { id: 'typescript', terme: 'TypeScript', categorie: 'langage', langage: 'TypeScript', focus: 'ajoute une vérification statique au JavaScript avant l’exécution', code: 'type User = { id: string; name: string };\n\nfunction afficher(user: User): string {\n  return user.name;\n}', aliases: ['TS', 'types statiques'], related: ['types-js', 'validation-schema'] },

  { id: 'react', terme: 'React', categorie: 'frontend', langage: 'JSX', focus: 'compose une interface à partir de composants et d’un état déclaratif', code: 'function Welcome({ name }) {\n  return <h1>Bonjour {name}</h1>;\n}', aliases: ['React.js', 'composants'], related: ['jsx', 'props-react', 'state-react'] },
  { id: 'jsx', terme: 'JSX', categorie: 'frontend', langage: 'JSX', focus: 'décrit une arborescence d’interface dans une syntaxe proche du HTML', code: 'const card = (\n  <article className="card">\n    <h2>{title}</h2>\n  </article>\n);', aliases: ['TSX', 'template React'], related: ['react', 'accessibilite-web'] },
  { id: 'props-react', terme: 'Props React', categorie: 'frontend', langage: 'JSX', focus: 'transmet une donnée ou une action du composant parent vers l’enfant', code: 'function Button({ label, onClick }) {\n  return <button onClick={onClick}>{label}</button>;\n}', aliases: ['propriétés', 'props'], related: ['react', 'state-react'] },
  { id: 'state-react', terme: 'State React', categorie: 'frontend', langage: 'JSX', focus: 'conserve une valeur locale dont la modification déclenche un nouveau rendu', code: 'const [ouvert, setOuvert] = useState(false);\n\n<button onClick={() => setOuvert(!ouvert)}>\n  {ouvert ? \'Fermer\' : \'Ouvrir\'}\n</button>', aliases: ['état local', 'useState'], related: ['react', 'hooks-react'] },
  { id: 'hooks-react', terme: 'Hooks React', categorie: 'frontend', langage: 'JSX', focus: 'réutilise des comportements d’état ou d’effets dans un composant fonctionnel', code: 'function useTitre(titre) {\n  useEffect(() => {\n    document.title = titre;\n  }, [titre]);\n}', aliases: ['useEffect', 'useMemo', 'useCallback'], related: ['state-react', 'effects-react'] },
  { id: 'effects-react', terme: 'Effets React', categorie: 'frontend', langage: 'JSX', focus: 'synchronise un composant avec un système extérieur au rendu', code: 'useEffect(() => {\n  const abonnement = bus.subscribe(onMessage);\n  return () => abonnement.unsubscribe();\n}, []);', aliases: ['effect', 'useEffect'], related: ['hooks-react', 'fetch'] },
  { id: 'context-react', terme: 'Context React', categorie: 'frontend', langage: 'JSX', focus: 'partage une valeur dans une arborescence sans passer chaque prop manuellement', code: 'const ThemeContext = createContext(\'light\');\n\n<ThemeContext.Provider value="dark">\n  <App />\n</ThemeContext.Provider>', aliases: ['Context API', 'provider'], related: ['react', 'state-react'] },
  { id: 'vue', terme: 'Vue', categorie: 'frontend', langage: 'Vue', focus: 'organise une interface progressive avec templates, réactivité et composants', code: '<script setup>\nimport { ref } from \'vue\';\nconst count = ref(0);\n</script>\n\n<template><button @click="count++">{{ count }}</button></template>', aliases: ['Vue.js', 'SFC'], related: ['vue-ref', 'vue-computed'] },
  { id: 'vue-ref', terme: 'ref() Vue', categorie: 'frontend', langage: 'Vue', focus: 'crée une valeur réactive que Vue suit lorsqu’elle change', code: 'const recherche = ref(\'\');\n\nfunction effacer() {\n  recherche.value = \'\';\n}', aliases: ['réactivité Vue', 'ref'], related: ['vue', 'vue-watch'] },
  { id: 'vue-computed', terme: 'computed() Vue', categorie: 'frontend', langage: 'Vue', focus: 'calcule une valeur dérivée mémorisée à partir d’un état réactif', code: 'const total = computed(() => panier.value.reduce((somme, item) => somme + item.prix, 0));', aliases: ['computed', 'valeur dérivée'], related: ['vue', 'vue-ref'] },
  { id: 'vue-watch', terme: 'watch() Vue', categorie: 'frontend', langage: 'Vue', focus: 'réagit à la variation d’une donnée pour synchroniser un effet externe', code: 'watch(recherche, async (valeur) => {\n  resultats.value = await chercher(valeur);\n});', aliases: ['watcher', 'surveillance'], related: ['vue-ref', 'fetch'] },
  { id: 'angular-component', terme: 'Composant Angular', categorie: 'frontend', langage: 'TypeScript', focus: 'regroupe template, styles et comportement dans une unité structurée', code: '@Component({\n  selector: \'app-card\',\n  template: \'<h2>{{ title }}</h2>\'\n})\nexport class CardComponent { title = \'Cours\'; }', aliases: ['Angular', 'component'], related: ['typescript', 'angular-service'] },
  { id: 'angular-service', terme: 'Service Angular', categorie: 'frontend', langage: 'TypeScript', focus: 'isole un accès partagé ou une règle injectable hors du composant', code: '@Injectable({ providedIn: \'root\' })\nexport class LessonService {\n  getAll() { return this.http.get(\'/api/lessons\'); }\n}', aliases: ['DI Angular', 'injection'], related: ['angular-component', 'rest-api'] },
  { id: 'next-server-client', terme: 'Server / Client Components', categorie: 'frontend', langage: 'React', focus: 'choisit où exécuter une partie de l’interface dans un framework full-stack', code: '// serveur par défaut\nexport default async function Page() {\n  const data = await getData();\n  return <List data={data} />;\n}\n\n// client : "use client" seulement si interaction nécessaire', aliases: ['Next.js', 'RSC'], related: ['react', 'fetch'] },
  { id: 'vite', terme: 'Vite', categorie: 'frontend', langage: 'Shell', focus: 'fournit un serveur de développement et un build frontend rapide', code: 'npm create vite@latest\nnpm run dev\nnpm run build', aliases: ['bundler frontend', 'dev server'], related: ['npm', 'modules-js'] },

  { id: 'node-runtime', terme: 'Node.js', categorie: 'backend', langage: 'JavaScript', focus: 'exécute JavaScript côté serveur avec accès aux fichiers, au réseau et aux processus', code: 'import { readFile } from \'node:fs/promises\';\nconst contenu = await readFile(\'./config.json\', \'utf8\');\nconsole.log(contenu);', aliases: ['Node', 'runtime'], related: ['event-loop', 'express'] },
  { id: 'express', terme: 'Express', categorie: 'backend', langage: 'JavaScript', focus: 'compose une API Node avec routes, middleware et gestion des réponses', code: 'import express from \'express\';\nconst app = express();\napp.get(\'/health\', (_req, res) => res.json({ ok: true }));\napp.listen(3000);', aliases: ['Express.js', 'serveur HTTP'], related: ['middleware-express', 'rest-api'] },
  { id: 'middleware-express', terme: 'Middleware Express', categorie: 'backend', langage: 'JavaScript', focus: 'intercepte une requête pour ajouter un contexte, contrôler ou transformer le flux', code: 'app.use(express.json());\napp.use((req, _res, next) => {\n  req.requestId = crypto.randomUUID();\n  next();\n});', aliases: ['middleware', 'pipeline'], related: ['express', 'auth'] },
  { id: 'rest-api', terme: 'API REST', categorie: 'backend', langage: 'HTTP', focus: 'modélise des ressources et leurs actions avec les conventions HTTP', code: 'GET    /api/lessons\nGET    /api/lessons/:id\nPOST   /api/lessons\nPATCH  /api/lessons/:id', aliases: ['REST', 'ressource HTTP'], related: ['fetch', 'pagination'] },
  { id: 'graphql', terme: 'GraphQL', categorie: 'backend', langage: 'GraphQL', focus: 'permet au client de demander une forme précise de données via un schéma', code: 'query Lesson($id: ID!) {\n  lesson(id: $id) { id title sections { title } }\n}', aliases: ['query language', 'resolver'], related: ['rest-api', 'validation-schema'] },
  { id: 'websocket', terme: 'WebSocket', categorie: 'backend', langage: 'JavaScript', focus: 'maintient un canal bidirectionnel pour recevoir des événements en temps réel', code: 'const socket = new WebSocket(\'wss://example.com/events\');\nsocket.addEventListener(\'message\', (event) => {\n  console.log(JSON.parse(event.data));\n});', aliases: ['temps réel', 'socket'], related: ['rest-api', 'queue'] },
  { id: 'streams-node', terme: 'Streams Node.js', categorie: 'backend', langage: 'JavaScript', focus: 'traite une grande donnée par morceaux au lieu de tout charger en mémoire', code: 'import { createReadStream } from \'node:fs\';\n\ncreateReadStream(\'large.csv\').on(\'data\', (chunk) => {\n  traiter(chunk);\n});', aliases: ['flux', 'backpressure'], related: ['node-runtime', 'file-upload'] },
  { id: 'worker', terme: 'Worker', categorie: 'backend', langage: 'JavaScript', focus: 'déporte un calcul ou un travail indépendant pour ne pas bloquer le traitement principal', code: 'const worker = new Worker(\'./index-worker.js\');\nworker.postMessage({ type: \'index\', ids });', aliases: ['worker thread', 'background job'], related: ['queue', 'event-loop'] },
  { id: 'queue', terme: 'File de messages', categorie: 'backend', langage: 'Architecture', focus: 'sépare la demande d’un travail de son exécution et autorise les reprises', code: 'await queue.publish(\'lesson.index\', { lessonId: \'l-42\' });\n// un worker consommera le message plus tard', aliases: ['queue', 'job queue', 'message broker'], related: ['worker', 'retry'] },
  { id: 'cron', terme: 'Tâche planifiée', categorie: 'backend', langage: 'Cron', focus: 'lance un traitement à un moment ou une fréquence connue', code: '0 2 * * * node scripts/reindex.js\n# journaliser le début, la fin et l’échec du traitement', aliases: ['cron', 'scheduled job'], related: ['queue', 'logs'] },
  { id: 'webhooks', terme: 'Webhook', categorie: 'backend', langage: 'HTTP', focus: 'reçoit une notification serveur-à-serveur lorsqu’un événement se produit', code: 'app.post(\'/webhooks/payment\', express.raw({ type: \'application/json\' }), (req, res) => {\n  verifierSignature(req);\n  res.sendStatus(204);\n});', aliases: ['callback HTTP', 'notification'], related: ['secrets', 'idempotence'] },
  { id: 'pagination', terme: 'Pagination', categorie: 'backend', langage: 'HTTP/JSON', focus: 'découpe une collection en résultats contrôlables au lieu de tout renvoyer', code: 'GET /api/lessons?limit=20&cursor=eyJpZCI6IjIwIn0=\n\n{ "items": [], "nextCursor": "..." }', aliases: ['cursor', 'limit offset'], related: ['rest-api', 'postgresql'] },
  { id: 'validation-schema', terme: 'Validation par schéma', categorie: 'backend', langage: 'TypeScript', focus: 'vérifie la forme et les contraintes d’une donnée au moment où elle entre dans le système', code: 'const LessonInput = z.object({\n  title: z.string().min(1).max(120),\n  duration: z.number().int().positive()\n});\nconst input = LessonInput.parse(req.body);', aliases: ['Zod', 'DTO', 'schema'], related: ['json', 'types-js'] },
  { id: 'rate-limit', terme: 'Rate limiting', categorie: 'backend', langage: 'HTTP', focus: 'limite la fréquence d’une action par identité, adresse ou ressource', code: 'const limiter = rateLimit({\n  windowMs: 60_000,\n  limit: 60,\n  standardHeaders: \'draft-7\'\n});\napp.use(\'/api/\', limiter);', aliases: ['quota', 'throttling'], related: ['auth', 'redis'] },

  { id: 'postgresql', terme: 'PostgreSQL', categorie: 'donnees', langage: 'SQL', focus: 'stocke des données relationnelles avec contraintes, requêtes, transactions et extensions', code: 'select id, title\nfrom lessons\nwhere published_at is not null\norder by published_at desc\nlimit 20;', aliases: ['Postgres', 'base SQL'], related: ['table-sql', 'index-sql', 'transaction-sql'] },
  { id: 'table-sql', terme: 'Table SQL', categorie: 'donnees', langage: 'SQL', focus: 'organise des lignes qui partagent des colonnes et des règles communes', code: 'create table lessons (\n  id uuid primary key,\n  title text not null,\n  created_at timestamptz not null default now()\n);', aliases: ['relation', 'table relationnelle'], related: ['postgresql', 'primary-key'] },
  { id: 'index-sql', terme: 'Index SQL', categorie: 'donnees', langage: 'SQL', focus: 'accélère une recherche fréquente au prix d’espace et de coûts d’écriture', code: 'create index lessons_published_idx\non lessons (published_at desc)\nwhere published_at is not null;', aliases: ['index de base', 'B-tree'], related: ['postgresql', 'table-sql'] },
  { id: 'primary-key', terme: 'Clé primaire', categorie: 'donnees', langage: 'SQL', focus: 'identifie une ligne de manière unique et non ambiguë', code: 'create table users (\n  id uuid primary key default gen_random_uuid(),\n  email text not null\n);', aliases: ['primary key', 'PK'], related: ['table-sql', 'foreign-key'] },
  { id: 'foreign-key', terme: 'Clé étrangère', categorie: 'donnees', langage: 'SQL', focus: 'relie une ligne à une autre table et protège une relation attendue', code: 'create table enrollments (\n  user_id uuid references users(id) on delete cascade,\n  lesson_id uuid references lessons(id) on delete cascade\n);', aliases: ['foreign key', 'FK'], related: ['primary-key', 'table-sql'] },
  { id: 'transaction-sql', terme: 'Transaction SQL', categorie: 'donnees', langage: 'SQL', focus: 'regroupe plusieurs opérations qui doivent réussir ou échouer ensemble', code: 'begin;\nupdate accounts set balance = balance - 10 where id = \'a\';\nupdate accounts set balance = balance + 10 where id = \'b\';\ncommit;', aliases: ['ACID', 'commit rollback'], related: ['postgresql', 'idempotence'] },
  { id: 'migration-sql', terme: 'Migration de base', categorie: 'donnees', langage: 'SQL', focus: 'versionne une évolution de schéma et la rend rejouable sur plusieurs environnements', code: 'alter table lessons\n  add column difficulty text not null default \'beginner\';\n-- tester puis retirer le défaut si le modèle le permet', aliases: ['schema migration', 'DDL'], related: ['postgresql', 'deploy'] },
  { id: 'rls', terme: 'Row Level Security', categorie: 'donnees', langage: 'SQL', focus: 'fait appliquer par la base les lignes qu’un rôle peut lire ou modifier', code: 'alter table documents enable row level security;\ncreate policy "owner reads" on documents\nfor select using (owner_id = auth.uid());', aliases: ['RLS', 'politiques Supabase'], related: ['supabase', 'auth'] },
  { id: 'supabase', terme: 'Supabase', categorie: 'donnees', langage: 'TypeScript/SQL', focus: 'réunit base Postgres, authentification, stockage et APIs autour d’un projet', code: 'const { data, error } = await supabase\n  .from(\'lessons\')\n  .select(\'id, title\')\n  .eq(\'published\', true);', aliases: ['BaaS', 'Supabase client'], related: ['postgresql', 'rls'] },
  { id: 'redis', terme: 'Redis', categorie: 'donnees', langage: 'JavaScript', focus: 'conserve rapidement des valeurs en mémoire pour cache, session, compteur ou file', code: 'await redis.set(\'lesson:l-42\', JSON.stringify(lesson), { EX: 300 });\nconst cached = await redis.get(\'lesson:l-42\');', aliases: ['Valkey', 'clé-valeur'], related: ['cache', 'rate-limit'] },
  { id: 'cache', terme: 'Cache', categorie: 'donnees', langage: 'Architecture', focus: 'réutilise temporairement un résultat coûteux sans devenir la source de vérité', code: 'const key = `lesson:${id}`;\nconst cached = await cache.get(key);\nif (cached) return JSON.parse(cached);\nconst fresh = await repository.find(id);\nawait cache.set(key, JSON.stringify(fresh), 300);', aliases: ['mise en cache', 'TTL'], related: ['redis', 'cdn'] },
  { id: 'localstorage', terme: 'localStorage', categorie: 'donnees', langage: 'JavaScript', focus: 'conserve de petites préférences dans le navigateur entre deux sessions', code: 'localStorage.setItem(\'theme\', \'dark\');\nconst theme = localStorage.getItem(\'theme\') || \'light\';', aliases: ['storage navigateur', 'Web Storage'], related: ['sessionstorage', 'cookie'] },
  { id: 'sessionstorage', terme: 'sessionStorage', categorie: 'donnees', langage: 'JavaScript', focus: 'conserve une petite donnée jusqu’à la fin de l’onglet', code: 'sessionStorage.setItem(\'draft\', JSON.stringify(draft));\nconst draft = JSON.parse(sessionStorage.getItem(\'draft\') || \'null\');', aliases: ['stockage de session'], related: ['localstorage', 'cookie'] },
  { id: 'cookie', terme: 'Cookie', categorie: 'donnees', langage: 'HTTP', focus: 'fait transiter une petite donnée entre navigateur et serveur selon des attributs de sécurité', code: 'Set-Cookie: session=opaque-id; HttpOnly; Secure; SameSite=Lax; Path=/', aliases: ['cookies HTTP', 'session cookie'], related: ['session', 'csrf'] },
  { id: 'file-upload', terme: 'Upload de fichier', categorie: 'donnees', langage: 'JavaScript/HTTP', focus: 'transporte un fichier avec contrôle de taille, type, nom et destination', code: 'const body = new FormData();\nbody.append(\'file\', input.files[0]);\nawait fetch(\'/api/files\', { method: \'POST\', body });', aliases: ['multipart', 'FormData'], related: ['streams-node', 'auth'] },

  { id: 'auth', terme: 'Authentification', categorie: 'securite', langage: 'Architecture', focus: 'vérifie qui demande une opération avant de créer un contexte utilisateur', code: 'const session = await auth.getSession(request);\nif (!session.user) return new Response(\'Unauthorized\', { status: 401 });', aliases: ['login', 'identity'], related: ['session', 'authorization'] },
  { id: 'authorization', terme: 'Autorisation', categorie: 'securite', langage: 'Architecture', focus: 'décide ce qu’une identité a le droit de lire ou modifier', code: 'if (!can(user, \'lesson.update\', lesson)) {\n  return res.sendStatus(403);\n}', aliases: ['permissions', 'ACL', 'RBAC'], related: ['auth', 'rls'] },
  { id: 'session', terme: 'Session', categorie: 'securite', langage: 'HTTP', focus: 'relie plusieurs requêtes à un contexte d’authentification pendant une durée contrôlée', code: 'Set-Cookie: sid=opaque-session-id; HttpOnly; Secure; SameSite=Lax; Max-Age=3600', aliases: ['session utilisateur', 'cookie de session'], related: ['auth', 'cookie'] },
  { id: 'jwt', terme: 'JWT', categorie: 'securite', langage: 'JSON', focus: 'transporte des claims signés qu’un service peut vérifier sans stocker le jeton complet', code: 'const token = await new SignJWT({ sub: user.id, role: \'reader\' })\n  .setProtectedHeader({ alg: \'HS256\' })\n  .setExpirationTime(\'15m\').sign(secret);', aliases: ['JSON Web Token', 'bearer token'], related: ['auth', 'oauth'] },
  { id: 'oauth', terme: 'OAuth 2.0', categorie: 'securite', langage: 'HTTP', focus: 'délègue une autorisation à un fournisseur sans partager le mot de passe avec l’application', code: 'const url = provider.authorizeURL({\n  redirect_uri: \'https://app.example.com/callback\',\n  scope: \'openid profile\',\n  state: csrfState\n});', aliases: ['OIDC', 'social login'], related: ['auth', 'jwt'] },
  { id: 'password-hashing', terme: 'Hachage de mot de passe', categorie: 'securite', langage: 'JavaScript', focus: 'conserve une empreinte difficile à inverser plutôt que le mot de passe original', code: 'const hash = await argon2.hash(password);\nconst valid = await argon2.verify(hash, password);', aliases: ['Argon2', 'bcrypt', 'hash'], related: ['auth', 'secrets'] },
  { id: 'xss', terme: 'XSS', categorie: 'securite', langage: 'Web', focus: 'empêche une donnée contrôlée par un tiers de devenir du code exécuté dans la page', code: 'element.textContent = userInput;\n// préférer textContent à innerHTML pour une simple valeur texte', aliases: ['Cross-Site Scripting', 'injection HTML'], related: ['accessibilite-web', 'csp'] },
  { id: 'sql-injection', terme: 'Injection SQL', categorie: 'securite', langage: 'SQL', focus: 'évite qu’une entrée soit interprétée comme une partie de la requête', code: 'await db.query(\'select * from users where email = $1\', [email]);\n// paramètres séparés : ne jamais concaténer email dans la chaîne SQL', aliases: ['SQLi', 'requête paramétrée'], related: ['validation-schema', 'postgresql'] },
  { id: 'csrf', terme: 'CSRF', categorie: 'securite', langage: 'HTTP', focus: 'empêche un autre site de faire exécuter à un navigateur une action non voulue', code: 'app.use(csrf({ cookie: { httpOnly: true, sameSite: \'lax\' } }));\n// vérifier aussi Origin/Referer pour les actions sensibles', aliases: ['Cross-Site Request Forgery'], related: ['cookie', 'session'] },
  { id: 'securite-cors', terme: 'CORS sécurisé', categorie: 'securite', langage: 'HTTP', focus: 'autorise seulement les origines nécessaires au lieu d’ouvrir l’API à tout le web', code: 'const allowed = new Set([\'https://app.example.com\']);\nif (allowed.has(req.headers.origin)) res.setHeader(\'Access-Control-Allow-Origin\', req.headers.origin);', aliases: ['allow origin', 'origin policy'], related: ['cors', 'auth'] },
  { id: 'secrets', terme: 'Secrets et variables d’environnement', categorie: 'securite', langage: 'Shell', focus: 'fournit une configuration sensible au serveur sans l’inscrire dans le code versionné', code: 'const databaseUrl = process.env.DATABASE_URL;\nif (!databaseUrl) throw new Error(\'DATABASE_URL manquante\');', aliases: ['secret manager', 'env'], related: ['env-vars', 'password-hashing'] },
  { id: 'csp', terme: 'Content Security Policy', categorie: 'securite', langage: 'HTTP', focus: 'limite les sources de scripts, images et connexions acceptées par le navigateur', code: 'Content-Security-Policy: default-src \'self\'; script-src \'self\'; connect-src \'self\' https://api.example.com', aliases: ['CSP', 'security headers'], related: ['xss', 'securite-cors'] },
  { id: 'ssrf', terme: 'SSRF', categorie: 'securite', langage: 'Backend', focus: 'empêche un serveur de devenir un proxy vers des adresses internes contrôlées par l’utilisateur', code: 'const url = new URL(input);\nif (![\'https:\'].includes(url.protocol) || !isAllowedHost(url.hostname)) {\n  throw new Error(\'Destination refusée\');\n}', aliases: ['Server-Side Request Forgery'], related: ['validation-schema', 'secrets'] },

  { id: 'git', terme: 'Git', categorie: 'infrastructure', langage: 'Shell', focus: 'versionne les changements et permet de comparer, relire ou restaurer un état', code: 'git status\ngit add src/\ngit commit -m "Ajoute la validation"\ngit log --oneline -5', aliases: ['versionnement', 'commit'], related: ['ci-cd', 'branch'] },
  { id: 'branch', terme: 'Branche Git', categorie: 'infrastructure', langage: 'Shell', focus: 'isole une ligne de travail avant de la relire et de l’intégrer', code: 'git switch -c feat/library\ngit diff main...HEAD\ngit switch main', aliases: ['branch', 'merge request'], related: ['git', 'ci-cd'] },
  { id: 'docker', terme: 'Docker', categorie: 'infrastructure', langage: 'Dockerfile', focus: 'emballe une application et ses dépendances dans une image exécutable de façon reproductible', code: 'FROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nCMD ["npm", "start"]', aliases: ['conteneurisation', 'container'], related: ['docker-image', 'ci-cd'] },
  { id: 'docker-image', terme: 'Image Docker', categorie: 'infrastructure', langage: 'Shell', focus: 'décrit un artefact immuable à partir duquel des conteneurs peuvent être lancés', code: 'docker build -t bibliolearn:dev .\ndocker run --rm -p 3000:3000 bibliolearn:dev', aliases: ['image', 'registry'], related: ['docker', 'deploy'] },
  { id: 'container', terme: 'Conteneur', categorie: 'infrastructure', langage: 'Shell', focus: 'exécute un processus isolé avec l’environnement défini par une image', code: 'docker run --name api --env-file .env.local -p 3000:3000 bibliolearn:dev\ndocker logs api', aliases: ['runtime container', 'service'], related: ['docker', 'logs'] },
  { id: 'reverse-proxy', terme: 'Reverse proxy', categorie: 'infrastructure', langage: 'HTTP', focus: 'reçoit le trafic public puis le transmet au bon service interne', code: 'location /api/ {\n  proxy_pass http://api:3000;\n  proxy_set_header X-Request-Id $request_id;\n}', aliases: ['proxy inverse', 'gateway'], related: ['nginx', 'cdn'] },
  { id: 'nginx', terme: 'Nginx', categorie: 'infrastructure', langage: 'Nginx', focus: 'sert des fichiers, termine TLS et route des requêtes avec peu de ressources', code: 'server {\n  listen 443 ssl;\n  location / { try_files $uri /index.html; }\n}', aliases: ['web server', 'proxy'], related: ['reverse-proxy', 'cdn'] },
  { id: 'cdn', terme: 'CDN', categorie: 'infrastructure', langage: 'Architecture', focus: 'rapproche des fichiers ou réponses cacheables des utilisateurs', code: 'Cache-Control: public, max-age=31536000, immutable\n# pour un fichier versionné par hash', aliases: ['Content Delivery Network', 'edge cache'], related: ['cache', 'vercel'] },
  { id: 'ci-cd', terme: 'CI/CD', categorie: 'infrastructure', langage: 'YAML', focus: 'vérifie et déploie automatiquement un changement selon un pipeline reproductible', code: 'steps:\n  - run: npm ci\n  - run: npm run check\n  - run: npm run build', aliases: ['pipeline', 'continuous integration'], related: ['git', 'tests-unitaires'] },
  { id: 'vercel', terme: 'Vercel', categorie: 'infrastructure', langage: 'Shell', focus: 'déploie des sites et fonctions avec previews, CDN et intégration Git', code: 'vercel link\nvercel deploy\nvercel --prod', aliases: ['deployment frontend', 'hosting'], related: ['cdn', 'env-vars'] },
  { id: 'logs', terme: 'Logs structurés', categorie: 'infrastructure', langage: 'JSON', focus: 'décrivent un événement exploitable par une personne et une plateforme d’observabilité', code: 'console.info(JSON.stringify({\n  event: \'lesson.loaded\', requestId, lessonId, durationMs\n}));', aliases: ['journalisation', 'logging'], related: ['metrics', 'tracing'] },
  { id: 'metrics', terme: 'Métriques', categorie: 'infrastructure', langage: 'Architecture', focus: 'mesurent une tendance agrégée comme le débit, la latence ou le taux d’erreur', code: 'httpRequestsTotal.inc({ route: \'/api/lessons\', status: 200 });\nhttpRequestDuration.observe({ route: \'/api/lessons\' }, durationMs);', aliases: ['monitoring', 'counters'], related: ['logs', 'healthcheck'] },
  { id: 'tracing', terme: 'Tracing distribué', categorie: 'infrastructure', langage: 'Architecture', focus: 'suit une requête à travers plusieurs services avec un même identifiant de trace', code: 'const span = tracer.startSpan(\'lessons.list\');\ntry { return await repository.list(); } finally { span.end(); }', aliases: ['trace', 'span', 'OpenTelemetry'], related: ['logs', 'metrics'] },
  { id: 'env-vars', terme: 'Variables d’environnement', categorie: 'infrastructure', langage: 'Shell', focus: 'sépare le code d’une configuration qui change selon local, test et production', code: 'PORT=3000\nLOG_LEVEL=info\nPUBLIC_API_URL=https://api.example.com\n# ne jamais mettre un secret public dans le bundle', aliases: ['.env', 'configuration'], related: ['secrets', 'vercel'] },
  { id: 'healthcheck', terme: 'Healthcheck', categorie: 'infrastructure', langage: 'HTTP', focus: 'signale si un processus répond et si ses dépendances essentielles sont disponibles', code: 'app.get(\'/health\', async (_req, res) => {\n  await db.query(\'select 1\');\n  res.json({ status: \'ok\' });\n});', aliases: ['liveness', 'readiness'], related: ['metrics', 'deploy'] },

  { id: 'npm', terme: 'npm', categorie: 'outils', langage: 'Shell', focus: 'installe des packages, exécute des scripts et publie des versions JavaScript', code: 'npm install\nnpm run check\nnpm install zod\nnpm uninstall zod', aliases: ['Node Package Manager', 'registry'], related: ['package-json', 'lockfile'] },
  { id: 'package-json', terme: 'package.json', categorie: 'outils', langage: 'JSON', focus: 'déclare le projet, ses scripts, ses dépendances et des métadonnées de publication', code: '{\n  "scripts": { "check": "node scripts/check.js" },\n  "dependencies": { "express": "^5.1.0" }\n}', aliases: ['manifest', 'npm scripts'], related: ['npm', 'semver'] },
  { id: 'lockfile', terme: 'Lockfile', categorie: 'outils', langage: 'JSON', focus: 'fige l’arbre exact des dépendances installé par l’équipe et la CI', code: 'npm ci\n# utilise package-lock.json sans recalculer librement les versions', aliases: ['package-lock', 'pnpm-lock'], related: ['npm', 'semver'] },
  { id: 'npx', terme: 'npx', categorie: 'outils', langage: 'Shell', focus: 'exécute un binaire de package sans l’installer globalement au préalable', code: 'npx playwright install\nnpx create-vite@latest', aliases: ['package runner', 'CLI local'], related: ['npm', 'vite'] },
  { id: 'pnpm', terme: 'pnpm', categorie: 'outils', langage: 'Shell', focus: 'gère des packages avec un store partagé et une installation efficace', code: 'pnpm install\npnpm add zod\npnpm run test', aliases: ['workspace package manager', 'monorepo'], related: ['npm', 'lockfile'] },
  { id: 'eslint', terme: 'ESLint', categorie: 'outils', langage: 'JavaScript', focus: 'signale des erreurs de style ou de logique détectables statiquement', code: 'export default [\n  { rules: { \'no-unused-vars\': \'error\' } }\n];\n\n// npm run lint', aliases: ['lint', 'linter'], related: ['prettier', 'ci-cd'] },
  { id: 'prettier', terme: 'Prettier', categorie: 'outils', langage: 'Shell', focus: 'formate automatiquement le code selon une règle commune', code: 'npx prettier --write "src/**/*.{js,css,html}"\nnpx prettier --check "src/**/*.{js,css,html}"', aliases: ['formatage', 'formatter'], related: ['eslint', 'package-json'] },
  { id: 'tests-unitaires', terme: 'Test unitaire', categorie: 'outils', langage: 'JavaScript', focus: 'vérifie une petite unité de logique avec un résultat attendu explicite', code: 'it(\'calcule le total\', () => {\n  expect(total([{ prix: 10 }])).toBe(10);\n});', aliases: ['unit test', 'assertion'], related: ['vitest', 'fonctions-js'] },
  { id: 'vitest', terme: 'Vitest', categorie: 'outils', langage: 'JavaScript', focus: 'exécute rapidement des tests JavaScript proches de l’environnement Vite', code: 'import { describe, expect, it } from \'vitest\';\n\ndescribe(\'price\', () => {\n  it(\'returns zero for an empty list\', () => expect(total([])).toBe(0));\n});', aliases: ['test runner', 'mock'], related: ['tests-unitaires', 'vite'] },
  { id: 'playwright', terme: 'Playwright', categorie: 'outils', langage: 'TypeScript', focus: 'teste un parcours réel dans un navigateur avec clics, navigation et assertions', code: 'test(\'un visiteur ouvre une leçon\', async ({ page }) => {\n  await page.goto(\'http://localhost:3000/#/accueil\');\n  await page.getByRole(\'button\', { name: /leçons/i }).click();\n  await expect(page.locator(\'main\')).toContainText(\'Leçon\');\n});', aliases: ['E2E', 'browser test'], related: ['tests-unitaires', 'vercel'] },
  { id: 'jest', terme: 'Jest', categorie: 'outils', langage: 'JavaScript', focus: 'fournit un environnement de tests avec mocks, assertions et couverture', code: 'test(\'normalise le titre\', () => {\n  expect(normalize(\'  Bonjour  \')).toBe(\'bonjour\');\n});', aliases: ['test framework', 'snapshot'], related: ['tests-unitaires', 'mock'] },
  { id: 'curl', terme: 'curl', categorie: 'outils', langage: 'Shell', focus: 'inspecte ou appelle une ressource HTTP depuis le terminal', code: 'curl -i http://localhost:3000/api/health\ncurl -X POST http://localhost:3000/api/lessons \\\n  -H \'content-type: application/json\' \\\n  -d \'{"title":"Demo"}\'', aliases: ['HTTP CLI', 'requête terminal'], related: ['rest-api', 'logs'] },
  { id: 'rg', terme: 'ripgrep (rg)', categorie: 'outils', langage: 'Shell', focus: 'cherche rapidement du texte dans un dépôt en respectant les exclusions Git', code: 'rg -n "fetch\\(|TODO|bibliolearn" src public scripts\nrg --files -g "*.js"', aliases: ['ripgrep', 'recherche code'], related: ['bash', 'git'] },
  { id: 'bash', terme: 'Bash', categorie: 'outils', langage: 'Shell', focus: 'enchaîne des commandes et automatise des tâches de projet', code: '#!/usr/bin/env bash\nset -euo pipefail\nnpm ci\nnpm run check\nnpm run build', aliases: ['shell', 'script terminal'], related: ['git', 'makefile'] },
  { id: 'makefile', terme: 'Makefile', categorie: 'outils', langage: 'Make', focus: 'nomme des commandes reproductibles et leurs dépendances dans un projet', code: '.PHONY: check build\ncheck:\n\tnpm run check\nbuild: check\n\tnpm run build', aliases: ['make', 'task runner'], related: ['bash', 'ci-cd'] },
  { id: 'semver', terme: 'SemVer', categorie: 'outils', langage: 'Documentation', focus: 'exprime la compatibilité attendue d’une version avec major, minor et patch', code: '1.4.2\n^1.4.2  # accepte les mises à jour compatibles de la série 1.x\n~1.4.2  # reste dans 1.4.x', aliases: ['semantic versioning', 'versioning'], related: ['package-json', 'lockfile'] },
  { id: 'mock', terme: 'Mock et stub', categorie: 'outils', langage: 'JavaScript', focus: 'remplace temporairement une dépendance pour isoler un scénario de test', code: 'const repository = {\n  find: vi.fn().mockResolvedValue({ id: \'l-1\' })\n};\nawait service.load(repository);\nexpect(repository.find).toHaveBeenCalledWith(\'l-1\');', aliases: ['test double', 'spy'], related: ['vitest', 'jest'] },
  { id: 'deploy', terme: 'Déploiement', categorie: 'outils', langage: 'Processus', focus: 'rend une version du code disponible dans un environnement donné avec une procédure vérifiable', code: 'npm run check\nnpm run build\ngit tag v1.2.0\n# publier l’artefact puis vérifier /health et un parcours utilisateur', aliases: ['release', 'mise en production'], related: ['ci-cd', 'healthcheck'] },
  { id: 'idempotence', terme: 'Idempotence', categorie: 'outils', langage: 'Architecture', focus: 'permet de rejouer une demande sans créer plusieurs effets métier identiques', code: 'const key = req.headers[\'idempotency-key\'];\nconst previous = await store.findByKey(key);\nif (previous) return res.json(previous.response);', aliases: ['idempotent', 'retry safe'], related: ['queue', 'transaction-sql'] },
  { id: 'retry', terme: 'Retry avec backoff', categorie: 'outils', langage: 'JavaScript', focus: 'réessaie une opération temporairement indisponible avec une limite et un délai croissant', code: 'for (let attempt = 0; attempt < 3; attempt++) {\n  try { return await call(); }\n  catch (error) { await delay(2 ** attempt * 100); }\n}\nthrow new Error(\'Échec définitif\');', aliases: ['reprise', 'backoff'], related: ['queue', 'idempotence'] }
];

function creerEntree(graine) {
  const profil = profils[graine.categorie];
  const roles = [
    graine.terme + ' sert de point de repère pour ' + graine.focus + '.',
    profil.role,
    'Il peut aussi servir de contrat de discussion entre le code, les données, l’infrastructure et la personne qui devra maintenir le projet.'
  ];
  const scenarios = profil.scenarios.map((scenario, index) => ({
    cas: scenario.cas,
    decision: scenario.decision,
    pourquoi: scenario.pourquoi,
    application: index === 0 ? graine.focus + '.' : 'Avec ' + graine.terme + ', vérifier surtout que ' + scenario.pourquoi.charAt(0).toLowerCase() + scenario.pourquoi.slice(1)
  }));

  return {
    id: graine.id,
    terme: graine.terme,
    categorie: profil.nom,
    famille: graine.categorie,
    niveau: graine.niveau || 'Débutant → junior',
    aliases: graine.aliases || [],
    resume: graine.focus.charAt(0).toUpperCase() + graine.focus.slice(1) + ', avec des décisions différentes selon le trafic, le risque et la structure du projet.',
    definition: graine.terme + ' est une notion de ' + profil.nom.toLowerCase() + ' qui ' + graine.focus + '. Pour un débutant, l’idée importante est de comprendre la frontière : ce que ' + graine.terme + ' reçoit, ce qu’il transforme, ce qu’il renvoie et ce qui reste sous la responsabilité d’une autre couche.',
    roles,
    pourquoiUtiliser: profil.pourquoi.map((texte) => texte + ' Dans le cas de ' + graine.terme + ', cela se traduit par une intention lisible et vérifiable.'),
    nePasUtiliser: profil.eviter.map((texte) => texte + ' Si cette règle est ignorée, la complexité ou le risque est déplacé vers une autre partie du système.'),
    avertissements: profil.avertissements.concat([
      'Toujours identifier la source de vérité : affichage, cache, API, service ou base ne portent pas tous la même responsabilité.',
      'Avant de copier l’exemple, adapter les noms, la validation, les droits et la gestion d’erreur au contexte réel.'
    ]),
    scenarios,
    structure: [
      profil.structure,
      'Pour ' + graine.terme + ', isoler l’intention dans un fichier ou module nommé, puis faire transiter des valeurs explicites plutôt que de lire un état global caché.',
      'Une structure saine sépare la lecture, la transformation, la validation et la transmission. Elle permet de remplacer l’outil sans réécrire toute la logique métier.'
    ],
    typesDonnees: profil.types,
    cycleDonnees: 'Entrée → validation → transformation minimale → traitement → persistance ou transport → réponse adaptée → observation. Ne convertir une donnée que lorsque la couche suivante en a besoin, et documenter la conversion.',
    exemples: [{
      titre: 'Exemple minimal : ' + graine.terme,
      langage: graine.langage,
      contenu: graine.code,
      explication: 'Cet exemple montre le geste principal de ' + graine.terme + '. En production, compléter avec la validation de l’entrée, une gestion d’erreur utile, les droits nécessaires et un test du scénario limite.'
    }],
    exercice: {
      duree: graine.duree || '25 min',
      objectif: 'Utiliser ' + graine.terme + ' dans un petit flux de données : recevoir une entrée, produire un résultat lisible et expliquer la décision prise.',
      contexte: 'Vous travaillez sur une fonctionnalité junior appelée « carnet de leçons ». Une donnée arrive, doit être comprise, puis transmise à la prochaine couche sans perdre son sens.',
      etapes: [
        'Écrire un exemple nominal avec une donnée réaliste et nommer clairement chaque étape.',
        'Ajouter un cas vide, invalide ou indisponible et afficher l’erreur sans révéler de secret.',
        'Noter où la donnée est transformée, qui est autorisé à l’utiliser et combien de temps elle doit vivre.',
        'Ajouter une vérification simple : assertion, log structuré, réponse HTTP ou contrôle manuel selon le terme.'
      ],
      validation: ['Le cas nominal fonctionne.', 'Le cas limite donne une réponse compréhensible.', 'La donnée n’est pas envoyée à une couche qui n’en a pas besoin.', 'La décision est expliquée dans un README ou un commentaire court.']
    },
    associes: graine.related || [],
    liens: [{ label: 'Documentation officielle de référence', url: graine.url || profil.url }]
  };
}

const bibliotheque = graines.map(creerEntree);

function validerBibliotheque() {
  const ids = new Set();
  for (const entree of bibliotheque) {
    if (!entree.id || !entree.terme || !entree.definition || !entree.exemples?.length || !entree.exercice?.etapes?.length) {
      throw new Error('Entrée de bibliothèque incomplète : ' + (entree.id || entree.terme || 'sans identifiant'));
    }
    if (ids.has(entree.id)) throw new Error('Identifiant de bibliothèque dupliqué : ' + entree.id);
    ids.add(entree.id);
  }
  for (const entree of bibliotheque) {
    for (const associe of entree.associes) {
      if (!ids.has(associe)) throw new Error('Association inconnue dans la bibliothèque ' + entree.id + ' : ' + associe);
    }
  }
}

validerBibliotheque();

module.exports = bibliotheque;
