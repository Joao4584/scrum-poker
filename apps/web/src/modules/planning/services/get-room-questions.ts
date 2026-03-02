import { api } from "@/modules/shared/http/api-client";

export type PlanningQuestion = {
  public_id: string;
  text: string;
  revealed: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  votes_count: number;
  voters: Array<{
    public_id: string;
    name: string;
    avatar_url: string | null;
    value: string;
    voted_at: string;
  }>;
};

export async function getRoomQuestions(roomPublicId: string): Promise<PlanningQuestion[]> {
  return api.get(`rooms/${roomPublicId}/questions`).json<PlanningQuestion[]>();
}
