import { THRESHOLD, formatPHP, remainingToThreshold } from '../utils/checkout.js';

/**
 * Progress toward the ₱1,500 threshold with the smart message:
 *   "Add ₱X more…"  →  "✓ Discount unlocked / ✓ Free shipping unlocked"
 */
export default function CartProgress({ cartTotal }) {
  const qualifies = cartTotal >= THRESHOLD;
  const remaining = remainingToThreshold(cartTotal);
  const progress = Math.min(100, (cartTotal / THRESHOLD) * 100);

  return (
    <div className={`cart-progress ${qualifies ? 'is-unlocked' : ''}`}>
      <div className="cart-progress-nums">
        <span>
          {formatPHP(cartTotal)} / {formatPHP(THRESHOLD)}
        </span>
        <span aria-hidden="true">{qualifies ? '🎉' : '🎯'}</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={THRESHOLD}
        aria-valuenow={Math.min(cartTotal, THRESHOLD)}
        aria-label="Progress toward free shipping threshold"
      >
        <span className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      {qualifies ? (
        <div className="unlock-list pop" key="unlocked">
          <span className="unlock-item">✓ Discount unlocked (10%)</span>
          <span className="unlock-item">✓ Free shipping unlocked</span>
        </div>
      ) : (
        <p className="progress-msg">
          <strong>{formatPHP(remaining)}</strong> more to unlock your benefits
        </p>
      )}
    </div>
  );
}
