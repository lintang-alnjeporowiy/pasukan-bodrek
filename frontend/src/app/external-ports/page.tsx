import React from "react";
import { ExternalPortsWorkspace } from "@/components/workspace/ExternalPortsWorkspace";

export const metadata = {
  title: "Pelabuhan Eksternal | Perencanaan Pelabuhan DSS",
  description: "Kelola data master pelabuhan eksternal sebagai referensi operasional pelayaran.",
};

export default function ExternalPortsPage() {
  return <ExternalPortsWorkspace />;
}
