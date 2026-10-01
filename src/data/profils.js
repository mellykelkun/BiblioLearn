'use strict';

function profil(concepts, explication, scenarios, langage, code, legende) {
  return { concepts, explication, scenarios, langage, code, legende };
}

const profilsDomaine = {
  html: profil(
    ['structure', 'sémantique', 'accessibilité', 'progressive enhancement'],
    'HTML est le contrat de contenu de la page. Le navigateur, un lecteur d’écran et un moteur de recherche doivent comprendre la structure même si le CSS ou JavaScript ne se charge pas.',
    [['Page éditoriale', 'HTML sémantique et titres logiques', 'Le contenu reste lisible, indexable et navigable au clavier.'], ['Application interactive', 'Commencer par une structure utilisable puis enrichir avec JavaScript', 'Une interface partiellement chargée reste compréhensible.'], ['Contenu utilisateur', 'Échapper et filtrer avant insertion', 'Le HTML ne devient pas un chemin d’injection.']],
    'HTML',
    '<main>\n  <h1>Choisir une ressource</h1>\n  <form>\n    <label for="recherche">Recherche</label>\n    <input id="recherche" name="q" type="search">\n    <button type="submit">Rechercher</button>\n  </form>\n</main>',
    'Exercice : identifiez le rôle de chaque élément et testez le formulaire au clavier.'
  ),
  css: profil(
    ['cascade', 'box model', 'layout', 'responsive design'],
    'CSS transforme une structure en interface. Une règle maintenable part d’un flux naturel, utilise des contraintes simples et ajoute les exceptions seulement quand le scénario les justifie.',
    [['Composant réutilisable', 'Propriétés locales et container query', 'Le composant réagit à son espace réel.'], ['Quelques tailles fixes', 'Media queries simples', 'Elles sont faciles à expliquer quand la fenêtre pilote la mise en page.'], ['Thème clair et sombre', 'Custom properties centralisées', 'Une décision visuelle se modifie sans réécrire les sélecteurs.']],
    'CSS',
    ':root { --espace: 1rem; --surface: #fff; --texte: #243447; }\n\n.carte {\n  display: grid;\n  gap: var(--espace);\n  color: var(--texte);\n  background: var(--surface);\n}',
    'Exercice : redimensionnez la fenêtre puis remplacez une valeur du thème.'
  ),
  javascript: profil(
    ['données', 'fonctions', 'état', 'asynchronisme'],
    'JavaScript orchestre des données et des actions. Séparez transformation pure, accès au monde extérieur et affichage pour savoir où chercher quand un résultat est faux.',
    [['Calcul local', 'Fonction pure avec paramètres', 'Le résultat est facile à tester.'], ['Donnée distante', 'États chargement, succès et erreur', 'Le réseau est lent ou renvoie parfois une forme inattendue.'], ['Action répétée', 'Contrôler l’état et annuler si nécessaire', 'On évite résultats périmés et doubles soumissions.']],
    'JavaScript',
    'function filtrerActifs(elements, terme) {\n  const recherche = terme.trim().toLowerCase();\n  return elements.filter((element) =>\n    element.actif && element.nom.toLowerCase().includes(recherche)\n  );\n}\n\nconsole.log(filtrerActifs([{ nom: "Ada", actif: true }], "ad"));',
    'Exercice : ajoutez un cas vide, accentué et inactif.'
  ),
  dom: profil(
    ['sélection', 'événement', 'état d’interface', 'délégation'],
    'Le DOM est une représentation vivante du document. Une interaction fiable lit l’événement, modifie l’état métier puis synchronise l’affichage sans laisser d’anciens écouteurs actifs.',
    [['Petit bouton isolé', 'Écoute directe', 'La relation entre action et effet est immédiate.'], ['Liste qui change', 'Délégation sur le parent', 'Les nouveaux éléments fonctionnent sans nouvel écouteur.'], ['Composant démontable', 'Nettoyage des écouteurs', 'Les ressources ne restent pas actives.']],
    'JavaScript',
    'const liste = document.querySelector("#liste");\n\nliste.addEventListener("click", (event) => {\n  const bouton = event.target.closest("[data-supprimer]");\n  if (!bouton) return;\n  bouton.closest("li")?.remove();\n});',
    'Exercice : ajoutez une confirmation et testez une ligne ajoutée après le chargement.'
  ),
  node: profil(
    ['runtime', 'I/O', 'processus', 'erreurs système'],
    'Node.js exécute JavaScript dans un processus qui dialogue avec le système : fichiers, réseau et processus enfants. Chaque opération doit signaler sa fin ou son échec.',
    [['Petit fichier', 'API promise', 'Le code est court pour une donnée raisonnable.'], ['Gros fichier', 'Stream et backpressure', 'La mémoire reste stable.'], ['Commande serveur', 'Validation et journalisation sans secret', 'Le processus reste observable et sûr.']],
    'Node.js',
    'const { readFile } = require("node:fs/promises");\n\nasync function chargerConfiguration() {\n  try {\n    return JSON.parse(await readFile("./config.json", "utf8"));\n  } catch (erreur) {\n    throw new Error("Configuration illisible", { cause: erreur });\n  }\n}',
    'Exercice : simulez un fichier absent et écrivez un message public utile.'
  ),
  npm: profil(
    ['package.json', 'scripts', 'lockfile', 'semver'],
    'npm décrit comment installer et exécuter un projet JavaScript. package.json explique l’intention ; le lockfile fixe l’arbre réel des dépendances.',
    [['Application', 'Committer le lockfile et utiliser npm ci', 'L’installation est reproductible.'], ['Bibliothèque', 'Dependencies pour les paquets d’exécution', 'Le consommateur reçoit le nécessaire.'], ['Outil ponctuel', 'npx ou script local', 'On évite une installation globale non versionnée.']],
    'JSON',
    '{\n  "scripts": {\n    "check": "node --check src/index.js",\n    "test": "node --test",\n    "start": "node src/server.js"\n  },\n  "engines": { "node": ">=20" }\n}',
    'Exercice : ajoutez un script de qualité et lancez-le depuis une machine neuve.'
  ),
  http: profil(
    ['méthode', 'statut', 'en-têtes', 'représentation'],
    'HTTP est un contrat entre client et serveur. Une réponse indique séparément le résultat, la manière de lire le contenu et sa durée de conservation.',
    [['Lire', 'GET avec 200 ou 404', 'Le client ne devine pas le résultat.'], ['Créer', 'POST puis 201 et Location', 'Le contrat décrit la création.'], ['Inchangé', 'Cache-Control, ETag et 304', 'Le serveur évite un transfert inutile.']],
    'HTTP',
    'POST /api/livres HTTP/1.1\nContent-Type: application/json\n\n{"titre":"Comprendre HTTP"}\n\nHTTP/1.1 201 Created\nLocation: /api/livres/42\nContent-Type: application/json',
    'Exercice : dessinez les réponses pour une ressource absente et un JSON invalide.'
  ),
  express: profil(
    ['route', 'middleware', 'validation', 'erreur centralisée'],
    'Express assemble une requête à travers des middleware. Une route valide, appelle le métier et traduit le résultat en HTTP ; un middleware global traite les erreurs inattendues.',
    [['Entrée manquante', '400 actionnable', 'Le client peut corriger sa requête.'], ['Ressource absente', '404', 'L’absence n’est pas une panne.'], ['Exception imprévue', 'Middleware d’erreur et 500', 'Les détails internes ne fuient pas.']],
    'JavaScript',
    'app.post("/api/livres", (req, res, next) => {\n  if (typeof req.body?.titre !== "string" || !req.body.titre.trim()) {\n    return res.status(400).json({ erreur: "Le titre est obligatoire" });\n  }\n  try { return res.status(201).json(creerLivre(req.body)); }\n  catch (erreur) { return next(erreur); }\n});',
    'Exercice : ajoutez une longueur maximale et testez trois réponses.'
  ),
  shell: profil(
    ['chemin courant', 'sortie standard', 'pipeline', 'code retour'],
    'Le shell compose de petites commandes. Une commande fiable connaît son dossier, distingue sa sortie de ses erreurs et transmet un code retour à la CI.',
    [['Recherche', 'pwd, rg et sortie limitée', 'Le périmètre est visible.'], ['CI', 'Mode strict et codes retour', 'Une étape échoue au bon endroit.'], ['Chemin utilisateur', 'Quoter les variables', 'Les espaces ne cassent pas la commande.']],
    'Bash',
    '#!/usr/bin/env bash\nset -euo pipefail\n\nracine="$1"\nprintf "Analyse de : %s\\n" "$racine"\nrg -n --glob "*.js" "TODO|FIXME" "$racine" || true',
    'Exercice : passez un chemin avec des espaces et comparez absence de résultat et erreur.'
  ),
  typescript: profil(
    ['contrat statique', 'narrowing', 'union', 'frontière d’exécution'],
    'TypeScript prévient des confusions avant l’exécution. À la frontière avec JSON, formulaire ou stockage, il faut encore vérifier la forme réelle.',
    [['Code interne', 'strict et types explicites', 'Les incohérences apparaissent tôt.'], ['API externe', 'Type puis validation runtime', 'Le parseur vérifie la réalité.'], ['États incompatibles', 'Union discriminée', 'Le compilateur force la gestion des cas.']],
    'TypeScript',
    'type Reponse =\n  | { ok: true; valeur: string }\n  | { ok: false; message: string };\n\nfunction afficher(reponse: Reponse) {\n  if (reponse.ok) return reponse.valeur;\n  return "Erreur : " + reponse.message;\n}',
    'Exercice : ajoutez un état loading et traitez chaque branche.'
  ),
  react: profil(
    ['rendu', 'props', 'état', 'effets'],
    'React décrit l’interface à partir des props et de l’état. Le rendu reste une description ; un effet synchronise un système extérieur.',
    [['Valeur calculée', 'Dériver pendant le rendu', 'Pas d’état dupliqué.'], ['Interaction locale', 'useState près du composant', 'La source de vérité est claire.'], ['Réseau', 'Effet avec annulation ou nettoyage', 'Les réponses périmées sont évitées.']],
    'JSX',
    'function Resultat({ elements, recherche }) {\n  const visibles = elements.filter((element) =>\n    element.nom.toLowerCase().includes(recherche.toLowerCase())\n  );\n  return <ul>{visibles.map((element) =>\n    <li key={element.id}>{element.nom}</li>\n  )}</ul>;\n}',
    'Exercice : ajoutez un état vide et justifiez une clé stable.'
  ),
  nextjs: profil(
    ['rendu serveur', 'client', 'cache', 'navigation'],
    'Next.js ajoute des décisions autour de React : où lire la donnée, où exécuter le code et quoi envoyer au navigateur. La frontière client doit être justifiée.',
    [['Contenu', 'Serveur et données près de la page', 'HTML utile et moins de JavaScript.'], ['Filtre', 'Composant client isolé', 'Seule la partie interactive est envoyée.'], ['Donnée changeante', 'Revalidation ou dynamique explicite', 'Le cache ne sert pas du périmé par accident.']],
    'JavaScript',
    '// app/livres/page.js\nexport default async function Page() {\n  const reponse = await fetch(url, { next: { revalidate: 60 } });\n  const livres = await reponse.json();\n  return <main><h1>Livres</h1><pre>{JSON.stringify(livres)}</pre></main>;\n}',
    'Exercice : décidez si votre donnée peut rester 60 secondes en cache.'
  ),
  vue: profil(
    ['réactivité', 'props', 'émissions', 'composable'],
    'Vue rend les dépendances visibles : une donnée réactive déclenche les templates qui la lisent. Les props descendent et les événements remontent.',
    [['Valeur dérivée', 'computed', 'La valeur reste liée à ses sources.'], ['Effet', 'watch ciblé', 'Le réseau ne se déclenche pas inutilement.'], ['Logique partagée', 'Composable testable', 'La règle est réutilisée sans copier-coller.']],
    'Vue',
    '<script setup>\nimport { computed, ref } from "vue";\nconst recherche = ref("");\nconst livres = ref([{ titre: "Le Web" }]);\nconst visibles = computed(() => livres.value.filter((livre) =>\n  livre.titre.toLowerCase().includes(recherche.value.toLowerCase())\n));\n</script>',
    'Exercice : ajoutez un message vide et expliquez pourquoi une prop ne se modifie pas.'
  ),
  angular: profil(
    ['composant', 'injection', 'observable', 'formulaire réactif'],
    'Angular fournit un cadre complet : composants, services, injection et formulaires. Cette structure aide les grandes équipes si chaque couche garde sa responsabilité.',
    [['Écran', 'Composant centré sur l’affichage', 'La logique reste lisible.'], ['API', 'Service injectable', 'Les composants ne répètent pas le réseau.'], ['Formulaire', 'Reactive Forms et validators', 'Les règles deviennent testables.']],
    'TypeScript',
    'import { Component, inject } from "@angular/core";\nimport { LivresService } from "./livres.service";\n\n@Component({ selector: "app-livres", standalone: true, template: "<h1>Livres</h1>" })\nexport class LivresComponent {\n  private service = inject(LivresService);\n  livres = this.service.livres;\n}',
    'Exercice : dessinez la frontière composant/service et testez avec un service simulé.'
  ),
  'css-outils': profil(
    ['tokens', 'utilitaires', 'composants', 'coût de dépendance'],
    'Un outil CSS accélère l’écriture mais ne remplace ni la structure, ni l’accessibilité, ni la cohérence du design system.',
    [['Prototype', 'Utilitaires ou framework léger', 'Le coût de démarrage est faible.'], ['Design system', 'Tokens et composants documentés', 'La cohérence devient prioritaire.'], ['Petit site', 'CSS natif structuré', 'Une dépendance de moins est facile à maintenir.']],
    'HTML / CSS',
    '<article class="card card--featured">\n  <h2 class="card__title">Cours frontend</h2>\n  <p class="card__text">Une structure explicite.</p>\n</article>\n\n.card { padding: var(--space-4); border-radius: var(--radius); }',
    'Exercice : comparez un composant CSS classique et sa version utilitaire.'
  )
};

const fluxParFamille = {
  interface: {
    transmettre: 'Dans une interface, la donnée passe souvent de l’utilisateur vers l’état, puis de l’état vers le rendu. Ne transmettez que ce qui est nécessaire : un composant enfant reçoit des props lisibles, une API reçoit un DTO validé et le navigateur ne reçoit jamais un secret.',
    cycle: [
      { terme: 'Demander', explication: 'Définir le besoin visible : texte, nombre, choix, fichier ou action. Un champ doit avoir un nom et une règle compréhensibles.' },
      { terme: 'Valider', explication: 'Vérifier présence, type, taille et format avant de modifier l’état. La validation du navigateur améliore le confort, mais le serveur doit la refaire.' },
      { terme: 'Transformer', explication: 'Convertir seulement quand le contrat le demande : trim pour un texte, Number pour un nombre explicite, FormData pour un fichier.' },
      { terme: 'Transmettre', explication: 'Envoyer un objet stable, avec Content-Type adapté et sans données privées inutiles. Une réponse doit avoir un état de chargement et un état d’erreur.' },
      { terme: 'Stocker', explication: 'Garder l’état local dans le composant si possible. localStorage ne convient pas aux secrets et une donnée serveur doit avoir une source de vérité.' },
      { terme: 'Observer', explication: 'Afficher un résultat, un message d’erreur et un état vide. Sans observation, on ne sait pas si la donnée a été reçue ou simplement ignorée.' }
    ],
    scenarios: [
      ['État local d’un formulaire', 'string / number / boolean validés', 'État React/Vue/Angular ou DOM', 'Ne pas stocker de secret dans le navigateur.'],
      ['Réponse d’API', 'DTO JSON validé à la frontière', 'fetch avec timeout et états UI', 'Ne jamais faire confiance au type annoncé par le serveur.'],
      ['Fichier envoyé', 'File puis FormData', 'multipart/form-data', 'Limiter taille, MIME et nom ; contrôler côté serveur.']
    ],
    code: 'async function envoyerFormulaire(formulaire) {\n  const donnees = {\n    nom: formulaire.nom.trim(),\n    age: Number(formulaire.age)\n  };\n  if (!donnees.nom || !Number.isInteger(donnees.age)) {\n    throw new Error("Donnée invalide");\n  }\n  const reponse = await fetch("/api/profil", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify(donnees)\n  });\n  if (!reponse.ok) throw new Error("Transmission refusée");\n  return reponse.json();\n}',
    langage: 'JavaScript',
    legende: 'Mini-exercice : dessinez l’entrée, la donnée validée, le transport et la réponse avant d’ajouter l’affichage.'
  },
  serveur: {
    transmettre: 'Sur le serveur, toute donnée reçue est inconnue jusqu’à validation. Séparez le transport HTTP, la validation, la logique métier et la persistance : cela évite de mettre directement req.body en base ou de renvoyer une erreur interne au client.',
    cycle: [
      { terme: 'Demander', explication: 'Décrire un contrat d’entrée : champs obligatoires, types, tailles, autorisation et format de réponse attendu.' },
      { terme: 'Valider', explication: 'Parser JSON et contrôler les champs avec une règle côté serveur. Refuser tôt avec 400 si le client peut corriger.' },
      { terme: 'Transformer', explication: 'Convertir le DTO HTTP en modèle métier : normaliser un email, calculer une valeur et retirer les champs interdits.' },
      { terme: 'Transmettre', explication: 'Répondre avec le bon statut, Content-Type et une forme stable. Ne pas exposer stack, SQL, token ou chemin interne.' },
      { terme: 'Stocker', explication: 'Utiliser des requêtes paramétrées, des contraintes de base et une transaction lorsque plusieurs écritures doivent réussir ensemble.' },
      { terme: 'Observer', explication: 'Journaliser un identifiant de requête, la durée et la classe d’erreur sans journaliser les mots de passe ou tokens.' }
    ],
    scenarios: [
      ['Entrée JSON publique', 'unknown puis schéma validé', 'HTTP JSON avec 400/422 en cas d’erreur', 'Limiter taille et débit, puis journaliser sans contenu sensible.'],
      ['Donnée authentifiée', 'DTO validé + utilisateur issu de la session', 'HTTP avec contrôle d’autorisation', 'L’identité ne doit pas venir d’un champ modifiable du corps.'],
      ['Écriture multi-table', 'Modèle métier et transaction', '201 seulement après commit', 'Éviter les états partiellement écrits et prévoir l’idempotence.']
    ],
    code: 'app.post("/api/livres", async (req, res, next) => {\n  try {\n    const entree = validerLivre(req.body);\n    const livre = await livresService.creer(entree, req.user.id);\n    return res.status(201).json({ id: livre.id, titre: livre.titre });\n  } catch (erreur) {\n    return next(erreur);\n  }\n});',
    langage: 'Node.js / Express',
    legende: 'Mini-exercice : séparez la donnée HTTP, le modèle métier et la réponse publique ; écrivez ce qui doit rester secret.'
  },
  contrat: {
    transmettre: 'Une API réussie n’est pas seulement une fonction qui retourne une valeur : c’est un contrat de transport. Le client doit connaître la méthode, l’URL, le statut, le type de contenu, les champs et la signification d’une erreur.',
    cycle: [
      { terme: 'Demander', explication: 'Définir la ressource, la méthode, les paramètres et les droits nécessaires avant d’écrire le endpoint.' },
      { terme: 'Valider', explication: 'Vérifier méthode, Content-Type, authentification, paramètres et corps. Une requête incorrecte doit être refusée de façon prévisible.' },
      { terme: 'Transformer', explication: 'Mapper le format externe vers un modèle interne et inversement. Ne pas exposer toute la ligne de base de données.' },
      { terme: 'Transmettre', explication: 'Choisir 200, 201, 204, 400, 401, 403, 404 ou 500 selon le sens. Le corps d’erreur doit aider sans révéler l’interne.' },
      { terme: 'Stocker', explication: 'Le cache, ETag et CDN ne sont sûrs que si la réponse est publique et versionnée. Une réponse personnalisée demande une stratégie différente.' },
      { terme: 'Observer', explication: 'Tester le contrat avec curl ou un test automatisé : succès, absence, entrée invalide, droit refusé et erreur serveur.' }
    ],
    scenarios: [
      ['API publique', 'JSON documenté et versionné', 'HTTPS avec cache contrôlé', 'Rate limit, pagination et données minimales.'],
      ['API interne', 'DTO partagé et tests de contrat', 'Réseau privé ou authentifié', 'Les versions doivent évoluer sans casser les consommateurs.'],
      ['Webhook', 'Payload signé et idempotent', 'POST avec accusé rapide', 'Vérifier signature, rejouer sans double effet et traiter en arrière-plan.']
    ],
    code: 'GET /api/livres/42 HTTP/1.1\nAccept: application/json\nAuthorization: Bearer <jeton>\n\nHTTP/1.1 200 OK\nContent-Type: application/json\nCache-Control: private, no-store\n\n{"id":42,"titre":"Comprendre les contrats"}',
    langage: 'HTTP',
    legende: 'Mini-exercice : documentez la requête et quatre réponses possibles, puis vérifiez-les avec curl.'
  },
  outils: {
    transmettre: 'Dans les outils et la CI, les données arrivent souvent sous forme de chaînes : arguments, variables d’environnement, fichiers et sorties de commandes. Parsez-les au bord du système, échouez tôt et ne mettez jamais un secret dans une sortie ou un commit.',
    cycle: [
      { terme: 'Demander', explication: 'Définir arguments, variables obligatoires, fichiers attendus et code retour avant de lancer le script.' },
      { terme: 'Valider', explication: 'Vérifier que le chemin existe, que le nombre est réellement un nombre et que les variables sensibles ne sont pas vides.' },
      { terme: 'Transformer', explication: 'Parser une chaîne vers le type utile, normaliser un chemin avec l’outil adapté et convertir un JSON seulement après contrôle.' },
      { terme: 'Transmettre', explication: 'Utiliser stdout pour le résultat, stderr pour le diagnostic et un code retour non nul pour l’échec.' },
      { terme: 'Stocker', explication: 'Conserver les secrets dans le gestionnaire de secrets de la CI, jamais dans .env commité, un log ou une commande copiée.' },
      { terme: 'Observer', explication: 'Afficher le contexte non sensible, la durée et l’étape en échec pour rendre le script dépannable.' }
    ],
    scenarios: [
      ['Commande locale', 'Arguments texte vérifiés', 'stdout, stderr et exit code', 'Éviter les chemins implicites et les variables non quotées.'],
      ['CI/CD', 'Variables injectées et types parsés', 'Logs masqués et artefact contrôlé', 'Utiliser secrets de plateforme et permissions minimales.'],
      ['Configuration serveur', 'JSON ou env validé au démarrage', 'Processus qui échoue tôt', 'Ne pas démarrer avec une configuration partiellement valide.']
    ],
    code: '#!/usr/bin/env bash\nset -euo pipefail\n\nif [[ -z "${API_URL:-}" ]]; then\n  printf "API_URL est obligatoire\\n" >&2\n  exit 2\nfi\nprintf "Configuration vérifiée\\n"',
    langage: 'Bash',
    legende: 'Mini-exercice : distinguez une erreur de configuration, une erreur réseau et un résultat vide avec des codes différents.'
  }
};

const familleParDomaine = {
  html: 'interface', css: 'interface', dom: 'interface', react: 'interface', vue: 'interface', angular: 'interface', 'css-outils': 'interface',
  javascript: 'interface', typescript: 'interface', nextjs: 'contrat',
  node: 'serveur', express: 'serveur', http: 'contrat', npm: 'outils', shell: 'outils'
};

for (const [domaine, profilDomaine] of Object.entries(profilsDomaine)) {
  profilDomaine.flux = fluxParFamille[familleParDomaine[domaine] || 'interface'];
}

module.exports = profilsDomaine;
