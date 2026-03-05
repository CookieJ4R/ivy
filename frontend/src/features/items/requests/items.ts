export async function fetchItems() {
  const res = await fetch("/api/items/list");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function createItem(itemData: FormData) {
  return await fetch("/api/items/create", {
    method: "POST",
    body: itemData,
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to create item");
    }
    return null;
  });
}
