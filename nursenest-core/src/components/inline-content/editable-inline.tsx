import { createElement } from "react";
import { isPathAllowedForStaffTier } from "@/lib/auth/admin-path-policy";
import { getStaffSession } from "@/lib/auth/staff-session";
import {
  getInlineContentResolved,
  preloadInlineContentMap,
  type InlineContentResolved,
} from "@/lib/inline-content/load-inline-content";

export type { InlineContentResolved };

export { preloadInlineContentMap };

/** RBAC path aligned with PATCH `/api/admin/inline-content`. */
const INLINE_CONTENT_API_PATH = "/api/admin/inline-content";

/**
 * Server components: resolve DB-backed copy by `contentKey`, then either render plain markup for
 * visitors or dynamically import the client editor only when staff may call the inline-content API.
 */

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
  if (!staff || !isPathAllowedForStaffTier(staff.tier, INLINE_CONTENT_API_PATH)) {
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
  if (!staff || !isPathAllowedForStaffTier(staff.tier, INLINE_CONTENT_API_PATH)) {
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
  if (!staff || !isPathAllowedForStaffTier(staff.tier, INLINE_CONTENT_API_PATH)) {
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
