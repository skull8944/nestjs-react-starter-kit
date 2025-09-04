import type { Post } from './Post';

export type EditPost = Pick<Post, 'id'> & Partial<Omit<Post, 'id'>>;
