import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { getProduct } from '../data/products.js';
import { calculateCheckout } from '../utils/checkout.js';

/**
 * Cart + order state for the whole app.
 * The cart subtotal IS the flowchart's cart_total — the algorithm
 * never receives a separate or fake value.
 */
const CartContext = createContext(null);

export const MAX_QTY = 99;
export const MIN_QTY = 1;

export function CartProvider({ children, initialItems = [] }) {
  const [items, setItems] = useState(initialItems); // [{ id, qty }]
  const [lastOrder, setLastOrder] = useState(null);
  const orderCounter = useRef(0);

  const lines = useMemo(
    () =>
      items
        .map((entry) => {
          const product = getProduct(entry.id);
          if (!product) return null; // invalid product state -> ignored safely
          const qty = Math.min(MAX_QTY, Math.max(MIN_QTY, Math.round(entry.qty) || MIN_QTY));
          return { ...entry, qty, product, subtotal: product.price * qty };
        })
        .filter(Boolean),
    [items],
  );

  // cart_total — the single value the flowchart operates on
  const cartTotal = useMemo(() => lines.reduce((sum, l) => sum + l.subtotal, 0), [lines]);
  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);

  // ONE calculation engine feeds every screen
  const result = useMemo(() => calculateCheckout(cartTotal), [cartTotal]);

  const add = (id, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((e) => e.id === id);
      if (existing) {
        return prev.map((e) =>
          e.id === id ? { ...e, qty: Math.min(MAX_QTY, e.qty + Math.max(1, qty)) } : e,
        );
      }
      return [...prev, { id, qty: Math.max(1, qty) }];
    });
  };

  const setQty = (id, qty) => {
    const clean = Math.round(Number(qty));
    if (!Number.isFinite(clean) || clean < MIN_QTY) return; // ignore invalid quantities
    setItems((prev) =>
      prev.map((e) => (e.id === id ? { ...e, qty: Math.min(MAX_QTY, clean) } : e)),
    );
  };

  const remove = (id) => setItems((prev) => prev.filter((e) => e.id !== id));

  const clear = () => setItems([]);

  /** Demo presets: replace the cart with a real combination of products. */
  const applyPreset = (presetItems) => {
    setItems(
      presetItems
        .filter((e) => getProduct(e.id))
        .map((e) => ({ id: e.id, qty: Math.min(MAX_QTY, Math.max(1, e.qty)) })),
    );
  };

  /** Simulated order — nothing is sent anywhere. */
  const placeOrder = (customer) => {
    if (lines.length === 0) return null; // checkout with no items is blocked
    orderCounter.current += 1;
    const order = {
      number: `DEMO-${String(orderCounter.current).padStart(3, '0')}`,
      customer,
      lines,
      result,
      placedAt: new Date(),
    };
    setLastOrder(order);
    setItems([]);
    return order;
  };

  const value = {
    items,
    lines,
    itemCount,
    cartTotal,
    result,
    lastOrder,
    add,
    setQty,
    remove,
    clear,
    applyPreset,
    placeOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
