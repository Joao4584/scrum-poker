import UuidRedirect from '@/modules/lobby/functions/uuid-redirect';

export default async function Page() {
  await UuidRedirect();
  return null;
}
