import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { THRESHOLD, formatPHP } from '../utils/checkout.js';
import OrderSummary from '../components/OrderSummary.jsx';

const FIELDS = [
  { id: 'fullName', label: 'Full Name', placeholder: 'Juan D. Cruz', span: 2 },
  { id: 'address', label: 'Address', placeholder: '123 Mabini St., Brgy. Poblacion', span: 2 },
  { id: 'city', label: 'City', placeholder: 'Maragondon' },
  { id: 'province', label: 'Province', placeholder: 'Cavite' },
  { id: 'postal', label: 'Postal Code', placeholder: '4112' },
  { id: 'contact', label: 'Contact Number', placeholder: '0917 000 0000' },
];

const EMPTY_FORM = Object.fromEntries(FIELDS.map((f) => [f.id, '']));

/** Checkout is demonstration-only: nothing is transmitted anywhere. */
export default function CheckoutPage({ go }) {
  const { lines, cartTotal, result, placeOrder } = useCart();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    FIELDS.forEach((f) => {
      const value = form[f.id].trim();
      if (!value) next[f.id] = `${f.label} is required.`;
    });
    if (!next.postal && !/^\d{4}$/.test(form.postal.trim())) {
      next.postal = 'Postal code must be 4 digits.';
    }
    if (!next.contact && form.contact.replace(/\D/g, '').length < 7) {
      next.contact = 'Enter a valid contact number.';
    }
    return next;
  };

  const submit = (e) => {
    e.preventDefault();
    if (lines.length === 0) {
      setErrors({ form: 'Your cart is empty — add items before checking out.' });
      return;
    }
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const order = placeOrder({ ...form });
    if (order) go('confirmation');
  };

  if (lines.length === 0) {
    return (
      <div className="page">
        <div className="empty-state card">
          <span className="empty-emoji">🧾</span>
          <h3>NOTHING TO CHECK OUT</h3>
          <p>Your cart is empty, so there is no cart_total for the checkout algorithm yet.</p>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => go('home')}>
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <div className="section-head">
        <h1 className="section-title">Checkout</h1>
        <p className="section-sub">
          Demonstration only — details stay in your browser and are never sent anywhere.
        </p>
      </div>

      <form className="checkout-layout" onSubmit={submit} noValidate>
        <section className="card form-card" aria-label="Shipping information">
          <h2 className="summary-title">Shipping Information</h2>
          <div className="form-grid">
            {FIELDS.map((f) => (
              <div key={f.id} className={`form-field span-${f.span}`}>
                <label htmlFor={f.id}>{f.label}</label>
                <input
                  id={f.id}
                  name={f.id}
                  value={form[f.id]}
                  placeholder={f.placeholder}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.id]: e.target.value }))}
                  aria-invalid={Boolean(errors[f.id])}
                />
                {errors[f.id] && (
                  <span className="field-error" role="alert">
                    {errors[f.id]}
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="form-note">
            🎓 These fields exist to make the demo realistic. No accounts, no payments, no network
            calls.
          </p>
        </section>

        <OrderSummary result={result} cartTotal={cartTotal} />

        <div className="checkout-actions span-2">
          {errors.form && (
            <div className="notice notice-warn" role="alert">
              {errors.form}
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-lg">
            🔒 PLACE SIMULATED ORDER
          </button>
          <button type="button" className="btn btn-ghost btn-lg" onClick={() => go('cart')}>
            ← Back to Cart
          </button>
          <p className="checkout-rule">
            Rule check: {formatPHP(cartTotal)} &gt;= {formatPHP(THRESHOLD)} →{' '}
            <strong>{result.qualifies ? 'TRUE ✓ (10% OFF + FREE shipping)' : 'FALSE ✕ (no discount + ₱100 shipping)'}</strong>
          </p>
        </div>
      </form>
    </div>
  );
}
