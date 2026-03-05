import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import EditLocationModal from "./EditLocationModal";
import type { Location } from "@/features/locations/types/location";
import { useDeleteLocation } from "@/features/locations/hooks/useLocations";

interface LocationActionCellProps {
  location: Location;
}

export function LocationActionCell({ location }: LocationActionCellProps) {
  const deleteLocation = useDeleteLocation();
  return (
    <div className="flex flex-row gap-0 justify-end">
      <EditLocationModal location={location} />
      <ConfirmDeleteButton
        onConfirm={() => deleteLocation.mutate(location.id)}
      />
    </div>
  );
}
