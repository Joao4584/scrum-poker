'use server';

import { headers } from 'next/headers';
import { getGenerateUuidService } from '../services/get-generate-uuid';
import { redirect } from 'next/navigation';

export default async function UuidRedirect() {
  const lobbyService = await getGenerateUuidService();

  if (!lobbyService.uuid) {
    return null;
  }

  const headersList = headers();
  const currentURL =
    (await headersList).get('referer') || 'http://localhost:3000';

  redirect(`${currentURL}app/${lobbyService.uuid}`);
}
