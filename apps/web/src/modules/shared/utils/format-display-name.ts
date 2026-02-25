// Formata o nome para exibicao curta na interface (ate 2 palavras e com truncamento seguro).
export function formatDisplayName(name?: string | null) {
  if (!name) return null;

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return null;

  const shortName = parts.slice(0, 2).join(" ");
  const maxLength = 20;

  if (shortName.length <= maxLength) return shortName;

  return `${shortName.slice(0, maxLength - 3).trimEnd()}...`;
}
