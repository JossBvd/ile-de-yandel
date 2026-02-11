"use client";

import React from "react";
import Image from "next/image";

interface StepBackgroundProps {
  imageSrc: string;
  children?: React.ReactNode;
  objectFit?: "contain" | "cover";
}

export function StepBackground({
  imageSrc,
  children,
  objectFit = "cover",
}: StepBackgroundProps) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={imageSrc}
        alt="Fond du step"
        fill
        className={`object-${objectFit} pointer-events-none`}
        priority
      />
      {children}
    </div>
  );
}
