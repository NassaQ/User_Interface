/**
 * ErrorBoundary — Catches render errors in its children and displays
 * a fallback UI instead of crashing the whole page.
 */

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  /** Optional contextual label shown in the fallback heading. */
  pageName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.pageName ? ` / ${this.props.pageName}` : ""}]`, error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">
            {this.props.pageName
              ? `Something went wrong in ${this.props.pageName}`
              : "Something went wrong"}
          </h2>

          <p className="text-sm text-muted-foreground max-w-md mb-6">
            An unexpected error occurred. You can try reloading this section
            or contact support if the problem persists.
          </p>

          {this.state.error && (
            <details className="mb-6 max-w-lg text-left">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                Error details
              </summary>
              <pre className="mt-2 text-xs bg-muted p-3 rounded-lg overflow-auto max-h-32 text-muted-foreground">
                {this.state.error.message}
              </pre>
            </details>
          )}

          <Button
            variant="outline"
            className="gap-2"
            onClick={this.handleRetry}
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
