import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { File as FileIcon, X } from "lucide-react";
import { useRef, useState } from "react";

interface Props {
  value: File[] | null;
  onChange: (files: File[] | null) => void;
}

export function AttachmentPicker({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const files = value ?? [];

  function addFiles(newFiles: File[]) {
    const updated = [...files, ...newFiles];
    onChange(updated.length > 0 ? updated : null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files || []);
    addFiles(newFiles);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const newFiles = Array.from(e.dataTransfer.files || []);
    addFiles(newFiles);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function removeFile(index: number) {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated.length > 0 ? updated : null);
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  return (
    <div
      onClick={openFilePicker}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={clsx(
        "border-2 border-dashed p-3 rounded cursor-pointer transition-colors min-h-28 h-28 flex items-center justify-center",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-gray-400 hover:border-primary",
      )}
    >
      <Input
        ref={inputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {files.length === 0 ? (
        <div className="flex flex-col gap-1 items-center text-muted-foreground text-xs justify-center w-full h-full">
          <FileIcon className="w-6 h-6" />
          <span>Select Files</span>
        </div>
      ) : (
        <div className="grid grid-rows-2 grid-flow-col gap-2 overflow-x-auto w-full py-1">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-1 text-sm border rounded px-2 py-1 bg-background shrink-0 justify-between w-56"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-1 justify-start">
                <FileIcon className="text-muted-foreground h-4 w-4" />
                <span className="max-w-40 truncate">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
