/**
 * ============================================================
 * CENTRAL CHECKOUT CALCULATION ENGINE  (single source of truth)
 * ============================================================
 * Implements EXACTLY the uploaded flowchart:
 *
 *   INPUT cart_total
 *   STORE cart_total
 *   DECISION: cart_total >= 1500 ?
 *     YES -> final_total = cart_total * 0.90 ; shipping_fee = 0
 *     NO  -> final_total = cart_total        ; shipping_fee = 100
 *   (connector A)
 *   CALCULATE grand_total = final_total + shipping_fee
 *   DELAY (brief)
 *   DISPLAY grand_total
 *
 * Every part of the UI (order summary, algorithm visualizer,
 * explanation panel, demo mode, threshold banner) reads its
 * numbers from calculateCheckout(). Nothing is duplicated.
 */

export const THRESHOLD = 1500; // flowchart decision: cart_total >= 1500
export const DISCOUNT_RATE = 0.1; // 10% discount on the YES branch
export const SHIPPING_FEE = 100; // ₱100 shipping on the NO branch

/** Round to 2 decimal places to avoid floating-point display errors. */
export const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * The ONE function that implements the flowchart.
 * @param {number} cartTotal - the live cart subtotal (₱)
 */
export function calculateCheckout(cartTotal) {
  const safeTotal =
    typeof cartTotal === 'number' && Number.isFinite(cartTotal) && cartTotal > 0
      ? round2(cartTotal)
      : 0;

  // DECISION NODE — note the operator is >= (1500 MUST qualify)
  const qualifies = safeTotal >= THRESHOLD;

  let discount;
  let finalTotal;
  let shippingFee;

  if (qualifies) {
    // YES branch
    discount = round2(safeTotal * DISCOUNT_RATE);
    finalTotal = round2(safeTotal * 0.9);
    shippingFee = 0;
  } else {
    // NO branch
    discount = 0;
    finalTotal = safeTotal;
    shippingFee = SHIPPING_FEE;
  }

  // CALCULATE (after connector A)
  const grandTotal = round2(finalTotal + shippingFee);

  return {
    cartTotal: safeTotal,
    qualifies,
    conditionResult: qualifies, // TRUE / FALSE of "cart_total >= 1500"
    discount,
    finalTotal,
    shippingFee,
    grandTotal,
  };
}

/** How much more the customer must add to reach the ₱1,500 threshold. */
export function remainingToThreshold(cartTotal) {
  return round2(Math.max(0, THRESHOLD - cartTotal));
}

/** Consistent Philippine-peso formatting: ₱1,620.00 */
const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPHP(amount) {
  const value = typeof amount === 'number' && Number.isFinite(amount) ? amount : 0;
  return pesoFormatter.format(round2(value));
}

/**
 * Beginner-friendly numbered explanation of the calculation,
 * built dynamically from the live result (used by EXPLAIN THIS CALCULATION).
 */
export function buildExplanation(result) {
  const { cartTotal, qualifies, discount, finalTotal, shippingFee, grandTotal } = result;
  const lines = [
    `Your cart total is ${formatPHP(cartTotal)}.`,
    `The system checks the flowchart condition: ${formatPHP(cartTotal)} >= ${formatPHP(THRESHOLD)}?`,
    `The answer is ${qualifies ? 'TRUE ✓' : 'FALSE ✕'}.`,
  ];
  if (qualifies) {
    lines.push(
      `Because the condition is TRUE, a 10% discount is applied: ${formatPHP(cartTotal)} × 0.10 = ${formatPHP(discount)}.`,
      `final_total = ${formatPHP(cartTotal)} × 0.90 = ${formatPHP(finalTotal)}.`,
      'Shipping is FREE, so shipping_fee = ₱0.00.',
    );
  } else {
    lines.push(
      'Because the condition is FALSE, no discount is applied: discount = ₱0.00.',
      `final_total stays the same as the cart total: ${formatPHP(finalTotal)}.`,
      `Shipping costs ₱100, so shipping_fee = ${formatPHP(shippingFee)}.`,
    );
  }
  lines.push(
    `Both branches meet at connector A, then: grand_total = final_total + shipping_fee = ${formatPHP(finalTotal)} + ${formatPHP(shippingFee)}.`,
    `Final grand total = ${formatPHP(grandTotal)}. ✓ Process complete (END).`,
  );
  return lines;
}
