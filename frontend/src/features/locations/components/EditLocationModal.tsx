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

import { Edit2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Location } from "@/features/locations/types/location";
import { useEditLocation } from "@/features/locations/hooks/useLocations";

interface EditLocationModalProps {
  location: Location;
}

export default function EditLocationModal({
  location,
}: EditLocationModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(location.name);

  const updateLocation = useEditLocation();

  function updateLocationButtonFunc() {
    updateLocation.reset();
    updateLocation.mutate(
      { ...location, name },
      {
        onSuccess: () => {
          toast.success("Location updated!");
        },
        onError: () => {
          toast.error("Could not update location!");
        },
      },
    );
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Edit2 className="text-orange-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
          <DialogDescription>Update an existing location.</DialogDescription>
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
            onClick={updateLocationButtonFunc}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
