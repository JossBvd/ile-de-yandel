const LIVE_REGION_ID = "aria-announcer-live";
const ASSERTIVE_REGION_ID = "aria-announcer-assertive";

function getOrCreateRegion(
  id: string,
  priority: "polite" | "assertive",
): HTMLDivElement {
  if (typeof document === "undefined") return null as unknown as HTMLDivElement;
  let el = document.getElementById(id) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.setAttribute("aria-live", priority);
    el.setAttribute("aria-atomic", "true");
    el.className = "sr-only";
    Object.assign(el.style, {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0,0,0,0)",
      whiteSpace: "nowrap",
      border: "0",
    });
    document.body.appendChild(el);
  }
  return el;
}

export function announce(message: string, options?: { priority?: "polite" | "assertive" }): void {
  const priority = options?.priority ?? "polite";
  const id = priority === "assertive" ? ASSERTIVE_REGION_ID : LIVE_REGION_ID;
  const el = getOrCreateRegion(id, priority);
  if (!el) return;
  el.textContent = "";
  requestAnimationFrame(() => {
    el.textContent = message;
  });
}
