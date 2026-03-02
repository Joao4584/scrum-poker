import { useI18n } from "@/locales/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { VotingScale } from "@/modules/shared/enums/voting-scale.enum";
import { useUser } from "@/modules/profile/hooks/use-user";
import { useRoomPoker } from "../hooks/use-room-poker";
import { createQuestion } from "../services/create-question";
import { createVote } from "../services/create-vote";
import { deleteQuestion } from "../services/delete-question";
import type { PlanningQuestion } from "../services/get-room-questions";
import { updateQuestion } from "../services/update-question";
import { useRoomQuestions } from "../hooks/use-room-questions";
import { PokerPanelSkeleton } from "./poker-panel-skeleton";
import { QuestionComposer } from "./question-composer";
import { QuestionCard } from "./question-card";

type PokerPanelProps = {
  roomPublicId: string;
  votingScale: VotingScale | null;
};

export function PokerPanel(props: PokerPanelProps) {
  const t = useI18n();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const handleSocketSync = useCallback((payload: { questions?: PlanningQuestion[] }) => {
    if (payload.questions) {
      queryClient.setQueryData(["planning:questions", props.roomPublicId], payload.questions);
      return;
    }

    void queryClient.invalidateQueries({ queryKey: ["planning:questions", props.roomPublicId] });
  }, [props.roomPublicId, queryClient]);
  useRoomPoker({
    roomPublicId: props.roomPublicId,
    onSync: handleSocketSync,
  });
  const { data: questions, isLoading } = useRoomQuestions(props.roomPublicId);
  const createQuestionMutation = useMutation({
    mutationFn: (title: string) => createQuestion({ roomPublicId: props.roomPublicId, title }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["planning:questions", props.roomPublicId] });
    },
  });
  const finishQuestionMutation = useMutation({
    mutationFn: (questionPublicId: string) => updateQuestion({ roomPublicId: props.roomPublicId, questionPublicId, is_active: false, revealed: true }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["planning:questions", props.roomPublicId] });
    },
  });
  const deleteQuestionMutation = useMutation({
    mutationFn: (questionPublicId: string) => deleteQuestion({ roomPublicId: props.roomPublicId, questionPublicId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["planning:questions", props.roomPublicId] });
    },
  });
  const voteMutation = useMutation({
    mutationFn: ({ questionPublicId, value }: { questionPublicId: string; value: string }) => createVote({ questionPublicId, value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["planning:questions", props.roomPublicId] });
    },
  });
  const sortedQuestions = [...(questions ?? [])].sort((left, right) => {
    if (left.is_active !== right.is_active) {
      return left.is_active ? 1 : -1;
    }

    return new Date(left.created_at).getTime() - new Date(right.created_at).getTime();
  });
  const activeQuestion = sortedQuestions.find((question) => question.is_active) ?? null;

  if (isLoading) {
    return <PokerPanelSkeleton />;
  }

  return (
    <div className="space-y-3">
      {sortedQuestions.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/85 p-3.5 shadow-2xl backdrop-blur-sm">
          <p className="text-sm text-slate-300">{t("planning.panel.emptyQuestion")}</p>
        </div>
      ) : (
        <div className="max-h-[580px] space-y-2 overflow-y-auto pr-1">
          {sortedQuestions.map((question, index) => (
            <QuestionCard
              key={`${question.public_id}-${index}`}
              question={question}
              index={index}
              votingScale={props.votingScale}
              currentUserPublicId={user?.public_id ?? null}
              isDeleting={deleteQuestionMutation.isPending && deleteQuestionMutation.variables === question.public_id}
              isFinishing={finishQuestionMutation.isPending && finishQuestionMutation.variables === question.public_id}
              isVoting={voteMutation.isPending && voteMutation.variables?.questionPublicId === question.public_id}
              onVote={(questionPublicId, value) => voteMutation.mutate({ questionPublicId, value })}
              onDelete={(questionPublicId) => deleteQuestionMutation.mutate(questionPublicId)}
              onFinish={(questionPublicId) => finishQuestionMutation.mutate(questionPublicId)}
            />
          ))}
        </div>
      )}

      <QuestionComposer
        disabled={Boolean(activeQuestion)}
        isSubmitting={createQuestionMutation.isPending}
        onCreate={async (title) => {
          await createQuestionMutation.mutateAsync(title);
        }}
      />
    </div>
  );
}
