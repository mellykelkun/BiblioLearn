# Refonte Bibliolearn — contrat de réalisation

Audit initial du 7 octobre 2026, dépôt `3a6731e`. Ce document distingue les faits mesurés des objectifs. Les contrôles automatiques ne constituent pas une certification pédagogique.

## État constaté avant modification

- JavaScript vanilla, Express 4, aucun framework frontend ni chaîne de compilation nécessaire. `npm run check` passe.
- 176 leçons, 369 ateliers, 1 978 références, 21 domaines. `public/documentation.json` : **13 592 659 octets** non compressés ; `app.js` : 74 010 octets / 1 249 lignes ; CSS : 44 332 octets.
- `src/data/index.js` agrège les modules, valide les associations, puis fabrique trois paragraphes génériques pour les 117 références historiques sans article.
- `bibliotheque-plus.js` produit 1 782 notices à partir de listes et de profils. Ses articles répétitifs et ses syntaxes de substitution (`valeur`, imports fictifs) ne constituent pas une documentation fiable. `bibliotheque-nouveaux.js` produit 79 notices liées aux nouveaux parcours. Les conserver comme couverture, sans les présenter comme validées.
- `outils.js` ajoute aux leçons les guides de `pedagogie*.js` et cinq sessions. Les textes spécifiques existent ; la présence et la longueur des champs ne suffisent pas à prouver leur justesse.
- `ateliers-plus.js` compose 120 ateliers ; `construire-nouveaux-parcours.js` compose 60 leçons et 240 ateliers. Certaines consignes sont adaptées, d’autres sont répétitives. Conserver les identifiants et l’origine de génération.
- `app.js` mélange chargement, routes, rendus, recherche, stockage, événements, PWA et installation. La recherche normalise et sérialise les références à chaque saisie. Toutes les vues dépendent de `etat.documentation` complet.
- Le service worker v6 précache le catalogue entier. La progression `bibliolearn.lues` est une déclaration affichée comme maîtrise. Le nettoyage filtre les identifiants absents. Menu mobile sans gestion complète du focus ; navigation sans `aria-current`.
- Express sert `/api/documentation` avec repli local si Supabase échoue. L’export SQL historique réécrit sa migration et les données ; ne pas exécuter cet export destructif sur une base utilisée.
- Deux projets Vercel identifiés : `biblio-learn` (Express, adresse canonique du HTML) et `bibliolearn` (doublon). Conserver le premier. `.openai/hosting.json` pointe une inscription Sites sans version ni publication ; ne pas y publier.

## Architecture cible

Conserver Express et les modules CommonJS d’écriture des contenus. Publier déterministement des données statiques ; le navigateur utilise des modules ES par responsabilité : catalogue, recherche, progression/stockage, entraînement, accessibilité, vues pédagogiques et routeur. Conserver les rendus historiques utiles, les extraire progressivement sans réécriture technologique.

- `catalogue/meta.json` : version de schéma, empreinte de contenu, domaines, parcours, résumés des leçons.
- Fragments versionnés : une leçon ou un atelier par fichier ; index de recherche séparé ; références regroupées par famille. Un accès direct charge le fragment correspondant.
- Index calculé à la construction : titre, alias, contexte, tags et termes de code sélectionnés ; classement terme exact > alias > titre > contexte. Les notices en préparation restent trouvables avec leur statut.
- PWA : shell minimal, fragments consultés mis en cache, téléchargement intégral explicite, conservation des leçons hors ligne lors d’une mise à jour. Aucun catalogue complet précaché à l’installation.
- Supabase reste un export optionnel du même catalogue. Ajouter une migration versionnée et additive ; conserver les tables historiques et la possibilité de lecture locale.

## Modèle pédagogique

Chaque connaissance garde son `id`. Champs explicites : `type`, `niveau`, `niveauPedagogique` (0–7), `prerequis` (identifiants), `debloque` (inverse calculé), `associes`, `termesNouveaux` (terme/définition), `parcours`, `competences`, `difficulte`, `tempsEstime`, `maturiteEditoriale`, `provenance` et `sources`. Les prérequis manquants conseillent une lecture, sans la bloquer.

Maturité : `draft` = notice à rédiger, `structured` = contenu organisé non relu, `enriched` = explication spécifique et pratique, `reviewed` = revue éditoriale datée, `verified` = revue technique et pédagogique attestée. Aucun générateur ni test ne promeut automatiquement aux deux derniers états. Une référence générée conserve sa couverture et ses sources ; les exemples fictifs et paragraphes génériques ne sont pas exposés comme explication.

Une leçon de niveau zéro part d’une situation, pose un problème et définit ses nouveaux mots avant la syntaxe. Elle fournit une manipulation, un résultat, une erreur/diagnostic, un exercice/indice/correction, un transfert, ce qui compte maintenant, ce qui attend et des sources. La profondeur avancée reste repliable. Les leçons historiques sont marquées honnêtement et enrichies progressivement.

## Progression et migration

Schéma local version 2, sauvegardé séparément des anciennes clés. Ne jamais effacer les anciennes données. Importer `lues` comme **compris déclaré**, les visites comme **vu**, les ateliers comme anciens travaux déclarés ; conserver également les identifiants inconnus. Repli mémoire si le stockage est indisponible et avertissement visible.

États : vu → compris (déclaration) → pratiqué (réponse d’exercice conservée) → vérifié (évaluation réussie) → maîtrisé (évaluations et rappels espacés réussis à des dates distinctes). Une ouverture de correction ou une case cochée n’est jamais une preuve de maîtrise. Les résultats des questionnaires valident uniquement les questions proposées, pas une qualification professionnelle. Révision J+1/J+3/J+7/J+14/J+30, retour à J+1 après erreur.

## Séquence et risques

1. Audit/document de référence et tests de départ.
2. Modèle, graphe, maturité, découpage, migration et tests d’intégrité avant nouvel enrichissement.
3. Niveau zéro, profils, trois usages, recherche indexée, progression et rappel actif.
4. PWA, accessibilité clavier/focus/contraste, mobile et tests de régression.
5. Migration éditoriale, diagnostics d’erreurs, quelques projets intégrateurs et compétences observables ; aucun objectif artificiel de volume.
6. Vérification locale puis publication sur le projet Vercel existant, retrait du doublon sans toucher aux bases de données ni aux projets sans rapport.

Risques : incohérence des fragments entre versions (empreinte et validation), arrivée tardive d’une ancienne route (jeton de navigation), perte de progression (migration idempotente et clés intactes), fausse maîtrise (preuves distinctes et datées), erreur réseau/offline (écran réessayable), catalogue distant ancien (contrat versionné et repli local), suppression du mauvais projet (identifiants et domaine vérifiés avant action).

## Critères d’acceptation

- Identifiants historiques conservés ; liens/prérequis existants ; pas de cycle de prérequis ; progression ancienne lisible après migration répétée.
- Accueil sans `documentation.json`, `/api/documentation` ni tous les corps de leçons ; index chargé à la demande. Mesures réelles avant/après, jamais promises.
- Tests de recherche sur map/class/route/server/token/index/process, HTML et erreurs ; tests des fragments et de leur reproductibilité.
- Tests des étapes de progression, erreurs/reprises de quiz, dates de révision, corruption/quota de stockage ; aucun bouton « marquer maîtrisée ».
- Revue niveau zéro et développeur expérimenté ; diagnostics éditoriaux signalant répétitions, absence de sources, circularité, jargon, exercice/correction, faux contenu avancé.
- Navigation clavier, focus des changements de route et menu mobile, dialogues nommés, contrastes et contenu à 320/360/390/430/768/1440 px ; code horizontal lisible et mouvement réduit.
- Lecture d’une leçon visitée hors ligne et premier accès à une leçon non mise en cache traité explicitement.
- `npm run check`, contrôles dédiés et tests navigateur passent avant publication ; limites éditoriales documentées.
