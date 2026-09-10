import { useEffect, useMemo, useRef, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import {
  THRESHOLD,
  SHIPPING_FEE,
  formatPHP,
} from '../utils/checkout.js';
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
  FlowArrow,
} from './FlowShapes.jsx';

/**
 * Interactive recreation of the uploaded flowchart.
 * Executes stage-by-stage on the LIVE cart total (never hard-coded):
 * START → INPUT → STORE → DECISION → YES/NO → A → CALCULATE → DELAY → DISPLAY → END
 */

const STEP_META = [
  { key: 'start', title: 'START' },
  { key: 'input', title: 'INPUT cart_total' },
  { key: 'store', title: 'STORE cart_total' },
  { key: 'decision', title: 'DECISION' },
  { key: 'branch', title: 'YES / NO BRANCH' },
  { key: 'connector', title: 'CONNECTOR A' },
  { key: 'calculate', title: 'CALCULATE grand_total' },
  { key: 'delay', title: 'DELAY (brief)' },
  { key: 'display', title: 'DISPLAY grand_total' },
  { key: 'end', title: 'END' },
];

// Per-step durations (ms) — paced for a classroom video, ~10s total.
const STEP_DURATIONS = [700, 950, 950, 1350, 1450, 750, 1150, 950, 1250, 1000];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AlgorithmVisualizer({ runSignal, resetSignal }) {
  const { cartTotal, result } = useCart();
  const [status, setStatus] = useState('idle'); // idle | running | done | blocked
  const [step, setStep] = useState(-1);
  const runIdRef = useRef(0);
  const flowRef = useRef(null);
  const lastRunSignalRef = useRef(0);
  const lastResetSignalRef = useRef(0);

  const { qualifies, discount, finalTotal, shippingFee, grandTotal } = result;
  const hasCart = cartTotal > 0;

  const reset = useMemo(
    () => () => {
      runIdRef.current += 1; // cancels any in-flight run
      setStatus('idle');
      setStep(-1);
    },
    [],
  );

  const run = useMemo(
    () => async () => {
      if (cartTotal <= 0) {
        setStatus('blocked');
        return;
      }
      const token = ++runIdRef.current;
      setStatus('running');
      for (let i = 0; i < STEP_META.length; i += 1) {
        if (token !== runIdRef.current) return; // cancelled (Reset / new run)
        setStep(i);
        // eslint-disable-next-line no-await-in-loop
        await sleep(STEP_DURATIONS[i]);
      }
      if (token !== runIdRef.current) return;
      setStatus('done');
    },
    [cartTotal],
  );

  // External "RUN ALGORITHM" requests (demo dock / demo controls).
  // Guarded by a ref so a cart change never re-triggers an old request.
  useEffect(() => {
    if (runSignal > 0 && runSignal !== lastRunSignalRef.current) {
      lastRunSignalRef.current = runSignal;
      run();
    }
  }, [runSignal, run]);

  // External "RESET DEMO" requests — stop the run and clear highlights
  useEffect(() => {
    if (resetSignal > 0 && resetSignal !== lastResetSignalRef.current) {
      lastResetSignalRef.current = resetSignal;
      reset();
    }
  }, [resetSignal, reset]);

  // Keep the active node visible while the algorithm walks the flowchart
  useEffect(() => {
    if (status !== 'running') return;
    const active = flowRef.current?.querySelector('.is-active');
    active?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [step, status]);

  const nodeState = (idx) => {
    if (status === 'idle' || status === 'blocked') return 'idle';
    if (step > idx) return 'done';
    if (step === idx) return 'active';
    return 'idle';
  };
  const arrowState = (idx) => {
    if (status === 'idle' || status === 'blocked') return 'idle';
    if (step > idx) return 'done';
    if (step === idx) return 'active';
    return 'idle';
  };
  const yesState = qualifies ? nodeState(4) : step >= 4 ? 'skipped' : 'idle';
  const noState = !qualifies ? nodeState(4) : step >= 4 ? 'skipped' : 'idle';
  const wireState = (taken) => {
    if (status === 'idle' || status === 'blocked' || step < 4) return 'idle';
    return taken ? 'done' : 'skipped';
  };

  const captions = [
    'START — the checkout program begins.',
    `INPUT — read cart_total from the customer's cart: ${formatPHP(cartTotal)}.`,
    `STORE — cart_total is held in cart state: ${formatPHP(cartTotal)}.`,
    `DECISION — is ${formatPHP(cartTotal)} >= ${formatPHP(THRESHOLD)}?  →  ${qualifies ? 'TRUE ✓' : 'FALSE ✕'}`,
    qualifies
      ? `YES ✓ — final_total = ${formatPHP(cartTotal)} × 0.90 = ${formatPHP(finalTotal)}; shipping_fee = ₱0.00.`
      : `NO ✕ — final_total = ${formatPHP(cartTotal)}; shipping_fee = ${formatPHP(SHIPPING_FEE)}.`,
    'CONNECTOR A — the YES and NO branches converge here.',
    `CALCULATE — grand_total = ${formatPHP(finalTotal)} + ${formatPHP(shippingFee)} = ${formatPHP(grandTotal)}.`,
    'DELAY — a brief pause while the final total is processed…',
    `DISPLAY — grand_total = ${formatPHP(grandTotal)}.`,
    'END — algorithm complete ✓',
  ];

  const statusChip =
    status === 'running'
      ? { cls: 'chip-run', text: '● RUNNING' }
      : status === 'done'
        ? { cls: 'chip-done', text: '✓ COMPLETE' }
        : status === 'blocked'
          ? { cls: 'chip-warn', text: 'CART EMPTY' }
          : { cls: 'chip-idle', text: 'IDLE' };

  return (
    <section className="visualizer card" aria-label="Checkout algorithm visualizer">
      <header className="viz-header">
        <div>
          <h2 className="section-title">HOW THE CHECKOUT ALGORITHM WORKS</h2>
          <p className="section-sub">
            The uploaded flowchart, running live on your actual cart total.
          </p>
        </div>
        <span className={`status-chip ${statusChip.cls}`}>{statusChip.text}</span>
      </header>

      {status === 'blocked' && (
        <div className="notice notice-warn" role="alert">
          Your cart is empty, so there is no cart_total to process yet. Add items or press a
          classroom-demo preset (₱1,200 / ₱1,500 / ₱1,800), then run the algorithm again.
        </div>
      )}

      <div className="viz-caption" role="status" aria-live="polite">
        <span className="viz-caption-step">
          STEP {Math.min(Math.max(step + 1, 0), STEP_META.length)} / {STEP_META.length}
        </span>
        <span className="viz-caption-text">
          {status === 'running' || status === 'done'
            ? captions[Math.max(step, 0)]
            : 'Press RUN ALGORITHM to execute the flowchart from START to END.'}
        </span>
      </div>

      <div className="viz-layout">
        <div className="viz-flow" ref={flowRef}>
          <Terminal state={nodeState(0)}>START</Terminal>
          <FlowArrow state={arrowState(0)} />

          <IoShape state={nodeState(1)}>
            <span className="shape-label">INPUT</span>
            <span className="shape-var">cart_total</span>
            {step >= 1 && <span className="shape-value">{formatPHP(cartTotal)}</span>}
          </IoShape>
          <FlowArrow state={arrowState(1)} />

          <StoreShape state={nodeState(2)}>
            <span className="shape-label">STORE</span>
            <span className="shape-var">cart_total</span>
            {step >= 2 && <span className="shape-value">{formatPHP(cartTotal)}</span>}
          </StoreShape>
          <FlowArrow state={arrowState(2)} />

          <DecisionShape state={nodeState(3)}>
            <span className="shape-var strong">cart_total &gt;= {formatPHP(THRESHOLD)}?</span>
            {step >= 3 && (
              <>
                <span className="shape-value">
                  {formatPHP(cartTotal)} &gt;= {formatPHP(THRESHOLD)}
                </span>
                <span className={`decision-badge ${qualifies ? 'is-true' : 'is-false'}`}>
                  {qualifies ? 'TRUE ✓' : 'FALSE ✕'}
                </span>
              </>
            )}
          </DecisionShape>

          <div className="branch-wires top" aria-hidden="true">
            <span className={`wire drop-left ${wireState(qualifies)}`} />
            <span className={`wire drop-right ${wireState(!qualifies)}`} />
            <span className="wire-bar" />
            <span className="wire-stem" />
            <span className={`branch-tag tag-yes ${wireState(qualifies)}`}>YES ✓</span>
            <span className={`branch-tag tag-no ${wireState(!qualifies)}`}>NO ✕</span>
          </div>

          <div className="branch-grid">
            <ProcessShape state={yesState} tone="green">
              <span className="shape-label ok">YES ✓</span>
              <span className="shape-var">final_total = cart_total × 0.90</span>
              {step >= 4 && qualifies && (
                <span className="shape-value">= {formatPHP(finalTotal)}</span>
              )}
              <span className="shape-var">shipping_fee = 0</span>
              {yesState === 'skipped' && <span className="skip-tag">not taken</span>}
            </ProcessShape>

            <ProcessShape state={noState} tone="green">
              <span className="shape-label no">NO ✕</span>
              <span className="shape-var">final_total = cart_total</span>
              {step >= 4 && !qualifies && (
                <span className="shape-value">= {formatPHP(finalTotal)}</span>
              )}
              <span className="shape-var">shipping_fee = {SHIPPING_FEE}</span>
              {noState === 'skipped' && <span className="skip-tag">not taken</span>}
            </ProcessShape>
          </div>

          <div className="branch-wires bottom" aria-hidden="true">
            <span className={`wire rise-left ${step >= 5 ? 'done' : 'idle'}`} />
            <span className={`wire rise-right ${step >= 5 ? 'done' : 'idle'}`} />
            <span className={`wire-bar ${step >= 5 ? 'done' : 'idle'}`} />
            <span className={`wire-stem ${step >= 5 ? 'done' : 'idle'}`} />
          </div>

          <ConnectorShape state={nodeState(5)}>A</ConnectorShape>
          <FlowArrow state={arrowState(5)} />

          <ProcessShape state={nodeState(6)} tone="blue">
            <span className="shape-label">CALCULATE</span>
            <span className="shape-var">grand_total = final_total + shipping_fee</span>
            {step >= 6 && (
              <span className="shape-value">
                {formatPHP(finalTotal)} + {formatPHP(shippingFee)} = {formatPHP(grandTotal)}
              </span>
            )}
          </ProcessShape>
          <FlowArrow state={arrowState(6)} />

          <DelayShape state={nodeState(7)}>
            {step === 7 && status === 'running' ? (
              <span className="delay-running">
                Calculating<span className="dots" aria-hidden="true" />
              </span>
            ) : (
              <>
                <span className="shape-label">DELAY</span>
                <span className="shape-var">(brief)</span>
              </>
            )}
          </DelayShape>
          <FlowArrow state={arrowState(7)} />

          <DisplayShape state={nodeState(8)}>
            <span className="shape-label">DISPLAY</span>
            <span className="shape-var">grand_total</span>
            {step >= 8 && <span className="display-value pop">{formatPHP(grandTotal)}</span>}
          </DisplayShape>
          <FlowArrow state={arrowState(8)} />

          <Terminal state={nodeState(9)}>END</Terminal>
        </div>

        <aside className="viz-side">
          <CalloutNote>
            <span className="callout-title">NOTE</span>
            <p>
              If <em>cart_total</em> ≥ {formatPHP(THRESHOLD)}:
              <br />
              10% discount + free shipping.
            </p>
            <p>
              Otherwise:
              <br />
              no discount + ₱{SHIPPING_FEE} shipping.
            </p>
          </CalloutNote>

          <div className="var-panel card-inner" aria-label="Live variable values">
            <h4>LIVE VARIABLES</h4>
            <dl>
              <div className={step >= 1 ? 'set' : ''}>
                <dt>cart_total</dt>
                <dd>{step >= 1 ? formatPHP(cartTotal) : '—'}</dd>
              </div>
              <div className={step >= 3 ? 'set' : ''}>
                <dt>condition</dt>
                <dd>{step >= 3 ? (qualifies ? 'TRUE ✓' : 'FALSE ✕') : '—'}</dd>
              </div>
              <div className={step >= 4 ? 'set' : ''}>
                <dt>discount</dt>
                <dd>{step >= 4 ? formatPHP(discount) : '—'}</dd>
              </div>
              <div className={step >= 4 ? 'set' : ''}>
                <dt>final_total</dt>
                <dd>{step >= 4 ? formatPHP(finalTotal) : '—'}</dd>
              </div>
              <div className={step >= 4 ? 'set' : ''}>
                <dt>shipping_fee</dt>
                <dd>{step >= 4 ? formatPHP(shippingFee) : '—'}</dd>
              </div>
              <div className={step >= 6 ? 'set grand' : ''}>
                <dt>grand_total</dt>
                <dd>{step >= 6 ? formatPHP(grandTotal) : '—'}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      {status === 'done' && (
        <div className="viz-complete pop" role="status">
          ✓ Process Complete — flowchart reached END. grand_total = {formatPHP(grandTotal)}
        </div>
      )}

    </section>
  );
}

export { STEP_META };
