import { Component, type ReactNode, type ErrorInfo, useState, useCallback } from "react";
import { AlertTriangle, RefreshCw, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentItemBoundaryProps {
  children: ReactNode;
  itemId?: string;
  itemIndex?: number;
  itemType?: "question" | "widget" | "media" | "card" | "lesson-block" | "download-item";
  onSkip?: () => void;
  fallback?: ReactNode;
  silent?: boolean;
}

interface ContentItemBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ContentItemBoundary extends Component<ContentItemBoundaryProps, ContentItemBoundaryState> {
  constructor(props: ContentItemBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { itemId, itemIndex, itemType } = this.props;
    console.warn(`[ContentItemBoundary] ${itemType || "item"} #${itemIndex ?? itemId ?? "?"} crashed:`, error.message);

    try {
      fetch("/api/resilience/incident-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: itemType || "component",
          route: window.location.pathname,
          errorMessage: error.message,
          source: "content_item_boundary",
          additionalContext: { itemId, itemIndex, itemType, componentStack: info.componentStack?.substring(0, 300) },
        }),
      }).catch(() => {});
    } catch {}
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.silent) {
        return null;
      }

      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <SkippedItemNotice
          itemType={this.props.itemType}
          itemIndex={this.props.itemIndex}
          onRetry={this.handleRetry}
          onSkip={this.props.onSkip}
        />
      );
    }
    return this.props.children;
  }
}

function SkippedItemNotice({
  itemType,
  itemIndex,
  onRetry,
  onSkip,
}: {
  itemType?: string;
  itemIndex?: number;
  onRetry?: () => void;
  onSkip?: () => void;
}) {
  const typeLabel = itemType === "question" ? "Question"
    : itemType === "widget" ? "Widget"
    : itemType === "media" ? "Media"
    : itemType === "card" ? "Flashcard"
    : itemType === "lesson-block" ? "Content Block"
    : itemType === "download-item" ? "Download"
    : "Item";

  return (
    <div
      className="border border-amber-200 bg-amber-50/50 rounded-lg p-4 text-center space-y-2"
      data-testid={`skipped-item-${itemIndex ?? "unknown"}`}
    >
      <div className="flex items-center justify-center gap-2 text-amber-600">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-medium">{typeLabel} could not be displayed</span>
      </div>
      <p className="text-xs text-amber-600/80">
        This {typeLabel.toLowerCase()} encountered an error and was skipped to keep your experience running.
      </p>
      <div className="flex items-center justify-center gap-2">
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="text-xs gap-1"
            data-testid={`button-retry-item-${itemIndex ?? "unknown"}`}
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </Button>
        )}
        {onSkip && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-xs gap-1"
            data-testid={`button-skip-item-${itemIndex ?? "unknown"}`}
          >
            <SkipForward className="w-3 h-3" /> Skip
          </Button>
        )}
      </div>
    </div>
  );
}

export function WidgetBoundary({
  children,
  widgetName,
  silent = true,
}: {
  children: ReactNode;
  widgetName?: string;
  silent?: boolean;
}) {
  return (
    <ContentItemBoundary
      itemType="widget"
      itemId={widgetName}
      silent={silent}
      fallback={
        silent ? null : (
          <div
            className="text-xs text-gray-400 italic p-2"
            data-testid={`widget-fallback-${widgetName || "unknown"}`}
          >
            Widget temporarily unavailable
          </div>
        )
      }
    >
      {children}
    </ContentItemBoundary>
  );
}

export function MediaBoundary({
  children,
  mediaId,
  index,
}: {
  children: ReactNode;
  mediaId?: string;
  index?: number;
}) {
  return (
    <ContentItemBoundary
      itemType="media"
      itemId={mediaId}
      itemIndex={index}
      fallback={
        <div
          className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center text-sm text-gray-500"
          data-testid={`media-boundary-fallback-${index ?? "unknown"}`}
        >
          <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-gray-400" />
          Media could not be displayed. Content continues below.
        </div>
      }
    >
      {children}
    </ContentItemBoundary>
  );
}

export function SafeList<T>({
  items,
  renderItem,
  itemType,
  keyExtractor,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemType?: ContentItemBoundaryProps["itemType"];
  keyExtractor?: (item: T, index: number) => string;
}) {
  return (
    <>
      {items.map((item, index) => (
        <ContentItemBoundary
          key={keyExtractor ? keyExtractor(item, index) : index}
          itemType={itemType}
          itemIndex={index}
        >
          {renderItem(item, index)}
        </ContentItemBoundary>
      ))}
    </>
  );
}

export function SafeRender({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ContentItemBoundary
      silent={!fallback}
      fallback={fallback}
    >
      {children}
    </ContentItemBoundary>
  );
}
