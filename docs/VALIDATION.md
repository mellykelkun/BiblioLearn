# Validation de la refonte

La publication conserve le projet Vercel `biblio-learn` et son adresse historique. Les identifiants des contenus antérieurs sont conservés ; la progression locale est migrée vers des états distincts (vu, compris, pratiqué, vérifié, maîtrisé). Le catalogue initial est chargé par métadonnées, puis les fiches sont demandées à l'ouverture. Le téléchargement intégral hors ligne reste une action explicite.

## Vérifications effectuées

- `npm run check` : syntaxe, génération reproductible du catalogue, audit structurel des 22 domaines, contrôles pédagogiques et 23 tests Node réussis.
- `npm run test:browser` avec Chromium installé localement : 14 scénarios réussis, dont migration de progression, recherche, navigation rapide, affichage des guides de poste Windows/Linux/macOS, amorces de fichiers des ateliers, reprise réseau et lecture hors ligne d'une fiche jamais ouverte après téléchargement intégral.
- Interfaces vérifiées à 320, 360, 390, 430, 768 et 1440 px ; audit Axe des vues principales sans violation détectée dans ces scénarios.
- `npm audit --omit=dev` : aucune vulnérabilité de dépendance de production signalée.
- Mesures locales : métadonnées initiales de 13 592 659 à 116 569 octets ; index de recherche chargé à la demande. Voir `mesures-performance.json` pour les données et limites de mesure.

## Couverture pédagogique

L'audit `audit-parcours.json` recense 209 leçons, 369 ateliers, 2 022 références et 426 exemples de code dans 22 domaines. Les ateliers montrent 856 fichiers de départ à recopier et identifient 125 chemins produits par un générateur ou une commande documentée. Chaque chemin annoncé par une arborescence dispose d'une amorce ou d'une instruction de génération. Une seule leçon, consacrée à la prise en main de l'ordinateur, n'a qu'un exemple de code : ses manipulations sont surtout visuelles. L'amorce laisse volontairement la variante à résoudre pendant l'exercice.

La session « Préparer mon poste » couvre 13 outils, chacun sur Windows PowerShell, Linux et macOS. Les guides contiennent trois notions de base ou davantage, au moins trois commandes expliquées, un essai complet et trois diagnostics contextualisés. Les scripts d'essai Node.js et Python ont été exécutés ; le code C++ a été compilé et lancé sous Linux. Les installations Windows et macOS sont documentées à partir des sources officielles, sans exécution locale de ces systèmes.

Les accès de téléchargement sont placés avant les étapes d’installation et pointent vers les pages officielles propres à l’outil et au système, ou vers le guide de sa distribution Linux. Le lien direct `Composer-Setup.exe` a été vérifié auprès de getcomposer.org. Les pages à choix de version et d’architecture restent préférées à un binaire figé qui deviendrait obsolète. Le terminal fourni par Windows/macOS/Linux est signalé sans suggérer un téléchargement inutile.

## Limites éditoriales explicites

Les anciennes références générées restent accessibles avec leur identifiant, mais affichent un état « brouillon » et une notice honnête quand une explication vérifiée manque. Il en reste 1 861 ; 44 nouvelles références rédigées, deux par domaine, s'y ajoutent. Aucun badge de relecture humaine n'est attribué automatiquement. L'audit `qualite-editoriale.json` constitue le registre de travail à traiter fiche par fiche ; il ne prouve pas à lui seul la qualité pédagogique. Il signale encore 369 ateliers sans source explicite individuelle : leurs leçons et références liées apportent le contexte, mais ces liens ne constituent pas une attribution propre à l'atelier. Le miroir Supabase est facultatif, vérifié par version et empreinte, et l'export SQL n'a pas été appliqué à une base distante.
