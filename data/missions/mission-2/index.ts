import { Mission } from "@/types/mission";
import { Step } from "@/types/step";
import { mission2Step1 } from "./steps/step-1";
import { mission2Step2 } from "./steps/step-2";
import { mission2Step3 } from "./steps/step-3";

export const mission2Steps: Step[] = [
  mission2Step1,
  mission2Step2,
  mission2Step3,
];

export const mission2: Mission = {
  id: "mission-2",
  title: "Mission 2",
  description: "À définir avec le client",
  steps: mission2Steps.map((step) => step.id),
};

export { mission2Step1, mission2Step2, mission2Step3 };
