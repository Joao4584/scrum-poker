import { getCookie } from 'cookies-next'
import ky from 'ky'
import { useLocaleContext } from '../hooks/use-locale-route';
import { redirect } from 'next/navigation';
import { CookiesFn } from 'cookies-next/lib/types';
import { storageKey } from '../config/storage-key';

const isRunningOnServer = typeof window === 'undefined'

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_SOCORREAE_API,
  hooks: {
    beforeRequest: [
      async (request, options) => {
        
        const localeInfo = useLocaleContext();
        let cookieStore: CookiesFn | undefined


        if (isRunningOnServer) {
          const { cookies: serverCookies } = await import('next/headers')
          cookieStore = serverCookies
        }

        if(localeInfo && localeInfo.type){
          const token = getCookie(`${storageKey}${localeInfo.type}-session`, { cookies: cookieStore })
  
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`)
          }
        }
    

      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        
      const localeInfo = useLocaleContext();
        if(localeInfo.type){
          if (response.status === 401 && response.url.indexOf("/auth") == -1) {
            const redirectUrl = `/${localeInfo.type}/auth/login`
            isRunningOnServer ? redirect(redirectUrl) : window.location.href = redirectUrl
          }
        
        }
      },
    ],
  },
})
