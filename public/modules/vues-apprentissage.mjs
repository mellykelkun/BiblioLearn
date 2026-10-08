import { echapperHTML as e } from './texte.mjs';
import { statut } from './entrainement.mjs';
import { creerSection } from './contenu.mjs';
export const MATURITE = { draft: 'Notice à approfondir', structured: 'Explication structurée · non relue', enriched: 'Explication enrichie · non relue', reviewed: 'Revue éditoriale', verified: 'Contenu vérifié' };
const profils = [
  ['Je n’ai jamais codé', 'Comprendre les fichiers, les programmes et le Web.', 'parcours/zero'],
  ['Je connais quelques bases', 'Relier vos acquis et construire une page interactive.', 'parcours/fondations'],
  ['Je reprends mes fondamentaux', 'Revoir ce qui vous manque, à votre rythme.', 'parcours/fondations'],
  ['Je cherche une notion précise', 'Retrouver une définition, une syntaxe ou une source.', 'bibliotheque'],
  ['Je veux m’entraîner', 'Essayer, diagnostiquer et construire.', 'ateliers'],
  ['Je vise le frontend', 'Construire la partie visible et interactive d’un site.', 'parcours/frontend'],
  ['Je vise le backend', 'Traiter les demandes et les données côté serveur.', 'parcours/backend'],
  ['Je vise le full-stack', 'Relier interface et serveur dans un même projet.', 'parcours/fullstack'],
  ['Je veux apprendre Python', 'De la première variable aux données et aux tests.', 'parcours/python'],
  ['Je veux apprendre Java et Spring', 'Compiler, modéliser, puis construire une API.', 'parcours/java'],
  ['Je veux apprendre PHP', 'Traiter un formulaire puis stocker les données avec PDO.', 'parcours/php'],
  ['Je veux comprendre SQL', 'Lire, relier et protéger les données d’une application.', 'parcours/sql'],
  ['Je veux apprendre C# ou C++', 'Comprendre les types, les ressources et les erreurs.', 'parcours/csharp'],
  ['Je veux apprendre Vue ou Angular', 'Choisir une approche de composants et la pratiquer.', 'parcours/vue'],
  ['Je veux comprendre les systèmes / DevOps', 'Exécuter, diagnostiquer et rendre les installations reproductibles.', 'parcours/systemes'],
  ['Je suis déjà développeur', 'Aller directement à la référence technique.', 'bibliotheque']
];
export function creerVues({ etat, elements, progression, obtenirFiche, filAriane, carteDomaine }) {
  const afficher = html => { elements.contenu.innerHTML = html; };
  const boutonFiche = f => `<a class="learning-row" href="#/fiche/${e(f.id)}"><span><strong>${e(f.titre)}</strong><small>${e(f.resume)}</small></span>${statut(progression, f.id)}</a>`;
  const sources = liens => `<section class="doc-section"><h2>Vérifier à la source</h2><div class="official-links">${(liens || []).map(l => `<a class="official-link" href="${e(l.url)}" target="_blank" rel="noreferrer">${e(l.label)}</a>`).join('')}</div></section>`;
  function graphe(fiche) {
    const prerequis = (fiche.prerequis || []).map(obtenirFiche).filter(Boolean);
    if (!prerequis.length) return fiche.niveauPedagogique === 0 ? '<p class="aide">Aucun prérequis : vous pouvez commencer ici.</p>' : '';
    const manque = prerequis.filter(f => !progression.auMoins(f.id, 'compris'));
    return `<section class="prerequis"><h2>Avant de commencer</h2><p>${manque.length ? 'Ces repères peuvent vous aider. Vous pouvez poursuivre la lecture librement.' : 'Vous avez déjà déclaré comprendre ces repères.'}</p><ul>${prerequis.map(f => `<li><a href="#/fiche/${e(f.id)}">${e(f.titre)}</a> · ${progression.auMoins(f.id, 'compris') ? 'déjà abordé' : 'à connaître'}</li>`).join('')}</ul></section>`;
  }
  function vocabulaire(fiche) {
    return fiche.termesNouveaux?.length ? `<details class="vocabulaire" open><summary>Comprendre les mots nouveaux</summary><dl>${fiche.termesNouveaux.map(t => `<dt>${e(t.terme)}</dt><dd>${e(t.definition)}</dd>`).join('')}</dl></details>` : '';
  }
  function accueil() {
    filAriane([{ label: 'Accueil' }]);
    const dernier = obtenirFiche(progression.donnees.derniereNotion);
    const zero = obtenirFiche('zero-ordinateur');
    const cible = dernier || zero;
    afficher(`<header class="home-intro"><span class="eyebrow">Apprendre le développement, une idée à la fois</span>
      <h1 class="page-title">${dernier ? 'Reprendre le fil.' : 'Commencer par comprendre.'}</h1>
      <p class="page-intro">${dernier ? 'Retrouvez votre dernière leçon, puis vérifiez ce que vous avez retenu.' : 'Un fichier, un programme, une page web : prenez vos premiers repères, même si vous n’avez jamais codé.'}</p>
    </header>
    <section class="continue-learning" aria-labelledby="continuer-titre"><div><span class="eyebrow">${dernier ? 'Votre dernière leçon' : 'Votre première étape · 15 min'}</span><h2 id="continuer-titre">${e(cible.titre)}</h2><p>${e(cible.resume)}</p></div><a class="primary-button" href="#/fiche/${e(cible.id)}">${dernier ? 'Continuer la leçon' : 'Commencer depuis zéro'}</a></section>
    <div class="home-shortcuts"><a href="#/parcours/zero">Voir le parcours depuis zéro</a><a href="#/parcours">Choisir mon parcours</a>${progression.aReviser().length ? `<a href="#/revoir">${progression.aReviser().length} rappel(s) à faire</a>` : ''}</div>
    <section class="home-reference"><h2>Retrouver une notion</h2><button class="home-search" data-action="recherche"><span aria-hidden="true">⌕</span><span>Un mot, une syntaxe, un message d’erreur…</span><kbd>Ctrl K</kbd></button><p class="aide">Essayez « map », « fichier » ou « TypeError ». Les résultats précisent leur contexte et leur état de rédaction.</p></section>
    <section class="mode-links"><div><h2>Passer à la pratique</h2><p>Résoudre un petit problème, réparer un bug ou réunir plusieurs notions.</p><a href="#/ateliers">Choisir un entraînement</a></div><div><h2>Débloquer une erreur</h2><p>Partir du message observé pour tester une cause à la fois.</p><a href="#/erreurs">Chercher un diagnostic</a></div></section>
    <details class="profile-picker"><summary>Trouver un point de départ adapté à mon expérience</summary><div class="profile-list">${profils.map(([titre, description, route]) => `<a href="#/${route}"><strong>${e(titre)}</strong><span>${e(description)}</span></a>`).join('')}</div></details>
    <details class="domain-explorer"><summary>Explorer les domaines</summary><div class="domain-grid">${etat.documentation.domaines.map(carteDomaine).join('')}</div></details>
    <section class="offline-tools"><h2>Apprendre sans connexion</h2><p>Les leçons consultées sont conservées sur cet appareil quand son navigateur le permet. Vous pouvez aussi télécharger la bibliothèque complète.</p><button class="secondary-button" data-action="telecharger">Télécharger pour lire hors ligne</button><p id="telechargement-statut" role="status"></p></section>`);
  }
  function parcours(id) {
    filAriane([{ label: 'Accueil', route: 'accueil' }, { label: 'Apprendre', route: 'parcours' }]);
    const p = etat.documentation.parcours.find(p => p.id === id);
    if (!p) {
      const familles = [...new Set(etat.documentation.parcours.map(p => p.famille || 'Autres parcours'))];
      afficher(`<header class="listing-header"><span class="eyebrow">Apprendre</span><h1 class="page-title">Choisir ce que vous voulez savoir faire</h1><p class="page-intro">Commencez avec votre expérience actuelle. Chaque parcours indique une capacité observable, sans promettre un niveau professionnel après quelques lectures.</p></header>
        ${familles.map(famille => `<section class="path-group"><h2>${e(famille)}</h2><div class="profile-list">${etat.documentation.parcours.filter(p => (p.famille || 'Autres parcours') === famille).map(p => `<a href="#/parcours/${e(p.id)}"><span class="eyebrow">${e(p.niveau)}</span><strong>${e(p.titre)}</strong><span>${e(p.competence)}</span></a>`).join('')}</div></section>`).join('')}
        <section class="doc-section"><h2>Reconnaître une compétence acquise</h2><dl class="competence-levels">${etat.documentation.niveaux.map(n => `<dt>${e(n.titre)}</dt><dd>${e(n.competence)}</dd>`).join('')}</dl><p>Ces repères servent à choisir des exercices. Ils ne constituent ni diplôme ni certification.</p></section>`); return;
    }
    const ids = p.etapes.flatMap(et => et.fiches);
    const compris = ids.filter(id => progression.auMoins(id, 'compris')).length;
    const verifies = ids.filter(id => progression.auMoins(id, 'verifie')).length;
    afficher(`<header class="listing-header"><span class="eyebrow">Apprendre · ${e(p.niveau)}</span><h1 class="page-title">${e(p.titre)}</h1><p class="page-intro">${e(p.competence)}</p><label class="progress-label" for="progression-parcours">${compris} notions abordées sur ${ids.length} · ${verifies} vérifiées par questionnaire</label><progress id="progression-parcours" value="${compris}" max="${ids.length}">${compris}/${ids.length}</progress><p class="aide">« Compris » est votre déclaration. Pratique, vérification et rappels sont conservés séparément.</p></header>
      ${p.etapes.map((et, i) => `<section class="path-stage"><span class="eyebrow">Étape ${i + 1}</span><h2>${e(et.titre)}</h2><p>${e(et.description)}</p>${et.preuve ? `<p class="path-stage__proof"><strong>Pour passer à la suite :</strong> ${e(et.preuve)}</p>` : ''}${et.fiches.map(obtenirFiche).filter(Boolean).map(boutonFiche).join('')}</section>`).join('')}
      ${p.suite && etat.documentation.parcours.some(s => s.id === p.suite) ? `<section class="doc-section"><h2>Après ce parcours</h2><p>Continuez quand vous pouvez montrer les résultats des étapes précédentes.</p><a class="learning-row" href="#/parcours/${e(p.suite)}"><span><strong>${e(etat.documentation.parcours.find(s => s.id === p.suite).titre)}</strong><small>${e(etat.documentation.parcours.find(s => s.id === p.suite).competence)}</small></span><span aria-hidden="true">→</span></a></section>` : ''}`);
  }
  function reference(entree) {
    filAriane([{ label: 'Accueil', route: 'accueil' }, { label: 'Référence', route: 'bibliotheque' }, { label: entree.terme }]);
    const notice = entree.maturiteEditoriale === 'draft';
    const liste = (titre, valeurs) => valeurs?.length ? `<section class="doc-section"><h2>${titre}</h2><ul>${valeurs.map(v => `<li>${e(v)}</li>`).join('')}</ul></section>` : '';
    afficher(`<header class="article-header"><span class="eyebrow">Référence · ${e(entree.categorie)}</span><h1>${e(entree.terme)}</h1><p class="editorial-status">${e(MATURITE[entree.maturiteEditoriale])}</p>${notice ? '' : `<p class="article-header__summary">${e(entree.definition)}</p>`}</header>
      <article class="reference-readable">${notice ? `<div class="callout callout--attention"><h2>Consulter la source en attendant l’explication</h2><p>Cette notion est répertoriée, mais son explication Bibliolearn reste à rédiger. Aucun exemple généré n’est présenté comme une syntaxe validée.</p></div>${entree.source?.id ? `<p>Pour retrouver son contexte : <a href="#/fiche/${e(entree.source.id)}">${e(entree.source.fiche)}</a>.</p>` : ''}` : `
      ${entree.signature ? creerSection({ type: 'code', titre: 'Signature ou forme', langage: entree.langageSignature || 'Syntaxe', contenu: entree.signature }, 'signature') + `<dl class="competence-levels">${entree.parametres ? `<dt>Paramètres</dt><dd>${e(entree.parametres)}</dd>` : ''}${entree.retour ? `<dt>Résultat</dt><dd>${e(entree.retour)}</dd>` : ''}</dl>` : ''}${graphe(entree)}${vocabulaire(entree)}
      ${entree.exemples?.length ? `<section class="doc-section"><h2>Utiliser la syntaxe</h2>${entree.exemples.map((ex, i) => creerSection({ type: 'code', titre: ex.titre, langage: ex.langage, contenu: ex.contenu, legende: ex.explication }, 'reference-' + i)).join('')}</section>` : ''}
      ${liste('Choisir cet outil', entree.pourquoiUtiliser)}${liste('Choisir une autre solution', entree.nePasUtiliser)}
      ${entree.article?.length ? `<details class="depth-details"><summary>Comprendre le fonctionnement</summary>${entree.article.map(t => `<p>${e(t)}</p>`).join('')}</details>` : ''}
      ${liste('Diagnostiquer et éviter les pièges', entree.avertissements)}
      ${entree.scenarios?.length ? `<details class="depth-details"><summary>Décider dans un projet</summary>${entree.scenarios.map(s => `<h3>${e(s.cas)}</h3><p>${e(s.decision)} ${e(s.pourquoi)}</p><p>${e(s.application)}</p>`).join('')}</details>` : ''}
      ${entree.typesDonnees?.length ? `<details class="depth-details"><summary>Suivre les données et leurs types</summary>${liste('Données manipulées', entree.typesDonnees)}<p>${e(entree.cycleDonnees)}</p>${liste('Organiser le code', entree.structure)}</details>` : ''}
      ${entree.exercice?.etapes?.length ? `<details class="depth-details"><summary>Pratiquer cette notion</summary><h2>${e(entree.exercice.objectif)}</h2><p>${e(entree.exercice.contexte)}</p><ol>${entree.exercice.etapes.map(t => `<li>${e(t)}</li>`).join('')}</ol>${liste('Vérifier le résultat', entree.exercice.validation)}</details>` : ''}`}
      ${sources(entree.sources)}${entree.associes?.length ? `<section class="doc-section"><h2>Poursuivre la recherche</h2>${entree.associes.map(id => etat.documentation.bibliotheque.find(e => e.id === id)).filter(Boolean).map(r => `<p><a href="#/terme/${e(r.id)}">${e(r.terme)}</a></p>`).join('')}</section>` : ''}</article>`);
  }
  function revisions() {
    const dus = progression.aReviser();
    const ids = [...new Set([...dus, ...etat.stockage.revoir])];
    filAriane([{ label: 'Accueil', route: 'accueil' }, { label: 'Réviser' }]);
    afficher(`<header class="listing-header"><span class="eyebrow">S’entraîner · mémoire</span><h1 class="page-title">Retrouver une idée sans la relire</h1><p class="page-intro">Répondez de mémoire avant d’ouvrir la correction. Après une réussite, les rappels s’espacent ; après une erreur, reprenez demain.</p></header>
      <section><h2>${dus.length ? 'Rappels arrivés à échéance' : 'Vos notions à reprendre'}</h2>${ids.map(obtenirFiche).filter(Boolean).map(boutonFiche).join('') || '<p>Aucun rappel prévu aujourd’hui. Une évaluation crée votre prochain rendez-vous.</p><a class="primary-button" href="#/parcours/zero">Commencer une leçon</a>'}</section>`);
  }
  function contenus(type, id) {
    const collection = type === 'erreur' ? etat.documentation.erreurs : etat.documentation.projets;
    const element = collection.find(el => el.id === id);
    const titre = type === 'erreur' ? 'Diagnostiquer à partir du message' : 'Réunir ses compétences dans un projet';
    filAriane([{ label: 'Accueil', route: 'accueil' }, { label: type === 'erreur' ? 'Erreurs' : 'Projets' }]);
    if (!id) {
      afficher(`<header class="listing-header"><span class="eyebrow">${type === 'erreur' ? 'Référence · diagnostic' : 'S’entraîner · projets'}</span><h1 class="page-title">${titre}</h1><p class="page-intro">${type === 'erreur' ? 'Identifiez le symptôme, testez une cause et vérifiez la correction.' : 'Partez d’un besoin et justifiez vos décisions. Les critères décrivent le résultat à atteindre.'}</p></header>${collection.map(el => `<a class="learning-row" href="#/${type}/${e(el.id)}"><span><strong>${e(el.titre)}</strong><small>${e(el.resume)}</small></span><span>${e(el.format || el.categorie || '')}</span></a>`).join('')}`); return;
    }
    if (!element) { afficher('<h1>Contenu introuvable</h1>'); return; }
    afficher(`<header class="article-header"><span class="eyebrow">${e(element.format || element.categorie)}</span><h1>${e(element.titre)}</h1><p class="article-header__summary">${e(element.resume)}</p></header><article class="reference-readable">${graphe(element)}${element.sections.map(creerSection).join('')}${sources(element.sources)}</article>`);
  }
  return { accueil, parcours, reference, revisions, graphe, vocabulaire, contenus };
}
