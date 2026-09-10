import { useCart, MIN_QTY, MAX_QTY } from '../context/CartContext.jsx';
import { formatPHP } from '../utils/checkout.js';

function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="stars" aria-label={`Rated ${rating} out of 5`}>
      {'★'.repeat(full)}
      <span className="stars-dim">{'★'.repeat(5 - full)}</span>
    </span>
  );
}

export default function ProductCard({ product }) {
  const { lines, add, setQty, remove } = useCart();
  const inCart = lines.find((l) => l.product.id === product.id);
  const qty = inCart ? inCart.qty : 0;

  return (
    <article className="product-card card">
      <div
        className="product-tile"
        style={{
          background: `linear-gradient(140deg, hsl(${product.hue} 70% 92%), hsl(${product.hue + 28} 65% 80%))`,
        }}
      >
        <span className="product-emoji" role="img" aria-label={product.name}>
          {product.emoji}
        </span>
        {product.badge && <span className="product-badge">{product.badge}</span>}
      </div>

      <div className="product-body">
        <span className="product-cat">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-blurb">{product.blurb}</p>
        <div className="product-rating">
          <Stars rating={product.rating} />
          <span className="rating-num">
            {product.rating.toFixed(1)} ({product.reviews})
          </span>
        </div>
        <div className="product-foot">
          <span className="product-price">{formatPHP(product.price)}</span>
          {qty === 0 ? (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => add(product.id)}>
              + Add to Cart
            </button>
          ) : (
            <div className="qty-stepper" aria-label={`Quantity of ${product.name} in cart`}>
              <button
                type="button"
                className="qty-btn"
                onClick={() => (qty <= MIN_QTY ? remove(product.id) : setQty(product.id, qty - 1))}
                aria-label={qty <= MIN_QTY ? `Remove ${product.name}` : 'Decrease quantity'}
              >
                −
              </button>
              <span className="qty-num">{qty}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQty(product.id, Math.min(MAX_QTY, qty + 1))}
                disabled={qty >= MAX_QTY}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
