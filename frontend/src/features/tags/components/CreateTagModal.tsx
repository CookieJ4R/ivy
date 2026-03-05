import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { useState } from "react";

interface CreateTagModelProps {
  openButton: React.FC;
}

export default function CreateTagModal({
  openButton: OpenButton,
}: CreateTagModelProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <OpenButton />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Tag</DialogTitle>
          <DialogDescription>Creates a new Tag.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
