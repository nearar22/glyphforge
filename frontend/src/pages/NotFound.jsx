import { useNavigate } from 'react-router-dom';
import { Hexagon } from 'lucide-react';
import { Btn } from '../components/ui/primitives.jsx';
import GlyphCore from '../components/glyph/GlyphCore.jsx';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="opacity-60">
        <GlyphCore seed={{ primaryHue: 326, secondaryHue: 146, ringCount: 4, orbitCount: 5, riftIntensity: 70, glyphComplexity: 60 }} size={220} />
      </div>
      <p className="rune-label mt-6">unforged coordinate</p>
      <h1 className="mt-2 font-display text-5xl font-bold text-ether">404</h1>
      <p className="mt-2 max-w-sm text-sm text-mist">
        This dimension holds no genome. The path you followed leads into the void.
      </p>
      <div className="mt-6">
        <Btn icon={Hexagon} onClick={() => navigate('/')}>Return to the forge</Btn>
      </div>
    </div>
  );
}
