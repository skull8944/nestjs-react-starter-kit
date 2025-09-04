import React from 'react';

import { Button, List, Spin } from 'antd';

import { usePostsQuery } from '@/queries/Example';

import { useExampleShallowedStore } from '../../store';
import { PostCard } from '../PostCard';

export const GetPost: React.FC = () => {
  const { setPosts } = useExampleShallowedStore((store) => ({
    setPosts: store.setPosts,
  }));

  const { data, refetch, isLoading } = usePostsQuery({
    // set posts after query succeed
    callback: setPosts,
  });

  return (
    <Spin spinning={isLoading}>
      <Button onClick={() => refetch()}>Refresh</Button>

      <List dataSource={data} renderItem={(post) => <PostCard post={post} />} />
    </Spin>
  );
};
