'use strict';
const { createHash } = require('node:crypto');
function canonique(valeur) {
  if (Array.isArray(valeur)) return valeur.map(canonique);
  if (valeur && typeof valeur === 'object') return Object.fromEntries(Object.keys(valeur).sort().map(cle => [cle, canonique(valeur[cle])]));
  return valeur;
}
const empreinte = valeur => createHash('sha256').update(JSON.stringify(canonique(valeur))).digest('hex');
async function lireCatalogueDistant({ local, url, cle, requete = fetch }) {
  const adresse = new URL('/rest/v1/bibliolearn_catalogue_meta', url);
  adresse.searchParams.set('select', 'value');
  adresse.searchParams.set('key', `eq.catalogue-v${local.meta.version}`);
  const reponse = await requete(adresse, { headers: { apikey: cle, Authorization: `Bearer ${cle}` }, signal: AbortSignal.timeout(5000) });
  if (!reponse.ok) throw new Error(`catalogue distant HTTP ${reponse.status}`);
  const lignes = await reponse.json();
  const valeur = lignes[0]?.value;
  const attendue = empreinte(local);
  if (!valeur || valeur.empreinte !== attendue || empreinte(valeur.catalogue) !== attendue) throw new Error('catalogue distant absent ou différent de la publication locale');
  return valeur.catalogue;
}
module.exports = { lireCatalogueDistant, empreinte };
