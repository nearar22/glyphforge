import { Link, NavLink } from 'react-router-dom';
import { Hexagon, ExternalLink } from 'lucide-react';
import WalletButton from '../ui/WalletButton.jsx';
import { CONTRACT_ADDRESS, EXPLORER, NETWORK_NAME } from '../../lib/contract.js';
import { truncateAddress } from '../../utils/formatters.js';

const NAV = [
  { to: '/forge', label: 'Forge' },
  { to: '/archive', label: 'Archive' },
];

export default function Topbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-abyss/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center">
            <Hexagon className="h-9 w-9 text-violet" strokeWidth={1.2} />
            <span className="absolute h-2 w-2 rounded-full bg-cyan animate-pulse-core" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ether">GlyphForge</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 sm:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors ${
                  isActive ? 'text-cyan' : 'text-mist hover:text-ether'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-mist transition-colors hover:text-cyan md:flex"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            {NetworkName()} {truncateAddress(CONTRACT_ADDRESS)}
            <ExternalLink className="h-3 w-3" />
          </a>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}

function NetworkName() {
  return NETWORK_NAME;
}
