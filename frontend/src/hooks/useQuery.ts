import type { Dispatch } from 'react';

import { useQuery as useReactQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

export type QueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryFn' | 'queryKey'> & {
  callback?: Dispatch<TData>;
};

export type QueryFn<TData> = (signal?: AbortSignal) => Promise<TData>;

export type QueryFnWithParams<TRequest, TData> = (
  request: TRequest,
  signal?: AbortSignal,
) => Promise<TData>;

export const useQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData extends TQueryFnData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryKey,
  queryFn,
  options,
}: {
  queryKey: TQueryKey;
  queryFn: QueryFn<TData>;
  options?: QueryOptions<TQueryFnData, TError, TData, TQueryKey>;
}) => {
  if (options && 'queryFn' in options) {
    delete options.queryFn;
  }

  const query = useReactQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    queryKey,
    queryFn: async ({ signal }) => {
      const responseData = await queryFn(signal);

      if (typeof options?.callback === 'function') {
        options.callback(responseData);
      }

      return responseData;
    },
  });

  return query;
};

export type UseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData extends TQueryFnData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = ReturnType<typeof useQuery<TQueryFnData, TError, TData, TQueryKey>>;
