import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const catalogue = require('../src/data');
const possede = binaire => spawnSync(binaire, ['--version'], { stdio: 'ignore' }).status === 0;

function ecrireAmorce(atelier) {
  const racine = fs.mkdtempSync(path.join(os.tmpdir(), 'bibliolearn-atelier-'));
  for (const fichier of atelier.fichiersDepart.filter(f => f.mode === 'a-ecrire')) {
    const cible = path.join(racine, fichier.chemin);
    fs.mkdirSync(path.dirname(cible), { recursive: true });
    fs.writeFileSync(cible, fichier.contenu);
  }
  const dossier = path.join(racine, atelier.structure[0].split('/')[0]);
  return { racine, dossier };
}

test('chaque module gagne une leçon spécifique et deux références rédigées', () => {
  for (const domaine of catalogue.domaines) {
    assert.ok(catalogue.fiches.some(f => f.domaine === domaine.id && f.provenance === 'redaction-specifique'), domaine.id);
    assert.equal(catalogue.bibliotheque.filter(r => r.famille === domaine.id && r.id.startsWith('pratique-')).length, 2, domaine.id);
  }
});

test('tous les chemins des ateliers ont un contenu ou un générateur explicite', () => {
  for (const atelier of catalogue.ateliers) {
    assert.deepEqual(atelier.fichiersDepart.map(f => f.chemin), atelier.structure, atelier.id);
    for (const fichier of atelier.fichiersDepart) {
      assert.ok(fichier.mode === 'a-ecrire' ? fichier.contenu.trim() : fichier.mode === 'genere' && fichier.role.trim(), `${atelier.id}: ${fichier.chemin}`);
    }
  }
});

test('l’amorce Node s’exécute réellement dans le dossier annoncé', () => {
  const atelier = catalogue.ateliers.find(a => a.id.startsWith('atelier-plus-node-'));
  const { racine, dossier } = ecrireAmorce(atelier);
  try { assert.match(execFileSync(process.execPath, ['main.js', 'Ada'], { cwd: dossier, encoding: 'utf8' }), /Bonjour Ada/); }
  finally { fs.rmSync(racine, { recursive: true, force: true }); }
});

test('l’amorce Python annoncée produit le résultat de la leçon', { skip: !possede('python3') }, () => {
  const atelier = catalogue.ateliers.find(a => a.id === 'atelier-python-variables-types-essayer');
  const { racine, dossier } = ecrireAmorce(atelier);
  try { assert.equal(execFileSync('python3', ['main.py'], { cwd: dossier, encoding: 'utf8' }).trim(), '19'); }
  finally { fs.rmSync(racine, { recursive: true, force: true }); }
});

test('l’amorce C++ compile et affiche le résultat annoncé', { skip: !possede('g++') }, () => {
  const atelier = catalogue.ateliers.find(a => a.id === 'atelier-cpp-compiler-main-essayer');
  const { racine, dossier } = ecrireAmorce(atelier);
  try {
    execFileSync('g++', ['-std=c++20', '-Wall', '-Wextra', 'main.cpp', '-o', 'atelier'], { cwd: dossier });
    assert.match(execFileSync(path.join(dossier, 'atelier'), { encoding: 'utf8' }), /Bonjour C\+\+/);
  } finally { fs.rmSync(racine, { recursive: true, force: true }); }
});

test('Spring Boot distingue les classes copiées du projet généré', () => {
  const atelier = catalogue.ateliers.find(a => a.id === 'atelier-springboot-controller-get-essayer');
  assert.ok(atelier.fichiersDepart.some(f => f.chemin.endsWith('pom.xml') && f.mode === 'genere'));
  assert.ok(atelier.fichiersDepart.some(f => f.chemin.endsWith('AtelierController.java') && f.mode === 'a-ecrire' && f.contenu.includes('package com.example.demo;') && f.contenu.includes('@GetMapping')));
  assert.match(atelier.fichiersDepart[0].contenu, /Spring Initializr/);
});

test('le niveau zéro fournit la page entière et les deux variantes de commandes', () => {
  const page = catalogue.fiches.find(f => f.id === 'zero-page-complete');
  const navigation = catalogue.fiches.find(f => f.id === 'zero-naviguer-dossiers');
  assert.match(page.sections.find(s => s.type === 'code').contenu, /<!doctype html>/);
  assert.ok(navigation.sections.some(s => s.type === 'code' && s.contenu.includes('Get-Location')));
  assert.ok(navigation.sections.some(s => s.type === 'code' && s.contenu.includes('pwd')));
});
