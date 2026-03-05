import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";

export default function TopBar() {
  return (
    <div className="w-full h-20 flex flex-row justify-between items-center p-2">
      <div className="flex flex-row items-center gap-2">
        <SidebarTrigger className="bg-slate-100 w-12 h-12 size-12" />
        <h1 className="text-4xl font-bold text-gray-700">Ivy</h1>
      </div>

      <div className="flex w-full max-w-lg items-center gap-2 ml-5">
        <Input type="text" placeholder="Search..." className="h-12" />
        <Button type="submit" variant="outline" className="h-12 w-12">
          <Search />
        </Button>
      </div>
    </div>
  );
}
