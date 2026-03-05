import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { useDeleteTag } from '@/features/tags/hooks/useTags';
import type { Tag } from "@/features/tags/types/tag";
import EditTagModal from "./EditTagModal";

interface TagActionCellProps {
  tag: Tag;
}

export function TagActionCell({ tag }: TagActionCellProps) {
  const deleteTag = useDeleteTag();
  return (
    <div className="flex flex-row gap-0 justify-end">
      <EditTagModal tag={tag}/>
      <ConfirmDeleteButton onConfirm={() => deleteTag.mutate(tag.id)} />
    </div>
  );
}
