import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { api } from '@/modules/shared/http/api-client';
import { postIntegrationService } from '@/modules/auth/services/post-integration';
import { integrationAction } from '@/modules/auth/actions/login-integration-action';

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
    async jwt({ token, account, profile, user, session }: any) {
      // console.log('JWT Callback:', { token, account, profile, user, session });
      let payload;

      if (account) {
        if (account.provider && account.provider == 'github') {
          payload = {
            type: account.provider,
            id: profile.id,
            login: profile.login,
            email: profile.email,
            name: profile.name,
            avatarUrl: profile.avatar_url,
            github_link: profile.html_url,
            bio: profile.bio,
          };
          await integrationAction(payload);
        }
      }

      return { token, account, profile, user, session };
    },
    async redirect({ url, baseUrl }) {
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
