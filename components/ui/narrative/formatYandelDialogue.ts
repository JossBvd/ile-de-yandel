/** Encadre le texte avec des guillemets français si ce n’est pas déjà le cas (voix de Yandel). */
export function formatYandelDialogue(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("«") && trimmed.endsWith("»")) {
    return trimmed;
  }
  return `« ${trimmed} »`;
}
