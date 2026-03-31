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
  initialWeightGrams: number;
  targetWeightGrams: number;
  items: BasketWeightItem[];
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

export interface DragOrderImagesGameData {
  type: "drag-order-images";
  text?: string;
  sourceImages: ImageOption[];
  correctOrder: string[];
  slotsCount: number;
  enforceOrder?: boolean;
}

export interface PhotosynthesisAtomsGameData {
  type: "photosynthesis-atoms";
  text: string;
}

export interface EnigmaGameData {
  type: "enigma";
  text: string;
  correctAnswer: string;
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
}

export interface Step {
  id: StepId;
  title: string;
  instruction: string;
  narrative?: string;
  location?: string;
  raftPiece?: RaftPieceId;
  backgroundImage?: string;
  backgroundHintZones?: BackgroundHintZone[];
  hint?: Hint;
  game: GameData;
}
