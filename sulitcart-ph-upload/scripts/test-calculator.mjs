/**
 * Unit tests for the central checkout calculation engine.
 * Run with: npm test
 */
import { calculateCheckout, formatPHP, THRESHOLD } from '../src/utils/checkout.js';

const CASES = [
  // cartTotal, qualifies, discount, finalTotal, shippingFee, grandTotal
  [0, false, 0, 0, 100, 100],
  [100, false, 0, 100, 100, 200],
  [500, false, 0, 500, 100, 600],
  [1199, false, 0, 1199, 100, 1299],
  [1499, false, 0, 1499, 100, 1599],
  [1500, true, 150, 1350, 0, 1350], // ← critical boundary: >= means 1500 QUALIFIES
  [1501, true, 150.1, 1350.9, 0, 1350.9],
  [1200, false, 0, 1200, 100, 1300], // demo FALSE case
  [1800, true, 180, 1620, 0, 1620], // demo TRUE case
  [2000, true, 200, 1800, 0, 1800],
  [5000, true, 500, 4500, 0, 4500],
];

let failures = 0;

const rows = [];
for (const [total, qualifies, discount, finalTotal, shippingFee, grandTotal] of CASES) {
  const r = calculateCheckout(total);
  const checks = [
    ['qualifies', r.qualifies, qualifies],
    ['discount', r.discount, discount],
    ['final_total', r.finalTotal, finalTotal],
    ['shipping_fee', r.shippingFee, shippingFee],
    ['grand_total', r.grandTotal, grandTotal],
  ];
  const bad = checks.filter(([, actual, expected]) => actual !== expected);
  if (bad.length > 0) {
    failures += 1;
    console.error(`✗ cart_total=${total}:`, bad.map(([k, a, e]) => `${k} got ${a} want ${e}`).join(', '));
  }
  rows.push(
    [
      formatPHP(total),
      r.qualifies ? 'TRUE ✓' : 'FALSE ✕',
      formatPHP(r.discount),
      formatPHP(r.finalTotal),
      formatPHP(r.shippingFee),
      formatPHP(r.grandTotal),
      bad.length === 0 ? 'PASS' : 'FAIL',
    ].join(' | '),
  );
}

console.log('cart_total | condition | discount | final_total | shipping_fee | grand_total | result');
console.log('-'.repeat(96));
rows.forEach((r) => console.log(r));

// formatting sanity checks
const fmtOk =
  formatPHP(1620) === '₱1,620.00' && formatPHP(1500) === '₱1,500.00' && formatPHP(100) === '₱100.00';
if (!fmtOk) {
  failures += 1;
  console.error('✗ currency formatting unexpected:', formatPHP(1620), formatPHP(1500), formatPHP(100));
}

// threshold constant sanity
if (THRESHOLD !== 1500) {
  failures += 1;
  console.error('✗ THRESHOLD must be 1500');
}

if (failures > 0) {
  console.error(`\n${failures} test group(s) FAILED`);
  process.exit(1);
}
console.log(`\n✓ All ${CASES.length} calculation test groups passed (boundary ₱1,500 → TRUE verified).`);
