# Couverture pédagogique : état et critères

Le bilan chiffré reproductible est dans `docs/audit-parcours.json` (`npm run audit:parcours`). Il distingue les leçons, les ateliers, les exemples de code, les références rédigées et les notices qui n’ont encore qu’un lien vers une source. Une notice ne compte jamais comme une explication terminée.

Au 8 octobre 2026, le catalogue couvre 23 domaines et 27 parcours. Il contient 239 leçons, 372 ateliers, 486 exemples de code et 2 052 références indexées, dont 191 rédigées et 1 861 encore en brouillon. Les 239 leçons appartiennent désormais à au moins un parcours. Ces chiffres restent loin de l’objectif de 10 000 à 20 000 notions expliquées et de centaines de leçons par module.

## Ordre de rédaction

1. Transformer les notices existantes en références vérifiées par domaine : HTML, CSS, JavaScript, Node, HTTP et SQL concentrent actuellement les 1 861 brouillons. Chaque référence demande une définition propre, un exemple exact, le résultat attendu, une limite, un exercice et une source précise.
2. Étendre les domaines courts : Vue, Angular, Next.js, outils CSS, DOM, HTTP et Express ont encore moins de dix leçons ou presque. Les nouveaux chapitres doivent couvrir la mise en route, les données, les erreurs, les tests et les cas de livraison.
3. Ajouter des cursus backend et données réellement complets pour Python et C# et approfondir PHP, Spring Boot, C++ et SQL. Les parcours full-stack doivent relier une saisie, la validation serveur, le stockage, le retour HTTP et un test de bout en bout.
4. Ouvrir ensuite les familles absentes (tests, sécurité, bases de données serveur, déploiement, observabilité) avec leurs propres guides d’installation et de diagnostic sur Windows, Linux et macOS.

## Définition de « rédigé »

Une leçon pratique fournit un fichier ou un contexte de projet exact, une commande adaptée au système, au moins deux exemples commentés lorsque le sujet le permet, une sortie observable, une panne à provoquer, un exercice différent du premier exemple et un corrigé. Une leçon conceptuelle de niveau zéro peut remplacer le code par une action à réaliser et observer. Une référence ne passe à l’état enrichi que si son exemple et sa limite sont propres à la notion ; un nom repris d’une liste ou une phrase générique reste en brouillon. Les tests exécutent les exemples lorsque l’environnement le permet et vérifient les chemins des fichiers annoncés.

Les niveaux sont des capacités observables, pas des certifications. Le passage à l’étape suivante se décide sur la preuve indiquée dans le parcours, puis sur un cas nouveau sans lecture guidée. L’audit doit rester visible pendant toute augmentation du volume : une hausse du nombre total qui augmente surtout les brouillons ne constitue pas une amélioration pédagogique.
