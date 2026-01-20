import { StepId } from "./mission";
import { ReactNode } from "react";

export type StepType =
  | "qcm"
  | "drag-sort"
  | "drag-select-image"
  | "basket-fill"
  | "bottle-empty"
  | "image-click";

export interface BaseStep {
  id: StepId;
  type: StepType;
  title: string;
  instruction: string;
  hint?: Hint;
}

export interface Hint {
  text?: string;
  visualHighlight?: string;
  simplifiedInstruction?: string;
}

export interface QCMStep extends BaseStep {
  type: "qcm";
  question: string;
  options: QCMOption[];
  correctAnswers: number[]; // indices des bonnes réponses (peut être un seul élément pour QCM simple)
}

export interface QCMOption {
  id: string;
  text: string;
}

export interface DragSortStep extends BaseStep {
  type: "drag-sort";
  items: SortableItem[];
  correctOrder: string[]; // IDs dans l'ordre correct
}

export interface SortableItem {
  id: string;
  content: string | ReactNode;
  image?: string;
}

export interface DragSelectImageStep extends BaseStep {
  type: "drag-select-image";
  images: ImageOption[];
  correctImages: string[]; // IDs des images correctes
}

export interface ImageOption {
  id: string;
  src: string;
  alt: string;
}

export interface BasketFillStep extends BaseStep {
  type: "basket-fill";
  items: BasketItem[];
  correctItems: string[]; // IDs des items à mettre dans le panier
}

export interface BasketItem {
  id: string;
  label: string;
  image?: string;
}

export interface BottleEmptyStep extends BaseStep {
  type: "bottle-empty";
  items: BottleItem[];
  correctOrder: string[]; // IDs dans l'ordre de vidage
}

export interface BottleItem {
  id: string;
  content: string | ReactNode;
}

export interface ImageClickStep extends BaseStep {
  type: "image-click";
  image: string;
  clickableZone: ClickableZone;
}

export interface ClickableZone {
  type: "circle" | "rectangle";
  x: number; // coordonnée X (en % ou px)
  y: number; // coordonnée Y (en % ou px)
  radius?: number; // pour type 'circle'
  width?: number; // pour type 'rectangle'
  height?: number; // pour type 'rectangle'
}

export type Step =
  | QCMStep
  | DragSortStep
  | DragSelectImageStep
  | BasketFillStep
  | BottleEmptyStep
  | ImageClickStep;
