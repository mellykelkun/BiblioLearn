# Validation de la refonte

La publication conserve le projet Vercel `biblio-learn` et son adresse historique. Les identifiants des contenus antérieurs sont conservés ; la progression locale est migrée vers des états distincts (vu, compris, pratiqué, vérifié, maîtrisé). Le catalogue initial est chargé par métadonnées, puis les fiches sont demandées à l'ouverture. Le téléchargement intégral hors ligne reste une action explicite.

## Vérifications effectuées

- `npm run check` : syntaxe, génération reproductible du catalogue, audit structurel des 22 domaines, contrôles pédagogiques et 21 tests Node réussis.
- `npm run test:browser` avec Chromium installé localement : 13 scénarios réussis, dont migration de progression, recherche, navigation rapide, amorces de fichiers des ateliers, reprise réseau et lecture hors ligne d'une fiche jamais ouverte après téléchargement intégral. Cinq répétitions complètes de la suite ont également réussi.
- Interfaces vérifiées à 320, 360, 390, 430, 768 et 1440 px ; audit Axe des vues principales sans violation détectée dans ces scénarios.
- `npm audit --omit=dev` : aucune vulnérabilité de dépendance de production signalée.
- Mesures locales : métadonnées initiales de 13 592 659 à 116 569 octets ; index de recherche chargé à la demande. Voir `mesures-performance.json` pour les données et limites de mesure.

## Couverture pédagogique

L'audit `audit-parcours.json` recense 209 leçons, 369 ateliers, 2 022 références et 426 exemples de code dans 22 domaines. Les ateliers montrent 856 fichiers de départ à recopier et identifient 125 chemins produits par un générateur ou une commande documentée. Chaque chemin annoncé par une arborescence dispose d'une amorce ou d'une instruction de génération. Une seule leçon, consacrée à la prise en main de l'ordinateur, n'a qu'un exemple de code : ses manipulations sont surtout visuelles. L'amorce laisse volontairement la variante à résoudre pendant l'exercice.

## Limites éditoriales explicites

Les anciennes références générées restent accessibles avec leur identifiant, mais affichent un état « brouillon » et une notice honnête quand une explication vérifiée manque. Il en reste 1 861 ; 44 nouvelles références rédigées, deux par domaine, s'y ajoutent. Aucun badge de relecture humaine n'est attribué automatiquement. L'audit `qualite-editoriale.json` constitue le registre de travail à traiter fiche par fiche ; il ne prouve pas à lui seul la qualité pédagogique. Il signale encore 369 ateliers sans source explicite individuelle : leurs leçons et références liées apportent le contexte, mais ces liens ne constituent pas une attribution propre à l'atelier. Le miroir Supabase est facultatif, vérifié par version et empreinte, et l'export SQL n'a pas été appliqué à une base distante.
