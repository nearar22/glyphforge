import { Meter } from '../ui/primitives.jsx';
import { DIMENSIONS } from '../../lib/contract.js';

const TONE = {
  alignment: '#06D6A0',
  resilience: '#22D3EE',
  sustainability: '#FFD166',
  governanceComplexity: '#A78BC0',
  decentralizationPressure: '#F72585',
};

export default function GenomeScorePanel({ scores }) {
  return (
    <div className="space-y-3.5">
      {DIMENSIONS.map((d) => (
        <Meter key={d.key} label={d.label} value={scores[d.key] ?? 0} tone={TONE[d.key]} />
      ))}
    </div>
  );
}
