
"use client";

import { useState } from 'react';
import { CodeEditor } from '@/components/app/code-editor';
import { FileControls } from '@/components/app/file-controls';
import { SettingsPanel } from '@/components/app/settings-panel';
import { CodeOutputPanel } from '@/components/app/code-output-panel';
import {
  Sidebar,
  SidebarContent as CustomSidebarContent, 
  SidebarHeader as CustomSidebarHeader, 
  SidebarInset,
  // SidebarTrigger, // SidebarTrigger from sidebar-custom is not used for the main sidebar toggle here
  SidebarTitle as CustomSidebarTitle,   
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter as CustomSidebarFooter, 
} from '@/components/ui/sidebar-custom';
import { SheetHeader as ShadSheetHeader, SheetTitle as ShadSheetTitle } from '@/components/ui/sheet'; 
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_FONT_SIZE,
  DEFAULT_EDITOR_THEME,
  DEFAULT_INDENTATION,
  type EditorTheme,
} from '@/lib/constants';
import { TerminalSquare, PanelLeft, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CodeWriteMobilePage() {
  const [code, setCode] = useLocalStorage<string>('codewrite-code', '');
  const [fileName, setFileName] = useLocalStorage<string>('codewrite-filename', 'untitled.txt');
  const [language, setLanguage] = useLocalStorage<string>('codewrite-language', DEFAULT_LANGUAGE);
  const [fontSize, setFontSize] = useLocalStorage<number>('codewrite-fontsize', DEFAULT_FONT_SIZE);
  const [editorTheme, setEditorTheme] = useLocalStorage<EditorTheme>('codewrite-editortheme', DEFAULT_EDITOR_THEME);
  const [indentation, setIndentation] = useLocalStorage<number>('codewrite-indentation', DEFAULT_INDENTATION);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobileClient = useIsMobile();
  const { toast } = useToast();

  const [showOutputPanel, setShowOutputPanel] = useState(false);
  const [iframeSrcDoc, setIframeSrcDoc] = useState('');

  const handleLoadFile = (content: string, name: string) => {
    setCode(content);
    setFileName(name);
  };

  const handleRunCode = () => {
    let srcDocContent = '';
    const iframeStyle = `<style>
      body { margin: 10px; font-family: sans-serif; color: #EEE; background-color: #282A36; }
      .console-log { border-bottom: 1px solid #44475A; padding: 4px 0; font-family: monospace; white-space: pre-wrap; word-break: break-all; }
      .console-error { color: #FF5555; }
      .console-warn { color: #F1FA8C; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: #282A36; }
      ::-webkit-scrollbar-thumb { background: #44475A; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: #6272A4; }
    </style>`;

    const consoleOverride = `
      <script>
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        const outputDiv = document.createElement('div');
        document.body.appendChild(outputDiv);

        function formatArg(arg) {
          if (typeof arg === 'undefined') return 'undefined';
          if (arg === null) return 'null';
          if (typeof arg === 'string') return arg;
          if (typeof arg === 'object' || typeof arg === 'function') {
            try {
              return JSON.stringify(arg, null, 2);
            } catch (e) {
              return arg.toString();
            }
          }
          return String(arg);
        }

        const createLogEntry = (className, prefix, ...args) => {
          const msg = args.map(formatArg).join(' ');
          const logEntry = document.createElement('div');
          logEntry.className = 'console-log ' + className;
          logEntry.textContent = prefix + msg;
          outputDiv.appendChild(logEntry);
        };

        console.log = (...args) => {
          originalConsoleLog.apply(console, args);
          createLogEntry('', '', ...args);
        };
        console.error = (...args) => {
          originalConsoleError.apply(console, args);
          createLogEntry('console-error', 'ERROR: ', ...args);
        };
        console.warn = (...args) => {
          originalConsoleWarn.apply(console, args);
          createLogEntry('console-warn', 'WARN: ', ...args);
        };
        window.addEventListener('error', function(event) {
          console.error(event.message, 'at', event.filename + ':' + event.lineno + ':' + event.colno);
        });
      </script>
    `;

    if (language === 'html') {
      if (code.trim().toLowerCase().includes('<html')) {
        srcDocContent = code; 
      } else {
        srcDocContent = `<!DOCTYPE html><html><head>${iframeStyle}</head><body>${code}${consoleOverride}</body></html>`;
      }
    } else if (language === 'javascript') {
      srcDocContent = `<!DOCTYPE html><html><head>${iframeStyle}</head><body>${consoleOverride}<script>${code}<\/script></body></html>`;
    } else if (language === 'css') {
      srcDocContent = `<!DOCTYPE html><html><head><style>${code}<\/style>${iframeStyle}${consoleOverride}</head><body><p>CSS styles applied. Add HTML content or inspect this frame to see results.</p></body></html>`;
    } else {
      toast({
        title: "Unsupported Language",
        description: `Live preview for ${language} is not available. Previews are supported for HTML, CSS, and JavaScript.`,
      });
      srcDocContent = `<!DOCTYPE html><html><head>${iframeStyle}</head><body><p>Code execution preview is primarily for HTML, CSS, and JavaScript. Running ${language} code is not directly supported in this preview.</p></body></html>`;
    }
    setIframeSrcDoc(srcDocContent);
    setShowOutputPanel(true);
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
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="md:hidden">
                <PanelLeft className="w-5 h-5" />
                <span className="sr-only">Open sidebar</span>
              </Button>
              <div className="md:hidden text-sm font-medium truncate ml-2">
                {fileName}
              </div>
              <div className="hidden md:flex items-center ml-2">
                <span className="text-sm font-medium truncate">{fileName}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleRunCode} size="sm" variant="outline" className="hidden md:flex items-center">
                <Play className="w-4 h-4 mr-2" />
                Run Code
              </Button>
              <Button onClick={handleRunCode} size="icon" variant="ghost" className="md:hidden">
                <Play className="w-5 h-5" />
                <span className="sr-only">Run Code</span>
              </Button>
            </div>
          </header>
          
          <div className="flex flex-col flex-1 overflow-hidden"> {/* Main content area now a flex column */}
            <div 
              className={cn(
                "overflow-auto",
                showOutputPanel ? "flex-[3_3_0%]" : "flex-1", // Takes 3/5 height when output is visible, or full height
                "p-0 md:p-4" // Original padding for editor area
              )}
            >
              <CodeEditor
                code={code}
                onCodeChange={setCode}
                language={language}
                fontSize={fontSize}
                editorTheme={editorTheme}
                indentation={indentation}
              />
            </div>
            {showOutputPanel && (
              <div className="flex-[2_2_0%] overflow-hidden border-t border-border"> {/* Takes 2/5 height */}
                <CodeOutputPanel
                  srcDoc={iframeSrcDoc}
                  onClose={() => setShowOutputPanel(false)}
                  className="h-full" 
                />
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
  );
}
