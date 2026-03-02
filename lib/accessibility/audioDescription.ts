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

function selectFrenchVoice(): SpeechSynthesisVoice | null {
  const voices = getVoices();
  const fr =
    voices.find((v) => v.lang === "fr-FR") ??
    voices.find((v) => v.lang.startsWith("fr"));
  return fr ?? voices.find((v) => v.default) ?? voices[0] ?? null;
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
