import rawData from './tarot_raw.json';

export type MinorSuit = 'wands' | 'cups' | 'swords' | 'coins';
export type Arcana = 'major' | MinorSuit;

export interface TarotCard {
  id: string;
  name: string;
  title: string;
  arcana: Arcana;
  suitLabel: string;
  rankLabel: string;
  fortuneTelling: string[];
  keywords: string[];
  meanings: {
    upright: string[];
    reversed: string[];
  };
  index: number;
}

type RawCard = (typeof rawData)["tarot_interpretations"][number];

const suitLabels: Record<Arcana, string> = {
  major: 'Major Arcana',
  wands: 'Wands',
  cups: 'Cups',
  swords: 'Swords',
  coins: 'Coins (Pentacles)',
};

const rankLabels: Record<string, string> = {
  page: 'Page',
  knight: 'Knight',
  queen: 'Queen',
  king: 'King',
  ace: 'Ace',
};

const sanitizeName = (name: string): string => {
  const cleaned = name.includes('/') ? name.split('/')[1] : name;
  return cleaned
    .replace(/\b([a-z])/g, (match) => match.toUpperCase())
    .replace(/\bOf\b/gi, 'of')
    .replace(/\s+/g, ' ')
    .trim();
};

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const tarotCards: TarotCard[] = rawData.tarot_interpretations.map(
  (card: RawCard, index) => {
    const arcana = card.suit as Arcana;
    const cleanedName = sanitizeName(card.name);
    const rank = card.rank;

    const rankLabel =
      typeof rank === 'number'
        ? rank === 0
          ? '0'
          : String(rank)
        : rankLabels[rank] ?? sanitizeName(String(rank));

    return {
      id: slugify(cleanedName),
      name: cleanedName,
      title:
        arcana === 'major'
          ? cleanedName
          : `${rankLabels[rank as string] ?? sanitizeName(String(rank))} of ${suitLabels[arcana]}`,
      arcana,
      suitLabel: suitLabels[arcana],
      rankLabel,
      fortuneTelling: card.fortune_telling,
      keywords: card.keywords,
      meanings: {
        upright: card.meanings.light,
        reversed: card.meanings.shadow,
      },
      index,
    };
  },
);

export const createShuffledDeck = (seed: number): TarotCard[] => {
  const deck = [...tarotCards];
  const random = mulberry32(seed);
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const createSeededRandom = (seed: number) => mulberry32(seed);

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), t | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

export const seedFromString = (input: string): number => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
};