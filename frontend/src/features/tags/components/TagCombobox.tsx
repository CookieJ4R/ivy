import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import type { Tag } from "@/features/tags/types/tag";

interface TagComboboxProps {
  tags: Tag[];
  selectedValues: Tag[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function TagCombobox({
  tags,
  selectedValues,
  onChange,
  placeholder = "",
}: TagComboboxProps) {
  const anchor = useComboboxAnchor();

  return (
    <Combobox
      multiple
      autoHighlight
      items={tags.map((tag) => ({ id: tag.id.toString(), name: tag.name }))}
      value={selectedValues.map((tag) => tag.id.toString())}
      onValueChange={onChange}
    >
      <ComboboxChips ref={anchor} className="w-full">
        <ComboboxValue>
          {selectedValues.map(
            (value: Tag) => (
              console.log(value),
              (
                <>
                  <ComboboxChip key={value.id}>{value.name}</ComboboxChip>
                </>
              )
            ),
          )}
          <ComboboxChipsInput
            placeholder={selectedValues.length > 0 ? "" : placeholder}
          />
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList className="pointer-events-auto">
          {(item) => (
            <ComboboxItem key={item.id} value={item.id}>
              {item.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
