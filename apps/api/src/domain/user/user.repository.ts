import { User } from '@/infrastructure/entities/user.entity';
import { IntegrationUser } from './integration-user';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface CreateUserInput {
  public_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  password?: string;
  github_id?: string;
  github_link?: string;
  bio?: string;
  google_id?: string;
}

export interface UserRepository {
  create(data: CreateUserInput): Promise<User>;
  findByPublicId(public_id: string): Promise<User | null>;
  findByIntegration(data: IntegrationUser): Promise<User | null>;
  exists(user_id: number): Promise<boolean>;
  update(id: number, data: Partial<User>): Promise<User>;
}
