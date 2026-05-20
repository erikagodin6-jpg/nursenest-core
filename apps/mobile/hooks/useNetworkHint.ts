import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

/**
 * Offline preparation: surface connectivity for gated UI / future TanStack persistence.
 */
export function useNetworkHint(): { readonly online: boolean } {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setOnline(state.isConnected ?? true);
    });
    void NetInfo.fetch().then((s) => setOnline(s.isConnected ?? true));
    return () => unsub();
  }, []);

  return { online };
}
