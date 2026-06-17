import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import Home from './pages/Home.jsx';
import ForgeChamber from './pages/ForgeChamber.jsx';
import ValueOrbit from './pages/ValueOrbit.jsx';
import RuleRings from './pages/RuleRings.jsx';
import IncentiveMatrix from './pages/IncentiveMatrix.jsx';
import TensionRift from './pages/TensionRift.jsx';
import GenomeReveal from './pages/GenomeReveal.jsx';
import ConstitutionArtifact from './pages/ConstitutionArtifact.jsx';
import GlyphArchive from './pages/GlyphArchive.jsx';
import ArtifactDetail from './pages/ArtifactDetail.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="forge" element={<ForgeChamber />} />
        <Route path="forge/values" element={<ValueOrbit />} />
        <Route path="forge/rules" element={<RuleRings />} />
        <Route path="forge/incentives" element={<IncentiveMatrix />} />
        <Route path="forge/tension" element={<TensionRift />} />
        <Route path="forge/reveal" element={<GenomeReveal />} />
        <Route path="genome/:id" element={<ArtifactDetail />} />
        <Route path="genome/:id/constitution" element={<ConstitutionArtifact />} />
        <Route path="archive" element={<GlyphArchive />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
