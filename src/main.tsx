// Noto Kufi Arabic: the Arabic subset only, so Latin text and digits on Arabic pages fall through to Barlow.
import '@fontsource/noto-kufi-arabic/arabic-400.css';
import '@fontsource/noto-kufi-arabic/arabic-500.css';
import '@fontsource/noto-kufi-arabic/arabic-700.css';
import '@fontsource/noto-kufi-arabic/arabic-800.css';
import '@fontsource/noto-kufi-arabic/arabic-900.css';
import '@fontsource/barlow/300.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/barlow-semi-condensed/600.css';
import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import { introClock } from './components/ui/Reveal';

// Pre-rendered head tags are replaced by the ones each page renders (React 19 places them in <head>).
document.head.querySelectorAll('[data-ssr]').forEach((node) => node.remove());

// The pre-rendered HTML serves search engines, link previews and visitors without JavaScript;
// the app renders fresh on top of it (no hydration), so the query string and saved state
// can shape the first render freely.
const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element');

// The pre-rendered page has already started its CSS intro: note when, so the app continues it
// from the same point instead of replaying it (see useEntrance in components/ui/Reveal.tsx).
const running = container.querySelector('[data-intro]')?.getAnimations()[0];
if (running && typeof running.currentTime === 'number') introClock.origin = performance.now() - running.currentTime;

createRoot(container).render(
  <StrictMode>
    <BrowserRouter useTransitions={false}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
