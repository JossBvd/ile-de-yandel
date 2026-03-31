import { Mission } from "@/types/mission";
import { Step } from "@/types/step";
import { mission3Step1 } from "./steps/step-1";
import { mission3Step2 } from "./steps/step-2";
import { mission3Step3 } from "./steps/step-3";

export const mission3Steps: Step[] = [
  mission3Step1,
  mission3Step2,
  mission3Step3,
];

export const mission3: Mission = {
  id: "mission-3",
  title: "Le bosquet",
  description: "À définir avec le client",
  completionText:
    "Grâce à tout ce que j'ai collecté dans le bosquet, j'ai pu faire le plein de nourriture pour mon radeau !",
  steps: mission3Steps.map((step) => step.id),
};

export { mission3Step1, mission3Step2, mission3Step3 };
