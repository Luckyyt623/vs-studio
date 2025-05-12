
"use client";

import type { FC, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react'; // Close icon for tab
import { cn } from '@/lib/utils';

interface EditorAreaProps {
  children: ReactNode; // The CodeEditor component
  fileName: string; // Currently open file
  // Add props for handling multiple tabs later: openFiles, activeFile, onCloseTab, onSelectTab
  className?: string;
}

export const EditorArea: FC<EditorAreaProps> = ({ children, fileName, className }) => {
  // Placeholder for multiple tabs - currently just shows one
  const tabs = [
    { name: fileName, active: true },
    // { name: 'another-file.js', active: false }
  ];

  return (
    <div className={cn("flex flex-col flex-1 bg-primary overflow-hidden", className)}>
      {/* Tab Bar */}
      <div className="flex h-10 border-b border-border shrink-0 bg-secondary">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between px-3 py-1.5 border-r border-border cursor-pointer",
              tab.active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            )}
            // onClick={() => onSelectTab(tab.name)} // Add later
          >
            <span className="text-sm truncate mr-2">{tab.name}</span>
            {/* <Button
              variant="ghost"
              size="icon"
              className="w-5 h-5 p-0 shrink-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
              // onClick={(e) => { e.stopPropagation(); onCloseTab(tab.name); }} // Add later
            >
              <X className="w-3.5 h-3.5" />
            </Button> */}
          </div>
        ))}
        {/* Add space for more tabs or '+' button */}
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto p-0 md:p-2">
        {children}
      </div>
    </div>
  );
};

    