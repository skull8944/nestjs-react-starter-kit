import React from 'react';

import { Button, List, Spin } from 'antd';

import { useSearchPostsQuery } from '@/queries/Example';

import { useExampleShallowedStore } from '../../store';
import { PostCard } from '../PostCard';

export const SearchPost: React.FC = () => {
  const { searchParams } = useExampleShallowedStore((store) => ({ searchParams: store.searchParams }));

  const { data, isLoading, refetch } = useSearchPostsQuery(searchParams);

  return (
    <Spin spinning={isLoading}>
      <Button onClick={() => refetch()}>Refresh</Button>

      <List dataSource={data} renderItem={(post) => <PostCard post={post} />} />
    </Spin>
  );
};
