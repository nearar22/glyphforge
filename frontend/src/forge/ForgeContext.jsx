import { createContext, useContext, useState, useCallback } from 'react';

// Holds the in-progress protocol identity as the user moves through the ritual
// (Chamber -> Value Orbit -> Rule Rings -> Incentive Matrix -> Tension Rift -> Forge).
const ForgeContext = createContext(null);

const EMPTY = {
  protocolName: '',
  mission: '',
  ecosystem: 'DAO',
  maturity: 'Concept',
  values: [],
  rules: [], // { text, weight }
  incentives: [],
  taboos: [],
};

export function ForgeProvider({ children }) {
  const [draft, setDraft] = useState(EMPTY);

  const update = useCallback((patch) => setDraft((d) => ({ ...d, ...patch })), []);
  const reset = useCallback(() => setDraft(EMPTY), []);
  const loadDemo = useCallback((demo) => {
    setDraft({
      protocolName: demo.protocolName,
      mission: demo.mission,
      ecosystem: demo.ecosystem,
      maturity: 'Testnet',
      values: [...demo.values],
      rules: demo.rules.map((text) => ({ text, weight: 'Strong Rule' })),
      incentives: [...demo.incentives],
      taboos: [...demo.taboos],
    });
  }, []);

  const toArgs = useCallback(() => {
    return [
      draft.protocolName,
      draft.mission,
      draft.ecosystem,
      draft.values.join('\n'),
      draft.rules.map((r) => (typeof r === 'string' ? r : r.text)).join('\n'),
      draft.incentives.join('\n'),
      draft.taboos.join('\n'),
    ];
  }, [draft]);

  return (
    <ForgeContext.Provider value={{ draft, update, reset, loadDemo, toArgs }}>
      {children}
    </ForgeContext.Provider>
  );
}

export function useForgeDraft() {
  const ctx = useContext(ForgeContext);
  if (!ctx) throw new Error('useForgeDraft must be used within ForgeProvider');
  return ctx;
}
