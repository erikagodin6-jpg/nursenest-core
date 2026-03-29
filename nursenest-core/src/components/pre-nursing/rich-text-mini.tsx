/** Minimal read path for `EditableModuleText` HTML — no full rich editor in marketing shell. */
export function RichTextDisplay({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  minHeight?: string;
  placeholder?: string;
};

/** Admin-only in legacy SPA; never mounted when `isEditing` is false. */
export function RichTextEditor(_props: RichTextEditorProps) {
  return null;
}
