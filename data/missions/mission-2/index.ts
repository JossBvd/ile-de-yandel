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
  title: "Dans la forêt",
  description:
    "Aide Yondel à trouver de quoi fabriquer une hache pour son radeau",
  completionText:
    "Grâce à tout ce que j'ai collecté dans la forêt, je vais pouvoir fabriquer une hache et collecter les rondins pour mon radeau !",
  steps: mission2Steps.map((step) => step.id),
};

export { mission2Step1, mission2Step2, mission2Step3 };
