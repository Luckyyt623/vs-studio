
"use client";

import type { FC, ReactNode } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Files } from 'lucide-react'; // Icon for EXPLORER

interface ExplorerPanelProps {
  children: ReactNode; // To hold FileControls, SettingsPanel, etc.
  onLoadFile: (content: string, name: string) => void; // Reuse existing props if needed
  onFileNameChange: (name: string) => void;
  fileName: string;
  code: string;
  language: string;
  onLanguageChange: (lang: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  editorTheme: 'dark' | 'light';
  onEditorThemeChange: (theme: 'dark' | 'light') => void;
  indentation: number;
  onIndentationChange: (indent: number) => void;
  projectType: string;
  onProjectTypeChange: (type: string) => void;
}

export const ExplorerPanel: FC<ExplorerPanelProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-64 border-r bg-secondary border-border shrink-0">
      <div className="flex items-center h-10 px-3 border-b border-border">
        {/* <Files className="w-4 h-4 mr-2 text-muted-foreground" /> */}
        <h2 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Explorer</h2>
      </div>
      <ScrollArea className="flex-1">
        {/* Content passed from page.tsx */}
        {children}
      </ScrollArea>
       {/* Optional Footer Area */}
        {/* <Separator />
        <div className="p-2 text-xs text-muted-foreground">
            Outline / Timeline (Placeholder)
        </div> */}
    </div>
  );
};

    