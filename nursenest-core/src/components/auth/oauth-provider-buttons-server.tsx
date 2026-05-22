import type { ComponentProps } from "react";
import { listConfiguredOAuthProviderIds } from "@/lib/auth/oauth-config";
import { OAuthProviderButtons } from "@/components/auth/oauth-provider-buttons";
import type { OAuthProviderId } from "@/lib/auth/auth-flow-governance";

export function OAuthProviderButtonsServer(
  props: Omit<ComponentProps<typeof OAuthProviderButtons>, "providers"> & {
    providers?: OAuthProviderId[];
  },
) {
  const providers = props.providers ?? listConfiguredOAuthProviderIds();
  const { providers: _ignored, ...rest } = props;
  return <OAuthProviderButtons {...rest} providers={providers} />;
}
