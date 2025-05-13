
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw } from "lucide-react";

export function ExtensionsPanel() {
  return (
    <div className="p-2 space-y-3">
        <div className="flex items-center space-x-2">
            <Input placeholder="Search Extensions in Marketplace" className="h-8 text-sm flex-grow" />
             <Button variant="ghost" size="icon" className="w-8 h-8" title="Filter">
                 <Filter className="w-4 h-4"/>
             </Button>
             <Button variant="ghost" size="icon" className="w-8 h-8" title="Refresh">
                 <RefreshCw className="w-4 h-4"/>
             </Button>
             {/* Add ... menu later */}
        </div>
        <div>
            <h3 className="text-xs font-medium mb-1 px-1 uppercase">Installed</h3>
             <p className="text-xs text-muted-foreground p-2 text-center">No extensions installed.</p>
             {/* List installed extensions here */}
        </div>
         <div>
            <h3 className="text-xs font-medium mb-1 px-1 uppercase">Recommended</h3>
             <p className="text-xs text-muted-foreground p-2 text-center">No recommendations available.</p>
             {/* List recommended extensions here */}
        </div>
        <p className="text-xs text-muted-foreground p-4 text-center">Marketplace functionality not implemented.</p>
    </div>
  );
}

    