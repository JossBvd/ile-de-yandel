import { MISSIONS } from "@/data/missions";
import { getStepSlug } from "@/lib/navigation";
import StepPageClient from "./StepPageClient";

export function generateStaticParams() {
  return MISSIONS.flatMap((mission) =>
    mission.steps.map((stepId) => ({
      missionId: mission.id,
      stepSlug: getStepSlug(mission.id, stepId),
    })),
  );
}

export default function StepPage() {
  return <StepPageClient />;
}
