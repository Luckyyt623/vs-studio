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
  }, [history]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || isDisabled) return;
    
    const command = inputValue.trim();
    setInputValue('');
    await onCommand(command); // Parent updates history
  };

  return (
    <div className={cn("flex flex-col h-full bg-primary text-primary-foreground p-2", className)}>
      <div className="flex items-center p-2 mb-2 border-b bg-secondary border-border">
        <Terminal className="w-5 h-5 mr-2" />
        <h3 className="text-sm font-semibold">Python Package Manager</h3>
      </div>

      <ScrollArea className="flex-grow mb-2 text-xs font-mono" ref={scrollAreaRef}>
        <div className="p-2 space-y-1">
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
             <div className="text-muted-foreground italic">Terminal is disabled (Pyodide loading or error).</div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isDisabled ? "Pyodide loading..." : "e.g., pip install numpy"}
          className="flex-grow h-9 bg-background text-foreground placeholder:text-muted-foreground"
          disabled={isLoading || isDisabled}
          aria-label="Python terminal input"
        />
        <Button type="submit" size="sm" variant="outline" disabled={isLoading || isDisabled}>
          <Send className="w-4 h-4 mr-0 md:mr-2" /> <span className="hidden md:inline">Send</span>
        </Button>
      </form>
    </div>
  );
}
