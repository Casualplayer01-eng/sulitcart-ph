import { useCart, MIN_QTY, MAX_QTY } from '../context/CartContext.jsx';
import { THRESHOLD, formatPHP, remainingToThreshold } from '../utils/checkout.js';
import CartProgress from '../components/CartProgress.jsx';

export default function CartPage({ go }) {
  const { lines, cartTotal, setQty, remove, clear } = useCart();

  if (lines.length === 0) {
    return (
      <div className="page">
        <div className="empty-state card">
          <span className="empty-emoji">🛒</span>
          <h3>YOUR CART IS EMPTY</h3>
          <p>Start shopping to build your order.</p>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => go('home')}>
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <div className="section-head">
        <h1 className="section-title">Your Cart</h1>
        <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>
          Clear cart
        </button>
      </div>

      <div className="cart-layout">
        <section className="card cart-lines" aria-label="Cart items">
          <div className="cart-lines-head" aria-hidden="true">
            <span>Product</span>
            <span>Quantity</span>
            <span>Unit Price</span>
            <span>Subtotal</span>
            <span />
          </div>
          {lines.map((line) => (
            <div className="cart-line" key={line.id}>
              <div className="cart-line-product">
                <span
                  className="cart-thumb"
                  style={{
                    background: `linear-gradient(140deg, hsl(${line.product.hue} 70% 92%), hsl(${line.product.hue + 28} 65% 80%))`,
                  }}
                  aria-hidden="true"
                >
                  {line.product.emoji}
                </span>
                <div>
                  <strong>{line.product.name}</strong>
                  <span className="cart-line-cat">{line.product.category}</span>
                </div>
              </div>

              <div className="qty-stepper" aria-label={`Quantity of ${line.product.name}`}>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() =>
                    line.qty <= MIN_QTY ? remove(line.id) : setQty(line.id, line.qty - 1)
                  }
                  aria-label={line.qty <= MIN_QTY ? `Remove ${line.product.name}` : 'Decrease quantity'}
                >
                  −
                </button>
                <span className="qty-num">{line.qty}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQty(line.id, Math.min(MAX_QTY, line.qty + 1))}
                  disabled={line.qty >= MAX_QTY}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <span className="cart-cell">{formatPHP(line.product.price)}</span>
              <span className="cart-cell strong">{formatPHP(line.subtotal)}</span>
              <button
                type="button"
                className="icon-btn"
                onClick={() => remove(line.id)}
                aria-label={`Remove ${line.product.name} from cart`}
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </section>

        <aside className="card cart-summary" aria-label="Cart summary">
          <h2 className="summary-title">Order Summary</h2>
          <CartProgress cartTotal={cartTotal} />
          <div className="summary-row total-row">
            <span>Items Subtotal (cart_total)</span>
            <strong>{formatPHP(cartTotal)}</strong>
          </div>
          <p className="summary-hint">
            The subtotal above is the exact <code>cart_total</code> the checkout flowchart reads.
            Discount, shipping and grand total are computed at checkout.
          </p>
          <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => go('checkout')}>
            Proceed to Checkout →
          </button>
          <button type="button" className="btn btn-ghost btn-block" onClick={() => go('home')}>
            Continue Shopping
          </button>
        </aside>
      </div>
    </div>
  );
}
