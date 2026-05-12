import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("main.tsx executing");

window.addEventListener('error', (event) => {
  const errorDiv = document.createElement('div');
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '0';
  errorDiv.style.left = '0';
  errorDiv.style.right = '0';
  errorDiv.style.zIndex = '9999';
  errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
  errorDiv.style.color = 'white';
  errorDiv.style.padding = '20px';
  errorDiv.style.fontFamily = 'monospace';
  errorDiv.style.whiteSpace = 'pre-wrap';
  errorDiv.style.overflow = 'auto';
  errorDiv.style.maxHeight = '100vh';
  errorDiv.innerHTML = `<h3>Global Error</h3><b>${event.message}</b><br><br>${event.error?.stack || ''}`;
  document.body.appendChild(errorDiv);
});

try {
  const rootElement = document.getElementById('root');
  console.log("rootElement:", rootElement);
  if (!rootElement) throw new Error("No root element found!");
  
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log("createRoot called successfully");
} catch (err: any) {
  console.error("Error during rendering:", err);
  const errorDiv = document.createElement('div');
  errorDiv.textContent = `Render Error: ${err.message}`;
  document.body.appendChild(errorDiv);
}

