import { useI18n } from "@/locales/client";
import { useEffect, useRef } from "react";
import type { VotingScale } from "@/modules/shared/enums/voting-scale.enum";
import { usePlanningPanel } from "../../hooks/use-planning-panel";
import { PokerPanelSkeleton } from "./poker-panel-skeleton";
import { QuestionCard } from "../question-card/question-card";
import { QuestionComposer } from "../question-composer/question-composer";

type PokerPanelProps = {
  roomPublicId: string;
  votingScale: VotingScale | null;
};

export function PokerPanel(props: PokerPanelProps) {
  const t = useI18n();
  const listRef = useRef<HTMLDivElement | null>(null);
  const previousQuestionsCountRef = useRef(0);
  const planningPanel = usePlanningPanel({
    roomPublicId: props.roomPublicId,
  });

  useEffect(() => {
    const questionsCount = planningPanel.questions.length;
    const shouldScrollToBottom =
      questionsCount > 0 &&
      (previousQuestionsCountRef.current === 0 || questionsCount > previousQuestionsCountRef.current);

    if (shouldScrollToBottom && listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }

    previousQuestionsCountRef.current = questionsCount;
  }, [planningPanel.questions]);

  if (planningPanel.isLoading) {
    return <PokerPanelSkeleton />;
  }

  return (
    <div className="space-y-3">
      {planningPanel.questions.length === 0 ? (
        <div className="rounded-2xl border border-sky-200/80 bg-white/92 p-3.5 shadow-2xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/85">
          <p className="text-sm text-slate-600 dark:text-slate-300">{t("planning.panel.emptyQuestion")}</p>
        </div>
      ) : (
        <div ref={listRef} className="max-h-[480px] space-y-2 overflow-y-auto pr-1">
          {planningPanel.questions.map((question, index) => (
            <QuestionCard
              key={question.public_id}
              question={question}
              index={index}
              votingScale={props.votingScale}
              currentUserPublicId={planningPanel.currentUserPublicId}
              isDeleting={planningPanel.isDeletingQuestion(question.public_id)}
              isFinishing={planningPanel.isFinishingQuestion(question.public_id)}
              isVoting={planningPanel.isVotingQuestion(question.public_id)}
              isOpen={planningPanel.openQuestionPublicId === question.public_id}
              onOpenChange={(isOpen) => planningPanel.setOpenQuestionPublicId(isOpen ? question.public_id : null)}
              onVote={(questionPublicId, value) => planningPanel.vote({ questionPublicId, value })}
              onDelete={planningPanel.deleteQuestion}
              onFinish={planningPanel.finishQuestion}
            />
          ))}
        </div>
      )}

      <QuestionComposer
        disabled={Boolean(planningPanel.activeQuestion)}
        isSubmitting={planningPanel.isSubmittingQuestion}
        onCreate={planningPanel.createQuestion}
      />
    </div>
  );
}
