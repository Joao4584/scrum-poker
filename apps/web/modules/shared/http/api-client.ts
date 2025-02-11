import { getCookie } from 'cookies-next';
import ky from 'ky';
import { redirect } from 'next/navigation';
import { CookiesFn } from 'cookies-next/lib/types';
import { storageKey } from '../config/storage-key';

const isRunningOnServer = typeof window === 'undefined';

export const api = ky.create({
  prefixUrl: process.env.BACKEND_URL,
  hooks: {
    beforeRequest: [
      async (request, options) => {
        let cookieStore: CookiesFn | undefined;
        let token: string | undefined;

        if (isRunningOnServer) {
          const { cookies } = await import('next/headers');
          const cookieStore = await cookies();
          token = cookieStore.get(`${storageKey}-session`)?.value;
        } else {
          token = getCookie(`${storageKey}-session`);
        }

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401 && response.url.indexOf('/auth') == -1) {
          const redirectUrl = `/auth`;
          if (isRunningOnServer) {
            redirect(redirectUrl);
          } else {
            window.location.href = redirectUrl;
          }
        }
      },
    ],
  },
});
