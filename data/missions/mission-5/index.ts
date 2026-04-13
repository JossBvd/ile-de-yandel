import { Mission } from "@/types/mission";
import { Step } from "@/types/step";
import { mission5Step1 } from "./steps/step-1";
import { mission5Step2 } from "./steps/step-2";
import { mission5Step3 } from "./steps/step-3";

export const mission5Steps: Step[] = [
  mission5Step1,
  mission5Step2,
  mission5Step3,
];

export const mission5: Mission = {
  id: "mission-5",
  title: "Mission 5",
  description: "À définir avec le client",
  completionText:
    "Grâce à tout ce que\nj’ai collecté sur la plage,\nje vais pouvoir installer un\ncollecteur d’eau sur mon\nradeau !",
  steps: mission5Steps.map((step) => step.id),
};

export { mission5Step1, mission5Step2, mission5Step3 };
