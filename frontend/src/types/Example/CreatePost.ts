import type { Post } from './Post';

export type CreatePost = Omit<Post, 'id'>;
