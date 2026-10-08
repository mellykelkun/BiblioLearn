'use strict';
const springFichiers = require('./spring-fichiers');
const amorcesSQL = require('./sql-ateliers').amorces;

// Chaque chemin annoncé par un atelier a un contenu initial ou une commande
// qui le produit. L'amorce doit être utilisable avant la partie à résoudre.
const projets = {
  html: { commande: 'Ouvrez index.html dans le navigateur.', fichier: 'index.html', contenu: '<!doctype html>\n<html lang="fr">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Atelier HTML</title></head>\n<body><main><h1>Atelier HTML</h1><p>La page de départ fonctionne. Ajoutez ici le code de l’étape guidée.</p></main></body>\n</html>' },
  css: { commande: 'Ouvrez index.html dans le navigateur.', fichier: 'index.html', contenu: '<!doctype html>\n<html lang="fr">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Atelier CSS</title><link rel="stylesheet" href="styles.css"></head>\n<body><main class="carte"><h1>Atelier CSS</h1><p>Modifiez la présentation dans styles.css.</p></main></body>\n</html>', autres: { 'styles.css': '*, *::before, *::after { box-sizing: border-box; }\nbody { margin: 0; padding: 1rem; font: 1rem/1.5 system-ui, sans-serif; }\n.carte { max-width: 40rem; margin: auto; padding: 1rem; border: 1px solid #475569; }' } },
  javascript: { commande: 'Ouvrez index.html dans le navigateur et regardez la console.', fichier: 'index.html', contenu: '<!doctype html>\n<html lang="fr"><head><meta charset="utf-8"><title>Atelier JavaScript</title><script src="app.js" defer></script></head>\n<body><main><h1>Atelier JavaScript</h1><p>Ouvrez la console du navigateur.</p></main></body></html>', autres: { 'app.js': '"use strict";\nconst livres = [{ id: 1, titre: "Web" }, { id: 2, titre: "Code" }];\nconsole.log("Livres chargés :", livres.length);\n// Intégrez ici la modification propre au défi.' } },
  dom: { commande: 'Ouvrez index.html dans le navigateur ; cliquez sur le bouton.', fichier: 'index.html', contenu: '<!doctype html>\n<html lang="fr"><head><meta charset="utf-8"><title>Atelier DOM</title><script src="app.js" defer></script></head>\n<body><main><h1>Atelier DOM</h1><button id="ajouter" type="button">Ajouter</button><ul id="taches"></ul><p id="etat" role="status"></p></main></body></html>', autres: { 'app.js': '"use strict";\nconst bouton = document.querySelector("#ajouter");\nconst liste = document.querySelector("#taches");\nconst etat = document.querySelector("#etat");\nbouton.addEventListener("click", () => {\n  const item = document.createElement("li");\n  item.textContent = `Tâche ${liste.children.length + 1}`;\n  liste.append(item);\n  etat.textContent = `${liste.children.length} tâche(s)`;\n});' } },
  node: { commande: 'node main.js', fichier: 'main.js', contenu: '"use strict";\nconst nom = process.argv[2] || "Awa";\nconsole.log(`Bonjour ${nom}`);' },
  npm: { commande: 'npm run check && npm start', fichier: 'package.json', contenu: '{\n  "name": "atelier-bibliolearn",\n  "version": "1.0.0",\n  "private": true,\n  "scripts": { "start": "node index.js", "check": "node --check index.js" }\n}', autres: { 'index.js': '"use strict";\nconsole.log("Le script npm est lancé depuis package.json.");' } },
  http: { commande: 'node server.js ; dans un second terminal : curl -i http://localhost:3000/api/sante. Le fichier requêtes.http fonctionne aussi dans un client compatible .http.', fichier: 'requêtes.http', contenu: '### Requête HTTP à lancer avec un client compatible .http\nGET http://localhost:3000/api/sante\nAccept: application/json\n\n### Autre ressource\nGET http://localhost:3000/api/livres\nAccept: application/json', autres: { 'server.js': '"use strict";\nconst http = require("node:http");\nhttp.createServer((req, res) => {\n  res.setHeader("Content-Type", "application/json; charset=utf-8");\n  if (req.url === "/api/sante") { res.writeHead(200); return res.end(JSON.stringify({ statut: "ok" })); }\n  if (req.url === "/api/livres") { res.writeHead(200); return res.end(JSON.stringify({ donnees: [{ id: 1, titre: "Web" }] })); }\n  res.writeHead(404); res.end(JSON.stringify({ erreur: "introuvable" }));\n}).listen(3000, () => console.log("http://localhost:3000/api/sante"));', 'package.json': '{\n  "name": "atelier-http", "version": "1.0.0", "private": true,\n  "scripts": { "start": "node server.js" }\n}' } },
  express: { commande: 'npm install puis npm start ; dans un second terminal : curl -i http://localhost:3000/api/sante', fichier: 'package.json', contenu: '{\n  "name": "atelier-express-bibliolearn",\n  "version": "1.0.0",\n  "private": true,\n  "scripts": { "start": "node server.js" },\n  "dependencies": { "express": "^4.22.3" }\n}', autres: { 'server.js': '"use strict";\nconst express = require("express");\nconst app = express();\napp.use(express.json());\napp.get("/api/sante", (_req, res) => res.json({ statut: "ok" }));\napp.listen(3000, () => console.log("http://localhost:3000/api/sante"));' } },
  shell: { commande: 'bash exercice.sh depuis un dossier d’essai ; lisez le script avant de l’exécuter.', fichier: 'exercice.sh', contenu: '#!/usr/bin/env bash\nset -euo pipefail\nprintf "Dossier courant : %s\\n" "$PWD"\nmkdir -p atelier-temporaire\nprintf "Bonjour\\n" > atelier-temporaire/note.txt\ncat atelier-temporaire/note.txt\n# Aucune suppression automatique : inspectez les fichiers avant de nettoyer.' },
  typescript: { commande: 'Installez TypeScript dans le dossier (npm install --save-dev typescript), puis npx tsc --noEmit.', fichier: 'index.ts', contenu: 'type Livre = { id: number; titre: string };\nconst livre: Livre = { id: 1, titre: "Web" };\nconsole.log(livre.titre);', autres: { 'tsconfig.json': '{\n  "compilerOptions": { "target": "ES2022", "module": "NodeNext", "moduleResolution": "NodeNext", "strict": true, "noEmit": true }\n}' } },
  react: { commande: 'Dans un dossier parent : npm create vite@latest atelier-react -- --template react ; cd atelier-react ; npm install ; remplacez src/App.jsx ; npm run dev.', fichier: 'App.jsx', contenu: 'import { useState } from "react";\nexport default function App() {\n  const [compteur, setCompteur] = useState(0);\n  return <main><h1>Atelier React</h1><button type="button" onClick={() => setCompteur(n => n + 1)}>Clics : {compteur}</button></main>;\n}' },
  nextjs: { commande: 'Dans un dossier parent : npx create-next-app@latest atelier-next ; cd atelier-next ; remplacez app/page.tsx (ou src/app/page.tsx selon votre choix) ; npm run dev.', fichier: 'app/page.tsx', contenu: 'export default function Page() {\n  return <main><h1>Atelier Next.js</h1><p>La route / répond.</p></main>;\n}' },
  vue: { commande: 'Dans un dossier parent : npm create vue@latest ; choisissez atelier-vue ; cd atelier-vue ; npm install ; remplacez src/App.vue ; npm run dev.', fichier: 'App.vue', contenu: '<script setup>\nimport { ref } from "vue";\nconst clics = ref(0);\n</script>\n<template>\n  <main><h1>Atelier Vue</h1><button type="button" @click="clics++">Clics : {{ clics }}</button></main>\n</template>' },
  angular: { commande: 'Dans un dossier parent : npx @angular/cli new atelier-angular ; cd atelier-angular ; remplacez src/app/app.ts dans le projet généré ; npm start. Le CLI crée le reste du projet.', fichier: 'src/app/app.ts', contenu: 'import { Component, signal } from "@angular/core";\n@Component({ selector: "app-root", standalone: true, template: `<main><h1>Atelier Angular</h1><button (click)="clics.set(clics() + 1)">Clics : {{ clics() }}</button></main>` })\nexport class App { clics = signal(0); }' },
  'css-outils': { commande: 'Ouvrez index.html dans le navigateur. Pour Tailwind ou Bootstrap, préparez ensuite le projet avec l’outil officiel indiqué par la fiche liée ; les classes propres à ces outils ne fonctionnent pas sans leur CSS.', fichier: 'index.html', contenu: '<!doctype html>\n<html lang="fr"><head><meta charset="utf-8"><title>Atelier styles</title><link rel="stylesheet" href="styles.css"></head>\n<body><main><h1>Atelier styles</h1><div class="grille"><article>Un</article><article>Deux</article></div></main></body></html>', autres: { 'styles.css': '*, *::before, *::after { box-sizing: border-box; }\nbody { font: 1rem/1.5 system-ui, sans-serif; }\n.grille { display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); gap: 1rem; }\n.grille article { padding: 1rem; border: 1px solid #475569; }' } }
};

const amorcesHistoriques = {
  'atelier-carte-html-css': {
    'card.html': '<!doctype html>\n<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Carte de Samira</title><link rel="stylesheet" href="card.css"></head>\n<body><main><article class="profile-card"><img src="images/avatar.svg" alt="Portrait illustré de Samira" width="96" height="96"><div><p>Développeuse frontend</p><h1>Samira Diallo</h1><p>Je crée des interfaces lisibles.</p><a href="mailto:samira@example.com">Contacter Samira</a></div></article></main></body></html>',
    'card.css': '*, *::before, *::after { box-sizing: border-box; }\nbody { margin: 0; padding: 1rem; font: 1rem/1.5 system-ui, sans-serif; }\n.profile-card { display: flex; gap: 1rem; max-width: 32rem; padding: 1rem; border: 1px solid #475569; border-radius: 1rem; }\n.profile-card a:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 3px; }\n@media (max-width: 30rem) { .profile-card { flex-direction: column; } }'
  },
  'atelier-dom-toggle': {
    'index.html': '<!doctype html>\n<html lang="fr"><head><meta charset="utf-8"><title>Contraste</title><link rel="stylesheet" href="styles.css"><script src="app.js" defer></script></head><body><main><button id="theme-toggle" type="button" aria-pressed="false">Activer le contraste</button><article class="card"><h1>Une carte interactive</h1><p>Essayez le bouton et la touche Entrée.</p></article></main></body></html>',
    'styles.css': 'body { font: 1rem/1.5 system-ui, sans-serif; color: #1e293b; background: white; }\nbody.contraste-eleve { color: white; background: #0f172a; }\nbutton:focus-visible { outline: 3px solid #f59e0b; outline-offset: 3px; }',
    'app.js': '"use strict";\nconst bouton = document.querySelector("#theme-toggle");\nbouton.addEventListener("click", () => {\n  const actif = document.body.classList.toggle("contraste-eleve");\n  bouton.setAttribute("aria-pressed", String(actif));\n  bouton.textContent = actif ? "Désactiver le contraste" : "Activer le contraste";\n});'
  },
  'atelier-recherche-locale': {
    'index.html': '<!doctype html>\n<html lang="fr"><head><meta charset="utf-8"><title>Recherche locale</title><script src="app.js" defer></script></head>\n<body><main><h1>Rechercher une fiche</h1><label for="recherche">Titre ou mot-clé</label><input id="recherche" type="search"><p id="etat" role="status"></p><ul id="resultats"></ul></main></body></html>',
    'app.js': '"use strict";\nconst fiches = [{ titre: "JavaScript map", tags: "tableau" }, { titre: "HTML", tags: "web" }];\nconst champ = document.querySelector("#recherche");\nconst liste = document.querySelector("#resultats");\nconst etat = document.querySelector("#etat");\nconst normaliser = texte => texte.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase();\nfunction afficher() {\n  const terme = normaliser(champ.value.trim());\n  const visibles = fiches.filter(f => normaliser(`${f.titre} ${f.tags}`).includes(terme));\n  liste.replaceChildren(...visibles.map(f => { const li = document.createElement("li"); li.textContent = f.titre; return li; }));\n  etat.textContent = visibles.length ? `${visibles.length} résultat(s)` : "Aucun résultat";\n}\nchamp.addEventListener("input", afficher);\nafficher();'
  },
  'atelier-node-server': {
    'package.json': '{\n  "name": "atelier-sante", "version": "1.0.0", "private": true,\n  "scripts": { "start": "node server.js" },\n  "dependencies": { "express": "^4.22.3" }\n}',
    'server.js': '"use strict";\nconst express = require("express");\nconst app = express();\nconst port = Number(process.env.PORT) || 3000;\napp.get("/api/sante", (_req, res) => res.json({ statut: "ok" }));\napp.listen(port, () => console.log(`http://localhost:${port}/api/sante`));'
  },
  'atelier-express-json': {
    'package.json': '{\n  "name": "atelier-notes", "version": "1.0.0", "private": true,\n  "scripts": { "start": "node server.js" },\n  "dependencies": { "express": "^4.22.3" }\n}',
    'server.js': '"use strict";\nconst express = require("express");\nconst app = express();\napp.use(express.json());\nconst notes = [];\napp.get("/api/notes", (_req, res) => res.json({ donnees: notes }));\napp.post("/api/notes", (req, res) => {\n  if (typeof req.body?.titre !== "string" || !req.body.titre.trim()) return res.status(400).json({ erreur: "titre requis" });\n  const note = { id: notes.length + 1, titre: req.body.titre.trim() };\n  notes.push(note);\n  return res.status(201).json(note);\n});\napp.listen(3000, () => console.log("http://localhost:3000/api/notes"));'
  },
  'atelier-npm-package': {
    'package.json': '{\n  "name": "bonjour-cli-local", "version": "1.0.0", "private": true,\n  "bin": { "bonjour": "index.js" },\n  "scripts": { "check": "node --check index.js" }\n}',
    'index.js': '#!/usr/bin/env node\n"use strict";\nconst nom = process.argv[2] || "développeur";\nconsole.log(`Bonjour ${nom} !`);'
  },
  'atelier-api-fetch': {
    'package.json': '{\n  "name": "atelier-fetch", "version": "1.0.0", "private": true,\n  "scripts": { "start": "node server.js" },\n  "dependencies": { "express": "^4.22.3" }\n}',
    'server.js': '"use strict";\nconst express = require("express");\nconst path = require("node:path");\nconst app = express();\nfor (const fichier of ["index.html", "app.js", "styles.css"]) {\n  app.get(`/${fichier}`, (_req, res) => res.sendFile(path.join(__dirname, fichier)));\n}\napp.get("/api/notes", (_req, res) => res.json({ donnees: [{ id: 1, titre: "Première note" }, { id: 2, titre: "Deuxième note" }] }));\napp.listen(3000, () => console.log("http://localhost:3000/index.html"));',
    'index.html': '<!doctype html>\n<html lang="fr"><head><meta charset="utf-8"><title>Charger des notes</title><link rel="stylesheet" href="styles.css"><script src="app.js" defer></script></head>\n<body><main><h1>Notes du serveur</h1><button id="charger" type="button">Charger les notes</button><p id="etat" role="status"></p><ul id="liste-notes"></ul></main></body></html>',
    'styles.css': 'body { font: 1rem/1.5 system-ui, sans-serif; margin: 1rem; }\nbutton:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 3px; }',
    'app.js': '"use strict";\nconst bouton = document.querySelector("#charger");\nconst etat = document.querySelector("#etat");\nconst liste = document.querySelector("#liste-notes");\nbouton.addEventListener("click", async () => {\n  etat.textContent = "Chargement…";\n  try {\n    const reponse = await fetch("/api/notes");\n    if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);\n    const donnees = await reponse.json();\n    liste.replaceChildren(...donnees.donnees.map(note => { const li = document.createElement("li"); li.textContent = note.titre; return li; }));\n    etat.textContent = `${donnees.donnees.length} note(s)`;\n  } catch (erreur) { etat.textContent = `Impossible de charger : ${erreur.message}`; }\n});'
  },
  'atelier-git-cycle': {
    '.gitignore': 'node_modules/\n.env\n.DS_Store\n',
    'README.md': '# Mon exercice Git\n\nPremier commit : vérifier les fichiers avant git add.\n',
    'package.json': '{\n  "name": "atelier-git", "private": true, "version": "1.0.0"\n}'
  },
  'atelier-shell-organiser': {
    'html.md': '# HTML\n\nUne balise donne un sens au contenu.\n',
    'css.md': '# CSS\n\nUne règle modifie la présentation.\n'
  }
};

function creerAmorces(atelier) {
  const modele = projets[atelier.domaine];
  const premier = atelier.structure[0];
  const prefixe = premier.includes('/') ? premier.split('/')[0] + '/' : '';
  const estParcoursLangage = /^atelier-(python|java|springboot|cpp|csharp|php)-/.test(atelier.id);
  const commandeModele = modele?.commande?.replace(/atelier-(react|next|vue|angular)/g, prefixe.slice(0, -1));
  const commande = atelier.execution || commandeModele || 'Suivez les commandes de la leçon liée.';
  const aEcrire = (chemin, contenu, role = 'Amorce exécutable à compléter pendant les étapes') => ({ chemin, contenu, role, mode: 'a-ecrire' });
  const produit = (chemin, role) => ({ chemin, contenu: '', role, mode: 'genere' });
  const fragments = [];
  const codeEtape = atelier.etapes.find(e => e.titre === 'Construire la solution')?.code || '';
  const springSources = atelier.domaine === 'springboot'
    ? new Map(springFichiers.fichiers(atelier.id.replace(/^atelier-springboot-/, '').replace(/-(essayer|limites|transfert|qualite)$/, '')).map(f => [f.chemin, f.contenu]))
    : new Map();
  for (const chemin of atelier.structure) {
    const nom = prefixe && chemin.startsWith(prefixe) ? chemin.slice(prefixe.length) : chemin;
    if (amorcesHistoriques[atelier.id]?.[nom]) {
      fragments.push(aEcrire(chemin, amorcesHistoriques[atelier.id][nom]));
      continue;
    }
    if (amorcesSQL[atelier.id] && nom === 'sql.py') {
      fragments.push(aEcrire(chemin, amorcesSQL[atelier.id], 'Programme SQLite exécutable à faire évoluer pendant l’atelier'));
      continue;
    }
    if (chemin.endsWith('/')) { fragments.push(produit(chemin, 'Dossier créé par la commande mkdir de la première étape.')); continue; }
    if (nom === 'README.md') {
      const preparation = atelier.domaine === 'springboot' ? 'Générez ici un projet Maven Java avec Spring Initializr sur https://start.spring.io avec Spring Web (et Spring Data JPA + H2 pour le dépôt). Gardez le paquet com.example.demo et les fichiers pom.xml, mvnw et DemoApplication.java générés.'
        : atelier.domaine === 'csharp' ? 'Dans ce dossier, lancez dotnet new console -n atelier --output . ; le SDK crée atelier.csproj. Remplacez Program.cs par le fichier indiqué ci-dessous.'
        : ['react', 'nextjs', 'vue', 'angular'].includes(atelier.domaine) ? 'Générez d’abord le projet avec la commande ci-dessous, puis remplacez uniquement les fichiers de départ indiqués. Les autres fichiers nécessaires sont créés par le générateur officiel.'
        : `Créez le dossier ${prefixe || 'de cet atelier'}, entrez dedans, puis recopiez les fichiers de départ avec leurs noms exacts.`;
      fragments.push(aEcrire(chemin, `# ${atelier.titre}\n\nObjectif : ${atelier.objectif}\n\n## Préparer\n${preparation}\n\n## Lancer\n${typeof commande === 'string' ? commande : Object.entries(commande).map(([systeme, valeur]) => `${systeme} : ${valeur}`).join('\n')}\n\n## Prouver\n${atelier.validation.map(v => `- ${v}`).join('\n')}\n`, 'Mode d’emploi initial, à compléter avec vos observations'));
      continue;
    }
    if (estParcoursLangage) {
      if (nom === 'main.py' || nom === 'Bonjour.java' || nom === 'main.cpp' || nom === 'Program.cs' || nom === 'index.php') {
        fragments.push(aEcrire(chemin, codeEtape.replace(/\n(?:#|\/\/) Atelier [^\n]*$/, ''), 'Code complet de départ ; réalisez ensuite la variante demandée'));
        continue;
      }
      if (nom === 'note.txt') { fragments.push(aEcrire(chemin, 'Bonjour depuis le fichier de l’atelier\n', 'Donnée de test lue par le programme')); continue; }
      if (nom === 'atelier.csproj') { fragments.push(produit(chemin, 'Créé par dotnet new console ; conservez le framework choisi par votre SDK.')); continue; }
      if (nom === 'composer.lock') { fragments.push(produit(chemin, 'Créé par composer install ; ne recopiez pas un lockfile inventé.')); continue; }
      if (nom === 'composer.json') { fragments.push(aEcrire(chemin, '{\n  "name": "bibliolearn/atelier",\n  "description": "Exercice local Composer",\n  "require": {}\n}')); continue; }
      if (nom === 'pom.xml') { fragments.push(produit(chemin, 'Créé par Spring Initializr avec Maven et Spring Web ; ajoutez Spring Data JPA et H2 pour le dépôt.')); continue; }
      if (nom.endsWith('DemoApplication.java')) { fragments.push(produit(chemin, 'Créé par Spring Initializr dans le paquet com.example.demo. L’exemple de la leçon ajoute ensuite sa classe spécialisée.')); continue; }
      if (springSources.has(nom)) { fragments.push(aEcrire(chemin, springSources.get(nom), 'Classe complète à placer dans le projet généré')); continue; }
    }
    if (modele) {
      const contenu = (nom === modele.fichier || nom.endsWith('/' + modele.fichier)) ? modele.contenu : modele.autres?.[nom] || modele.autres?.[nom.split('/').pop()];
      if (contenu) { fragments.push(aEcrire(chemin, contenu)); continue; }
    }
    // Les rares supports historiques ne sont pas du code exécutable.
    if (nom.endsWith('.svg')) { fragments.push(aEcrire(chemin, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="Portrait illustré"><rect width="96" height="96" fill="#dbeafe"/><circle cx="48" cy="36" r="18" fill="#1d4ed8"/><path d="M14 90c3-25 65-25 68 0" fill="#1d4ed8"/></svg>', 'Image d’essai locale')); continue; }
    throw new Error(`Amorce de fichier absente : ${atelier.id} → ${chemin}`);
  }
  return { ...atelier, commandeDepart: commande, fichiersDepart: fragments };
}

module.exports = { creerAmorces };
