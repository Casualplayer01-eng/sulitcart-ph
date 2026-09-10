/**
 * The uploaded flowchart's visual language, recreated as interactive
 * CSS/HTML components so the currently executing stage can be highlighted.
 *
 *   Terminal      -> START / END            (rounded capsule)
 *   IoShape       -> INPUT / OUTPUT         (parallelogram)
 *   StoreShape    -> STORE                  (cylinder / data store)
 *   DecisionShape -> DECISION               (diamond)
 *   ProcessShape  -> PROCESS / CALCULATE    (rounded rectangle)
 *   DelayShape    -> DELAY                  (semicircle)
 *   ConnectorShape-> off-page connector "A" (pentagon)
 *   DisplayShape  -> DISPLAY                (curved-side display symbol)
 *   CalloutNote   -> COMMENT / NOTE         (callout box)
 *
 * Every shape accepts `state`: 'idle' | 'active' | 'done' | 'skipped'.
 */

const cx = (...parts) => parts.filter(Boolean).join(' ');

function stateClass(state) {
  if (state === 'active') return 'is-active';
  if (state === 'done') return 'is-done';
  if (state === 'skipped') return 'is-skipped';
  return 'is-idle';
}

export function Terminal({ state = 'idle', children, tone = 'dark' }) {
  return (
    <div className={cx('flow-node shape-terminal', tone === 'light' && 'tone-light', stateClass(state))}>
      {children}
    </div>
  );
}

export function IoShape({ state = 'idle', children }) {
  return (
    <div className={cx('flow-node shape-io', stateClass(state))}>
      <div className="shape-io-inner">{children}</div>
    </div>
  );
}

export function StoreShape({ state = 'idle', children }) {
  return (
    <div className={cx('flow-node shape-store', stateClass(state))}>
      <div className="shape-store-text">{children}</div>
    </div>
  );
}

export function DecisionShape({ state = 'idle', children }) {
  return (
    <div className={cx('flow-node shape-decision', stateClass(state))}>
      <div className="shape-decision-border" aria-hidden="true" />
      <div className="shape-decision-fill" aria-hidden="true" />
      <div className="shape-decision-text">{children}</div>
    </div>
  );
}

export function ProcessShape({ state = 'idle', tone = 'green', children }) {
  return (
    <div className={cx('flow-node shape-process', `tone-${tone}`, stateClass(state))}>
      {children}
    </div>
  );
}

export function DelayShape({ state = 'idle', children }) {
  return (
    <div className={cx('flow-node shape-delay', stateClass(state))}>
      <div className="shape-delay-text">{children}</div>
    </div>
  );
}

export function ConnectorShape({ state = 'idle', children }) {
  return (
    <div className={cx('flow-node shape-connector', stateClass(state))}>
      <div className="shape-connector-border" aria-hidden="true" />
      <div className="shape-connector-fill" aria-hidden="true" />
      <div className="shape-connector-text">{children}</div>
    </div>
  );
}

export function DisplayShape({ state = 'idle', children }) {
  return (
    <div className={cx('flow-node shape-display', stateClass(state))}>
      <svg className="shape-display-svg" viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden="true">
        <path d="M20 5 H280 Q297 55 280 105 H20 Q37 55 20 5 Z" />
      </svg>
      <div className="shape-display-text">{children}</div>
    </div>
  );
}

export function CalloutNote({ children, className = '' }) {
  return <aside className={cx('callout-note', className)}>{children}</aside>;
}

/** Vertical arrow connector between two flow nodes. */
export function FlowArrow({ state = 'idle', label = '' }) {
  return (
    <div className={cx('flow-arrow', stateClass(state))} aria-hidden="true">
      <span className="flow-arrow-line" />
      <span className="flow-arrow-head" />
      {label ? <span className="flow-arrow-label">{label}</span> : null}
    </div>
  );
}

/** Small legend chip used by the shape legend panel. */
export function LegendRow({ shape, name }) {
  return (
    <div className="legend-row">
      <div className="legend-shape">{shape}</div>
      <span className="legend-name">{name}</span>
    </div>
  );
}
