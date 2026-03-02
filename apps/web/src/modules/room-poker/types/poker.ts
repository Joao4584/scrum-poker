export type PokerVoteValue = string;

export type PokerQuestionSummary = {
  publicId: string;
  text: string;
  revealed: boolean;
  isActive: boolean;
  createdAt: string;
};

export type RoomPokerState = {
  roomPublicId: string;
  activeQuestion: PokerQuestionSummary | null;
  history: PokerQuestionSummary[];
};
