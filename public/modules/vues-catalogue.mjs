import { creerSection } from './contenu.mjs';
import { echapperHTML, echapperAttribut } from './texte.mjs';
import { MATURITE } from './vues-apprentissage.mjs';
import { entrainement, statut } from './entrainement.mjs';

export function creerVuesCatalogue({ etat, elements, catalogue, progression, obtenirVues, obtenirParcours, obtenirFiche, obtenirAtelier, obtenirEntreeBibliotheque, obtenirDomaine, obtenirFichesDomaine, enregistrerConsultation, definirFilAriane, normaliser, slugifier, regrouper, formaterDateRelative }) {
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
  const lues = fiches.filter((fiche) => progression.auMoins(fiche.id, 'compris')).length;

  definirFilAriane([{ label: 'Bibliothèque', route: 'accueil' }, { label: domaine.nom }]);
  elements.contenu.innerHTML = `
    <header class="domain-header">
      <div class="eyebrow">${echapperHTML(domaine.groupe)}</div>
      <h1 class="page-title">${echapperHTML(domaine.nom)}</h1>
      <p class="page-intro">${echapperHTML(domaine.description)}. Les fiches sont organisées par sujet pour servir à la fois de parcours et de référence rapide.</p>
      <div class="domain-header__meta">
        <span class="meta-pill">${fiches.length} fiches</span>
        <span class="meta-pill">${Object.keys(categories).length} catégories</span>
        <span class="meta-pill">${lues} comprise${lues > 1 ? 's' : ''} · déclaré</span>
      </div>
    </header>
    ${creerPreparationDomaine(idDomaine, false, true)}
    ${Object.entries(categories).map(([categorie, elementsCategorie]) => `
      <section class="category-section" id="${slugifier(categorie)}">
        <header class="category-section__head">
          <h2>${echapperHTML(categorie)}</h2>
          <span>${elementsCategorie.length} notion${elementsCategorie.length > 1 ? 's' : ''}</span>
        </header>
        ${elementsCategorie.map(creerLigneFiche).join('')}
      </section>`).join('')}`;
}

const libellesSysteme = { windows: 'Windows · PowerShell', linux: 'Linux · terminal', mac: 'macOS · Terminal' };

function creerChoixSysteme() {
  return `<div class="platform-choice" role="group" aria-label="Choisir votre système">
    ${Object.entries(libellesSysteme).map(([id, libelle]) => `<button class="filter-chip ${etat.systeme === id ? 'is-active' : ''}" type="button" data-systeme="${id}" aria-pressed="${etat.systeme === id}">${echapperHTML(libelle)}</button>`).join('')}
  </div>`;
}

function creerCarteOutil(id, index = 0) {
  const outil = etat.documentation.environnements?.outils?.[id];
  if (!outil) return '';
  return `<details class="setup-tool" ${index === 0 ? 'open' : ''}>
    <summary>${echapperHTML(outil.nom)} <span>installer · vérifier · comprendre</span></summary>
    <p><strong>À quoi il sert :</strong> ${echapperHTML(outil.role)}</p>
    <p><strong>Pourquoi ici :</strong> ${echapperHTML(outil.pourquoi)}</p>
    ${Object.entries(libellesSysteme).map(([systeme, libelle]) => {
      const instruction = outil.systemes[systeme];
      return `<div class="platform-panel" data-platform-panel="${systeme}" ${etat.systeme === systeme ? '' : 'hidden'}>
        <h4>${echapperHTML(libelle)}</h4>
        <p>${echapperHTML(instruction.ouvrir)}</p>
        <ol>${instruction.etapes.map((etape) => `<li>${echapperHTML(etape)}</li>`).join('')}</ol>
        <p class="setup-check-label">Vérifier sans modifier le projet</p>
        <pre class="tree-block"><code>${echapperHTML(outil.verifier[systeme])}</code></pre>
        <p class="setup-diagnostic"><strong>Si cela échoue :</strong> ${echapperHTML(instruction.diagnostic)}</p>
      </div>`;
    }).join('')}
    <p class="setup-warning"><strong>Attention :</strong> ${echapperHTML(outil.attention)}</p>
    <div class="official-links">${outil.sources.map((source) => `<a class="official-link" href="${echapperAttribut(source.url)}" target="_blank" rel="noreferrer"><span>${echapperHTML(source.label)}</span><span aria-hidden="true">↗</span></a>`).join('')}</div>
  </details>`;
}

function creerPreparation(identifiants, ouvert = false) {
  const outils = [...new Set(identifiants)].filter((id) => etat.documentation.environnements?.outils?.[id]);
  if (!outils.length) return '';
  return `<details class="setup-panel" ${ouvert ? 'open' : ''}>
    <summary><span>⌘ Préparer mon environnement</span><small>${outils.length} outil${outils.length > 1 ? 's' : ''} · Windows, Linux, macOS</small></summary>
    <div class="setup-panel__body">
      <p>Choisissez le système et le terminal que vous utilisez réellement. La préparation explique quoi installer, comment vérifier et pourquoi l’outil est nécessaire ; aucune commande n’est lancée automatiquement.</p>
      ${creerChoixSysteme()}
      <p class="setup-primer">Première fois dans un terminal ? <button class="text-link" type="button" data-fiche="shell-premier-terminal">Voir « Ouvrir le terminal et retrouver son dossier » →</button></p>
      <div class="setup-tools">${outils.map(creerCarteOutil).join('')}</div>
      <button class="text-link" type="button" data-route="installation">Voir tous les outils et leurs alternatives →</button>
    </div>
  </details>`;
}

function creerPreparationDomaine(domaine, atelier = false, ouvert = false) {
  const outils = etat.documentation.environnements?.domaines?.[domaine] || [];
  return creerPreparation(atelier ? ['terminal', ...outils] : outils, ouvert);
}

function creerPreparationReference(entree) {
  const outilsConnus = etat.documentation.environnements?.outils || {};
  const correspondants = Object.entries(outilsConnus).filter(([, outil]) =>
    outil.references.some((nom) => normaliser(nom) === normaliser(entree.terme))).map(([id]) => id);
  return creerPreparation(entree.environnement || correspondants);
}

function creerExecutionAtelier(atelier) {
  return `<section class="workshop-section setup-run" id="atelier-lancer">
    <h2>Lancer cet atelier sur votre système</h2>
    <p>Placez-vous dans le dossier indiqué plus haut. Vérifiez la présence du fichier ou du projet avant de lancer la commande. Les fragments de leçon peuvent exiger les imports ou le projet complet décrits dans les prérequis.</p>
    ${creerChoixSysteme()}
    ${Object.entries(libellesSysteme).map(([systeme, libelle]) => `<div class="platform-panel" data-platform-panel="${systeme}" ${etat.systeme === systeme ? '' : 'hidden'}><h3>${echapperHTML(libelle)}</h3><pre class="tree-block"><code>${echapperHTML(atelier.execution[systeme])}</code></pre></div>`).join('')}
  </section>`;
}

function afficherInstallation() {
  definirFilAriane([{ label: 'Bibliothèque', route: 'accueil' }, { label: 'Préparer mon poste' }]);
  const ids = Object.keys(etat.documentation.environnements?.outils || {});
  elements.contenu.innerHTML = `<header class="listing-header"><div class="eyebrow">Windows · Linux · macOS</div><h1 class="page-title">Préparer mon poste</h1><p class="page-intro">Commencez par le terminal. Installez ensuite uniquement les outils nécessaires à votre parcours ; chaque carte explique son rôle, sa vérification et les risques à éviter.</p><div class="domain-header__meta"><span class="meta-pill">${ids.length} outils expliqués</span><span class="meta-pill">Sources officielles</span><span class="meta-pill">Aucune installation automatique</span></div></header>
    ${creerPreparation(ids, true)}
    <section class="dashboard-section"><div class="section-title-row"><h2>Premiers pas guidés</h2></div><div class="panel"><ul class="study-list">${['shell-premier-terminal', 'shell-installer-verifier-outil', 'shell-powershell-bash'].map(obtenirFiche).filter(Boolean).map(creerElementEtude).join('')}</ul></div></section>`;
}

function afficherBibliotheque() {
  const entrees = etat.documentation.bibliotheque || [];
  const categories = [...new Set(entrees.map((entree) => entree.categorie))];
  definirFilAriane([{ label: 'Bibliothèque', route: 'accueil' }, { label: 'Référence technique' }]);
  elements.contenu.innerHTML = `
    <header class="listing-header library-header">
      <div class="eyebrow">Référence interne · code · données · infrastructure</div>
      <h1 class="page-title">Bibliothèque technique</h1>
      <p class="page-intro">Retrouver un terme, son contexte et ses sources. Les notices à approfondir sont distinguées des explications rédigées.</p>
      <div class="domain-header__meta"><span class="meta-pill">${entrees.length} références</span><span class="meta-pill">${categories.length} familles</span><span class="meta-pill">Maturité indiquée pour chaque notion</span></div>
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
  const entrees = catalogue.chercher(recherche, { type: 'reference', categorie: etat.bibliothequeCategorie === 'Toutes' ? undefined : etat.bibliothequeCategorie, limite: Infinity });
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
    <span class="library-card__foot"><span>${echapperHTML(MATURITE[entree.maturiteEditoriale])}</span><strong>Lire la fiche →</strong></span>
  </button>`;
}



function afficherTermeBibliotheque(id) { const entree = obtenirEntreeBibliotheque(id); if (!entree) return afficherIntrouvable('Référence introuvable'); obtenirVues().reference(entree); }





function creerLigneFiche(fiche) {
  const estLue = progression.auMoins(fiche.id, 'compris');
  return `
    <button class="topic-row ${estLue ? 'is-read' : ''}" type="button" data-fiche="${fiche.id}">
      <span class="topic-row__dot" title="${estLue ? 'Compris · déclaré' : 'À étudier'}"></span>
      <span><h3>${echapperHTML(fiche.titre)}</h3><p>${echapperHTML(fiche.resume)}</p></span>
      <span class="topic-row__arrow">→</span>
    </button>`;
}

function afficherFiche(id) {
  const idsParcoursDebutant = obtenirParcours();
  const fiche = obtenirFiche(id);
  if (!fiche) return afficherIntrouvable('Fiche introuvable');
  const domaine = obtenirDomaine(fiche.domaine);
  etat.ficheActive = fiche;
  etat.domaineActif = fiche.domaine;
  enregistrerConsultation(id);

  const fichesDomaine = obtenirFichesDomaine(fiche.domaine);
  const index = fichesDomaine.findIndex((element) => element.id === id);
  const aRevoir = etat.stockage.revoir.includes(id);
  const estLue = progression.auMoins(id, 'compris');
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
      <p class="article-header__summary">${echapperHTML(fiche.resume)}</p>${statut(progression, fiche.id)}<p class="editorial-status">${echapperHTML(MATURITE[fiche.maturiteEditoriale])}</p>
      <div class="article-header__actions">
        <button class="secondary-button ${aRevoir ? 'is-active' : ''}" type="button" data-toggle-revoir="${fiche.id}">◎ ${aRevoir ? 'Dans À revoir' : 'Marquer à revoir'}</button>
        <button class="secondary-button ${estLue ? 'is-active' : ''}" type="button" data-compris="${fiche.id}">${estLue ? 'Compris · déclaré' : 'J’ai compris l’idée'}</button>
        <button class="secondary-button" type="button" data-action="partager">↗ Partager cette leçon</button>
      </div>
    </header>

    <div class="article-layout">
      <article class="article-body">
        <div class="callout callout--retenir article-reading-guide"><span class="callout__label">Comment apprendre ici</span><p>Lisez d’abord l’idée et prédisez le résultat du code. Testez l’exemple dans votre navigateur ou terminal, faites le défi sans regarder la réponse, puis ouvrez le corrigé pour vérifier votre raisonnement.</p></div>
        ${obtenirVues().graphe(fiche)}${obtenirVues().vocabulaire(fiche)}${creerPreparationDomaine(fiche.domaine, false, ['python', 'java', 'springboot', 'cpp', 'csharp', 'php'].includes(fiche.domaine))}
        ${positionDebutant >= 0 ? `<div class="learning-position"><span>Parcours débutant · étape ${positionDebutant + 1}/${idsParcoursDebutant.length}</span>${precedentDebutant ? `<button type="button" data-fiche="${precedentDebutant.id}">Étape précédente : ${echapperHTML(precedentDebutant.titre)}</button>` : ''}${suivantDebutant ? `<button type="button" data-fiche="${suivantDebutant.id}">Ensuite : ${echapperHTML(suivantDebutant.titre)} →</button>` : ''}</div>` : ''}
        ${creerPlanSessions(fiche)}
        ${fiche.sections.map((section, sectionIndex) => section.profondeur > 0 ? `<details class="depth-details"><summary>${echapperHTML(section.titre)} · approfondir</summary>${creerSection(section, sectionIndex)}</details>` : creerSection(section, sectionIndex)).join('')}
        ${entrainement(fiche, progression)}
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



function creerLienPagination(fiche, libelle, classe) {
  return `<button class="page-link ${classe}" type="button" data-fiche="${fiche.id}"><small>${libelle}</small><strong>${echapperHTML(fiche.titre)}</strong></button>`;
}





function afficherAteliers() {
  definirFilAriane([{ label: 'Bibliothèque', route: 'accueil' }, { label: 'Ateliers pratiques' }]);
  const ateliers = etat.documentation.ateliers;
  const domaines = [...new Set(ateliers.map((atelier) => atelier.domaine))];
  elements.contenu.innerHTML = `
    <header class="listing-header workshop-header">
      <div class="eyebrow">Apprendre en construisant</div>
      <h1 class="page-title">S’entraîner à résoudre un problème</h1>
      <p class="page-intro">Choisissez votre degré d’aide : exercice court, atelier guidé, défi ou projet. Essayez avant de consulter les indices, puis vérifiez le résultat.</p>
      <div class="domain-header__meta"><span class="meta-pill">${ateliers.length} ateliers</span><span class="meta-pill">${etat.stockage.ateliers.length} terminés</span><span class="meta-pill">Progression locale</span></div>
    </header>
    <div class="training-modes"><a href="#/revoir">Rappels de mémoire</a><a href="#/projets">Projets et missions</a><a href="#/erreurs">Diagnostics d’erreurs</a></div>
    <div class="atelier-filters" role="group" aria-label="Filtrer les ateliers">
      <button class="filter-chip ${etat.ateliersFiltre === 'tous' ? 'is-active' : ''}" type="button" data-atelier-filter="tous">Tous</button>
      ${domaines.map((domaine) => `<button class="filter-chip ${etat.ateliersFiltre === domaine ? 'is-active' : ''}" type="button" data-atelier-filter="${domaine}">${echapperHTML(obtenirDomaine(domaine)?.nom || domaine)}</button>`).join('')}
    </div>
    <div class="atelier-grid" id="liste-ateliers"></div>`;
  actualiserCartesAteliers();
}

function actualiserCartesAteliers() {
  const conteneur = document.querySelector('#liste-ateliers');
  if (!conteneur) return;
  const ateliers = etat.documentation.ateliers.filter((atelier) =>
    etat.ateliersFiltre === 'tous' || atelier.domaine === etat.ateliersFiltre);
  const visibles = ateliers.slice(0, etat.ateliersLimite);
  conteneur.innerHTML = visibles.map(creerCarteAtelier).join('') +
    (ateliers.length > visibles.length ? `<div class="workshop-more"><p>${visibles.length} ateliers affichés sur ${ateliers.length}.</p><button class="primary-button" type="button" data-ateliers-more>Afficher 48 ateliers supplémentaires</button></div>` : '');
}

function creerCarteAtelier(atelier) {
  const domaine = obtenirDomaine(atelier.domaine);
  const termine = etat.stockage.ateliers.includes(atelier.id);
  return `<article class="atelier-card ${termine ? 'is-complete' : ''}" data-atelier-domain="${echapperAttribut(atelier.domaine)}">
    <div class="atelier-card__head"><span class="article-badge">${echapperHTML(domaine?.nom || atelier.domaine)}</span><span class="atelier-card__status">${termine ? '✓ Terminé' : echapperHTML(atelier.duree)}</span></div>
    <h2>${echapperHTML(atelier.titre)}</h2>
    <p>${echapperHTML(atelier.objectif || atelier.resume)}</p>
    <div class="atelier-card__meta"><span>${echapperHTML(atelier.niveau)}</span><span>${echapperHTML(atelier.format || 'atelier')}</span><span>Pratique guidée</span></div>
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
      <h1>${echapperHTML(atelier.titre)}</h1><p class="article-header__summary">${echapperHTML(atelier.objectif || atelier.resume)}</p>
      <div class="article-header__actions"><button class="secondary-button ${termine ? 'is-active' : ''}" type="button" data-toggle-atelier="${atelier.id}">${termine ? '✓ Terminé · déclaré' : 'Déclarer mon atelier terminé'}</button></div>
    </header>
    <div class="atelier-layout">
      <article class="article-body">
        <div class="callout callout--retenir"><span class="callout__label">Méthode</span><p>Lisez l’objectif, préparez les outils, exécutez une étape à la fois, puis utilisez la validation. Une erreur est une information : lisez le message avant de modifier le code.</p></div>
        ${creerPreparationDomaine(atelier.domaine, true, Boolean(atelier.execution))}
        <section class="workshop-section" id="atelier-outils"><h2>Outils nécessaires</h2><div class="tool-list">${atelier.outils.map((outil) => `<span class="tool-chip">${echapperHTML(outil)}</span>`).join('')}</div></section>
        <section class="workshop-section"><h2>Avant de commencer</h2><ul class="checklist">${(atelier.prerequisLibelles || []).map((item) => `<li>${echapperHTML(item)}</li>`).join('')}</ul></section>
        <section class="workshop-section"><h2>Structure à créer</h2><pre class="tree-block"><code>${echapperHTML(atelier.structure.join('\n'))}</code></pre></section>
        ${atelier.execution ? creerExecutionAtelier(atelier) : ''}
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


return { creerCarteDomaine, afficherDomaine, afficherFiche, afficherTermeBibliotheque, afficherBibliotheque, actualiserCartesBibliotheque, afficherAteliers, afficherAtelier, actualiserCartesAteliers, afficherInstallation, afficherIntrouvable };
}
