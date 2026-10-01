'use strict';

const { fiche, texte, code, liste, decomposition, alerte, comparaison, liens } = require('./outils');

module.exports = [
  fiche({
    id: 'typescript-configuration-stricte',
    domaine: 'typescript',
    categorie: 'Configuration',
    titre: 'Configurer TypeScript en mode strict',
    resume: 'Faire du compilateur un guide de conception avec strict, noUncheckedIndexedAccess et des frontières clairement typées.',
    tags: ['strict', 'tsconfig', 'noImplicitAny', 'TypeScript', 'qualité'],
    niveau: 'Intermédiaire',
    sections: [
      texte('Pourquoi activer strict ?', 'Le mode strict demande au code de dire ce qu’il sait et ce qu’il ne sait pas. Au début, il révèle des erreurs supplémentaires ; ensuite, il évite qu’une valeur absente ou implicite devienne une erreur difficile à comprendre en production.'),
      code('Une base raisonnable', 'JSON', '{\\n  "compilerOptions": {\\n    "strict": true,\\n    "noUncheckedIndexedAccess": true,\\n    "noEmit": true,\\n    "module": "NodeNext",\\n    "moduleResolution": "NodeNext"\\n  }\\n}'),
      decomposition('Lire les options', [
        { terme: 'strict', explication: 'active un groupe de contrôles qui rendent les paramètres et valeurs plus explicites.' },
        { terme: 'noUncheckedIndexedAccess', explication: 'rappelle qu’un tableau[index] peut ne rien contenir.' },
        { terme: 'noEmit', explication: 'utilise TypeScript comme vérificateur dans un projet dont un autre outil produit le JavaScript.' }
      ]),
      alerte('attention', 'Ne pas contourner partout', 'Un as any fait taire le compilateur mais déplace le problème. Si une donnée est réellement inconnue, utilisez unknown puis écrivez une vérification qui explique pourquoi elle est sûre.'),
      liens({ label: 'TypeScript — tsconfig strict', url: 'https://www.typescriptlang.org/tsconfig/strict.html' })
    ],
    associes: ['typescript-types', 'typescript-narrowing', 'npm-package-json']
  }),
  fiche({
    id: 'typescript-frontiere-api',
    domaine: 'typescript',
    categorie: 'Architecture frontend',
    titre: 'Valider une réponse API à la frontière',
    resume: 'Comprendre pourquoi un type TypeScript ne suffit pas et construire une vérification simple avant d’afficher les données.',
    tags: ['API', 'unknown', 'validation', 'JSON', 'TypeScript'],
    niveau: 'Intermédiaire',
    sections: [
      texte('Type annoncé et donnée réelle', 'TypeScript vérifie le code que vous écrivez, pas le serveur qui répond. Une réponse JSON peut manquer un champ, changer un type ou être une page d’erreur. La frontière doit donc commencer par unknown, puis devenir un type connu après validation.'),
      code('Un garde minimal', 'TypeScript', 'type Livre = { id: number; titre: string };\\n\\nfunction estLivre(valeur: unknown): valeur is Livre {\\n  if (typeof valeur !== "object" || valeur === null) return false;\\n  const objet = valeur as Record<string, unknown>;\\n  return typeof objet.id === "number" && typeof objet.titre === "string";\\n}'),
      comparaison('Choisir la profondeur', ['Situation', 'Décision', 'Coût'], [
        ['Prototype local', 'Vérification ciblée des champs utilisés', 'Rapide, mais moins protectrice.'],
        ['Produit métier', 'Schéma partagé ou bibliothèque de validation', 'Plus de code, mais erreurs explicites et contrats centralisés.'],
        ['Donnée sensible', 'Refuser par défaut et journaliser sans secret', 'La sécurité passe avant le confort d’affichage.']
      ]),
      alerte('erreur', 'Asserter n’est pas valider', 'Écrire valeur as Livre ne transforme pas la réponse. Une assertion décrit votre confiance ; un garde ou un parseur vérifie la donnée.'),
      liens({ label: 'TypeScript — Narrowing', url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html' })
    ],
    associes: ['typescript-narrowing', 'typescript-types-utilitaires', 'http-requete-reponse']
  }),
  fiche({
    id: 'react-architecture-etat',
    domaine: 'react',
    categorie: 'Architecture frontend',
    titre: 'Placer l’état React au bon niveau',
    resume: 'Décider si une donnée doit rester locale, remonter vers un parent ou vivre dans un store partagé.',
    tags: ['React', 'state', 'props', 'lifting state', 'architecture'],
    sections: [
      texte('La question de la source de vérité', 'Un état doit vivre assez près de l’endroit qui le modifie et assez haut pour être partagé par les composants qui en dépendent. Copier le même état dans deux composants crée des divergences et des synchronisations difficiles.'),
      code('Remonter un filtre', 'JSX', 'function Bibliotheque({ livres }) {\\n  const [recherche, setRecherche] = useState("");\\n  const visibles = livres.filter((livre) =>\\n    livre.titre.toLowerCase().includes(recherche.toLowerCase())\\n  );\\n  return <><Champ value={recherche} onChange={setRecherche} />\\n    <Liste livres={visibles} /></>;\\n}'),
      liste('Questions avant un store', [
        'Un seul écran utilise-t-il cette donnée ? Gardez-la locale.',
        'Deux frères doivent-ils la partager ? Remontez-la vers leur parent commun.',
        'Plusieurs zones éloignées la lisent-elles ? Évaluez un contexte ou un store.',
        'La donnée vient-elle du serveur ? Séparez cache serveur et état d’interface.'
      ]),
      alerte('bonne-pratique', 'Ne pas globaliser par réflexe', 'Un store global facilite le partage mais ajoute un contrat, des tests et une stratégie de mise à jour. Commencez local, puis élargissez quand le besoin est observé.'),
      liens({ label: 'React — Sharing state between components', url: 'https://react.dev/learn/sharing-state-between-components' })
    ],
    associes: ['react-composants', 'react-etat', 'react-effets']
  }),
  fiche({
    id: 'react-accessibilite-rendu',
    domaine: 'react',
    categorie: 'Qualité frontend',
    titre: 'Rendre un composant React accessible',
    resume: 'Conserver les éléments HTML natifs, gérer les labels et synchroniser les états visibles et annoncés.',
    tags: ['React', 'accessibilité', 'button', 'label', 'focus'],
    sections: [
      texte('React ne remplace pas HTML', 'JSX peut produire un bouton accessible ou un div difficile à utiliser. La première décision est donc de choisir le bon élément natif ; ensuite seulement, ajoutez l’état et la logique nécessaires.'),
      code('Champ contrôlé et label', 'JSX', 'function Recherche({ valeur, changer }) {\\n  return (\\n    <label>\\n      Rechercher\\n      <input\\n        type="search"\\n        value={valeur}\\n        onChange={(event) => changer(event.target.value)}\\n      />\\n    </label>\\n  );\\n}'),
      comparaison('Action ou navigation', ['Besoin', 'Élément', 'Raison'], [
        ['Déclencher un changement', 'button', 'Le clavier et les technologies d’assistance connaissent l’action.'],
        ['Changer de page', 'a avec href', 'Le lien peut être ouvert, copié et parcouru.'],
        ['Zone de saisie', 'label + input', 'Le nom du champ est explicite.']
      ]),
      alerte('attention', 'Focus après un changement d’écran', 'Après une navigation ou l’ouverture d’une erreur, le focus doit rester logique. Testez Tab et la lecture vocale, pas seulement un clic à la souris.'),
      liens({ label: 'React — Accessibility', url: 'https://react.dev/reference/react-dom/components/common' })
    ],
    associes: ['react-composants', 'html-focus-accessible', 'dom-evenements']
  }),
  fiche({
    id: 'next-cache-donnees',
    domaine: 'nextjs',
    categorie: 'Performance',
    titre: 'Choisir le cache et la revalidation dans Next.js',
    resume: 'Décider si une page peut être statique, revalidée ou dynamique selon la fraîcheur attendue.',
    tags: ['Next.js', 'cache', 'revalidate', 'fetch', 'ISR'],
    niveau: 'Intermédiaire',
    sections: [
      texte('Le cache est une décision produit', 'Une page de documentation peut rester identique plusieurs minutes. Un solde bancaire ne peut pas être servi avec la même tolérance. Choisir le cache revient à comparer fraîcheur, coût serveur et expérience attendue.'),
      code('Revalider périodiquement', 'JavaScript', 'const reponse = await fetch(url, { next: { revalidate: 300 } });\\nconst donnees = await reponse.json();\\n\\n// La page peut réutiliser la réponse pendant cinq minutes.'),
      comparaison('Trois stratégies', ['Besoin', 'Choix', 'Conséquence'], [
        ['Contenu rarement modifié', 'Statique ou revalidation longue', 'Rapide et peu coûteux.'],
        ['Catalogue modifié régulièrement', 'Revalidation courte ou invalidation ciblée', 'Bon équilibre fraîcheur/coût.'],
        ['Donnée personnalisée ou critique', 'Lecture dynamique sans cache public', 'Plus de coût, mais moins de risque de fuite ou de retard.']
      ]),
      alerte('erreur', 'Ne pas cacher une réponse personnalisée publiquement', 'Une réponse dépendant d’un utilisateur, d’un cookie ou d’une autorisation doit être traitée avec prudence. Vérifiez aussi les en-têtes et le comportement du CDN.'),
      liens({ label: 'Next.js — Caching', url: 'https://nextjs.org/docs/app/building-your-application/caching' })
    ],
    associes: ['next-rendu', 'http-cache-etag', 'http-headers-cors']
  }),
  fiche({
    id: 'next-etats-chargement-erreurs',
    domaine: 'nextjs',
    categorie: 'Expérience utilisateur',
    titre: 'loading, erreurs et pages absentes dans Next.js',
    resume: 'Construire les états d’interface qui expliquent ce qui se passe pendant le chargement ou après un échec.',
    tags: ['Next.js', 'loading', 'error', 'not-found', 'UX'],
    sections: [
      texte('Une page n’a pas qu’un état', 'Un utilisateur peut voir une page avant les données, pendant le chargement, après une erreur ou lorsque la ressource n’existe pas. Prévoir ces états rend l’interface plus honnête et évite un écran vide incompréhensible.'),
      code('Fichiers d’état', 'JavaScript', '// app/livres/loading.js\\nexport default function Loading() {\\n  return <p aria-live="polite">Chargement des livres…</p>;\\n}\\n\\n// app/livres/not-found.js\\nexport default function NotFound() {\\n  return <h1>Livre introuvable</h1>;\\n}'),
      liste('Un message utile', [
        'Dire ce qui est en train de se passer.',
        'Indiquer si l’utilisateur peut réessayer.',
        'Ne pas afficher la stack technique en production.',
        'Conserver un titre et un focus compréhensibles.'
      ]),
      alerte('bonne-pratique', 'Prévoir le réseau lent', 'Testez avec les ralentissements DevTools. Une interface qui semble correcte en Wi-Fi peut devenir inutilisable sur un téléphone ou une connexion instable.'),
      liens({ label: 'Next.js — Error Handling', url: 'https://nextjs.org/docs/app/building-your-application/routing/error-handling' })
    ],
    associes: ['next-rendu', 'next-routage', 'http-status']
  }),
  fiche({
    id: 'vue-composables-testables',
    domaine: 'vue',
    categorie: 'Architecture frontend',
    titre: 'Créer un composable Vue testable',
    resume: 'Extraire une logique réactive avec une petite API et distinguer état, action et nettoyage.',
    tags: ['Vue', 'composable', 'ref', 'watch', 'test'],
    niveau: 'Intermédiaire',
    sections: [
      texte('Un composable est une fonction', 'Un composable n’est pas un composant visuel. Il regroupe une règle réactive, expose un nombre limité de valeurs et peut souvent être testé sans monter toute une page.'),
      code('useRecherche', 'Vue', 'import { computed, ref } from "vue";\\n\\nexport function useRecherche(source) {\\n  const terme = ref("");\\n  const resultats = computed(() => source.value.filter((item) =>\\n    item.nom.toLowerCase().includes(terme.value.toLowerCase())\\n  ));\\n  return { terme, resultats };\\n}'),
      decomposition('Une API petite', [
        { terme: 'source', explication: 'la donnée réactive qui appartient au composant appelant.' },
        { terme: 'terme', explication: 'l’état local de la recherche.' },
        { terme: 'resultats', explication: 'une valeur dérivée, pas une deuxième copie de la liste.' }
      ]),
      alerte('attention', 'Ne pas cacher tout le composant', 'Si le composable manipule le DOM, le réseau et plusieurs règles métier à la fois, il devient difficile à comprendre. Un composable doit avoir une responsabilité racontable en une phrase.'),
      liens({ label: 'Vue — Composables', url: 'https://vuejs.org/guide/reusability/composables.html' })
    ],
    associes: ['vue-composants', 'vue-reactivite', 'js-fonctions']
  }),
  fiche({
    id: 'angular-formulaires-reactifs',
    domaine: 'angular',
    categorie: 'Formulaires',
    titre: 'Construire un formulaire réactif Angular',
    resume: 'Décrire les contrôles, validations et états d’un formulaire dans TypeScript plutôt que de les disperser dans le template.',
    tags: ['Angular', 'Reactive Forms', 'FormControl', 'validation', 'formulaire'],
    niveau: 'Intermédiaire',
    sections: [
      texte('Le formulaire est un état', 'Un formulaire possède des valeurs, des erreurs, des contrôles touchés ou non et parfois un état d’envoi. Reactive Forms donne une structure à ces informations et facilite les tests de règles.'),
      code('Formulaire simple', 'TypeScript', 'import { FormControl, FormGroup, Validators } from "@angular/forms";\\n\\nprofil = new FormGroup({\\n  nom: new FormControl("", { nonNullable: true, validators: [Validators.required] }),\\n  email: new FormControl("", { nonNullable: true, validators: [Validators.email] })\\n});\\n\\nvalider() {\\n  if (this.profil.invalid) return;\\n  console.log(this.profil.getRawValue());\\n}'),
      comparaison('Où valider ?', ['Règle', 'Lieu', 'Pourquoi'], [
        ['Format et obligatoire', 'Client et serveur', 'Confort immédiat puis sécurité réelle.'],
        ['Autorisation', 'Serveur', 'Le navigateur ne peut pas décider seul.'],
        ['Dépendance entre champs', 'Validator de groupe', 'La règle observe les valeurs ensemble.']
      ]),
      alerte('erreur', 'Ne jamais faire confiance au formulaire client', 'Un utilisateur peut appeler l’API sans passer par l’écran. Toute règle métier et toute autorisation doivent être répétées côté serveur.'),
      liens({ label: 'Angular — Reactive forms', url: 'https://angular.dev/guide/forms/reactive-forms' })
    ],
    associes: ['angular-composants', 'angular-services', 'http-requete-reponse']
  }),
  fiche({
    id: 'angular-services-tests',
    domaine: 'angular',
    categorie: 'Architecture frontend',
    titre: 'Services Angular et tests isolés',
    resume: 'Placer l’accès aux données dans un service injectable et remplacer ses dépendances pendant les tests.',
    tags: ['Angular', 'service', 'inject', 'test', 'dépendance'],
    niveau: 'Intermédiaire',
    sections: [
      texte('Pourquoi injecter ?', 'Un composant devrait orchestrer l’affichage, pas connaître tous les détails HTTP. Un service injectable centralise la règle et permet de fournir un faux service pendant un test ou dans un environnement différent.'),
      code('Service minimal', 'TypeScript', 'import { Injectable, inject } from "@angular/core";\\nimport { HttpClient } from "@angular/common/http";\\n\\n@Injectable({ providedIn: "root" })\\nexport class LivresService {\\n  private http = inject(HttpClient);\\n  lister() { return this.http.get("/api/livres"); }\\n}'),
      liste('Décider la frontière', [
        'Le composant déclenche l’action et présente le résultat.',
        'Le service connaît l’URL et la transformation des données.',
        'Le serveur reste responsable de l’autorisation et de la validation.',
        'Le test peut remplacer le service par des données déterministes.'
      ]),
      alerte('bonne-pratique', 'Une abstraction doit servir', 'Créer un service pour chaque ligne de code ne rend pas automatiquement l’architecture meilleure. Faites-le quand une responsabilité est partagée, testée ou susceptible de changer.'),
      liens({ label: 'Angular — Dependency injection', url: 'https://angular.dev/guide/di' })
    ],
    associes: ['angular-composants', 'angular-formulaires-reactifs', 'http-requete-reponse']
  }),
  fiche({
    id: 'frontend-bundler-build',
    domaine: 'css-outils',
    categorie: 'Écosystème frontend',
    titre: 'Comprendre bundler, build et dépendances frontend',
    resume: 'Relier les fichiers source, le serveur de développement, le build de production et les contraintes de déploiement.',
    tags: ['bundler', 'build', 'Vite', 'assets', 'déploiement'],
    sections: [
      texte('Deux moments différents', 'Le serveur de développement privilégie la vitesse de feedback et les messages détaillés. Le build de production regroupe ou transforme les fichiers, réduit les ressources et doit produire un dossier que l’hébergement sait servir.'),
      code('Scripts explicites', 'JSON', '{\\n  "scripts": {\\n    "dev": "vite",\\n    "build": "vite build",\\n    "preview": "vite preview"\\n  }\\n}'),
      comparaison('Choisir selon l’infrastructure', ['Infrastructure', 'Décision', 'Point de vigilance'], [
        ['Site statique/CDN', 'Build générant des fichiers autonomes', 'Configurer le fallback des routes SPA.'],
        ['Serveur Node', 'Build client séparé du serveur', 'Servir les assets et gérer les variables côté serveur.'],
        ['Monorepo', 'Workspace et pipeline par application', 'Ne pas reconstruire les packages inchangés inutilement.']
      ]),
      alerte('attention', 'Variable publique ou secrète', 'Une variable utilisée dans le bundle est visible par le navigateur. Les secrets restent dans une fonction serveur ou une plateforme sécurisée.'),
      liens({ label: 'Vite — Guide', url: 'https://vite.dev/guide/' })
    ],
    associes: ['css-outils-comparaison', 'npm-scripts', 'next-rendu']
  })
];

