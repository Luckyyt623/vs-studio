
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GitCommit, GitBranch, Check, RefreshCw, ArrowUp, ArrowDown } from "lucide-react";

export function SourceControlPanel() {
  return (
    <div className="p-2 space-y-3">
        <div className="flex items-center space-x-2">
             <Input placeholder="Message (Ctrl+Enter to commit on 'main')" className="h-8 text-sm flex-grow" />
             <Button variant="outline" size="icon" className="w-8 h-8" title="Commit">
                <Check className="w-4 h-4"/>
             </Button>
              {/* Add ... menu later */}
        </div>
        <div>
            <h3 className="text-xs font-medium mb-1 px-1">Changes</h3>
            {/* List changed files here */}
             <p className="text-xs text-muted-foreground p-2 text-center">No changes detected.</p>
        </div>
        <p className="text-xs text-muted-foreground p-4 text-center">Git functionality not implemented.</p>
        {/* Placeholder buttons */}
        <div className="flex space-x-2">
             <Button variant="outline" size="sm" className="flex-1 text-xs">
                 <GitBranch className="w-3 h-3 mr-1"/> Branch
             </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                 <RefreshCw className="w-3 h-3 mr-1"/> Refresh
             </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                 <ArrowUp className="w-3 h-3 mr-1"/> Push
             </Button>
             <Button variant="outline" size="sm" className="flex-1 text-xs">
                 <ArrowDown className="w-3 h-3 mr-1"/> Pull
             </Button>
        </div>
    </div>
  );
}

    