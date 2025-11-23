import { api } from '@/modules/shared/http/api-client';

export interface IntegrationInput {
  type: string;
  id: string;
  login: string;
  email: string;
  name: string;
  avatarUrl: string;
  github_link: string;
  bio: string;
}

interface LoginOutput {
  success: boolean;
  message: string;
  accessToken: string;
}

export async function postIntegrationService(credentials: IntegrationInput) {
  return await api
    .post(`user/integration`, {
      json: credentials,
    })
    .json<LoginOutput>();
}
