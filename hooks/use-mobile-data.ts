import * as React from 'react';

import { useIsMobile } from '@/hooks/use-mobile';

type NetworkInformation = {
  type?: string;
  effectiveType?: string;
  saveData?: boolean;
  addEventListener?: (event: 'change', handler: () => void) => void;
  removeEventListener?: (event: 'change', handler: () => void) => void;
};

type NetworkSnapshot = Readonly<{
  type?: string;
  effectiveType?: string;
  saveData: boolean;
}>;

const SERVER_SNAPSHOT: NetworkSnapshot = { saveData: false };
let lastSnapshot: NetworkSnapshot | null = null;

function getConnection() {
  return (globalThis.navigator as Navigator & { connection?: NetworkInformation }).connection;
}

function subscribe(onStoreChange: () => void) {
  const connection = getConnection();
  if (!connection?.addEventListener) return () => undefined;

  connection.addEventListener('change', onStoreChange);
  return () => connection.removeEventListener?.('change', onStoreChange);
}

function getSnapshot(): NetworkSnapshot {
  const connection = getConnection();
  const type = connection?.type;
  const effectiveType = connection?.effectiveType;
  const saveData = Boolean(connection?.saveData);

  if (
    lastSnapshot &&
    lastSnapshot.type === type &&
    lastSnapshot.effectiveType === effectiveType &&
    lastSnapshot.saveData === saveData
  ) {
    return lastSnapshot;
  }

  lastSnapshot = { type, effectiveType, saveData };
  return lastSnapshot;
}

function getServerSnapshot(): NetworkSnapshot {
  return SERVER_SNAPSHOT;
}

function useNetworkInfo() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsMobileData() {
  const isMobile = useIsMobile();
  const network = useNetworkInfo();

  if (!isMobile) return false;
  if (network.saveData) return true;
  if (network.type) return network.type !== 'wifi' && network.type !== 'ethernet';
  if (network.effectiveType) return true;

  return false;
}
