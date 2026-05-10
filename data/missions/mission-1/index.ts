import { Mission } from "@/types/mission";
import { Step } from "@/types/step";
import { mission1Step1 } from "./steps/step-1";
import { mission1Step2 } from "./steps/step-2";
import { mission1Step3 } from "./steps/step-3";

export const mission1Steps: Step[] = [
  mission1Step1,
  mission1Step2,
  mission1Step3,
];

export const mission1: Mission = {
  id: "mission-1",
  title: "L'île de Yondel",
  description: "Aide Yondel à construire son radeau pour quitter l'île",
  completionText:
    "Grâce à tout ce que j'ai collecté près de l'épave, je vais pouvoir fabriquer une voile pour mon radeau !",
  steps: mission1Steps.map((step) => step.id),
};

export { mission1Step1, mission1Step2, mission1Step3 };
