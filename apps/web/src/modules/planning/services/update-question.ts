import { api } from "@/modules/shared/http/api-client";

type UpdateQuestionInput = {
  roomPublicId: string;
  questionPublicId: string;
  is_active?: boolean;
  revealed?: boolean;
};

export async function updateQuestion(input: UpdateQuestionInput) {
  return api.patch(`rooms/${input.roomPublicId}/questions/${input.questionPublicId}`, {
    json: {
      is_active: input.is_active,
      revealed: input.revealed,
    },
  });
}
