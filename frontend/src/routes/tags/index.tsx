import { DataTable } from "@/components/DataTable";
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
import { tagTableColumns } from "@/features/tags/components/DataTableColumns";
import TagWidgetRow from "@/features/tags/components/TagWidgetRow";
import { useCreateTag, useListTags } from "@/features/tags/hooks/useTags";
import { getTextColorForHex, randomHexColor } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import Block from "@uiw/react-color-block";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export const Route = createFileRoute("/tags/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: tagData } = useListTags();
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(randomHexColor());
  const [name, setName] = useState("");
  const [swatches, setSwatches] = useState<string[]>([]);

  const createTag = useCreateTag();

  useEffect(() => {
    if (!open) return;
    // should be fine here because i only use it for keeping the same swatches while the component is open
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSwatches(Array.from({ length: 10 }, () => randomHexColor()));
  }, [open]);

  function createTagButtonFunc() {
    createTag.reset();
    createTag.mutate(
      { name: name, color: hex },
      {
        onSuccess: () => {
          toast.success("Tag created!");
        },
        onError: () => {
          toast.error("Could not create tag!");
        },
      },
    );
    setOpen(false);
  }

  return (
    <div className="w-full h-full flex justify-start items-center p-10 gap-5 flex-col">
      <TagWidgetRow />
      <div className="flex w-full flex-col gap-3 px-20">
        <div className="w-full flex flex-row justify-end items-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="px-5 bg-green-500 text-white hover:bg-green-400">
                <PlusIcon />
                New Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create new Tag</DialogTitle>
                <DialogDescription>
                  Creates a new Tag for categorizing items.
                </DialogDescription>
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
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {tagData && <DataTable columns={tagTableColumns} data={tagData} />}
      </div>
    </div>
  );
}
