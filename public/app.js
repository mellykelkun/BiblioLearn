'use strict';

const elements = {
  contenu: document.querySelector('#contenu'),
  navigation: document.querySelector('#navigation-domaines'),
  filAriane: document.querySelector('#fil-ariane'),
  sidebar: document.querySelector('#sidebar'),
  overlay: document.querySelector('#sidebar-overlay'),
  ouvrirMenu: document.querySelector('#ouvrir-menu'),
  fermerMenu: document.querySelector('#fermer-menu'),
  ouvrirRecherche: document.querySelector('#ouvrir-recherche'),
  fermerRecherche: document.querySelector('#fermer-recherche'),
  dialogueRecherche: document.querySelector('#dialogue-recherche'),
  champRecherche: document.querySelector('#champ-recherche'),
  resultatsRecherche: document.querySelector('#resultats-recherche'),
  metaRecherche: document.querySelector('#meta-recherche'),
  compteurSidebar: document.querySelector('#compteur-sidebar'),
  compteurRevoir: document.querySelector('#compteur-revoir'),
  actionRevoir: document.querySelector('#action-revoir'),
  actionInstaller: document.querySelector('#action-installer'),
  actionPartager: document.querySelector('#action-partager'),
  propositionInstallation: document.querySelector('#installation-proposition'),
  dialogueInstallation: document.querySelector('#dialogue-installation'),
  fermerInstallation: document.querySelector('#fermer-installation'),
  toast: document.querySelector('#toast')
};

let inviteInstallation = null;

const etat = {
  documentation: null,
  domaineActif: null,
  ficheActive: null,
  bibliothequeRecherche: '',
  bibliothequeCategorie: 'Toutes',
  bibliothequeLimite: 60,
  resultatActif: 0,
  stockage: chargerStockage()
};

const clesStockage = {
  recent: 'bibliolearn.recent',
  revoir: 'bibliolearn.revoir',
  lues: 'bibliolearn.lues',
  ateliers: 'bibliolearn.ateliers'
};

const parcoursDebutant = [
  { titre: '1. Construire une page', description: 'Comprendre le document avant de le styliser.', fiches: ['html-document', 'html-texte-listes', 'html-attributs', 'html-liens-images', 'html-semantique', 'html-formulaires'] },
  { titre: '2. Mettre en forme', description: 'Modifier un style, comprendre les dimensions, puis organiser les éléments.', fiches: ['css-selecteurs', 'css-box-model', 'css-typographie', 'css-flexbox', 'css-grid', 'css-responsive'] },
  { titre: '3. Donner un comportement', description: 'Manipuler des valeurs, écrire une logique, puis relier cette logique à la page.', fiches: ['js-variables', 'js-types', 'js-egalite', 'js-conditions', 'js-fonctions', 'js-tableaux', 'js-boucles', 'dom-selection', 'dom-modification', 'dom-evenements', 'dom-formulaires'] },
  { titre: '4. Échanger des données', description: 'Comprendre le réseau avant de construire une API.', fiches: ['js-json', 'js-erreurs', 'js-promises', 'http-requete-reponse', 'http-methodes', 'http-status', 'js-fetch', 'node-runtime', 'npm-package-json', 'express-demarrage', 'express-routes', 'express-donnees'] }
];
const idsParcoursDebutant = parcoursDebutant.flatMap((etape) => etape.fiches);

function chargerValeur(cle, valeurParDefaut) {
  try {
    const valeur = localStorage.getItem(cle);
    return valeur ? JSON.parse(valeur) : valeurParDefaut;
  } catch {
    return valeurParDefaut;
  }
}

function chargerStockage() {
  return {
    recent: chargerValeur('bibliolearn.recent', []),
    revoir: chargerValeur('bibliolearn.revoir', []),
    lues: chargerValeur('bibliolearn.lues', []),
    ateliers: chargerValeur('bibliolearn.ateliers', [])
  };
}

function sauvegarder(cle, valeur) {
  etat.stockage[cle] = valeur;
  try {
    localStorage.setItem(clesStockage[cle], JSON.stringify(valeur));
  } catch {
    afficherToast('Le stockage local n’est pas disponible');
  }
  actualiserCompteurs();
}

async function chargerDocumentation() {
  try {
    let reponse = await fetch('/api/documentation');
    if (!reponse.ok) throw new Error(`Réponse HTTP ${reponse.status}`);
    try {
      etat.documentation = await reponse.json();
    } catch {
      reponse = await fetch('/documentation.json');
      if (!reponse.ok) throw new Error(`Catalogue statique HTTP ${reponse.status}`);
      etat.documentation = await reponse.json();
    }
    nettoyerStockage();
    construireNavigation();
    actualiserCompteurs();
    router();
  } catch (erreur) {
    try {
      const reponseStatique = await fetch('/documentation.json');
      if (!reponseStatique.ok) throw new Error(`Catalogue statique HTTP ${reponseStatique.status}`);
      etat.documentation = await reponseStatique.json();
      nettoyerStockage();
      construireNavigation();
      actualiserCompteurs();
      router();
    } catch (erreurStatique) {
      elements.contenu.innerHTML = `
        <section class="error-state">
          <span class="loading-state__mark">!/</span>
          <h1>La bibliothèque n’a pas pu être chargée</h1>
          <p>${echapperHTML(erreurStatique.message || erreur.message)}</p>
        </section>`;
    }
  }
}

function nettoyerStockage() {
  const ids = new Set(etat.documentation.fiches.map((fiche) => fiche.id));
  etat.stockage.recent = etat.stockage.recent
    .map((element) => typeof element === 'string' ? { id: element, date: Date.now() } : element)
    .filter((element) => ids.has(element.id))
    .slice(0, 8);
  etat.stockage.revoir = etat.stockage.revoir.filter((id) => ids.has(id));
  etat.stockage.lues = etat.stockage.lues.filter((id) => ids.has(id));
  const ateliers = new Set(etat.documentation.ateliers.map((atelier) => atelier.id));
  etat.stockage.ateliers = etat.stockage.ateliers.filter((id) => ateliers.has(id));
}

function construireNavigation() {
  const groupes = regrouper(etat.documentation.domaines, 'groupe');
  elements.navigation.innerHTML = Object.entries(groupes).map(([nomGroupe, domaines]) => `
    <section class="nav-group">
      <p class="nav-group-label">${echapperHTML(nomGroupe)}</p>
      ${domaines.map((domaine) => creerBoutonDomaine(domaine)).join('')}
    </section>`).join('');
}

function creerBoutonDomaine(domaine) {
  const fiches = obtenirFichesDomaine(domaine.id);
  const actif = etat.domaineActif === domaine.id;
  const categories = [...new Set(fiches.map((fiche) => fiche.categorie))];
  return `
    <button class="domain-button ${actif ? 'is-active' : ''}" type="button" data-domaine="${domaine.id}">
      <span class="domain-button__icon">${echapperHTML(domaine.icone)}</span>
      <span>${echapperHTML(domaine.nom)}</span>
      <small>${fiches.length}</small>
    </button>
    ${actif ? `<div class="category-list">${categories.map((categorie) => `
      <button class="category-button" type="button" data-route="domaine/${domaine.id}" data-categorie="${echapperAttribut(categorie)}">${echapperHTML(categorie)}</button>
    `).join('')}</div>` : ''}`;
}

function actualiserNavigation() {
  construireNavigation();
  document.querySelectorAll('.nav-primary').forEach((bouton) => {
    const route = bouton.dataset.route;
    const actif = (!etat.domaineActif && !etat.ficheActive && (route === routeCourante() || (route === 'ateliers' && routeCourante() === 'atelier') || (route === 'bibliotheque' && routeCourante() === 'terme'))) ||
      (route === 'parcours' && routeCourante() === 'revoir');
    bouton.classList.toggle('is-active', actif);
  });
}

function actualiserCompteurs() {
  if (!etat.documentation) return;
  elements.compteurSidebar.textContent = `${etat.documentation.statistiques.nombreFiches} fiches · ${etat.documentation.statistiques.nombreBibliotheque || 0} références`;
  elements.compteurRevoir.textContent = etat.stockage.revoir.length;
}

function router() {
  if (!etat.documentation) return;
  const fragments = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [route = 'accueil', parametre] = fragments;

  etat.ficheActive = null;
  etat.domaineActif = null;

  if (route === 'fiche' && parametre) {
    afficherFiche(parametre);
  } else if (route === 'terme' && parametre) {
    afficherTermeBibliotheque(parametre);
  } else if (route === 'atelier' && parametre) {
    afficherAtelier(parametre);
  } else if (route === 'domaine' && parametre) {
    afficherDomaine(parametre);
  } else if (route === 'bibliotheque') {
    afficherBibliotheque();
  } else if (route === 'ateliers') {
    afficherAteliers();
  } else if (route === 'parcours') {
    afficherParcours();
  } else if (route === 'revoir') {
    afficherListeARevoir();
  } else {
    afficherAccueil();
  }

  actualiserNavigation();
  fermerMenuMobile();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function naviguer(destination) {
  const nouvelleRoute = `#/${destination}`;
  if (window.location.hash === nouvelleRoute) {
    router();
  } else {
    window.location.hash = nouvelleRoute;
  }
}

function routeCourante() {
  return window.location.hash.replace(/^#\/?/, '').split('/')[0] || 'accueil';
}

function afficherAccueil() {
  definirFilAriane([{ label: 'Bibliothèque' }, { label: 'Vue d’ensemble' }]);
  const recentes = obtenirFichesRecentes();
  const aRevoir = etat.stockage.revoir.map(obtenirFiche).filter(Boolean).slice(0, 4);
  const essentielles = ['html-document', 'html-texte-listes', 'css-selecteurs', 'js-variables']
    .map(obtenirFiche).filter(Boolean);

  elements.contenu.innerHTML = `
    <section class="home-hero">
      <div class="eyebrow">Bibliothèque personnelle du développeur</div>
      <h1 class="page-title">Comprendre le Web.<br>Retrouver l’essentiel.</h1>
      <p class="page-intro">Un parcours progressif pour comprendre la syntaxe, voir ce qui se passe réellement, pratiquer puis retrouver les notions dans la référence technique.</p>
      <button class="home-search" type="button" data-action="recherche">
        <span class="home-search__icon" aria-hidden="true">⌕</span>
        <span>Rechercher une API, une syntaxe, une erreur…</span>
        <kbd>Ctrl K</kbd>
      </button>
      <div class="stats-row">
        <span><strong>${etat.documentation.statistiques.nombreFiches}</strong> fiches structurées</span>
        <span><strong>${etat.documentation.statistiques.nombreExemples}</strong> exemples de code</span>
        <span><strong>${etat.documentation.statistiques.nombreBibliotheque || 0}</strong> références techniques</span>
        <span><strong>${etat.documentation.statistiques.nombreDomaines}</strong> domaines</span>
        <span>progression privée sur cet appareil</span>
      </div>
    </section>

    <section class="dashboard-section">
      <div class="section-title-row">
        <h2>Explorer la bibliothèque</h2>
        <span>Du HTML aux frameworks frontend</span>
      </div>
      <div class="domain-grid">
        ${etat.documentation.domaines.map(creerCarteDomaine).join('')}
      </div>
    </section>

    <section class="dashboard-section library-promo">
      <div class="library-promo__copy"><div class="eyebrow">Nouvelle référence interne</div><h2>Comprendre les outils derrière le code</h2><p>${etat.documentation.statistiques.nombreBibliotheque || 0} entrées expliquent les packages, services, formats, données, structures, risques et décisions d’architecture avec un mini-atelier propre à chaque notion.</p></div>
      <button class="primary-button" type="button" data-route="bibliotheque">Ouvrir la référence technique <span aria-hidden="true">→</span></button>
    </section>

    <section class="dashboard-section share-promo">
      <div><div class="eyebrow">Apprendre ensemble</div><h2>Un ami développeur aimerait ce parcours ?</h2><p>Envoyez-lui le lien du site ou celui de la leçon que vous étudiez. Votre progression personnelle reste sur votre appareil.</p></div>
      <div class="share-promo__actions"><button class="primary-button" type="button" data-action="partager">↗ Inviter un ami</button><button class="secondary-button" type="button" data-action="installer">⊕ Installer l’application</button></div>
    </section>

    <section class="dashboard-section">
      <div class="section-title-row">
        <h2>Votre espace d’étude</h2>
        <span>Conservé uniquement dans ce navigateur</span>
      </div>
      <div class="study-grid">
        <div class="panel">
          <div class="panel__head"><h3>${recentes.length ? 'Récemment étudié' : 'Pour commencer'}</h3><span>${recentes.length || essentielles.length} notions</span></div>
          <ul class="study-list">${(recentes.length ? recentes : essentielles).map(creerElementEtude).join('')}</ul>
        </div>
        <div class="panel">
          <div class="panel__head"><h3>À revoir</h3><span>${etat.stockage.revoir.length} marquée${etat.stockage.revoir.length > 1 ? 's' : ''}</span></div>
          ${aRevoir.length ? `<ul class="study-list">${aRevoir.map(creerElementEtude).join('')}</ul>` : `
            <div class="review-empty"><span>◎</span><p>Marquez une fiche « À revoir » pour construire votre liste de révision.</p></div>`}
        </div>
      </div>
    </section>`;

  const ateliers = etat.documentation.ateliers.slice(0, 3);
  elements.contenu.innerHTML += `
    <section class="dashboard-section home-workshops">
      <div class="section-title-row"><h2>Passer de la lecture à la pratique</h2><button class="text-link" type="button" data-route="ateliers">Voir tous les ateliers →</button></div>
      <p class="section-intro">Des exercices guidés pour créer une carte, manipuler le DOM, lancer une API, utiliser npm et pratiquer le terminal.</p>
      <div class="atelier-grid atelier-grid--compact">${ateliers.map(creerCarteAtelier).join('')}</div>
    </section>`;
}

function creerCarteDomaine(domaine) {
  const total = obtenirFichesDomaine(domaine.id).length;
  return `
    <button class="domain-card" type="button" data-domaine="${domaine.id}">
      <span class="domain-card__head">
        <span class="domain-card__icon">${echapperHTML(domaine.icone)}</span>
        <span class="domain-card__count">${total} fiche${total > 1 ? 's' : ''}</span>
      </span>
      <h3>${echapperHTML(domaine.nom)}</h3>
      <p>${echapperHTML(domaine.description)}</p>
    </button>`;
}

function creerElementEtude(fiche) {
  const domaine = obtenirDomaine(fiche.domaine);
  const entreeRecente = etat.stockage.recent.find((element) => element.id === fiche.id);
  return `
    <li>
      <button class="study-item" type="button" data-fiche="${fiche.id}">
        <span class="study-item__icon">${echapperHTML(domaine?.icone || '•')}</span>
        <span><strong>${echapperHTML(fiche.titre)}</strong><small>${echapperHTML(domaine?.nom || fiche.domaine)} · ${echapperHTML(fiche.categorie)}</small></span>
        ${entreeRecente ? `<time>${formaterDateRelative(entreeRecente.date)}</time>` : '<time>ouvrir →</time>'}
      </button>
    </li>`;
}

function afficherDomaine(idDomaine) {
  const domaine = obtenirDomaine(idDomaine);
  if (!domaine) return afficherIntrouvable('Domaine introuvable');
  etat.domaineActif = idDomaine;
  const fiches = obtenirFichesDomaine(idDomaine);
  const categories = regrouper(fiches, 'categorie');
  const lues = fiches.filter((fiche) => etat.stockage.lues.includes(fiche.id)).length;

  definirFilAriane([{ label: 'Bibliothèque', route: 'accueil' }, { label: domaine.nom }]);
  elements.contenu.innerHTML = `
    <header class="domain-header">
      <div class="eyebrow">${echapperHTML(domaine.groupe)}</div>
      <h1 class="page-title">${echapperHTML(domaine.nom)}</h1>
      <p class="page-intro">${echapperHTML(domaine.description)}. Les fiches sont organisées par sujet pour servir à la fois de parcours et de référence rapide.</p>
      <div class="domain-header__meta">
        <span class="meta-pill">${fiches.length} fiches</span>
        <span class="meta-pill">${Object.keys(categories).length} catégories</span>
        <span class="meta-pill">${lues} maîtrisée${lues > 1 ? 's' : ''}</span>
      </div>
    </header>
    ${Object.entries(categories).map(([categorie, elementsCategorie]) => `
      <section class="category-section" id="${slugifier(categorie)}">
        <header class="category-section__head">
          <h2>${echapperHTML(categorie)}</h2>
          <span>${elementsCategorie.length} notion${elementsCategorie.length > 1 ? 's' : ''}</span>
        </header>
        ${elementsCategorie.map(creerLigneFiche).join('')}
      </section>`).join('')}`;
}

function afficherBibliotheque() {
  const entrees = etat.documentation.bibliotheque || [];
  const categories = [...new Set(entrees.map((entree) => entree.categorie))];
  definirFilAriane([{ label: 'Bibliothèque', route: 'accueil' }, { label: 'Référence technique' }]);
  elements.contenu.innerHTML = `
    <header class="listing-header library-header">
      <div class="eyebrow">Référence interne · code · données · infrastructure</div>
      <h1 class="page-title">Bibliothèque technique</h1>
      <p class="page-intro">Une entrée ne donne pas seulement une définition. Elle explique la fonction, le bon moment pour l’utiliser, les situations où l’éviter, les avertissements, la structure de code, le type de données manipulé et la manière de transmettre le résultat à la couche suivante.</p>
      <div class="domain-header__meta"><span class="meta-pill">${entrees.length} références</span><span class="meta-pill">${categories.length} familles</span><span class="meta-pill">code + décisions + pratique</span></div>
    </header>
    <section class="library-controls" aria-label="Filtrer la bibliothèque technique">
      <label class="library-search"><span aria-hidden="true">⌕</span><input id="filtre-bibliotheque" type="search" value="${echapperAttribut(etat.bibliothequeRecherche)}" placeholder="Rechercher div, map, Dockerfile, RLS…" aria-label="Rechercher dans la bibliothèque technique"></label>
      <div class="library-filters" role="group" aria-label="Filtrer par famille">
        <button class="filter-chip ${etat.bibliothequeCategorie === 'Toutes' ? 'is-active' : ''}" type="button" data-library-category="Toutes">Toutes</button>
        ${categories.map((categorie) => `<button class="filter-chip ${etat.bibliothequeCategorie === categorie ? 'is-active' : ''}" type="button" data-library-category="${echapperAttribut(categorie)}">${echapperHTML(categorie)}</button>`).join('')}
      </div>
    </section>
    <div class="library-grid" id="liste-bibliotheque"></div>`;
  actualiserCartesBibliotheque();
}

function actualiserCartesBibliotheque() {
  const conteneur = document.querySelector('#liste-bibliotheque');
  if (!conteneur || !etat.documentation) return;
  const recherche = normaliser(etat.bibliothequeRecherche).trim();
  const entrees = (etat.documentation.bibliotheque || []).filter((entree) => {
    const bonneCategorie = etat.bibliothequeCategorie === 'Toutes' || entree.categorie === etat.bibliothequeCategorie;
    const texte = normaliser(JSON.stringify(entree));
    return bonneCategorie && (!recherche || motsCorrespondent(texte, recherche.split(/\s+/).filter(Boolean)));
  });
  const visibles = entrees.slice(0, etat.bibliothequeLimite);
  if (!entrees.length) {
    conteneur.innerHTML = '<div class="empty-page library-empty"><span>⌕</span><h2>Aucune référence trouvée</h2><p>Essayez un nom d’outil, un format de donnée ou une famille différente.</p></div>';
    return;
  }
  const reste = entrees.length - visibles.length;
  conteneur.innerHTML = visibles.map(creerCarteBibliotheque).join('') + (reste > 0 ? `<div class="library-more"><p>${entrees.length} références correspondent à votre recherche. ${reste} restent à afficher.</p><button class="primary-button" type="button" data-library-more>Afficher 60 références supplémentaires</button></div>` : '');
}

function creerCarteBibliotheque(entree) {
  return `<button class="library-card" type="button" data-terme="${echapperAttribut(entree.id)}">
    <span class="library-card__top"><span class="article-badge">${echapperHTML(entree.famille)}</span><span class="library-card__level">${echapperHTML(entree.niveau)}</span></span>
    <h2>${echapperHTML(entree.terme)}</h2>
    <p>${echapperHTML(entree.resume)}</p>
    <span class="library-card__foot"><span>${entree.exemples.length} exemple · ${entree.exercice.duree}</span><strong>Lire la fiche →</strong></span>
  </button>`;
}

function afficherTermeBibliotheque(id) {
  const entree = obtenirEntreeBibliotheque(id);
  if (!entree) return afficherIntrouvable('Référence technique introuvable');
  const associes = entree.associes.map(obtenirEntreeBibliotheque).filter(Boolean);
  definirFilAriane([{ label: 'Bibliothèque', route: 'accueil' }, { label: 'Référence technique', route: 'bibliotheque' }, { label: entree.terme }]);
  elements.contenu.innerHTML = `
    <header class="article-header library-article-header">
      <div class="article-header__meta"><span class="article-badge">${echapperHTML(entree.categorie)}</span><span class="article-badge">${echapperHTML(entree.famille)}</span><span class="article-badge">${echapperHTML(entree.niveau)}</span></div>
      <h1>${echapperHTML(entree.terme)}</h1>
      <p class="article-header__summary">${echapperHTML(entree.resume)}</p>
      <div class="library-aliases"><span>On peut aussi dire :</span>${entree.aliases.map((alias) => `<span class="tool-chip">${echapperHTML(alias)}</span>`).join('')}</div>
    </header>
    <div class="article-layout library-layout">
      <article class="article-body">
        <div class="callout callout--retenir"><span class="callout__label">Idée simple</span><p>${echapperHTML(entree.definition)}</p></div>
        ${entree.article?.length ? `<section class="library-section" id="library-article"><h2>Article de référence</h2>${entree.article.map((paragraphe) => `<p>${echapperHTML(paragraphe)}</p>`).join('')}</section>` : ''}
        ${creerSectionBibliotheque('Rôles et responsabilités', entree.roles, 'library-section--roles')}
        ${creerSectionBibliotheque('Pourquoi l’utiliser', entree.pourquoiUtiliser, 'library-section--why')}
        ${creerSectionBibliotheque('Quand éviter ou limiter son usage', entree.nePasUtiliser, 'library-section--avoid')}
        ${creerSectionBibliotheque('Avertissements à retenir', entree.avertissements, 'library-section--warning')}
        <section class="library-section" id="library-scenarios"><h2>Scénarios et décisions</h2><p class="section-intro">Le meilleur choix dépend du niveau de risque, de la durée de vie de la donnée, du trafic et de l’équipe qui devra maintenir le code.</p><div class="table-wrap"><table class="comparison-table library-scenario-table"><thead><tr><th>Situation</th><th>Décision</th><th>Pourquoi</th></tr></thead><tbody>${entree.scenarios.map((scenario) => `<tr><td><strong>${echapperHTML(scenario.cas)}</strong><br><small>${echapperHTML(scenario.application)}</small></td><td>${echapperHTML(scenario.decision)}</td><td>${echapperHTML(scenario.pourquoi)}</td></tr>`).join('')}</tbody></table></div></section>
        <section class="library-section" id="library-data"><h2>Données et cycle de transmission</h2><div class="data-type-grid">${entree.typesDonnees.map((type) => `<span class="data-type-chip">${echapperHTML(type)}</span>`).join('')}</div><div class="callout callout--bonne-pratique"><span class="callout__label">Chemin conseillé</span><p>${echapperHTML(entree.cycleDonnees)}</p></div></section>
        <section class="library-section" id="library-structure"><h2>Place dans la structure du code</h2>${entree.structure.map((texte) => `<p>${echapperHTML(texte)}</p>`).join('')}</section>
        <section class="library-section" id="library-code"><h2>Exemple de code expliqué</h2>${entree.exemples.map(creerExempleBibliotheque).join('')}</section>
        <section class="library-section library-exercise" id="library-exercise"><div class="library-exercise__head"><div><span class="eyebrow">Mini-atelier spécifique</span><h2>${echapperHTML(entree.exercice.objectif)}</h2></div><span class="meta-pill">${echapperHTML(entree.exercice.duree)}</span></div><p>${echapperHTML(entree.exercice.contexte)}</p><ol class="step-list">${entree.exercice.etapes.map((etape, index) => `<li class="step-item"><span class="step-item__number">${index + 1}</span><span class="step-item__body"><strong>${echapperHTML(etape)}</strong></span></li>`).join('')}</ol><h3>Validation</h3><ul class="checklist">${entree.exercice.validation.map((item) => `<li>${echapperHTML(item)}</li>`).join('')}</ul></section>
      </article>
      <aside class="article-aside library-aside"><section class="aside-block"><h3>Dans cette référence</h3>${entree.article?.length ? '<button class="toc-link" type="button" data-scroll="library-article">Article de référence</button>' : ''}<button class="toc-link" type="button" data-scroll="library-scenarios">Scénarios et décisions</button><button class="toc-link" type="button" data-scroll="library-data">Données et transmission</button><button class="toc-link" type="button" data-scroll="library-structure">Structure du code</button><button class="toc-link" type="button" data-scroll="library-code">Exemple de code</button><button class="toc-link" type="button" data-scroll="library-exercise">Mini-atelier</button></section>${associes.length ? `<section class="aside-block"><h3>Entrées associées</h3>${associes.map((associe) => `<button class="related-link" type="button" data-terme="${echapperAttribut(associe.id)}">${echapperHTML(associe.terme)}</button>`).join('')}</section>` : ''}<section class="aside-block"><h3>Documentation externe</h3>${entree.liens.map((lien) => `<a class="official-link" href="${echapperAttribut(lien.url)}" target="_blank" rel="noreferrer"><span>${echapperHTML(lien.label)}</span><span aria-hidden="true">↗</span></a>`).join('')}</section></aside>
    </div>`;
}

function creerSectionBibliotheque(titre, elementsSection, classe) {
  return `<section class="library-section ${classe}"><h2>${echapperHTML(titre)}</h2><ul class="doc-list">${elementsSection.map((element) => `<li>${echapperHTML(element)}</li>`).join('')}</ul></section>`;
}

function creerExempleBibliotheque(exemple) {
  return `<div class="library-example"><div class="code-shell"><div class="code-shell__head"><span class="code-shell__language">${echapperHTML(exemple.langage)}</span><button class="copy-button" type="button" data-copy aria-label="Copier l’exemple de ${echapperAttribut(exemple.titre)}">Copier</button></div><pre><code>${echapperHTML(exemple.contenu)}</code></pre></div><p class="code-caption">${echapperHTML(exemple.explication)}</p></div>`;
}

function creerLigneFiche(fiche) {
  const estLue = etat.stockage.lues.includes(fiche.id);
  return `
    <button class="topic-row ${estLue ? 'is-read' : ''}" type="button" data-fiche="${fiche.id}">
      <span class="topic-row__dot" title="${estLue ? 'Maîtrisée' : 'Non marquée'}"></span>
      <span><h3>${echapperHTML(fiche.titre)}</h3><p>${echapperHTML(fiche.resume)}</p></span>
      <span class="topic-row__arrow">→</span>
    </button>`;
}

function afficherFiche(id) {
  const fiche = obtenirFiche(id);
  if (!fiche) return afficherIntrouvable('Fiche introuvable');
  const domaine = obtenirDomaine(fiche.domaine);
  etat.ficheActive = fiche;
  etat.domaineActif = fiche.domaine;
  enregistrerConsultation(id);

  const fichesDomaine = obtenirFichesDomaine(fiche.domaine);
  const index = fichesDomaine.findIndex((element) => element.id === id);
  const aRevoir = etat.stockage.revoir.includes(id);
  const estLue = etat.stockage.lues.includes(id);
  const associees = fiche.associes.map(obtenirFiche).filter(Boolean);
  const positionDebutant = idsParcoursDebutant.indexOf(id);
  const precedentDebutant = positionDebutant > 0 ? obtenirFiche(idsParcoursDebutant[positionDebutant - 1]) : null;
  const suivantDebutant = positionDebutant >= 0 ? obtenirFiche(idsParcoursDebutant[positionDebutant + 1]) : null;
  const precedente = positionDebutant >= 0 ? precedentDebutant : fichesDomaine[index - 1];
  const suivante = positionDebutant >= 0 ? suivantDebutant : fichesDomaine[index + 1];

  definirFilAriane([
    { label: 'Bibliothèque', route: 'accueil' },
    { label: domaine.nom, route: `domaine/${domaine.id}` },
    { label: fiche.categorie, route: `domaine/${domaine.id}`, categorie: fiche.categorie },
    { label: fiche.titre }
  ]);

  elements.contenu.innerHTML = `
    <header class="article-header">
      <div class="article-header__meta">
        <span class="article-badge">${echapperHTML(domaine.nom)}</span>
        <span class="article-badge">${echapperHTML(fiche.categorie)}</span>
        <span class="article-badge">${echapperHTML(fiche.niveau)}</span>
      </div>
      <h1>${echapperHTML(fiche.titre)}</h1>
      <p class="article-header__summary">${echapperHTML(fiche.resume)}</p>
      <div class="article-header__actions">
        <button class="secondary-button ${aRevoir ? 'is-active' : ''}" type="button" data-toggle-revoir="${fiche.id}">◎ ${aRevoir ? 'Dans À revoir' : 'Marquer à revoir'}</button>
        <button class="secondary-button ${estLue ? 'is-active' : ''}" type="button" data-toggle-lue="${fiche.id}">✓ ${estLue ? 'Maîtrisée' : 'Marquer maîtrisée'}</button>
        <button class="secondary-button" type="button" data-action="partager">↗ Partager cette leçon</button>
      </div>
    </header>

    <div class="article-layout">
      <article class="article-body">
        <div class="callout callout--retenir article-reading-guide"><span class="callout__label">Comment apprendre ici</span><p>Lisez d’abord l’idée et prédisez le résultat du code. Testez l’exemple dans votre navigateur ou terminal, faites le défi sans regarder la réponse, puis ouvrez le corrigé pour vérifier votre raisonnement.</p></div>
        ${positionDebutant >= 0 ? `<div class="learning-position"><span>Parcours débutant · étape ${positionDebutant + 1}/${idsParcoursDebutant.length}</span>${precedentDebutant ? `<button type="button" data-fiche="${precedentDebutant.id}">← Prérequis : ${echapperHTML(precedentDebutant.titre)}</button>` : ''}${suivantDebutant ? `<button type="button" data-fiche="${suivantDebutant.id}">Ensuite : ${echapperHTML(suivantDebutant.titre)} →</button>` : ''}</div>` : ''}
        ${creerPlanSessions(fiche)}
        ${fiche.sections.map((section, sectionIndex) => creerSection(section, sectionIndex)).join('')}
        <nav class="article-pagination" aria-label="Fiches précédente et suivante">
          ${precedente ? creerLienPagination(precedente, 'Précédent', '') : '<span></span>'}
          ${suivante ? creerLienPagination(suivante, 'Suivant', 'page-link--next') : ''}
        </nav>
      </article>
      <aside class="article-aside">
        <section class="aside-block">
          <h3>Dans cette fiche</h3>
          ${fiche.sections.map((section, sectionIndex) => `<button class="toc-link" type="button" data-scroll="section-${sectionIndex}">${echapperHTML(section.titre)}</button>`).join('')}
        </section>
        ${associees.length ? `<section class="aside-block"><h3>Concepts associés</h3>${associees.map((element) => `<button class="related-link" type="button" data-fiche="${element.id}">${echapperHTML(element.titre)}</button>`).join('')}</section>` : ''}
      </aside>
    </div>`;
}

function creerPlanSessions(fiche) {
  if (!fiche.sessions?.length) return '';
  return `<section class="session-plan" aria-labelledby="session-plan-title">
    <div class="session-plan__head"><div><span class="eyebrow">Progression guidée</span><h2 id="session-plan-title">${fiche.sessions.length} étapes pour comprendre et pratiquer</h2></div><span class="session-plan__hint">durées indicatives · vous pouvez faire une pause</span></div>
    <div class="session-grid">${fiche.sessions.map((session) => `
      <button class="session-card" type="button" data-scroll="section-${session.sections?.[0] ?? 0}">
        <span class="session-card__number">${fiche.sessions.indexOf(session) + 1}</span>
        <span><strong>${echapperHTML(session.titre)}</strong><small>${echapperHTML(session.duree)}</small><small>${echapperHTML(session.activite || session.objectif)}</small></span>
        <span aria-hidden="true">↓</span>
      </button>`).join('')}</div>
  </section>`;
}

function creerSection(section, index) {
  const titre = `<h2>${echapperHTML(section.titre)}</h2>`;
  let corps = '';

  if (section.type === 'texte') {
    corps = `<p>${echapperHTML(section.contenu)}</p>`;
  } else if (section.type === 'liste') {
    corps = `<ul class="doc-list">${section.contenu.map((element) => `<li>${echapperHTML(element)}</li>`).join('')}</ul>`;
  } else if (section.type === 'decomposition') {
    corps = `<div class="breakdown">${section.elements.map((element) => `
      <div class="breakdown__row"><div class="breakdown__term">${echapperHTML(element.terme)}</div><div class="breakdown__explanation">${echapperHTML(element.explication)}</div></div>`).join('')}</div>`;
  } else if (section.type === 'code') {
    corps = `<div class="code-shell">
      <div class="code-shell__head"><span class="code-shell__language">${echapperHTML(section.langage)}</span><button class="copy-button" type="button" data-copy aria-label="Copier cet exemple ${echapperAttribut(section.langage)}">Copier</button></div>
      <pre><code>${echapperHTML(section.contenu)}</code></pre>
    </div>${section.legende ? `<p class="code-caption">${echapperHTML(section.legende)}</p>` : ''}`;
  } else if (section.type === 'alerte') {
    corps = `<div class="callout callout--${echapperAttribut(section.variante)}"><span class="callout__label">${libelleAlerte(section.variante)}</span><p>${echapperHTML(section.contenu)}</p></div>`;
  } else if (section.type === 'comparaison') {
    corps = `<div class="table-wrap"><table class="comparison-table"><thead><tr>${section.colonnes.map((colonne) => `<th>${echapperHTML(colonne)}</th>`).join('')}</tr></thead><tbody>${section.lignes.map((ligne) => `<tr>${ligne.map((cellule) => `<td>${echapperHTML(cellule)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  } else if (section.type === 'liens') {
    corps = `<div class="official-links">${section.elements.map((lien) => `<a class="official-link" href="${echapperAttribut(lien.url)}" target="_blank" rel="noreferrer"><span>${echapperHTML(lien.label)}</span><span aria-hidden="true">↗</span></a>`).join('')}</div>`;
  } else if (section.type === 'exercice') {
    corps = `<div class="lesson-exercise"><p>${echapperHTML(section.contenu)}</p>${section.indice ? `<details><summary>Voir un indice</summary><p>${echapperHTML(section.indice)}</p></details>` : ''}</div>`;
  } else if (section.type === 'solution') {
    corps = `<details class="lesson-solution"><summary>Afficher le corrigé après avoir essayé</summary><p>${echapperHTML(section.contenu)}</p></details>`;
  }

  return `<section class="doc-section" id="section-${index}">${titre}${corps}</section>`;
}

function creerLienPagination(fiche, libelle, classe) {
  return `<button class="page-link ${classe}" type="button" data-fiche="${fiche.id}"><small>${libelle}</small><strong>${echapperHTML(fiche.titre)}</strong></button>`;
}

function afficherParcours() {
  definirFilAriane([{ label: 'Bibliothèque', route: 'accueil' }, { label: 'Mon parcours' }]);
  const total = etat.documentation.fiches.length;
  const lues = etat.stockage.lues.map(obtenirFiche).filter(Boolean);
  const recentes = obtenirFichesRecentes();
  const etapesValidees = idsParcoursDebutant.filter((id) => etat.stockage.lues.includes(id)).length;
  const pourcentage = Math.round((etapesValidees / idsParcoursDebutant.length) * 100);

  elements.contenu.innerHTML = `
    <header class="listing-header">
      <div class="eyebrow">Progression locale</div>
      <h1 class="page-title">Mon parcours</h1>
      <p class="page-intro">Les marqueurs sont volontaires et restent dans ce navigateur. Ils servent à retrouver votre fil, pas à transformer l’apprentissage en course.</p>
      <div class="domain-header__meta">
        <span class="meta-pill">${etapesValidees} / ${idsParcoursDebutant.length} étapes débutant</span>
        <span class="meta-pill">${lues.length} / ${total} fiches maîtrisées</span>
        <span class="meta-pill">${etat.stockage.revoir.length} à revoir</span>
      </div>
      <div class="progress-wrap" aria-label="Progression du parcours débutant">
        <span>Progression</span>
        <span class="progress-track"><span style="width: ${pourcentage}%"></span></span>
        <strong>${pourcentage}%</strong>
      </div>
    </header>
    ${creerSectionListe(recentes.length ? 'Récemment étudié' : 'Récemment étudié', recentes, 'Aucune fiche ouverte pour le moment. Le parcours conseillé ci-dessous est un bon point de départ.')}
    ${creerSectionListe('Fiches maîtrisées', lues, 'Marquez une fiche comme maîtrisée depuis son en-tête.')}
    ${parcoursDebutant.map((etape) => `<div class="path-stage"><p>${echapperHTML(etape.description)}</p>${creerSectionListe(etape.titre, etape.fiches.map(obtenirFiche).filter(Boolean), 'Étape indisponible.')}</div>`).join('')}
    ${creerSectionAteliersTermines()}`;
}

function afficherListeARevoir() {
  const fiches = etat.stockage.revoir.map(obtenirFiche).filter(Boolean);
  definirFilAriane([{ label: 'Bibliothèque', route: 'accueil' }, { label: 'À revoir' }]);
  elements.contenu.innerHTML = `
    <header class="listing-header">
      <div class="eyebrow">Révision ciblée</div>
      <h1 class="page-title">À revoir</h1>
      <p class="page-intro">Votre file personnelle de notions à reprendre. Retirez une fiche lorsqu’elle est claire ou marquez-la comme maîtrisée.</p>
    </header>
    ${fiches.length ? `<section class="category-section"><header class="category-section__head"><h2>Fiches marquées</h2><span>${fiches.length} notions</span></header>${fiches.map(creerLigneFiche).join('')}</section>` : `
      <div class="empty-page"><span>◎</span><h2>Rien à revoir pour le moment</h2><p>Ouvrez une fiche puis utilisez « Marquer à revoir » pour la retrouver ici.</p></div>`}`;
}

function afficherAteliers() {
  definirFilAriane([{ label: 'Bibliothèque', route: 'accueil' }, { label: 'Ateliers pratiques' }]);
  const ateliers = etat.documentation.ateliers;
  const domaines = [...new Set(ateliers.map((atelier) => atelier.domaine))];
  elements.contenu.innerHTML = `
    <header class="listing-header workshop-header">
      <div class="eyebrow">Apprendre en construisant</div>
      <h1 class="page-title">Ateliers pratiques</h1>
      <p class="page-intro">Chaque atelier donne un objectif concret, les outils nécessaires, une structure de fichiers, des étapes commentées et une validation. Copiez le code, modifiez-le, cassez-le puis réparez-le.</p>
      <div class="domain-header__meta"><span class="meta-pill">${ateliers.length} ateliers</span><span class="meta-pill">${etat.stockage.ateliers.length} terminés</span><span class="meta-pill">Progression locale</span></div>
    </header>
    <div class="atelier-filters" role="group" aria-label="Filtrer les ateliers">
      <button class="filter-chip is-active" type="button" data-atelier-filter="tous">Tous</button>
      ${domaines.map((domaine) => `<button class="filter-chip" type="button" data-atelier-filter="${domaine}">${echapperHTML(obtenirDomaine(domaine)?.nom || domaine)}</button>`).join('')}
    </div>
    <div class="atelier-grid" id="liste-ateliers">${ateliers.map(creerCarteAtelier).join('')}</div>`;
}

function creerCarteAtelier(atelier) {
  const domaine = obtenirDomaine(atelier.domaine);
  const termine = etat.stockage.ateliers.includes(atelier.id);
  return `<article class="atelier-card ${termine ? 'is-complete' : ''}" data-atelier-domain="${echapperAttribut(atelier.domaine)}">
    <div class="atelier-card__head"><span class="article-badge">${echapperHTML(domaine?.nom || atelier.domaine)}</span><span class="atelier-card__status">${termine ? '✓ Terminé' : echapperHTML(atelier.duree)}</span></div>
    <h2>${echapperHTML(atelier.titre)}</h2>
    <p>${echapperHTML(atelier.objectif)}</p>
    <div class="atelier-card__meta"><span>${echapperHTML(atelier.niveau)}</span><span>${atelier.etapes.length} étapes</span><span>${atelier.outils.length} outils</span></div>
    <button class="secondary-button" type="button" data-atelier="${atelier.id}">${termine ? 'Recommencer l’atelier' : 'Ouvrir l’atelier'} <span aria-hidden="true">→</span></button>
  </article>`;
}

function afficherAtelier(id) {
  const atelier = obtenirAtelier(id);
  if (!atelier) return afficherIntrouvable('Atelier introuvable');
  const domaine = obtenirDomaine(atelier.domaine);
  const index = etat.documentation.ateliers.findIndex((element) => element.id === id);
  const precedent = etat.documentation.ateliers[index - 1];
  const suivant = etat.documentation.ateliers[index + 1];
  const termine = etat.stockage.ateliers.includes(id);
  const fichesAssociees = atelier.associes.map(obtenirFiche).filter(Boolean);
  definirFilAriane([{ label: 'Bibliothèque', route: 'accueil' }, { label: 'Ateliers pratiques', route: 'ateliers' }, { label: atelier.titre }]);
  elements.contenu.innerHTML = `
    <header class="article-header atelier-page__header">
      <div class="article-header__meta"><span class="article-badge">Atelier</span><span class="article-badge">${echapperHTML(domaine?.nom || atelier.domaine)}</span><span class="article-badge">${echapperHTML(atelier.niveau)}</span><span class="article-badge">${echapperHTML(atelier.duree)}</span></div>
      <h1>${echapperHTML(atelier.titre)}</h1><p class="article-header__summary">${echapperHTML(atelier.objectif)}</p>
      <div class="article-header__actions"><button class="secondary-button ${termine ? 'is-active' : ''}" type="button" data-toggle-atelier="${atelier.id}">${termine ? '✓ Atelier terminé' : '□ Marquer comme terminé'}</button></div>
    </header>
    <div class="atelier-layout">
      <article class="article-body">
        <div class="callout callout--retenir"><span class="callout__label">Méthode</span><p>Lisez l’objectif, préparez les outils, exécutez une étape à la fois, puis utilisez la validation. Une erreur est une information : lisez le message avant de modifier le code.</p></div>
        <section class="workshop-section" id="atelier-outils"><h2>Outils nécessaires</h2><div class="tool-list">${atelier.outils.map((outil) => `<span class="tool-chip">${echapperHTML(outil)}</span>`).join('')}</div></section>
        <section class="workshop-section"><h2>Avant de commencer</h2><ul class="checklist">${atelier.prerequis.map((item) => `<li>${echapperHTML(item)}</li>`).join('')}</ul></section>
        <section class="workshop-section"><h2>Structure à créer</h2><pre class="tree-block"><code>${echapperHTML(atelier.structure.join('\n'))}</code></pre></section>
        <section class="workshop-section" id="atelier-etapes"><h2>Étapes guidées</h2><ol class="step-list">${atelier.etapes.map((etape, etapeIndex) => creerEtapeAtelier(etape, etapeIndex)).join('')}</ol></section>
        <section class="workshop-section" id="atelier-validation"><h2>Validation finale</h2><ul class="checklist checklist--interactive">${atelier.validation.map((item) => `<li><label><input type="checkbox"> <span>${echapperHTML(item)}</span></label></li>`).join('')}</ul></section>
        <details class="hint-box"><summary>Afficher un indice</summary><p>${echapperHTML(atelier.indice)}</p></details>
        <nav class="article-pagination workshop-pagination" aria-label="Atelier précédent et suivant">${precedent ? `<button class="page-link" type="button" data-atelier="${precedent.id}"><small>Précédent</small><strong>${echapperHTML(precedent.titre)}</strong></button>` : '<span></span>'}${suivant ? `<button class="page-link page-link--next" type="button" data-atelier="${suivant.id}"><small>Suivant</small><strong>${echapperHTML(suivant.titre)}</strong></button>` : ''}</nav>
      </article>
      <aside class="article-aside"><section class="aside-block"><h3>Dans cet atelier</h3><button class="toc-link" type="button" data-scroll="atelier-outils">Outils nécessaires</button><button class="toc-link" type="button" data-scroll="atelier-etapes">Étapes guidées</button><button class="toc-link" type="button" data-scroll="atelier-validation">Validation finale</button></section>${fichesAssociees.length ? `<section class="aside-block"><h3>Fiches utiles</h3>${fichesAssociees.map((fiche) => `<button class="related-link" type="button" data-fiche="${fiche.id}">${echapperHTML(fiche.titre)}</button>`).join('')}</section>` : ''}</aside>
    </div>`;
}

function creerEtapeAtelier(etape, index) {
  return `<li class="step-item"><div class="step-item__number">${index + 1}</div><div class="step-item__body"><h3>${echapperHTML(etape.titre)}</h3><p>${echapperHTML(etape.explication)}</p><div class="code-shell"><div class="code-shell__head"><span class="code-shell__language">${echapperHTML(etape.langage)}</span><button class="copy-button" type="button" data-copy aria-label="Copier l’étape ${index + 1}">Copier</button></div><pre><code>${echapperHTML(etape.code)}</code></pre></div></div></li>`;
}

function creerSectionListe(titre, fiches, messageVide) {
  if (!fiches.length) return `<section class="dashboard-section"><div class="section-title-row"><h2>${titre}</h2></div><div class="empty-page"><p>${messageVide}</p></div></section>`;
  return `<section class="dashboard-section"><div class="section-title-row"><h2>${titre}</h2><span>${fiches.length} fiche${fiches.length > 1 ? 's' : ''}</span></div><div class="panel"><ul class="study-list">${fiches.map(creerElementEtude).join('')}</ul></div></section>`;
}

function creerSectionAteliersTermines() {
  const ateliers = etat.stockage.ateliers.map(obtenirAtelier).filter(Boolean);
  if (!ateliers.length) return `<section class="dashboard-section"><div class="section-title-row"><h2>Ateliers terminés</h2></div><div class="empty-page"><p>Les ateliers terminés apparaîtront ici. Commencez par l’<button class="text-link" type="button" data-route="ateliers">atelier pratique</button> de votre choix.</p></div></section>`;
  return `<section class="dashboard-section"><div class="section-title-row"><h2>Ateliers terminés</h2><span>${ateliers.length} exercice${ateliers.length > 1 ? 's' : ''}</span></div><div class="atelier-grid atelier-grid--compact">${ateliers.map(creerCarteAtelier).join('')}</div></section>`;
}

function afficherIntrouvable(titre) {
  definirFilAriane([{ label: 'Bibliothèque', route: 'accueil' }, { label: 'Introuvable' }]);
  elements.contenu.innerHTML = `<div class="empty-page"><span>404</span><h2>${echapperHTML(titre)}</h2><p>Cette adresse ne correspond à aucun contenu du catalogue.</p></div>`;
}

function ouvrirRecherche() {
  if (!elements.dialogueRecherche.open) elements.dialogueRecherche.showModal();
  elements.champRecherche.value = '';
  etat.resultatActif = 0;
  afficherSuggestionsRecherche();
  requestAnimationFrame(() => elements.champRecherche.focus());
}

function fermerRecherche() {
  if (elements.dialogueRecherche.open) elements.dialogueRecherche.close();
}

function afficherSuggestionsRecherche() {
  const suggestions = ['js-map-filter-reduce', 'dom-selection', 'js-promises', 'node-fs', 'express-middleware', 'css-flexbox']
    .map(obtenirFiche).filter(Boolean);
  const references = ['react', 'rls', 'cache', 'package-json'].map(obtenirEntreeBibliotheque).filter(Boolean);
  elements.metaRecherche.textContent = 'Suggestions · fiches, ateliers, définitions, exemples et code';
  afficherResultatsRecherche([...suggestions, ...references.map((entree) => ({ ...entree, resultatType: 'terme' }))]);
}

function rechercherNotion(terme) {
  const recherche = normaliser(terme).trim();
  if (!recherche) return afficherSuggestionsRecherche();
  const mots = recherche.split(/\s+/).filter(Boolean);
  const catalogue = [
    ...etat.documentation.fiches.map((fiche) => ({ element: fiche, type: 'fiche' })),
    ...etat.documentation.ateliers.map((atelier) => ({ element: atelier, type: 'atelier' })),
    ...(etat.documentation.bibliotheque || []).map((entree) => ({ element: entree, type: 'terme' }))
  ];
  const resultats = catalogue
    .map(({ element, type }) => ({ element, type, score: calculerScore(element, recherche, mots, type) }))
    .filter((resultat) => resultat.score > 0)
    .sort((a, b) => b.score - a.score || (a.element.terme || a.element.titre).localeCompare(b.element.terme || b.element.titre, 'fr'))
    .slice(0, 18)
    .map((resultat) => ({ ...resultat.element, resultatType: resultat.type }));

  etat.resultatActif = 0;
  elements.metaRecherche.textContent = `${resultats.length} résultat${resultats.length > 1 ? 's' : ''} pour « ${terme.trim()} »`;
  afficherResultatsRecherche(resultats);
}

function calculerScore(fiche, recherche, mots, type = 'fiche') {
  const titre = normaliser(type === 'terme' ? fiche.terme : fiche.titre);
  const tags = normaliser((type === 'terme' ? fiche.aliases : (fiche.tags || fiche.outils || [])).join(' '));
  const categorie = normaliser(type === 'terme' ? fiche.categorie : (fiche.categorie || ''));
  const domaine = normaliser(type === 'terme' ? fiche.famille : (obtenirDomaine(fiche.domaine)?.nom || fiche.domaine));
  const sections = type === 'terme'
    ? normaliser(JSON.stringify(fiche))
    : normaliser((fiche.sections || fiche.etapes || []).map((section) => {
    if (typeof section.contenu === 'string') return section.contenu;
    if (typeof section.code === 'string') return `${section.code} ${section.explication || ''}`;
    if (Array.isArray(section.contenu)) return section.contenu.join(' ');
    if (section.elements) return section.elements.map((element) => `${element.terme || ''} ${element.explication || ''} ${element.label || ''}`).join(' ');
    return '';
  }).join(' '));
  const ensemble = `${titre} ${tags} ${categorie} ${domaine} ${normaliser(fiche.resume || '')} ${sections}`;

  if (!mots.every((mot) => ensemble.includes(mot))) return 0;
  let score = 1;
  if (titre === recherche) score += 120;
  if (titre.startsWith(recherche)) score += 70;
  if (titre.includes(recherche)) score += 45;
  if (tags.includes(recherche)) score += 30;
  if (categorie.includes(recherche) || domaine.includes(recherche)) score += 16;
  score += mots.reduce((total, mot) => total + (titre.includes(mot) ? 12 : 0) + (tags.includes(mot) ? 7 : 0), 0);
  if (type === 'atelier') score += 4;
  if (type === 'terme') score += 8;
  return score;
}

function afficherResultatsRecherche(resultats) {
  if (!resultats.length) {
    elements.resultatsRecherche.innerHTML = '<div class="search-no-result">Aucune fiche ne correspond. Essayez un nom d’API, un concept ou une erreur.</div>';
    return;
  }
  elements.resultatsRecherche.innerHTML = resultats.map((fiche, index) => {
    const domaine = obtenirDomaine(fiche.domaine);
    const estAtelier = fiche.resultatType === 'atelier';
    const estTerme = fiche.resultatType === 'terme';
    const titre = estTerme ? fiche.terme : fiche.titre;
    const destination = estAtelier ? `data-atelier="${fiche.id}"` : estTerme ? `data-terme="${fiche.id}"` : `data-fiche="${fiche.id}"`;
    const extrait = estTerme ? extraireExtraitBibliotheque(fiche, elements.champRecherche.value) : '';
    return `<button class="search-result ${index === etat.resultatActif ? 'is-selected' : ''}" type="button" ${destination}>
      <span class="search-result__icon">${echapperHTML(estTerme ? 'REF' : (domaine?.icone || '•'))}</span>
      <span><strong>${echapperHTML(titre)}</strong><small>${echapperHTML(fiche.resume || fiche.objectif || fiche.definition)}</small>${extrait ? `<small class="search-result__match">${echapperHTML(extrait)}</small>` : ''}</span>
      <span class="search-result__category">${estAtelier ? 'Atelier' : estTerme ? echapperHTML(fiche.categorie) : echapperHTML(domaine?.nom || fiche.domaine)}</span>
    </button>`;
  }).join('');
}

function extraireExtraitBibliotheque(entree, recherche) {
  const mots = normaliser(recherche).trim().split(/\s+/).filter(Boolean);
  if (!mots.length) return '';
  const sources = [
    ...(entree.exemples || []).flatMap((exemple) => [`Code : ${exemple.contenu}`, exemple.explication]),
    entree.definition,
    ...(entree.roles || []),
    ...(entree.avertissements || []),
    ...(entree.structure || [])
  ].filter(Boolean);
  const source = sources.find((texte) => {
    const normalise = normaliser(texte);
    return motsCorrespondent(normalise, mots);
  });
  return source ? String(source).replace(/\s+/g, ' ').slice(0, 190) : '';
}

function motsCorrespondent(texte, mots) {
  const contenu = normaliser(texte);
  const tokens = contenu.split(/\s+/).filter(Boolean);
  return mots.every((mot) => {
    const recherche = normaliser(mot).trim();
    return recherche && (tokens.includes(recherche) || tokens.some((token) => token.startsWith(recherche)));
  });
}

function gererClavierRecherche(evenement) {
  const resultats = [...elements.resultatsRecherche.querySelectorAll('.search-result')];
  if (!resultats.length) return;
  if (evenement.key === 'ArrowDown') {
    evenement.preventDefault();
    etat.resultatActif = Math.min(etat.resultatActif + 1, resultats.length - 1);
  } else if (evenement.key === 'ArrowUp') {
    evenement.preventDefault();
    etat.resultatActif = Math.max(etat.resultatActif - 1, 0);
  } else if (evenement.key === 'Enter') {
    evenement.preventDefault();
    resultats[etat.resultatActif]?.click();
    return;
  } else {
    return;
  }
  resultats.forEach((resultat, index) => resultat.classList.toggle('is-selected', index === etat.resultatActif));
  resultats[etat.resultatActif]?.scrollIntoView({ block: 'nearest' });
}

function enregistrerConsultation(id) {
  const recent = etat.stockage.recent.filter((element) => element.id !== id);
  recent.unshift({ id, date: Date.now() });
  sauvegarder('recent', recent.slice(0, 8));
}

function basculerDansListe(cle, id) {
  const liste = [...etat.stockage[cle]];
  const index = liste.indexOf(id);
  const ajoute = index === -1;
  if (ajoute) liste.push(id); else liste.splice(index, 1);
  sauvegarder(cle, liste);
  afficherToast(cle === 'revoir' ? (ajoute ? 'Ajouté à votre liste de révision' : 'Retiré de votre liste de révision') : (ajoute ? 'Fiche marquée comme maîtrisée' : 'Marque de maîtrise retirée'));
  if (etat.ficheActive?.id === id) afficherFiche(id);
}

function basculerAtelier(id) {
  const liste = [...etat.stockage.ateliers];
  const index = liste.indexOf(id);
  const termine = index === -1;
  if (termine) liste.push(id); else liste.splice(index, 1);
  sauvegarder('ateliers', liste);
  afficherToast(termine ? 'Atelier marqué comme terminé' : 'Atelier retiré des ateliers terminés');
  if (routeCourante() === 'atelier') afficherAtelier(id);
  if (routeCourante() === 'ateliers') afficherAteliers();
}

async function copierCode(bouton) {
  const code = bouton.closest('.code-shell')?.querySelector('code')?.textContent;
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
  } catch {
    const zone = document.createElement('textarea');
    zone.value = code;
    zone.style.position = 'fixed';
    zone.style.opacity = '0';
    document.body.append(zone);
    zone.select();
    document.execCommand('copy');
    zone.remove();
  }
  const ancienTexte = bouton.textContent;
  bouton.textContent = 'Copié ✓';
  afficherToast('Code copié dans le presse-papiers');
  setTimeout(() => { bouton.textContent = ancienTexte; }, 1500);
}

function definirFilAriane(elementsAriane) {
  elements.filAriane.innerHTML = elementsAriane.map((element, index) => `${index ? '<i>/</i>' : ''}<button type="button" ${element.route ? `data-route="${element.route}"` : ''} ${element.categorie ? `data-categorie="${echapperAttribut(element.categorie)}"` : ''}>${echapperHTML(element.label)}</button>`).join('');
}

function afficherToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('is-visible');
  clearTimeout(afficherToast.minuteur);
  afficherToast.minuteur = setTimeout(() => elements.toast.classList.remove('is-visible'), 2200);
}

function estInstallee() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function masquerPropositionInstallation() {
  elements.propositionInstallation.hidden = true;
}

function proposerInstallation() {
  if (estInstallee() || sessionStorage.getItem('bibliolearn.installation.ignoree')) return;
  elements.propositionInstallation.hidden = false;
}

async function installerApplication() {
  masquerPropositionInstallation();
  if (estInstallee()) return afficherToast('Bibliolearn est déjà installé');
  if (inviteInstallation) {
    const invite = inviteInstallation;
    inviteInstallation = null;
    await invite.prompt();
    const choix = await invite.userChoice;
    afficherToast(choix.outcome === 'accepted' ? 'Installation lancée' : 'Installation reportée');
    return;
  }
  elements.dialogueInstallation.showModal();
}

async function partagerSite() {
  const url = window.location.href;
  const titre = etat.ficheActive ? `${etat.ficheActive.titre} — Bibliolearn` : 'Bibliolearn — Apprendre le développement web';
  const texte = etat.ficheActive
    ? `J’étudie « ${etat.ficheActive.titre} » sur Bibliolearn. Viens apprendre avec moi !`
    : 'Des cours progressifs et des ateliers pratiques pour apprendre le développement web ensemble.';
  if (navigator.share) {
    try {
      await navigator.share({ title: titre, text: texte, url });
      return;
    } catch (erreur) {
      if (erreur.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    afficherToast('Lien copié : envoyez-le à vos amis devs !');
  } catch {
    const champ = document.createElement('textarea');
    champ.value = url;
    champ.style.position = 'fixed';
    champ.style.opacity = '0';
    document.body.append(champ);
    champ.select();
    document.execCommand('copy');
    champ.remove();
    afficherToast('Lien copié : envoyez-le à vos amis devs !');
  }
}

function initialiserPwa() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {
      // Le site reste utilisable lorsque l'installation hors ligne est indisponible.
    }));
  }
  window.addEventListener('beforeinstallprompt', (evenement) => {
    evenement.preventDefault();
    inviteInstallation = evenement;
  });
  window.addEventListener('appinstalled', () => {
    inviteInstallation = null;
    masquerPropositionInstallation();
    elements.actionInstaller.hidden = true;
    afficherToast('Bibliolearn est installé !');
  });
  if (estInstallee()) elements.actionInstaller.hidden = true;
  window.setTimeout(proposerInstallation, 14000);
}

function ouvrirMenuMobile() {
  elements.sidebar.classList.add('is-open');
  elements.overlay.hidden = false;
}

function fermerMenuMobile() {
  elements.sidebar.classList.remove('is-open');
  elements.overlay.hidden = true;
}

function obtenirFiche(id) {
  return etat.documentation?.fiches.find((fiche) => fiche.id === id);
}

function obtenirAtelier(id) {
  return etat.documentation?.ateliers.find((atelier) => atelier.id === id);
}

function obtenirEntreeBibliotheque(id) {
  return etat.documentation?.bibliotheque?.find((entree) => entree.id === id);
}

function obtenirDomaine(id) {
  return etat.documentation?.domaines.find((domaine) => domaine.id === id);
}

function obtenirFichesDomaine(id) {
  return etat.documentation.fiches.filter((fiche) => fiche.domaine === id);
}

function obtenirFichesRecentes() {
  return etat.stockage.recent.map((element) => obtenirFiche(element.id)).filter(Boolean);
}

function regrouper(liste, propriete) {
  return liste.reduce((groupes, element) => {
    const cle = element[propriete];
    groupes[cle] ||= [];
    groupes[cle].push(element);
    return groupes;
  }, {});
}

function normaliser(texte) {
  return String(texte).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[(){}[\].,:;/\\_<>-]+/g, ' ');
}

function slugifier(texte) {
  return normaliser(texte).trim().replace(/\s+/g, '-');
}

function echapperHTML(valeur) {
  return String(valeur)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function echapperAttribut(valeur) {
  return echapperHTML(valeur);
}

function libelleAlerte(variante) {
  return {
    erreur: 'Erreur fréquente',
    attention: 'Attention',
    obsolete: 'Obsolète / historique',
    'bonne-pratique': 'Bonne pratique',
    retenir: 'À retenir'
  }[variante] || 'À noter';
}

function formaterDateRelative(date) {
  const ecartMinutes = Math.floor((Date.now() - Number(date)) / 60000);
  if (ecartMinutes < 1) return 'à l’instant';
  if (ecartMinutes < 60) return `il y a ${ecartMinutes} min`;
  const heures = Math.floor(ecartMinutes / 60);
  if (heures < 24) return `il y a ${heures} h`;
  return `il y a ${Math.floor(heures / 24)} j`;
}

document.addEventListener('click', (evenement) => {
  const cible = evenement.target.closest('button, [data-copy]');
  if (!cible) return;

  if (cible.dataset.route) naviguer(cible.dataset.route);
  if (cible.dataset.domaine) naviguer(`domaine/${cible.dataset.domaine}`);
  if (cible.dataset.fiche) {
    fermerRecherche();
    naviguer(`fiche/${cible.dataset.fiche}`);
  }
  if (cible.dataset.terme) {
    fermerRecherche();
    naviguer(`terme/${cible.dataset.terme}`);
  }
  if (cible.dataset.atelier) {
    fermerRecherche();
    naviguer(`atelier/${cible.dataset.atelier}`);
  }
  if (cible.dataset.categorie) {
    const executerScroll = () => document.getElementById(slugifier(cible.dataset.categorie))?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(executerScroll, cible.dataset.route ? 80 : 0);
  }
  if (cible.dataset.action === 'recherche') ouvrirRecherche();
  if (cible.dataset.action === 'partager') partagerSite();
  if (cible.dataset.action === 'installer') installerApplication();
  if (cible.dataset.action === 'ignorer-installation') {
    masquerPropositionInstallation();
    sessionStorage.setItem('bibliolearn.installation.ignoree', '1');
  }
  if ('copy' in cible.dataset) copierCode(cible);
  if (cible.dataset.toggleRevoir) basculerDansListe('revoir', cible.dataset.toggleRevoir);
  if (cible.dataset.toggleLue) basculerDansListe('lues', cible.dataset.toggleLue);
  if (cible.dataset.toggleAtelier) basculerAtelier(cible.dataset.toggleAtelier);
  if (cible.dataset.atelierFilter) {
    document.querySelectorAll('[data-atelier-filter]').forEach((filtre) => filtre.classList.toggle('is-active', filtre === cible));
    document.querySelectorAll('[data-atelier-domain]').forEach((carte) => { carte.hidden = cible.dataset.atelierFilter !== 'tous' && carte.dataset.atelierDomain !== cible.dataset.atelierFilter; });
  }
  if (cible.dataset.libraryCategory) {
    etat.bibliothequeCategorie = cible.dataset.libraryCategory;
    etat.bibliothequeLimite = 60;
    document.querySelectorAll('[data-library-category]').forEach((filtre) => filtre.classList.toggle('is-active', filtre.dataset.libraryCategory === etat.bibliothequeCategorie));
    actualiserCartesBibliotheque();
  }
  if ('libraryMore' in cible.dataset) {
    etat.bibliothequeLimite += 60;
    actualiserCartesBibliotheque();
  }
  if (cible.dataset.scroll) document.getElementById(cible.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' });
});

elements.ouvrirRecherche.addEventListener('click', ouvrirRecherche);
elements.fermerRecherche.addEventListener('click', fermerRecherche);
elements.actionRevoir.addEventListener('click', () => naviguer('revoir'));
elements.actionInstaller.addEventListener('click', installerApplication);
elements.actionPartager.addEventListener('click', partagerSite);
elements.fermerInstallation.addEventListener('click', () => elements.dialogueInstallation.close());
elements.ouvrirMenu.addEventListener('click', ouvrirMenuMobile);
elements.fermerMenu.addEventListener('click', fermerMenuMobile);
elements.overlay.addEventListener('click', fermerMenuMobile);
elements.champRecherche.addEventListener('input', (evenement) => rechercherNotion(evenement.target.value));
document.addEventListener('input', (evenement) => {
  if (evenement.target.id !== 'filtre-bibliotheque') return;
  etat.bibliothequeRecherche = evenement.target.value;
  etat.bibliothequeLimite = 60;
  actualiserCartesBibliotheque();
});
elements.champRecherche.addEventListener('keydown', gererClavierRecherche);
elements.dialogueRecherche.addEventListener('click', (evenement) => {
  if (evenement.target === elements.dialogueRecherche) fermerRecherche();
});

document.addEventListener('keydown', (evenement) => {
  if ((evenement.ctrlKey || evenement.metaKey) && evenement.key.toLowerCase() === 'k') {
    evenement.preventDefault();
    ouvrirRecherche();
  }
});

window.addEventListener('hashchange', router);
initialiserPwa();
chargerDocumentation();
