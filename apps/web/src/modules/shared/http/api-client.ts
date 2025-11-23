/* eslint-disable @typescript-eslint/no-unused-vars */
import { getCookie } from 'cookies-next';
import ky from 'ky';
import { redirect } from 'next/navigation';

import { storageKey } from '../config/storage-key';
import { env } from '@scrum-poker/env';

const isRunningOnServer = typeof window === 'undefined';

export const api = ky.create({
  prefixUrl: env.PORT_NEST ? `http://localhost:${env.PORT_NEST}` : '',
  hooks: {
    beforeRequest: [
      async (request, options) => {
        let token: string | undefined;

        if (isRunningOnServer) {
          const { cookies } = await import('next/headers');
          const cookieStore = await cookies();
          token = cookieStore.get(`${storageKey}session`)?.value;
        } else {
          token = getCookie(`${storageKey}session`);
        }

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 400) {
          const errorData = await response.json();
          console.log('Erro 400 na API (JSON):', errorData);
        }
        if (response.status === 401 && response.url.indexOf('/auth') === -1) {
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
