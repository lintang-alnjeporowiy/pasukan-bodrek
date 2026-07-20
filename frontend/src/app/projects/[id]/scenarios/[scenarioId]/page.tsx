"use client";

import React from "react";
import { ScenarioWorkspace } from "@/components/workspace/ScenarioWorkspace";

export default function ScenarioPage({
  params,
}: {
  params: Promise<{ id: string; scenarioId: string }>;
}) {
  const unwrappedParams = React.use(params);
  return (
    <ScenarioWorkspace
      projectId={unwrappedParams.id}
      scenarioId={unwrappedParams.scenarioId}
    />
  );
}
