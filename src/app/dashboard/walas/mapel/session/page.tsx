import { MapelSessionPage } from "@/components/dashboard/walas/mapel-session-page";
import { Suspense } from "react";

export default function MapelSessionRoute() {
  return (
    <Suspense>
      <MapelSessionPage />
    </Suspense>
  );
}
