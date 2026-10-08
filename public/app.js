import { Catalogue } from './modules/catalogue.mjs';
import { Progression, LIBELLES } from './modules/progression.mjs';
import { creerVuesCatalogue } from './modules/vues-catalogue.mjs';
import { echapperHTML, echapperAttribut } from './modules/texte.mjs';
import { creerVues, MATURITE } from './modules/vues-apprentissage.mjs';
import { connecterEntrainement } from './modules/entrainement.mjs';
import { gererMenu, focaliserRoute } from './modules/accessibilite.mjs';
import { creerRouteur } from './modules/routeur.mjs';
import { telechargerBibliotheque } from './modules/hors-ligne.mjs';

const catalogue = new Catalogue();

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
  systeme: chargerValeur('bibliolearn.systeme', detecterSysteme()),
  ateliersFiltre: 'tous',
  ateliersLimite: 48,
  stockage: chargerStockage()
};

function detecterSysteme() {
  const plateforme = navigator.userAgentData?.platform || navigator.platform || '';
  if (/win/i.test(plateforme)) return 'windows';
  if (/mac/i.test(plateforme)) return 'mac';
  return 'linux';
}

const clesStockage = {
  recent: 'bibliolearn.recent',
  revoir: 'bibliolearn.revoir',
  lues: 'bibliolearn.lues',
  ateliers: 'bibliolearn.ateliers'
};

let parcoursDebutant = [];
let idsParcoursDebutant = [];

function chargerValeur(cle, valeurParDefaut) {
  try {
    const valeur = localStorage.getItem(cle);
    return valeur ? JSON.parse(valeur) : valeurParDefaut;
  } catch {
    return valeurParDefaut;
  }
}

function lireListe(cle) { const v = chargerValeur(cle, []); return Array.isArray(v) ? v : []; }

function chargerStockage() {
  return {
    recent: lireListe('bibliolearn.recent').map(e => typeof e === 'string' ? { id: e, date: Date.now() } : e).filter(e => e?.id),
    revoir: lireListe('bibliolearn.revoir').filter(id => typeof id === 'string'),
    lues: [],
    ateliers: lireListe('bibliolearn.ateliers').filter(id => typeof id === 'string')
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
    etat.documentation = await catalogue.initialiser();
    parcoursDebutant = etat.documentation.parcours.find(p => p.id === 'zero').etapes;
    idsParcoursDebutant = parcoursDebutant.flatMap(e => e.fiches);
    construireNavigation(); actualiserCompteurs(); await router();
  } catch {
    elements.contenu.innerHTML = '<section class="empty-page"><h1>La bibliothèque est indisponible</h1><p>Vérifiez votre connexion. Le premier accès nécessite de télécharger les repères du parcours.</p><button class="primary-button" data-action="recharger">Réessayer</button></section>';
  }
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
    <button class="domain-button ${actif ? 'is-active' : ''}" type="button" data-domaine="${domaine.id}" ${actif ? 'aria-current="page"' : ''}>
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
      (route === 'parcours' && routeCourante() === 'fiche') || (route === 'ateliers' && ['revoir', 'projets', 'projet'].includes(routeCourante())) || (route === 'bibliotheque' && ['erreurs', 'erreur'].includes(routeCourante()));
    bouton.classList.toggle('is-active', actif);
    if (actif) bouton.setAttribute('aria-current', 'page'); else bouton.removeAttribute('aria-current');
  });
}

function actualiserCompteurs() {
  if (!etat.documentation) return;
  elements.compteurSidebar.textContent = 'Apprendre · pratiquer · retrouver';
  elements.compteurRevoir.textContent = new Set([...etat.stockage.revoir, ...progression.aReviser()]).size;
}

function rendreRoute(route, parametre) {
  etat.ficheActive = null; etat.domaineActif = null;
  if (route === 'fiche' && parametre) afficherFiche(parametre);
  else if (route === 'terme' && parametre) afficherTermeBibliotheque(parametre);
  else if (route === 'atelier' && parametre) afficherAtelier(parametre);
  else if (route === 'domaine' && parametre) afficherDomaine(parametre);
  else if (route === 'bibliotheque') afficherBibliotheque();
  else if (route === 'installation') afficherInstallation();
  else if (route === 'ateliers') afficherAteliers();
  else if (route === 'parcours') vues.parcours(parametre);
  else if (route === 'revoir') vues.revisions();
  else if (route === 'erreurs' || route === 'erreur') vues.contenus('erreur', parametre);
  else if (route === 'projets' || route === 'projet') vues.contenus('projet', parametre);
  else if (route === 'accueil') vues.accueil();
  else afficherIntrouvable('Adresse introuvable');
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



async function ouvrirRecherche() {
  if (!elements.dialogueRecherche.open) elements.dialogueRecherche.showModal();
  elements.champRecherche.value = ''; etat.resultatActif = 0;
  elements.metaRecherche.textContent = 'Préparation de la recherche…';
  elements.resultatsRecherche.innerHTML = '';
  elements.champRecherche.focus();
  try { await catalogue.indexer(); if (elements.dialogueRecherche.open) rechercherNotion(elements.champRecherche.value); }
  catch { elements.metaRecherche.textContent = 'Recherche indisponible hors ligne si elle n’a pas encore été chargée. Fermez puis réessayez avec une connexion.'; }
}

function fermerRecherche() {
  if (elements.dialogueRecherche.open) elements.dialogueRecherche.close();
}

function afficherSuggestionsRecherche() {
  elements.metaRecherche.textContent = 'Leçons, références, ateliers, erreurs et projets. Précisez le langage pour un mot ambigu.';
  const ids = ['zero-fichiers', 'js-map-filter-reduce', 'js-promises', 'html-document'];
  afficherResultatsRecherche(catalogue.index.filter(e => e.type === 'fiche' && ids.includes(e.id)));
}

function rechercherNotion(terme) {
  if (!catalogue.chercher) return;
  if (!terme.trim()) return afficherSuggestionsRecherche();
  const resultats = catalogue.chercher(terme, { limite: 24 });
  etat.resultatActif = 0;
  elements.metaRecherche.textContent = `${resultats.length} résultats pour « ${terme.trim()} » · contexte précisé sur chaque ligne`;
  afficherResultatsRecherche(resultats);
}

function afficherResultatsRecherche(resultats) {
  const types = { fiche: 'Leçon', reference: 'Référence', atelier: 'Atelier', erreur: 'Erreur', projet: 'Projet' };
  const routes = { fiche: 'fiche', reference: 'terme', atelier: 'atelier', erreur: 'erreur', projet: 'projet' };
  elements.resultatsRecherche.innerHTML = resultats.length ? resultats.map((r, i) => `<button class="search-result ${i === etat.resultatActif ? 'is-selected' : ''}" data-route="${routes[r.type]}/${echapperAttribut(r.id)}"><span><strong>${echapperHTML(r.titre || r.terme)}</strong><small>${echapperHTML(r.resume)}</small><small>${types[r.type]} · ${echapperHTML(r.categorie || r.domaine || r.famille)} · ${echapperHTML(MATURITE[r.maturiteEditoriale])}</small></span></button>`).join('') : '<p class="search-no-result">Aucun résultat. Essayez le message exact ou précisez le langage.</p>';
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
  progression.voir(id);
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
  afficherToast(cle === 'revoir' ? (ajoute ? 'Ajouté à votre liste de révision' : 'Retiré de votre liste de révision') : 'Progression enregistrée');
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

function ouvrirMenuMobile() { menu.ouvrir(); }

function fermerMenuMobile() { menu.fermer(); }

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





function formaterDateRelative(date) {
  const ecartMinutes = Math.floor((Date.now() - Number(date)) / 60000);
  if (ecartMinutes < 1) return 'à l’instant';
  if (ecartMinutes < 60) return `il y a ${ecartMinutes} min`;
  const heures = Math.floor(ecartMinutes / 60);
  if (heures < 24) return `il y a ${heures} h`;
  return `il y a ${Math.floor(heures / 24)} j`;
}

document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); elements.contenu.focus(); });

document.addEventListener('click', (evenement) => {
  const cible = evenement.target.closest('button, [data-copy]');
  if (!cible) return;

  if (cible.dataset.route) { fermerRecherche(); naviguer(cible.dataset.route); }
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
  if (cible.dataset.action === 'reessayer') router();
  if (cible.dataset.action === 'recharger') chargerDocumentation();
  if (cible.dataset.action === 'telecharger') telechargerBibliotheque(catalogue, cible);
  if (cible.dataset.action === 'partager') partagerSite();
  if (cible.dataset.action === 'installer') installerApplication();
  if (cible.dataset.action === 'ignorer-installation') {
    masquerPropositionInstallation();
    sessionStorage.setItem('bibliolearn.installation.ignoree', '1');
  }
  if ('copy' in cible.dataset) copierCode(cible);
  if (cible.dataset.toggleRevoir) basculerDansListe('revoir', cible.dataset.toggleRevoir);
  if (cible.dataset.compris) { progression.comprendre(cible.dataset.compris); cible.textContent = 'Compris · déclaré'; document.querySelectorAll('[data-statut]').forEach(el => { if (el.dataset.statut === cible.dataset.compris) el.textContent = LIBELLES[progression.etat(cible.dataset.compris)]; }); }
  if (cible.dataset.toggleAtelier) basculerAtelier(cible.dataset.toggleAtelier);
  if (cible.dataset.atelierFilter) {
    etat.ateliersFiltre = cible.dataset.atelierFilter;
    etat.ateliersLimite = 48;
    document.querySelectorAll('[data-atelier-filter]').forEach((filtre) => filtre.classList.toggle('is-active', filtre === cible));
    actualiserCartesAteliers();
  }
  if ('ateliersMore' in cible.dataset) {
    etat.ateliersLimite += 48;
    actualiserCartesAteliers();
  }
  if (cible.dataset.systeme) {
    etat.systeme = cible.dataset.systeme;
    try { localStorage.setItem('bibliolearn.systeme', JSON.stringify(etat.systeme)); } catch {}
    document.querySelectorAll('[data-systeme]').forEach((bouton) => {
      const actif = bouton.dataset.systeme === etat.systeme;
      bouton.classList.toggle('is-active', actif);
      bouton.setAttribute('aria-pressed', String(actif));
    });
    document.querySelectorAll('[data-platform-panel]').forEach((panneau) => { panneau.hidden = panneau.dataset.platformPanel !== etat.systeme; });
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
  if (cible.dataset.scroll) { const section = document.getElementById(cible.dataset.scroll); const detail = section?.closest('details'); if (detail) detail.open = true; section?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }
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

const progression = new Progression({ getItem: cle => localStorage.getItem(cle), setItem: (cle, valeur) => localStorage.setItem(cle, valeur) }, () => Date.now(), message => { const alerte = document.querySelector('#stockage-statut'); alerte.textContent = message; alerte.hidden = false; });
const menu = gererMenu(elements);
const { creerCarteDomaine, afficherDomaine, afficherFiche, afficherTermeBibliotheque, afficherBibliotheque, actualiserCartesBibliotheque, afficherAteliers, afficherAtelier, actualiserCartesAteliers, afficherInstallation, afficherIntrouvable } = creerVuesCatalogue({ etat, elements, catalogue, progression, obtenirVues: () => vues, obtenirParcours: () => idsParcoursDebutant, obtenirFiche, obtenirAtelier, obtenirEntreeBibliotheque, obtenirDomaine, obtenirFichesDomaine, enregistrerConsultation, definirFilAriane, normaliser, slugifier, regrouper, formaterDateRelative });
const vues = creerVues({ etat, elements, progression, obtenirFiche, filAriane: definirFilAriane, carteDomaine: creerCarteDomaine });
const router = creerRouteur({ catalogue, contenu: elements.contenu, rendre: rendreRoute, terminer: () => { actualiserNavigation(); menu.fermer(false); window.scrollTo(0, 0); focaliserRoute(elements.contenu); } });
window.addEventListener('hashchange', router);
connecterEntrainement({ progression, obtenirFiche, compteur: actualiserCompteurs });
initialiserPwa();
chargerDocumentation();
