"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_TYPING_SPEED_MS = 30;

export function useNarrativeTypewriter(
  text: string,
  speedMs = DEFAULT_TYPING_SPEED_MS,
) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charIndexRef = useRef(0);

  useEffect(() => {
    charIndexRef.current = 0;
    setDisplayedText("");
    setIsTyping(true);

    function typeNextChar() {
      if (charIndexRef.current < text.length) {
        charIndexRef.current += 1;
        setDisplayedText(text.slice(0, charIndexRef.current));
        timeoutRef.current = setTimeout(typeNextChar, speedMs);
      } else {
        setIsTyping(false);
      }
    }

    timeoutRef.current = setTimeout(typeNextChar, speedMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speedMs]);

  const revealAll = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDisplayedText(text);
    setIsTyping(false);
  }, [text]);

  return { displayedText, isTyping, revealAll };
}
