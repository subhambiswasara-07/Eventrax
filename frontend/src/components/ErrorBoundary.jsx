import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('EventraX crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-chalk px-6 text-center">
          <h1 className="font-display text-3xl text-ink">Something tore at the seams</h1>
          <p className="max-w-md font-body text-ink/60">
            An unexpected error stopped this page from loading. Refresh to fix it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full border-2 border-ink bg-sunbeam px-6 py-3 font-body font-semibold text-ink hover:bg-ink hover:text-chalk"
          >
            Reload EventraX
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
