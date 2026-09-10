import { useCart } from '../context/CartContext.jsx';
import { THRESHOLD, formatPHP } from '../utils/checkout.js';

/** UNDER THE HOOD — the simplified program logic with live values substituted. */
export default function UnderTheHood() {
  const { result } = useCart();
  const { cartTotal, qualifies, discount, finalTotal, shippingFee, grandTotal } = result;

  return (
    <section className="card hood" aria-label="Under the hood: program logic">
      <h2 className="section-title">🔧 UNDER THE HOOD</h2>
      <p className="section-sub">
        The exact code the checkout runs — one central function, no duplicated logic. Live values
        shown as comments.
      </p>
      <pre className="code-block" tabIndex={0}>
        <code>
          <span className="c-kw">IF</span> cart_total <span className="c-op">&gt;=</span>{' '}
          <span className="c-num">₱1,500</span> <span className="c-com">// {formatPHP(cartTotal)} → {qualifies ? 'TRUE ✓' : 'FALSE ✕'}</span>{'\n'}
          {'    '}discount     = cart_total × <span className="c-num">0.10</span> <span className="c-com">// {formatPHP(discount)}</span>{'\n'}
          {'    '}final_total  = cart_total × <span className="c-num">0.90</span> <span className="c-com">// {formatPHP(finalTotal)}</span>{'\n'}
          {'    '}shipping_fee = <span className="c-num">0</span> <span className="c-com">// FREE shipping</span>{'\n'}
          <span className="c-kw">ELSE</span>{'\n'}
          {'    '}discount     = <span className="c-num">0</span>{'\n'}
          {'    '}final_total  = cart_total <span className="c-com">// {formatPHP(finalTotal)}</span>{'\n'}
          {'    '}shipping_fee = <span className="c-num">100</span> <span className="c-com">// {formatPHP(shippingFee)}</span>{'\n'}
          <span className="c-kw">END IF</span>{'\n'}
          {'\n'}
          grand_total = final_total + shipping_fee <span className="c-com">// {formatPHP(grandTotal)}</span>
        </code>
      </pre>
      <p className="hood-note">
        ⚠️ The operator is <code>&gt;=</code>, not <code>&gt;</code> — that is exactly why ₱1,500.00
        itself qualifies for the discount and free shipping.
      </p>
    </section>
  );
}
