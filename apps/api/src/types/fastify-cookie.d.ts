import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    cookies: Record<string, string>;
  }

  interface FastifyReply {
    setCookie: (
      name: string,
      value: string,
      options?: {
        httpOnly?: boolean;
        sameSite?: 'lax' | 'strict' | 'none';
        secure?: boolean;
        path?: string;
        maxAge?: number;
        expires?: Date;
      },
    ) => FastifyReply;
  }
}
