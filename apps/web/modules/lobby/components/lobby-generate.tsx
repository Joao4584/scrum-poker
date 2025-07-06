'use client';

import LoadingLogo from '@/modules/shared/components/loading';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getGenerateUuidService } from '../services/get-generate-uuid';

export default function LobbyUuidGenerate() {
  const router = useRouter();
  const [loading, setLoading] = useState(<LoadingLogo />);

  useEffect(() => {
    generateUuid();
  }, []);

  const generateUuid = async (): Promise<void> => {
    try {
      const lobby = await getGenerateUuidService();

      if (lobby.uuid) {
        router.push(`/app/${lobby.uuid}`);
      }
    } catch (error: any) {
      console.log('Erro capturado:', error);
    }
  };

  return <div className="w-full h-full">{loading}</div>;
}
