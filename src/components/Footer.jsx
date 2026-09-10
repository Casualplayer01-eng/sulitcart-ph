import { THRESHOLD, SHIPPING_FEE } from '../utils/checkout.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <strong>SulitCart PH</strong>
          <p>
            A fictional classroom demo store. No real orders, payments or data collection —
            everything runs locally in your browser.
          </p>
        </div>
        <div>
          <strong>Checkout rule (from the flowchart)</strong>
          <p>
            cart_total &gt;= ₱{THRESHOLD.toLocaleString()} → 10% discount + free shipping.
            Otherwise no discount + ₱{SHIPPING_FEE} shipping. grand_total = final_total +
            shipping_fee.
          </p>
        </div>
        <div>
          <strong>For reporting</strong>
          <p>
            Flowchart → algorithm → program logic → real website. Open the Algorithm Lab to watch
            the flowchart execute on your live cart.
          </p>
        </div>
      </div>
    </footer>
  );
}
