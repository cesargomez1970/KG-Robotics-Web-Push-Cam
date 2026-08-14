export interface SewerLightAccessory {
  file: string;
  name?: string;
  summary?: string;
  featured?: boolean;
}

/** Name from image filename (without extension), underscores as spaces. */
export function accessoryNameFromFile(file: string): string {
  return file.replace(/\.[^.]+$/, '').replace(/_/g, ' ');
}

export const sewerlightAccessories: SewerLightAccessory[] = [
  {
    file: 'inversion-drum.png',
    name: 'Inversion Drum',
    summary: 'A wide portfolio of inversion drums to support your CIPP operations.',
    featured: true,
  },
  { file: 'Y_connector_01_copia.png', name: 'Y Connector' },
  { file: 'Adapter_dn200_01_copia.png', name: 'Adapter DN200' },
  { file: 'Adapter_dn200_02_copia.png', name: 'Adapter DN200' },
  { file: 'Adapter_DN150_01_copia.png', name: 'Adapter DN150' },
  { file: 'Adapter_DN150_02_copia.png', name: 'Adapter DN150' },
  { file: 'Redukcja_CAMLOCK_6_01_copia.png', name: 'Camlock 6' },
];

export function resolveAccessory(item: SewerLightAccessory) {
  const name = item.name ?? accessoryNameFromFile(item.file);
  return {
    name,
    summary: item.summary,
    featured: item.featured ?? false,
    image: `/images/accessories/${item.file}`,
    imageAlt: name,
  };
}
