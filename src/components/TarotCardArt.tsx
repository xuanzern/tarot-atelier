import { useMemo } from 'react';
import type { TarotCard } from '../data/tarot';
import { createSeededRandom, seedFromString } from '../data/tarot';

interface TarotCardArtProps {
  card: TarotCard;
}

type Palette = {
  backgroundA: string;
  backgroundB: string;
  frame: string;
  accent: string;
  line: string;
  highlight: string;
};

const palettes: Palette[] = [
  {
    backgroundA: '#fef6e4',
    backgroundB: '#f7d9c4',
    frame: '#6f4a3d',
    accent: '#b05f6d',
    line: '#3b2c35',
    highlight: '#7dcfb6',
  },
  {
    backgroundA: '#fdf2f8',
    backgroundB: '#fce7f3',
    frame: '#7a4f7a',
    accent: '#d86c89',
    line: '#3c2a4d',
    highlight: '#f8c77d',
  },
  {
    backgroundA: '#f3f8ee',
    backgroundB: '#dce6c7',
    frame: '#597a5c',
    accent: '#99c5b5',
    line: '#3a4d42',
    highlight: '#f2a541',
  },
  {
    backgroundA: '#f4f1de',
    backgroundB: '#e0c097',
    frame: '#9c6644',
    accent: '#a44a3f',
    line: '#43302e',
    highlight: '#68a691',
  },
  {
    backgroundA: '#edf7fc',
    backgroundB: '#d6e6f2',
    frame: '#4b6587',
    accent: '#9dacff',
    line: '#2b3a55',
    highlight: '#f1b963',
  },
  {
    backgroundA: '#fff5f0',
    backgroundB: '#f9dcc4',
    frame: '#7f5539',
    accent: '#c2847a',
    line: '#463f3a',
    highlight: '#9dc08b',
  },
];

const CARD_WIDTH = 300;
const CARD_HEIGHT = 480;

const createOrganicCurve = (rand: () => number, variant: number): string => {
  const topMargin = 30 + rand() * 40;
  const bottomMargin = 380 + rand() * 40;
  const midY = (CARD_HEIGHT / 2) + (rand() - 0.5) * 80;
  const sway = 40 + rand() * 80;
  const startX = 60 + variant * 25 + rand() * 10;
  const controlOffset = sway * (rand() > 0.5 ? 1 : -1);
  const endX = CARD_WIDTH - startX;

  return `M ${startX} ${bottomMargin}
    C ${startX - controlOffset} ${midY}, ${endX + controlOffset} ${midY}, ${endX} ${topMargin}`;
};

const createPetal = (rand: () => number, radius: number, angle: number) => {
  const cx = CARD_WIDTH / 2;
  const cy = CARD_HEIGHT / 2;
  const length = radius * (0.6 + rand() * 0.3);
  const width = 18 + rand() * 12;
  const theta = (angle * Math.PI) / 180;
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const x1 = cx + sin * width;
  const y1 = cy - cos * width;
  const x2 = cx + sin * -width;
  const y2 = cy - cos * -width;
  const tipX = cx + sin * length;
  const tipY = cy - cos * length;
  return `M ${x1} ${y1}
    C ${cx + sin * width * 1.2} ${cy - cos * width * 1.2},
      ${tipX + cos * width * 0.5} ${tipY + sin * width * 0.5},
      ${tipX} ${tipY}
    C ${tipX - cos * width * 0.5} ${tipY - sin * width * 0.5},
      ${cx - sin * width * 1.2} ${cy + cos * width * 1.2},
      ${x2} ${y2}`;
};

const createMotif = (rand: () => number) => {
  const cx = CARD_WIDTH / 2;
  const top = 100 + rand() * 60;
  const bottom = CARD_HEIGHT - top;
  const width = 40 + rand() * 30;
  const control = 80 + rand() * 30;
  return `M ${cx - width} ${bottom}
    Q ${cx} ${bottom - control}, ${cx - width / 2} ${top}
    Q ${cx} ${top - 30}, ${cx + width / 2} ${top}
    Q ${cx} ${bottom - control}, ${cx + width} ${bottom}`;
};

const createSpec = (cardId: string) => {
  const seed = seedFromString(cardId);
  const rand = createSeededRandom(seed);
  const palette = palettes[seed % palettes.length];
  const vineCount = 3;
  const vines = Array.from({ length: vineCount }, (_, index) =>
    createOrganicCurve(rand, index),
  );
  const petals = [
    createPetal(rand, 110, 0),
    createPetal(rand, 120, 72),
    createPetal(rand, 130, 144),
    createPetal(rand, 140, 216),
    createPetal(rand, 150, 288),
  ];
  const motifs = Array.from({ length: 2 }, () => createMotif(rand));
  return {
    palette,
    vines,
    petals,
    motifs,
  };
};

const TarotCardArt = ({ card }: TarotCardArtProps) => {
  const spec = useMemo(() => createSpec(card.id), [card.id]);
  const gradientId = `grad-${card.id}`;
  const patternId = `pattern-${card.id}`;

  return (
    <svg
      className="tarot-card-art"
      viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="45%" r="75%">
          <stop offset="0%" stopColor={spec.palette.backgroundA} />
          <stop offset="100%" stopColor={spec.palette.backgroundB} />
        </radialGradient>
        <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M0 20 Q 20 0 40 20 Q 20 40 0 20Z"
            fill="none"
            stroke={spec.palette.highlight}
            strokeWidth="1.5"
            opacity="0.35"
          />
        </pattern>
      </defs>

      <rect
        x="6"
        y="6"
        width={CARD_WIDTH - 12}
        height={CARD_HEIGHT - 12}
        rx="34"
        fill={`url(#${gradientId})`}
        stroke={spec.palette.frame}
        strokeWidth="4"
      />
      <rect
        x="26"
        y="26"
        width={CARD_WIDTH - 52}
        height={CARD_HEIGHT - 52}
        rx="28"
        fill={`url(#${patternId})`}
        opacity="0.45"
      />

      {spec.vines.map((path, index) => (
        <g key={`vine-${index}`}>
          <path
            d={path}
            fill="none"
            stroke={spec.palette.line}
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.65"
          />
          <path
            d={path}
            fill="none"
            stroke={spec.palette.accent}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
            transform="scale(-1 1) translate(-300 0)"
          />
        </g>
      ))}

      {spec.petals.map((path, index) => (
        <path
          key={`petal-${index}`}
          d={path}
          fill={spec.palette.accent}
          opacity={0.35 + (index * 0.1)}
          stroke={spec.palette.line}
          strokeWidth={1.5}
        />
      ))}

      {spec.motifs.map((path, index) => (
        <path
          key={`motif-${index}`}
          d={path}
          fill="none"
          stroke={spec.palette.frame}
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity="0.7"
        />
      ))}

      <circle
        cx={CARD_WIDTH / 2}
        cy={CARD_HEIGHT / 2}
        r={64}
        fill={spec.palette.highlight}
        opacity="0.55"
      />
      <circle
        cx={CARD_WIDTH / 2}
        cy={CARD_HEIGHT / 2}
        r={42}
        fill="none"
        stroke={spec.palette.line}
        strokeWidth={3}
        strokeDasharray="12 8"
        opacity="0.8"
      />
      <circle
        cx={CARD_WIDTH / 2}
        cy={CARD_HEIGHT / 2}
        r={28}
        fill={spec.palette.accent}
        opacity="0.75"
      />
    </svg>
  );
};

export default TarotCardArt;