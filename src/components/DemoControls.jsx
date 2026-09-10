import { DEMO_PRESETS } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { formatPHP } from '../utils/checkout.js';

/**
 * CLASSROOM DEMO panel — one-click carts for the video:
 * TRY ₱1,200 (FALSE) · TRY ₱1,500 (boundary TRUE) · TRY ₱1,800 (TRUE) · RESET
 */
export default function DemoControls({ onRun, onReset, onExplain }) {
  const { applyPreset, cartTotal } = useCart();

  return (
    <section className="card demo-controls" aria-label="Classroom demo controls">
      <div className="demo-head">
        <h2 className="section-title">🎓 CLASSROOM DEMO</h2>
        <p className="section-sub">
          One click builds a real cart with exactly that subtotal — the algorithm then runs on it.
          Current cart_total: <strong>{formatPHP(cartTotal)}</strong>
        </p>
      </div>

      <div className="demo-buttons">
        {DEMO_PRESETS.map((preset) => (
          <button
            type="button"
            key={preset.total}
            className={`btn btn-demo ${cartTotal === preset.total ? 'is-on' : ''}`}
            onClick={() => applyPreset(preset.items)}
          >
            TRY {preset.label}
            <span className="demo-hint">{preset.hint}</span>
          </button>
        ))}
        <button type="button" className="btn btn-run" onClick={onRun}>
          ▶ RUN ALGORITHM
        </button>
        <button type="button" className="btn btn-ghost" onClick={onExplain}>
          💡 EXPLAIN THIS CALCULATION
        </button>
        <button type="button" className="btn btn-danger-ghost" onClick={onReset}>
          ↺ RESET DEMO
        </button>
      </div>
    </section>
  );
}
