import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = "97840517761-anoolsallpime9vpmnrg7uo9stu2qqol.apps.googleusercontent.com";

// Resilient Error Boundary to prevent black/blank screens
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-4 text-2xl font-bold shadow-xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-xs text-slate-400 max-w-md mb-4">
            An unexpected error occurred while rendering the view.
          </p>
          {this.state.error && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 max-w-lg w-full mb-6 text-left overflow-auto max-h-48 font-mono text-[11px] text-rose-300">
              <div className="font-bold text-rose-400 mb-1">{this.state.error.name}: {this.state.error.message}</div>
              <div className="text-slate-500 text-[10px] whitespace-pre-wrap">{this.state.error.stack}</div>
            </div>
          )}
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Reload Page
            </button>
            <button
              onClick={() => {
                try {
                  localStorage.removeItem('bit_live_placement_data_v2');
                  localStorage.removeItem('bit_live_placement_data_v3');
                  localStorage.removeItem('bit_live_placement_data_v3_time');
                  localStorage.removeItem('bit_rp_theme');
                } catch (e) {}
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              Clear Cache & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Register PWA Service Worker for Mobile Installation in Production only
if ('serviceWorker' in navigator) {
  if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  } else {
    // Unregister any active service worker during local development
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const reg of registrations) {
        reg.unregister();
      }
    }).catch(() => {});
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
