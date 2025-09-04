import type { StoreApi, UseBoundStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

export type StorePicker<TStore, TReturn> = Parameters<typeof useShallow<TStore, TReturn>>[0];

/**
 * auto wrap store picker with useShallow
 * @param store zustand create<Store>((set) => ({ ... }))
 * @returns
 */
export const useZustandShallowStore =
  <TStore>(store: UseBoundStore<StoreApi<TStore>>) =>
  <TReturn>(storePicker: StorePicker<TStore, TReturn>) =>
    store(useShallow(storePicker));
