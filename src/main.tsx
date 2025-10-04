import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Safe Capacitor initialization
const initializeCapacitorSafely = async () => {
  try {
    const { initializeCapacitor, isNative, getPlatform } = await import("./lib/capacitor");
    
    await initializeCapacitor();
    
    // Add Android-specific styling
    if (isNative() && getPlatform() === 'android') {
      document.body.style.visibility = 'visible';
      document.documentElement.style.visibility = 'visible';
      document.documentElement.classList.add('android-platform');
    }
    
  } catch (error) {
    // Continue as web app - this is expected on desktop
  }
};

// Initialize Capacitor safely
initializeCapacitorSafely();

const rootElement = document.getElementById("root");

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: red; font-family: Arial, sans-serif;">
        <h2>⚠️ App Loading Error</h2>
        <p>Failed to load the application. Please refresh the page.</p>
      </div>
    `;
  }
}
