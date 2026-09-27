// Version hors ligne du site : un dossier qui s'ouvre par double-clic sur
// index.html, sans serveur ni installation (comme les anciennes demos).
//
//   npm run demo                -> _hors-projet/site-hors-ligne/
//   npm run demo -- <dossier>   -> un autre dossier
//
// Etapes : compilation (vite.offline.config.js), puis un seul index.html avec
// le style et le script integres (Chrome refuse les scripts « module » et les
// polices charges depuis le disque), puis copie des images et des videos.
// Les videos 4K et le vol FPV complet restent de cote : la version hors ligne
// utilise la 1080p et les extraits courts.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(ROOT, process.argv[2] || '_hors-projet/site-hors-ligne');
const TMP = path.join(ROOT, 'dist-hors-ligne');
const MARK = '.vitiaero-hors-ligne'; // preuve que le dossier a ete cree par ce script
const SKIP = [/-2160\./, /^vignoble-fpv/, /^CNAME$/, /^robots\.txt$/, /^sitemap\.xml$/];

// Securite : ne jamais vider le projet lui-meme, ni un dossier existant qui
// n'a pas ete cree par ce script.
const rel = path.relative(OUT, ROOT);
if (!path.relative(ROOT, OUT) || !rel.startsWith('..')) {
  throw new Error(`Dossier de sortie refuse (le projet lui-meme ou un dossier parent) : ${OUT}`);
}
if (fs.existsSync(OUT) && fs.readdirSync(OUT).length && !fs.existsSync(path.join(OUT, MARK))) {
  throw new Error(`${OUT} existe deja et n'a pas ete cree par « npm run demo » : choisissez un autre dossier.`);
}

// 1. Compilation
await build({ root: ROOT, configFile: path.join(ROOT, 'vite.offline.config.js'), logLevel: 'warn' });

// 2. Un seul index.html
const read = (file) => fs.readFileSync(path.join(TMP, file), 'utf8');
let html = read('index.html');
const script = /<script type="module"[^>]*src="\.\/([^"]+)"[^>]*><\/script>/.exec(html);
const style = /<link rel="stylesheet"[^>]*href="\.\/([^"]+)"[^>]*>/.exec(html);
if (!script || !style) throw new Error('index.html compile inattendu : script ou style introuvable.');
const js = read(script[1]).replace(/<\/script/gi, '<\\/script');
const css = read(style[1]).replace(/<\/style/gi, '<\\/style');
if (/url\(\s*(?!['"]?(?:data:|#))/.test(css)) {
  throw new Error('Le style reference encore un fichier : il ne se chargerait pas depuis le disque.');
}
html = html
  .replace(script[0], '')
  .replace(style[0], () => `<style>${css}</style>`)
  .replace('</body>', () => `<script>${js}</script>\n  </body>`);
if (html.includes('./assets/')) throw new Error('index.html reference encore le dossier assets.');

// 3. Dossier final : index.html, puis images et videos du dossier public
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);
let bytes = Buffer.byteLength(html);
const copy = (from, to) => {
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (SKIP.some((re) => re.test(entry.name))) continue;
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(dst, { recursive: true });
      copy(src, dst);
    } else {
      fs.copyFileSync(src, dst);
      bytes += fs.statSync(src).size;
    }
  }
};
copy(path.join(ROOT, 'public'), OUT);
fs.rmSync(TMP, { recursive: true, force: true });

// 4. Mode d'emploi, avec la version du code utilisee
const git = (...args) => {
  try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { return ''; }
};
const commit = git('log', '-1', '--format=%h du %cd', '--date=format:%d.%m.%Y a %H:%M');
const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
const dirty = git('status', '--porcelain') ? ', avec des modifications non enregistrees' : '';
const made = new Date().toLocaleString('fr-CH', { dateStyle: 'short', timeStyle: 'short' });
const version = commit ? `commit ${commit} (branche ${branch}${dirty})` : 'hors d\'un depot Git';
const readme = `VitiAero - site hors ligne
==========================

Ouvrir : double-cliquer sur index.html (ou sur le raccourci VitiAero du
Bureau). Aucun serveur, aucune installation.

Genere le ${made}, depuis le ${version}.
Mettre a jour apres une modification du site : dans le dossier du projet,
lancer « npm run demo ».

Ce qui fonctionne : toutes les pages, les trois langues, les animations, les
videos, la carte et le calcul du prix de l'estimation. Les boutons Precedent
et Suivant du navigateur, et le rechargement de la page.

Ce qui ne fonctionne pas sans serveur : l'envoi des formulaires, la connexion
et l'espace client (un message l'explique a l'ecran).
La carte (fond swisstopo) et la recherche de commune ont besoin d'internet.
Videos en 1080p : les fichiers 4K du site ne sont pas copies.
`;
fs.writeFileSync(path.join(OUT, 'LISEZ-MOI.txt'), readme);
fs.writeFileSync(path.join(OUT, MARK), `${version}\n`);

console.log(`Site hors ligne pret : ${path.join(OUT, 'index.html')}`);
console.log(`${(bytes / 1048576).toFixed(0)} Mo, ${version}`);
