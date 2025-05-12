
"use client";

import type { FC, ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { X, TerminalSquare, List } from 'lucide-react'; // Icons for tabs and close
import { cn } from '@/lib/utils';

// Match enum in page.tsx
enum PanelTab {
  WebPreview,
  Gemini,
  Console,
  Terminal,
}

interface BottomPanelProps {
  children: ReactNode; // The active tab content
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const BottomPanel: FC<BottomPanelProps> = ({
  children,
  activeTab,
  onTabChange,
  onClose,
  className,
  style,
}) => {
  const getTabValue = (tab: PanelTab): string => {
    switch (tab) {
      case PanelTab.Console: return 'console';
      case PanelTab.Terminal: return 'terminal';
      default: return ''; // Should not happen for bottom panel
    }
  };

   const handleValueChange = (value: string) => {
    switch (value) {
      case 'console': onTabChange(PanelTab.Console); break;
      case 'terminal': onTabChange(PanelTab.Terminal); break;
    }
  };

  return (
    <div
        className={cn("h-1/3 border-t bg-secondary border-border shrink-0 flex flex-col", className)}
        style={style} // Allow height override if needed
    >
       <Tabs value={getTabValue(activeTab)} onValueChange={handleValueChange} className="flex flex-col flex-1 overflow-hidden">
         <div className="flex items-center justify-between border-b border-border pr-1">
           <TabsList className="shrink-0 rounded-none border-0 bg-transparent justify-start px-1 py-0 h-10">
             <TabsTrigger value="console" className="text-xs px-3 py-1.5 h-9 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
               <List className="w-4 h-4 mr-1.5" /> Console
             </TabsTrigger>
             <TabsTrigger value="terminal" className="text-xs px-3 py-1.5 h-9 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
               <TerminalSquare className="w-4 h-4 mr-1.5" /> Terminal
             </TabsTrigger>
             {/* Add more tabs like Problems, Output here */}
           </TabsList>
           <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8 text-muted-foreground hover:bg-muted">
             <X className="w-4 h-4" />
             <span className="sr-only">Close Panel</span>
           </Button>
         </div>

         {/* Render children directly based on parent's state */}
         <div className="flex-grow overflow-auto bg-primary">
           {children}
         </div>

         {/* Example using TabsContent if needed */}
         {/* <TabsContent value="console" className="flex-grow overflow-auto m-0 p-0 data-[state=inactive]:hidden">
             {activeTab === PanelTab.Console ? children : null}
         </TabsContent>
         <TabsContent value="terminal" className="flex-grow overflow-auto m-0 p-0 data-[state=inactive]:hidden">
             {activeTab === PanelTab.Terminal ? children : null}
         </TabsContent> */}
       </Tabs>
    </div>
  );
};

    