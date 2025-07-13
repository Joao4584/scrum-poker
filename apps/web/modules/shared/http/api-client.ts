import axios, { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';
import { redirect } from 'next/navigation';
import { storageKey } from '../config/storage-key';
import { env } from '@scrum-poker/env';

const isRunningOnServer = typeof window === 'undefined';

export const api = axios.create({
  baseURL: `http://localhost:${env.PORT_NEST}/`,
});

api.interceptors.request.use(async (config) => {
  let token: string | undefined;

  if (isRunningOnServer) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    token = cookieStore.get(`${storageKey}session`)?.value;
  } else {
    token = getCookie(`${storageKey}session`);
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      error.config?.url?.indexOf('/auth') === -1
    ) {
      const redirectUrl = `/auth`;
      if (isRunningOnServer) {
        redirect(redirectUrl);
      } else {
        window.location.href = redirectUrl;
      }
    }
    return Promise.reject(error);
  },
);
