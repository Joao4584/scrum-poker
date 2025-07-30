'use client';

import PhaserGame from '../../../modules/tests-room/components/PhaserGame';
import React from 'react';

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
      <PhaserGame />
    </div>
  );
}
