import type { ColumnDef } from "@tanstack/react-table";
import { LocationActionCell } from "@/features/locations/components/LocationActionCell";
import type { Location } from "@/features/locations/types/location";

export const locationTableColumns: ColumnDef<Location>[] = [
  {
    accessorKey: "name",
    header: "Name",
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
      return <LocationActionCell location={row.original} />;
    },
  },
];
