import '@fontsource/noto-kufi-arabic/400.css';
import '@fontsource/noto-kufi-arabic/500.css';
import '@fontsource/noto-kufi-arabic/700.css';
import '@fontsource/noto-kufi-arabic/800.css';
import '@fontsource/noto-kufi-arabic/900.css';
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

// The script is running: switch off the CSS fallback that reveals pre-rendered content.
document.documentElement.classList.add('js-ready');

// Pre-rendered head tags are replaced by the ones each page renders (React 19 places them in <head>).
document.head.querySelectorAll('[data-ssr]').forEach((node) => node.remove());

// The pre-rendered HTML serves search engines, link previews and visitors without JavaScript;
// the app renders fresh on top of it (no hydration), so the query string and saved state
// can shape the first render freely.
const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element');

createRoot(container).render(
  <StrictMode>
    <BrowserRouter useTransitions={false}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
