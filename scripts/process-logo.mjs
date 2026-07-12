import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = path.resolve(import.meta.dirname, '..');
const srcCandidates = [
  path.join(root, 'public/logo_KG-ROBOTICS_v4.svg'),
  path.join(root, 'public/images/logo_KG-ROBOTICS_v4.svg'),
  path.join(root, 'public/images/logo_KG-ROBOTICS_nuevo.svg'),
];
const src = srcCandidates.find((file) => fs.existsSync(file));
const outDir = path.join(root, 'public/images');
const dark = 'rgb(5.490112%, 5.490112%, 7.058716%)';

function parseMatrix(transform) {
  const m = transform.match(/matrix\(([^)]+)\)/);
  if (!m) return null;
  const [a, b, c, d, e, f] = m[1].split(',').map((v) => parseFloat(v.trim()));
  return { a, b, c, d, e, f };
}

function applyMatrix(x, y, matrix) {
  return {
    x: matrix.a * x + matrix.c * y + matrix.e,
    y: matrix.b * x + matrix.d * y + matrix.f,
  };
}

function nums(str) {
  return [...str.matchAll(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi)].map((m) => parseFloat(m[0]));
}

function computeViewBox(content) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

  const addPoint = (x, y) => {
    const p = applyMatrix(x, y, matrix);
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  };

  for (const line of content.split('\n')) {
    const transform = line.match(/transform="([^"]+)"/);
    if (transform) {
      const parsed = parseMatrix(transform[1]);
      if (parsed) matrix = parsed;
    }
    if (line.includes('<g ')) continue;
    if (line.includes('</g>')) {
      matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
      continue;
    }

    const rect = line.match(
      /<rect[^>]*x="([^"]+)"[^>]*y="([^"]+)"[^>]*width="([^"]+)"[^>]*height="([^"]+)"/,
    );
    if (rect) {
      const x = parseFloat(rect[1]);
      const y = parseFloat(rect[2]);
      const w = parseFloat(rect[3]);
      const h = parseFloat(rect[4]);
      addPoint(x, y);
      addPoint(x + w, y + h);
      continue;
    }

    const path = line.match(/\sd="([^"]+)"/);
    if (path) {
      const coords = nums(path[1]);
      for (let i = 0; i + 1 < coords.length; i += 2) {
        addPoint(coords[i], coords[i + 1]);
      }
    }
  }

  const pad = 6;
  return {
    x: Math.floor(minX - pad),
    y: Math.floor(minY - pad),
    w: Math.ceil(maxX - minX + pad * 2),
    h: Math.ceil(maxY - minY + pad * 2),
  };
}

if (!src) {
  console.error('Missing source logo. Expected one of:', srcCandidates.join(', '));
  process.exit(1);
}

const raw = fs.readFileSync(src, 'utf8');
const inner = raw
  .replace(/<\?xml[\s\S]*?\?>\s*/g, '')
  .replace(/<defs>[\s\S]*?<\/defs>\s*/g, '')
  .replace(/<g clip-path="url\(#clip-0\)">[\s\S]*?<\/g>\s*/g, '')
  .replace(/<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '')
  .trim();

const viewBox = computeViewBox(inner);
const viewBoxStr = `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`;
const wrap = (content) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxStr}" width="${viewBox.w}" height="${viewBox.h}">\n${content}\n</svg>\n`;

fs.writeFileSync(path.join(outDir, 'logo.svg'), wrap(inner));

const lightInner = inner
  .replaceAll(`fill="${dark}"`, 'fill="#FFFFFF"')
  .replace(/<rect([^>]*) fill="#FFFFFF"/, '<rect$1 fill="#2c2f37"')
  .replace(
    /^<path fill-rule="nonzero" fill="#FFFFFF"/,
    '<path fill-rule="nonzero" fill="#2c2f37"',
  );
fs.writeFileSync(path.join(outDir, 'logo-light.svg'), wrap(lightInner));

const iconLines = inner.split('\n').slice(0, 3).join('\n');
const iconBox = computeViewBox(iconLines);
const iconViewBox = `${iconBox.x} ${iconBox.y} ${iconBox.w} ${iconBox.h}`;
fs.writeFileSync(
  path.join(root, 'public/favicon.svg'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${iconViewBox}" width="${iconBox.w}" height="${iconBox.h}">\n${iconLines}\n</svg>\n`,
);

try {
  execSync(
    `qlmanage -t -s 1024 -o /tmp "${path.join(outDir, 'logo.svg')}" >/dev/null 2>&1`,
  );
  fs.copyFileSync('/tmp/logo.svg.png', path.join(outDir, 'logo.png'));
} catch {
  console.warn('Could not generate logo.png (qlmanage unavailable)');
}

fs.copyFileSync(src, path.join(outDir, 'logo_KG-ROBOTICS_v4.svg'));

console.log(`Logo assets updated from ${path.basename(src)}`);
