import { ReactNode } from "react";

export type StepId = string;
export type RaftPieceId = string;

export type GameType =
  | "qcm"
  | "drag-sort"
  | "drag-select-image"
  | "drag-order-images"
  | "basket-fill"
  | "bottle-empty"
  | "image-click"
  | "enigma";

export interface Hint {
  text?: string;
  visualHighlight?: string;
  simplifiedInstruction?: string;
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
  /** URL d'une image à afficher en modal au clic sur le bouton info (remplace la modal texte) */
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

// Données de jeu par type
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
  images: ImageOption[];
  correctImages: string[];
}

export interface BasketFillGameData {
  type: "basket-fill";
  items: BasketItem[];
  correctItems: string[];
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
}

/** Énigme : texte + champ de réponse + bouton Envoyer */
export interface EnigmaGameData {
  type: "enigma";
  /** Énoncé de l'énigme affiché dans le panneau */
  text: string;
  /** Réponse correcte (insensible à la casse) */
  correctAnswer: string;
}

export type GameData =
  | QCMGameData
  | DragSortGameData
  | DragSelectImageGameData
  | DragOrderImagesGameData
  | BasketFillGameData
  | BottleEmptyGameData
  | ImageClickGameData
  | EnigmaGameData;

/** Zone cliquable sur le fond (image de step) : affiche un indice au clic. x, y, radius en % (0-100). */
export interface BackgroundHintZone {
  x: number;
  y: number;
  radius: number;
  /** Texte de l'indice (description de l'objet). */
  hint: string;
  /** Titre affiché sur le parchemin (ex. "objet"). */
  title?: string;
  /** URL de l'image illustrant l'objet (optionnel). */
  image?: string;
}

/** Step = un mini-jeu complet. */
export interface Step {
  id: StepId;
  title: string;
  instruction: string;
  narrative?: string;
  location?: string;
  raftPiece?: RaftPieceId;
  backgroundImage?: string;
  /** Zones cliquables sur le fond : clic = afficher l'indice (modal). */
  backgroundHintZones?: BackgroundHintZone[];
  hint?: Hint;
  game: GameData;
}
