import NetInfo from "@react-native-community/netinfo";
import type { QueryClient } from "@tanstack/react-query";
import { onlineManager } from "@tanstack/react-query";
import { log } from "./logging";

/**
 * Connects NetInfo to TanStack Query `onlineManager` and refetches active queries after reconnect.
 */
export function attachReactQueryNetworkSync(queryClient: QueryClient): void {
  let lastOnline = onlineManager.isOnline();

  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setOnline(online);
      if (online && !lastOnline) {
        log.info("network_reconnect_refetch");
        void queryClient.refetchQueries({ type: "active" });
      }
      lastOnline = online;
    });
  });
}
