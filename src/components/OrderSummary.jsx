import { THRESHOLD, formatPHP } from '../utils/checkout.js';

/**
 * Order summary fed ONLY by the central calculation engine.
 * The grand total is the most visually prominent value.
 */
export default function OrderSummary({ result, cartTotal }) {
  const { qualifies, discount, shippingFee, grandTotal } = result;

  return (
    <aside className="card order-summary" aria-label="Order summary">
      <h2 className="summary-title">Order Summary</h2>

      <div className={`decision-chip ${qualifies ? 'is-true' : 'is-false'}`}>
        <span className="decision-chip-cond">
          {formatPHP(cartTotal)} &gt;= {formatPHP(THRESHOLD)}
        </span>
        <span className="decision-chip-res">{qualifies ? 'TRUE ✓' : 'FALSE ✕'}</span>
      </div>

      <dl className="summary-lines">
        <div className="summary-row">
          <dt>Items Subtotal</dt>
          <dd>{formatPHP(cartTotal)}</dd>
        </div>
        <div className="summary-row">
          <dt>Discount {qualifies ? '(10%)' : ''}</dt>
          <dd className={discount > 0 ? 'value-good' : ''}>
            {discount > 0 ? `−${formatPHP(discount)}` : formatPHP(0)}
          </dd>
        </div>
        <div className="summary-row">
          <dt>Shipping</dt>
          <dd className={shippingFee === 0 ? 'value-good' : ''}>
            {shippingFee === 0 ? 'FREE' : formatPHP(shippingFee)}
          </dd>
        </div>
      </dl>

      <div className="summary-divider" aria-hidden="true" />

      <div className="grand-row">
        <span>GRAND TOTAL</span>
        <strong>{formatPHP(grandTotal)}</strong>
      </div>
      <p className="grand-formula">
        grand_total = final_total + shipping_fee = {formatPHP(result.finalTotal)} +{' '}
        {formatPHP(shippingFee)}
      </p>
    </aside>
  );
}
