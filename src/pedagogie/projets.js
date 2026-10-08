'use strict';
const texte = (titre, contenu) => ({ type: 'texte', titre, contenu });
const liste = (titre, contenu) => ({ type: 'liste', titre, contenu });
module.exports = [
  {
    id: 'projet-carnet-accessible', titre: 'Livrer un carnet de lecture accessible', domaine: 'html', format: 'projet', niveau: 'Autonome', niveauPedagogique: 2, tempsEstime: 180,
    resume: 'Transformer un besoin en page HTML/CSS lisible sur téléphone et utilisable au clavier.',
    prerequis: ['html-semantique', 'html-formulaires', 'css-responsive', 'html-focus-accessible'],
    competences: ['Structurer un document sans modèle fourni.', 'Tester le clavier et justifier la disposition.'], assistance: 'reduite',
    sections: [texte('Répondre au besoin', 'Une association veut partager trois lectures, leur auteur et une courte recommandation. Une personne utilise seulement le clavier ; une autre lit sur un téléphone étroit. Concevez une page qui permette de trouver et consulter chaque recommandation.'),
      liste('Respecter les contraintes', ['Utiliser HTML et CSS, sans framework ni compte obligatoire.', 'Conserver la lisibilité à 320 px et à un agrandissement de 200 %.', 'Nommer les liens selon leur destination et fournir un texte alternatif pertinent aux images utiles.', 'Conserver le projet dans Git après la première version fonctionnelle.']),
      liste('Produire les livrables', ['La page et ses ressources.', 'Une note expliquant la structure choisie et deux alternatives écartées.', 'Une liste des vérifications effectuées et des défauts encore connus.']),
      liste('Prouver le résultat', ['Une personne peut trouver les trois titres sans lire toute la page.', 'Tous les liens sont atteignables avec Tab et leur focus reste visible.', 'Le texte peut être agrandi sans être masqué par un conteneur fixe.', 'Les chemins des images fonctionnent après déplacement du projet dans un autre dossier.']),
      { type: 'exercice', titre: 'Définir votre première étape', contenu: 'Avant de coder, dessinez l’ordre des informations et écrivez les critères que vous vérifierez.', indice: 'Commencez par le document lisible sans CSS ; choisissez ensuite la disposition.' },
      texte('Faire relire le travail', 'Demandez une revue à partir des critères. Une case cochée atteste votre contrôle, pas une certification. Le parcours suivant ajoutera de vraies interactions à ce carnet.')],
    sources: [{ label: 'W3C : premières vérifications d’accessibilité', url: 'https://www.w3.org/WAI/test-evaluate/preliminary/' }]
  },
  {
    id: 'projet-recherche-resiliente', titre: 'Construire une recherche qui supporte les erreurs réseau', domaine: 'dom', format: 'projet', niveau: 'Junior', niveauPedagogique: 3, tempsEstime: 240,
    resume: 'Relier un formulaire à des données, puis vérifier chargement, absence de résultat et réponses hors ordre.',
    prerequis: ['dom-formulaires', 'js-fetch', 'javascript-abort-controller', 'js-map-filter-reduce'], assistance: 'reduite',
    competences: ['Gérer les états de chargement et d’échec.', 'Empêcher une ancienne réponse de remplacer une recherche récente.'],
    sections: [texte('Répondre au besoin', 'Le carnet compte maintenant plusieurs dizaines de lectures. Son API — une interface de requêtes et réponses — renvoie une liste d’objets contenant id, titre et auteur. Créez une recherche par titre. La connexion peut être lente et certaines réponses peuvent échouer.'),
      liste('Respecter le contrat', ['Préparer un petit serveur de test ou un fichier JSON ; documenter la forme exacte des données.', 'Afficher les états initial, chargement, résultats, liste vide et erreur récupérable.', 'Une recherche récente doit rester prioritaire sur une réponse ancienne.', 'L’utilisateur doit pouvoir réessayer et utiliser le formulaire au clavier.']),
      liste('Organiser vos preuves', ['Test : recherche sans résultat.', 'Test : réponse HTTP 500 puis nouvelle tentative réussie.', 'Test : taper deux recherches, retarder la première et vérifier que la seconde reste affichée.', 'Test : annulation d’une demande, données invalides et champ vide.']),
      { type: 'exercice', titre: 'Prévoir avant d’implémenter', contenu: 'Dessinez les états de votre recherche. Choisissez comment empêcher une réponse ancienne de remplacer les nouveaux résultats.', indice: 'Annuler une demande et vérifier un identifiant de recherche sont deux mécanismes possibles ; expliquez leurs rôles respectifs.' },
      texte('Livrer sans dépendre d’une démonstration', 'Fournissez les commandes de lancement, des données de test, les tests automatisés et un court mode de reproduction du réseau lent. Ne livrez pas seulement une capture de la situation qui fonctionne.')],
    sources: [{ label: 'MDN : utiliser fetch', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch' }, { label: 'MDN : AbortController', url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController' }]
  },
  {
    id: 'projet-api-emprunts', titre: 'Protéger une API d’emprunts et ses données', domaine: 'express', format: 'projet', niveau: 'Intermédiaire', niveauPedagogique: 4, tempsEstime: 480,
    resume: 'Concevoir des routes Express, une base relationnelle et des tests d’accès avec deux utilisateurs.',
    prerequis: ['express-donnees', 'express-erreurs', 'express-securite-base', 'http-cookies-sessions', 'php-pdo'], assistance: 'reduite',
    competences: ['Modéliser une relation et ses contraintes.', 'Tester les autorisations au serveur.', 'Documenter une migration de données.'],
    sections: [texte('Répondre au besoin', 'Une petite bibliothèque prête ses livres. Deux membres peuvent consulter le catalogue, mais chacun ne doit voir que ses propres emprunts. Un livre ne doit pas avoir deux emprunts actifs simultanés. Concevez le modèle relationnel, c’est-à-dire les tables et leurs liens, puis une API Node/Express.'),
      liste('Définir les règles avant les routes', ['Choisir les identifiants et les contraintes entre livres, membres et emprunts.', 'Empêcher deux emprunts concurrents du même livre avec une garantie de la base et une transaction, un groupe d’opérations validé ou annulé ensemble.', 'Distinguer identité vérifiée et droit sur une ressource ; s’appuyer sur un mécanisme d’authentification éprouvé.', 'Utiliser des requêtes paramétrées ; les entrées ne deviennent jamais du texte SQL exécutable.']),
      liste('Prouver les garanties', ['Avec deux sessions, vérifier que B ne lit ni ne modifie un emprunt de A.', 'Envoyer deux demandes simultanées sur le même livre : une seule doit réussir.', 'Tester les données invalides, la ressource inexistante et la base indisponible.', 'Tester l’évolution du schéma sur une base de test, puis expliquer le retour arrière et ses limites.']),
      texte('Livrer un projet reproductible', 'Fournissez le schéma, des données fictives, les migrations, les tests unitaires et d’intégration, ainsi qu’une commande d’installation reproductible. Un test d’intégration vérifie ici plusieurs composants ensemble, notamment l’API et une base de test.'),
      { type: 'exercice', titre: 'Rendre les décisions révisables', contenu: 'Proposez le schéma et les règles d’accès avant d’écrire le code. Justifiez où chaque règle est contrôlée.', indice: 'Une vérification avant écriture ne suffit pas à elle seule face à deux demandes simultanées : cherchez la garantie atomique de la base.' }],
    sources: [{ label: 'PostgreSQL : transactions', url: 'https://www.postgresql.org/docs/current/tutorial-transactions.html' }, { label: 'OWASP : contrôle des autorisations', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html' }, { label: 'Express : sécurité en production', url: 'https://expressjs.com/en/advanced/best-practice-security.html' }]
  },
  {
    id: 'mission-incident-production', titre: 'Diagnostiquer une panne après livraison', domaine: 'node', format: 'mission professionnelle', niveau: 'Professionnel', niveauPedagogique: 6, tempsEstime: 240,
    resume: 'Trier les observations, décider d’un retour arrière et proposer des preuves de rétablissement.',
    prerequis: ['node-process', 'http-status', 'express-erreurs', 'git-cycle', 'npm-ci-lockfile'], assistance: 'minimale',
    competences: ['Distinguer hypothèse et observation.', 'Évaluer le risque d’un retour arrière.', 'Définir journaux et mesures utiles sans secrets.'],
    sections: [texte('Traiter le ticket', 'Après la livraison 42, les recherches échouent pour une partie des utilisateurs. Le tableau de bord indique davantage de réponses 500. L’équipe vous donne un extrait de journal, mais pas la cause. Vous disposez d’un environnement de test et de l’ancienne version 41.'),
      { type: 'code', titre: 'Lire les observations disponibles', langage: 'Journal fictif', contenu: '10:01 release=42 service=api started\n10:03 request=R17 route=/search status=500 error=ECONNREFUSED dependency=catalogue\n10:03 request=R18 route=/health status=200\n10:04 release=42 requests=120 failures=18' },
      liste('Préparer votre réponse', ['Écrire les faits certains et les informations encore manquantes.', 'Proposer trois hypothèses classées avec le contrôle qui permet de les départager.', 'Définir le seuil et les conditions d’un retour à la version 41, notamment la compatibilité des données.', 'Proposer une correction, un test de régression et les observations attendues après remise en service.']),
      liste('Livrer un dossier de diagnostic', ['Chronologie sans interprétation cachée.', 'Plan de reproduction dans un environnement isolé.', 'Décision de correction ou de retour arrière avec risques explicités.', 'Plan de surveillance : taux d’erreurs, latence et identifiants de requêtes sans contenu sensible.', 'Mesure préventive dans la chaîne de tests et de livraison, puis demande de revue du correctif.']),
      texte('Évaluer la décision', 'Le journal ne suffit pas à prouver si le service catalogue est arrêté, mal adressé ou filtré. Une réponse professionnelle explicite cette incertitude et collecte une observation discriminante. Une route /health à 200 ne prouve pas que toutes les dépendances fonctionnent.'),
      texte('Approfondir après résolution', 'Comparez une image Docker reproductible, un test de disponibilité des dépendances et une livraison progressive. Définissez ce que chacun permet de détecter et ce qu’il ne garantit pas. La solution n’est pas fournie : elle dépend des observations que vous aurez vérifiées.')],
    sources: [{ label: 'Node.js : erreurs système', url: 'https://nodejs.org/api/errors.html#common-system-errors' }, { label: 'Git : annuler avec un nouveau commit', url: 'https://git-scm.com/docs/git-revert' }, { label: 'Docker : bonnes pratiques de construction', url: 'https://docs.docker.com/build/building/best-practices/' }]
  }
].map(p => ({ ...p, maturiteEditoriale: 'enriched', provenance: 'redaction-specifique' }));
