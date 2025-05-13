
// src/components/app/python-terminal.tsx
"use client";

import type { FormEvent } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TerminalHistoryItem {
  id: string;
  type: 'command' | 'output' | 'error' | 'info';
  content: string;
}

interface PythonTerminalProps {
  onCommand: (command: string) => Promise<void>; // Parent handles actual execution and updates history
  history: TerminalHistoryItem[];
  isLoading: boolean; // True when a command (e.g., install) is running
  isDisabled: boolean; // True if Pyodide isn't ready or is loading
  className?: string;
}

export function PythonTerminal({
  onCommand,
  history,
  isLoading,
  isDisabled,
  className,
}: PythonTerminalProps) {
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
     // Focus input when terminal becomes active and ready
     if (!isDisabled && !isLoading && inputRef.current) {
       // Timeout helps ensure focus happens after potential layout shifts
       setTimeout(() => inputRef.current?.focus(), 0);
     }
  }, [history, isDisabled, isLoading]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || isDisabled) return;

    const command = inputValue.trim();
    setInputValue('');
    await onCommand(command); // Parent updates history
  };

  return (
    <div className={cn("flex flex-col h-full bg-primary text-primary-foreground", className)}> {/* Removed p-2 */}
       {/* Header removed - handled by BottomPanel tabs */}
      {/* <div className="flex items-center p-2 mb-2 border-b bg-secondary border-border">
        <Terminal className="w-5 h-5 mr-2" />
        <h3 className="text-sm font-semibold">Python Package Manager</h3>
      </div> */}

      <ScrollArea className="flex-grow mb-2 text-xs font-mono px-2" ref={scrollAreaRef}> {/* Added px-2 here */}
        <div className="space-y-1"> {/* Removed p-2 */}
          {history.map((item) => (
            <div key={item.id} className={cn(
              "whitespace-pre-wrap break-words",
              item.type === 'command' && "text-accent",
              item.type === 'error' && "text-destructive",
              item.type === 'info' && "text-muted-foreground italic"
            )}>
              {item.type === 'command' && '$ '}{item.content}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Processing...
            </div>
          )}
          {isDisabled && !isLoading && (
             <div className="text-muted-foreground italic">Terminal is disabled (Python environment loading or error).</div>
          )}
        </div>
         {/* Add extra space at the bottom for input visibility */}
        <div className="h-4"></div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-2 border-t border-border"> {/* Added p-2 here */}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isDisabled ? "Python environment loading..." : "Type command and press Enter (e.g., pip install numpy)"}
          className="flex-grow h-8 bg-input text-foreground placeholder:text-muted-foreground text-sm font-mono" // Use input background
          disabled={isLoading || isDisabled}
          aria-label="Python terminal input"
        />
        <Button type="submit" size="sm" variant="outline" disabled={isLoading || isDisabled} className="h-8">
          <Send className="w-4 h-4" />
           <span className="sr-only">Send Command</span>
        </Button>
      </form>
    </div>
  );
}

    