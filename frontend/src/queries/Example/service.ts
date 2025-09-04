import type { MutationFn } from '@/hooks/useMutation';
import type { QueryFn, QueryFnWithParams } from '@/hooks/useQuery';

import type { CreatePost, Post, SearchPost } from '@/types/Example';

import api from '@/utils/api';
import { QueryUtil } from '@/utils/query';

// [Service Layer] is responsible for calling http APIs, and organizing the data

const API_URL = api.example;

export const get: QueryFn<Post[]> = (signal) => {
  return QueryUtil.query<Post[]>({
    method: 'GET',
    url: API_URL.get,
    signal,
  });
};

export const search: QueryFnWithParams<SearchPost, Post[]> = (params, signal) => {
  return QueryUtil.query<Post[]>({
    method: 'GET',
    url: API_URL.search,
    params: params,
    signal,
  });
};

export const create: MutationFn<CreatePost, void> = (body, signal) => {
  return QueryUtil.query<void>({
    method: 'POST',
    url: API_URL.create,
    data: body,
    signal,
  });
};
