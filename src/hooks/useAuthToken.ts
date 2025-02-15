'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useAuthToken() {
  const { data, error } = useSWR('/api/auth/token', fetcher);

  return {
    token: data?.accessToken,
    isLoading: !error && !data,
    isError: error,
  };
}
