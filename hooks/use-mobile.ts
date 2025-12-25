import * as React from 'react';

const MOBILE_BREAKPOINT = 768;
const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function getMatchMedia() {
  return globalThis.matchMedia?.(MOBILE_MEDIA_QUERY);
}

function subscribe(onStoreChange: () => void) {
  const mediaQueryList = getMatchMedia();
  if (!mediaQueryList) return () => undefined;

  const handler = () => onStoreChange();
  mediaQueryList.addEventListener('change', handler);

  return () => mediaQueryList.removeEventListener('change', handler);
}

function getSnapshot() {
  return getMatchMedia()?.matches ?? false;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
