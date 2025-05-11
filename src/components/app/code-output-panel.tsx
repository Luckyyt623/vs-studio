
"use client";

import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeOutputPanelProps {
  srcDoc: string;
  onClose: () => void;
  className?: string;
}

export function CodeOutputPanel({ srcDoc, onClose, className }: CodeOutputPanelProps) {
  return (
    <div className={cn("flex flex-col h-full bg-primary text-primary-foreground", className)}>
      <div className="flex items-center justify-between p-2 bg-secondary border-b border-border">
        <h3 className="text-sm font-semibold">Output</h3>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close output panel">
          <XCircle className="w-5 h-5" />
        </Button>
      </div>
      <iframe
        srcDoc={srcDoc}
        title="Code Output"
        sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
        className="flex-grow w-full h-full border-0"
        aria-label="Code execution result"
      />
    </div>
  );
}
