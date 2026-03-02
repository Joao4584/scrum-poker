import { useI18n } from "@/locales/client";
import { Button } from "@/modules/shared/ui/button";
import { Check, Loader2, Trash2 } from "lucide-react";

type QuestionCardActionsProps = {
  canManage: boolean;
  isDeleting: boolean;
  isFinishing: boolean;
  onDelete: () => void;
  onFinish: () => void;
};

export function QuestionCardActions(props: QuestionCardActionsProps) {
  const t = useI18n();

  if (!props.canManage) {
    return null;
  }

  return (
    <div className="flex justify-end gap-2 border-t border-slate-800/80 pt-2">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="rounded-xl text-rose-200 hover:bg-rose-500/10 hover:text-rose-100"
        disabled={props.isDeleting || props.isFinishing}
        onClick={props.onDelete}
      >
        {props.isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        {t("planning.panel.actions.delete")}
      </Button>
      <Button
        type="button"
        size="sm"
        className="rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400"
        disabled={props.isDeleting || props.isFinishing}
        onClick={props.onFinish}
      >
        {props.isFinishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        {t("planning.panel.actions.finish")}
      </Button>
    </div>
  );
}
