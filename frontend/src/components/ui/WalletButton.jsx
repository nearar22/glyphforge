import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronDown, LogOut, Copy, Droplet, AlertCircle } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet.js';
import { truncateAddress } from '../../utils/formatters.js';
import { FAUCET, NETWORK_NAME } from '../../lib/contract.js';
import { useToast } from './Toast.jsx';

export default function WalletButton() {
  const wallet = useWallet();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const toast = useToast();

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!wallet.address) {
    return (
      <button
        onClick={() => {
          if (!wallet.hasProvider) {
            toast.error('No wallet detected. Install MetaMask to forge on-chain.');
            return;
          }
          wallet.connect();
        }}
        disabled={wallet.connecting}
        className="btn btn-ghost"
      >
        <Wallet className="h-4 w-4" />
        {wallet.connecting ? 'Linking' : 'Connect'}
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="btn btn-ghost">
        <span className={`h-2 w-2 rounded-full ${wallet.onRightChain ? 'bg-emerald' : 'bg-gold'}`} />
        {truncateAddress(wallet.address)}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass glass-glow absolute right-0 z-50 mt-2 w-64 p-2"
          >
            <div className="border-b border-line px-2 pb-2">
              <p className="rune-label">Session</p>
              <p className="mt-1 break-all font-mono text-[0.72rem] text-ether">{wallet.address}</p>
              {!wallet.onRightChain && (
                <p className="mt-1.5 flex items-center gap-1 font-mono text-[0.62rem] text-gold">
                  <AlertCircle className="h-3 w-3" /> Switch to {NETWORK_NAME}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(wallet.address);
                toast.info('Address copied');
              }}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-ether transition-colors hover:bg-ultraviolet/60"
            >
              <Copy className="h-3.5 w-3.5 text-mist" /> Copy address
            </button>
            <a
              href={FAUCET}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-ether transition-colors hover:bg-ultraviolet/60"
            >
              <Droplet className="h-3.5 w-3.5 text-mist" /> Request test GEN
            </a>
            <button
              onClick={() => {
                wallet.disconnect();
                setOpen(false);
                toast.info('Wallet disconnected');
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-crimson transition-colors hover:bg-crimson/10"
            >
              <LogOut className="h-3.5 w-3.5" /> Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
