import { api } from "@/modules/shared/http/api-client";

type CreateQuestionInput = {
  roomPublicId: string;
  title: string;
};

export async function createQuestion(input: CreateQuestionInput) {
  return api.post(`rooms/${input.roomPublicId}/questions`, {
    json: {
      title: input.title,
    },
  }).json();
}
