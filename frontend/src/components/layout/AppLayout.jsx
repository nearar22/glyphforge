import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Topbar from './Topbar.jsx';
import DimensionalBackground from './DimensionalBackground.jsx';
import { getSettings } from '../../lib/archive.js';

// Wraps every route with the topbar, the living backdrop, and a portal-style
// page transition (dimensional shift) between routes.
export default function AppLayout() {
  const { pathname } = useLocation();
  const settings = getSettings();

  return (
    <div className="relative min-h-screen">
      <DimensionalBackground intensity={settings.animationIntensity} />
      <Topbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname.startsWith('/forge') ? 'forge' : pathname}
          initial={{ opacity: 0, scale: 0.99, filter: 'blur(6px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.01, filter: 'blur(6px)' }}
          transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
