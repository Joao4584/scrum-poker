"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Send, Trash2 } from "lucide-react";
import { useI18n } from "@/locales/client";
import { toast } from "sonner";
import { Button } from "@/modules/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/ui/dialog";
import { Input } from "@/modules/shared/ui/input";
import { Label } from "@/modules/shared/ui/label";
import { createSupportRequest } from "@/modules/dashboard/services/create-support-request";
import { getSupportRequests } from "@/modules/dashboard/services/get-support-requests";
import { deleteSupportRequest } from "@/modules/dashboard/services/delete-support-request";

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

const FEEDBACK_RATINGS = [
  { value: 1, emoji: "😡" },
  { value: 2, emoji: "🙁" },
  { value: 3, emoji: "😐" },
  { value: 4, emoji: "🙂" },
  { value: 5, emoji: "😍" },
] as const;

export function SupportDialog({ open, onOpenChange }: SupportDialogProps) {
  const t = useI18n();
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(4);

  const supportQuery = useQuery({
    queryKey: ["support:requests"],
    queryFn: getSupportRequests,
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: createSupportRequest,
    onSuccess: () => {
      setSubject("");
      setMessage("");
      setRating(4);
      toast(t("dashboard.feedback.toasts.successTitle"), {
        description: t("dashboard.feedback.toasts.successDescription"),
      });
      queryClient.invalidateQueries({ queryKey: ["support:requests"] });
    },
    onError: () => {
      toast(t("dashboard.feedback.toasts.errorTitle"), {
        description: t("dashboard.feedback.toasts.errorDescription"),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSupportRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support:requests"] });
    },
    onError: () => {
      toast(t("dashboard.feedback.toasts.removeErrorTitle"), {
        description: t("dashboard.feedback.toasts.removeErrorDescription"),
      });
    },
  });

  const canSubmit = subject.trim().length >= 3 && message.trim().length >= 10;

  const handleSubmit = () => {
    if (!canSubmit || createMutation.isPending) return;
    createMutation.mutate({
      subject: subject.trim(),
      message: message.trim(),
      rating,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden p-0">
        <div className="h-24 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500" />
        <div className="space-y-4 p-6 pt-0">
          <DialogHeader className="-mt-10 rounded-2xl border bg-card p-4 shadow-sm">
            <DialogTitle className="text-xl">{t("dashboard.feedback.dialog.title")}</DialogTitle>
            <DialogDescription>
              {t("dashboard.feedback.dialog.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="support-subject">{t("dashboard.feedback.form.subjectLabel")}</Label>
              <Input
                id="support-subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                maxLength={120}
                placeholder={t("dashboard.feedback.form.subjectPlaceholder")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="support-message">{t("dashboard.feedback.form.messageLabel")}</Label>
              <textarea
                id="support-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={2000}
                rows={5}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder={t("dashboard.feedback.form.messagePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("dashboard.feedback.form.ratingLabel")}</Label>
              <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 p-2">
                {FEEDBACK_RATINGS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRating(option.value)}
                    className={`flex w-full flex-col items-center rounded-md px-2 py-1 text-xs transition ${
                      rating === option.value ? "bg-primary/20 ring-1 ring-primary" : "hover:bg-accent"
                    }`}
                    aria-label={t(`dashboard.feedback.form.ratings.${option.value}`)}
                  >
                    <span className="text-lg leading-none">{option.emoji}</span>
                    <span className="mt-1">{option.value}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("dashboard.feedback.form.actions.close")}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("dashboard.feedback.form.actions.sending")}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t("dashboard.feedback.form.actions.submit")}
                </>
              )}
            </Button>
          </DialogFooter>
          <div className="space-y-2 rounded-xl border p-3">
            <p className="text-sm font-medium">{t("dashboard.feedback.history.title")}</p>
            <div className="max-h-52 space-y-2 overflow-y-auto">
              {supportQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">{t("dashboard.feedback.history.loading")}</p>
              ) : null}
              {!supportQuery.isLoading && (supportQuery.data?.data.length ?? 0) === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("dashboard.feedback.history.empty")}
                </p>
              ) : null}
              {supportQuery.data?.data.map((item) => (
                <div
                  key={item.public_id}
                  className="rounded-lg border border-border bg-muted/30 p-3"
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{item.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("dashboard.feedback.history.rating", { rating: item.rating })}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      disabled={deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(item.public_id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
