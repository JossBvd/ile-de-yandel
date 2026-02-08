import { Mission } from "@/types/mission";
import { Step } from "@/types/step";
import { mission4Step1 } from "./steps/step-1";
import { mission4Step2 } from "./steps/step-2";
import { mission4Step3 } from "./steps/step-3";

export const mission4Steps: Step[] = [
  mission4Step1,
  mission4Step2,
  mission4Step3,
];

export const mission4: Mission = {
  id: "mission-4",
  title: "Mission 4",
  description: "À définir avec le client",
  steps: mission4Steps.map((step) => step.id),
};

export { mission4Step1, mission4Step2, mission4Step3 };
