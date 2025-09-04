import type { QueryKey } from '@tanstack/react-query';

import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

export class QueryUtil {
  /**
   * @description Generates Tanstack react-query query keys
   * @param prefix - Example: 'EXAMPLE'
   * @param queries - Example: ['options']
   * @returns Example: { options: ['EXAMPLE-options'] }
   */
  static genQueryKeys<TRecordKey extends string>(
    prefix: string,
    queries: readonly TRecordKey[],
  ): Record<TRecordKey, QueryKey> {
    return queries.reduce(
      (obj, key) => {
        obj[key] = [`${prefix}-${key}`];
        return obj;
      },
      {} as Record<TRecordKey, QueryKey>,
    );
  }

  /**
   * @param Generic TResponse: response type
   * @param config: AxiosRequestConfig<TRequest> axios request config
   * @returns
   */
  static async query<TResponse = unknown>({ ...config }: AxiosRequestConfig): Promise<TResponse> {
    const client = axios.create();

    // check if accessToken is expired, and refresh if needed

    config.headers = this.getHeaders(config);

    // fix query parameters serialization
    // example: { params: { key: ['value1', 'value2'] } } => key=value1&key=value2
    config.paramsSerializer = (params) => {
      return Object.entries(params)
        .map(([key, value], i) =>
          Array.isArray(value) ? `${key}=${value.join('&' + key + '=')}` : `${key}=${value}`,
        )
        .join('&');
    };

    client.interceptors.response.use(
      (response: AxiosResponse) => {
        this.handleResponse(response);
        return response;
      },
      (error: AxiosError) => this.handleError(error),
    );

    // ref: https://axios-http.com/docs/res_schema
    const { data } = await client.request<TResponse>(config);

    return data;
  }

  private static getHeaders(config: AxiosRequestConfig): AxiosRequestConfig['headers'] {
    // const useStore = useUserStore.getState();
    return {
      ...(config.headers ?? {}),
      ...(true && { // useStore.accessToken
        Authorization: `Bearer ${'useStore.accessToken'}`,
      }),
    };
  }

  private static handleResponse(response: AxiosResponse) {
    if (
      response.headers['content-type'] === 'multipart/form-data' &&
      response.headers['content-disposition']
    ) {
      const contentDisposition: string = response.headers['content-disposition'];
      response.data.fileName = decodeURIComponent(
        contentDisposition.slice(contentDisposition.indexOf('filename=') + 9),
      );
    }
  }

  private static async handleError(error: AxiosError) {
    if (error.status === 401) {
      // handle unauthorized error, e.g. logout user, redirect to login page
    } else {
      console.error('query error', error);
    }

    return Promise.reject(error);
  }
}
