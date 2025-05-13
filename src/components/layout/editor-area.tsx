
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
    // Example inactive tab: { name: 'package.json', active: false }
  ];

  return (
    <div className={cn("flex flex-col flex-1 bg-primary overflow-hidden", className)}>
      {/* Tab Bar - Styled like VSCode */}
      <div className="flex h-10 border-b border-border shrink-0 bg-secondary">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between h-full px-4 border-r border-border cursor-pointer group", // Use h-full
              tab.active
                ? 'bg-primary text-primary-foreground border-t-2 border-t-accent' // Active tab style
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            // onClick={() => onSelectTab(tab.name)} // Add later
            title={tab.name} // Tooltip for full name
          >
            {/* Add file icon here later */}
            <span className="text-sm truncate mr-2">{tab.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-5 h-5 p-0 shrink-0 ml-1 text-muted-foreground rounded-sm hover:bg-muted hover:text-foreground",
                // Show close button slightly more prominently on active tab or hover
                 tab.active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
              // onClick={(e) => { e.stopPropagation(); onCloseTab(tab.name); }} // Add later
              aria-label={`Close ${tab.name}`}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
        {/* Add space for more tabs or '+' button */}
      </div>

      {/* Editor Content - Removed padding from here */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

    