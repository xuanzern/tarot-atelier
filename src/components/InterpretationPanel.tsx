import type { TarotCard } from '../data/tarot';

interface InterpretationPanelProps {
  card: TarotCard;
  reversed: boolean;
  positionLabel: string;
}

const InterpretationPanel = ({ card, reversed, positionLabel }: InterpretationPanelProps) => (
  <section className="interpretation" aria-live="polite">
    <header className="interpretation__header">
      <div>
        <p className="interpretation__position">{positionLabel}</p>
        <h2 className="interpretation__title">{card.name}</h2>
        <p className="interpretation__meta">
          {card.suitLabel}
          {card.arcana !== 'major' && ` | ${card.rankLabel}`}
          {reversed ? ' | Reversed' : ' | Upright'}
        </p>
      </div>
    </header>

    <div className="interpretation__keywords">
      <strong>Keywords:</strong>
      <span>{card.keywords.join(', ')}</span>
    </div>

    <div className="interpretation__fortune">
      <strong>Fortune telling hints</strong>
      <ul>
        {card.fortuneTelling.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>

    <div className="interpretation__meanings">
      <article className={reversed ? 'dimmed' : ''}>
        <h3>Upright</h3>
        <ul>
          {card.meanings.upright.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </article>
      <article className={reversed ? '' : 'dimmed'}>
        <h3>Reversed</h3>
        <ul>
          {card.meanings.reversed.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </article>
    </div>
  </section>
);

export default InterpretationPanel;