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
  title: "L'île de Yandel",
  description: "Aide Yandel à construire son radeau pour quitter l'île",
  steps: mission1Steps.map((step) => step.id),
};

export { mission1Step1, mission1Step2, mission1Step3 };
