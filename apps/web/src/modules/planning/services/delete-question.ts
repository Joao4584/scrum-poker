import { api } from "@/modules/shared/http/api-client";

type DeleteQuestionInput = {
  roomPublicId: string;
  questionPublicId: string;
};

export async function deleteQuestion(input: DeleteQuestionInput) {
  return api.delete(`rooms/${input.roomPublicId}/questions/${input.questionPublicId}`);
}
