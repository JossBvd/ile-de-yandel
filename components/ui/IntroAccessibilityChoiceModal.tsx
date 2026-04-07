"use client";

interface IntroAccessibilityChoiceModalProps {
  isOpen: boolean;
  acronym: "AD" | "DYS";
  question: string;
  onYes: () => void;
  onNo: () => void;
}

export function IntroAccessibilityChoiceModal({
  isOpen,
  acronym,
  question,
  onYes,
  onNo,
}: IntroAccessibilityChoiceModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label={question}
    >
      <div
        className="w-[min(90vw,680px)] max-w-[680px] px-6 py-8 md:py-10"
        style={{
          backgroundImage: "url(/backgrounds/paper_texture.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col items-center gap-6">
          <h2
            className="font-display text-gray-900 text-center"
            style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
          >
            {acronym}
          </h2>

          <p
            className="font-display text-gray-900 text-center"
            style={{ fontSize: "clamp(1.25rem, 2.8vw, 2rem)" }}
          >
            {question}
          </p>

          <div className="flex items-center justify-center gap-10 w-full">
            <button
              type="button"
              onClick={onYes}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-colors min-h-[48px] min-w-[120px] px-8 py-2 touch-manipulation"
              aria-label="Oui"
            >
              OUI
            </button>
            <button
              type="button"
              onClick={onNo}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-colors min-h-[48px] min-w-[120px] px-8 py-2 touch-manipulation"
              aria-label="Non"
            >
              NON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
