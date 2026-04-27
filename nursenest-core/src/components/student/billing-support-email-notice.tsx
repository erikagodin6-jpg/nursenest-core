import { SUPPORT_CONTACT_COPY } from "@/lib/support/support-policy";

export function BillingSupportEmailNotice() {
  return (
    <p className="mt-3 max-w-2xl border-l-2 border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] pl-3 text-sm text-muted-foreground">
      {SUPPORT_CONTACT_COPY}
    </p>
  );
}
