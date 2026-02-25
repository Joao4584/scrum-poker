import { useCallback, useRef } from "react";

type UseStartupBeepOptions = {
  enabled?: boolean;
  frequency?: number;
  durationMs?: number;
  volume?: number;
  variant?: "beep" | "achievement";
};

type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: typeof AudioContext;
};

// Hook para tocar um som curto de inicializacao com fallback para primeira interacao do usuario.
export function useStartupBeep(options?: UseStartupBeepOptions) {
  const playedRef = useRef(false);

  // Tenta tocar o som imediatamente; retorna false quando o navegador bloquear ou nao suportar audio.
  const playStartupBeep = useCallback(async () => {
    if (options?.enabled === false || playedRef.current) {
      return true;
    }

    if (typeof window === "undefined") {
      return false;
    }

    const windowAudio = window as WindowWithWebkitAudio;
    const AudioCtx = windowAudio.AudioContext ?? windowAudio.webkitAudioContext;
    if (!AudioCtx) {
      return false;
    }

    try {
      const audioContext = new AudioCtx();
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const now = audioContext.currentTime;
      const duration = (options?.durationMs ?? 160) / 1000;
      const frequency = options?.frequency ?? 820;
      const volume = options?.volume ?? 0.12;
      const variant = options?.variant ?? "beep";
      const gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);

      const scheduleTone = (startAt: number, toneDuration: number, toneFrequency: number, type: OscillatorType = "sine") => {
        const oscillator = audioContext.createOscillator();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(toneFrequency, startAt);
        oscillator.connect(gainNode);
        oscillator.start(startAt);
        oscillator.stop(startAt + toneDuration);
      };

      if (variant === "achievement") {
        const noteDuration = 0.12;
        const gap = 0.03;
        const n1 = now;
        const n2 = n1 + noteDuration + gap;
        const n3 = n2 + noteDuration + gap;
        const total = n3 + noteDuration - now;

        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.8), now + total * 0.7);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + total);

        scheduleTone(n1, noteDuration, 740, "triangle");
        scheduleTone(n2, noteDuration, 988, "triangle");
        scheduleTone(n3, noteDuration, 1318, "triangle");
      } else {
        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        scheduleTone(now, duration, frequency, "sine");
      }

      window.setTimeout(() => {
        void audioContext.close();
      }, 700);

      playedRef.current = true;
      return true;
    } catch {
      return false;
    }
  }, [options?.durationMs, options?.enabled, options?.frequency, options?.variant, options?.volume]);

  // Registra listeners de primeiro clique/tecla para destravar o audio quando necessario.
  const armStartupBeepOnFirstInteraction = useCallback(() => {
    if (typeof window === "undefined" || playedRef.current) {
      return;
    }

    const onFirstInteraction = () => {
      void playStartupBeep().finally(() => {
        window.removeEventListener("pointerdown", onFirstInteraction);
        window.removeEventListener("keydown", onFirstInteraction);
      });
    };

    window.addEventListener("pointerdown", onFirstInteraction, { once: true });
    window.addEventListener("keydown", onFirstInteraction, { once: true });
  }, [playStartupBeep]);

  return { playStartupBeep, armStartupBeepOnFirstInteraction };
}
