"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/modules/shared/ui/select";
import spriteAssets from "@/app/[locale]/playground/game/sprites/sprites-assets.json";
import { useCharacterStore } from "@/modules/room/stores/character.store";
import { updateUserCharacter } from "@/modules/dashboard/services/update-user-character";

const SPRITE_FRAME_SIZE = 32;
const SPRITE_SHEET_WIDTH = 768;
const SPRITE_SHEET_HEIGHT = 64;
const SPRITE_FRAME_COL_LAST = 19;
const SPRITE_FRAME_ROW = 0.6;
const SPRITE_ZOOM = 0.74;

function SpriteThumb({ src, label, size }: { src: string; label: string; size: number }) {
  return (
    <div className="relative overflow-hidden rounded-md bg-slate-600/30" style={{ width: size, height: size }} aria-hidden>
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: SPRITE_FRAME_SIZE,
          height: SPRITE_FRAME_SIZE,
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: `-${SPRITE_FRAME_SIZE * SPRITE_FRAME_COL_LAST}px -${SPRITE_FRAME_SIZE * SPRITE_FRAME_ROW}px`,
          backgroundSize: `${SPRITE_SHEET_WIDTH}px ${SPRITE_SHEET_HEIGHT}px`,
          imageRendering: "pixelated",
          transform: `translate(-50%, -50%) scale(${SPRITE_ZOOM})`,
          transformOrigin: "center",
        }}
      />
    </div>
  );
}

export function ProfileCharacterSelect() {
  const queryClient = useQueryClient();
  const spriteEntries = useMemo(() => Object.entries(spriteAssets), []);
  const { characterKey, setCharacterKey } = useCharacterStore();
  const fallbackKey = spriteEntries[0]?.[0] ?? "";
  const selectedCharacterKey = characterKey && spriteAssets[characterKey as keyof typeof spriteAssets] ? characterKey : fallbackKey;
  const [isUpdating, setIsUpdating] = useState(false);

  const selectedSprite = spriteAssets[selectedCharacterKey as keyof typeof spriteAssets];
  useEffect(() => {
    if (selectedCharacterKey && selectedCharacterKey !== characterKey) {
      setCharacterKey(selectedCharacterKey);
    }
  }, [characterKey, selectedCharacterKey, setCharacterKey]);

  const handleCharacterChange = async (nextKey: string) => {
    if (!nextKey || nextKey === characterKey || isUpdating) {
      return;
    }

    const previousKey = characterKey;
    const previousUser = queryClient.getQueryData<{ character_key?: string | null }>(["user"]);

    if (previousUser) {
      queryClient.setQueryData(["user"], { ...previousUser, character_key: nextKey });
    }
    setCharacterKey(nextKey);
    setIsUpdating(true);

    try {
      await updateUserCharacter({ character_key: nextKey });
    } catch {
      if (previousUser) {
        queryClient.setQueryData(["user"], previousUser);
      }
      setCharacterKey(previousUser?.character_key ?? previousKey ?? fallbackKey);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="px-3 pt-3 pb-2">
      <p className="text-xs text-muted-foreground">Personagem</p>
      <Select value={selectedCharacterKey} onValueChange={handleCharacterChange} disabled={isUpdating}>
        <SelectTrigger className="mt-2 h-10 bg-secondary/70">
          <div className="flex items-center gap-2">
            {selectedSprite?.idle && <SpriteThumb src={selectedSprite.idle} label={selectedCharacterKey} size={32} />}
            <span className="text-sm capitalize">{selectedCharacterKey || "Selecionar"}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {spriteEntries.map(([key, sprite]) => (
            <SelectItem key={key} value={key}>
              <div className="flex items-center gap-2">
                <SpriteThumb src={sprite.idle} label={key} size={28} />
                <span className="text-sm capitalize">{key}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
