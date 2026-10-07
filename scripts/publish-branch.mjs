// Publie le site compile sur la branche vitiaero-publication du depot, servie
// par GitHub Pages (Settings > Pages > Deploy from a branch >
// vitiaero-publication, / (root)) a l'adresse https://vitiaero.github.io.
//
// Le site est compile seul, sans API (VITE_STATIC_ONLY=1) : en mode entreprise
// fictive, les formulaires s'affichent mais n'enregistrent rien. La branche ne
// contient que les fichiers compiles ; le code source reste sur sa branche.
// Votre dossier de travail n'est pas modifie (hormis dist/).
//
// Usage : npm run publish:branch                  compile, teste et envoie
//         npm run publish:branch -- --dry-run      prepare sans envoyer
//         npm run publish:branch -- "Message"      message de publication
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BRANCH = 'vitiaero-publication';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const message = args.find((a) => !a.startsWith('--'));

const run = (cmd, list, env) => execFileSync(cmd, list, { cwd: root, stdio: 'inherit', env: { ...process.env, ...env } });
const git = (list, env) => execFileSync('git', list, { cwd: root, encoding: 'utf8', env: { ...process.env, ...env } }).trim();
const pause = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));

if (git(['status', '--porcelain'])) {
  console.error('Des modifications ne sont pas enregistrees (commit) : publication annulee.');
  process.exit(1);
}
const source = `${git(['rev-parse', '--abbrev-ref', 'HEAD'])} (${git(['rev-parse', '--short', 'HEAD'])})`;

run('npm', ['test']);
run('npm', ['run', 'build'], { VITE_STATIC_ONLY: '1', VITE_API_URL: '', VITE_BASE_PATH: '/' });

// Commit des seuls fichiers de dist/, fait a cote de l'index du depot.
const dist = path.join(root, 'dist');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vitiaero-publication-'));
const index = { GIT_INDEX_FILE: path.join(tmp, 'index') };
git(['--work-tree', dist, 'add', '--all', '.'], index);
const tree = git(['write-tree'], index);
fs.rmSync(tmp, { recursive: true, force: true });

const remote = git(['ls-remote', '--heads', 'origin', BRANCH]).split(/\s/)[0];
if (remote) git(['fetch', '--quiet', 'origin', BRANCH]);
if (remote && git(['rev-parse', `${remote}^{tree}`]) === tree) {
  console.log(`Rien de nouveau : ${BRANCH} contient deja ce site.`);
  process.exit(0);
}
const commit = git([
  'commit-tree', tree, ...(remote ? ['-p', remote] : []),
  '-m', message || `Publication du site depuis ${source}`,
]);

if (dryRun) {
  console.log(`Pret (non envoye) : commit ${commit} pour ${BRANCH}.`);
  process.exit(0);
}
for (const delay of [2, 4, 8, 16, 0]) {
  try {
    run('git', ['push', 'origin', `${commit}:refs/heads/${BRANCH}`]);
    console.log(`Publie sur ${BRANCH}. GitHub Pages met le site a jour en une a deux minutes.`);
    process.exit(0);
  } catch (error) {
    if (!delay) throw error;
    console.log(`Envoi impossible, nouvel essai dans ${delay} s.`);
    await pause(delay);
  }
}
