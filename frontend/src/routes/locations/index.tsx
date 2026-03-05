import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DataTable } from "@/components/DataTable";
import { locationTableColumns } from "@/features/locations/components/DataTableColumns";
import LocationWidgetRow from "@/features/locations/components/LocationWidgetRow";
import {
  useCreateLocation,
  useListLocations,
} from "@/features/locations/hooks/useLocations";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/locations/")({
  component: LocationRouteComponent,
});

function LocationRouteComponent() {
  const { data: locationData } = useListLocations();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const createLocation = useCreateLocation();

  function createLocationButtonFunc() {
    createLocation.reset();
    createLocation.mutate(name, {
      onSuccess: () => {
        toast.success("Location created!");
      },
      onError: () => {
        toast.error("Could not create location!");
      },
    });
    setOpen(false);
  }

  return (
    <div className="w-full h-full flex justify-start items-center p-10 gap-5 flex-col">
      <LocationWidgetRow />
      <div className="flex w-full flex-col gap-3 px-20">
        <div className="w-full flex flex-row justify-end items-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="px-5 bg-green-500 text-white hover:bg-green-400">
                <PlusIcon />
                New Location
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create new Location</DialogTitle>
                <DialogDescription>
                  Creates a new Location for grouping items.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col w-full h-full justify-start items-start gap-2">
                <Label className="text-md">Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="bg-red-500 text-white hover:bg-red-400 hover:text-white cursor-pointer">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  className="text-white bg-green-500 hover:bg-green-400 hover:text-white cursor-pointer"
                  variant={"outline"}
                  onClick={createLocationButtonFunc}
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {locationData && (
          <DataTable columns={locationTableColumns} data={locationData} />
        )}
      </div>
    </div>
  );
}
