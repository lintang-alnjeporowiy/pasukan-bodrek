import React from "react";
import { VesselsWorkspace } from "@/components/workspace/VesselsWorkspace";

export const metadata = {
  title: "Kapal Master | Perencanaan Pelabuhan DSS",
  description: "Kelola data master armada kapal untuk perencanaan transportasi maritim.",
};

export default function VesselsPage() {
  return <VesselsWorkspace />;
}
