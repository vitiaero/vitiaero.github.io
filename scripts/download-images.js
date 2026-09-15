// Telecharge un jeu d'images reelles et coherentes depuis Wikimedia Commons
// (photos sous licence libre) et ecrit les credits dans docs/CREDITS-IMAGES.txt
// (hors de public/ : ces notes internes ne doivent pas etre publiees sur le site).
// Usage : npm run images
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'images');

// Chaque cible pointe vers un fichier precis de Wikimedia Commons, choisi et
// verifie pour correspondre au besoin du site.
const TARGETS = [
  {
    file: 'hero-drone.jpg',
    title: 'File:DJI Agras T50 in flight.jpg',
    note: 'Grand drone d\'epandage agricole (DJI Agras) en vol',
  },
  {
    file: 'agras-t30.jpg',
    title: 'File:DJI 3WWDZ-30A Agras T30 (N340RZ, cn 3U5BJ6P001008A) (4-9-2024).jpg',
    note: 'DJI Agras T30 (le bon modele de drone d\'epandage)',
  },
  {
    file: 'lavaux.jpg',
    title: 'File:Lavaux vignobles en terrasses au bord du Léman (2015).jpg',
    note: 'Terrasses viticoles du Lavaux au bord du lac Leman',
  },
  {
    file: 'vignes-pente.jpg',
    title: 'File:Vineyards in Lavaux.jpg',
    note: 'Vignes suisses en terrasses du Lavaux',
  },
];

const WIDTH = 1600;

async function resolve(title) {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('titles', title);
  url.searchParams.set('prop', 'imageinfo');
  url.searchParams.set('iiprop', 'url|extmetadata');
  url.searchParams.set('iiurlwidth', String(WIDTH));
  url.searchParams.set('format', 'json');
  const res = await fetch(url, { headers: { 'User-Agent': 'VitiDrone-study-project/1.0' } });
  const data = await res.json();
  const page = Object.values(data.query.pages)[0];
  const info = page.imageinfo?.[0];
  if (!info) throw new Error('Image introuvable : ' + title);
  return {
    thumburl: info.thumburl,
    descurl: info.descriptionurl,
    license: info.extmetadata?.LicenseShortName?.value || 'voir la page',
    artist: (info.extmetadata?.Artist?.value || '').replace(/<[^>]+>/g, '').trim(),
  };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const credits = ['Credits des images (telechargees depuis Wikimedia Commons)', ''];

  for (const t of TARGETS) {
    process.stdout.write(`- ${t.file} ... `);
    try {
      const info = await resolve(t.title);
      const res = await fetch(info.thumburl, { headers: { 'User-Agent': 'VitiDrone-study-project/1.0' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(path.join(OUT_DIR, t.file), buf);
      console.log(`ok (${Math.round(buf.length / 1024)} Ko)`);
      credits.push(
        `${t.file} - ${t.note}`,
        `  Source : ${info.descurl}`,
        `  Auteur : ${info.artist || 'voir la page'} - Licence : ${info.license}`,
        ''
      );
    } catch (e) {
      console.log('ECHEC :', e.message);
      credits.push(`${t.file} - ECHEC du telechargement (${e.message})`, '');
    }
  }

  fs.writeFileSync(path.join(__dirname, '..', 'docs', 'CREDITS-IMAGES.txt'), credits.join('\n'));
  console.log('\nCredits ecrits dans docs/CREDITS-IMAGES.txt');
}

main();
