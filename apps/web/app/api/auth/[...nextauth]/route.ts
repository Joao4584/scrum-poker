/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { integrationAction } from '@/modules/auth/actions/login-integration-action';
import { env } from '@scrum-poker/env';

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID ?? '',
      clientSecret: env.GITHUB_CLIENT_SECRET ?? '',
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
    async jwt({ token, account, profile }: any) {
      if (account && profile) {
        let payload;

        if (account.provider === 'github') {
          payload = {
            type: account.provider,
            id: String(profile.id),
            email: profile.email,
            name: profile.name || profile.login,
            avatar_url: profile.avatar_url,
            github_link: profile.html_url,
            bio: profile.bio,
          };
        } else if (account.provider === 'google') {
          payload = {
            type: account.provider,
            id: profile.sub,
            email: profile.email,
            name: profile.name,
            avatar_url: profile.picture,
          };
        }

        if (payload) {
          await integrationAction(payload);
        }
      }

      return token;
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
