import { useRef, useState } from 'react';
import { DEMO_PRESETS } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';

/**
 * Floating classroom demo dock: reachable on every screen while recording.
 * Drag it anywhere by its yellow title bar (a plain click still opens/closes).
 */
export default function DemoDock({ requestRun, requestExplain, requestReset }) {
  const { applyPreset, clear } = useCart();
  const [open, setOpen] = useState(true);
  const [pos, setPos] = useState(null); // null = default bottom-right corner
  const dockRef = useRef(null);
  const dragRef = useRef(null);

  const onPointerDown = (e) => {
    const el = dockRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
      w: rect.width,
      h: rect.height,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 6) return;
    d.moved = true;
    const maxX = Math.max(8, window.innerWidth - d.w - 8);
    const maxY = Math.max(8, window.innerHeight - d.h - 8);
    setPos({
      x: Math.min(Math.max(8, e.clientX - d.dx), maxX),
      y: Math.min(Math.max(8, e.clientY - d.dy), maxY),
    });
  };

  const onPointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d && !d.moved) setOpen((o) => !o); // plain click = toggle open/close
  };

  const resetAll = () => {
    clear();
    requestReset();
  };

  return (
    <div
      ref={dockRef}
      className={`demo-dock ${open ? 'is-open' : ''}`}
      aria-label="Classroom demo dock (draggable)"
      style={pos ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' } : undefined}
    >
      <button
        type="button"
        className="dock-toggle"
        title="Drag to move • click to open/close"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <span className="dock-grip" aria-hidden="true">
          ⠿
        </span>
        <span>🎓 CLASSROOM DEMO {open ? '▾' : '▴'}</span>
        <span className="dock-grip" aria-hidden="true">
          ⠿
        </span>
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
