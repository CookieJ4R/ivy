import { createTag, deleteTag, editTag, fetchTags, fetchTagUsage } from "@/features/tags/requests/tags";
import type { Tag, TagUsage } from "@/features/tags/types/tag";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



export function useListTags() {
  return useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });
}

export function useListTagUsage() {
  return useQuery<TagUsage>({
    queryKey: ["tagUsage"],
    queryFn: fetchTagUsage,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["tagUsage"] });
    },
  });
}

export function useEditTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["tagUsage"] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["tagUsage"] });
    },
  });
}
