import { Component, useEffect, type ErrorInfo, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { DEFAULT_LOCALE } from "@/lib/locale-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * App-wide error boundary for routed content and deferred shell widgets.
 * Place inside `I18nProvider` so the fallback can use `useI18n`.
 */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<AppErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.setState({ errorInfo: info });

    const route = typeof window !== "undefined" ? window.location.pathname : "unknown";
    const fingerprint = `${error.name}:${error.message?.slice(0, 80)}`;
    const isTDZ =
      error.message?.includes("before initialization") || error.message?.includes("Cannot access");

    console.error(
      `[AppErrorBoundary] Crash on route="${route}" fingerprint="${fingerprint}"`,
      "\n  Error:",
      error.message,
      isTDZ ? "\n  ⚠ TDZ/circular-import suspected — check module init order" : "",
      "\n  Component stack:",
      info.componentStack,
    );

    if (import.meta.env.DEV) {
      console.groupCollapsed("[AppErrorBoundary] Full diagnostic context");
      console.error("Error object:", error);
      console.error("Stack:", error.stack);
      console.error("React component stack:", info.componentStack);
      console.error("Route:", route);
      console.groupEnd();
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <AppErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          route={typeof window !== "undefined" ? window.location.pathname : "unknown"}
        />
      );
    }
    return this.props.children;
  }
}

function AppErrorFallback({
  error,
  errorInfo,
  route,
}: {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  route: string;
}) {
  const { t } = useI18n();
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, follow";
    meta.dataset.errorBoundary = "true";
    const existing = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (existing) {
      existing.dataset.originalContent = existing.content;
      existing.content = "noindex, follow";
      existing.dataset.errorBoundary = "true";
    } else {
      document.head.appendChild(meta);
    }
    return () => {
      if (existing) {
        existing.content = existing.dataset.originalContent || "index, follow";
        delete existing.dataset.errorBoundary;
        delete existing.dataset.originalContent;
      } else {
        meta.remove();
      }
    };
  }, []);

  const goHome = () => {
    window.location.assign(`/${DEFAULT_LOCALE}`);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background p-4"
      data-testid="error-boundary-fallback"
      data-noindex-error="true"
    >
      <Card className="w-full max-w-lg shadow-md border-destructive/20">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
            <CardTitle className="text-lg">{t("app.App.somethingWentWrong")}</CardTitle>
          </div>
          <CardDescription>{t("app.App.unexpectedError")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {isDev ? (
            <>
              <p>
                Route: <code className="text-xs bg-muted px-1 py-0.5 rounded">{route}</code>
              </p>
              <pre className="max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs text-foreground whitespace-pre-wrap break-words">
                {error?.message}
                {error?.stack ? `\n\n${error.stack}` : ""}
              </pre>
              {errorInfo?.componentStack ? (
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium text-foreground">{t("app.App.componentStack")}</summary>
                  <pre className="mt-2 max-h-36 overflow-auto rounded-md bg-muted p-2 whitespace-pre-wrap">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              ) : null}
              <details className="text-xs">
                <summary className="cursor-pointer font-medium text-foreground">{t("app.App.diagnosticContext")}</summary>
                <pre className="mt-2 max-h-28 overflow-auto rounded-md bg-amber-50 dark:bg-amber-950/30 p-2 whitespace-pre-wrap">
                  Route: {route}
                  {"\n"}
                  {errorInfo?.componentStack}
                </pre>
              </details>
            </>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button type="button" variant="default" onClick={() => window.location.reload()} data-testid="button-reload">
            <RefreshCw className="h-4 w-4 mr-2" aria-hidden />
            {t("app.App.reloadPage")}
          </Button>
          <Button type="button" variant="outline" onClick={goHome} data-testid="button-go-home">
            <Home className="h-4 w-4 mr-2" aria-hidden />
            {t("app.App.goHome")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
