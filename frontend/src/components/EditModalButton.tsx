import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2 } from "lucide-react";
import { useState } from "react";

interface EditModalButtonProps {
  title?: string;
  titleDesc?: string;
  modal: React.FC;
  disabled?: boolean;
}

export default function EditModalButton({
  title = "Edit",
  titleDesc = "",
  modal: ModalContent,
  disabled,
}: EditModalButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={disabled} variant="ghost">
          <Edit2 className="text-orange-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{titleDesc}</DialogDescription>
        </DialogHeader>
        <ModalContent />
      </DialogContent>
    </Dialog>
  );
}
