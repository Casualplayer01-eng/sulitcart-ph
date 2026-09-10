import { useState } from 'react';
import { DEMO_PRESETS } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';

/**
 * Floating demo dock: the classroom buttons stay reachable on every screen
 * during the recording, without hunting through pages.
 */
export default function DemoDock({ requestRun, requestExplain, requestReset }) {
  const { applyPreset, clear } = useCart();
  const [open, setOpen] = useState(true);

  const resetAll = () => {
    clear();
    requestReset();
  };

  return (
    <div className={`demo-dock ${open ? 'is-open' : ''}`} aria-label="Classroom demo dock">
      <button type="button" className="dock-toggle" onClick={() => setOpen((o) => !o)}>
        🎓 CLASSROOM DEMO {open ? '▾' : '▴'}
      </button>
      {open && (
        <div className="dock-body">
          <div className="dock-row">
            {DEMO_PRESETS.map((p) => (
              <button
                type="button"
                key={p.total}
                className="btn btn-demo btn-sm"
                onClick={() => applyPreset(p.items)}
              >
                TRY {p.label}
              </button>
            ))}
          </div>
          <div className="dock-row">
            <button type="button" className="btn btn-run btn-sm" onClick={requestRun}>
              ▶ RUN
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={requestExplain}>
              💡 EXPLAIN
            </button>
            <button type="button" className="btn btn-danger-ghost btn-sm" onClick={resetAll}>
              ↺ RESET
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
