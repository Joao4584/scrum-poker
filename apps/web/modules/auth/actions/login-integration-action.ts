'use server';

import { AxiosError } from 'axios';

import {
  postIntegrationService,
  type IntegrationInput,
} from '../services/post-integration';
import { cookies } from 'next/headers';
import { storageKey } from '@/modules/shared/config/storage-key';

export async function integrationAction(params: IntegrationInput) {
  try {
    const response = await postIntegrationService(params);
    const cookieStore = await cookies();
    cookieStore.set(`${storageKey}session`, response.accessToken);
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error(
        'HTTP Error:',
        err.response?.status,
        err.response?.statusText,
      );
    } else {
      console.error('Unexpected Error:', err);
    }
  }
}
