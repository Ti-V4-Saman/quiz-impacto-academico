import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const rootsToScan = [
  path.join(root, 'index.html'),
  path.join(root, 'assets'),
  path.join(root, 'package.json'),
  path.join(root, 'vercel.json'),
];
const textExtensions = new Set(['.html', '.js', '.css', '.json', '.md', '.txt']);
const markerParts = ['<'.repeat(7), '='.repeat(7), '>'.repeat(7)];
const failures = [];

async function walk(target) {
  const info = await stat(target);
  if (info.isDirectory()) {
    const entries = await readdir(target);
    for (const entry of entries) await walk(path.join(target, entry));
    return;
  }

  if (!textExtensions.has(path.extname(target))) return;
  const content = await readFile(target, 'utf8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    const trimmed = line.trimStart();
    if (markerParts.some((marker) => trimmed.startsWith(marker))) {
      failures.push(`${path.relative(root, target)}:${index + 1}`);
    }
  });
}

for (const target of rootsToScan) await walk(target);

const indexHtml = await readFile(path.join(root, 'index.html'), 'utf8');
const requiredReferences = [
  'assets/css/styles.v10.css',
  'assets/js/app.bundle.v10.js',
];

for (const reference of requiredReferences) {
  if (!indexHtml.includes(reference)) failures.push(`index.html não referencia ${reference}`);
}

if (failures.length) {
  console.error('\nFalha de validação. Corrija antes de publicar:\n');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Validação concluída: sem conflitos de merge e referências de produção corretas.');
