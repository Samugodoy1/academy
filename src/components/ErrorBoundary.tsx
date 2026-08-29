import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[40vh] flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl" aria-hidden="true">!</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {this.props.fallbackTitle || 'Algo deu errado'}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Encontramos um problema inesperado. Tente recarregar a página ou voltar à rotina.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleRetry}
                className="px-5 py-2.5 rounded-xl bg-academy-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Tentar novamente
              </button>
              <button
                type="button"
                onClick={() => window.location.assign('/')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                Voltar ao início
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
