import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { Catalogue } from '../public/modules/catalogue.mjs';
import { creerRecherche } from '../public/modules/recherche.mjs';
import { Progression, CLE } from '../public/modules/progression.mjs';
const require = createRequire(import.meta.url);
const c = require('../src/data');
const historique = require('./fixtures/identifiants-v1.json');
const meta = JSON.parse(fs.readFileSync('public/catalogue/meta.json'));
const index = JSON.parse(fs.readFileSync(`public${meta.base}/index-recherche.json`));
const memoire = initial => {
  const valeurs = new Map(Object.entries(initial || {}).map(([k, v]) => [k, JSON.stringify(v)]));
  return { getItem: k => valeurs.get(k) ?? null, setItem: (k, v) => valeurs.set(k, v) };
};

test('identifiants historiques préservés et graphes valides', () => {
  for (const k of Object.keys(historique)) for (const id of historique[k]) assert.ok(c[k].some(e => e.id === id), `${k}/${id}`);
  const connus = new Set(c.fiches.map(e => e.id));
  for (const e of [...c.fiches, ...c.ateliers, ...c.bibliotheque]) {
    for (const id of e.prerequis) assert.ok(connus.has(id), `${e.id} → ${id}`);
    assert.ok(['draft', 'structured', 'enriched', 'reviewed', 'verified'].includes(e.maturiteEditoriale));
    if (['reviewed', 'verified'].includes(e.maturiteEditoriale)) assert.ok(e.revue?.date && e.revue?.auteur);
  }
});

test('les notices générées ne publient ni faux article ni syntaxe fictive', () => {
  for (const e of c.bibliotheque.filter(e => e.maturiteEditoriale === 'draft')) {
    assert.deepEqual(e.article, []); assert.deepEqual(e.exemples, []);
    assert.ok(e.sources.length);
  }
});

test('les références des nouveaux langages et outils montrent un usage concret', () => {
  const nouvelles = require('../src/data/bibliotheque-nouveaux');
  assert.equal(nouvelles.length, 79);
  for (const source of nouvelles) {
    const reference = c.bibliotheque.find(e => e.id === source.id);
    assert.notEqual(reference?.maturiteEditoriale, 'draft', source.id);
    assert.ok(reference.definition.length > 40, source.id);
    assert.ok(reference.exemples.some(e => e.contenu.trim()), source.id);
    assert.ok(reference.exercice.etapes.length >= 4, source.id);
    assert.ok(reference.sources.some(s => s.url?.startsWith('https://')), source.id);
    if (reference.provenance === 'adaptation-lecon') {
      assert.ok(reference.exemples.some(e => e.titre.startsWith('Fichier complet : ')), source.id);
      assert.ok(reference.article.some(t => t.includes('Fichiers attendus :')), source.id);
      assert.ok(c.fiches.some(f => f.id === reference.source.id), source.id);
    }
  }
});

test('les éléments HTML rédigés ont un exemple et une source dédiés', () => {
  const { elements } = require('../src/pedagogie/references-html-redigees');
  for (const terme of Object.keys(elements)) {
    const reference = c.bibliotheque.find(e => e.id.startsWith('ref-htmlBalise-') && e.terme === terme);
    assert.equal(reference?.maturiteEditoriale, 'enriched', terme);
    assert.match(reference.exemples[0].contenu, /</, terme);
    assert.equal(reference.sources[0].url, `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/${terme === 'h1' ? 'Heading_Elements' : terme}`);
    assert.equal(reference.source, null, terme);
  }
  assert.equal(c.bibliotheque.find(e => e.id === 'ref-htmlBalise-base-8').source, undefined);
});

test('les propriétés CSS rédigées montrent un effet et sa limite', () => {
  const { proprietes } = require('../src/pedagogie/references-css-redigees');
  for (const terme of Object.keys(proprietes)) {
    const reference = c.bibliotheque.find(e => e.id.startsWith('ref-cssPropriete-') && e.terme === terme);
    assert.equal(reference?.maturiteEditoriale, 'enriched', terme);
    assert.ok(reference.exemples[0].contenu.includes(`${terme}:`), terme);
    assert.ok(reference.article[1].length > 35, terme);
    assert.equal(reference.sources[0].url, `https://developer.mozilla.org/en-US/docs/Web/CSS/${terme}`);
  }
});

test('chaque résultat rejoint son fragment ; accueil sous 160 Ko', () => {
  assert.ok(fs.statSync('public/catalogue/meta.json').size < 160000);
  for (const r of index) {
    const contenu = JSON.parse(fs.readFileSync(`public${meta.base}/${r.fichier}`));
    const e = Array.isArray(contenu) ? contenu.find(e => e.id === r.id) : contenu;
    assert.equal(e.id, r.id);
  }
});

test('accueil et leçon ne téléchargent ni index ni catalogue complet', async () => {
  const requetes = [];
  const catalogue = new Catalogue(async url => { requetes.push(url); return { ok: true, json: async () => JSON.parse(fs.readFileSync(`public${url}`)) }; });
  await catalogue.initialiser(); await catalogue.charger('fiche', 'html-document');
  assert.equal(requetes.length, 2);
  assert.equal(catalogue.meta.fiches.find(f => f.id === 'html-document').fichier, 'fiches/html-document.json');
  assert.ok(requetes.every(url => !url.includes('documentation') && !url.includes('index-recherche')));
  await catalogue.charger('fiche', 'html-document'); assert.equal(requetes.length, 2);
});

test('chargement échoué réessayable sans promesse empoisonnée', async () => {
  let essai = 0;
  const catalogue = new Catalogue(async () => ({ ok: ++essai > 1, json: async () => meta }));
  await assert.rejects(catalogue.initialiser()); await catalogue.initialiser(); assert.equal(essai, 2);
});

test('recherche exacte, code HTML et ambiguïtés ont des résultats contextualisés', () => {
  const rechercher = creerRecherche(index);
  for (const q of ['map', 'class', 'route', 'server', 'token', 'index', 'process', '<div>']) {
    const r = rechercher(q); assert.ok(r.length, q);
    assert.ok(r.every(e => e.type && (e.categorie || e.domaine || e.famille)));
  }
  const petit = creerRecherche([{ id: 'contexte', titre: 'Lire', contexte: 'map' }, { id: 'exact', titre: 'map' }]);
  assert.equal(petit('map')[0].id, 'exact');
});

test('migration conserve les anciennes clés et les identifiants inconnus sans accorder la maîtrise', () => {
  const s = memoire({ 'bibliolearn.lues': ['js-types', 'ancien-id'], 'bibliolearn.ateliers': ['atelier-a'], 'bibliolearn.recent': ['html-document'] });
  const p = new Progression(s);
  assert.equal(p.etat('js-types'), 'compris'); assert.equal(p.etat('ancien-id'), 'compris');
  assert.equal(p.etat('html-document'), 'vu'); assert.deepEqual(p.donnees.anciensAteliers, ['atelier-a']);
  const texte = s.getItem(CLE); new Progression(s); assert.equal(s.getItem(CLE), texte);
  assert.deepEqual(JSON.parse(s.getItem('bibliolearn.lues')), ['js-types', 'ancien-id']);
});

const questions = [{ id: 'a', correct: 1 }, { id: 'b', correct: 0 }];
test('maîtrise exige pratique, évaluation et rappels à des dates distinctes', () => {
  let date = 1000000000; const p = new Progression(memoire(), () => date);
  p.voir('js-types'); p.comprendre('js-types'); assert.equal(p.etat('js-types'), 'compris');
  p.pratiquer('js-types', 'Je prédis 4 car les deux valeurs sont des nombres.');
  p.evaluer('js-types', questions, { a: 1, b: 0 }); assert.equal(p.etat('js-types'), 'verifie');
  p.evaluer('js-types', questions, { a: 1, b: 0 }); assert.equal(p.etat('js-types'), 'verifie');
  date += 86400000; assert.deepEqual(p.aReviser(), ['js-types']);
  p.evaluer('js-types', questions, { a: 1, b: 0 }); assert.equal(p.etat('js-types'), 'verifie');
  date += 3 * 86400000; p.evaluer('js-types', questions, { a: 1, b: 0 }); assert.equal(p.etat('js-types'), 'maitrise');
  p.evaluer('js-types', questions, { a: 0, b: 0 }); assert.equal(p.etat('js-types'), 'pratique');
});

test('relecture de correction, quiz incomplet et stockage bloqué ne valident pas une compétence', () => {
  const p = new Progression({ getItem() { throw Error(); }, setItem() { throw Error(); } });
  assert.equal(p.persistante, false); p.comprendre('js-types');
  assert.equal(p.pratiquer('js-types', ''), false);
  assert.equal(p.evaluer('js-types', questions, { a: 1 }), null);
  p.evaluer('js-types', questions, { a: 1, b: 0 }); assert.equal(p.etat('js-types'), 'compris');
});
