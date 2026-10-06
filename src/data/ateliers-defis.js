'use strict';

// Huit points de départ et critères distincts par domaine, dans l'ordre des thèmes.
// Les extraits sont volontairement petits : l'atelier demande de les compléter.
const d = (code, attendu, panne) => ({ code, attendu, panne });

module.exports = {
  html: [
    d('<header><nav aria-label="Navigation principale"><a href="#contenu">Contenu</a></nav></header>\n<main id="contenu"><h1>Accueil</h1></main>', 'Un seul main, un lien de navigation qui mène réellement au contenu.', 'Retirez la cible #contenu : le lien ne conduit plus au bon endroit.'),
    d('<a href="#contenu" class="evitement">Aller au contenu</a>\n<nav><a href="#cours">Cours</a><a href="#ateliers">Ateliers</a></nav>\n<main id="contenu"><h1>Apprendre</h1><section id="cours"><h2>Cours</h2></section><section id="ateliers"><h2>Ateliers</h2></section></main>', 'Tab atteint le lien d’évitement puis les deux liens dans l’ordre ; Entrée mène à chaque section.', 'Supprimez le href du lien Ateliers : il ne remplit plus son rôle de lien au clavier.'),
    d('<form><label for="email">Courriel</label><input id="email" name="email" type="email" required><button>S’inscrire</button></form>', 'Une entrée vide ou mal formée est signalée ; le champ possède un nom transmis.', 'Supprimez name : l’interface semble marcher mais la valeur n’est plus nommée.'),
    d('<table><caption>Livres disponibles</caption><thead><tr><th scope="col">Titre</th><th scope="col">Année</th></tr></thead><tbody><tr><td>Le Web</td><td>2024</td></tr></tbody></table>', 'Chaque valeur garde un en-tête compréhensible, même sans CSS.', 'Remplacez les th par td : les colonnes perdent leur en-tête sémantique.'),
    d('<video controls><source src="video-demo.mp4" type="video/mp4"><track kind="captions" src="sous-titres.vtt" srclang="fr" label="Français"></video>', 'La vidéo est contrôlable et possède une piste de sous-titres utilisable.', 'Retirez la piste : l’information orale devient inaccessible sans audio.'),
    d('<details><summary>Quels prérequis ?</summary><p>Aucun pour la première leçon.</p></details>', 'Entrée et Espace ouvrent et ferment une réponse annoncée.', 'Remplacez summary par une div : le contrôle natif disparaît.'),
    d('<html lang="fr"><body><h1>Bienvenue</h1><p lang="en">Hello</p></body></html>', 'La langue principale et l’exception sont identifiables par les technologies d’assistance.', 'Retirez lang="en" : le mot anglais peut être lu avec la mauvaise prononciation.'),
    d('<main><h1>Audit rapide</h1><form><label for="q">Rechercher</label><input id="q" name="q"><button>Rechercher</button></form></main>', 'Une revue au clavier trouve le titre, le champ étiqueté et le bouton.', 'Retirez le label, puis documentez la perte observée au lieu de corriger au hasard.')
  ],
  css: [
    d('.carte { color: #123; }\n.carte:hover { text-decoration: underline; }', 'Seule la carte ciblée change ; l’état survolé est distinct de l’état normal.', 'Retirez le point devant carte et observez pourquoi la règle ne correspond plus à la classe.'),
    d('.galerie { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr)); gap: 1rem; }', 'Les cartes passent à moins de colonnes sans déborder.', 'Imposez trois colonnes fixes et réduisez l’écran : notez le débordement.'),
    d('.barre { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }', 'Les éléments gardent un ordre lisible lorsque la largeur diminue.', 'Retirez flex-wrap et testez un libellé très long.'),
    d(':root { --espace: 1rem; --surface: #fff; }\n.carte { padding: var(--espace); background: var(--surface); }', 'Une modification du token met à jour toutes les cartes concernées.', 'Mal orthographiez --espace et observez la déclaration invalide.'),
    d('@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; } }', 'L’animation est réduite lorsque la préférence système le demande.', 'Désactivez la règle et comparez l’expérience pour une personne sensible au mouvement.'),
    d('.cadre { container-type: inline-size; }\n@container (max-width: 20rem) { .carte { display: block; } }', 'Une carte étroite change même dans une fenêtre large.', 'Retirez container-type et observez pourquoi la query n’a plus de référence.'),
    d('.article { max-width: 65ch; line-height: 1.6; font-size: 1rem; }', 'Un texte long reste lisible au zoom et sur écran étroit.', 'Fixez width: 65rem, puis zoomez et repérez le défilement horizontal.'),
    d('.carte { color: #123; }\n.page .carte { color: #456; }', 'La couleur gagnante est expliquée par la spécificité, pas par hasard.', 'Inversez l’ordre des règles puis expliquez pourquoi le résultat ne change pas.')
  ],
  javascript: [
    d('const { titre, ...reste } = { titre: "Web", pages: 120 };\nconsole.log(titre, reste);', 'titre vaut Web et reste ne contient que pages.', 'Ajoutez un champ secret et vérifiez qu’un spread de reste pourrait le transmettre.'),
    d('function valider(nom) { return typeof nom === "string" && nom.trim().length >= 2; }', 'Une chaîne valide est acceptée ; nombre, vide et espaces seuls sont refusés.', 'Retirez trim et testez deux espaces.'),
    d('const tries = ["b", "a", "c"].toSorted((a, b) => a.localeCompare(b));', 'La liste triée est ordonnée sans modifier l’entrée initiale.', 'Utilisez sort directement et comparez l’original après l’appel.'),
    d('const livres = [{ titre: "Été" }, { titre: "Hiver" }];\nconst resultat = livres.filter((x) => x.titre.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase().includes("ete"));', 'La recherche « ete » trouve « Été » et le cas absent donne une liste vide.', 'Supprimez normalize et cherchez sans accent.'),
    d('function lire(json) { try { return JSON.parse(json); } catch { return null; } }', 'Un JSON valide est lu ; un JSON invalide ne provoque pas de crash silencieux.', 'Passez "{oops}" et décidez si null suffit ou si un message d’erreur est nécessaire.'),
    d('export function doubler(n) { return n * 2; }\n// Importer depuis un second fichier.', 'Un second module importe la fonction et reçoit 8 pour l’entrée 4.', 'Utilisez un mauvais chemin relatif et lisez l’erreur de chargement.'),
    d('async function parcourir(ids) { for (const id of ids) { console.log(await Promise.resolve(id)); } }', 'Chaque élément est traité dans l’ordre ; la liste vide se termine sans erreur.', 'Remplacez par forEach(async ...) et observez la différence d’attente.'),
    d('const debut = performance.now();\nconst somme = Array.from({length: 1000}, (_, i) => i).reduce((a, b) => a + b, 0);\nconsole.log(somme, performance.now() - debut);', 'Le résultat numérique est juste avant toute conclusion sur la durée.', 'Mesurez une seule fois puis expliquez pourquoi cette mesure ne suffit pas pour une décision de performance.')
  ],
  dom: [
    d('const liste = document.querySelector("#taches");\nconst li = document.createElement("li"); li.textContent = "Apprendre"; liste.append(li);', 'Une nouvelle ligne apparaît sans rechargement et les caractères spéciaux restent du texte.', 'Remplacez textContent par innerHTML avec une entrée utilisateur et observez le risque.'),
    d('document.querySelector("#liste").addEventListener("click", (e) => { const b = e.target.closest("button[data-supprimer]"); if (b) b.closest("li").remove(); });', 'Les boutons ajoutés après le chargement fonctionnent aussi.', 'Cliquez dans la liste hors d’un bouton : aucune ligne ne doit disparaître.'),
    d('<button id="menu" aria-expanded="false" aria-controls="liens">Menu</button><nav id="liens" hidden>...</nav>', 'Le bouton ouvre le menu et aria-expanded reflète toujours l’état visible.', 'Changez hidden sans mettre à jour aria-expanded : les deux états se contredisent.'),
    d('const dialog = document.querySelector("dialog");\ndocument.querySelector("#ouvrir").addEventListener("click", () => dialog.showModal());', 'Le dialogue s’ouvre et peut se fermer au clavier avec un retour de focus cohérent.', 'Oubliez la fermeture puis essayez de poursuivre la navigation.'),
    d('<ul id="cartes"><li draggable="true">A</li><li draggable="true">B</li></ul>', 'Un déplacement change l’ordre visible et une alternative clavier existe.', 'Essayez sans souris : notez pourquoi draggable seul est insuffisant.'),
    d('const observer = new MutationObserver((m) => console.log(m.length));\nobserver.observe(document.querySelector("#zone"), { childList: true });', 'Un ajout dans #zone déclenche une observation ; disconnect arrête les suivantes.', 'Oubliez disconnect et ajoutez beaucoup d’éléments pour voir les notifications inutiles.'),
    d('document.addEventListener("keydown", (e) => { if (e.key === "/" && !e.target.matches("input,textarea")) document.querySelector("#recherche").focus(); });', 'Le raccourci cible la recherche hors champ de saisie, sans voler une frappe dans un formulaire.', 'Tapez / dans un input et vérifiez qu’il reste dans le champ.'),
    d('const url = new URL(location.href); url.searchParams.set("q", "web"); history.replaceState(null, "", url);', 'Le filtre q apparaît dans l’URL et peut être relu après chargement.', 'Supprimez la lecture initiale de q puis rechargez : l’interface et l’URL divergent.')
  ],
  node: [
    d('const nom = process.argv[2]; if (!nom) { console.error("Usage: node cli.js NOM"); process.exitCode = 1; } else console.log(`Bonjour ${nom}`);', 'Avec un nom la sortie est correcte ; sans nom un message et un code non nul apparaissent.', 'Passez un argument avec espaces sans guillemets et observez argv.'),
    d('const { readFile } = require("node:fs/promises");\nreadFile("./note.txt", "utf8").then(console.log).catch(console.error);', 'Le fichier présent est lu, le fichier absent produit une erreur compréhensible.', 'Retirez utf8 et comparez le type reçu.'),
    d('const { writeFile, rename } = require("node:fs/promises");\n// Écrire dans note.tmp puis renommer vers note.txt.', 'Le fichier final est remplacé seulement une fois l’écriture réussie.', 'Interrompez le scénario avant rename et vérifiez que l’ancien fichier reste.'),
    d('const { createReadStream } = require("node:fs");\ncreateReadStream("./gros-fichier.txt").on("data", (chunk) => console.log(chunk.length));', 'Les morceaux sont comptés sans charger le fichier complet en une fois.', 'Testez un chemin absent et ajoutez un gestionnaire error.'),
    d('const { spawn } = require("node:child_process");\nconst enfant = spawn(process.execPath, ["--version"]); enfant.stdout.on("data", console.log);', 'La version de Node est lue et le code de sortie du processus est vérifié.', 'Exécutez une commande inexistante et gérez error.'),
    d('const http = require("node:http");\nhttp.createServer((req,res) => {res.setHeader("Content-Type","text/plain");res.end("ok");}).listen(4319);', 'curl sur 4319 reçoit ok et un Content-Type cohérent.', 'Demandez une route inconnue : le serveur répond-il encore ok à tort ?'),
    d('process.on("SIGINT", () => { console.log("Arrêt demandé"); process.exitCode = 0; });', 'Ctrl+C déclenche un arrêt explicite sans laisser une opération en cours.', 'Lancez une opération asynchrone puis quittez immédiatement : est-elle réellement terminée ?'),
    d('function journal(niveau, message) { console.log(JSON.stringify({ date: new Date().toISOString(), niveau, message })); }', 'Chaque ligne de journal est un JSON lisible sans secret personnel.', 'Ajoutez un mot de passe fictif à l’objet reçu et vérifiez qu’il ne passe pas dans les logs.')
  ],
  npm: [
    d('{ "name": "atelier-prive", "private": true, "scripts": { "check": "node --check index.js" } }', 'npm run check exécute le script et le package ne peut pas être publié par accident.', 'Retirez private puis relisez le risque avant toute commande publish.'),
    d('{ "scripts": { "check": "node --check index.js", "test": "node --test" } }', 'Une commande documentée contrôle réellement syntaxe et tests.', 'Remplacez check par une commande inexistante et observez le code de sortie.'),
    d('npm install --save-exact express\nnpm ls express', 'La version déclarée est exacte et vérifiable dans le manifeste.', 'Retirez le lockfile puis réinstallez : discutez la reproductibilité.'),
    d('{ "workspaces": ["packages/*"] }', 'Deux packages locaux sont reconnus depuis la racine du dépôt.', 'Lancez npm dans un sous-dossier imprévu et comparez le manifeste utilisé.'),
    d('{ "name": "outil-local", "bin": { "saluer": "./bin/saluer.js" }, "private": true }', 'La commande saluer pointe vers un fichier existant et exécutable.', 'Changez le chemin bin vers un fichier absent et lisez l’erreur.'),
    d('npm ci\nnpm ls --depth=0', 'Une installation propre reproduit le lockfile sans le modifier.', 'Modifiez package.json sans synchroniser le lockfile puis relancez npm ci.'),
    d('npm outdated\nnpm audit --json', 'Vous identifiez une dépendance à examiner sans mise à jour aveugle.', 'Appliquez une mise à jour majeure fictive sur papier et listez les tests requis.'),
    d('npm pack --dry-run', 'La liste des fichiers publiables est vérifiée sans publication réelle.', 'Ajoutez un faux .env de test et vérifiez qu’il ne figure pas dans l’archive.')
  ],
  http: [
    d('curl -i http://localhost:4319/api/livres', 'Vous pouvez distinguer méthode de requête, statut, en-têtes et corps de réponse.', 'Arrêtez le serveur : il n’existe plus de réponse HTTP à analyser.'),
    d('GET /livres/42 → 200\nPOST /livres avec titre valide → 201\nGET /livres/inconnu → 404', 'Chaque situation renvoie un statut qui correspond réellement au résultat.', 'Renvoyez 200 pour un livre absent et montrez la confusion côté client.'),
    d('curl -i -H "If-None-Match: \\"v1\\"" http://localhost:4319/api/livres', 'Cache-Control et ETag permettent d’expliquer pourquoi une réponse est réutilisée ou reçoit 304.', 'Changez les données sans changer l’ETag et observez le risque de contenu périmé.'),
    d('GET /livres?limit=10&offset=0\nGET /livres?limit=10&offset=10', 'La deuxième page commence après la première, sans doublon ni limite illimitée.', 'Demandez limit=100000 et vérifiez qu’une borne serveur protège la réponse.'),
    d('POST /paiements avec Idempotency-Key: commande-42\nPOST /paiements avec la même clé', 'Deux envois identiques ne créent pas deux paiements pour la même opération.', 'Envoyez la même clé avec un corps différent et définissez la réponse de conflit.'),
    d('curl -i -H "Origin: https://exemple.test" http://localhost:4319/api/livres', 'Seules les origines prévues reçoivent une autorisation de lecture dans le navigateur.', 'Essayez une autre origine et vérifiez que CORS ne remplace pas l’authentification.'),
    d('curl -i -F "fichier=@exemple.txt" http://localhost:4319/api/fichiers', 'Un fichier valide est accepté sous une limite de taille et de type.', 'Essayez un fichier trop grand et exigez une réponse claire sans stockage partiel.'),
    d('curl -sS -i --max-time 5 http://localhost:4319/api/livres', 'La commande de lecture documente URL, limite de temps, statut et format reçu.', 'Arrêtez le serveur puis distinguez connexion refusée et réponse HTTP 404.')
  ],
  express: [
    d('app.get("/api/livres/:id", (req, res) => { const id = Number(req.params.id); if (!Number.isInteger(id)) return res.status(400).json({ erreur: "id invalide" }); res.json({ id }); });', 'Un id numérique est accepté ; un id texte reçoit 400.', 'Retirez Number.isInteger et envoyez /api/livres/abc.'),
    d('app.use((req, res, next) => { console.log(req.method, req.path); next(); });', 'Chaque demande est journalisée avant le traitement, sans corps sensible.', 'Oubliez next puis observez la requête qui ne se termine pas.'),
    d('app.use(express.json({ limit: "32kb" }));\napp.post("/api/livres", (req,res) => { if (typeof req.body?.titre !== "string") return res.sendStatus(400); res.status(201).json({titre:req.body.titre.trim()}); });', 'Un titre texte est accepté ; type invalide ou corps trop grand sont refusés.', 'Envoyez un nombre à la place du titre et vérifiez le statut.'),
    d('app.use((erreur, req, res, next) => { console.error(erreur); res.status(500).json({ erreur: "Service indisponible" }); });', 'Une panne est journalisée côté serveur et une réponse non sensible arrive au client.', 'Renvoyez erreur.stack puis expliquez pourquoi c’est dangereux.'),
    d('app.get("/api/livres", (req,res) => { const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10)); res.json({ donnees: livres.slice(0, limit) }); });', 'La liste est bornée et le client peut demander une page lisible.', 'Demandez limit=100000 et vérifiez la borne réelle.'),
    d('app.get("/api/livres/:id", (req,res) => { const livre = livres.find(x => String(x.id) === req.params.id); if (!livre) return res.sendStatus(404); res.json(livre); });', 'Une ressource existante est lue ; une absente reçoit 404.', 'Remplacez l’absence par un objet vide et observez la confusion côté client.'),
    d('app.get("/api/sante", (req,res) => res.json({ statut: "ok" }));', 'Un contrôle local répond rapidement sans exposer des secrets.', 'Ajoutez une dépendance indisponible et distinguez santé du processus et santé du service.'),
    d('const demandes = new Map();\napp.use((req,res,next) => { const cle = req.ip; const n = (demandes.get(cle)||0)+1; demandes.set(cle,n); if(n>10) return res.sendStatus(429); next(); });', 'Une rafale de test reçoit 429 sans bloquer les demandes normales.', 'Redémarrez ou utilisez plusieurs instances : la Map locale ne fournit pas une limite globale fiable.')
  ],
  shell: [
    d('rg -n "TODO" src | head -20', 'Les occurrences sont repérées avec fichier et ligne, sans fouiller tout le disque.', 'Lancez depuis le mauvais dossier et observez un faux résultat vide.'),
    d('node rapport.js > rapport.txt 2> erreurs.txt', 'Résultat normal et erreurs sont conservés séparément.', 'Inversez les redirections puis vérifiez ce qui devient trompeur.'),
    d('tar -czf sauvegarde.tar.gz dossier-test/', 'L’archive contient uniquement le dossier de test attendu.', 'Archivez un dossier trop large puis inspectez la liste avant extraction.'),
    d('PORT=4319 node serveur.js', 'Le port ne s’applique qu’au processus lancé et aucune clé n’est affichée.', 'Omettez PORT et vérifiez la valeur par défaut prévue par le programme.'),
    d('stat -c "%a %n" script.sh\nchmod u+x script.sh', 'Seul le propriétaire reçoit le droit d’exécuter ce script.', 'Utilisez chmod 777 sur papier et expliquez l’élargissement des droits.'),
    d('find dossier-test -type f -name "*.js" -print0 | xargs -0 -r node --check', 'Les noms avec espaces restent intacts pendant le passage à xargs.', 'Retirez -0 puis testez un nom de fichier avec espaces.'),
    d('alias gs="git status --short"\ngs', 'L’alias accélère une commande connue sans cacher son effet.', 'Ouvrez un nouveau shell et vérifiez si l’alias temporaire existe encore.'),
    d('git log --oneline -5\ngit show --stat HEAD', 'Vous expliquez ce qui a changé dans le dernier commit sans modifier l’historique.', 'Comparez un commit de code et un commit de documentation pour décrire une revue utile.')
  ],
  typescript: [
    d('type Livre = { id: number; titre: string };\nconst livre: Livre = { id: 1, titre: "Web" };', 'Une mauvaise valeur de id est signalée à la compilation.', 'Remplacez id par une chaîne puis expliquez pourquoi le runtime ne valide pas un JSON entrant.'),
    d('type Resultat = { ok: true; valeur: string } | { ok: false; erreur: string };', 'La branche ok donne accès à valeur et l’autre à erreur, sans assertion.', 'Accédez à valeur avant le test de ok et lisez le diagnostic.'),
    d('function estLivre(v: unknown): v is { titre: string } { return typeof v === "object" && v !== null && "titre" in v && typeof v.titre === "string"; }', 'Une valeur reçue est contrôlée avant lecture de titre.', 'Passez null et {titre:42} au garde.'),
    d('function premier<T>(liste: T[]): T | undefined { return liste[0]; }', 'Le type du premier élément suit l’entrée et le tableau vide reste représenté.', 'Retirez undefined du retour et testez [] conceptuellement.'),
    d('type LivrePublic = Pick<{id:number; titre:string; secret:string}, "id" | "titre">;', 'La forme publique nomme exactement les champs autorisés.', 'Ajoutez un nouveau champ secret à la source et vérifiez qu’il ne rejoint pas le type public.'),
    d('type Reponse = { donnees: unknown };\n// Valider chaque élément avant de construire Livre[].', 'Une réponse JSON inattendue ne devient pas sûre grâce à une assertion.', 'Forcez as Livre[] sur un objet erreur et observez le problème au runtime.'),
    d('const Etat = { pret: "pret", erreur: "erreur" } as const;\ntype Etat = typeof Etat[keyof typeof Etat];', 'Les valeurs autorisées sont explicites sans enum numérique implicite.', 'Passez une valeur hors contrat et vérifiez le diagnostic du compilateur.'),
    d('{ "compilerOptions": { "strict": true, "noUncheckedIndexedAccess": true } }', 'Une lecture de tableau potentiellement absente est signalée.', 'Lisez items[0] sans vérifier la longueur et corrigez avec un vrai traitement du vide.')
  ],
  react: [
    d('function Carte({ titre }) { return <article><h2>{titre}</h2></article>; }', 'Deux cartes affichent des titres différents avec le même composant.', 'Omettez titre et décidez quelle valeur de repli est acceptable.'),
    d('function Compteur() { const [n, setN] = React.useState(0); return <button onClick={() => setN(v => v + 1)}>{n}</button>; }', 'Deux clics affichent 2 sans mutation directe.', 'Remplacez setN par n++ et observez le rendu.'),
    d('{livres.map(livre => <li key={livre.id}>{livre.titre}</li>)}', 'La liste garde des clés stables lorsque son ordre change.', 'Utilisez l’index comme clé puis réordonnez des éléments avec un état local.'),
    d('function Champ() { const [nom,setNom] = React.useState(""); return <label>Nom <input value={nom} onChange={e => setNom(e.target.value)} /></label>; }', 'La valeur affichée et l’état restent synchronisés après saisie.', 'Retirez onChange : le champ devient non modifiable.'),
    d('React.useEffect(() => { const f = () => console.log(innerWidth); addEventListener("resize", f); return () => removeEventListener("resize", f); }, []);', 'Le composant n’accumule pas d’écouteurs après montage/démontage.', 'Retirez le nettoyage puis remontez plusieurs fois.'),
    d('function useRecherche() { const [q,setQ] = React.useState(""); return {q,setQ}; }', 'Deux composants peuvent réutiliser la logique sans partager involontairement leur état.', 'Supposez que les appels partagent q : testez et corrigez votre modèle mental.'),
    d('async function charger() { const r = await fetch("/api/livres"); if (!r.ok) throw new Error("Chargement impossible"); return r.json(); }', 'L’interface distingue attente, réussite, liste vide et erreur.', 'Simulez un statut 500 et assurez-vous que le spinner s’arrête.'),
    d('<button type="button" aria-pressed={actif} onClick={basculer}>{actif ? "Retirer" : "Ajouter"}</button>', 'Le bouton est utilisable au clavier et son état annoncé rejoint son texte.', 'Remplacez button par div et listez le comportement perdu.')
  ],
  nextjs: [
    d('app/livres/[id]/page.tsx\n// Lire params.id et gérer la ressource absente.', 'Une URL /livres/42 affiche 42 ; une ressource inconnue reçoit un état absent.', 'Oubliez le cas inconnu et observez une page de succès vide.'),
    d('app/layout.tsx\napp/livres/page.tsx\napp/livres/[id]/page.tsx', 'Le layout commun reste partagé pendant la navigation.', 'Déplacez le contenu propre à un livre dans le layout et observez le couplage.'),
    d('async function lireLivres() { const r = await fetch("https://exemple.test/api/livres"); if (!r.ok) throw new Error("API"); return r.json(); }', 'Les données publiques sont lues côté serveur et une erreur est traitée.', 'Placez une clé serveur dans un composant client et identifiez la fuite.'),
    d('export const metadata = { title: "Livres | Bibliothèque", description: "Découvrir les livres" };', 'Le titre de l’onglet et la description correspondent à la page.', 'Copiez la même metadata sur toutes les routes et repérez la confusion au partage.'),
    d('<form action={ajouterLivre}><label>Titre <input name="titre" required /></label><button>Ajouter</button></form>', 'La soumission a un chemin serveur validé et un retour compréhensible.', 'Contournez required et vérifiez que le serveur refuse encore un titre vide.'),
    d('<Image src="/couverture.png" width={320} height={480} alt="Couverture du livre" />', 'L’image réserve son espace et son alt transmet l’information utile.', 'Retirez width/height ou donnez un alt générique et observez l’effet.'),
    d('app/livres/loading.tsx\n// Ajouter un état temporaire lisible.', 'La personne sait que la page charge, puis voit un résultat ou une erreur.', 'Faites échouer la lecture et vérifiez que le chargement ne reste pas infini.'),
    d('app/livres/[id]/not-found.tsx\n// Expliquer qu’aucun livre ne correspond.', 'Une ressource absente produit une page explicite plutôt qu’une fiche vide.', 'Renvoyez null silencieusement et comparez l’expérience.')
  ],
  vue: [
    d('<script setup>defineProps({ titre: String }); const emit = defineEmits(["ouvrir"]);</script>\n<template><button @click="emit(\'ouvrir\')">{{ titre }}</button></template>', 'Le parent reçoit l’action de l’enfant sans mutation de prop.', 'Essayez de modifier titre dans l’enfant et lisez l’avertissement.'),
    d('<script setup>const emit = defineEmits(["choisir"]);</script>\n<template><button @click="emit(\'choisir\', 42)">Choisir</button></template>', 'L’événement transporte l’id utile au parent.', 'Émettez une chaîne au lieu de l’id attendu et observez le contrat.'),
    d('<script setup>import { ref } from "vue"; const elements = ref(["A", "B"]);</script>\n<template><li v-for="x in elements" :key="x">{{ x }}</li></template>', 'Ajouter un élément met à jour la liste avec une clé stable.', 'Utilisez une clé dupliquée puis réordonnez la liste.'),
    d('const visible = computed(() => livres.value.filter(x => x.titre.includes(terme.value)));', 'Le filtrage suit automatiquement le terme et les livres.', 'Maintenez une seconde copie mutable de visible et provoquez un décalage.'),
    d('watch(terme, (valeur) => history.replaceState(null, "", `?q=${encodeURIComponent(valeur)}`));', 'L’URL suit le terme sans modifier la liste de données.', 'Oubliez encodeURIComponent et testez un terme avec &.'),
    d('export function useCompteur() { const n = ref(0); const augmenter = () => n.value++; return { n, augmenter }; }', 'Deux composants obtiennent chacun leur compteur indépendant.', 'Placez n hors de la fonction puis comparez le partage d’état.'),
    d('<form @submit.prevent="envoyer"><label>Nom <input v-model="nom" required></label><button>Envoyer</button></form>', 'Le nom saisi est lu et validé avant transmission.', 'Contournez required et vérifiez la validation dans envoyer.'),
    d('<Transition name="fondu"><p v-if="visible">Message</p></Transition>', 'Le message entre et sort sans empêcher la lecture au clavier.', 'Activez une préférence de mouvement réduit et vérifiez une variante adaptée.')
  ],
  angular: [
    d('@Component({selector:"app-carte", standalone:true, template:`<h2>{{ titre }}</h2>`}) export class Carte { titre = "Web"; }', 'Le composant affiche son titre sans dépendance globale cachée.', 'Retirez standalone et vérifiez la configuration requise dans ce projet.'),
    d('titre = input.required<string>();', 'Le parent fournit un titre de type texte et le composant le lit.', 'Omettez le titre dans le parent et observez le diagnostic.'),
    d('choisir = output<number>();\n// Au clic : this.choisir.emit(42);', 'Le parent reçoit l’identifiant 42 sans que l’enfant connaisse la navigation.', 'Émettez une chaîne et comparez le contrat typé.'),
    d('@Injectable({providedIn:"root"}) export class LivresService { tous() { return [{id:1,titre:"Web"}]; } }', 'Deux composants peuvent dépendre d’un même service explicitement.', 'Copiez l’accès aux données dans chaque composant puis comparez la maintenance.'),
    d('form = new FormGroup({ email: new FormControl("", { nonNullable:true, validators:[Validators.required,Validators.email] }) });', 'Un courriel vide ou mal formé empêche une soumission valide.', 'Contournez le formulaire client et décrivez la vérification serveur.'),
    d('export const peutOuvrir = () => Boolean(sessionStorage.getItem("demo"));', 'Une navigation non autorisée est refusée dans l’interface.', 'Supprimez le guard et expliquez pourquoi le serveur doit rester l’autorité.'),
    d('@Pipe({name:"titreCourt",standalone:true}) export class TitreCourtPipe { transform(v:string) { return v.slice(0,40); } }', 'Un titre long est raccourci sans modifier la donnée source.', 'Passez une valeur absente et définissez le contrat du pipe.'),
    d('const fauxService = { tous: () => [{id:1,titre:"Test"}] };\n// Injecter ce faux dans le test du composant.', 'Le composant affiche Test sans appeler l’API réelle.', 'Faites renvoyer une erreur au faux service et testez l’état d’échec.')
  ],
  'css-outils': [
    d('<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><article>Un</article><article>Deux</article></div>', 'Les cartes passent de une à deux colonnes sans modifier leur ordre de lecture.', 'Retirez la variante md et observez le comportement sur grand écran.'),
    d('<article class="rounded-lg border p-4 focus-within:ring-2"><h2>Carte</h2><a href="#suite">Suite</a></article>', 'La carte et son lien gardent un focus visible.', 'Retirez focus-within et vérifiez le repère clavier.'),
    d('<div data-bs-theme="dark"><button class="btn btn-primary">Continuer</button></div>', 'Le composant Bootstrap reste lisible dans un thème sombre sans perdre son rôle de bouton.', 'Changez seulement le fond, pas le contraste du texte, et vérifiez la lisibilité.'),
    d('<div class="p-4 md:p-8"><h2 class="text-lg md:text-2xl">Titre</h2></div>', 'Espacement et titre s’adaptent sans perdre le sens du HTML.', 'Ajoutez trop de variantes contradictoires et identifiez la règle réellement active.'),
    d('<button class="focus-visible:outline focus-visible:outline-2">Continuer</button>', 'Tab rend le focus visible et le bouton reste activable.', 'Remplacez par une div stylée et listez les comportements perdus.'),
    d('<div class="space-y-4"><p class="p-4">Bloc A</p><p class="p-4">Bloc B</p></div>', 'Les espacements entre blocs et à l’intérieur des blocs suivent deux règles cohérentes.', 'Remplacez un seul p-4 par une valeur arbitraire et comparez la cohérence.'),
    d('<article class="p-4 carte-projet"><h2>Mixte</h2></article>\n<style>.carte-projet { max-width: 40rem; }</style>', 'Les utilitaires gèrent l’espacement et une règle locale la contrainte propre au composant.', 'Dupliquez max-width dans plusieurs classes et observez la maintenance.'),
    d('.ancienne-carte { padding: 1rem; border-radius: .5rem; }\n<!-- Migrer une règle à la fois vers des utilitaires équivalents. -->', 'Après migration, largeur, focus et contraste restent équivalents.', 'Supprimez l’ancienne règle avant de vérifier tous les états.')
  ]
};
