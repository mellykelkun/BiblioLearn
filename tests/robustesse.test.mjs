import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { Progression, CLE } from '../public/modules/progression.mjs';
const require = createRequire(import.meta.url);
const { lireCatalogueDistant, empreinte } = require('../src/catalogue-distant');
const c = require('../src/data');
test('le miroir Supabase restitue le même catalogue et refuse un export ancien ou altéré', async () => {
  const local = { meta: { version: 5 }, fiches: [{ id: 'a' }] };
  const lire = valeur => lireCatalogueDistant({ local, url: 'https://example.invalid', cle: 'test', requete: async url => {
    assert.equal(url.searchParams.get('key'), 'eq.catalogue-v5');
    return { ok: true, json: async () => [{ value: valeur }] };
  } });
  assert.deepEqual(await lire({ empreinte: empreinte(local), catalogue: local }), local);
  assert.deepEqual(await lire({ empreinte: empreinte(local), catalogue: { fiches: local.fiches, meta: local.meta } }), local);
  await assert.rejects(lire({ empreinte: 'ancienne', catalogue: local }));
  await assert.rejects(lire({ empreinte: empreinte(local), catalogue: {} }));
});
test('une sauvegarde locale corrompue est conservée pour récupération', () => {
  const valeurs = new Map([[CLE, '{pas-du-json'], ['bibliolearn.lues', '["ancienne-fiche"]']]);
  const p = new Progression({ getItem: k => valeurs.get(k) || null, setItem: (k, v) => valeurs.set(k, v) });
  assert.equal(valeurs.get(CLE + '.recuperation'), '{pas-du-json');
  assert.equal(p.etat('ancienne-fiche'), 'compris');
});
test('les prérequis restent orientés et les sources/évaluations nouvelles sont valides', () => {
  const ids = new Set(c.fiches.map(e => e.id));
  for (const p of c.parcours) for (const etape of p.etapes) for (const id of etape.fiches) assert.ok(ids.has(id));
  for (const e of [...c.fiches, ...c.erreurs, ...c.projets].filter(e => e.provenance === 'redaction-specifique')) {
    assert.ok(e.sources.length);
    for (const s of e.sources) assert.equal(new URL(s.url).protocol, 'https:');
    for (const p of e.prerequis) assert.ok(ids.has(p));
    if (e.evaluation) for (const q of e.evaluation.questions) {
      assert.ok(q.choix.length >= 2 && q.correct >= 0 && q.correct < q.choix.length);
      assert.ok(q.explication && q.id);
    }
  }
  assert.deepEqual(c.fiches.find(e => e.id === 'js-promises').prerequis, ['js-fonctions', 'js-callbacks', 'js-synchronisme', 'js-erreurs']);
});
test('la PWA ne précache jamais le catalogue complet et chaque module ES est disponible hors ligne', () => {
  const sw = fs.readFileSync('public/sw.js', 'utf8');
  const shell = sw.match(/const SHELL = (\[[\s\S]*?\]);/)[1];
  assert.ok(!shell.includes('documentation.json') && !shell.includes('index-recherche'));
  for (const fichier of fs.readdirSync('public/modules').filter(f => f.endsWith('.mjs'))) assert.ok(shell.includes('/modules/' + fichier), fichier);
});
test('les exemples publiés produisent les résultats annoncés', async () => {
  const { runInNewContext } = await import('node:vm');
  const promesse = c.bibliotheque.find(e => e.id === 'promises-js').exemples[0].contenu;
  const sorties = [];
  await runInNewContext(promesse, { console: { log: v => sorties.push(v), error: e => { throw e; } } });
  assert.deepEqual(sorties, [6]);
  const tableaux = c.bibliotheque.find(e => e.id === 'map-filter-reduce').exemples[0].contenu;
  const resultat = runInNewContext(tableaux + '\nJSON.stringify({doubles, petits, total, prix});');
  assert.deepEqual(JSON.parse(resultat), { doubles: [20, 40, 60], petits: [10, 20], total: 60, prix: [10, 20, 30] });
});
