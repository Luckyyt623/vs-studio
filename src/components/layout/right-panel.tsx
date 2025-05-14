
"use client";

import type { FC, ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { X, Smartphone, Bot } from 'lucide-react'; // Icons for tabs and close
import { PanelTab } from '@/lib/enums'; // Import the enum
import { cn } from '@/lib/utils';


interface RightPanelProps {
  children: ReactNode; // The active tab content
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab | null) => void; // Allow setting to null
  onClose: () => void;
  className?: string;
}

export const RightPanel: FC<RightPanelProps> = ({
  children,
  activeTab,
  onTabChange,
  onClose,
  className
}) => {
  const getTabValue = (tab: PanelTab | null): string => {
    if (tab === null) return '';
    switch (tab) {
      case PanelTab.WebPreview: return 'web';
      case PanelTab.Gemini: return 'gemini';
      default: return ''; // Should not happen for right panel tabs
    }
  };

  const handleValueChange = (value: string) => {
    switch (value) {
      case 'web': onTabChange(PanelTab.WebPreview); break;
      case 'gemini': onTabChange(PanelTab.Gemini); break;
      default: onTabChange(null); break; // Handle potential empty value if needed
    }
  };

  return (
    <div className={cn(
        "flex flex-col w-full md:w-1/3 border-l bg-secondary border-border shrink-0", // Use secondary for chrome
        className
       )}>
      <Tabs value={getTabValue(activeTab)} onValueChange={handleValueChange} className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border pr-1 h-10 shrink-0">
           <TabsList className="shrink-0 rounded-none border-0 bg-transparent justify-start px-1 py-0 h-full">
            {/* Use uppercase and slightly different styling */}
            <TabsTrigger
                value="web"
                className="text-xs uppercase tracking-wider px-3 py-1.5 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-accent hover:text-foreground text-muted-foreground"
             >
                <Smartphone className="w-4 h-4 mr-1.5" /> Web Preview
            </TabsTrigger>
            <TabsTrigger
                value="gemini"
                 className="text-xs uppercase tracking-wider px-3 py-1.5 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-accent hover:text-foreground text-muted-foreground"
             >
                <Bot className="w-4 h-4 mr-1.5" /> Gemini
            </TabsTrigger>
          </TabsList>
           <div className="flex items-center">
               {/* Add other actions like split panel here later */}
               <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8 text-muted-foreground hover:bg-muted">
                 <X className="w-4 h-4" />
                 <span className="sr-only">Close Panel</span>
               </Button>
           </div>
        </div>

        {/* Content Area - Add padding here and set background */}
        <div className="flex-grow overflow-auto bg-primary p-0"> {/* Changed p-4 to p-0 */}
           {/* Render children directly, parent components (AiToolsPanel, CodeOutputPanel) should manage their own padding */}
           {children}
        </div>

      </Tabs>
    </div>
  );
};

    
