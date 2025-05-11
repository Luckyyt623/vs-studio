
"use client";

import { useState } from 'react';
import { CodeEditor } from '@/components/app/code-editor';
import { FileControls } from '@/components/app/file-controls';
import { SettingsPanel } from '@/components/app/settings-panel';
import {
  Sidebar,
  SidebarContent as CustomSidebarContent, // Renamed to avoid conflict
  SidebarHeader as CustomSidebarHeader, // Renamed
  SidebarInset,
  SidebarTrigger,
  SidebarTitle as CustomSidebarTitle,   // Renamed
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter as CustomSidebarFooter, // Renamed
} from '@/components/ui/sidebar-custom';
import { SheetHeader as ShadSheetHeader, SheetTitle as ShadSheetTitle } from '@/components/ui/sheet'; // Import ShadCN parts
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile
import {
  DEFAULT_LANGUAGE,
  DEFAULT_FONT_SIZE,
  DEFAULT_EDITOR_THEME,
  DEFAULT_INDENTATION,
  type EditorTheme,
} from '@/lib/constants';
import { TerminalSquare, PanelLeft } from 'lucide-react';

export default function CodeWriteMobilePage() {
  const [code, setCode] = useLocalStorage<string>('codewrite-code', '');
  const [fileName, setFileName] = useLocalStorage<string>('codewrite-filename', 'untitled.txt');
  const [language, setLanguage] = useLocalStorage<string>('codewrite-language', DEFAULT_LANGUAGE);
  const [fontSize, setFontSize] = useLocalStorage<number>('codewrite-fontsize', DEFAULT_FONT_SIZE);
  const [editorTheme, setEditorTheme] = useLocalStorage<EditorTheme>('codewrite-editortheme', DEFAULT_EDITOR_THEME);
  const [indentation, setIndentation] = useLocalStorage<number>('codewrite-indentation', DEFAULT_INDENTATION);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobileClient = useIsMobile(); // Use hook here

  const handleLoadFile = (content: string, name: string) => {
    setCode(content);
    setFileName(name);
  };

  const sidebarTitleContent = (
    <>
      <TerminalSquare className="w-6 h-6 mr-2 text-accent" />
      CodeWrite Mobile
    </>
  );

  return (
      <div className="flex h-screen bg-background">
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} side="left">
          {isMobileClient ? (
            <ShadSheetHeader className="p-4 border-b border-sidebar-border">
              <ShadSheetTitle className="text-lg font-semibold flex items-center text-sidebar-foreground">
                {sidebarTitleContent}
              </ShadSheetTitle>
            </ShadSheetHeader>
          ) : (
            <CustomSidebarHeader>
              <CustomSidebarTitle>
                {sidebarTitleContent}
              </CustomSidebarTitle>
            </CustomSidebarHeader>
          )}
          <ScrollArea className="flex-grow">
            <CustomSidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>File Management</SidebarGroupLabel>
                <SidebarGroupContent>
                  <FileControls
                    code={code}
                    fileName={fileName}
                    onFileNameChange={setFileName}
                    onLoad={handleLoadFile}
                  />
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Editor Settings</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SettingsPanel
                    language={language}
                    onLanguageChange={setLanguage}
                    fontSize={fontSize}
                    onFontSizeChange={setFontSize}
                    editorTheme={editorTheme}
                    onEditorThemeChange={setEditorTheme}
                    indentation={indentation}
                    onIndentationChange={setIndentation}
                  />
                </SidebarGroupContent>
              </SidebarGroup>
            </CustomSidebarContent>
          </ScrollArea>
          <CustomSidebarFooter className="p-4 text-xs text-muted-foreground">
            Powered by AI
          </CustomSidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-2 border-b bg-secondary border-border h-14">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="md:hidden">
              <PanelLeft className="w-5 h-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
             <div className="md:hidden text-sm font-medium truncate">
              {fileName}
            </div>
            <div className="hidden md:flex items-center">
              {/* Standard sidebar trigger for desktop - this trigger might be from the other sidebar system, check if needed */}
              {/* <SidebarTrigger />  */}
              <span className="ml-2 text-sm font-medium truncate">{fileName}</span>
            </div>
            {/* Placeholder for other header actions */}
          </header>
          <main className="flex-1 p-0 overflow-auto md:p-4">
            <CodeEditor
              code={code}
              onCodeChange={setCode}
              language={language}
              fontSize={fontSize}
              editorTheme={editorTheme}
              indentation={indentation}
            />
          </main>
        </SidebarInset>
      </div>
  );
}
