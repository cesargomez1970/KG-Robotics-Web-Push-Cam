// @ts-check
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

const pagesBase = '/KG-Robotics-Web-Push-Cam';
const pagesPathPrefix = pagesBase.slice(1);
const publishToGitHubPages = process.env.GITHUB_PAGES === 'true';

function prefixPublicUrls() {
  return {
    name: 'prefix-public-urls',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        if (!publishToGitHubPages) return;
        await prefixTree(fileURLToPath(dir));
      },
    },
  };
}

async function prefixTree(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      await prefixTree(fullPath);
      return;
    }
    if (!['.html', '.css', '.js'].includes(extname(entry.name))) return;
    const original = await readFile(fullPath, 'utf8');
    const next = prefixRootUrls(original);
    if (next !== original) await writeFile(fullPath, next);
  }));
}

function prefixRootUrls(text) {
  return text
    .replace(new RegExp(`(href|src|content|poster|srcset)(=["'])\\/(?!\\/|${pagesPathPrefix}\\/)`, 'g'), `$1$2${pagesBase}/`)
    .replace(/, \/(images|assets)\//g, `, ${pagesBase}/$1/`)
    .replace(new RegExp(`url\\((["']?)\\/(?!\\/|${pagesPathPrefix}\\/)`, 'g'), `url($1${pagesBase}/`)
    .replace(new RegExp(`url=\\/(?!\\/|${pagesPathPrefix}\\/)`, 'g'), `url=${pagesBase}/`);
}

// https://astro.build/config
export default defineConfig({
  site: 'https://cesargomez1970.github.io',
  base: publishToGitHubPages ? pagesBase : '/',
  integrations: [prefixPublicUrls()],
  devToolbar: {
    enabled: false,
  },
  server: {
    port: 4321,
    host: true,
    allowedHosts: true,
  },
  redirects: {
    '/product/sewerlight-600': '/',
    '/product/sewerlight-1200': '/',
  },
});
