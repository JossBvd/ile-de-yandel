"use client";

import React from "react";

const MAIN_CONTENT_ID = "main-content";

export function SkipLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="fixed left-4 top-4 z-[9999] rounded px-4 py-3 bg-orange-500 text-white font-semibold -translate-y-[200%] focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 transition-transform duration-150"
    >
      Aller au contenu principal
    </a>
  );
}

export { MAIN_CONTENT_ID };
