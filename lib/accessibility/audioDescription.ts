const isClient = typeof window !== "undefined";
const synth = isClient ? window.speechSynthesis : null;

export type AudioDescriptionSpeed = 0.5 | 1 | 1.5 | 2;

const RATE_MAP: Record<AudioDescriptionSpeed, number> = {
  0.5: 0.5,
  1: 1,
  1.5: 1.5,
  2: 2,
};

let currentRate: AudioDescriptionSpeed = 1;

let cachedVoices: SpeechSynthesisVoice[] = [];

function getVoices(): SpeechSynthesisVoice[] {
  if (!synth) return [];
  if (cachedVoices.length > 0) return cachedVoices;
  const voices = synth.getVoices();
  cachedVoices = voices;
  return voices;
}

if (isClient && synth) {
  if (synth.getVoices().length > 0) {
    cachedVoices = synth.getVoices();
  } else {
    synth.onvoiceschanged = () => {
      cachedVoices = synth.getVoices();
    };
  }
}

const NATURAL_KEYWORDS = [
  "natural",
  "online",
  "neural",
  "premium",
  "enhanced",
  "wavenet",
  "chirp",
  "neural2",
  "hd",
];

const LOW_QUALITY_KEYWORDS = [
  "compact",
  "x-low",
  "very low",
  "novelty",
  "sam",
  "bad news",
  "good news",
  "bahh",
  "bells",
  "boing",
  "bubbles",
  "cellos",
  "wobble",
];

function voiceQualityScore(v: SpeechSynthesisVoice): number {
  const name = (v.name ?? "").toLowerCase();
  if (LOW_QUALITY_KEYWORDS.some((k) => name.includes(k))) return -10;
  let score = 0;
  if (NATURAL_KEYWORDS.some((k) => name.includes(k))) score += 20;
  if (
    name.includes("microsoft") &&
    (name.includes("online") || name.includes("natural"))
  )
    score += 15;
  if (name.includes("google") && (name.includes("female") || name.includes("male") || name.includes("français")))
    score += 12;
  if (name.includes("denise") || name.includes("hortense") || name.includes("paul"))
    score += 10;
  if (v.default) score += 3;
  if (!v.localService) score += 2;
  if (v.lang === "fr-FR") score += 5;
  return score;
}

function selectFrenchVoice(): SpeechSynthesisVoice | null {
  const voices = getVoices();
  if (voices.length === 0) return null;

  const frVoices = voices.filter(
    (v) => v.lang === "fr-FR" || v.lang.toLowerCase().startsWith("fr"),
  );
  const candidates = frVoices.length > 0 ? frVoices : voices;

  const scored = candidates
    .map((v) => ({ voice: v, score: voiceQualityScore(v) }))
    .sort((a, b) => b.score - a.score);

  const best = scored.find(({ score }) => score >= 0);
  if (best) return best.voice;
  if (candidates.length > 0) return candidates[0];
  return voices.find((v) => v.default) ?? voices[0] ?? null;
}

export function isAudioDescriptionSupported(): boolean {
  return Boolean(synth);
}

export function speak(
  text: string,
  options?: { rate?: AudioDescriptionSpeed; onEnd?: () => void },
): void {
  if (!synth || !text.trim()) {
    options?.onEnd?.();
    return;
  }
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text.trim());
  const voice = selectFrenchVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = "fr-FR";
  utterance.rate = options?.rate != null ? RATE_MAP[options.rate] : RATE_MAP[currentRate];
  if (options?.onEnd) {
    utterance.onend = options.onEnd;
    utterance.onerror = options.onEnd;
  }
  try {
    synth.speak(utterance);
  } catch {
    options?.onEnd?.();
  }
}

export function pause(): void {
  if (synth) synth.pause();
}

export function resume(): void {
  if (synth) synth.resume();
}

export function cancel(): void {
  if (synth) synth.cancel();
}

export function setRate(rate: AudioDescriptionSpeed): void {
  currentRate = rate;
}

export function isSpeaking(): boolean {
  return Boolean(synth?.speaking);
}

export function isPaused(): boolean {
  return Boolean(synth?.paused);
}
