const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('du niveau zéro à la vérification, avec lecture hors ligne', async ({ page, context }) => {
  const erreurs = []; page.on('pageerror', err => erreurs.push(err.message));
  const requetes = []; page.on('request', r => requetes.push(r.url()));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Commencer par comprendre.' })).toBeVisible();
  expect(requetes.some(u => /documentation.json|api\/documentation|index-recherche/.test(u))).toBe(false);
  await page.getByRole('link', { name: 'Commencer depuis zéro', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Comprendre ce que fait un ordinateur');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.locator('#reponse-pratique').fill('Pour une photo : entrée image, traitement recadrage, sortie aperçu, puis enregistrer le fichier.');
  await page.getByRole('button', { name: 'Enregistrer mon essai' }).click();
  await page.getByLabel('Une entrée', { exact: true }).check();
  await page.getByLabel('Elle réapparaît après réouverture', { exact: true }).check();
  await page.getByRole('button', { name: 'Vérifier mes réponses' }).click();
  await expect(page.locator('[data-statut]')).toHaveText('Vérifié par questionnaire');
  await expect(page.getByText('Réponses justes.', { exact: true })).toBeVisible();
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect(page.locator('[data-statut]')).toHaveText('Vérifié par questionnaire');
  await context.setOffline(true); await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Comprendre ce que fait un ordinateur');
  expect(erreurs).toEqual([]);
});

test('recherche et notices : chargement différé, statut explicite', async ({ page }) => {
  await page.goto('/'); await expect(page.locator('h1')).toBeVisible();
  await page.keyboard.press('Control+k');
  await page.locator('#champ-recherche').fill('map');
  await expect(page.locator('.search-result').first()).toBeVisible();
  await page.locator('.search-result').first().click();
  await expect(page.locator('#dialogue-recherche')).not.toBeVisible();
  await expect(page.locator('h1')).toBeVisible();
  await page.goto('/#/bibliotheque');
  await page.locator('#filtre-bibliotheque').fill('colgroup');
  await page.locator('.library-card').first().click();
  await expect(page.getByText('Notice à approfondir', { exact: true })).toBeVisible();
  await expect(page.locator('pre')).toHaveCount(0);
});

for (const largeur of [320, 360, 390, 430, 768, 1440]) {
  test(`lecture et navigation à ${largeur}px`, async ({ page }) => {
    await page.setViewportSize({ width: largeur, height: 900 });
    await page.goto('/'); await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    if (largeur <= 940) {
      await page.locator('#ouvrir-menu').click();
      await expect(page.locator('#ouvrir-menu')).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Escape'); await expect(page.locator('#ouvrir-menu')).toBeFocused();
    }
    await page.goto('/#/fiche/zero-fichiers');
    await expect(page.locator('h1')).toHaveText('Créer un fichier et retrouver son chemin');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    if (largeur === 390 || largeur === 1440) {
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
    }
  });
}

test('routes historiques, installation et ateliers restent accessibles', async ({ page }) => {
  const erreurs = []; page.on('pageerror', e => erreurs.push(e.message));
  for (const route of ['parcours/zero', 'parcours/backend', 'domaine/javascript', 'fiche/js-promises', 'installation', 'ateliers', 'atelier/atelier-carte-html-css']) {
    await page.goto('/#/' + route); await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText('Ce contenu n’a pas pu être ouvert', { exact: true })).toHaveCount(0);
  }
  expect(erreurs).toEqual([]);
});

test('préparer mon poste explique installation, commandes, essai et correction selon le système', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/installation');
  await page.getByRole('button', { name: 'Windows · PowerShell' }).first().click();
  const python = page.locator('.setup-tool').filter({ has: page.locator('summary', { hasText: 'Python, pip et environnement virtuel' }) });
  await python.locator('summary').first().click();
  await expect(python.getByText('Les fondamentaux')).toBeVisible();
  const windows = python.locator('[data-platform-panel="windows"]');
  await expect(windows).toBeVisible();
  await windows.getByText('Commandes à connaître et ce qu’elles font').click();
  await expect(windows.getByText('.\\.venv\\Scripts\\python.exe -m pip --version')).toBeVisible();
  await windows.getByText('Essai guidé : Lancer Python sans dépendance externe').click();
  await expect(windows.getByText('bonjour.py', { exact: true }).first()).toBeVisible();
  await windows.getByText('Erreurs possibles : comprendre puis corriger').click();
  await expect(windows.getByText('No module named venv / ensurepip indisponible')).toBeVisible();
  await page.getByRole('button', { name: 'Linux · terminal' }).first().click();
  const linux = python.locator('[data-platform-panel="linux"]');
  await expect(linux).toBeVisible();
  await expect(windows).toBeHidden();
  await linux.locator('.setup-depth').first().locator('summary').click();
  await expect(linux.getByText('.venv/bin/python -m pip --version').last()).toBeVisible();
  await page.getByRole('button', { name: 'macOS · Terminal' }).first().click();
  const mac = python.locator('[data-platform-panel="mac"]');
  await expect(mac).toBeVisible();
  await expect(mac.getByText('n’écrasez pas le Python interne de macOS', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  const accessibilite = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(accessibilite.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
});

test('une leçon zéro et un atelier avancé donnent commandes et fichiers complets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/fiche/zero-naviguer-dossiers');
  await expect(page.locator('h1')).toHaveText('Naviguer dans un dossier avec des commandes sûres');
  await expect(page.getByText('Get-Location', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('mkdir atelier', { exact: false }).first()).toBeVisible();
  await page.goto('/#/atelier/atelier-springboot-controller-get-essayer');
  await expect(page.locator('h1')).toContainText('Contrôleur et route GET');
  const controleur = page.locator('details').filter({ has: page.locator('summary', { hasText: 'AtelierController.java' }) });
  await controleur.locator('summary').click();
  await expect(controleur.locator('code')).toContainText('@GetMapping("/bonjour")');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.goto('/#/terme/pratique-springboot-restcontroller');
  await expect(page.locator('h1')).toHaveText('@RestController');
  await expect(page.getByText('Documentation de référence')).toBeVisible();
});

test('progression historique et navigation rapide restent cohérentes', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('test-migre')) {
      localStorage.setItem('bibliolearn.lues', JSON.stringify(['html-document', 'ancienne-notion']));
      localStorage.setItem('test-migre', '1');
    }
  });
  await page.goto('/#/fiche/html-document');
  await expect(page.locator('[data-statut]')).toHaveText('Compris · déclaré');
  await page.route('**/fiches/js-promises.json', async route => { await new Promise(r => setTimeout(r, 250)); await route.continue(); });
  const demande = page.waitForRequest('**/fiches/js-promises.json');
  const reponse = page.waitForResponse('**/fiches/js-promises.json');
  await page.evaluate(() => { location.hash = '#/fiche/js-promises'; });
  await demande;
  await page.evaluate(() => { location.hash = '#/fiche/zero-fichiers'; });
  await expect(page.locator('h1')).toHaveText('Créer un fichier et retrouver son chemin');
  await reponse;
  await expect(page.locator('h1')).toHaveText('Créer un fichier et retrouver son chemin');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('bibliolearn.progression.v2')).notions['ancienne-notion'].etat)).toBe('compris');
});

test('diagnostics, projets, perte de réseau et erreur réessayable', async ({ page, context }) => {
  await page.goto('/#/erreur/type-error'); await expect(page.locator('h1')).toHaveText('TypeError');
  await page.goto('/#/projet/mission-incident-production'); await expect(page.locator('h1')).toHaveText('Diagnostiquer une panne après livraison');
  await page.goto('/'); await expect(page.locator('.continue-learning')).toBeVisible();
  await page.evaluate(async () => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.evaluate(() => { location.hash = '#/fiche/python-listes-boucles'; });
  await expect(page.locator('h1')).toHaveText('Ce contenu n’a pas pu être ouvert');
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Réessayer', exact: true }).click();
  await expect(page.getByRole('button', { name: 'J’ai compris l’idée' })).toBeVisible();
});

test('téléchargement explicite puis accès hors ligne à une leçon jamais ouverte', async ({ page, context }) => {
  await page.goto('/#/fiche/zero-fichiers'); await expect(page.locator('h1')).toBeVisible();
  await page.goto('/'); await expect(page.locator('.continue-learning')).toBeVisible();
  await page.getByRole('button', { name: 'Télécharger pour lire hors ligne' }).click();
  await expect(page.locator('#telechargement-statut')).toContainText('Bibliothèque téléchargée.', { timeout: 20000 });
  await context.setOffline(true);
  await page.goto('/#/fiche/zero-fichiers'); await expect(page.locator('h1')).toHaveText('Créer un fichier et retrouver son chemin');
  await page.goto('/#/fiche/js-promises'); await expect(page.locator('h1')).toHaveText('Recevoir un résultat qui n’est pas encore prêt');
});
