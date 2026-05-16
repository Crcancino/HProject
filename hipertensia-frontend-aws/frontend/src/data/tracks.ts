export type AudioTrack = {
  id: string;
  label: string;
  badge?: string;
  srcMp3: string;
  srcOgg: string;
  note: string;
};

export const comparisonTracks = {
  original: {
    id: 'original-sin-ia',
    label: 'Audio original (sin IA)',
    badge: 'Sin IA',
    srcMp3: '/audio/original-sin-ia.mp3',
    srcOgg: '/audio/original-sin-ia.ogg',
    note: 'Toma base recibida por WhatsApp.'
  },
  enhanced: {
    id: 'version-con-ia',
    label: 'Versión mejorada con IA',
    badge: 'Con IA',
    srcMp3: '/audio/version-con-ia.mp3',
    srcOgg: '/audio/version-con-ia.ogg',
    note: 'Toma definida como versión comparativa con IA.'
  }
} satisfies Record<string, AudioTrack>;

export const extraTracks: AudioTrack[] = [
  {
    id: 'demo-01',
    label: 'Demo extendida',
    badge: 'Material',
    srcMp3: '/audio/demo-01.mp3',
    srcOgg: '/audio/demo-01.ogg',
    note: 'Audio adicional disponible para la landing.'
  },
  {
    id: 'demo-02',
    label: 'Demo corta',
    badge: 'Material',
    srcMp3: '/audio/demo-02.mp3',
    srcOgg: '/audio/demo-02.ogg',
    note: 'Audio adicional disponible para la landing.'
  }
];
