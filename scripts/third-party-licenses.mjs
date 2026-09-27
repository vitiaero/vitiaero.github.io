// Licences des logiciels tiers reellement inclus dans le site compile.
// A partir des modules du bundle (Vite/Rollup), retrouve chaque paquet npm, sa
// version, sa licence et le texte de sa licence, et produit licences-tiers.txt
// (publie avec le site et cite sur la page /credits). Aucun texte n'est ecrit a
// la main : tout vient des paquets installes.
import fs from 'node:fs';
import path from 'node:path';

const LICENSE_FILE = /^(licen[cs]e|copying|notice)(\.(md|txt|markdown))?$/i;

// Dossier du paquet npm qui contient un module, ou null (code du projet).
export function packageDirOf(id) {
  const clean = String(id).replace(/^\0/, '').split('?')[0].replace(/\\/g, '/');
  const i = clean.lastIndexOf('/node_modules/');
  if (i === -1) return null;
  const rest = clean.slice(i + '/node_modules/'.length).split('/');
  const name = rest[0].startsWith('@') ? `${rest[0]}/${rest[1]}` : rest[0];
  return clean.slice(0, i + '/node_modules/'.length) + name;
}

function repoUrl(pkg) {
  const r = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url;
  const url = pkg.homepage || r || '';
  return String(url).replace(/^git\+/, '').replace(/\.git$/, '').replace(/^git:\/\//, 'https://');
}

export function collectLicenses(moduleIds) {
  const dirs = new Set();
  for (const id of moduleIds) {
    const dir = packageDirOf(id);
    if (dir) dirs.add(dir);
  }
  const out = [];
  for (const dir of dirs) {
    const file = path.join(dir, 'package.json');
    if (!fs.existsSync(file)) continue;
    const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
    const licenseFile = fs.readdirSync(dir).find((f) => LICENSE_FILE.test(f));
    out.push({
      name: pkg.name,
      version: pkg.version,
      license: typeof pkg.license === 'string' ? pkg.license : pkg.license?.type || 'non indiquee',
      url: repoUrl(pkg),
      text: licenseFile ? fs.readFileSync(path.join(dir, licenseFile), 'utf8').trim() : null,
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export function licensesText(pkgs, { date = new Date() } = {}) {
  const day = date.toISOString().slice(0, 10);
  const head = [
    'Logiciels tiers inclus dans le site VitiAero',
    'Drittsoftware in der Website VitiAero / Third-party software in the VitiAero website',
    `Liste generee a la compilation le ${day}, a partir des paquets reellement inclus.`,
    '',
  ];
  const body = pkgs.map((p) => [
    '='.repeat(72),
    `${p.name} ${p.version}`,
    `Licence : ${p.license}`,
    ...(p.url ? [`Source : ${p.url}`] : []),
    '',
    p.text || '(Aucun fichier de licence fourni par le paquet : voir la licence indiquee ci-dessus.)',
    '',
  ].join('\n'));
  return `${head.join('\n')}\n${body.join('\n')}`;
}
