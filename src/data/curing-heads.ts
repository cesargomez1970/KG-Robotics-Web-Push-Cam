export type CuringHeadSection = {
  title: string;
  rows: [string, string][];
};

export type CuringHead = {
  id: string;
  name: string;
  model: string;
  image: string;
  imageAlt: string;
  summary: string;
  highlights: { label: string; value: string }[];
  overview: string;
  sections: CuringHeadSection[];
};

export const curingHeads: CuringHead[] = [
  {
    id: 'xs',
    name: 'Extra Small (XS)',
    model: 'ZENITH 300W',
    image: '/images/curing-head-xs-1.png',
    imageAlt: 'Technical drawing — Extra Small curing head, 41×50×313 mm',
    summary:
      'ZENITH 300W UV-C curing head for the KG UltraLUX UV LED Lite system, built for DN75–DN150 pipe rehabilitation with integrated live-view inspection.',
    highlights: [
      { label: 'Total power', value: '300 W' },
      { label: 'UV LED diodes', value: '120' },
      { label: 'Dimensions', value: '41 × 50 × 313 mm (L×W×H)' },
      { label: 'DN range', value: '75–150 mm' },
      { label: 'Weight', value: '0.30 kg · hard-anodized aluminium' },
    ],
    overview: 'Compact head for laterals and small mainlines — 300 W output with 120 UV LED diodes, from DN75.',
    sections: [
      {
        title: 'Optical system',
        rows: [
          ['UV source', '5× UV LED panel'],
          ['Peak wavelength', '400 nm (UV-C)'],
          ['Lamp life', '1000 h @ 60k cycles'],
        ],
      },
      {
        title: 'Sensing & vision',
        rows: [
          ['Core temp', 'Internal live sensor'],
          ['Live view', 'FHD CCD, 2.8 mm, FOV 105°'],
          ['Illumination', '4× LED'],
        ],
      },
      {
        title: 'Mechanical',
        rows: [
          ['Bend management', '90° from DN100'],
          ['Cooling', 'Patented efficient cooling'],
          ['Head design', 'QRC quick-release'],
        ],
      },
      {
        title: 'Features',
        rows: [
          ['Glass', 'Rapid replacement'],
          ['Hose', 'Flexible'],
          ['Compatibility', 'UltraLUX UV LED Lite'],
        ],
      },
    ],
  },
  {
    id: 's',
    name: 'Small (S)',
    model: 'ZENITH 600W',
    image: '/images/curing-head-s-1.png',
    imageAlt: 'Technical drawing — Small curing head, 61×61×97 mm',
    summary:
      'ZENITH 600W higher-output UV-C curing head for the KG UltraLUX UV LED Lite system, scaled for DN100–DN250 pipe rehabilitation with integrated live-view inspection.',
    highlights: [
      { label: 'Total power', value: '600 W' },
      { label: 'UV LED diodes', value: '240' },
      { label: 'Dimensions', value: '61 × 61 × 97 mm (L×W×H)' },
      { label: 'DN range', value: '100–250 mm' },
      { label: 'Weight', value: '0.50 kg · hard-anodized aluminium' },
    ],
    overview: 'Higher-output head for mainlines — 600 W with 240 UV LED diodes, from DN100 up to DN250.',
    sections: [
      {
        title: 'Optical system',
        rows: [
          ['UV source', '10× UV LED panel'],
          ['Peak wavelength', '400 nm (UV-C)'],
          ['Lamp life', '1000 h @ 60k cycles'],
        ],
      },
      {
        title: 'Sensing & vision',
        rows: [
          ['Core temp', 'Internal live sensor'],
          ['Live view', 'FHD CCD, 2.8 mm, FOV 105°'],
          ['Illumination', '4× LED'],
        ],
      },
      {
        title: 'Mechanical',
        rows: [
          ['Bend management', '90° from DN150'],
          ['Cooling', 'Patented efficient cooling'],
          ['Head design', 'QRC quick-release'],
        ],
      },
      {
        title: 'Features',
        rows: [
          ['Glass', 'Rapid replacement'],
          ['Head design', 'QRC quick-release'],
          ['Compatibility', 'UltraLUX UV LED Lite'],
        ],
      },
    ],
  },
];
