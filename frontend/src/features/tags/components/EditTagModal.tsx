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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getTextColorForHex, randomHexColor } from "@/lib/utils";
import type { Tag } from "@/features/tags/types/tag";
import Block from "@uiw/react-color-block";
import { Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useEditTag } from "@/features/tags/hooks/useTags";

interface EditTagModalProps {
  tag: Tag;
}

export default function EditTagModal({ tag }: EditTagModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(tag.name);
  const [hex, setHex] = useState(tag.color);
  const [swatches, setSwatches] = useState<string[]>([]);

  const updateTag = useEditTag();

  useEffect(() => {
    if (!open) return;
    // should be fine here because i only use it for keeping the same swatches while the component is open
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSwatches(Array.from({ length: 10 }, () => randomHexColor()));
  }, [open]);

  function createTagButtonFunc() {
    updateTag.reset();
    updateTag.mutate(
      { ...tag, id: tag.id, name: name, color: hex },
      {
        onSuccess: () => {
          toast.success("Tag updated!");
        },
        onError: () => {
          toast.error("Could not update tag!");
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
          <DialogTitle>Edit Tag</DialogTitle>
          <DialogDescription>Update an existing tag.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full h-full justify-start items-start gap-2">
          <Label className="text-md">Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Label className="text-md">Color</Label>
          <Popover>
            <PopoverTrigger asChild>
              <div
                className={`min-w-20 min-h-8 p-1 rounded-lg flex justify-center shadow-2xs items-center cursor-pointer ${getTextColorForHex(hex)}`}
                style={{ backgroundColor: hex }}
              >
                {hex}
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-fit" side="right">
              <Block
                color={hex}
                colors={swatches}
                onChange={(val) => setHex(val.hex)}
                showTriangle={false}
              />
            </PopoverContent>
          </Popover>
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
            onClick={createTagButtonFunc}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
