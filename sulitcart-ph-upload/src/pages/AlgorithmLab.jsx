import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (explainSignal > 0) setExplainOpen(true);
  }, [explainSignal]);

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
        onExplain={() => setExplainOpen((o) => !o)}
      />

      <AlgorithmVisualizer runSignal={runSignal} resetSignal={resetSignal} />

      <ExplanationPanel result={result} open={explainOpen} />

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
