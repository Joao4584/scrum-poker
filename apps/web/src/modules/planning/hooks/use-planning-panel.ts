import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@/modules/profile/hooks/use-user";
import { createQuestion } from "../services/create-question";
import { createVote } from "../services/create-vote";
import { deleteQuestion } from "../services/delete-question";
import type { PlanningQuestion } from "../services/get-room-questions";
import { updateQuestion } from "../services/update-question";
import { useRoomPoker } from "./use-room-poker";
import { useRoomQuestions } from "./use-room-questions";

type UsePlanningPanelParams = {
  roomPublicId: string;
};

function sortQuestions(questions: PlanningQuestion[]) {
  return [...questions].sort((left, right) => {
    if (left.is_active !== right.is_active) {
      return left.is_active ? 1 : -1;
    }

    return new Date(left.created_at).getTime() - new Date(right.created_at).getTime();
  });
}

export function usePlanningPanel({ roomPublicId }: UsePlanningPanelParams) {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const [openQuestionPublicId, setOpenQuestionPublicId] = useState<string | null>(null);

  const handleSocketSync = useCallback(
    (payload: { questions?: PlanningQuestion[] }) => {
      if (payload.questions) {
        queryClient.setQueryData(["planning:questions", roomPublicId], payload.questions);
        return;
      }

      void queryClient.invalidateQueries({ queryKey: ["planning:questions", roomPublicId] });
    },
    [queryClient, roomPublicId],
  );

  useRoomPoker({
    roomPublicId,
    onSync: handleSocketSync,
  });

  const { data: questions, isLoading } = useRoomQuestions(roomPublicId);

  const createQuestionMutation = useMutation({
    mutationFn: (title: string) => createQuestion({ roomPublicId, title }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["planning:questions", roomPublicId] });
    },
  });

  const finishQuestionMutation = useMutation({
    mutationFn: (questionPublicId: string) => updateQuestion({ roomPublicId, questionPublicId, is_active: false, revealed: true }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["planning:questions", roomPublicId] });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionPublicId: string) => deleteQuestion({ roomPublicId, questionPublicId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["planning:questions", roomPublicId] });
    },
  });

  const voteMutation = useMutation({
    mutationFn: ({ questionPublicId, value }: { questionPublicId: string; value: string }) => createVote({ questionPublicId, value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["planning:questions", roomPublicId] });
    },
  });

  const sortedQuestions = useMemo(() => sortQuestions(questions ?? []), [questions]);
  const activeQuestion = useMemo(
    () => sortedQuestions.find((question) => question.is_active) ?? null,
    [sortedQuestions],
  );

  useEffect(() => {
    if (!openQuestionPublicId) {
      return;
    }

    const hasOpenQuestion = sortedQuestions.some((question) => question.public_id === openQuestionPublicId);

    if (!hasOpenQuestion) {
      setOpenQuestionPublicId(null);
    }
  }, [openQuestionPublicId, sortedQuestions]);

  return {
    activeQuestion,
    currentUserPublicId: user?.public_id ?? null,
    isLoading,
    isSubmittingQuestion: createQuestionMutation.isPending,
    openQuestionPublicId,
    questions: sortedQuestions,
    setOpenQuestionPublicId,
    createQuestion: createQuestionMutation.mutateAsync,
    deleteQuestion: deleteQuestionMutation.mutate,
    finishQuestion: finishQuestionMutation.mutate,
    vote: voteMutation.mutate,
    isDeletingQuestion(questionPublicId: string) {
      return deleteQuestionMutation.isPending && deleteQuestionMutation.variables === questionPublicId;
    },
    isFinishingQuestion(questionPublicId: string) {
      return finishQuestionMutation.isPending && finishQuestionMutation.variables === questionPublicId;
    },
    isVotingQuestion(questionPublicId: string) {
      return voteMutation.isPending && voteMutation.variables?.questionPublicId === questionPublicId;
    },
  };
}
