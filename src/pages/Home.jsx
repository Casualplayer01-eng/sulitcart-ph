import { useEffect, useMemo, useState } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products.js';
import { THRESHOLD, formatPHP } from '../utils/checkout.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Home({ go, query, setQuery, category, setCategory, focusProduct }) {
  const [flashId, setFlashId] = useState(null);

  // "Direct me to the item": center the picked product card and flash it
  useEffect(() => {
    if (!focusProduct) return undefined;
    const el = document.getElementById(`product-${focusProduct.id}`);
    if (!el) return undefined;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setFlashId(focusProduct.id);
    const t = setTimeout(() => setFlashId(null), 1500);
    return () => clearTimeout(t);
  }, [focusProduct]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesQuery =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.blurb.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-eyebrow">SulitCart PH · Summer School Sale</span>
          <h1>
            Shop more. Save more.
            <span className="hero-accent">
              Unlock 10% OFF + FREE SHIPPING when your cart reaches {formatPHP(THRESHOLD)}.
            </span>
          </h1>
          <p className="hero-sub">
            A modern demo store with a smart checkout: the moment your subtotal crosses the
            threshold, the discount and free shipping switch on — exactly like our flowchart says.
          </p>
          <div className="hero-cta">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() =>
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              🛍️ Start Shopping
            </button>
            <button type="button" className="btn btn-ghost btn-lg" onClick={() => go('algorithm')}>
              ▶ See the Algorithm
            </button>
          </div>
          <ul className="hero-perks" aria-label="Store perks">
            <li>✓ 10% OFF at ₱1,500+</li>
            <li>✓ FREE shipping at ₱1,500+</li>
            <li>✓ ₱100 flat shipping below</li>
          </ul>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-card hero-card-a">
            <span>cart_total</span>
            <strong>₱1,800.00</strong>
          </div>
          <div className="hero-diamond">₱1,800 &gt;= ₱1,500?<br /><b>TRUE ✓</b></div>
          <div className="hero-card hero-card-b">
            <span>grand_total</span>
            <strong>₱1,620.00</strong>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Product categories">
        <div className="section-head">
          <h2 className="section-title">Browse Categories</h2>
          <p className="section-sub">Everything a student needs for the semester.</p>
        </div>
        <div className="chip-row" role="tablist" aria-label="Categories">
          {['All', ...CATEGORIES].map((c) => (
            <button
              type="button"
              key={c}
              role="tab"
              aria-selected={category === c}
              className={`chip ${category === c ? 'is-on' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="section" id="products" aria-label="Products">
        <div className="section-head">
          <h2 className="section-title">
            {category === 'All' ? 'All Products' : category}
            <span className="count-pill">{filtered.length}</span>
          </h2>
          {query.trim() !== '' && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setQuery('')}>
              Clear search “{query}”
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state card">
            <span className="empty-emoji">🔎</span>
            <h3>No products matched</h3>
            <p>Try a different keyword or category.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setQuery('');
                setCategory('All');
              }}
            >
              Show all products
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} flash={flashId === p.id} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
