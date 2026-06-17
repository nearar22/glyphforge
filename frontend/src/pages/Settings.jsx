import { useState } from 'react';
import { Save, Trash2, Sparkles, Gauge } from 'lucide-react';
import { Btn, Panel } from '../components/ui/primitives.jsx';
import { getSettings, saveSettings, clearArchive, listArchive } from '../lib/archive.js';
import { useToast } from '../components/ui/Toast.jsx';
import { classNames } from '../utils/formatters.js';

function OptionRow({ label, options, value, onChange }) {
  return (
    <div>
      <p className="rune-label mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={classNames(
              'rounded-lg border px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.12em] transition-colors',
              value === o.value ? 'border-cyan bg-cyan/12 text-cyan' : 'border-line-bright text-mist hover:text-ether'
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Settings() {
  const toast = useToast();
  const [settings, setSettings] = useState(getSettings());
  const count = listArchive().length;

  function patch(p) {
    setSettings((s) => ({ ...s, ...p }));
  }
  function save() {
    saveSettings(settings);
    toast.success('Settings saved');
    setTimeout(() => window.location.reload(), 600);
  }
  function wipe() {
    if (!window.confirm('Clear the local genome archive? On-chain genomes are not affected.')) return;
    clearArchive();
    toast.info('Local archive cleared');
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="rune-label">settings</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ether">Configuration</h1>

      <div className="mt-6 space-y-4">
        <Panel label="visuals" title={<span className="inline-flex items-center gap-2"><Gauge className="h-4 w-4" /> Motion and density</span>}>
          <div className="space-y-5">
            <OptionRow
              label="animation intensity"
              value={settings.animationIntensity}
              onChange={(v) => patch({ animationIntensity: v })}
              options={[
                { value: 'full', label: 'Full' },
                { value: 'calm', label: 'Calm' },
                { value: 'reduced', label: 'Reduced' },
              ]}
            />
            <OptionRow
              label="visual density"
              value={settings.visualDensity}
              onChange={(v) => patch({ visualDensity: v })}
              options={[
                { value: 'comfortable', label: 'Comfortable' },
                { value: 'dense', label: 'Dense' },
              ]}
            />
          </div>
        </Panel>

        <Panel label="theme" title={<span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Dimensional variant</span>}>
          <OptionRow
            label="theme variant"
            value={settings.theme}
            onChange={(v) => patch({ theme: v })}
            options={[
              { value: 'abyss', label: 'Abyss' },
              { value: 'solar', label: 'Solar Rift' },
              { value: 'emerald', label: 'Emerald Ritual' },
              { value: 'crimson', label: 'Crimson Tension' },
            ]}
          />
          <p className="mt-3 text-xs text-mist">
            The theme tints the glyph palette accents. Abyss is the default violet-and-cyan field.
          </p>
        </Panel>

        <Panel label="storage" title="Local archive">
          <p className="text-sm text-mist">{count} genome{count === 1 ? '' : 's'} cached in this browser. The chain remains the source of truth.</p>
          <div className="mt-3">
            <Btn variant="ghost" icon={Trash2} onClick={wipe}>Clear local archive</Btn>
          </div>
        </Panel>

        <div className="flex justify-end">
          <Btn icon={Save} onClick={save}>Save settings</Btn>
        </div>
      </div>
    </div>
  );
}
