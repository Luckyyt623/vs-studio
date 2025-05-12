
"use client";

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Files, Search, GitBranch, Bug, Puzzle, Settings, Cloud } from 'lucide-react'; // Added Cloud for Firebase
import { cn } from '@/lib/utils';

// Match enum in page.tsx
enum Activity {
  Explorer,
  Search,
  Git,
  Debug,
  Extensions,
  Firebase
}

interface ActivityBarProps {
  active: Activity;
  onSelect: (activity: Activity) => void;
}

const activityItems = [
  { id: Activity.Explorer, icon: Files, label: 'Explorer' },
  { id: Activity.Search, icon: Search, label: 'Search' },
  { id: Activity.Git, icon: GitBranch, label: 'Source Control' },
  { id: Activity.Debug, icon: Bug, label: 'Run and Debug' },
   { id: Activity.Firebase, icon: Cloud, label: 'Firebase' }, // Added Firebase
  { id: Activity.Extensions, icon: Puzzle, label: 'Extensions' },
];

const bottomActivityItems = [
    // { id: Activity.Account, icon: User, label: 'Accounts'}, // Example
    { id: Activity.Settings, icon: Settings, label: 'Manage'}
]

export const ActivityBar: FC<ActivityBarProps> = ({ active, onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-between w-12 py-2 bg-secondary border-r border-border shrink-0">
      <TooltipProvider delayDuration={0}>
        <div className="flex flex-col items-center space-y-1">
          {activityItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-10 h-10 rounded-md",
                    active === item.id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => onSelect(item.id)}
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
         <div className="flex flex-col items-center space-y-1">
           {/* Example: Bottom icons like Settings */}
            {bottomActivityItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-10 h-10 rounded-md",
                    active === item.id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                //   onClick={() => onSelect(item.id)} // Assuming Settings doesn't change the main panel view
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5" />
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

    