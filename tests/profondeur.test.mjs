import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync, spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const catalogue = require('../src/data');
const lecons = [...require('../src/pedagogie/profondeur-langages').lecons, ...require('../src/pedagogie/profondeur-interfaces').lecons, ...require('../src/pedagogie/sql-pratique').lecons];

test('les parcours spécialisés couvrent leurs étapes et guident le passage au suivant', () => {
  const ids = new Set(catalogue.fiches.map(f => f.id));
  for (const nom of ['python', 'java', 'springboot', 'cpp', 'csharp', 'php', 'vue', 'angular', 'react-next', 'typescript', 'sql', 'fullstack-java', 'fullstack-php']) {
    const parcours = catalogue.parcours.find(p => p.id === nom);
    assert.ok(parcours, nom);
    assert.ok(parcours.etapes.length >= 2, nom);
    for (const etape of parcours.etapes) {
      assert.ok(etape.preuve?.length > 35, `${nom} : résultat observable`);
      for (const id of etape.fiches) assert.ok(ids.has(id), `${nom} : ${id}`);
    }
    if (parcours.suite) assert.ok(catalogue.parcours.some(p => p.id === parcours.suite), `${nom} : suite`);
  }
  assert.ok(catalogue.parcours.every(p => p.famille && p.etapes.length), 'famille de parcours manquante');
  assert.deepEqual(catalogue.fiches.filter(f => !f.parcours.length).map(f => f.id), [], 'leçons sans parcours');
});

test('les nouvelles notions possèdent une leçon, un exercice et une référence cherchable', () => {
  for (const lecon of lecons) {
    const codes = lecon.sections.filter(s => s.type === 'code');
    assert.ok(codes.length >= 2, lecon.id);
    assert.ok(lecon.sections.some(s => s.type === 'exercice' && s.contenu.length > 60), lecon.id);
    assert.ok(lecon.sections.some(s => s.type === 'solution' && s.contenu.length > 60), lecon.id);
    const reference = catalogue.bibliotheque.find(r => r.source?.id === lecon.id && r.maturiteEditoriale === 'enriched');
    assert.ok(reference?.exemples.length >= 2 && reference.sources?.[0]?.url.startsWith('https://'), lecon.id);
  }
});

function disponible(nom) { return spawnSync(nom, ['--version'], { stdio: 'ignore' }).status === 0; }
function executer(id, binaire, args, nomFichier, compilation) {
  const dossier = fs.mkdtempSync(path.join(os.tmpdir(), 'bibliolearn-profondeur-'));
  try {
    const lecon = lecons.find(f => f.id === id);
    fs.writeFileSync(path.join(dossier, nomFichier), lecon.sections.find(s => s.type === 'code').contenu);
    if (compilation) execFileSync(compilation[0], compilation[1], { cwd: dossier });
    return execFileSync(binaire, args, { cwd: dossier, encoding: 'utf8' }).trim();
  } finally { fs.rmSync(dossier, { recursive: true, force: true }); }
}

test('les programmes Python publiés produisent les sorties annoncées', { skip: !disponible('python3') }, () => {
  assert.equal(executer('python-dataclass-invariant', 'python3', ['livre.py'], 'livre.py'), 'Web 120');
  assert.equal(executer('python-sqlite-transaction', 'python3', ['stockage.py'], 'stockage.py'), 'Web');
});

test('les programmes C++ publiés compilent et montrent la borne et la propriété', { skip: !disponible('g++') }, () => {
  assert.equal(executer('cpp-vector-borne', './atelier', [], 'main.cpp', ['g++', ['-std=c++20', '-Wall', '-Wextra', 'main.cpp', '-o', 'atelier']]), '12\nIndice absent');
  assert.equal(executer('cpp-unique-ptr-propriete', './atelier', [], 'main.cpp', ['g++', ['-std=c++20', '-Wall', '-Wextra', 'main.cpp', '-o', 'atelier']]), '120 1');
});

test('toutes les requêtes SQL publiées s’exécutent sur leur schéma annoncé', { skip: !disponible('python3') }, () => {
  const attendus = new Map([
    ['table-contrainte', "[(1, 'Web', 1200)]"], ['select-where', "[('API', 2400), ('SQL', 1800)]"],
    ['parametre', '[]'], ['jointure', "[('Web', 'Awa'), ('API', 'Awa'), ('SQL', 'Léa')]"],
    ['grouper-compter', '[(1, 2)]'], ['ordre-pagination', "[(2, 'API'), (3, 'SQL')]"],
    ['cle-etrangere', '[(1,)]'], ['transaction', '[(0,)]'], ['index-plan', 'True'],
    ['migration-donnees', "[(1, 'Web', 'fr')]"]
  ]);
  for (const [slug, sortie] of attendus) {
    assert.equal(executer(`sql-${slug}`, 'python3', ['sql.py'], 'sql.py'), sortie, slug);
  }
});

test('les amorces des ateliers SQL sont préremplies et produisent un résultat vérifiable', { skip: !disponible('python3') }, () => {
  const sorties = new Map([
    ['atelier-sql-recherche-parametree', "[('Web', 1200)]\n[]"],
    ['atelier-sql-jointure-compte', "[('Awa', 2), ('Léa', 1)]"],
    ['atelier-sql-transaction', 'True\nFalse\n[(10,), (20,)]']
  ]);
  for (const [id, attendu] of sorties) {
    const atelier = catalogue.ateliers.find(a => a.id === id);
    assert.ok(atelier, id);
    const depart = atelier.fichiersDepart.find(f => f.chemin.endsWith('/sql.py'));
    assert.equal(depart.mode, 'a-ecrire');
    const dossier = fs.mkdtempSync(path.join(os.tmpdir(), 'bibliolearn-atelier-sql-'));
    try {
      fs.writeFileSync(path.join(dossier, 'sql.py'), depart.contenu);
      assert.equal(execFileSync('python3', ['sql.py'], { cwd: dossier, encoding: 'utf8' }).trim(), attendu);
    } finally { fs.rmSync(dossier, { recursive: true, force: true }); }
  }
});
