import { useCart } from '../context/CartContext.jsx';
import { THRESHOLD, formatPHP } from '../utils/checkout.js';

/** Simulated order confirmation — the flowchart's END, as a receipt. */
export default function ConfirmationPage({ go }) {
  const { lastOrder } = useCart();

  if (!lastOrder) {
    return (
      <div className="page">
        <div className="empty-state card">
          <span className="empty-emoji">📭</span>
          <h3>NO RECENT ORDER</h3>
          <p>Place a simulated order first to see its confirmation.</p>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => go('home')}>
            START SHOPPING
          </button>
        </div>
      </div>
    );
  }

  const { number, result, lines, customer, placedAt } = lastOrder;

  return (
    <div className="page confirmation-page">
      <div className="card confirm-card">
        <div className="confirm-check pop" aria-hidden="true">
          ✓
        </div>
        <h1>ORDER CONFIRMED</h1>
        <p className="confirm-order-num">
          Order <strong>#{number}</strong>
          {customer?.fullName ? ` · ${customer.fullName}` : ''}
        </p>

        <div className="confirm-total">
          <span>Grand Total</span>
          <strong>{formatPHP(result.grandTotal)}</strong>
        </div>

        <dl className="confirm-lines">
          <div>
            <dt>Items Subtotal (cart_total)</dt>
            <dd>{formatPHP(result.cartTotal)}</dd>
          </div>
          <div>
            <dt>Condition: cart_total &gt;= {formatPHP(THRESHOLD)}</dt>
            <dd>{result.qualifies ? 'TRUE ✓' : 'FALSE ✕'}</dd>
          </div>
          <div>
            <dt>Discount (10%)</dt>
            <dd>{result.discount > 0 ? `−${formatPHP(result.discount)}` : formatPHP(0)}</dd>
          </div>
          <div>
            <dt>Shipping</dt>
            <dd>{result.shippingFee === 0 ? 'FREE' : formatPHP(result.shippingFee)}</dd>
          </div>
        </dl>

        <ul className="confirm-items" aria-label="Items ordered">
          {lines.map((l) => (
            <li key={l.id}>
              <span>
                {l.product.emoji} {l.product.name} × {l.qty}
              </span>
              <span>{formatPHP(l.subtotal)}</span>
            </li>
          ))}
        </ul>

        <ul className="confirm-checks" aria-label="Completion status">
          <li>✓ Checkout completed</li>
          <li>✓ Algorithm completed (END reached)</li>
          <li>✓ Simulated at {placedAt.toLocaleTimeString()}</li>
        </ul>

        <div className="confirm-actions">
          <button type="button" className="btn btn-primary btn-lg" onClick={() => go('home')}>
            Back to Home
          </button>
          <button type="button" className="btn btn-ghost btn-lg" onClick={() => go('algorithm')}>
            Replay the Algorithm
          </button>
        </div>
      </div>
    </div>
  );
}
