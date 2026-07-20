"use client";

import React from "react";
import { ProjectDetailWorkspace } from "@/components/workspace/ProjectDetailWorkspace";

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  return <ProjectDetailWorkspace projectId={unwrappedParams.id} />;
}
