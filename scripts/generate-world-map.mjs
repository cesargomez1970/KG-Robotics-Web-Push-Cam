import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import fs from 'node:fs';
import path from 'node:path';

const width = 1000;
const height = 500;
const land = '#15161a';
const water = '#ebece8';

const res = await fetch(
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
);
const world = await res.json();
const countries = feature(world, world.objects.countries);
countries.features = countries.features.filter(
  (f) => f.id !== '010' && f.properties?.name !== 'Antarctica'
);

const projection = geoNaturalEarth1().fitExtent(
  [
    [2, 2],
    [width - 2, height - 2],
  ],
  countries
);
const d = geoPath(projection)(countries);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="World map"><rect width="${width}" height="${height}" fill="${water}"/><g fill="${land}"><path d="${d}"/></g></svg>`;

const out = path.resolve('public/assets/world-map.svg');
fs.writeFileSync(out, svg);
console.log('Wrote', out);
