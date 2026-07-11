import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';
import './check.mjs';

const root = process.cwd();
const dist = path.join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'assets', 'css'), { recursive: true });
await mkdir(path.join(dist, 'assets', 'img'), { recursive: true });
await mkdir(path.join(dist, 'assets', 'js'), { recursive: true });

await cp(path.join(root, 'index.html'), path.join(dist, 'index.html'));
await cp(path.join(root, 'assets', 'css', 'styles.v10.css'), path.join(dist, 'assets', 'css', 'styles.v10.css'));
await cp(path.join(root, 'assets', 'img'), path.join(dist, 'assets', 'img'), { recursive: true });

await build({
  entryPoints: [path.join(root, 'assets', 'js', 'main.js')],
  outfile: path.join(dist, 'assets', 'js', 'app.bundle.v10.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  minify: true,
  legalComments: 'none',
  charset: 'utf8',
});

const buildInfo = {
  version: '10.0.0',
  generatedAt: new Date().toISOString(),
  entrypoint: 'assets/js/main.js',
};
await writeFile(path.join(dist, 'build-info.json'), `${JSON.stringify(buildInfo, null, 2)}\n`);

const builtIndex = await readFile(path.join(dist, 'index.html'), 'utf8');
if (!builtIndex.includes('app.bundle.v10.js')) {
  throw new Error('O index de produção não referencia o bundle V10.');
}

console.log('Build concluído em dist/.');
