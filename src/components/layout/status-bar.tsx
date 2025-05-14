
"use client";

import { useState, useEffect, type FC } from 'react';
import { GitBranch, CloudOff, Cloud, AlertCircle, Bell, CheckCircle, XCircle, Loader2, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  language: string;
  fileName: string;
  pyodideStatus: 'loading' | 'ready' | 'error';
  // Add more props later: gitBranch, errors, warnings, line, col, etc.
}

export const StatusBar: FC<StatusBarProps> = ({
    language,
    fileName,
    pyodideStatus
    // gitBranch = 'main', errors = 0, warnings = 0, line = 1, col = 1
}) => {

  // Placeholder values - replace with real data when available
  const gitBranch = 'main';
  const errors = 0;
  const warnings = 0;
  const line = 1;
  const col = 1;
  const indentation = 'Spaces: 2'; // Example
  const encoding = 'UTF-8'; // Example
  const lineEndings = 'LF'; // Example
   const [isOnline, setIsOnline] = useState(true); // Default to true

   useEffect(() => {
       if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
           setIsOnline(navigator.onLine);

           const handleOnline = () => setIsOnline(true);
           const handleOffline = () => setIsOnline(false);

           window.addEventListener('online', handleOnline);
           window.addEventListener('offline', handleOffline);

           return () => {
               window.removeEventListener('online', handleOnline);
               window.removeEventListener('offline', handleOffline);
           };
       }
   }, []);


  const getLanguageLabel = (lang: string): string => {
    // Simple mapping, could be more complex
    const langMap: { [key: string]: string } = {
      javascript: 'JavaScript',
      python: 'Python',
      html: 'HTML',
      css: 'CSS',
      typescript: 'TypeScript',
      java: 'Java',
      csharp: 'C#',
      cpp: 'C++',
      php: 'PHP',
      ruby: 'Ruby',
      go: 'Go',
      swift: 'Swift',
      plaintext: 'Plain Text',
    };
    return langMap[lang] || lang;
  };

  const getPyodideStatusIcon = () => {
      if (language !== 'python') return null;
      switch(pyodideStatus) {
          case 'loading': return <Loader2 className="w-3 h-3 animate-spin" />;
          case 'ready': return <CheckCircle className="w-3 h-3 text-green-500" />;
          case 'error': return <XCircle className="w-3 h-3 text-destructive" />;
          default: return null;
      }
  }
   const getPyodideStatusTooltip = () => {
      if (language !== 'python') return null;
      switch(pyodideStatus) {
          case 'loading': return "Python env loading...";
          case 'ready': return "Python env ready";
          case 'error': return "Python env error";
          default: return null;
      }
  }

  return (
    <footer className="flex items-center justify-between h-6 px-3 bg-accent text-accent-foreground border-t border-border text-xs shrink-0">
      <TooltipProvider delayDuration={100}>
        {/* Left Side */}
        <div className="flex items-center space-x-3">
          <Tooltip>
            <TooltipTrigger asChild>
               <Button variant="ghost" size="xs" className="h-full px-1 hover:bg-white/10">
                  <GitBranch className="w-3.5 h-3.5 mr-1" /> {gitBranch}
               </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">Source Control (Current Branch: {gitBranch})</TooltipContent>
          </Tooltip>

           <Tooltip>
             <TooltipTrigger asChild>
                <Button variant="ghost" size="xs" className="h-full px-1 hover:bg-white/10">
                   {isOnline ? <Cloud className="w-3.5 h-3.5" /> : <CloudOff className="w-3.5 h-3.5 text-orange-400" /> }
                </Button>
             </TooltipTrigger>
             <TooltipContent side="top" className="text-xs">{isOnline ? 'Online' : 'Offline Mode'}</TooltipContent>
           </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="xs" className="h-full px-1 space-x-1 hover:bg-white/10">
                <XCircle className="w-3.5 h-3.5" /> <span>{errors}</span>
                <AlertCircle className="w-3.5 h-3.5" /> <span>{warnings}</span>
              </Button>
            </TooltipTrigger>
             <TooltipContent side="top" className="text-xs">No Problems</TooltipContent>
          </Tooltip>

        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
           {language === 'python' && pyodideStatus && (
              <Tooltip>
                 <TooltipTrigger asChild>
                   <Button variant="ghost" size="xs" className="h-full px-1 space-x-1 hover:bg-white/10">
                      {getPyodideStatusIcon()}
                      <span className="ml-1">Python Env</span>
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent side="top" className="text-xs">{getPyodideStatusTooltip()}</TooltipContent>
              </Tooltip>
           )}

           <Tooltip>
              <TooltipTrigger asChild>
                  <Button variant="ghost" size="xs" className="h-full px-1 hover:bg-white/10">
                      Ln {line}, Col {col}
                  </Button>
               </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">Go to Line/Column</TooltipContent>
           </Tooltip>

           <Tooltip>
              <TooltipTrigger asChild>
                 <Button variant="ghost" size="xs" className="h-full px-1 hover:bg-white/10">
                    {indentation}
                 </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">Select Indentation</TooltipContent>
           </Tooltip>

            <Tooltip>
               <TooltipTrigger asChild>
                  <Button variant="ghost" size="xs" className="h-full px-1 hover:bg-white/10">
                      {encoding}
                  </Button>
               </TooltipTrigger>
               <TooltipContent side="top" className="text-xs">Select Encoding</TooltipContent>
            </Tooltip>

             <Tooltip>
                <TooltipTrigger asChild>
                   <Button variant="ghost" size="xs" className="h-full px-1 hover:bg-white/10">
                       {lineEndings}
                   </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">Select End of Line Sequence</TooltipContent>
             </Tooltip>

           <Tooltip>
              <TooltipTrigger asChild>
                 <Button variant="ghost" size="xs" className="h-full px-1 hover:bg-white/10">
                     {getLanguageLabel(language)}
                 </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">Select Language Mode</TooltipContent>
           </Tooltip>

          {/* Placeholder for Feedback */}
          {/* <Button variant="ghost" size="xs" className="h-full px-1">
             <Smile className="w-3.5 h-3.5" />
          </Button> */}

          <Tooltip>
            <TooltipTrigger asChild>
               <Button variant="ghost" size="xs" className="h-full px-1 hover:bg-white/10">
                  <Bell className="w-3.5 h-3.5" />
               </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">Notifications</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </footer>
  );
};


// Add size variant to Button props if not already defined or extend it
declare module "@/components/ui/button" {
  interface ButtonProps {
    size?: "default" | "sm" | "lg" | "icon" | "xs";
  }
}

// Add the 'xs' size variant to buttonVariants definition
import { cva } from "class-variance-authority";
// Ensure this modification happens where buttonVariants is defined,
// or re-export it here if necessary. For simplicity, modifying inline:
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xs: "h-6 rounded-sm px-2 text-xs", // Added xs size
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

    