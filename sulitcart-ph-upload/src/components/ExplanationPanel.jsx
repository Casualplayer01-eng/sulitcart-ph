import { buildExplanation } from '../utils/checkout.js';

/** Beginner-friendly, dynamically generated walkthrough of the live calculation. */
export default function ExplanationPanel({ result, open }) {
  if (!open) return null;
  const lines = buildExplanation(result);

  return (
    <section className="card explanation" aria-label="Explanation of this calculation">
      <h2 className="section-title">💡 EXPLAIN THIS CALCULATION</h2>
      <p className="section-sub">
        {result.qualifies
          ? 'WHAT IS THE SYSTEM CHECKING? Whether the cart total is at least ₱1,500 — YES, so the customer qualifies for the discount and free shipping.'
          : 'WHAT IS THE SYSTEM CHECKING? Whether the cart total is at least ₱1,500 — NO, so there is no discount and shipping costs ₱100.'}
      </p>
      <ol className="explain-list">
        {lines.map((line, i) => (
          <li key={i} style={{ animationDelay: `${i * 90}ms` }}>
            {line}
          </li>
        ))}
      </ol>
    </section>
  );
}
