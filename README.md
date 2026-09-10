# SulitCart PH — E-Commerce Checkout Flowchart, Brought to Life

A complete, professional demo e-commerce website whose checkout is driven **exactly** by the
uploaded flowchart:

```
START → INPUT cart_total → STORE cart_total → DECISION cart_total >= 1500?
   YES → final_total = cart_total × 0.90, shipping_fee = 0
   NO  → final_total = cart_total,        shipping_fee = 100
→ (connector A) → CALCULATE grand_total = final_total + shipping_fee
→ DELAY (brief) → DISPLAY grand_total → END
```

Instead of only *viewing* the flowchart, this website lets a class **experience** it:
browse → add to cart → watch `cart_total` grow → cross ₱1,500 → see the decision flip to
TRUE ✓ → watch the discount, free shipping and grand total compute → run the flowchart
stage-by-stage in the Algorithm Lab.

Built for **localhost-only classroom reporting / video demonstration**. No backend, no
database, no auth, no payments, no internet needed after `npm install`.

---

## 🚀 Run it

```bash
npm install
npm run dev
```

Then open **http://localhost:5173** (print the URL shown in your terminal if different).

Recommended: desktop browser, full-screen, 16:9 window for screen recording.

## 💻 Run it on your own laptop (fully local)

The app is plain files + local state — there is nothing to host. On any computer
(Windows / macOS / Linux):

1. Install **Node.js 18+ (LTS recommended)** from https://nodejs.org (one-time).
2. Copy this project folder (USB drive, Google Drive, or `git clone` — see below).
   Do **not** copy `node_modules/` or `dist/` — they are regenerated.
3. In a terminal inside the folder:

   ```bash
   npm install     # one-time; downloads React + Vite
   npm run dev     # starts http://localhost:5173
   ```

4. After `npm install` finishes once, the site works **without internet** — perfect for
   classroom recording.

## 🐙 Put it on GitHub

**As code backup / to move between computers (recommended):**

```bash
git init                                  # already done in this copy if .git exists
git add .
git commit -m "SulitCart PH — checkout flowchart demo"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

On another machine (e.g. the reporting laptop):

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
npm install
npm run dev
```

`node_modules/` and `dist/` are git-ignored, so the repo stays small and clean.

**Optional: host it on GitHub Pages.** The build is 100% static (no backend, no router,
state-based navigation), so Pages works if you ever want a shareable link:

1. Move `optional-github-pages/deploy-pages.yml` → `.github/workflows/deploy-pages.yml`
2. Repo → **Settings → Pages → Source: GitHub Actions**
3. Push to `main`; the site appears at `https://<your-username>.github.io/<repo-name>/`

The workflow builds with `--base=/<repo-name>/` so assets resolve correctly. For the
classroom video you can still just use `npm run dev` locally — Pages is only a bonus.

## 🧪 Test it

```bash
npm test     # 11 calculation test groups (₱0 … ₱5,000, boundary ₱1,500 → TRUE)
npm run smoke# SSR render test of every page/branch + content assertions
npm run ui   # full interactive jsdom flow: shop → cart → checkout → confirm → algorithm → reset
npm run build# production build sanity check
```

All suites currently pass (32 interactive UI checks included).

---

## 🎬 Suggested video-demo flow

| Scene | What to do | What the class sees |
| --- | --- | --- |
| 1. Store | Open homepage | Professional store: hero, categories, 16 products, search |
| 2. Shopping | Add e.g. Keyboard ₱899 + Mouse ₱499 | Threshold strip: “Add ₱102.00 more to unlock…” |
| 3. Boundary | Add Academic Notebook ₱102 → cart = ₱1,500 | Strip flips: “✓ 10% OFF + FREE SHIPPING UNLOCKED” |
| 4. Cart | Open Cart | Progress bar ₱1,500/₱1,500, quantities, subtotals |
| 5. Checkout | Proceed to Checkout | Decision chip `₱1,500.00 >= ₱1,500.00 → TRUE ✓`, summary: −₱150.00, FREE, **₱1,350.00** |
| 6. Order | Fill form → PLACE SIMULATED ORDER | ORDER CONFIRMED #DEMO-001, ✓ Checkout completed, ✓ Algorithm completed |
| 7. Algorithm Lab | Nav → Algorithm Lab → TRY ₱1,800 → ▶ RUN ALGORITHM | Flowchart executes: START…INPUT ₱1,800…DECISION TRUE ✓…YES branch…A…CALCULATE…DELAY…DISPLAY ₱1,620.00…END |
| 8. FALSE case | TRY ₱1,200 → RUN | `₱1,200 >= ₱1,500 → FALSE ✕`, NO branch, +₱100 shipping, grand ₱1,300.00 |
| 9. Boundary case | TRY ₱1,500 → RUN | `₱1,500 >= ₱1,500 → TRUE ✓` — proves the operator is `>=`, not `>` |
| 10. Explain | 💡 EXPLAIN THIS CALCULATION | Beginner-friendly numbered walkthrough with live numbers |
| 11. Reset | ↺ RESET DEMO | Animation stops, highlights clear, cart empties — no refresh needed |

A floating **CLASSROOM DEMO dock** (bottom-right, collapsible) keeps TRY ₱1,200 / ₱1,500 /
₱1,800 / RUN / EXPLAIN / RESET reachable on *every* screen while recording.

---

## 🧠 Single source of truth

`src/utils/checkout.js → calculateCheckout(cartTotal)` is the **only** place the business
logic lives. The order summary, threshold strip, cart progress, algorithm visualizer,
explanation panel, mapping panel, “under the hood” code and demo mode all read from it.
The cart subtotal **is** the flowchart's `cart_total` — no fake parallel values.

| cart_total | condition `>= 1500` | discount | final_total | shipping | grand_total |
| --- | --- | --- | --- | --- | --- |
| ₱1,199 | FALSE ✕ | ₱0 | ₱1,199 | ₱100 | ₱1,299 |
| ₱1,499 | FALSE ✕ | ₱0 | ₱1,499 | ₱100 | ₱1,599 |
| **₱1,500** | **TRUE ✓** | **₱150** | **₱1,350** | **FREE** | **₱1,350** |
| ₱1,501 | TRUE ✓ | ₱150.10 | ₱1,350.90 | FREE | ₱1,350.90 |
| ₱1,800 | TRUE ✓ | ₱180 | ₱1,620 | FREE | ₱1,620 |

## 🗂 Structure

```
src/
  data/products.js          16 offline products + demo presets (₱1,200/₱1,500/₱1,800 carts)
  utils/checkout.js         CENTRAL engine: calculateCheckout, formatPHP, explanation
  context/CartContext.jsx   cart state, cart_total, order simulation
  components/
    Navbar.jsx              store header + live threshold strip
    ProductCard.jsx         product tile, add/qty controls
    CartProgress.jsx        ₱X/₱1,500 bar + smart unlock message
    OrderSummary.jsx        subtotal/discount/shipping/GRAND TOTAL + decision chip
    FlowShapes.jsx          terminal, parallelogram, cylinder, diamond, process,
                            semicircle delay, pentagon connector, display, callout
    AlgorithmVisualizer.jsx sequential START→END execution with path highlighting
    DemoControls.jsx        CLASSROOM DEMO panel
    DemoDock.jsx            floating demo dock
    ExplanationPanel.jsx    “EXPLAIN THIS CALCULATION”
    MappingPanel.jsx        FLOWCHART → WEBSITE with live values
    UnderTheHood.jsx        the IF/ELSE code with live comments
  pages/                    Home, CartPage, CheckoutPage, ConfirmationPage, AlgorithmLab
  styles/app.css            design system + flowchart shapes + animations
scripts/
  test-calculator.mjs       unit tests for the engine
  render-smoke.mjs/.jsx     SSR render smoke test
  ui-test.mjs/.jsx          interactive jsdom end-to-end flow
```

## ✅ Notes for the report

- Currency is always formatted as Philippine pesos (`₱1,620.00`) via `Intl.NumberFormat`.
- TRUE/FALSE is never communicated by color alone — always `TRUE ✓` / `FALSE ✕` text.
- The DELAY node is real (≈0.95 s “Calculating…”), because the flowchart contains it.
- Connector **A** is preserved as the off-page pentagon where both branches converge.
- Empty cart, invalid quantities and invalid checkout forms are handled with friendly
  messages — the UI never crashes.
- Everything runs from local state; refreshing the page simply starts a clean demo.
