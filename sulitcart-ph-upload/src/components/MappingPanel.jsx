import { useCart } from '../context/CartContext.jsx';
import { THRESHOLD, formatPHP } from '../utils/checkout.js';

/**
 * FLOWCHART → WEBSITE: makes the conceptual mapping explicit,
 * with the LIVE value of each stage beside it.
 */
export default function MappingPanel() {
  const { cartTotal, result } = useCart();

  const rows = [
    {
      shape: 'INPUT',
      concept: "Customer's cart subtotal",
      live: formatPHP(cartTotal),
    },
    {
      shape: 'STORE',
      concept: 'Cart state (stored value)',
      live: formatPHP(cartTotal),
    },
    {
      shape: 'DECISION',
      concept: 'Checkout eligibility rule',
      live: `${formatPHP(cartTotal)} >= ${formatPHP(THRESHOLD)} → ${result.qualifies ? 'TRUE ✓' : 'FALSE ✕'}`,
    },
    {
      shape: 'YES',
      concept: '10% OFF + FREE SHIPPING',
      live: result.qualifies
        ? `−${formatPHP(result.discount)} & free shipping`
        : 'not taken',
    },
    {
      shape: 'NO',
      concept: 'NO DISCOUNT + ₱100 SHIPPING',
      live: result.qualifies ? 'not taken' : `+${formatPHP(result.shippingFee)} shipping`,
    },
    {
      shape: 'CALCULATE',
      concept: 'Order total calculation',
      live: `${formatPHP(result.finalTotal)} + ${formatPHP(result.shippingFee)}`,
    },
    {
      shape: 'DISPLAY',
      concept: 'Checkout result (grand total)',
      live: formatPHP(result.grandTotal),
    },
  ];

  return (
    <section className="card mapping" aria-label="Flowchart to website mapping">
      <h2 className="section-title">FLOWCHART → WEBSITE</h2>
      <p className="section-sub">
        Every flowchart symbol has a real counterpart in this store — here with today's live
        values.
      </p>
      <ul className="mapping-list">
        {rows.map((row) => (
          <li className="mapping-row" key={row.shape}>
            <span className={`mapping-shape ms-${row.shape.toLowerCase()}`}>{row.shape}</span>
            <span className="mapping-arrow" aria-hidden="true">
              →
            </span>
            <span className="mapping-concept">{row.concept}</span>
            <span className="mapping-live">{row.live}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
