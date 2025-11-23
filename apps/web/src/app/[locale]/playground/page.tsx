"use client";

import React from "react";
import dynamic from "next/dynamic";

const DynamicPhaserGame = dynamic(
  () => import("./game/PhaserGame").then((mod) => mod.PhaserGame),
  { ssr: false },
);

export default function TestPage() {
  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden ">
      <div
        style={{
          width: "99vw",
          height: "99vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DynamicPhaserGame />
      </div>
    </div>
  );
}
