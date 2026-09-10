/**
 * End-to-end UI test in jsdom: simulates the exact demo-video flow.
 *  home → add products → threshold unlock → cart qty controls → checkout
 *  → validation → simulated order → confirmation → algorithm lab
 *  → TRY presets → RUN ALGORITHM (TRUE + FALSE) → RESET mid-run
 */
import React from 'react';
import App from '../src/App.jsx';

let failures = 0;
const ok = (cond, msg) => {
  if (cond) {
    console.log(`✓ ${msg}`);
  } else {
    failures += 1;
    console.error(`✗ ${msg}`);
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  });

  global.window = dom.window;
  global.document = dom.window.document;
  try {
    global.navigator = dom.window.navigator;
  } catch {
    Object.defineProperty(global, 'navigator', { value: dom.window.navigator });
  }
  global.Event = dom.window.Event;
  global.MouseEvent = dom.window.MouseEvent;
  global.HTMLInputElement = dom.window.HTMLInputElement;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  dom.window.scrollTo = () => {};
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};

  const { createRoot } = require('react-dom/client');
  const { act } = require('react-dom/test-utils');

  const root = createRoot(document.getElementById('root'));
  await act(async () => {
    root.render(React.createElement(App));
  });

  const body = () => document.body.textContent;
  const buttons = () => [...document.querySelectorAll('button')];
  const buttonWith = (text) =>
    buttons().find((b) => b.textContent.replace(/\s+/g, ' ').includes(text));
  const navLink = (label) =>
    [...document.querySelectorAll('.nav-link')].find((b) =>
      b.textContent.trim().startsWith(label),
    );
  const click = async (el) => {
    if (!el) throw new Error('click target not found');
    await act(async () => {
      el.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }));
    });
  };
  const type = async (id, value) => {
    const input = document.getElementById(id);
    const setter = Object.getOwnPropertyDescriptor(
      dom.window.HTMLInputElement.prototype,
      'value',
    ).set;
    await act(async () => {
      setter.call(input, value);
      input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    });
  };
  const cardFor = (name) =>
    [...document.querySelectorAll('.product-card')].find((c) => c.textContent.includes(name));

  // ---------- SCENE 1: homepage ----------
  ok(body().includes('SulitCart'), 'homepage renders with brand name');
  ok(body().includes('Unlock 10% OFF + FREE SHIPPING'), 'hero shows the threshold offer');
  ok(document.querySelectorAll('.product-card').length === 16, '16 products rendered');

  // ---------- SCENE 2: shopping ----------
  await click(cardFor('Wireless Mechanical Keyboard').querySelector('.btn-primary'));
  ok(body().includes('₱601.00 more to unlock'), 'smart message: ₱601.00 more at cart ₱899');
  await click(cardFor('Wireless Mouse').querySelector('.btn-primary'));
  ok(body().includes('₱102.00 more to unlock'), 'smart message: ₱102.00 more at cart ₱1,398');
  await click(cardFor('Academic Notebook 3-pack').querySelector('.btn-primary'));
  ok(body().includes('10% OFF + FREE SHIPPING UNLOCKED'), 'threshold unlock message at ₱1,500');

  // ---------- cart page + quantity controls ----------
  await click(navLink('Cart'));
  ok(body().includes('₱1,500.00 / ₱1,500.00'), 'cart progress shows ₱1,500 / ₱1,500');
  const notebookLine = [...document.querySelectorAll('.cart-line')].find((l) =>
    l.textContent.includes('Academic Notebook'),
  );
  await click([...notebookLine.querySelectorAll('.qty-btn')][1]); // +
  ok(body().includes('₱1,602.00'), 'quantity increase recomputes cart_total (₱1,602)');
  await click([...notebookLine.querySelectorAll('.qty-btn')][0]); // −
  ok(body().includes('₱1,500.00 / ₱1,500.00'), 'quantity decrease restores ₱1,500');

  // remove mouse → below threshold again
  const mouseLine = [...document.querySelectorAll('.cart-line')].find((l) =>
    l.textContent.includes('Wireless Mouse'),
  );
  await click(mouseLine.querySelector('.icon-btn'));
  ok(body().includes('₱499.00 more to unlock'), 'remove item drops below threshold (₱1,001)');

  // keyboard qty 2 → ₱1,900 (TRUE case for checkout)
  const kbLine = [...document.querySelectorAll('.cart-line')].find((l) =>
    l.textContent.includes('Keyboard'),
  );
  await click([...kbLine.querySelectorAll('.qty-btn')][1]);
  ok(body().includes('₱1,900.00'), 'cart_total ₱1,900 after keyboard qty 2');

  // ---------- SCENE 3: checkout ----------
  await click(buttonWith('Proceed to Checkout'));
  ok(body().includes('Shipping Information'), 'checkout page renders');
  ok(body().includes('TRUE ✓'), 'checkout decision chip shows TRUE ✓ for ₱1,900');
  ok(body().includes('₱1,710.00'), 'grand total ₱1,710.00 for cart ₱1,900');

  // invalid submit first
  await act(async () => {
    document
      .querySelector('form.checkout-layout')
      .dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  });
  ok(body().includes('Full Name is required.'), 'form validation blocks empty submit');
  ok(!body().includes('ORDER CONFIRMED'), 'no order placed on invalid form');

  // fill and submit
  await type('fullName', 'Juan D. Cruz');
  await type('address', '123 Mabini St.');
  await type('city', 'Maragondon');
  await type('province', 'Cavite');
  await type('postal', '4112');
  await type('contact', '0917 000 0000');
  await act(async () => {
    document
      .querySelector('form.checkout-layout')
      .dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  });

  // ---------- SCENE 4: confirmation ----------
  ok(body().includes('ORDER CONFIRMED'), 'simulated order confirmation shows');
  ok(body().includes('#DEMO-001'), 'order number DEMO-001 issued');
  ok(body().includes('₱1,710.00'), 'confirmation grand total ₱1,710.00');
  ok(body().includes('✓ Algorithm completed'), 'confirmation reports algorithm END reached');

  // ---------- SCENE 5-7: algorithm lab ----------
  await click(buttonWith('Back to Home'));
  await click(navLink('Algorithm Lab'));
  ok(body().includes('CLASSROOM DEMO'), 'algorithm lab shows classroom demo panel');

  // FALSE case
  await click(buttonWith('TRY ₱1,200'));
  ok(body().includes('₱1,200.00 >= ₱1,500.00'), 'decision comparison visible for ₱1,200');
  ok(body().includes('IDLE'), 'preset click alone does not auto-run the algorithm');
  await click(buttonWith('RUN ALGORITHM'));
  await act(async () => {
    await sleep(11200);
  });
  ok(body().includes('FALSE ✕'), 'FALSE badge shown for ₱1,200 run');
  ok(body().includes('✓ Process Complete'), 'run reached END (process complete)');
  ok(body().includes('grand_total = ₱1,300.00'), 'completed run displays grand_total ₱1,300.00');

  // boundary case ₱1,500
  await click(buttonWith('TRY ₱1,500'));
  await click(buttonWith('RUN ALGORITHM'));
  await act(async () => {
    await sleep(11200);
  });
  ok(body().includes('TRUE ✓'), 'boundary ₱1,500 takes TRUE branch (>= operator)');
  ok(body().includes('grand_total = ₱1,350.00'), 'boundary run grand_total ₱1,350.00');

  // TRUE case ₱1,800
  await click(buttonWith('TRY ₱1,800'));
  await click(buttonWith('RUN ALGORITHM'));
  await act(async () => {
    await sleep(3000);
  });
  // reset MID-RUN must cancel the animation
  await click(buttonWith('RESET DEMO'));
  ok(body().includes('IDLE'), 'reset mid-run stops the animation (status IDLE)');
  ok(body().includes('Current cart total: ₱0.00') || body().includes('₱0.00'), 'reset clears the demo cart');
  ok(!body().includes('✓ Process Complete'), 'reset clears completion state');

  // explain panel
  await click(buttonWith('TRY ₱1,800'));
  await click(buttonWith('EXPLAIN THIS CALCULATION'));
  ok(body().includes('The answer is TRUE ✓'), 'explanation panel explains the TRUE case');

  if (failures > 0) {
    console.error(`\n${failures} UI check(s) FAILED`);
    process.exit(1);
  }
  console.log('\n✓ Full interactive UI flow passed (shop → cart → checkout → confirm → algorithm → reset).');
  process.exit(0);
}

main().catch((err) => {
  console.error('UI test crashed:', err);
  process.exit(1);
});
