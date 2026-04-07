"use client";

import { useEffect } from "react";
import { useReadingAidStore } from "@/store/readingAidStore";

export function ReadingAidEffect() {
  const { readingAidEnabled } = useReadingAidStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("reading-aid-enabled", readingAidEnabled);
  }, [readingAidEnabled]);

  return null;
}
