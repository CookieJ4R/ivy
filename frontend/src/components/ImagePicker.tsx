import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  value: File | null;
  onChange: (file: File | null) => void;
}

export function ImagePicker({ value, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    onChange(file);
  }

  return (
    <div className="group relative min-w-32 min-h-32 max-w-32 max-h-32 border-2 border-dashed border-gray-400 rounded cursor-pointer overflow-hidden">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
      />

      {preview ? (
        <>
          {/* Image */}
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />

          {/* Hover overlay */}
          <div
            className="absolute inset-0 bg-black/50 flex items-center justify-center
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
          >
            <div className="flex flex-col items-center text-white text-xs">
              <Camera />
              Replace Image
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col gap-1 justify-center items-center pointer-events-none">
          <Camera className="text-gray-400" />
          <span className="text-gray-400 text-xs">Select Image</span>
        </div>
      )}
    </div>
  );
}
