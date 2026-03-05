import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Item } from "@/features/items/types/Item";
import { getTextColorForHex } from "@/lib/utils";
import type { SyntheticEvent } from "react";

export default function ItemCard(props: { item: Item }) {
  console.log(props.item.image);
  return (
    <Card className="pt-0 w-64 h-72">
      <CardHeader className="p-0 m-0">
        <img
          src={props.item.image?.substring(1) ?? "/placeholder.png"}
          className="rounded-t-xl w-64 h-28"
          onError={(e: SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = "/placeholder.png";
          }}
        ></img>
      </CardHeader>
      <CardContent className="mt-0">
        <h1 className="text-2xl font-bold">{props.item.name}</h1>
        <p className="text-sm text-gray-600">{props.item.description}</p>
      </CardContent>
      <CardFooter className="mb-0">
        <div className="flex flex-row flex-wrap w-full gap-2">
          {props.item.tags.map((tag) => (
            <Badge
              style={{ backgroundColor: tag.color }}
              className={`${getTextColorForHex(tag.color)}`}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
