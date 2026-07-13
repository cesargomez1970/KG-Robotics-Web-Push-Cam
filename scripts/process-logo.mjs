import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'public/images');
const dark = 'rgb(5.490112%, 5.490112%, 7.058716%)';
const srcCandidates = [
  path.join(root, 'public/logo_v5_regular.svg'),
  path.join(root, 'public/images/logo_KG-ROBOTICS_v5.png'),
  path.join(root, 'public/images/logo_KG-ROBOTICS_nuevo.svg'),
  path.join(root, 'public/logo_KG-ROBOTICS_nuevo.svg'),
  path.join(root, 'public/logo_KG-ROBOTICS_v4.svg'),
  path.join(root, 'public/images/logo_KG-ROBOTICS_v4.svg'),
];
const src = srcCandidates.find((file) => fs.existsSync(file));

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

    const pathMatch = line.match(/\sd="([^"]+)"/);
    if (pathMatch) {
      const coords = nums(pathMatch[1]);
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

function iconFromInner(content) {
  const lines = content.split('\n');
  const wordmarkIdx = lines.findIndex((line) =>
    /\sd="[^"]*M 209\.398438 201\.652344/.test(line),
  );
  if (wordmarkIdx <= 0) return lines.slice(0, 3).join('\n');
  return lines
    .slice(0, wordmarkIdx)
    .filter((line) => !line.includes('<g '))
    .join('\n');
}

function stripSvg(raw) {
  return raw
    .replace(/<\?xml[\s\S]*?\?>\s*/g, '')
    .replace(/<defs>[\s\S]*?<\/defs>\s*/g, '')
    .replace(/<g clip-path="url\(#clip-0\)">[\s\S]*?<\/g>\s*/g, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim();
}

function viewBoxFromRaw(raw) {
  const match = raw.match(/viewBox="([^"]+)"/);
  if (!match) return null;
  const [x, y, w, h] = match[1].trim().split(/\s+/).map(Number);
  return {
    x: Math.floor(x),
    y: Math.floor(y),
    w: Math.ceil(w),
    h: Math.ceil(h),
  };
}

function isV5Svg(inner) {
  return inner.includes('scale(0.032184,-0.032184)');
}

function iconLinesFromInner(inner) {
  if (isV5Svg(inner)) {
    return inner
      .split('\n')
      .filter((line) => line.trim())
      .slice(0, 3)
      .join('\n');
  }
  return iconFromInner(inner);
}

function iconViewBoxFromInner(inner) {
  if (isV5Svg(inner)) {
    return { x: 41, y: 160, w: 125, h: 125 };
  }
  return computeViewBox(iconFromInner(inner));
}

function lightVariant(inner) {
  return inner
    .split('\n')
    .map((line) => {
      if (line.includes('<rect') && (line.includes('#0E0E12') || line.includes(dark))) {
        return line
          .replaceAll('#0E0E12', '#2c2f37')
          .replaceAll(`fill="${dark}"`, 'fill="#2c2f37"');
      }
      return line
        .replaceAll('#0E0E12', '#FFFFFF')
        .replaceAll(`fill="${dark}"`, 'fill="#FFFFFF"');
    })
    .join('\n');
}

function wrapVector(content, viewBox) {
  const viewBoxStr = `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxStr}" width="${viewBox.w}" height="${viewBox.h}">\n${content}\n</svg>\n`;
}

function referenceViewBoxes() {
  const refCandidates = [
    path.join(root, 'public/images/logo_KG-ROBOTICS_nuevo.svg'),
    path.join(root, 'public/logo_KG-ROBOTICS_nuevo.svg'),
  ];
  const ref = refCandidates.find((file) => fs.existsSync(file));
  if (!ref) {
    return {
      wordmark: { x: 41, y: 160, w: 584, h: 125 },
      icon: { x: 41, y: 160, w: 125, h: 125 },
    };
  }
  const inner = stripSvg(fs.readFileSync(ref, 'utf8'));
  return {
    wordmark: { ...computeViewBox(inner), w: 584 },
    icon: computeViewBox(iconFromInner(inner)),
  };
}

function cropPngWithSips(pngPath, outPath, x, y, w, h) {
  const tmp = path.join(outDir, '.logo-crop-src.png');
  fs.copyFileSync(pngPath, tmp);
  execSync(
    `sips --cropOffset ${y} ${x} -c ${h} ${w} "${tmp}" --out "${outPath}" >/dev/null 2>&1`,
  );
  fs.unlinkSync(tmp);
}

function processPngLogo(pngPath) {
  const wordmarkPath = path.join(outDir, 'logo-v5-wordmark.png');
  const iconPath = path.join(outDir, 'logo-v5-icon.png');
  const { wordmark, icon } = referenceViewBoxes();

  cropPngWithSips(pngPath, wordmarkPath, wordmark.x, wordmark.y, wordmark.w, wordmark.h);
  cropPngWithSips(pngPath, iconPath, icon.x, icon.y, icon.w, icon.h);

  fs.copyFileSync(wordmarkPath, path.join(outDir, 'logo.png'));
  fs.copyFileSync(iconPath, path.join(root, 'public/favicon.png'));

  const iconBuffer = fs.readFileSync(iconPath);
  const iconB64 = iconBuffer.toString('base64');
  fs.writeFileSync(
    path.join(root, 'public/favicon.svg'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${icon.w} ${icon.h}" width="${icon.w}" height="${icon.h}">\n<image href="data:image/png;base64,${iconB64}" width="${icon.w}" height="${icon.h}" />\n</svg>\n`,
  );

  fs.copyFileSync(pngPath, path.join(outDir, path.basename(pngPath)));
}

function processSvgLogo(svgPath) {
  const raw = fs.readFileSync(svgPath, 'utf8');
  const inner = stripSvg(raw);
  const viewBox = viewBoxFromRaw(raw) ?? computeViewBox(inner);

  fs.writeFileSync(path.join(outDir, 'logo.svg'), wrapVector(inner, viewBox));
  fs.writeFileSync(
    path.join(outDir, 'logo-light.svg'),
    wrapVector(lightVariant(inner), viewBox),
  );

  const iconLines = iconLinesFromInner(inner);
  const iconBox = iconViewBoxFromInner(inner);
  fs.writeFileSync(
    path.join(root, 'public/favicon.svg'),
    wrapVector(iconLines, iconBox),
  );

  try {
    execSync(
      `qlmanage -t -s 1024 -o /tmp "${path.join(outDir, 'logo.svg')}" >/dev/null 2>&1`,
    );
    fs.copyFileSync('/tmp/logo.svg.png', path.join(outDir, 'logo.png'));
  } catch {
    console.warn('Could not generate logo.png (qlmanage unavailable)');
  }

  fs.copyFileSync(svgPath, path.join(outDir, path.basename(svgPath)));
}

if (!src) {
  console.error('Missing source logo. Expected one of:', srcCandidates.join(', '));
  process.exit(1);
}

if (src.endsWith('.png')) {
  processPngLogo(src);
} else {
  processSvgLogo(src);
}

console.log(`Logo assets updated from ${path.basename(src)}`);
