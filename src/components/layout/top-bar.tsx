
"use client";

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2, ChevronRight, Menu } from 'lucide-react'; // Keep Run, Loader, add Menu
import Image from 'next/image'; // Use next/image for optimized logo

interface TopBarProps {
  projectName: string;
  fileName: string; // Keep filename for context maybe?
  onRunCode: () => void;
  isRunDisabled?: boolean;
  isLoading?: boolean;
}

export const TopBar: FC<TopBarProps> = ({
  projectName,
  fileName, // Keep for now
  onRunCode,
  isRunDisabled = false,
  isLoading = false,
}) => {
  return (
    <header className="flex items-center justify-between px-2 py-1 border-b bg-secondary border-border h-10 shrink-0">
      {/* Left Side: Logo, Menu, Breadcrumbs */}
      <div className="flex items-center space-x-2">
         {/* Optional: Hamburger Menu */}
         {/* <Button variant="ghost" size="icon" className="w-8 h-8">
            <Menu className="w-4 h-4"/>
         </Button> */}

         {/* Logo (smaller) */}
         <Image src="/firebase-logo.svg" alt="Firebase Logo" width={20} height={20} data-ai-hint="firebase logo" />
         {/* Simplified Title/Breadcrumb */}
         <span className="text-sm font-medium text-foreground hidden md:inline">Firebase Studio</span>
         <ChevronRight className="w-4 h-4 text-muted-foreground hidden md:inline" />
         <span className="text-sm text-foreground">{projectName}</span>
          {/* Display filename more subtly or in EditorArea only? Hide here for now */}
         {/* <ChevronRight className="w-4 h-4 text-muted-foreground" />
         <span className="text-sm text-muted-foreground">{fileName}</span> */}

         {/* Mobile Filename */}
         <div className="md:hidden text-sm font-medium truncate ml-2">
           {fileName}
         </div>
      </div>


      {/* Center Area (Placeholder for global search like VSCode?) */}
       {/* <div className="flex-1 max-w-xs mx-4">
          <Input placeholder="Search..." className="h-7 text-xs"/>
       </div> */}

      {/* Right Side: Actions (Run Button Only for now) */}
      <div className="flex items-center space-x-2">
        {/* Run Button - kept minimal */}
        <Button
          onClick={onRunCode}
          size="sm" // Make it smaller
          variant="ghost" // Make it less prominent
          className="flex items-center h-8 px-2" // Adjust padding/height
          disabled={isRunDisabled || isLoading}
          title="Run Code (Ctrl+Enter)"
        >
          {isLoading ? (
             <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
           <span className="sr-only md:not-sr-only md:ml-1">Run</span>
        </Button>

         {/* Removed Publish Button and Avatar */}
      </div>
    </header>
  );
};

    