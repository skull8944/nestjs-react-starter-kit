import { type MutationOptions, useMutation } from '@/hooks/useMutation';
import { type QueryOptions, useQuery } from '@/hooks/useQuery';

import type { CreatePost, Post, SearchPost } from '@/types/Example';

import { QueryUtil } from '@/utils/query';

import * as service from './service';

// [Query Hook Layer] is responsible for calling service layer,
// and wrapping service call with react-query hooks for easy and convenient usage.

export const QUERY_KEYS = QueryUtil.genQueryKeys('Example', ['GET', 'SEARCH']);

export const usePostsQuery = (options?: QueryOptions<Post[]>) =>
  useQuery({
    queryKey: QUERY_KEYS.GET,
    queryFn: service.get,
    options,
  });

export const useSearchPostsQuery = (params: SearchPost, options?: QueryOptions<Post[]>) => {
  // update query key with params
  QUERY_KEYS.SEARCH = [QUERY_KEYS.SEARCH[0], params];

  return useQuery({
    // ! if queryKey is changed, the query would be re-fetched
    queryKey: QUERY_KEYS.SEARCH,
    queryFn: (signal) => service.search(params, signal),
    options,
  });
};

// Creates a post using [CreatePost] data and returns [void]. Handles [unknown] errors.
export const useCreatePostMutation = (options?: MutationOptions<void, unknown, CreatePost>) =>
  useMutation({
    mutationFn: service.create,
    options,
  });
