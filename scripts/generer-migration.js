'use strict';

const fs = require('node:fs');
const path = require('node:path');
const documentation = require('../src/data');

const destination = path.join(__dirname, '..', 'supabase', 'migrations', '20261001000000_bibliolearn_catalogue.sql');
const destinationStatique = path.join(__dirname, '..', 'public', 'documentation.json');

function json(valeur) {
  return '\'' + JSON.stringify(valeur).replaceAll("'", "''") + '\'::jsonb';
}

function texte(valeur) {
  return '\'' + String(valeur ?? '').replaceAll("'", "''") + '\'';
}

const lignes = [
  '-- Bibliolearn : catalogue documentaire isolé par préfixe.',
  '-- Généré depuis src/data. Rejouable avec : node scripts/generer-migration.js',
  'begin;',
  'create table if not exists public.bibliolearn_catalogue_meta (key text primary key, value jsonb not null);',
  'create table if not exists public.bibliolearn_domains (id text primary key, name text not null, group_name text not null, icon text not null, description text not null, sort_order integer not null default 0);',
  'create table if not exists public.bibliolearn_lessons (id text primary key, domain_id text not null references public.bibliolearn_domains(id), category text not null, title text not null, summary text not null, tags jsonb not null default \'[]\'::jsonb, level text not null, sections jsonb not null, sessions jsonb not null default \'[]\'::jsonb, related_ids jsonb not null default \'[]\'::jsonb, sort_order integer not null default 0);',
  'create table if not exists public.bibliolearn_workshops (id text primary key, domain_id text not null references public.bibliolearn_domains(id), title text not null, objective text not null, level text not null, duration text not null, tools jsonb not null default \'[]\'::jsonb, prerequisites jsonb not null default \'[]\'::jsonb, file_structure jsonb not null default \'[]\'::jsonb, steps jsonb not null default \'[]\'::jsonb, validation jsonb not null default \'[]\'::jsonb, hint text not null, related_ids jsonb not null default \'[]\'::jsonb, sort_order integer not null default 0);',
  'create index if not exists bibliolearn_lessons_domain_idx on public.bibliolearn_lessons(domain_id, sort_order);',
  'create index if not exists bibliolearn_workshops_domain_idx on public.bibliolearn_workshops(domain_id, sort_order);',
  'alter table public.bibliolearn_catalogue_meta enable row level security;',
  'alter table public.bibliolearn_domains enable row level security;',
  'alter table public.bibliolearn_lessons enable row level security;',
  'alter table public.bibliolearn_workshops enable row level security;',
  'drop policy if exists bibliolearn_meta_read on public.bibliolearn_catalogue_meta;',
  'drop policy if exists bibliolearn_domains_read on public.bibliolearn_domains;',
  'drop policy if exists bibliolearn_lessons_read on public.bibliolearn_lessons;',
  'drop policy if exists bibliolearn_workshops_read on public.bibliolearn_workshops;',
  'create policy bibliolearn_meta_read on public.bibliolearn_catalogue_meta for select to anon, authenticated using (true);',
  'create policy bibliolearn_domains_read on public.bibliolearn_domains for select to anon, authenticated using (true);',
  'create policy bibliolearn_lessons_read on public.bibliolearn_lessons for select to anon, authenticated using (true);',
  'create policy bibliolearn_workshops_read on public.bibliolearn_workshops for select to anon, authenticated using (true);',
  'insert into public.bibliolearn_catalogue_meta (key, value) values (\'catalogue\', ' + json({ ...documentation.meta, statistiques: documentation.statistiques }) + ') on conflict (key) do update set value = excluded.value;',
  'truncate table public.bibliolearn_workshops, public.bibliolearn_lessons, public.bibliolearn_domains cascade;'
];

for (const [index, domaine] of documentation.domaines.entries()) {
  lignes.push('insert into public.bibliolearn_domains (id, name, group_name, icon, description, sort_order) values (' + texte(domaine.id) + ', ' + texte(domaine.nom) + ', ' + texte(domaine.groupe) + ', ' + texte(domaine.icone) + ', ' + texte(domaine.description) + ', ' + index + ');');
}

for (const [index, fiche] of documentation.fiches.entries()) {
  lignes.push('insert into public.bibliolearn_lessons (id, domain_id, category, title, summary, tags, level, sections, sessions, related_ids, sort_order) values (' + texte(fiche.id) + ', ' + texte(fiche.domaine) + ', ' + texte(fiche.categorie) + ', ' + texte(fiche.titre) + ', ' + texte(fiche.resume) + ', ' + json(fiche.tags) + ', ' + texte(fiche.niveau) + ', ' + json(fiche.sections) + ', ' + json(fiche.sessions) + ', ' + json(fiche.associes) + ', ' + index + ');');
}

for (const [index, atelier] of documentation.ateliers.entries()) {
  lignes.push('insert into public.bibliolearn_workshops (id, domain_id, title, objective, level, duration, tools, prerequisites, file_structure, steps, validation, hint, related_ids, sort_order) values (' + texte(atelier.id) + ', ' + texte(atelier.domaine) + ', ' + texte(atelier.titre) + ', ' + texte(atelier.objectif) + ', ' + texte(atelier.niveau) + ', ' + texte(atelier.duree) + ', ' + json(atelier.outils) + ', ' + json(atelier.prerequis) + ', ' + json(atelier.structure) + ', ' + json(atelier.etapes) + ', ' + json(atelier.validation) + ', ' + texte(atelier.indice) + ', ' + json(atelier.associes) + ', ' + index + ');');
}

lignes.push('commit;');
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, lignes.join('\n') + '\n');
fs.writeFileSync(destinationStatique, JSON.stringify(documentation));
console.log('Migration générée : ' + destination);
console.log('Catalogue statique généré : ' + destinationStatique);
console.log(documentation.statistiques.nombreFiches + ' fiches, ' + documentation.statistiques.nombreAteliers + ' ateliers, ' + lignes.length + ' lignes SQL.');
