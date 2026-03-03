import { useState } from "react";
import { useI18n } from "@/locales/client";
import { Button } from "@/modules/shared/ui/button";
import { Input } from "@/modules/shared/ui/input";
import { cn } from "@/modules/shared/utils/cn";
import { Loader2, Plus, X } from "lucide-react";
import { useRoomActions } from "@/modules/room/hooks/use-room-actions";

type QuestionComposerProps = {
  disabled: boolean;
  isSubmitting: boolean;
  onCreate: (title: string) => Promise<void>;
};

export function QuestionComposer(props: QuestionComposerProps) {
  const t = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const { setGameFocus } = useRoomActions();

  const handleClose = () => {
    setGameFocus(true);
    setIsOpen(false);
    setTitle("");
  };

  const handleSubmit = async () => {
    const normalizedTitle = title.trim();

    if (!normalizedTitle || props.isSubmitting) {
      return;
    }

    await props.onCreate(normalizedTitle);
    handleClose();
  };

  if (!isOpen) {
    return (
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          className="rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400"
          disabled={props.disabled}
          onClick={() => {
            setGameFocus(false);
            setIsOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          {t("planning.panel.actions.newQuestion")}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-sky-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(226,232,240,0.95))] p-3 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))]",
        props.disabled && "opacity-70",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{t("planning.panel.composer.title")}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t("planning.panel.composer.description")}</p>
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-3 space-y-3">
        <Input
          autoFocus
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={t("planning.panel.composer.placeholder")}
          className="h-10 rounded-xl border-slate-300 bg-white/85 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500"
          maxLength={140}
          onFocus={() => setGameFocus(false)}
          onBlur={() => setGameFocus(true)}
          onKeyDownCapture={(event) => {
            event.stopPropagation();
            event.nativeEvent.stopImmediatePropagation();
          }}
        />

        {props.disabled ? <p className="text-xs text-amber-700 dark:text-amber-300">{t("planning.panel.composer.locked")}</p> : null}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={handleClose}
          >
            {t("planning.panel.actions.cancel")}
          </Button>
          <Button
            type="button"
            size="sm"
            className="rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400"
            disabled={props.disabled || !title.trim() || props.isSubmitting}
            onClick={() => void handleSubmit()}
          >
            {props.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {t("planning.panel.actions.create")}
          </Button>
        </div>
      </div>
    </div>
  );
}
