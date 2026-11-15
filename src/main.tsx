import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

document.addEventListener('keydown', function (e) {
  if (
    e.ctrlKey &&
    (e.key === '=' || e.key === '-' || e.key === '+' || e.key === '0')
  ) {
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener('wheel', function (e) {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
