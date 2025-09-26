import type { TarotCard } from '../data/tarot';
import TarotCardArt from './TarotCardArt';

interface TarotCardFaceProps {
  card: TarotCard;
  positionLabel: string;
  reversed: boolean;
  isFocused: boolean;
  onSelect: () => void;
}

const TarotCardFace = ({
  card,
  positionLabel,
  reversed,
  isFocused,
  onSelect,
}: TarotCardFaceProps) => (
  <button
    type="button"
    className={`tarot-card ${reversed ? 'tarot-card--reversed' : ''} ${
      isFocused ? 'tarot-card--focused' : ''
    }`}
    onClick={onSelect}
    aria-pressed={isFocused}
    aria-label={`${positionLabel}: ${card.name}${reversed ? ' (reversed)' : ''}`}
  >
    <div className="tarot-card__frame">
      <div className="tarot-card__art-wrapper">
        <TarotCardArt card={card} />
      </div>
      <div className="tarot-card__title-area">
        <span className="tarot-card__position">{positionLabel}</span>
        <span className="tarot-card__name">{card.name}</span>
        {reversed && <span className="tarot-card__reversed">Reversed</span>}
      </div>
    </div>
  </button>
);

export default TarotCardFace;
