import { createElement } from "react";
import { getStaffSession } from "@/lib/auth/staff-session";
import {
  getInlineContentResolved,
  preloadInlineContentMap,
  type InlineContentResolved,
} from "@/lib/inline-content/load-inline-content";
export type { InlineContentResolved };

export { preloadInlineContentMap };

type Preloaded = Record<string, InlineContentResolved>;

export async function EditableText(props: {
  contentKey: string;
  defaultText: string;
  /** Batch map from {@link preloadInlineContentMap} to avoid extra DB reads. */
  preloaded?: Preloaded;
  className?: string;
  as?: "p" | "span" | "div" | "label" | "li";
}) {
  const { contentKey, defaultText, preloaded, className, as: Tag = "p" } = props;
  const staff = await getStaffSession();
  const { text, kind } = await getInlineContentResolved(contentKey, defaultText, "PLAIN", preloaded);
  if (!staff) {
    return <Tag className={className}>{text}</Tag>;
  }
  const { EditableTextClient } = await import("@/components/inline-content/editable-inline-client");
  return (
    <EditableTextClient
      contentKey={contentKey}
      defaultText={defaultText}
      resolvedText={text}
      kind={kind}
      isAdmin
      className={className}
      as={Tag}
    />
  );
}

export async function EditableHeading(props: {
  contentKey: string;
  defaultText: string;
  preloaded?: Preloaded;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
  const { contentKey, defaultText, preloaded, className, as: Tag = "h2" } = props;
  const staff = await getStaffSession();
  const { text, kind } = await getInlineContentResolved(contentKey, defaultText, "PLAIN", preloaded);
  if (!staff) {
    return createElement(Tag, { className }, text);
  }
  const { EditableHeadingClient } = await import("@/components/inline-content/editable-inline-client");
  return (
    <EditableHeadingClient
      contentKey={contentKey}
      defaultText={defaultText}
      resolvedText={text}
      kind={kind}
      isAdmin
      className={className}
      as={Tag}
    />
  );
}

export async function EditableRichText(props: {
  contentKey: string;
  defaultHtml: string;
  preloaded?: Preloaded;
  className?: string;
}) {
  const { contentKey, defaultHtml, preloaded, className } = props;
  const staff = await getStaffSession();
  const { text, kind } = await getInlineContentResolved(contentKey, defaultHtml, "RICH_HTML", preloaded);
  if (!staff) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: text }} />;
  }
  const { EditableRichTextClient } = await import("@/components/inline-content/editable-inline-client");
  return (
    <EditableRichTextClient
      contentKey={contentKey}
      defaultText={defaultHtml}
      resolvedText={text}
      kind={kind}
      isAdmin
      className={className}
    />
  );
}
