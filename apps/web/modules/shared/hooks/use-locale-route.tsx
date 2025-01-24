import type { GetServerSidePropsContext } from 'next';

const routeMap = {
  administrative: "administrative",
  provider: "provider",
  company: "company",
};

type LocaleContextResult = {
  pathname: string;
  type: string | null;
};


const determineContextType = (pathname: string): string | null => {
  for (const [key, value] of Object.entries(routeMap)) {
    if (pathname.includes(key)) {
      return value;
    }
  }
  return null;
};


const isRunningOnServer = typeof window === 'undefined'
export const useLocaleContext = (context?: GetServerSidePropsContext): LocaleContextResult | null => {
  

  if (context) {
    const { resolvedUrl } = context;
    return {
      pathname: resolvedUrl,
      type: determineContextType(resolvedUrl),
    };
  }
  
  if(!isRunningOnServer){
    const pathname = window.location.pathname;
    return {
      pathname,
      type: determineContextType(pathname),
    };
  }


  return null;

};
