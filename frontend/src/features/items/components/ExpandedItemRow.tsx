import type { Item } from "@/features/items/types/Item";

interface ExpandedItemRowProps {
  item: Item;
}

export default function ExpandedItemRow({ item }: ExpandedItemRowProps) {
  return (
    <div className="p-2 flex flex-col">
      <div className="flex flex-row justify-start items-start gap-4">
        <img src={item.image || "/logo.png"} className="rounded w-20 h-20" />
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-bold">{item.name}</h1>
          <span className="text-sm text-gray-600">{item.description}</span>
        </div>
      </div>
    </div>
  );
}
