import React from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { App } from 'antd';

import { QUERY_KEYS, useCreatePostMutation } from '@/queries/Example';

export const CreatePost: React.FC = () => {
  const { message } = App.useApp();

  const queryClient = useQueryClient();

  const createPostMutation = useCreatePostMutation({
    onMutate: () => message.info('Start create post'),

    onSuccess: () => {
      message.success('Create post success');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SEARCH });
    },

    onError: () => {
      message.error('Create post error');
    },

    onSettled: () => {
      message.info('End create post');
    },
  });

  return (
    <div>
      <button
        onClick={() => createPostMutation.mutate({ title: 'title', body: 'body', userId: 1 })}
      >
        Create
      </button>
    </div>
  );
};
