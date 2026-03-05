import type { CreateTagInput, Tag } from "../types/tag";

export async function createTag(tag: CreateTagInput) {
  return await fetch("/api/tags/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tag),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to create tag");
    }
    return null;
  });
}

export async function editTag(tag: Tag) {
  return await fetch("/api/tags/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tag),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to update tag");
    }
    return null;
  });
}

export async function fetchTags() {
  const res = await fetch("/api/tags/list");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function fetchTagUsage() {
  const res = await fetch("/api/tags/usage");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function deleteTag(id: number) {
  return await fetch(`/api/tags/delete/${id}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to delete tag");
    }
    return null;
  });
}
