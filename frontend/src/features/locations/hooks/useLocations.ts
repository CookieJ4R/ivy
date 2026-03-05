import {
  createLocation,
  deleteLocation,
  editLocation,
  fetchLocations,
} from "@/features/locations/requests/locations";
import type { Location } from "@/features/locations/types/location";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useListLocations() {
  return useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}

export function useEditLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}
