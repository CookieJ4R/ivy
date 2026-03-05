import { useEffect, useRef, useState } from "react";
import type { Tag } from "../features/tags/types/tag";

export function ItemForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [item, setItem] = useState<{
    name: string;
    description: string;
    location_id: number;
    buy_price: number;
    buy_date: string;
    tag_ids: number[];
  }>({
    name: "",
    description: "",
    location_id: 0,
    buy_price: 0,
    buy_date: "",
    tag_ids: [],
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetch("/api/tags/list")
      .then((res) => res.json())
      .then(setTags)
      .catch(console.error);
  }, []);

  // ------------------------
  // File handling
  // ------------------------

  function onFilesAdded(newFiles: FileList | null) {
    if (!newFiles) return;

    setFiles((prev) => [...prev, ...Array.from(newFiles)]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  // ------------------------
  // Drag & Drop
  // ------------------------

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    onFilesAdded(e.dataTransfer.files);
  }

  // ------------------------
  // Submit
  // ------------------------

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();

    formData.append("item", JSON.stringify(item));
    for (const file of files) {
      formData.append("attachments", file);
    }

    try {
      const res = await fetch("/api/items/create", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to create item");
      }

      // optional: reset form
      setItem({
        name: "",
        description: "",
        location_id: 0,
        buy_price: 0,
        buy_date: "",
        tag_ids: [],
      });
      setFiles([]);

      alert("Item created!");
    } catch (err) {
      console.error(err);
      alert("Error creating item");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ------------------------
  // Render
  // ------------------------

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 600 }}>
      <h2>Create Item</h2>

      {/* Name */}
      <label>
        Name
        <input
          type="text"
          required
          value={item.name}
          onChange={(e) => setItem({ ...item, name: e.target.value })}
        />
      </label>

      {/* Description */}
      <label>
        Description
        <textarea
          value={item.description ?? ""}
          onChange={(e) => setItem({ ...item, description: e.target.value })}
        />
      </label>

      {/* Location */}
      <label>
        Location ID
        <input
          type="number"
          required
          value={item.location_id}
          onChange={(e) =>
            setItem({ ...item, location_id: Number(e.target.value) })
          }
        />
      </label>
      <fieldset style={{ marginTop: 16 }}>
        <legend>Tags</legend>

        {tags.length === 0 && <p>No tags available</p>}

        {tags.map((tag) => {
          const checked = item.tag_ids.includes(tag.id);

          return (
            <label key={tag.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  setItem((prev) => ({
                    ...prev,
                    tag_ids: checked
                      ? prev.tag_ids.filter((id) => id !== tag.id)
                      : [...prev.tag_ids, tag.id],
                  }));
                }}
              />
              {tag.name}
            </label>
          );
        })}
      </fieldset>

      {/* Attachments */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          border: "2px dashed #aaa",
          padding: 20,
          marginTop: 20,
          background: isDragging ? "#f0f0f0" : "transparent",
          cursor: "pointer",
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => onFilesAdded(e.target.files)}
        />

        <p>Drag & drop attachments here or click to select</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul>
          {files.map((file, i) => (
            <li key={i}>
              {file.name} ({Math.round(file.size / 1024)} KB)
              <button type="button" onClick={() => removeFile(i)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Submit */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Item"}
      </button>
    </form>
  );
}
