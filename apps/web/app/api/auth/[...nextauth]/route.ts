import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, profile, user, session }) {
      console.log('JWT Callback:', { token, account, profile, user, session });
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect Callback:', { url, baseUrl });
      // Redireciona para "/app" após autenticação bem-sucedida
      if (url.startsWith('/')) {
        return `${baseUrl}/app`;
      } else if (new URL(url).origin === baseUrl) {
        return `${baseUrl}/app`;
      }
      return baseUrl;
    },
  },
};

// Exporta a API NextAuth
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
