import { MapelHistoryPage } from "@/components/dashboard/walas/mapel-history-page";
import { Suspense } from "react";

export default function MapelHistoryRoute() {
  return (
    <Suspense>
      <MapelHistoryPage />
    </Suspense>
  );
}
