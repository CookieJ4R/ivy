import { Card, CardContent } from "@/components/ui/card";
import { useListTags, useListTagUsage } from "@/features/tags/hooks/useTags";

export default function TagWidgetRow() {
  const tags = useListTags();
  const tagUsage = useListTagUsage();
  return (
    <div className="flex flex-wrap w-full pr-2 pl-10 sm:pr-6 lg:pr-10 gap-5">
      <Card className="min-w-52">
        <CardContent className="justify-center items-center flex flex-col gap-2">
          <p className="text-2xl font-bold text-gray-700">
            {tags.data?.length}
          </p>
          <p className="text-gray-300 text-sm">Total Tags</p>
        </CardContent>
      </Card>
      <Card className="min-w-52">
        <CardContent className="justify-center items-center flex flex-col gap-2">
          <p className="text-2xl font-bold text-gray-700">
            {tagUsage.data?.used}
          </p>
          <p className="text-gray-300 text-sm">Used Tags</p>
        </CardContent>
      </Card>
      <Card className="min-w-52">
        <CardContent className="justify-center items-center flex flex-col gap-2">
          <p className="text-2xl font-bold text-gray-700">
            {tagUsage.data?.unused}
          </p>
          <p className="text-gray-300 text-sm">Unused Tags</p>
        </CardContent>
      </Card>
    </div>
  );
}
