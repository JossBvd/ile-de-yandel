import { STORAGE_KEY_PLAYER_PSEUDO, STORAGE_KEY_PWA_INSTALL_DISMISSED } from "@/lib/constants";
import { resetGameSession } from "@/lib/resetGameSession";
import { useGameStore } from "@/store/gameStore";
import { useHintStore } from "@/store/hintStore";

describe("resetGameSession", () => {
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(function (this: Storage, key: string) {
      if (this === sessionStorage) return storage[key] ?? null;
      return null;
    });
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key: string, value: string) {
      if (this === sessionStorage) storage[key] = value;
    });
    jest.spyOn(Storage.prototype, "removeItem").mockImplementation(function (this: Storage, key: string) {
      if (this === sessionStorage) delete storage[key];
    });
    jest.spyOn(Storage.prototype, "clear").mockImplementation(function (this: Storage) {
      if (this === sessionStorage) storage = {};
    });

    useGameStore.getState().reset();
    useHintStore.getState().reset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("remet à zéro les stores et supprime les clés sessionStorage hors persist", () => {
    useGameStore.getState().completeStep("mission-1-step-1");
    useHintStore.getState().markHintAsUsed("mission-1-step-1");
    sessionStorage.setItem(STORAGE_KEY_PLAYER_PSEUDO, "TestJoueur");
    sessionStorage.setItem(STORAGE_KEY_PWA_INSTALL_DISMISSED, "1");

    resetGameSession();

    expect(useGameStore.getState().completedSteps).toEqual([]);
    expect(useHintStore.getState().usedHints).toEqual([]);
    expect(sessionStorage.getItem(STORAGE_KEY_PLAYER_PSEUDO)).toBeNull();
    expect(sessionStorage.getItem(STORAGE_KEY_PWA_INSTALL_DISMISSED)).toBeNull();
  });
});
