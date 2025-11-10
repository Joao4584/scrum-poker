'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const DynamicPhaserGame = dynamic(
  () => import('./game/PhaserGame').then((mod) => mod.PhaserGame),
  { ssr: false }
);

export default function TestPage() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <DynamicPhaserGame />
    </div>
  );
}
