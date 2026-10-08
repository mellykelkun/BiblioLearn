'use strict';

const { creerLecon, creerReference } = require('./profondeur-langages');
const sujets = [
  {
    domaine: 'vue', slug: 'liste-identite', titre: 'Conserver l’identité des éléments d’une liste Vue', niveau: 4, langage: 'Vue', fichier: 'src/App.vue', commande: 'Dans un projet Vue créé avec npm create vue@latest : npm install puis npm run dev',
    contrat: 'v-for répète un fragment pour chaque élément. Une clé stable permet à Vue de suivre l’identité d’une ligne quand l’ordre change, surtout si elle contient une saisie ou un composant avec état.',
    principal: '<script setup>\nimport { ref } from "vue";\nconst livres = ref([{ id: 1, titre: "Web" }, { id: 2, titre: "API" }]);\nfunction inverser() { livres.value = [...livres.value].reverse(); }\n</script>\n<template>\n  <main><h1>Livres</h1><button type="button" @click="inverser">Inverser</button>\n    <ul><li v-for="livre in livres" :key="livre.id">\n      <label>{{ livre.titre }} <input :aria-label="`Note sur ${livre.titre}`"></label>\n    </li></ul>\n  </main>\n</template>',
    variante: '<!-- Mauvaise clé si les éléments sont réordonnés -->\n<li v-for="(livre, index) in livres" :key="index">{{ livre.titre }}</li>',
    lecture: 'livres est réactif ; inverser crée un nouvel ordre. La clé id appartient à l’objet et reste stable après le tri. Une clé index désigne seulement une position : l’état local d’une ligne peut alors rester attaché à la mauvaise donnée.',
    attendu: 'Le bouton inverse Web et API ; les champs restent associés à leur livre grâce à id.', panne: 'Une clé dupliquée ou un index utilisé comme identité après un tri peut faire correspondre la mauvaise ligne à un état local.',
    exercice: 'Ajoutez un troisième livre puis triez par titre. Quelle clé faut-il conserver ?', correction: 'Conservez `:key="livre.id"` et triez une copie de la liste. Le titre peut changer ; l’id doit rester unique parmi les frères.',
    source: 'https://vuejs.org/guide/essentials/list.html'
  },
  {
    domaine: 'vue', slug: 'formulaire-modele', titre: 'Relier un formulaire Vue à un état validé', niveau: 4, langage: 'Vue', fichier: 'src/App.vue', commande: 'Dans un projet Vue créé avec npm create vue@latest : npm install puis npm run dev',
    contrat: 'v-model synchronise une saisie avec un état Vue. La validation métier doit rester explicite avant tout envoi ; un champ required côté navigateur n’autorise pas à croire une valeur serveur fiable.',
    principal: '<script setup>\nimport { computed, ref } from "vue";\nconst titre = ref("");\nconst propre = computed(() => titre.value.trim());\nconst erreur = ref("");\nfunction soumettre() {\n  erreur.value = propre.value ? "" : "Titre requis";\n  if (!erreur.value) console.log({ titre: propre.value });\n}\n</script>\n<template>\n  <form @submit.prevent="soumettre">\n    <label for="titre">Titre</label><input id="titre" v-model="titre" required>\n    <button type="submit">Enregistrer</button>\n    <p v-if="erreur" role="alert">{{ erreur }}</p>\n  </form>\n</template>',
    variante: 'const propre = computed(() => titre.value.trim());\n// "   " devient une chaîne vide avant la décision métier.',
    lecture: 'submit.prevent évite la navigation automatique pour cet essai local. computed recalcule le titre nettoyé depuis la seule source titre. Le rendu {{ erreur }} affiche du texte, sans injecter du HTML. Un vrai envoi demanderait une API et le traitement de ses statuts.',
    attendu: 'Un titre valide s’affiche dans la console comme objet ; le navigateur bloque le champ vide et la validation Vue refuse une saisie d’espaces.', panne: 'v-model ne remplace pas le contrôle des données reçues sur le serveur.',
    exercice: 'Ajoutez une limite de 80 caractères dans soumettre et un message d’erreur distinct.', correction: 'Testez `propre.value.length > 80` avant console.log et affectez une erreur explicite. Le maxlength HTML peut aider l’utilisateur, mais le serveur doit refaire le contrôle.',
    source: 'https://vuejs.org/guide/essentials/forms.html'
  },
  {
    domaine: 'angular', slug: 'signal-derive', titre: 'Calculer un état dérivé avec les signaux Angular', niveau: 4, langage: 'TypeScript / Angular', fichier: 'src/app/app.ts', commande: 'Dans un projet Angular généré avec Angular CLI : npm install puis ng serve',
    contrat: 'signal porte une donnée modifiable ; computed dérive une valeur depuis ses dépendances. Il évite de garder deux états qui peuvent diverger.',
    principal: 'import { Component, computed, signal } from "@angular/core";\n@Component({\n  selector: "app-root",\n  standalone: true,\n  template: `<main><h1>Compteur</h1><p>{{ double() }}</p>\n    <button type="button" (click)="incrementer()">Ajouter</button></main>`\n})\nexport class App {\n  readonly compte = signal(0);\n  readonly double = computed(() => this.compte() * 2);\n  incrementer() { this.compte.update(n => n + 1); }\n}',
    variante: 'readonly triple = computed(() => this.compte() * 3);\n// Après deux clics, triple() vaut 6.',
    lecture: 'Le template lit double() comme une fonction. update reçoit la valeur actuelle et écrit la suivante. computed suit compte ; aucune copie manuelle de double n’est nécessaire.',
    attendu: 'Le paragraphe montre 0, puis 2, puis 4 après deux clics.', panne: 'Une propriété `double = this.compte() * 2` calculée une fois au démarrage ne suivrait pas les clics.',
    exercice: 'Ajoutez un bouton Réinitialiser et affichez aussi triple. Avant de cliquer, prédisez les deux valeurs après deux incréments puis après la remise à zéro.', correction: 'Ajoutez `this.compte.set(0)` dans une méthode appelée par le bouton. Déclarez triple avec computed et lisez `triple()` dans le template.',
    source: 'https://angular.dev/guide/signals'
  },
  {
    domaine: 'angular', slug: 'formulaire-test-limite', titre: 'Tester une limite de formulaire Angular', niveau: 5, langage: 'TypeScript / Angular', fichier: 'src/app/livre-form.ts', commande: 'Dans un projet Angular avec ReactiveFormsModule : npm test pour les tests du projet, ng serve pour l’interface',
    contrat: 'Un FormControl nonNullable garde une chaîne au lieu d’un string|null. Validators.required et maxLength formalisent deux règles de saisie. Le serveur doit refaire ces vérifications à la frontière API.',
    principal: 'import { Component } from "@angular/core";\nimport { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";\n@Component({\n  selector: "app-livre-form", standalone: true, imports: [ReactiveFormsModule],\n  template: `<label for="titre">Titre</label><input id="titre" [formControl]="titre">\n    <p>{{ titre.invalid ? "Titre requis ou trop long" : "Prêt" }}</p>`\n})\nexport class LivreForm {\n  readonly titre = new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.maxLength(80)] });\n}',
    variante: 'const controle = new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.maxLength(80)] });\ncontrole.setValue("Web");\nconsole.log(controle.valid); // true',
    lecture: 'ReactiveFormsModule rend [formControl] disponible dans le template. invalid décrit la valeur actuelle. Le contrôle ne fait aucun envoi réseau ; la couche de traitement doit encore choisir quand appeler l’API.',
    attendu: 'Vide : message d’erreur ; Web : Prêt ; plus de 80 caractères : erreur.', panne: 'Déclarer le contrôle sans importer ReactiveFormsModule provoque une erreur de template.',
    exercice: 'Écrivez un test qui affecte 81 caractères et vérifie invalid.', correction: 'Dans le test, récupérez `titre`, appelez `setValue("a".repeat(81))`, puis attendez `titre.invalid === true`. Testez aussi 80 caractères comme borne acceptée.',
    source: 'https://angular.dev/guide/forms/reactive-forms'
  },
  {
    domaine: 'react', slug: 'formulaire-etats', titre: 'Éviter les états contradictoires dans un formulaire React', niveau: 4, langage: 'JSX', fichier: 'src/App.jsx', commande: 'Dans un projet React local créé avec un outil de démarrage maintenu : npm install puis npm run dev',
    contrat: 'Une interface peut être idle, sending, success ou error. Stocker deux booléens isSending et isSent autorise des combinaisons impossibles ; un seul statut rend la transition explicite.',
    principal: 'import { useState } from "react";\nexport default function App() {\n  const [texte, setTexte] = useState("");\n  const [statut, setStatut] = useState("idle");\n  async function envoyer(event) {\n    event.preventDefault();\n    if (!texte.trim()) { setStatut("error"); return; }\n    setStatut("sending");\n    await Promise.resolve(); // remplacez par un vrai appel et traitez son échec\n    setStatut("success");\n  }\n  return <form onSubmit={envoyer}><label>Message<input value={texte} onChange={e => setTexte(e.target.value)} /></label>\n    <button disabled={statut === "sending"}>Envoyer</button><p role="status">{statut}</p></form>;\n}',
    variante: 'const [isSending, setIsSending] = useState(false);\nconst [isSent, setIsSent] = useState(false);\n// Les deux booléens peuvent devenir true en même temps.',
    lecture: 'L’entrée texte est contrôlée par React. envoyer bloque une saisie vide, annonce une attente et affiche une réussite après la promesse de démonstration. Un vrai fetch doit être entouré d’un try/catch et distinguer response.ok avant success.',
    attendu: 'Vide : error ; avec du texte : sending puis success.', panne: 'Annoncer success avant de vérifier la réponse d’une vraie API ment à l’utilisateur.',
    exercice: 'Ajoutez try/catch autour d’un appel asynchrone et revenez à error sur échec.', correction: 'Dans try, attendez l’appel et vérifiez son résultat avant success. Dans catch, affectez error ; conservez le texte pour permettre une nouvelle tentative.',
    source: 'https://react.dev/learn/choosing-the-state-structure'
  },
  {
    domaine: 'react', slug: 'key-reinitialisation', titre: 'Choisir quand React conserve ou réinitialise un état', niveau: 5, langage: 'JSX', fichier: 'src/App.jsx', commande: 'Dans un projet React local : npm install puis npm run dev',
    contrat: 'React associe l’état à une position dans l’arbre. Donner une key liée à l’identité du document force le remontage du formulaire quand cette identité change ; une key ne doit pas être générée au hasard à chaque rendu.',
    principal: 'import { useState } from "react";\nfunction Brouillon({ titre }) {\n  const [texte, setTexte] = useState("");\n  return <label>{titre}<input value={texte} onChange={e => setTexte(e.target.value)} /></label>;\n}\nexport default function App() {\n  const [id, setId] = useState(1);\n  return <main><button onClick={() => setId(id === 1 ? 2 : 1)}>Autre livre</button>\n    <Brouillon key={id} titre={`Livre ${id}`} /></main>;\n}',
    variante: '<Brouillon key="fixe" titre={`Livre ${id}`} />\n// Le brouillon reste au même composant après changement de livre.',
    lecture: 'La clé 1 ou 2 reflète l’identité du livre. Quand elle change, React crée une nouvelle instance de Brouillon avec un champ vide. La clé fixe conserve le champ ; cela peut être voulu si le brouillon est partagé, mais pas si chaque livre a son propre brouillon.',
    attendu: 'Changer de livre vide la saisie du formulaire dans le programme principal.', panne: 'Utiliser Math.random() comme key à chaque rendu fait perdre la saisie sans changement de livre.',
    exercice: 'Conservez un brouillon par livre plutôt que de le perdre : où placeriez-vous cet état ?', correction: 'Remontez les brouillons dans App, indexés par id, puis passez valeur et fonction de mise à jour à Brouillon. La key seule réinitialise ; elle ne persiste pas les textes.',
    source: 'https://react.dev/learn/preserving-and-resetting-state'
  },
  {
    domaine: 'nextjs', slug: 'route-handler-validation', titre: 'Valider une entrée dans un Route Handler Next.js', niveau: 5, langage: 'TypeScript', fichier: 'app/api/livres/route.ts', commande: 'Dans un projet Next.js App Router : npm install puis npm run dev ; envoyer un POST sur http://localhost:3000/api/livres',
    contrat: 'Un Route Handler reçoit une Request côté serveur. Un JSON valide syntaxiquement peut encore manquer un champ ou porter un mauvais type ; la route vérifie la valeur avant de répondre 201.',
    principal: 'export async function POST(request: Request) {\n  let corps: unknown;\n  try { corps = await request.json(); }\n  catch { return Response.json({ erreur: "JSON invalide" }, { status: 400 }); }\n  if (typeof corps !== "object" || corps === null || !("titre" in corps) ||\n      typeof corps.titre !== "string" || !corps.titre.trim() || corps.titre.length > 80) {\n    return Response.json({ erreur: "titre invalide" }, { status: 400 });\n  }\n  return Response.json({ titre: corps.titre.trim() }, { status: 201 });\n}',
    variante: 'curl -i -X POST http://localhost:3000/api/livres -H "Content-Type: application/json" -d \'{"titre":"Web"}\'\n# Attendu : 201 et {"titre":"Web"}',
    lecture: 'request.json peut lever une erreur pour un corps mal formé. unknown oblige à contrôler la forme avant de lire titre. Le fragment retourne un objet mais ne le stocke pas : ajoutez une persistance seulement avec un contrat de données clair.',
    attendu: 'Titre Web : 201 ; titre absent ou JSON invalide : 400.', panne: 'Ne supposez pas qu’un formulaire navigateur a déjà protégé une route HTTP accessible directement.',
    exercice: 'Ajoutez un test de titre trop long et prédisez le statut. Envoyez successivement 80 puis 81 caractères et comparez le corps et le code HTTP.', correction: 'La condition `corps.titre.length > 80` renvoie 400. Testez 80 caractères comme cas accepté et 81 comme cas refusé.',
    source: 'https://nextjs.org/docs/app/getting-started/route-handlers'
  },
  {
    domaine: 'typescript', slug: 'union-resultat', titre: 'Décrire succès et échec par une union discriminée', niveau: 5, langage: 'TypeScript', fichier: 'resultat.ts', commande: 'Dans un projet TypeScript strict : npx tsc --noEmit puis exécutez le JavaScript compilé selon la configuration du projet',
    contrat: 'Une union discriminée donne à chaque issue sa forme propre. Tester la propriété ok permet au compilateur de savoir si valeur ou erreur existe, sans forcer un cast.',
    principal: 'type Resultat<T> = { ok: true; valeur: T } | { ok: false; erreur: string };\nfunction lireAge(texte: string): Resultat<number> {\n  const age = Number(texte);\n  if (!Number.isInteger(age) || age < 0 || texte.trim() === "")\n    return { ok: false, erreur: "âge invalide" };\n  return { ok: true, valeur: age };\n}\nconst resultat = lireAge("18");\nconsole.log(resultat.ok ? resultat.valeur + 1 : resultat.erreur);',
    variante: 'const resultat = lireAge("abc");\nconsole.log(resultat.ok ? resultat.valeur : resultat.erreur); // âge invalide',
    lecture: 'ok est le discriminant littéral true ou false. Le compilateur permet valeur seulement dans la branche de succès. Une entrée chaîne vide est refusée explicitement, car Number("") vaudrait 0.',
    attendu: '19 pour 18 ; âge invalide pour abc.', panne: 'Un cast `as number` sur une donnée externe ne convertit ni ne vérifie la valeur à l’exécution.',
    exercice: 'Refusez un âge au-dessus de 130 et expliquez le retour. Essayez 130, 131 et une chaîne non numérique pour vérifier les trois frontières.', correction: 'Ajoutez `age > 130` à la condition. La branche d’échec rend `{ ok: false, erreur: "âge invalide" }` et l’appelant ne peut pas lire valeur.',
    source: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html'
  }
];

module.exports = { lecons: sujets.map(creerLecon), references: sujets.map(creerReference) };
