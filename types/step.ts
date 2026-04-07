import { ReactNode } from "react";

export type StepId = string;
export type RaftPieceId = string;

export type GameType =
  | "qcm"
  | "drag-sort"
  | "drag-select-image"
  | "drag-order-images"
  | "basket-fill"
  | "basket-weight"
  | "bottle-empty"
  | "image-click"
  | "enigma"
  | "photosynthesis-atoms"
  | "point-click-multi-enigma";

export interface Hint {
  text?: string;
  visualHighlight?: string;
  simplifiedInstruction?: string;
  image?: string;
  readAloudText?: string;
}

export interface QCMOption {
  id: string;
  text: string;
}

export interface SortableItem {
  id: string;
  content: string | ReactNode;
  image?: string;
}

export interface ImageOption {
  id: string;
  src: string;
  alt: string;
  info?: string;
  infoImage?: string;
  readAloudText?: string;
}

export interface BasketItem {
  id: string;
  label: string;
  image?: string;
}

export interface BottleItem {
  id: string;
  content: string | ReactNode;
}

export interface ClickableZone {
  type: "circle" | "rectangle";
  x: number;
  y: number;
  radius?: number;
  width?: number;
  height?: number;
}

export interface QCMGameData {
  type: "qcm";
  question: string;
  options: QCMOption[];
  correctAnswers: number[];
  /** Sélection puis bouton Valider (ex. mission 1 step 2, mission 4 step 1). */
  twoStepValidation?: boolean;
  /** Ajuste ligne hauteur / marge question sur desktop (questions longues). */
  tightDesktopQuestionLayout?: boolean;
}

export interface DragSortGameData {
  type: "drag-sort";
  items: SortableItem[];
  correctOrder: string[];
}

export interface DragSelectImageGameData {
  type: "drag-select-image";
  text?: string;
  images: ImageOption[];
  correctImages: string[];
  maxSelections?: number;
}

export interface BasketFillGameData {
  type: "basket-fill";
  items: BasketItem[];
  correctItems: string[];
}

export interface BasketWeightItem {
  id: string;
  src: string;
  alt: string;
  weightGrams: number;
  maxUses?: number;
}

export interface BasketWeightGameData {
  type: "basket-weight";
  text?: string;
  basketImages: string[];
  overflowImage?: string;
  initialWeightGrams: number;
  targetWeightGrams: number;
  items: BasketWeightItem[];
  measurementUnit?: "grams" | "centiliters";
  resetButtonLabel?: string;
}

export interface BottleEmptyGameData {
  type: "bottle-empty";
  items: BottleItem[];
  correctOrder: string[];
}

export interface ImageClickGameData {
  type: "image-click";
  image: string;
  clickableZones: ClickableZone[];
}

export type DragOrderLayoutVariant =
  | "standard"
  | "compact-source"
  | "grid-5-cols";

export interface DragOrderImagesGameData {
  type: "drag-order-images";
  text?: string;
  sourceImages: ImageOption[];
  correctOrder: string[];
  slotsCount: number;
  enforceOrder?: boolean;
  layoutVariant?: DragOrderLayoutVariant;
}

export type PhotosynthesisRecipeKey = "water" | "co2" | "light";

export interface PhotosynthesisAtomConfig {
  id: string;
  src: string;
  alt: string;
}

export interface PhotosynthesisRecipeConfig {
  key: PhotosynthesisRecipeKey;
  label: string;
  speech: string;
  atomCounts: Record<string, number>;
}

export interface PhotosynthesisInspectTarget {
  top: string;
  left: string;
  image: string;
  readAloudText?: string;
}

export interface PhotosynthesisBarTexts {
  fusion: string;
  fusionSpeech: string;
  inspect: string;
  inspectSpeech: string;
}

export interface PhotosynthesisUiAssets {
  targetIconSrc: string;
}

export interface PhotosynthesisAtomsGameData {
  type: "photosynthesis-atoms";
  text: string;
  atoms: PhotosynthesisAtomConfig[];
  recipes: PhotosynthesisRecipeConfig[];
  inspectTargets: PhotosynthesisInspectTarget[];
  ui: PhotosynthesisUiAssets;
  bar: PhotosynthesisBarTexts;
}

export type EnigmaLayout = "inline" | "stacked" | "letter-decode";

export interface EnigmaGameData {
  type: "enigma";
  text: string;
  correctAnswer: string;
  layout?: EnigmaLayout;
  decodeLetterImages?: string[];
}

export interface PointClickMultiEnigmaTarget {
  x: number;
  y: number;
  image: string;
  readAloudText?: string;
}

export interface PointClickMultiEnigmaGameData {
  type: "point-click-multi-enigma";
  question: string;
  correctAnswers: string[];
  targets: PointClickMultiEnigmaTarget[];
  targetIconSrc: string;
}

export type GameData =
  | QCMGameData
  | DragSortGameData
  | DragSelectImageGameData
  | DragOrderImagesGameData
  | BasketFillGameData
  | BasketWeightGameData
  | BottleEmptyGameData
  | ImageClickGameData
  | EnigmaGameData
  | PhotosynthesisAtomsGameData
  | PointClickMultiEnigmaGameData;

export interface BackgroundHintZone {
  x: number;
  y: number;
  radius: number;
  hint: string;
  title?: string;
  image?: string;
  icon?: string;
  readAloudText?: string;
}

export interface StepRaftObject {
  image: string;
  readAloudText?: string;
}

export interface StepCompletionFlags {
  showMissionModalAfterStep?: boolean;
}

export interface StepUiConfig {
  instructionInspectToggle?: boolean;
  inspectLoupeIcon?: string;
}

export interface Step {
  id: StepId;
  title: string;
  instruction: string;
  narrative?: string;
  location?: string;
  raftPiece?: RaftPieceId;
  raftObject?: StepRaftObject;
  completion?: StepCompletionFlags;
  ui?: StepUiConfig;
  backgroundImage?: string;
  backgroundHintZones?: BackgroundHintZone[];
  hint?: Hint;
  game: GameData;
}
