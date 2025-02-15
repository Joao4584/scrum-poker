import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { api } from '@/modules/shared/http/api-client';

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
      console.log('JWT Callback:', { token, account, profile, user, session });
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
        }
        const result = await api.post('user/integration', {
          json: { payload },
        });

        if (result.status === 200) {
          const { data } = await result.json();
          console.log(data);
        } else {
          throw new Error('Failed to integrate user');
        }
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
