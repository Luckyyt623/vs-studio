"use client";

import { useState } from 'react';
import { CodeEditor } from '@/components/app/code-editor';
import { FileControls } from '@/components/app/file-controls';
import { SettingsPanel } from '@/components/app/settings-panel';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
  SidebarTitle,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from '@/components/ui/sidebar-custom'; // Assuming a custom sidebar or similar
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocalStorage } from '@/hooks/use-local-storage';
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

  const handleLoadFile = (content: string, name: string) => {
    setCode(content);
    setFileName(name);
  };

  return (
      <div className="flex h-screen bg-background">
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} side="left">
          <SidebarHeader>
            <SidebarTitle>
              <TerminalSquare className="w-6 h-6 mr-2 text-accent" />
              CodeWrite Mobile
            </SidebarTitle>
          </SidebarHeader>
          <ScrollArea className="flex-grow">
            <SidebarContent>
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
            </SidebarContent>
          </ScrollArea>
          <SidebarFooter className="p-4 text-xs text-muted-foreground">
            Powered by AI
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-2 border-b bg-secondary border-border h-14">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="md:hidden">
              <PanelLeft className="w-5 h-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
             <div className="md:hidden text-sm font-medium truncate"> {/* Hidden on md+ because sidebar trigger moves */}
              {fileName}
            </div>
            <div className="hidden md:flex items-center">
              <SidebarTrigger /> {/* Standard sidebar trigger for desktop */}
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
