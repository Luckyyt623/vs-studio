
"use client";

import type { FC, ReactNode } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, GitBranch, Search, Bug, Cloud, Settings, Puzzle, ChevronDown, ChevronRight, LayoutList, History } from 'lucide-react';
import { Activity } from '@/lib/enums'; // Import the Activity enum
import { cn } from '@/lib/utils';

interface ExplorerPanelProps {
  children: ReactNode; // Content for the active view (FileTree, DebugPanel, etc.)
  activeActivity: Activity; // To determine the title and structure
}

const getActivityTitle = (activity: Activity): string => {
    switch(activity) {
        case Activity.Explorer: return "Explorer";
        case Activity.Search: return "Search";
        case Activity.Git: return "Source Control";
        case Activity.Debug: return "Run and Debug";
        case Activity.Firebase: return "Firebase";
        case Activity.Extensions: return "Extensions";
        case Activity.Settings: return "Settings";
        default: return "Panel";
    }
}

export const ExplorerPanel: FC<ExplorerPanelProps> = ({ children, activeActivity }) => {
  const title = getActivityTitle(activeActivity);

  return (
    <div className={cn(
        "flex flex-col w-64 border-r bg-secondary border-border shrink-0",
        // Adjust width slightly if needed, e.g., md:w-72
        "md:w-72"
       )}>
      {/* Panel Header */}
      <div className="flex items-center justify-between h-10 px-3 border-b border-border shrink-0">
        <h2 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">{title}</h2>
        {/* Add Actions like ... here if needed */}
         {/* <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground">
            <MoreHorizontal className="w-4 h-4" />
        </Button> */}
      </div>

      {/* Main Scrollable Content Area */}
      <ScrollArea className="flex-1">
        {/* Render the dynamic content passed as children */}
        {children}

        {/* Conditionally add Outline and Timeline only for Explorer view */}
        {activeActivity === Activity.Explorer && (
            <>
                <Accordion type="multiple" defaultValue={['outline', 'timeline']} className="w-full text-xs px-0">
                    <AccordionItem value="outline" className="border-b border-border">
                         <AccordionTrigger className="px-3 py-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground hover:no-underline [&[data-state=open]>svg]:rotate-90">
                            <ChevronRight className="w-3 h-3 mr-1 transition-transform duration-200" />
                            Outline
                         </AccordionTrigger>
                         <AccordionContent className="px-3 pb-2 text-muted-foreground">
                            {/* Placeholder for code outline */}
                            Code outline unavailable.
                         </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="timeline" className="border-b-0">
                         <AccordionTrigger className="px-3 py-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground hover:no-underline [&[data-state=open]>svg]:rotate-90">
                             <ChevronRight className="w-3 h-3 mr-1 transition-transform duration-200" />
                             Timeline
                         </AccordionTrigger>
                         <AccordionContent className="px-3 pb-2 text-muted-foreground">
                             {/* Placeholder for Git history timeline */}
                             Git history timeline unavailable.
                         </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </>
        )}
      </ScrollArea>
    </div>
  );
};

    

