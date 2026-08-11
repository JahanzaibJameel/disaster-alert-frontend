import { useSyncExternalStore } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function subscribe(_onStoreChange: () => void) {
  // No-op: mount state is static after hydration
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function useMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
