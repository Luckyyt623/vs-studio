
"use client";

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Files, Search, GitBranch, Bug, Puzzle, Settings, Cloud, User } from 'lucide-react'; // Added User
import { Activity } from '@/lib/enums'; // Import the enum
import { cn } from '@/lib/utils';


interface ActivityBarProps {
  active: Activity;
  onSelect: (activity: Activity) => void;
}

const activityItems = [
  { id: Activity.Explorer, icon: Files, label: 'Explorer (⌘⇧E)' },
  { id: Activity.Search, icon: Search, label: 'Search (⌘⇧F)' },
  { id: Activity.Git, icon: GitBranch, label: 'Source Control (⌘⇧G)' },
  { id: Activity.Debug, icon: Bug, label: 'Run and Debug (⌘⇧D)' },
  { id: Activity.Firebase, icon: Cloud, label: 'Firebase' }, // Firebase specific
  { id: Activity.Extensions, icon: Puzzle, label: 'Extensions (⌘⇧X)' },
];

// Separate items for bottom section
const bottomActivityItems = [
    { id: 'account', icon: User, label: 'Accounts'}, // Use string ID if not in Activity enum
    { id: Activity.Settings, icon: Settings, label: 'Manage (⌘,)'} // Use enum value for Settings
]

export const ActivityBar: FC<ActivityBarProps> = ({ active, onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-between w-12 py-2 bg-secondary border-r border-border shrink-0">
      <TooltipProvider delayDuration={0}>
        <div className="flex flex-col items-center space-y-1">
          {activityItems.map((item) => (
            <Tooltip key={`activity-${item.id}`}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-10 h-10 rounded-md relative", // Added relative for potential indicators
                    active === item.id
                      ? 'text-foreground after:absolute after:left-0 after:top-1/2 after:h-6 after:-translate-y-1/2 after:w-0.5 after:bg-foreground' // VSCode style active indicator
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => onSelect(item.id)}
                  aria-label={item.label}
                >
                  <item.icon className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
         <div className="flex flex-col items-center space-y-1">
            {bottomActivityItems.map((item) => (
            <Tooltip key={`bottom-activity-${item.id}`}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-10 h-10 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
                    // Highlight settings button if its activity is active
                    active === item.id && item.id === Activity.Settings ? 'text-foreground' : ''
                  )}
                  onClick={() => {
                    // Only trigger onSelect if it's a manageable activity like Settings
                    if (item.id === Activity.Settings) {
                      onSelect(item.id);
                    } else {
                      // Handle account click differently (e.g., open profile modal)
                      // For now, we'll make it unclickable or do nothing
                      // console.log("Account clicked (placeholder)");
                    }
                  }}
                  aria-label={item.label}
                  // Disable button if it's not settings, as there's no action yet
                  disabled={item.id !== Activity.Settings} 
                >
                  <item.icon className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
         </div>
      </TooltipProvider>
    </div>
  );
};

    
