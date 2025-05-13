
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CaseSensitive, Replace, WholeWord, Regex } from "lucide-react";

export function SearchPanel() {
  return (
    <div className="p-2 space-y-2">
        <Input placeholder="Search" className="h-8 text-sm" />
        <Input placeholder="Replace" className="h-8 text-sm" />
        <div className="flex space-x-1 justify-end">
             <Button variant="ghost" size="icon" className="w-7 h-7" title="Match Case">
                 <CaseSensitive className="w-4 h-4" />
             </Button>
              <Button variant="ghost" size="icon" className="w-7 h-7" title="Match Whole Word">
                 <WholeWord className="w-4 h-4" />
             </Button>
             <Button variant="ghost" size="icon" className="w-7 h-7" title="Use Regular Expression">
                 <Regex className="w-4 h-4" />
             </Button>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                 <Replace className="w-4 h-4 mr-1" /> Replace All
             </Button>
        </div>
        <p className="text-xs text-muted-foreground p-4 text-center">Search functionality not implemented.</p>
    </div>
  );
}

    