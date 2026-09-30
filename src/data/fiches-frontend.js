'use strict';

const { fiche, texte, code, liste, decomposition, alerte, comparaison, liens } = require('./outils');

module.exports = [
  fiche({
    id: 'frontend-choisir', domaine: 'react', categorie: 'Repères', titre: 'Bibliothèque ou framework frontend ?',
    resume: 'Comprendre ce que React, Next.js, Vue et Angular prennent en charge — et ce qu’ils ne remplacent pas.',
    tags: ['framework', 'library', 'spa', 'react', 'next', 'vue', 'angular'],
    sections: [
      texte('Pourquoi ces outils existent', 'Quand une interface comporte beaucoup d’état, d’écrans et de composants interactifs, synchroniser manuellement le DOM devient coûteux. Les bibliothèques et frameworks proposent un modèle déclaratif, des composants et un écosystème pour structurer cette complexité.'),
      comparaison('Positionnement', ['Outil', 'Nature', 'Parti pris'], [
        ['React', 'Bibliothèque d’interface', 'Composition et écosystème à choisir'],
        ['Next.js', 'Framework React full-stack', 'Routage, rendu, serveur et conventions'],
        ['Vue', 'Framework progressif', 'Template accessible et adoption graduelle'],
        ['Angular', 'Framework applicatif', 'Structure intégrée, TypeScript, injection et outils'],
        ['JavaScript vanilla', 'Plateforme native', 'Contrôle direct, zéro abstraction ajoutée']
      ]),
      texte('Conséquence pratique', 'Un framework accélère certains projets mais ajoute compilation, conventions, dépendances et mises à jour. Un site de contenu simple peut rester meilleur en HTML/CSS/JavaScript ; une application riche et collaborative bénéficie souvent d’un cadre de composants.'),
      alerte('retenir', 'Fondamentaux durables', 'Tous ces outils reposent sur HTML, CSS, JavaScript, DOM, HTTP et accessibilité. Les comprendre transforme les erreurs “du framework” en problèmes explicables.'),
      liens({ label: 'MDN — Frameworks côté client', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Frameworks_libraries' })
    ], associes: ['react-composants', 'next-rendu', 'vue-composants', 'angular-composants']
  }),
  fiche({
    id: 'react-composants', domaine: 'react', categorie: 'Fondamentaux', titre: 'Composants, JSX et props',
    resume: 'Décrire une portion d’interface comme une fonction pure paramétrée par des props.',
    tags: ['react', 'component', 'jsx', 'props', 'children'],
    sections: [
      code('Composant', 'JavaScript', 'function CarteLivre({ titre, auteur, children }) {\n  return (\n    <article className="carte-livre">\n      <h2>{titre}</h2>\n      <p>par {auteur}</p>\n      {children}\n    </article>\n  );\n}\n\n<CarteLivre titre="Le Web" auteur="Ada">\n  <button>Ajouter</button>\n</CarteLivre>'),
      decomposition('Décomposition', [
        { terme: 'CarteLivre', explication: 'fonction composant, nommée avec une majuscule.' },
        { terme: '{ titre, auteur }', explication: 'destructuration de l’objet props reçu en argument.' },
        { terme: 'JSX', explication: 'syntaxe transformée en appels JavaScript décrivant l’interface.' },
        { terme: '{titre}', explication: 'insertion d’une expression JavaScript dans le JSX.' },
        { terme: 'children', explication: 'contenu imbriqué fourni entre les balises du composant.' }
      ]),
      alerte('erreur', 'HTML ≠ JSX', 'En JSX, utiliser className au lieu de class et fermer les éléments comme <img />. Un composant doit retourner un seul arbre racine, éventuellement un fragment <>…</>.'),
      alerte('bonne-pratique', 'Pureté', 'À props et état identiques, le rendu devrait décrire le même résultat. Ne pas modifier une prop ni déclencher un effet réseau pendant le rendu.'),
      liens({ label: 'React — Your first component', url: 'https://react.dev/learn/your-first-component' }, { label: 'React — Passing props', url: 'https://react.dev/learn/passing-props-to-a-component' })
    ], associes: ['react-etat', 'react-effets', 'frontend-choisir']
  }),
  fiche({
    id: 'react-etat', domaine: 'react', categorie: 'État', titre: 'useState() et mise à jour',
    resume: 'Mémoriser une donnée entre les rendus et demander à React de recalculer l’interface.',
    tags: ['react', 'useState', 'state', 'setter', 'render'],
    sections: [
      code('Compteur', 'JavaScript', 'import { useState } from "react";\n\nfunction Compteur() {\n  const [compteur, setCompteur] = useState(0);\n\n  function incrementer() {\n    setCompteur((valeurActuelle) => valeurActuelle + 1);\n  }\n\n  return <button onClick={incrementer}>{compteur}</button>;\n}'),
      decomposition('Contrat', [
        { terme: 'useState(0)', explication: 'crée un emplacement d’état initialisé à 0 au premier rendu.' },
        { terme: 'compteur', explication: 'instantané de la valeur pour le rendu courant.' },
        { terme: 'setCompteur', explication: 'planifie une mise à jour et un nouveau rendu.' },
        { terme: 'mise à jour fonctionnelle', explication: 'calcule depuis la valeur précédente ; sûre pour plusieurs mises à jour groupées.' }
      ]),
      alerte('erreur', 'Mutation directe', 'compteur += 1 ou objet.nom = "…" ne signale pas correctement un nouvel état à React. Utiliser le setter et créer une nouvelle valeur : setObjet({ ...objet, nom: "…" }).'),
      liens({ label: 'React — State, a component’s memory', url: 'https://react.dev/learn/state-a-components-memory' })
    ], associes: ['react-composants', 'react-effets', 'js-objets']
  }),
  fiche({
    id: 'react-effets', domaine: 'react', categorie: 'Effets', titre: 'useEffect() sans boucle infinie',
    resume: 'Synchroniser un composant avec un système externe, et nettoyer l’abonnement au bon moment.',
    tags: ['react', 'useEffect', 'dependencies', 'cleanup', 'fetch'], niveau: 'Intermédiaire',
    sections: [
      code('Abonnement avec nettoyage', 'JavaScript', 'import { useEffect } from "react";\n\nfunction Statut({ canal }) {\n  useEffect(() => {\n    const connexion = connecter(canal);\n    connexion.ouvrir();\n\n    return () => connexion.fermer();\n  }, [canal]);\n\n  return <p>Canal : {canal}</p>;\n}'),
      texte('Quand l’utiliser', 'Un effet synchronise React avec un système externe : réseau, API navigateur, widget tiers ou abonnement. Calculer une valeur dérivée des props ou gérer un clic ne nécessite généralement pas d’effet.'),
      decomposition('Cycle', [
        { terme: 'fonction d’effet', explication: 's’exécute après que le rendu est appliqué.' },
        { terme: '[canal]', explication: 'liste des valeurs réactives utilisées ; un changement relance la synchronisation.' },
        { terme: 'return () => …', explication: 'nettoyage avant la prochaine synchronisation et au démontage.' }
      ]),
      alerte('erreur', 'Boucle infinie', 'Un effet qui met à jour un état présent dans ses dépendances peut se relancer à chaque rendu. Repenser la source de vérité au lieu de supprimer arbitrairement la dépendance.'),
      liens({ label: 'React — Synchronizing with effects', url: 'https://react.dev/learn/synchronizing-with-effects' })
    ], associes: ['react-etat', 'js-fetch', 'dom-evenements']
  }),
  fiche({
    id: 'next-rendu', domaine: 'nextjs', categorie: 'App Router', titre: 'Server et Client Components',
    resume: 'Choisir où un composant Next.js s’exécute et comprendre la frontière marquée par use client.',
    tags: ['nextjs', 'app router', 'server component', 'client component', 'use client'],
    sections: [
      texte('Modèle', 'Dans l’App Router, les composants sont serveur par défaut. Ils peuvent charger des données près de la source et n’envoient pas leur logique au navigateur. Une frontière "use client" est nécessaire pour l’état, les effets, les gestionnaires d’événements et certaines API navigateur.'),
      code('Composant serveur', 'JavaScript', '// app/livres/page.js\nexport default async function PageLivres() {\n  const livres = await obtenirLivres();\n  return <ListeLivres livres={livres} />;\n}'),
      code('Composant client', 'JavaScript', '"use client";\n\nimport { useState } from "react";\n\nexport function Filtre() {\n  const [texte, setTexte] = useState("");\n  return <input value={texte} onChange={(e) => setTexte(e.target.value)} />;\n}'),
      alerte('attention', 'Frontière de sérialisation', 'Les props passées d’un composant serveur à un composant client doivent être sérialisables. Ne pas placer "use client" partout : cela élargit le JavaScript envoyé et perd les bénéfices du serveur.'),
      liens({ label: 'Next.js — Server and Client Components', url: 'https://nextjs.org/docs/app/getting-started/server-and-client-components' })
    ], associes: ['next-routage', 'react-composants', 'react-etat']
  }),
  fiche({
    id: 'next-routage', domaine: 'nextjs', categorie: 'App Router', titre: 'Routage par fichiers dans Next.js',
    resume: 'Associer dossiers, page.js, layout.js et segments dynamiques aux URL de l’application.',
    tags: ['nextjs', 'routing', 'page', 'layout', 'dynamic segment', 'link'],
    sections: [
      code('Arborescence', 'Bash', 'app/\n├── layout.js            # enveloppe commune\n├── page.js              # /\n└── livres/\n    ├── page.js          # /livres\n    └── [id]/\n        └── page.js      # /livres/:id'),
      texte('Fonctionnement', 'Un dossier définit un segment, mais une route devient publiquement accessible lorsqu’un page.js existe. layout.js conserve une interface partagée entre navigations. Un segment [id] reçoit une valeur dynamique via params.'),
      alerte('bonne-pratique', 'Navigation interne', 'Utiliser le composant Link pour naviguer dans l’application. Il permet à Next.js de précharger et d’effectuer une transition côté client sans recharger tout le document.'),
      liens({ label: 'Next.js — Layouts and pages', url: 'https://nextjs.org/docs/app/getting-started/layouts-and-pages' })
    ], associes: ['next-rendu', 'http-requete-reponse', 'react-composants']
  }),
  fiche({
    id: 'vue-composants', domaine: 'vue', categorie: 'Fondamentaux', titre: 'Composant Vue et Composition API',
    resume: 'Relier template, état réactif et événements dans un Single-File Component lisible.',
    tags: ['vue', 'component', 'composition api', 'script setup', 'ref', 'template'],
    sections: [
      code('Counter.vue', 'Vue', '<script setup>\nimport { ref } from "vue";\n\nconst compteur = ref(0);\nfunction incrementer() {\n  compteur.value += 1;\n}\n</script>\n\n<template>\n  <button @click="incrementer">\n    Compteur : {{ compteur }}\n  </button>\n</template>'),
      decomposition('Décomposition', [
        { terme: '<script setup>', explication: 'syntaxe de compilation concise pour la Composition API.' },
        { terme: 'ref(0)', explication: 'crée une référence réactive.' },
        { terme: '.value', explication: 'accède à la valeur dans le JavaScript ; le template la déballe automatiquement.' },
        { terme: '@click', explication: 'raccourci de v-on:click.' },
        { terme: '{{ compteur }}', explication: 'interpolation de texte échappée dans le template.' }
      ]),
      alerte('erreur', 'Réactivité', 'Remplacer ou déstructurer maladroitement un objet réactif peut perdre le lien réactif. Comprendre la différence entre ref() et reactive() avant d’extraire ses propriétés.'),
      liens({ label: 'Vue — Composition API setup', url: 'https://vuejs.org/api/composition-api-setup.html' })
    ], associes: ['vue-reactivite', 'frontend-choisir', 'js-modules']
  }),
  fiche({
    id: 'vue-reactivite', domaine: 'vue', categorie: 'Réactivité', titre: 'computed() ou watch()',
    resume: 'Dériver une valeur avec computed et réserver watch aux effets liés à un changement.',
    tags: ['vue', 'computed', 'watch', 'reactivity', 'ref'], niveau: 'Intermédiaire',
    sections: [
      code('Valeur dérivée', 'Vue', '<script setup>\nimport { computed, ref } from "vue";\n\nconst prix = ref(100);\nconst taux = ref(0.2);\nconst prixTTC = computed(() => prix.value * (1 + taux.value));\n</script>'),
      comparaison('Choix', ['API', 'À utiliser pour', 'Retour'], [
        ['computed()', 'Valeur dérivée mise en cache', 'Ref calculée'],
        ['watch()', 'Effet lors d’un changement précis', 'Fonction d’arrêt'],
        ['watchEffect()', 'Effet avec dépendances découvertes automatiquement', 'Fonction d’arrêt']
      ]),
      alerte('bonne-pratique', 'Éviter l’état dupliqué', 'Si une valeur peut être calculée depuis un autre état, computed() évite de synchroniser deux sources de vérité avec watch().'),
      liens({ label: 'Vue — Computed properties', url: 'https://vuejs.org/guide/essentials/computed.html' })
    ], associes: ['vue-composants', 'react-etat', 'react-effets']
  }),
  fiche({
    id: 'angular-composants', domaine: 'angular', categorie: 'Fondamentaux', titre: 'Composant Angular',
    resume: 'Assembler classe TypeScript, template et métadonnées dans un composant autonome.',
    tags: ['angular', 'component', 'standalone', 'template', 'decorator', 'typescript'],
    sections: [
      code('Composant autonome', 'TypeScript', 'import { Component } from "@angular/core";\n\n@Component({\n  selector: "app-compteur",\n  standalone: true,\n  template: `\n    <button (click)="incrementer()">{{ compteur }}</button>\n  `\n})\nexport class CompteurComponent {\n  compteur = 0;\n\n  incrementer() {\n    this.compteur += 1;\n  }\n}'),
      decomposition('Décomposition', [
        { terme: '@Component', explication: 'décorateur qui fournit les métadonnées Angular.' },
        { terme: 'selector', explication: 'nom de l’élément personnalisé utilisé dans un template parent.' },
        { terme: 'standalone: true', explication: 'composant importable directement sans NgModule de déclaration.' },
        { terme: '(click)', explication: 'liaison d’événement du template vers la classe.' },
        { terme: '{{ compteur }}', explication: 'interpolation de la propriété.' }
      ]),
      liens({ label: 'Angular — Components', url: 'https://angular.dev/guide/components' })
    ], associes: ['angular-services', 'typescript-types', 'frontend-choisir']
  }),
  fiche({
    id: 'angular-services', domaine: 'angular', categorie: 'Architecture', titre: 'Services et injection de dépendances Angular',
    resume: 'Partager une responsabilité sans la recréer dans chaque composant.',
    tags: ['angular', 'service', 'dependency injection', 'inject', 'injectable'], niveau: 'Intermédiaire',
    sections: [
      code('Service injectable', 'TypeScript', 'import { Injectable, inject } from "@angular/core";\nimport { HttpClient } from "@angular/common/http";\n\n@Injectable({ providedIn: "root" })\nexport class LivresService {\n  private http = inject(HttpClient);\n\n  obtenirTous() {\n    return this.http.get<Livre[]>("/api/livres");\n  }\n}'),
      texte('Pourquoi', 'L’injection de dépendances sépare la construction d’un objet de son utilisation. Un composant demande un service ; Angular choisit l’instance selon la hiérarchie de fournisseurs, ce qui facilite le partage et les tests.'),
      alerte('attention', 'Responsabilités', 'Un service n’est pas un tiroir global. Lui donner une responsabilité claire : accès aux livres, session, journalisation ou calcul métier.'),
      liens({ label: 'Angular — Dependency injection', url: 'https://angular.dev/guide/di' })
    ], associes: ['angular-composants', 'typescript-generiques', 'js-fetch']
  }),
  fiche({
    id: 'typescript-types', domaine: 'typescript', categorie: 'Fondamentaux', titre: 'Types, interface et inférence',
    resume: 'Décrire un contrat vérifié avant l’exécution sans imaginer que les types existent dans le navigateur.',
    tags: ['typescript', 'type', 'interface', 'inference', 'annotation'],
    sections: [
      code('Contrat de données', 'TypeScript', 'interface Utilisateur {\n  id: number;\n  nom: string;\n  email?: string;\n}\n\nfunction saluer(utilisateur: Utilisateur): string {\n  return `Bonjour ${utilisateur.nom}`;\n}\n\nconst ada = { id: 1, nom: "Ada" }; // types inférés\nsaluer(ada);'),
      texte('Fonctionnement réel', 'TypeScript analyse le code puis émet du JavaScript. Les annotations sont supprimées : elles ne valident donc pas une réponse réseau à l’exécution. Une donnée externe exige toujours une validation runtime.'),
      comparaison('type ou interface ?', ['Besoin', 'interface', 'type'], [
        ['Forme d’objet', 'Oui', 'Oui'],
        ['Extension', 'extends', 'intersection &'],
        ['Union', 'Non directement', 'Oui'],
        ['Fusion de déclarations', 'Oui', 'Non'],
        ['Conseil', 'Cohérence du projet', 'Cohérence du projet']
      ]),
      alerte('erreur', 'any masque le problème', 'any désactive la vérification et se propage. Préférer unknown pour une valeur non connue, puis réduire son type avec des contrôles.'),
      liens({ label: 'TypeScript Handbook — Everyday types', url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html' })
    ], associes: ['typescript-narrowing', 'typescript-generiques', 'js-types']
  }),
  fiche({
    id: 'typescript-narrowing', domaine: 'typescript', categorie: 'Types', titre: 'Union et narrowing',
    resume: 'Représenter plusieurs formes possibles et prouver le cas courant avant de l’utiliser.',
    tags: ['typescript', 'union', 'narrowing', 'discriminated union', 'unknown'],
    sections: [
      code('Union discriminée', 'TypeScript', 'type Resultat<T> =\n  | { statut: "succes"; donnees: T }\n  | { statut: "erreur"; message: string };\n\nfunction afficher(resultat: Resultat<string[]>) {\n  if (resultat.statut === "succes") {\n    console.log(resultat.donnees);\n  } else {\n    console.error(resultat.message);\n  }\n}'),
      texte('Pourquoi cela fonctionne', 'Le test sur statut réduit l’union à une seule variante dans chaque branche. TypeScript sait alors quelles propriétés existent, et signale un oubli lorsqu’une nouvelle variante est ajoutée avec un contrôle exhaustif.'),
      alerte('bonne-pratique', 'Modéliser les états impossibles', 'Une union discriminée évite des objets avec loading, data et error incohérents en même temps. Chaque variante décrit un état valide complet.'),
      liens({ label: 'TypeScript Handbook — Narrowing', url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html' })
    ], associes: ['typescript-types', 'typescript-generiques', 'js-conditions']
  }),
  fiche({
    id: 'typescript-generiques', domaine: 'typescript', categorie: 'Types', titre: 'Génériques TypeScript',
    resume: 'Conserver la relation entre types d’entrée et de sortie sans tomber dans any.',
    tags: ['typescript', 'generic', 'type parameter', 'constraint', 'keyof'], niveau: 'Intermédiaire',
    sections: [
      code('Fonction générique', 'TypeScript', 'function premier<T>(elements: T[]): T | undefined {\n  return elements[0];\n}\n\nconst nombre = premier([10, 20]);  // number | undefined\nconst mot = premier(["a", "b"]); // string | undefined'),
      decomposition('Décomposition', [
        { terme: '<T>', explication: 'paramètre de type choisi ou inféré à chaque appel.' },
        { terme: 'T[]', explication: 'tableau dont chaque élément possède ce type.' },
        { terme: 'T | undefined', explication: 'retour lié à l’entrée ; undefined si le tableau est vide.' }
      ]),
      alerte('attention', 'Pas un décor', 'Un générique est utile quand il relie plusieurs positions. Une fonction qui reçoit T mais retourne toujours string n’a pas forcément besoin d’être générique.'),
      liens({ label: 'TypeScript Handbook — Generics', url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html' })
    ], associes: ['typescript-types', 'typescript-narrowing', 'angular-services']
  }),
  fiche({
    id: 'css-outils-comparaison', domaine: 'css-outils', categorie: 'Choix', titre: 'CSS natif, Tailwind CSS ou Bootstrap',
    resume: 'Comparer trois niveaux d’abstraction et leurs effets sur personnalisation, HTML et maintenance.',
    tags: ['css', 'tailwind', 'bootstrap', 'utility', 'component library'],
    sections: [
      comparaison('Conséquences pratiques', ['Approche', 'Apporte', 'Coût principal'], [
        ['CSS natif', 'Plateforme, contrôle complet', 'Conventions à construire'],
        ['Tailwind CSS', 'Classes utilitaires et système de tokens', 'HTML chargé, étape de build'],
        ['Bootstrap', 'Grille et composants prêts', 'Personnalisation et signature visuelle'],
        ['CSS Modules', 'Portée locale des classes', 'Lié à une chaîne de build']
      ]),
      code('Même bouton — CSS natif', 'HTML', '<button class="bouton-primaire">Enregistrer</button>'),
      code('Style natif', 'CSS', '.bouton-primaire {\n  border: 0;\n  border-radius: 0.5rem;\n  background: #0f766e;\n  color: white;\n  padding: 0.65rem 1rem;\n}'),
      code('Même bouton — Tailwind', 'HTML', '<button class="rounded-lg bg-teal-700 px-4 py-2.5 text-white">\n  Enregistrer\n</button>'),
      code('Même bouton — Bootstrap', 'HTML', '<button class="btn btn-primary">Enregistrer</button>'),
      alerte('retenir', 'Le socle ne change pas', 'Ces outils n’annulent ni cascade, ni box model, ni responsive, ni accessibilité. Maîtriser CSS permet de les utiliser sans lutter contre eux.'),
      liens({ label: 'Tailwind CSS — Documentation', url: 'https://tailwindcss.com/docs' }, { label: 'Bootstrap — Documentation', url: 'https://getbootstrap.com/docs/' })
    ], associes: ['tailwind-utilitaires', 'bootstrap-composants', 'css-selecteurs']
  }),
  fiche({
    id: 'tailwind-utilitaires', domaine: 'css-outils', categorie: 'Tailwind CSS', titre: 'Classes utilitaires Tailwind',
    resume: 'Composer une interface à partir de contraintes atomiques générées depuis les sources du projet.',
    tags: ['tailwind', 'utility first', 'responsive', 'hover', 'class'],
    sections: [
      code('Exemple', 'HTML', '<article class="rounded-xl border border-slate-800 bg-slate-950 p-6 sm:p-8">\n  <h2 class="text-xl font-semibold text-white">Promise</h2>\n  <p class="mt-2 text-sm leading-6 text-slate-400">\n    Représente un résultat futur.\n  </p>\n</article>'),
      decomposition('Lecture', [
        { terme: 'rounded-xl', explication: 'rayon de bordure issu du thème.' },
        { terme: 'border-slate-800', explication: 'couleur de bordure.' },
        { terme: 'p-6 sm:p-8', explication: 'padding de base puis valeur à partir du breakpoint sm.' },
        { terme: 'mt-2', explication: 'marge supérieure selon l’échelle d’espacement.' }
      ]),
      alerte('attention', 'Classes dynamiques', 'Le générateur doit pouvoir détecter les noms complets dans les sources. Construire `bg-${couleur}-500` dynamiquement peut empêcher la génération ; mapper vers des chaînes complètes connues.'),
      liens({ label: 'Tailwind CSS — Styling with utility classes', url: 'https://tailwindcss.com/docs/styling-with-utility-classes' })
    ], associes: ['css-outils-comparaison', 'css-responsive', 'css-variables']
  }),
  fiche({
    id: 'bootstrap-composants', domaine: 'css-outils', categorie: 'Bootstrap', titre: 'Grille et composants Bootstrap',
    resume: 'Employer les conventions Bootstrap tout en connaissant le CSS et le JavaScript qu’elles impliquent.',
    tags: ['bootstrap', 'grid', 'container', 'row', 'col', 'modal'],
    sections: [
      code('Grille responsive', 'HTML', '<div class="container">\n  <div class="row g-3">\n    <div class="col-12 col-md-6 col-xl-4">…</div>\n    <div class="col-12 col-md-6 col-xl-4">…</div>\n  </div>\n</div>'),
      texte('Fonctionnement', 'La grille Bootstrap repose sur des conteneurs, lignes et colonnes flexibles. col-12 occupe toute la ligne, col-md-6 la moitié à partir du breakpoint md, et col-xl-4 un tiers à partir de xl.'),
      alerte('attention', 'JavaScript des composants', 'Un style comme btn est purement CSS, mais modal, dropdown ou tooltip demandent le JavaScript Bootstrap et parfois Popper. Ne pas charger tout le bundle sans savoir quels comportements sont utilisés.'),
      alerte('bonne-pratique', 'Personnalisation', 'S’appuyer sur les variables et l’API de personnalisation Bootstrap plutôt que d’empiler des sélecteurs plus spécifiques et !important.'),
      liens({ label: 'Bootstrap — Grid system', url: 'https://getbootstrap.com/docs/5.3/layout/grid/' }, { label: 'Bootstrap — Components', url: 'https://getbootstrap.com/docs/5.3/components/' })
    ], associes: ['css-outils-comparaison', 'css-grid', 'css-selecteurs']
  })
];
