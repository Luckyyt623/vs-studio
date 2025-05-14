
"use client";

import type { FC, ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { X, Terminal, Bug, Server, AlertCircle } from 'lucide-react'; // Updated Icons
import { PanelTab } from '@/lib/enums'; // Import the enum
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface BottomPanelProps {
  children: ReactNode; // The active tab content
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
  problemsCount?: number; // Optional count for problems badge
}

export const BottomPanel: FC<BottomPanelProps> = ({
  children,
  activeTab,
  onTabChange,
  onClose,
  className,
  style,
  problemsCount = 0,
}) => {
  const getTabValue = (tab: PanelTab): string => {
    switch (tab) {
      case PanelTab.Problems: return 'problems';
      case PanelTab.Output: return 'output';
      case PanelTab.DebugConsole: return 'debug_console';
      case PanelTab.Terminal: return 'terminal';
      default: return ''; // Should not happen for bottom panel
    }
  };

   const handleValueChange = (value: string) => {
    switch (value) {
      case 'problems': onTabChange(PanelTab.Problems); break;
      case 'output': onTabChange(PanelTab.Output); break;
      case 'debug_console': onTabChange(PanelTab.DebugConsole); break;
      case 'terminal': onTabChange(PanelTab.Terminal); break;
    }
  };

  return (
    <div
        className={cn(
            "h-1/3 border-t bg-secondary border-border shrink-0 flex flex-col", // Use secondary for panel chrome
            "min-h-[100px] md:min-h-[150px]", // Ensure minimum height
            className
        )}
        style={style} // Allow height override if needed
    >
       {/* Tabs container */}
       <Tabs
         value={getTabValue(activeTab)}
         onValueChange={handleValueChange}
         className="flex flex-col flex-1 overflow-hidden"
        >
         {/* Tab List Header */}
         <div className="flex items-center justify-between border-b border-border pr-1 h-10 shrink-0">
           <TabsList className="shrink-0 rounded-none border-0 bg-transparent justify-start px-1 py-0 h-full">
             <TabsTrigger
                value="problems"
                className="text-xs uppercase tracking-wider px-3 py-1.5 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-accent hover:text-foreground text-muted-foreground"
             >
               <AlertCircle className="w-4 h-4 mr-1.5" /> Problems
               {problemsCount > 0 && (
                 <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs h-4">
                   {problemsCount}
                 </Badge>
               )}
             </TabsTrigger>
              <TabsTrigger
                value="output"
                className="text-xs uppercase tracking-wider px-3 py-1.5 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-accent hover:text-foreground text-muted-foreground"
             >
               <Server className="w-4 h-4 mr-1.5" /> Output
             </TabsTrigger>
             <TabsTrigger
                value="debug_console"
                className="text-xs uppercase tracking-wider px-3 py-1.5 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-accent hover:text-foreground text-muted-foreground"
             >
               <Bug className="w-4 h-4 mr-1.5" /> Debug Console
             </TabsTrigger>
             <TabsTrigger
                value="terminal"
                className="text-xs uppercase tracking-wider px-3 py-1.5 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-accent hover:text-foreground text-muted-foreground"
             >
               <Terminal className="w-4 h-4 mr-1.5" /> Terminal
             </TabsTrigger>
           </TabsList>
           {/* Panel Actions (e.g., Close) */}
           <div className="flex items-center space-x-1">
               {/* Add other actions like split panel here later */}
               <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8 text-muted-foreground hover:bg-muted">
                 <X className="w-4 h-4" />
                 <span className="sr-only">Close Panel</span>
               </Button>
            </div>
         </div>

         {/* Tab Content Area */}
         {/* We render children directly passed from the parent, which handles the logic */}
         {/* The background should be primary as it's the content area */}
         <div className="flex-grow overflow-auto bg-primary p-0">
              {children}
          </div>
       </Tabs>
    </div>
  );
};

    
