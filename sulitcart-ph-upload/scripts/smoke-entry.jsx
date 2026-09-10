/**
 * SSR render smoke test entry: renders every page/branch to a string so
 * runtime render crashes are caught without a browser.
 */
import { renderToString } from 'react-dom/server';
import App from '../src/App.jsx';
import { CartProvider } from '../src/context/CartContext.jsx';
import Home from '../src/pages/Home.jsx';
import CartPage from '../src/pages/CartPage.jsx';
import CheckoutPage from '../src/pages/CheckoutPage.jsx';
import ConfirmationPage from '../src/pages/ConfirmationPage.jsx';
import AlgorithmLab from '../src/pages/AlgorithmLab.jsx';

const noop = () => {};

const TRUE_CART = [
  { id: 'nc-headphones', qty: 1 },
  { id: 'bt-speaker', qty: 1 },
]; // ₱1,800
const FALSE_CART = [{ id: 'nc-headphones', qty: 1 }]; // ₱1,200
const BOUNDARY_CART = [
  { id: 'mechanical-keyboard', qty: 1 },
  { id: 'wireless-mouse', qty: 1 },
  { id: 'academic-notebook', qty: 1 },
]; // ₱1,500

const scenes = {
  'App shell (home, empty cart)': <App />,
  'Home with query': (
    <CartProvider>
      <Home go={noop} query="key" setQuery={noop} category="All" setCategory={noop} />
    </CartProvider>
  ),
  'Home category filter': (
    <CartProvider>
      <Home go={noop} query="" setQuery={noop} category="Home" setCategory={noop} />
    </CartProvider>
  ),
  'Cart empty': (
    <CartProvider>
      <CartPage go={noop} />
    </CartProvider>
  ),
  'Cart with items (TRUE cart)': (
    <CartProvider initialItems={TRUE_CART}>
      <CartPage go={noop} />
    </CartProvider>
  ),
  'Checkout empty': (
    <CartProvider>
      <CheckoutPage go={noop} />
    </CartProvider>
  ),
  'Checkout TRUE cart (₱1,800)': (
    <CartProvider initialItems={TRUE_CART}>
      <CheckoutPage go={noop} />
    </CartProvider>
  ),
  'Checkout FALSE cart (₱1,200)': (
    <CartProvider initialItems={FALSE_CART}>
      <CheckoutPage go={noop} />
    </CartProvider>
  ),
  'Checkout boundary cart (₱1,500)': (
    <CartProvider initialItems={BOUNDARY_CART}>
      <CheckoutPage go={noop} />
    </CartProvider>
  ),
  'Confirmation (no order yet)': (
    <CartProvider>
      <ConfirmationPage go={noop} />
    </CartProvider>
  ),
  'Algorithm Lab empty': (
    <CartProvider>
      <AlgorithmLab
        go={noop}
        runSignal={0}
        resetSignal={0}
        explainSignal={0}
        requestRun={noop}
        requestReset={noop}
      />
    </CartProvider>
  ),
  'Algorithm Lab TRUE cart': (
    <CartProvider initialItems={TRUE_CART}>
      <AlgorithmLab
        go={noop}
        runSignal={0}
        resetSignal={0}
        explainSignal={0}
        requestRun={noop}
        requestReset={noop}
      />
    </CartProvider>
  ),
  'Algorithm Lab FALSE cart': (
    <CartProvider initialItems={FALSE_CART}>
      <AlgorithmLab
        go={noop}
        runSignal={0}
        resetSignal={0}
        explainSignal={0}
        requestRun={noop}
        requestReset={noop}
      />
    </CartProvider>
  ),
};

let failed = 0;
for (const [name, element] of Object.entries(scenes)) {
  try {
    const html = renderToString(element);
    if (!html || html.length < 50) throw new Error('suspiciously empty render');
    console.log(`✓ renders: ${name} (${html.length} chars)`);
  } catch (err) {
    failed += 1;
    console.error(`✗ render crash: ${name}\n  ${err.message}`);
  }
}

// Content assertions on a TRUE and FALSE checkout render
const trueHtml = renderToString(
  <CartProvider initialItems={TRUE_CART}>
    <CheckoutPage go={noop} />
  </CartProvider>,
);
const falseHtml = renderToString(
  <CartProvider initialItems={FALSE_CART}>
    <CheckoutPage go={noop} />
  </CartProvider>,
);
const boundaryHtml = renderToString(
  <CartProvider initialItems={BOUNDARY_CART}>
    <CheckoutPage go={noop} />
  </CartProvider>,
);

const assert = (cond, msg) => {
  if (!cond) {
    failed += 1;
    console.error(`✗ ${msg}`);
  } else {
    console.log(`✓ ${msg}`);
  }
};

assert(trueHtml.includes('₱1,620.00'), 'TRUE cart shows grand total ₱1,620.00');
assert(trueHtml.includes('TRUE ✓'), 'TRUE cart shows TRUE ✓');
assert(trueHtml.includes('FREE'), 'TRUE cart shows FREE shipping');
assert(falseHtml.includes('₱1,300.00'), 'FALSE cart shows grand total ₱1,300.00');
assert(falseHtml.includes('FALSE ✕'), 'FALSE cart shows FALSE ✕');
assert(falseHtml.includes('₱100.00'), 'FALSE cart shows ₱100.00 shipping');
assert(boundaryHtml.includes('₱1,350.00'), 'boundary cart (₱1,500) shows grand total ₱1,350.00');
assert(boundaryHtml.includes('TRUE ✓'), 'boundary cart (₱1,500) takes the TRUE branch (>= operator)');

if (failed > 0) {
  console.error(`\n${failed} smoke check(s) FAILED`);
  process.exit(1);
}
console.log('\n✓ Render smoke test passed.');
