import { api } from "@/modules/shared/http/api-client";

type CreateVoteInput = {
  questionPublicId: string;
  value: string;
};

export async function createVote(input: CreateVoteInput) {
  return api.post(`questions/${input.questionPublicId}/votes`, {
    json: {
      value: input.value,
    },
  }).json();
}
