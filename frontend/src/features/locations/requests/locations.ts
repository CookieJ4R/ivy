import type { Location } from "@/features/locations/types/location";

export async function createLocation(name: string) {
  return await fetch("/api/locations/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to create location");
    }
    return null;
  });
}

export async function fetchLocations() {
  const res = await fetch("/api/locations/list");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function deleteLocation(id: number) {
  return await fetch(`/api/locations/delete/${id}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to delete location");
    }
    return null;
  });
}

export async function editLocation(location: Location) {
  return await fetch("/api/locations/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(location),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to update location");
    }
    return null;
  });
}
