import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { formatPHP } from '../utils/checkout.js';
import AlgorithmVisualizer from '../components/AlgorithmVisualizer.jsx';
import DemoControls from '../components/DemoControls.jsx';
import ExplanationPanel from '../components/ExplanationPanel.jsx';
import MappingPanel from '../components/MappingPanel.jsx';
import UnderTheHood from '../components/UnderTheHood.jsx';
import {
  Terminal,
  IoShape,
  StoreShape,
  DecisionShape,
  ProcessShape,
  DelayShape,
  ConnectorShape,
  DisplayShape,
  CalloutNote,
  LegendRow,
} from '../components/FlowShapes.jsx';

/**
 * The educational hub: demo controls + live flowchart visualizer +
 * explanation + flowchart→website mapping + under-the-hood code + legend.
 */
export default function AlgorithmLab({ go, runSignal, resetSignal, explainSignal, requestRun, requestReset }) {
  const { clear, cartTotal, result } = useCart();
  const [explainOpen, setExplainOpen] = useState(false);
  const [explainFocus, setExplainFocus] = useState(0);
  const explainRef = useRef(null);

  // EXPLAIN requests (panel button or floating dock): open AND scroll to it
  const showExplanation = () => {
    setExplainOpen(true);
    setExplainFocus((f) => f + 1);
  };

  useEffect(() => {
    if (explainSignal > 0) showExplanation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explainSignal]);

  useEffect(() => {
    if (!explainOpen || explainFocus === 0) return undefined;
    const t = setTimeout(() => {
      explainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => clearTimeout(t);
  }, [explainOpen, explainFocus]);

  const handleReset = () => {
    clear();
    setExplainOpen(false);
    requestReset(); // stops any running animation + clears highlights
  };

  return (
    <div className="page lab-page">
      <div className="section-head lab-head">
        <div>
          <h1 className="section-title">Algorithm Lab</h1>
          <p className="section-sub">
            Our flowchart represents the logic behind this checkout. Instead of only viewing the
            flowchart, watch what happens when that logic actually runs on your cart
            {cartTotal > 0 ? ` (${formatPHP(cartTotal)})` : ' (empty right now)'}.
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => go('home')}>
          ← Back to Shop
        </button>
      </div>

      <DemoControls
        onRun={requestRun}
        onReset={handleReset}
        onExplain={showExplanation}
      />

      <AlgorithmVisualizer runSignal={runSignal} resetSignal={resetSignal} />

      <div ref={explainRef}>
        <ExplanationPanel result={result} open={explainOpen} onClose={() => setExplainOpen(false)} />
      </div>

      <div className="lab-grid">
        <MappingPanel />
        <UnderTheHood />
      </div>

      <section className="card legend-card" aria-label="Flowchart shape legend">
        <h2 className="section-title">FLOWCHART LEGEND</h2>
        <div className="legend-grid">
          <LegendRow shape={<Terminal state="done">START</Terminal>} name="Start / End (terminal)" />
          <LegendRow shape={<IoShape state="done"><span className="mini">INPUT</span></IoShape>} name="Input / Output (parallelogram)" />
          <LegendRow shape={<StoreShape state="done"><span className="mini">STORE</span></StoreShape>} name="Data store (cylinder)" />
          <LegendRow shape={<DecisionShape state="done"><span className="mini">?</span></DecisionShape>} name="Decision (diamond)" />
          <LegendRow shape={<ProcessShape state="done"><span className="mini">PROCESS</span></ProcessShape>} name="Process (rounded rectangle)" />
          <LegendRow shape={<DelayShape state="done"><span className="mini">DELAY</span></DelayShape>} name="Delay (semicircle)" />
          <LegendRow shape={<ConnectorShape state="done">A</ConnectorShape>} name="Off-page connector (pentagon)" />
          <LegendRow shape={<DisplayShape state="done"><span className="mini">DISPLAY</span></DisplayShape>} name="Display (curved sides)" />
          <LegendRow shape={<CalloutNote className="mini-note">NOTE</CalloutNote>} name="Comment / callout" />
        </div>
      </section>
    </div>
  );
}
