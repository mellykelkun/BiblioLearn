export const CLE = 'bibliolearn.progression.v2';
export const ETATS = ['vu', 'compris', 'pratique', 'verifie', 'maitrise'];
export const LIBELLES = { vu: 'Vu', compris: 'Compris · déclaré', pratique: 'Pratiqué', verifie: 'Vérifié par questionnaire', maitrise: 'Maîtrisé · rappels réussis' };
const JOUR = 86400000;
const DELAIS = [1, 3, 7, 14, 30];
const objet = v => v && typeof v === 'object' && !Array.isArray(v);
const idValide = id => typeof id === 'string' && /^[a-z0-9][a-z0-9_-]*$/i.test(id) && !['constructor', 'prototype', '__proto__'].includes(id);
function lire(storage, cle, defaut) {
  try { const valeur = storage.getItem(cle); return valeur ? JSON.parse(valeur) : defaut; } catch { return defaut; }
}
function liste(v) { return Array.isArray(v) ? v : []; }

export function migrer(storage, maintenant = Date.now()) {
  const ancien = lire(storage, CLE, null);
  const donnees = objet(ancien) && ancien.version === 2 && objet(ancien.notions) ? ancien : { version: 2, notions: {}, anciensAteliers: [], migreLe: maintenant };
  // Import idempotent, y compris les identifiants hors catalogue ; aucune ancienne clé effacée.
  const lues = liste(lire(storage, 'bibliolearn.lues', []));
  const recentes = liste(lire(storage, 'bibliolearn.recent', []));
  for (const entree of recentes) {
    const id = typeof entree === 'string' ? entree : entree?.id;
    if (idValide(id) && !Object.hasOwn(donnees.notions, id)) donnees.notions[id] = { etat: 'vu', preuves: [], vuLe: entree.date || maintenant };
  }
  for (const id of lues) {
    if (!idValide(id)) continue;
    const n = donnees.notions[id] ||= { etat: 'vu', preuves: [] };
    if (!n.ancienneDeclaration) {
      n.ancienneDeclaration = true;
      if (ETATS.indexOf(n.etat) < 1) n.etat = 'compris';
    }
  }
  donnees.anciensAteliers = [...new Set([...liste(donnees.anciensAteliers), ...liste(lire(storage, 'bibliolearn.ateliers', []))])].filter(idValide);
  return donnees;
}

export class Progression {
  constructor(storage, maintenant = () => Date.now(), avertir = () => {}) {
    this.storage = storage; this.maintenant = maintenant; this.avertir = avertir;
    this.donnees = migrer(storage, maintenant()); this.sauver();
  }
  sauver() {
    try { this.storage.setItem(CLE, JSON.stringify(this.donnees)); this.persistante = true; }
    catch { this.persistante = false; this.avertir('La progression reste en mémoire pour cette session : le stockage de cet appareil est indisponible.'); }
  }
  notion(id) {
    if (!idValide(id)) throw new Error('Identifiant de notion invalide');
    let n = this.donnees.notions[id];
    if (!objet(n)) n = this.donnees.notions[id] = { etat: 'vu', preuves: [] };
    if (!ETATS.includes(n.etat)) n.etat = 'vu';
    if (!Array.isArray(n.preuves)) n.preuves = [];
    return n;
  }
  etat(id) { return this.donnees.notions[id]?.etat || null; }
  auMoins(id, etat) { return ETATS.indexOf(this.etat(id)) >= ETATS.indexOf(etat); }
  promouvoir(n, etat) { if (ETATS.indexOf(n.etat) < ETATS.indexOf(etat)) n.etat = etat; }
  voir(id) { const n = this.notion(id); n.vuLe = this.maintenant(); this.donnees.derniereNotion = id; this.sauver(); }
  comprendre(id) { const n = this.notion(id); this.promouvoir(n, 'compris'); n.comprisLe = this.maintenant(); this.sauver(); }
  pratiquer(id, reponse) {
    if (typeof reponse !== 'string' || !reponse.trim()) return false;
    const n = this.notion(id);
    n.reponse = reponse.slice(0, 16000); n.pratiqueLe = this.maintenant();
    this.promouvoir(n, 'pratique'); this.sauver(); return true;
  }
  evaluer(id, questions, reponses, version = 1) {
    if (!Array.isArray(questions) || questions.length < 2 || questions.some(q => !Number.isInteger(reponses[q.id]))) return null;
    const n = this.notion(id), date = this.maintenant();
    const details = questions.map(q => ({ id: q.id, reussi: q.correct === reponses[q.id], explication: q.explication }));
    const reussi = details.every(q => q.reussi);
    const jour = Math.floor(date / JOUR);
    // Une correction lue aujourd'hui ne devient pas une nouvelle preuve en recommençant.
    const dejaEvalue = n.preuves.some(p => Math.floor(p.date / JOUR) === jour);
    const echue = !n.prochaineRevision || date >= n.prochaineRevision;
    n.preuves.push({ date, reussi, version, questions: questions.map(q => q.id), compte: !dejaEvalue && echue });
    if (!dejaEvalue && echue) {
      n.serie = reussi ? (n.serie || 0) + 1 : 0;
      n.prochaineRevision = date + DELAIS[Math.min(Math.max(n.serie - 1, 0), DELAIS.length - 1)] * JOUR;
    }
    if (!reussi) {
      n.serie = 0; n.prochaineRevision = date + JOUR;
      if (this.auMoins(id, 'verifie')) n.etat = n.reponse ? 'pratique' : 'compris';
    } else if (this.auMoins(id, 'pratique') && !dejaEvalue && echue) {
      this.promouvoir(n, 'verifie');
      const succes = n.preuves.filter(p => p.compte && p.reussi);
      if (n.serie >= 3 && succes.length >= 3 && date - succes[0].date >= 4 * JOUR) this.promouvoir(n, 'maitrise');
    }
    this.sauver(); return { reussi, details, compte: !dejaEvalue && echue, prochaineRevision: n.prochaineRevision };
  }
  aReviser() {
    return Object.entries(this.donnees.notions).filter(([, n]) => n?.prochaineRevision && n.prochaineRevision <= this.maintenant()).map(([id]) => id);
  }
}
