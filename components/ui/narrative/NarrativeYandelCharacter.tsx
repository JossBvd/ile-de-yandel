"use client";

import Image from "next/image";

interface NarrativeYandelCharacterProps {
  yandelWidth: string;
}

export function NarrativeYandelCharacter({
  yandelWidth,
}: NarrativeYandelCharacterProps) {
  return (
    <div
      className="absolute bottom-0 left-0"
      style={{ width: yandelWidth, height: "100%" }}
    >
      <Image
        src="/intro/yandel_full_cropped.webp"
        alt="Yandel, le personnage principal"
        fill
        sizes="40vw"
        className="object-contain object-bottom"
        priority
      />
    </div>
  );
}
