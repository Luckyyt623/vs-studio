
"use client";

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Loader2, Upload, ChevronRight } from 'lucide-react';
import Image from 'next/image'; // Use next/image for optimized logo

interface TopBarProps {
  projectName: string;
  fileName: string;
  onRunCode: () => void;
  isRunDisabled?: boolean;
  isLoading?: boolean;
}

export const TopBar: FC<TopBarProps> = ({
  projectName,
  fileName,
  onRunCode,
  isRunDisabled = false,
  isLoading = false,
}) => {
  return (
    <header className="flex items-center justify-between px-3 py-1 border-b bg-secondary border-border h-12 shrink-0">
      {/* Left Side: Logo, Breadcrumbs */}
      <div className="flex items-center space-x-2">
         {/* Firebase Logo - Replace with actual logo if available */}
         <Image src="/firebase-logo.svg" alt="Firebase Logo" width={24} height={24} data-ai-hint="firebase logo" />
         <span className="text-sm font-semibold text-foreground">Firebase Studio</span>
         <ChevronRight className="w-4 h-4 text-muted-foreground" />
         <span className="text-sm text-foreground">{projectName}</span>
         {/* <ChevronRight className="w-4 h-4 text-muted-foreground" />
         <span className="text-sm text-muted-foreground">{fileName}</span> */}
      </div>

      {/* Right Side: Actions, User */}
      <div className="flex items-center space-x-3">
        <Button
          onClick={onRunCode}
          size="sm"
          variant="outline"
          className="hidden md:flex items-center"
          disabled={isRunDisabled || isLoading}
        >
          {isLoading ? (
             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          Run
        </Button>
         <Button
          onClick={onRunCode}
          size="icon"
          variant="ghost"
          className="md:hidden"
          disabled={isRunDisabled || isLoading}
          title="Run Code"
        >
          {isLoading ? (
             <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          <span className="sr-only">Run Code</span>
        </Button>

        <Button size="sm" variant="default" className="bg-purple-600 hover:bg-purple-700 text-white px-4">
           <Upload className="w-4 h-4 mr-2" />
           Publish
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://picsum.photos/id/237/32/32" alt="User Avatar" data-ai-hint="user avatar" />
          <AvatarFallback>L</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

    