import React, { Component, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global suppression of third-party injected extension errors (MetaMask, Phantom, etc.)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = (reason?.message || reason?.stack || String(reason) || '').toLowerCase();
    if (msg.includes('metamask') || msg.includes('ethereum') || msg.includes('extension')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = (event.message || event.error?.message || '').toLowerCase();
    if (msg.includes('metamask') || msg.includes('ethereum') || msg.includes('extension')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // If it's an external extension error, auto-recover
    const msg = error.message.toLowerCase();
    if (msg.includes('metamask') || msg.includes('ethereum') || msg.includes('extension')) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 text-slate-800">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl max-w-md text-center space-y-4">
            <h2 className="text-xl font-bold font-display text-slate-900">Application Notice</h2>
            <p className="text-xs text-slate-600">
              An external browser extension encountered an interruption. Click below to continue browsing Altivio.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-5 py-2.5 btn-ink text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Continue to Altivio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);

