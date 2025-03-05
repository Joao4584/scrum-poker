import { api } from '@/modules/shared/http/api-client';

interface GenerateUuidOutput {
  uuid: string;
}

export async function getGenerateUuidService() {
  return await api.get(`lobby/join`).json<GenerateUuidOutput>();
}
