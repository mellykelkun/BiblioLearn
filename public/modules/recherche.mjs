export function normaliser(texte = '') {
  return String(texte).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[(){}[\].,:;/\\_<>-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function creerRecherche(entrees) {
  const index = entrees.map(e => ({ ...e, titreNormalise: normaliser(e.titre || e.terme),
    aliasNormalises: (e.aliases || []).map(normaliser),
    texteNormalise: normaliser([e.titre || e.terme, ...(e.aliases || []), e.resume, e.contexte, e.code, e.categorie, e.domaine, e.famille].join(' ')) }));
  return function chercher(saisie, { type, categorie, limite = 30 } = {}) {
    const q = normaliser(saisie), mots = q.split(' ').filter(Boolean);
    return index.filter(e => (!type || e.type === type) && (!categorie || e.categorie === categorie))
      .map(e => ({ ...e, score: mots.every(m => e.texteNormalise.includes(m)) ?
        (e.titreNormalise === q ? 160 : 0) + (e.aliasNormalises.includes(q) ? 130 : 0) +
        (q && e.titreNormalise.startsWith(q) ? 70 : 0) + (q && e.titreNormalise.includes(q) ? 40 : 0) +
        (e.maturiteEditoriale === 'draft' ? 0 : 5) + 1 : 0 }))
      .filter(e => e.score > 0).sort((a, b) => b.score - a.score || a.titreNormalise.localeCompare(b.titreNormalise, 'fr')).slice(0, limite);
  };
}
