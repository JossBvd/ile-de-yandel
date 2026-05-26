import { formatYandelDialogue } from "../formatYandelDialogue";

describe("formatYandelDialogue", () => {
  it("ajoute les guillemets français", () => {
    expect(formatYandelDialogue("Bonjour aventurier")).toBe(
      "« Bonjour aventurier »",
    );
  });

  it("ne double pas les guillemets déjà présents", () => {
    expect(formatYandelDialogue("« Déjà formaté »")).toBe("« Déjà formaté »");
  });

  it("retourne une chaîne vide inchangée", () => {
    expect(formatYandelDialogue("   ")).toBe("");
  });
});
