import { TagActionCell } from "@/features/tags/components/TagActionCell";
import { Badge } from "@/components/ui/badge";
import { getTextColorForHex } from "@/lib/utils";
import type { Tag } from "@/features/tags/types/tag";
import type { ColumnDef } from "@tanstack/react-table";

export const tagTableColumns: ColumnDef<Tag>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      return (
        <Badge
          style={{ backgroundColor: row.original.color }}
          className={`font-mono ${getTextColorForHex(row.original.color)}`}
        >
          {row.original.color}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created on",
    cell: ({ row }) => {
      return (
        <span>{new Date(row.original.created_at).toLocaleDateString()}</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <TagActionCell tag={row.original} />;
    },
  },
];
