
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeOutputPanelProps {
  srcDoc?: string;
  textOutput?: { stdout?: string; stderr?: string; error?: string };
  language?: string;
  onClose: () => void;
  className?: string;
}

export function CodeOutputPanel({ srcDoc, textOutput, language, onClose, className }: CodeOutputPanelProps) {
  const hasTextOutput = textOutput && (textOutput.stdout || textOutput.stderr || textOutput.error);

  return (
    <div className={cn("flex flex-col h-full bg-primary text-primary-foreground", className)}>
      <div className="flex items-center justify-between p-2 bg-secondary border-b border-border">
        <h3 className="text-sm font-semibold">Output</h3>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close output panel">
          <XCircle className="w-5 h-5" />
        </Button>
      </div>
      
      {srcDoc && !hasTextOutput && language !== 'python' && language !== 'cpp' && (
        <iframe
          srcDoc={srcDoc}
          title="Code Output"
          sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
          className="flex-grow w-full h-full border-0"
          aria-label="Code execution result"
        />
      )}

      {hasTextOutput && (language === 'python' || language === 'cpp') && (
        <ScrollArea className="flex-grow p-4 font-mono text-sm">
          {textOutput.stdout && (
            <pre className="whitespace-pre-wrap text-primary-foreground">{textOutput.stdout}</pre>
          )}
          {textOutput.stderr && (
            <pre className="whitespace-pre-wrap text-red-400">{textOutput.stderr}</pre>
          )}
          {/* Error from execution process, distinct from stderr for clarity if needed */}
          {textOutput.error && !textOutput.stderr?.includes(textOutput.error) && (
             <pre className="whitespace-pre-wrap text-destructive">{`Execution Error: ${textOutput.error}`}</pre>
          )}
        </ScrollArea>
      )}

      {/* Fallback or initial state message */}
      {!srcDoc && !hasTextOutput && (
         <div className="flex-grow p-4 text-muted-foreground">
           {language === 'python' ? 'Run Python code to see output.' : 
            language === 'cpp' ? 'C++ execution in browser is a preview and not supported for running.' :
            'Run code to see output or preview.'}
         </div>
      )}
    </div>
  );
}
