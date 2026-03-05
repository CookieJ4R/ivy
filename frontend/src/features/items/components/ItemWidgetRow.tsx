import { Card, CardContent } from "@/components/ui/card";
import { useListItems } from "@/features/items/hooks/useItems";

export default function ItemWidgetRow() {
  const items = useListItems();
  return (
    <div className="flex flex-wrap w-full pr-2 pl-10 sm:pr-6 lg:pr-10 gap-5">
      <Card className="min-w-52">
        <CardContent className="justify-center items-center flex flex-col gap-2">
          <p className="text-2xl font-bold text-gray-700">
            {items.data?.length}
          </p>
          <p className="text-gray-300 text-sm">Total Items</p>
        </CardContent>
      </Card>
    </div>
  );
}
