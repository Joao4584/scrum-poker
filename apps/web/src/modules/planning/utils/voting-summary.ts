import { VotingScale } from "@/modules/shared/enums/voting-scale.enum";
import type { PlanningQuestion } from "../services/get-room-questions";

type VotingSummaryInput = {
  votingScale: VotingScale | string | null;
  voters: PlanningQuestion["voters"];
};

export type VotingSummary = {
  average: number | null;
  suggestedValue: number | null;
  closestVoters: PlanningQuestion["voters"];
};

const VOTING_SCALE_VALUES: Record<VotingScale, number[]> = {
  [VotingScale.FIBONACCI]: [1, 3, 5, 8, 13],
  [VotingScale.POWER_OF_2]: [2, 4, 8, 16],
};

function normalizeVotingScale(votingScale: VotingSummaryInput["votingScale"]): VotingScale | null {
  if (!votingScale) {
    return null;
  }

  const normalizedValue = votingScale.toString().trim().toLowerCase();

  if (normalizedValue === VotingScale.FIBONACCI) {
    return VotingScale.FIBONACCI;
  }

  if (normalizedValue === VotingScale.POWER_OF_2 || normalizedValue === "power_2" || normalizedValue === "powerof2") {
    return VotingScale.POWER_OF_2;
  }

  return null;
}

export function getVotingDeckValues(votingScale: VotingSummaryInput["votingScale"]): string[] {
  const normalizedScale = normalizeVotingScale(votingScale);

  if (!normalizedScale) {
    return [];
  }

  return VOTING_SCALE_VALUES[normalizedScale].map((value) => value.toString());
}

function parseVoteValue(value: string) {
  const normalizedValue = value.replace(",", ".").trim();
  const parsedValue = Number(normalizedValue);

  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return parsedValue;
}

export function getVotingSummary(input: VotingSummaryInput): VotingSummary {
  const normalizedScale = normalizeVotingScale(input.votingScale);
  const scaleValues = normalizedScale ? VOTING_SCALE_VALUES[normalizedScale] : null;

  const numericVotes = input.voters
    .map((voter) => ({
      voter,
      numericValue: parseVoteValue(voter.value),
    }))
    .filter((entry): entry is { voter: PlanningQuestion["voters"][number]; numericValue: number } => entry.numericValue !== null);

  if (numericVotes.length === 0) {
    return {
      average: null,
      suggestedValue: null,
      closestVoters: [],
    };
  }

  const totalVotes = numericVotes.reduce((total, entry) => total + entry.numericValue, 0);
  const average = totalVotes / numericVotes.length;
  const referenceValues = scaleValues?.length ? scaleValues : numericVotes.map((entry) => entry.numericValue);
  const suggestedValue = referenceValues.reduce((closestValue, currentValue) => {
    const closestDistance = Math.abs(closestValue - average);
    const currentDistance = Math.abs(currentValue - average);

    if (currentDistance < closestDistance) {
      return currentValue;
    }

    return closestValue;
  });
  const closestReference = suggestedValue ?? average;
  const smallestDistance = Math.min(...numericVotes.map((entry) => Math.abs(entry.numericValue - closestReference)));
  const closestVoters = numericVotes
    .filter((entry) => Math.abs(entry.numericValue - closestReference) === smallestDistance)
    .map((entry) => entry.voter);

  return {
    average,
    suggestedValue,
    closestVoters,
  };
}
