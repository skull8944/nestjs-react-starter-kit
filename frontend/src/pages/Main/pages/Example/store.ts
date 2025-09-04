import { create } from 'zustand';

import { useZustandShallowStore } from '@/hooks/useZustandShallowStore';

import type { Post, SearchPost } from '../../../../types/Example';

type ExampleStore = {
  searchParams: SearchPost;

  posts: Post[];
  setPosts: (posts: Post[]) => void;

  reset: () => void;
};

const initialState: Pick<ExampleStore, 'searchParams' | 'posts'> = {
  searchParams: {},
  posts: [],
};

export const useExampleStore = create<ExampleStore>((set) => ({
  ...initialState,

  setPosts: (posts) => set({ posts }),

  reset: () => set(() => ({ ...initialState })),
}));

export const useExampleShallowedStore = useZustandShallowStore(useExampleStore);
