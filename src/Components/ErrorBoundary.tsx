import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main>
          <Unavailable />
        </main>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
