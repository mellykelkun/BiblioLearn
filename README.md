# Bibliolearn

Apprendre le développement depuis les premiers repères, pratiquer et retrouver une référence. JavaScript vanilla en modules ES, contenus écrits dans `src/data` et `src/pedagogie`, Express pour la lecture locale et l’API optionnelle. La progression personnelle reste dans le navigateur.

## Démarrer et vérifier

Node.js 18 ou plus récent pour le serveur ; Node.js récent recommandé pour les outils de test.

```bash
npm ci
npm run build:catalogue
npm start
# http://localhost:3000
npm run check
npm run audit:editorial
npx playwright install chromium
npm run test:browser
```

Les tests navigateur démarrent un serveur sur 3100. Sur une machine disposant déjà de Chromium :

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:browser
```

`npm run dev` utilise Nodemon. `npm run measure` compare les octets de l’ancien catalogue et dix recherches locales avec l’index actuel ; ce n’est pas un benchmark réseau de production.

## Les trois usages

- **Apprendre** : niveau zéro, fondations, frontend, backend, full-stack et systèmes. Les profils proposent un départ sans questionnaire obligatoire. Les prérequis conseillent sans bloquer.
- **S’entraîner** : exercices des leçons, questionnaires de rappel, ateliers guidés, projets et mission de diagnostic. Les anciens ateliers terminés restent des déclarations, pas des évaluations.
- **Référence** : index préparé à la construction, contexte des résultats, définitions et syntaxe lorsqu’elles existent, sources et statut éditorial. Les erreurs ont une famille dédiée avec observation, diagnostic et correction.

La refonte conserve les 176 leçons, 369 ateliers et 1 978 références historiques. Le complément du 8 octobre 2026 ajoute deux leçons guidées de niveau zéro, une leçon propre à chacun des 21 autres domaines et deux références rédigées par domaine. Le catalogue compte maintenant 209 leçons, 369 ateliers et 2 022 références. La présence d’une entrée n’atteste pas de sa qualité.

« Préparer mon poste » couvre 13 outils sur Windows PowerShell, Linux et macOS. Chaque guide distingue installation, vérification, notions de base, commandes expliquées, essai reproductible et diagnostic d’erreurs. Un accès visible avant les étapes ouvre la page officielle de téléchargement ou le guide de la distribution choisie ; Composer propose aussi son installateur Windows direct. Le terminal déjà fourni par le système est signalé comme tel. Le site ne lance aucune commande sur le poste de l’apprenant.

## Architecture

| Chemin | Responsabilité |
| --- | --- |
| `src/data/` | Contenus historiques et agrégation |
| `src/data/environnements-approfondis.js` | Guides détaillés des 13 outils sur trois systèmes |
| `src/data/liens-installation.js` | Destinations officielles de téléchargement et d’installation par système |
| `src/pedagogie/` | Schéma, graphe, parcours, niveau zéro et contenus spécifiques |
| `scripts/construire-catalogue.js` | Génération déterministe des fragments et de l’index |
| `public/catalogue/meta.json` | Repères et résumés nécessaires à l’accueil |
| `public/catalogue/<empreinte>/` | Leçons/ateliers individuels, références par famille, index et manifeste hors ligne |
| `public/modules/catalogue.mjs` | Chargement à la demande, déduplication et reprise après échec |
| `public/modules/recherche.mjs` | Index normalisé et classement titre/alias/contexte/code |
| `public/modules/progression.mjs` | Migration locale, preuves et calendrier de rappel |
| `public/modules/entrainement.mjs` | Essais, questionnaires et explications des réponses |
| `public/modules/routeur.mjs` | Navigation asynchrone et protection contre les réponses tardives |
| `public/modules/vues-*.mjs`, `contenu.mjs` | Rendus par usage et contenus historiques conservés |
| `public/modules/accessibilite.mjs` | Focus de navigation, menu mobile et clavier |
| `public/modules/hors-ligne.mjs`, `public/sw.js` | Téléchargement explicite et cache des lectures |
| `public/app.js` | Assemblage, événements et fonctions d’installation/partage |
| `src/catalogue-distant.js` | Validation du miroir Supabase optionnel |

`public/documentation.json` et `/api/documentation` restent des exports de compatibilité. Le navigateur ne les charge plus. Une leçon ne demande que son fichier ; l’index est chargé quand on recherche ou explore la référence. Le catalogue complet hors ligne est un choix explicite.

## Modèle et rédaction

Conserver les identifiants. Chaque connaissance décrit `type`, `niveauPedagogique`, `prerequis`, `debloque`, `termesNouveaux`, `parcours`, `competences`, `difficulte`, `tempsEstime`, `sources`, `provenance` et `maturiteEditoriale`. Les clés complètes du graphe sont `type/id` : certains identifiants historiques se recoupent entre leçons et références. Les prérequis désignent des leçons ; `debloque` est calculé.

Une leçon part d’une situation et définit les mots nouveaux. Ses sections ne sont ajoutées que si leur contenu est utile. `profondeur > 0` replie un approfondissement. Une `evaluation` possède une version, des questions identifiées, des choix, un indice de réponse correcte et une explication. Ne pas confondre questionnaire et certification professionnelle.

Maturité : `draft` (notice à approfondir), `structured` (organisé, non relu), `enriched` (explication/pratique spécifique, non relue), `reviewed`, `verified`. Les deux derniers exigent une revue datée et attribuée ; aucun générateur ne les accorde. Les 1 861 notices produites par modèles conservent leurs termes, sources et associations, mais leurs faux articles et exemples de substitution ne sont plus publiés.

L’audit éditorial écrit `docs/qualite-editoriale.json`. Il signale les sources absentes, explications courtes, répétitions, exercices/corrections identiques, définitions circulaires, jargon à relire et niveaux avancés sans prérequis. Les alertes sont des pistes de revue, pas un score de qualité. Le corpus historique nécessite encore cette revue.

`npm run audit:parcours` écrit `docs/audit-parcours.json` : nombre d’exemples par module, références encore en brouillon et correspondance entre les chemins des ateliers et leurs fichiers de départ. Les 369 ateliers fournissent maintenant un contenu initial pour chaque fichier à copier ; les fichiers réellement produits par Spring Initializr, le SDK .NET ou Composer sont signalés avec leur préparation. Le kit lance un premier cas. La variante de transfert reste un exercice à résoudre, indiqué comme tel dans l’interface. Les exemples complémentaires des leçons historiques qui viennent d’un atelier sont identifiés comme fragments à intégrer à ce kit.

Après modification d’un contenu :

```bash
npm run build:catalogue
npm run audit:editorial
npm run audit:parcours
npm run check
```

Ne pas modifier directement les JSON générés.

## Progression et migration

`bibliolearn.progression.v2` conserve les preuves séparément des anciennes clés. Les visites deviennent « vu » ; les anciens éléments `bibliolearn.lues` deviennent « compris déclaré ». Les anciens ateliers, listes de révision et identifiants hors catalogue sont conservés. Une sauvegarde v2 illisible est copiée dans `bibliolearn.progression.v2.recuperation` avant reprise. Si le stockage est indisponible, un message indique le repli en mémoire.

- Compris : déclaration personnelle.
- Pratiqué : essai écrit enregistré, sans correction automatique de texte libre.
- Vérifié : questionnaire réussi après pratique, à une échéance admissible.
- Maîtrisé : au moins trois réussites espacées et quatre jours écoulés ; recommencer le même jour n’ajoute pas de preuve.

Rappels après 1, 3, 7, 14 puis 30 jours selon les réussites ; une erreur ramène à un rappel le lendemain et retire l’état de maîtrise. Les questionnaires sont locaux et ne constituent pas une évaluation surveillée. Les leçons sans questionnaire restent au plus « pratiqué ».

## Hors ligne et accessibilité

Le service worker conserve le shell et les repères, puis les contenus visités. Le bouton d’accueil télécharge les fragments avec progression et reprise possible. Les sources externes nécessitent toujours une connexion. Le navigateur peut évincer son cache ; aucune garantie de conservation permanente n’est annoncée. Lors d’une mise à jour, le cache des lectures est préservé et une ancienne leçon peut servir de secours.

Les tests couvrent 320, 360, 390, 430, 768 et 1440 px, le focus après navigation, le menu mobile, la lecture hors ligne et les règles Axe WCAG 2.2 AA disponibles. Ce contrôle automatisé ne constitue pas un audit WCAG exhaustif. Le code conserve une taille lisible et peut défiler horizontalement.

## Supabase optionnel

Le frontend statique reste la source publiée. L’API Express peut lire un miroir exact du même catalogue, ou revenir aux données locales si la configuration manque, si le réseau échoue ou si l’empreinte diffère.

```bash
npm run generate:migration
```

Cette commande écrit maintenant **un export de données** dans `supabase/exports/catalogue-v5.sql`. Elle ne réécrit plus la migration historique et ne supprime aucune table. L’export utilise la table `bibliolearn_catalogue_meta` existante avec une clé versionnée et un `ON CONFLICT` limité à cette clé. Relire puis appliquer explicitement cet export sur votre base si vous utilisez ce miroir. Aucune base distante n’est modifiée par la construction ou la publication du site.

Les politiques de lecture et permissions de la table doivent déjà autoriser le catalogue public. Ne pas mettre de progression personnelle dans cette table publique. Le serveur utilise uniquement `SUPABASE_URL` et une clé publique `SUPABASE_ANON_KEY`, jamais une clé de service côté navigateur.

## Déploiement

Le projet de production conservé est **biblio-learn**, adresse **https://biblio-learn.vercel.app**. Ne pas créer de nouveau projet. Le dépôt GitHub relié est `mellykelkun/BiblioLearn`, branche `main`. Une publication correspond à une nouvelle version du projet existant, pas à un second environnement.

L’ancien manifeste Sites correspondait à une inscription jamais publiée ; il est retiré pour éviter une publication au mauvais endroit. Le doublon Vercel `bibliolearn` a été supprimé manuellement ; la liste des projets de l’équipe ne conserve que `biblio-learn` pour ce dépôt.

L’audit initial, les risques et les critères de validation sont dans [docs/REFONTE.md](docs/REFONTE.md). L’audit détaillé du parcours est dans [docs/audit-parcours.json](docs/audit-parcours.json) ; les mesures reproductibles dans [docs/mesures-performance.json](docs/mesures-performance.json).
