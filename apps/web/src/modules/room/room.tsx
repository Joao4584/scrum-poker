"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useI18n } from "@/locales/client";
import { useRoomActions } from "./hooks/use-room-actions";
import { useQueryState } from "nuqs";
import { ChatCard } from "./components/chat-card";
import { FocusReturnButton } from "./components/focus-return-button";
import { NearbyPlayers } from "./components/nearby-players";
import { PingCard } from "./components/ping-card";
import { PlayerInfoCard } from "./components/player-info-card";
import { InvisibilityCard } from "./components/invisibility-card";
import { PlanningCard } from "./components/planning-card";
import { useUser } from "@/modules/profile/hooks/use-user";
import type { RoomDetail } from "../rooms/services/get-room-detail";
import { useCharacterStore } from "@/modules/room/stores/character.store";
import { useRoomUiStore } from "./stores/room-ui-store";
import { useRoomStore } from "./stores/room-store";
import { useRoomUploadImages } from "./hooks/use-room-upload-images";
import { useSounds } from "@/modules/shared/hooks/use-sounds";
import { useExperience } from "@/modules/shared/hooks/use-experience";
import { formatDisplayName } from "@/modules/shared/utils";
import { verifyRoomAccessToken, verifyRoomPassword } from "./services/verify-room-password";
import { Button } from "@/modules/shared/ui/button";
import { Input } from "@/modules/shared/ui/input";

const DynamicPhaserGame = dynamic(() => import("./PhaserGame").then((mod) => mod.PhaserGame), {
  ssr: false,
});

interface RoomPageProps {
  room: RoomDetail;
}

let refetchRoomUploadsHandler: null | (() => Promise<void>) = null;
const roomAccessSessionKey = (roomPublicId: string) => `room-access-token:${roomPublicId}`;

export async function refetchRoomUploads() {
  if (!refetchRoomUploadsHandler) {
    console.warn("[room] refetch handler is not available");
    return;
  }
  await refetchRoomUploadsHandler();
}

export default function RoomPage(props: RoomPageProps) {
  const t = useI18n();
  const [idParam] = useQueryState("id");
  const { setGameFocus } = useRoomActions();

  const { data: user } = useUser();
  const userId = user?.public_id ?? (idParam ? idParam.toString().slice(0, 32) : null);
  const displayName = formatDisplayName(user?.name);
  const { level } = useExperience(user?.xp ?? 0);
  const { characterKey } = useCharacterStore();
  const invisibleMode = useRoomUiStore((s) => s.invisibleMode);
  const skin = characterKey || "steve";
  const room = useRoomStore((s) => s.room);
  const { refetchRoomUploads: refetchRoomUploadsFromHook } = useRoomUploadImages(props.room.public_id);
  const sounds = useSounds();
  const [roomPassword, setRoomPassword] = useState("");
  const [roomPasswordError, setRoomPasswordError] = useState<string | null>(null);
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  const [checkingSavedAccessToken, setCheckingSavedAccessToken] = useState(!props.room.is_public);
  const [hasRoomAccess, setHasRoomAccess] = useState(props.room.is_public);
  const canMountGame = props.room.is_public || hasRoomAccess;

  useEffect(() => {
    if (props.room.is_public) {
      setHasRoomAccess(true);
      setCheckingSavedAccessToken(false);
      return;
    }

    let cancelled = false;
    setCheckingSavedAccessToken(true);
    setHasRoomAccess(false);

    const checkSavedToken = async () => {
      let storedToken: string | null = null;

      try {
        storedToken = window.sessionStorage.getItem(roomAccessSessionKey(props.room.public_id));
      } catch {
        storedToken = null;
      }

      if (!storedToken) {
        if (!cancelled) {
          setCheckingSavedAccessToken(false);
        }
        return;
      }

      try {
        const result = await verifyRoomAccessToken(props.room.public_id, storedToken);
        if (!cancelled) {
          setHasRoomAccess(Boolean(result.authorized));
        }
      } catch {
        try {
          window.sessionStorage.removeItem(roomAccessSessionKey(props.room.public_id));
        } catch {
          // Ignore storage failures.
        }
        if (!cancelled) {
          setHasRoomAccess(false);
        }
      } finally {
        if (!cancelled) {
          setCheckingSavedAccessToken(false);
        }
      }
    };

    void checkSavedToken();

    return () => {
      cancelled = true;
    };
  }, [props.room.is_public, props.room.public_id]);

  const handleRoomConnected = useCallback(() => {
    void sounds.play("join-room").then((played) => {
      if (!played) {
        sounds.armUnlockOnFirstInteraction();
      }
    });
  }, [sounds]);

  // Prepara fallback para tocar o som na primeira interacao do usuario.
  useEffect(() => {
    sounds.armUnlockOnFirstInteraction();
  }, [sounds]);

  // Sincroniza invisibilidade com a room em runtime (sem alterar profile/header).
  useEffect(() => {
    if (!room) return;
    room.send("set_ghost", {
      ghost: invisibleMode,
      skin,
    });
  }, [room, invisibleMode, skin]);

  useEffect(() => {
    if (!room) return;
    room.send("set_level", { level });
  }, [room, level]);

  const handleVerifyRoomPassword = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const password = roomPassword;

      if (!password || password.trim().length === 0) {
        setRoomPasswordError(t("room.page.passwordRequired"));
        return;
      }

      setVerifyingPassword(true);
      setRoomPasswordError(null);

      try {
        const result = await verifyRoomPassword(props.room.public_id, password);
        if (result.authorized) {
          const accessToken = result.accessToken;
          if (!accessToken) {
            throw new Error("Missing room access token");
          }

          setHasRoomAccess(true);
          setRoomPassword("");
          try {
            window.sessionStorage.setItem(roomAccessSessionKey(props.room.public_id), accessToken);
          } catch {
            // Ignore storage failures and proceed with in-memory access.
          }
        }
      } catch {
        setRoomPasswordError(t("room.page.passwordInvalid"));
      } finally {
        setVerifyingPassword(false);
      }
    },
    [props.room.public_id, roomPassword, t],
  );

  useEffect(() => {
    const previousTitle = document.title;
    const roomName = props.room.name?.trim() || "Room";
    document.title = `${roomName} | Scrum Poker`;

    return () => {
      document.title = previousTitle;
    };
  }, [props.room.name]);

  // Registra refetch automatico/manual para uploads associados a sala.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refetchRoomUploadsFromHook("after_10s");
    }, 10000);

    refetchRoomUploadsHandler = async () => {
      await refetchRoomUploadsFromHook("manual");
    };

    return () => {
      window.clearTimeout(timeoutId);
      refetchRoomUploadsHandler = null;
    };
  }, [refetchRoomUploadsFromHook]);

  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden relative">
      <div className="pointer-events-none absolute left-4 top-4 z-50 max-w-[55vw] truncate text-sm font-semibold text-slate-700 dark:text-white">
        <span className="text-slate-500 dark:text-slate-300">{t("room.page.roomLabel")}</span> {props.room.name}
      </div>
      {checkingSavedAccessToken ? (
        <div className="flex h-full w-full items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700/70 bg-slate-900/90 p-5 text-center shadow-2xl backdrop-blur-sm">
            <p className="text-sm text-slate-200">{t("room.page.checkingAccess")}</p>
          </div>
        </div>
      ) : canMountGame ? (
        <>
          <div
            className="w-full h-full"
            onClick={() => {
              setGameFocus(true);
            }}
          >
            <DynamicPhaserGame
              skin={skin}
              level={level}
              ghost={invisibleMode}
              userId={userId}
              displayName={displayName}
              roomPublicId={props.room.public_id}
              onRoomConnected={handleRoomConnected}
            />
          </div>
          <FocusReturnButton />
          <PlanningCard roomPublicId={props.room.public_id} votingScale={props.room.voting_scale} />
          <PingCard />
          <PlayerInfoCard />
          <NearbyPlayers />
          <InvisibilityCard />
          <ChatCard />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700/70 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-sm">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{t("room.page.privateBadge")}</p>
              <h2 className="text-lg font-semibold tracking-tight text-slate-100">{props.room.name}</h2>
              <p className="text-sm text-slate-300">{t("room.page.privateDescription")}</p>
            </div>

            <form className="mt-4 space-y-3" onSubmit={handleVerifyRoomPassword}>
              <div className="space-y-2">
                <label htmlFor="room-access-password" className="text-xs font-medium text-slate-300">
                  {t("room.page.passwordLabel")}
                </label>
                <Input
                  id="room-access-password"
                  type="password"
                  value={roomPassword}
                  onChange={(event) => setRoomPassword(event.target.value)}
                  placeholder={t("room.page.passwordPlaceholder")}
                  autoComplete="current-password"
                  className="border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-400"
                  disabled={verifyingPassword}
                />
              </div>

              {roomPasswordError ? <p className="text-sm text-rose-300">{roomPasswordError}</p> : null}

              <Button type="submit" className="w-full" disabled={verifyingPassword}>
                {verifyingPassword ? t("room.page.checking") : t("room.page.enterRoom")}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
