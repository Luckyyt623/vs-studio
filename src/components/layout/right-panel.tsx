
"use client";

import type { FC, ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { X, Smartphone, Bot } from 'lucide-react'; // Icons for tabs and close
import { cn } from '@/lib/utils';

// Match enum in page.tsx
enum PanelTab {
  WebPreview,
  Gemini,
  Console,
  Terminal,
}

interface RightPanelProps {
  children: ReactNode; // The active tab content
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
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
  const getTabValue = (tab: PanelTab): string => {
    switch (tab) {
      case PanelTab.WebPreview: return 'web';
      case PanelTab.Gemini: return 'gemini';
      default: return ''; // Should not happen for right panel
    }
  };

  const handleValueChange = (value: string) => {
    switch (value) {
      case 'web': onTabChange(PanelTab.WebPreview); break;
      case 'gemini': onTabChange(PanelTab.Gemini); break;
    }
  };

  return (
    <div className={cn("flex flex-col w-1/3 border-l bg-background border-border shrink-0", className)}>
      <Tabs value={getTabValue(activeTab)} onValueChange={handleValueChange} className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border pr-1">
           <TabsList className="shrink-0 rounded-none border-0 bg-transparent justify-start px-1 py-0 h-10">
            <TabsTrigger value="web" className="text-xs px-3 py-1.5 h-9 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
                <Smartphone className="w-4 h-4 mr-1.5" /> Web
            </TabsTrigger>
            <TabsTrigger value="gemini" className="text-xs px-3 py-1.5 h-9 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
                <Bot className="w-4 h-4 mr-1.5" /> Gemini
            </TabsTrigger>
          </TabsList>
          <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8 text-muted-foreground hover:bg-muted">
            <X className="w-4 h-4" />
            <span className="sr-only">Close Panel</span>
          </Button>
        </div>

        {/* Render children directly, assuming parent (page.tsx) handles conditional rendering */}
        <div className="flex-grow overflow-auto">
           {children}
        </div>

        {/* Example using TabsContent if direct children rendering is not preferred */}
        {/* <TabsContent value="web" className="flex-grow overflow-auto m-0 p-0 data-[state=inactive]:hidden">
            {activeTab === PanelTab.WebPreview ? children : null}
        </TabsContent>
         <TabsContent value="gemini" className="flex-grow overflow-auto m-0 p-0 data-[state=inactive]:hidden">
             {activeTab === PanelTab.Gemini ? children : null}
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

    