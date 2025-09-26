import { useEffect, useMemo, useState } from 'react';
import InterpretationPanel from './components/InterpretationPanel';
import TarotCardFace from './components/TarotCardFace';
import type { TarotCard } from './data/tarot';
import {
  createSeededRandom,
  createShuffledDeck,
  seedFromString,
} from './data/tarot';

interface SpreadDefinition {
  id: string;
  label: string;
  description: string;
  positions: string[];
}

type ReadingCard = {
  card: TarotCard;
  reversed: boolean;
  positionLabel: string;
};

const spreads: SpreadDefinition[] = [
  {
    id: 'single',
    label: 'Single Insight',
    description: 'One card to illuminate the core of your question.',
    positions: ['Illumination'],
  },
  {
    id: 'three',
    label: 'Past | Present | Future',
    description: 'A balanced look at how your story is unfolding.',
    positions: ['Past', 'Present', 'Future'],
  },
  {
    id: 'five',
    label: 'Crossroads of Growth',
    description:
      'Explore influences, challenges, support, guidance, and momentum.',
    positions: ['Root', 'Challenge', 'Support', 'Guidance', 'Trajectory'],
  },
];

const buildReading = (seedText: string, spread: SpreadDefinition): ReadingCard[] => {
  const numericSeed = seedFromString(seedText);
  const deck = createShuffledDeck(numericSeed);
  const orientationRandom = createSeededRandom(numericSeed + 137);

  return spread.positions.map((positionLabel, index) => ({
    card: deck[index],
    reversed: orientationRandom() > 0.5,
    positionLabel,
  }));
};

const App = () => {
  const [question, setQuestion] = useState('');
  const [customSeedInput, setCustomSeedInput] = useState('');
  const [reading, setReading] = useState({
    seedText: `${Date.now()}`,
    spreadId: spreads[1].id,
  });
  const [focusedIndex, setFocusedIndex] = useState(0);

  const selectedSpread = useMemo(
    () => spreads.find((option) => option.id === reading.spreadId) ?? spreads[0],
    [reading.spreadId],
  );

  const readingCards = useMemo(
    () => buildReading(reading.seedText, selectedSpread),
    [reading.seedText, selectedSpread],
  );

  useEffect(() => {
    setFocusedIndex(0);
  }, [reading.seedText, reading.spreadId]);

  const handleDraw = () => {
    const trimmedSeed = customSeedInput.trim();
    const base = trimmedSeed || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const nextSeed = `${base}|${question || 'open-intention'}|${reading.spreadId}`;
    setReading((prev) => ({ ...prev, seedText: nextSeed }));
  };

  const focusedCard = readingCards[focusedIndex];

  return (
    <div className="page">
      <header className="page__header">
        <div className="page__title-block">
          <h1>Art Nouveau Tarot Atelier</h1>
          <p>
            Draw from a bespoke deck of 78 cards, each rendered with flowing lines
            and blossoms inspired by Art Nouveau. Shape a question, cast a
            spread, and reflect on the layered meanings.
          </p>
        </div>
        <div className="page__controls">
          <label className="field">
            <span>Focus or question</span>
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="What would you like clarity on?"
            />
          </label>
          <label className="field">
            <span>Custom seed (optional)</span>
            <input
              type="text"
              value={customSeedInput}
              onChange={(event) => setCustomSeedInput(event.target.value)}
              placeholder="Share this to recreate a reading"
            />
          </label>
          <div className="controls__actions">
            <button type="button" onClick={handleDraw} className="primary">
              Cast a reading
            </button>
            <div className="seed-display">
              <span className="seed-display__label">Reading code</span>
              <code className="seed-display__value">
                {seedFromString(reading.seedText)}
              </code>
            </div>
          </div>
        </div>
      </header>

      <main className="page__main">
        <section className="spread">
          <form>
            <fieldset className="spread__options">
              <legend>Choose a spread</legend>
              {spreads.map((option) => (
                <label key={option.id} className="spread__option">
                  <input
                    type="radio"
                    name="spread"
                    value={option.id}
                    checked={option.id === reading.spreadId}
                    onChange={() =>
                      setReading((prev) => ({ ...prev, spreadId: option.id }))
                    }
                  />
                  <div>
                    <span className="spread__option-title">{option.label}</span>
                    <span className="spread__option-description">{option.description}</span>
                  </div>
                </label>
              ))}
            </fieldset>
          </form>
        </section>

        <section
          className={`spread__cards spread__cards--${selectedSpread.positions.length}`}
          aria-label="Cards in this reading"
        >
          <h2 className="visually-hidden">Cards</h2>
          <div className={`spread__grid spread__grid--${selectedSpread.positions.length}`}>
            {readingCards.map((entry, index) => (
              <TarotCardFace
                key={`${entry.card.id}-${entry.positionLabel}`}
                card={entry.card}
                positionLabel={selectedSpread.positions[index]}
                reversed={entry.reversed}
                isFocused={index === focusedIndex}
                onSelect={() => setFocusedIndex(index)}
              />
            ))}
          </div>
        </section>

        {focusedCard && (
          <div className="spread__explanation">
            <h2 className="visually-hidden">Explanation of cards</h2>
            <InterpretationPanel
              card={focusedCard.card}
              reversed={focusedCard.reversed}
              positionLabel={focusedCard.positionLabel}
            />
          </div>
        )}
      </main>

      <footer className="page__footer">
        <p>
          Each illustration is generated procedurally from the card's essence, blending botanical curves, radiant
          gradients, and ornate frames to echo the Art Nouveau movement.
        </p>
      </footer>
    </div>
  );
};

export default App;