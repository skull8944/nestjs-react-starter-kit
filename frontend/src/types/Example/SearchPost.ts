import type { Post } from './Post';

export type SearchPost = {
  [Key in keyof Post]?: Post[Key][];
};
