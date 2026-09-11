import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { PRODUCTS } from '../data/products.js';
import { THRESHOLD, formatPHP, remainingToThreshold } from '../utils/checkout.js';

const LINKS = [
  { route: 'home', label: 'Shop' },
  { route: 'cart', label: 'Cart' },
  { route: 'checkout', label: 'Checkout' },
  { route: 'algorithm', label: 'Algorithm Lab' },
];

/**
 * Professional store header with live search suggestions:
 * typing shows matching items; clicking one jumps straight to that product.
 * Also carries the live "smart threshold" strip (cart_total >= ₱1,500).
 */
export default function Navbar({ route, go, query, setQuery, onSelectProduct }) {
  const { cartTotal, itemCount, result } = useCart();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const q = query.trim().toLowerCase();
  const matches =
    q === ''
      ? []
      : PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.blurb.toLowerCase().includes(q),
        ).slice(0, 6);

  // close the dropdown when clicking anywhere else
  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const pick = (id) => {
    setOpen(false);
    onSelectProduct(id);
  };

  const remaining = remainingToThreshold(cartTotal);
  const progress = Math.min(100, (cartTotal / THRESHOLD) * 100);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button type="button" className="brand" onClick={() => go('home')} aria-label="SulitCart PH home">
          <svg viewBox="0 0 64 64" className="brand-mark" aria-hidden="true">
            <rect width="64" height="64" rx="14" fill="currentColor" opacity="0.12" />
            <path d="M18 24h28l-4 20H22z" fill="currentColor" />
            <circle cx="26" cy="50" r="4" fill="#f6b21b" />
            <circle cx="40" cy="50" r="4" fill="#f6b21b" />
            <path d="M14 16l4 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="brand-text">
            SulitCart<span className="brand-tld">PH</span>
          </span>
        </button>

        <form
          className="search-wrap"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
            go('home');
          }}
          ref={wrapRef}
        >
          <div className="search">
            <svg viewBox="0 0 24 24" className="search-icon" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
                if (route !== 'home') go('home');
              }}
              onFocus={() => setOpen(true)}
              placeholder="Search keyboards, notebooks, tumblers…"
              aria-label="Search products"
              role="combobox"
              aria-expanded={open && q !== ''}
              aria-autocomplete="list"
            />
          </div>

          {open && q !== '' && (
            <div className="search-suggest" role="listbox" aria-label="Product suggestions">
              {matches.length === 0 ? (
                <div className="suggest-empty">No matches for “{query}” — try another keyword.</div>
              ) : (
                <>
                  {matches.map((p) => (
                    <button type="button" key={p.id} className="suggest-item" onClick={() => pick(p.id)}>
                      <span className="suggest-emoji" aria-hidden="true">
                        {p.emoji}
                      </span>
                      <span className="suggest-text">
                        <strong>{p.name}</strong>
                        <small>{p.category}</small>
                      </span>
                      <span className="suggest-price">{formatPHP(p.price)}</span>
                    </button>
                  ))}
                  <div className="suggest-foot">Tip: press Enter to see all results on the Shop page</div>
                </>
              )}
            </div>
          )}
        </form>

        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <button
              type="button"
              key={l.route}
              className={`nav-link ${route === l.route ? 'is-current' : ''}`}
              onClick={() => go(l.route)}
            >
              {l.label}
              {l.route === 'cart' && itemCount > 0 && (
                <span className="nav-count">{itemCount}</span>
              )}
            </button>
          ))}
        </nav>

        <button type="button" className="cart-button" onClick={() => go('cart')} aria-label={`Open cart, ${itemCount} items`}>
          <svg viewBox="0 0 24 24" className="cart-icon" aria-hidden="true">
            <path
              d="M3 4h2.4l2.2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.55L21.5 8H6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10" cy="20.4" r="1.7" fill="currentColor" />
            <circle cx="17.5" cy="20.4" r="1.7" fill="currentColor" />
          </svg>
          <span className="cart-button-text">{formatPHP(cartTotal)}</span>
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </button>
      </div>

      <div className={`threshold-strip ${result.qualifies ? 'is-unlocked' : ''}`} role="status">
        <div className="threshold-inner">
          {itemCount === 0 ? (
            <span className="threshold-msg">
              🎯 Spend {formatPHP(THRESHOLD)} or more to unlock <strong>10% OFF + FREE SHIPPING</strong>
            </span>
          ) : result.qualifies ? (
            <span className="threshold-msg pop" key="unlocked">
              ✓ <strong>10% OFF + FREE SHIPPING UNLOCKED</strong> — your cart passed the{' '}
              {formatPHP(THRESHOLD)} check
            </span>
          ) : (
            <span className="threshold-msg" key="progress">
              Add <strong>{formatPHP(remaining)}</strong> more to unlock 10% OFF + FREE SHIPPING
            </span>
          )}
          <div
            className="threshold-bar"
            aria-hidden="true"
            title={`${formatPHP(cartTotal)} of ${formatPHP(THRESHOLD)}`}
          >
            <span className="threshold-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="threshold-nums">
            {formatPHP(cartTotal)} / {formatPHP(THRESHOLD)}
          </span>
        </div>
      </div>
    </header>
  );
}
