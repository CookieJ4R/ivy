import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { useState } from "react";

interface CreateItemModelProps {
  openButton: React.FC;
}

export default function CreateItemModal({
  openButton: OpenButton,
}: CreateItemModelProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <OpenButton />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Item</DialogTitle>
          <DialogDescription>Creates a new Item.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
