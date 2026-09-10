import { useCallback, useState } from 'react';
import { CartProvider } from './context/CartContext.jsx';
import Navbar from './components/Navbar.jsx';
import DemoDock from './components/DemoDock.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import AlgorithmLab from './pages/AlgorithmLab.jsx';

/**
 * SulitCart PH — a professional demo store whose checkout is driven
 * by the uploaded flowchart (cart_total >= 1500 → 10% OFF + FREE shipping).
 * Lightweight state routing: no router dependency, localhost-only.
 */
export default function App() {
  const [route, setRoute] = useState('home');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [runSignal, setRunSignal] = useState(0); // increment => "run algorithm now"
  const [resetSignal, setResetSignal] = useState(0); // increment => "stop + clear highlights"
  const [explainSignal, setExplainSignal] = useState(0);

  const go = useCallback((next) => {
    setRoute(next);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }, []);

  const requestRun = useCallback(() => {
    setRoute('algorithm');
    setRunSignal((n) => n + 1);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }, []);

  const requestReset = useCallback(() => {
    setResetSignal((n) => n + 1);
  }, []);

  const requestExplain = useCallback(() => {
    setRoute('algorithm');
    setExplainSignal((n) => n + 1);
  }, []);

  return (
    <CartProvider>
      <div className="app-shell">
        <Navbar route={route} go={go} query={query} setQuery={setQuery} />

        <main className="app-main">
          {route === 'home' && (
            <Home
              go={go}
              query={query}
              setQuery={setQuery}
              category={category}
              setCategory={setCategory}
            />
          )}
          {route === 'cart' && <CartPage go={go} />}
          {route === 'checkout' && <CheckoutPage go={go} />}
          {route === 'confirmation' && <ConfirmationPage go={go} />}
          {route === 'algorithm' && (
            <AlgorithmLab
              go={go}
              runSignal={runSignal}
              resetSignal={resetSignal}
              explainSignal={explainSignal}
              requestRun={requestRun}
              requestReset={requestReset}
            />
          )}
        </main>

        <Footer />

        {route !== 'confirmation' && (
          <DemoDock
            go={go}
            requestRun={requestRun}
            requestExplain={requestExplain}
            requestReset={requestReset}
          />
        )}
      </div>
    </CartProvider>
  );
}
