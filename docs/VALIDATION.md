# Validation de la refonte

La publication conserve le projet Vercel `biblio-learn` et son adresse historique. Les identifiants des contenus antérieurs sont conservés ; la progression locale est migrée vers des états distincts (vu, compris, pratiqué, vérifié, maîtrisé). Le catalogue initial est chargé par métadonnées, puis les fiches sont demandées à l'ouverture. Le téléchargement intégral hors ligne reste une action explicite.

## Vérifications effectuées

- `npm run check` : syntaxe, génération reproductible du catalogue, contrôles pédagogiques et 14 tests Node réussis.
- `npm run test:browser` avec Chromium installé localement : 12 scénarios réussis, dont migration de progression, recherche, navigation rapide, reprise réseau et lecture hors ligne d'une fiche jamais ouverte après téléchargement intégral.
- Interfaces vérifiées à 320, 360, 390, 430, 768 et 1440 px ; audit Axe des vues principales sans violation détectée dans ces scénarios.
- `npm audit --omit=dev` : aucune vulnérabilité de dépendance de production signalée.
- Mesures locales : métadonnées initiales de 13 592 659 à 104 651 octets ; index de recherche chargé à la demande. Voir `mesures-performance.json` pour les données et limites de mesure.

## Limites éditoriales explicites

Les anciennes références générées restent accessibles avec leur identifiant, mais affichent un état « brouillon » et une notice honnête quand une explication vérifiée manque. Aucun badge de relecture humaine n'est attribué automatiquement. L'audit `qualite-editoriale.json` constitue le registre de travail à traiter fiche par fiche ; il ne prouve pas à lui seul la qualité pédagogique. Le miroir Supabase est facultatif, vérifié par version et empreinte, et l'export SQL n'a pas été appliqué à une base distante.
