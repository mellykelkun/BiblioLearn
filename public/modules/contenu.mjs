import { echapperHTML, echapperAttribut } from './texte.mjs';
export function creerSection(section, index) {
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
      <pre tabindex="0" aria-label="Exemple de code, défilement horizontal"><code>${echapperHTML(section.contenu)}</code></pre>
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

function libelleAlerte(variante) {
  return {
    erreur: 'Erreur fréquente',
    attention: 'Attention',
    obsolete: 'Obsolète / historique',
    'bonne-pratique': 'Bonne pratique',
    retenir: 'À retenir'
  }[variante] || 'À noter';
}
