export type IntegrationProvider = 'google' | 'github';

export interface IntegrationUser {
  type: IntegrationProvider;
  email: string;
  name: string;
  avatar_url: string;
  password?: string;
  id?: string;
  github_link?: string;
  bio?: string;
}
