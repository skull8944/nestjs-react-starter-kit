import React from 'react';

import { Card } from 'antd';

import type { Post } from '../../../../../../types/Example';

type Props = {
  post: Post;
};

export const PostCard: React.FC<Props> = ({ post }) => (
  <Card>
    <div>{post.id}</div>
    <div>{post.title}</div>
    <div>{post.body}</div>
    <div>{post.userId}</div>
  </Card>
);
