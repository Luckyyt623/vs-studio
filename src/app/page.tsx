
"use client";

import type { Key, ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { CodeEditor } from '@/components/app/code-editor';
import { FileControls } from '@/components/app/file-controls';
import { SettingsPanel } from '@/components/app/settings-panel';
import { CodeOutputPanel } from '@/components/app/code-output-panel';
import { PythonTerminal, type TerminalHistoryItem } from '@/components/app/python-terminal';
import { usePyodide, type PythonExecutionResult } from '@/hooks/use-pyodide';
import {
  Sidebar,
  SidebarContent as CustomSidebarContent, 
  SidebarHeader as CustomSidebarHeader, 
  SidebarInset,
  SidebarTitle as CustomSidebarTitle,   
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter as CustomSidebarFooter, 
} from '@/components/ui/sidebar-custom';
import { SheetHeader as ShadSheetHeader, SheetTitle as ShadSheetTitle, SheetDescription as ShadSheetDescription } from '@/components/ui/sheet'; 
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { TerminalSquare, PanelLeft, Play, Loader2 } from 'lucide-react';
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
  const [pythonRunOutput, setPythonRunOutput] = useState<PythonExecutionResult | null>(null);
  const [pythonTerminalHistory, setPythonTerminalHistory] = useState<TerminalHistoryItem[]>([]);
  const [activeBottomTab, setActiveBottomTab] = useState<'output' | 'terminal'>('output');

  const pyodideManager = usePyodide();

  useEffect(() => {
    if (pyodideManager.pyodideError) {
      toast({
        title: "Pyodide Error",
        description: `Failed to load Python environment: ${pyodideManager.pyodideError}`,
        variant: "destructive",
      });
      // Add to terminal history as well
      setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString(), type: 'error', content: `Pyodide Error: ${pyodideManager.pyodideError}`}]);
    }
  }, [pyodideManager.pyodideError, toast]);

  useEffect(() => {
     if (language === 'python' && pyodideManager.isPyodideReady && pythonTerminalHistory.length === 0) {
        setPythonTerminalHistory([{id: 'init-msg', type: 'info', content: 'Python environment ready. Use "pip install <package>" to install packages.'}]);
     }
  }, [language, pyodideManager.isPyodideReady, pythonTerminalHistory.length]);


  const handleLoadFile = (content: string, name: string) => {
    setCode(content);
    setFileName(name);
  };

  const handleRunCode = async () => {
    setPythonRunOutput(null); // Clear previous Python output
    setIframeSrcDoc(''); // Clear previous web output

    if (language === 'python') {
      if (!pyodideManager.isPyodideReady) {
        toast({ title: "Python Not Ready", description: "Python environment is still loading or encountered an error.", variant: "destructive" });
        setPythonRunOutput({ stdout: '', stderr: 'Python environment is not ready.'});
        setShowOutputPanel(true);
        setActiveBottomTab('output');
        return;
      }
      toast({ title: "Running Python", description: "Executing Python code..." });
      const result = await pyodideManager.runPython(code);
      setPythonRunOutput(result);
      setShowOutputPanel(true);
      setActiveBottomTab('output');
    } else if (language === 'cpp') {
      setPythonRunOutput({ 
        stdout: '', 
        stderr: 'C++ execution in the browser is a preview feature and not supported for running code. This typically requires a server-side compilation and execution environment.',
      });
      setShowOutputPanel(true);
      setActiveBottomTab('output');
    } else { // HTML, CSS, JavaScript
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
          // Code omitted for brevity, same as original
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        const outputDiv = document.body.querySelector('#console-output-container') || document.createElement('div');
        if (!document.body.querySelector('#console-output-container')) {
           outputDiv.id = 'console-output-container';
           document.body.appendChild(outputDiv);
        }

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
        <\/script>
      `;

      if (language === 'html') {
        if (code.trim().toLowerCase().includes('<html')) {
           // If full HTML document, inject style and script carefully
          const SCRIPT_PLACEHOLDER = '<!-- SCRIPT_PLACEHOLDER -->';
          const STYLE_PLACEHOLDER = '<!-- STYLE_PLACEHOLDER -->';
          let tempCode = code;
          if (tempCode.includes('</head>')) {
            tempCode = tempCode.replace('</head>', `${STYLE_PLACEHOLDER}${SCRIPT_PLACEHOLDER}</head>`);
          } else if (tempCode.includes('<body>')) {
             tempCode = tempCode.replace('<body>', `<head>${STYLE_PLACEHOLDER}${SCRIPT_PLACEHOLDER}</head><body>`);
          } else {
             tempCode = `<head>${STYLE_PLACEHOLDER}${SCRIPT_PLACEHOLDER}</head><body>${tempCode}</body>`;
          }
          srcDocContent = tempCode.replace(SCRIPT_PLACEHOLDER, consoleOverride).replace(STYLE_PLACEHOLDER, iframeStyle);

        } else { // HTML fragment
          srcDocContent = `<!DOCTYPE html><html><head>${iframeStyle}</head><body>${code}${consoleOverride}</body></html>`;
        }
      } else if (language === 'javascript') {
        srcDocContent = `<!DOCTYPE html><html><head>${iframeStyle}</head><body>${consoleOverride}<script>${code}<\/script></body></html>`;
      } else if (language === 'css') {
        srcDocContent = `<!DOCTYPE html><html><head><style>${code}<\/style>${iframeStyle}${consoleOverride}</head><body><p>CSS styles applied. Add HTML content or inspect this frame to see results.</p></body></html>`;
      } else {
        toast({
          title: "Unsupported Language",
          description: `Live preview for ${language} is not available. Previews are supported for HTML, CSS, and JavaScript. Python/C++ output appears in a text console.`,
        });
        srcDocContent = `<!DOCTYPE html><html><head>${iframeStyle}</head><body><p>Code execution preview is primarily for HTML, CSS, and JavaScript. Running ${language} code is not directly supported in this preview.</p></body></html>`;
      }
      setIframeSrcDoc(srcDocContent);
      setShowOutputPanel(true);
      setActiveBottomTab('output');
    }
  };

  const handlePythonTerminalCommand = async (command: string) => {
    setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString(), type: 'command', content: command}]);
    if (!pyodideManager.isPyodideReady) {
      setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString() + '-err', type: 'error', content: "Pyodide not ready."}]);
      return;
    }

    // Basic command parsing for "pip install"
    const parts = command.toLowerCase().split(/\s+/);
    if (parts[0] === 'pip' && parts[1] === 'install' && parts.length > 2) {
      const packagesToInstall = parts.slice(2).filter(pkg => pkg.length > 0);
      if (packagesToInstall.length > 0) {
        const result = await pyodideManager.installPackages(packagesToInstall);
        setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString() + '-res', type: result.success ? 'output' : 'error', content: result.message}]);
      } else {
        setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString() + '-warn', type: 'info', content: "Usage: pip install <package_name>"}]);
      }
    } else {
      setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString() + '-info', type: 'info', content: `Command not recognized: ${command}. Only "pip install <package>" is supported.`}]);
    }
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
            <>
              <ShadSheetHeader className="p-4 border-b border-sidebar-border">
                <ShadSheetTitle className="text-lg font-semibold flex items-center text-sidebar-foreground">
                  {sidebarTitleContent}
                </ShadSheetTitle>
                 <ShadSheetDescription className="text-xs text-muted-foreground">
                  { pyodideManager.isPyodideLoading && language === 'python' && "Python loading..." }
                  { pyodideManager.pyodideError && language === 'python' && "Python error!" }
                </ShadSheetDescription>
              </ShadSheetHeader>
            </>
          ) : (
            <CustomSidebarHeader>
              <CustomSidebarTitle>
                {sidebarTitleContent}
              </CustomSidebarTitle>
               { pyodideManager.isPyodideLoading && language === 'python' && 
                <p className="text-xs text-muted-foreground mt-1">Python environment loading...</p> }
               { pyodideManager.pyodideError && language === 'python' && 
                <p className="text-xs text-destructive mt-1">Python environment error!</p> }
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
                    onLanguageChange={(lang) => {
                      setLanguage(lang);
                      // If switching away from Python, clear Python-specific output/history
                      if (lang !== 'python') {
                        setPythonRunOutput(null);
                        // setPythonTerminalHistory([]); // Optionally clear history or keep it
                      }
                    }}
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
            Powered by AI & Pyodide
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
               {pyodideManager.isPyodideLoading && language === 'python' && (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              )}
              <Button onClick={handleRunCode} size="sm" variant="outline" className="hidden md:flex items-center" disabled={pyodideManager.isPyodideLoading && language === 'python'}>
                <Play className="w-4 h-4 mr-2" />
                Run Code
              </Button>
              <Button onClick={handleRunCode} size="icon" variant="ghost" className="md:hidden" disabled={pyodideManager.isPyodideLoading && language === 'python'}>
                <Play className="w-5 h-5" />
                <span className="sr-only">Run Code</span>
              </Button>
            </div>
          </header>
          
          <div className="flex flex-col flex-1 overflow-hidden">
            <div 
              className={cn(
                "overflow-auto",
                showOutputPanel ? "flex-[3_3_0%]" : "flex-1",
                "p-0 md:p-4"
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
              <div className="flex-[2_2_0%] overflow-hidden border-t border-border">
                {language === 'python' && pyodideManager.isPyodideReady ? (
                  <Tabs defaultValue={activeBottomTab} value={activeBottomTab} onValueChange={(value) => setActiveBottomTab(value as 'output' | 'terminal')} className="h-full flex flex-col">
                    <TabsList className="shrink-0 rounded-none border-b border-border bg-secondary justify-start px-2 py-1 h-auto">
                      <TabsTrigger value="output" className="text-xs px-3 py-1.5 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Output</TabsTrigger>
                      <TabsTrigger value="terminal" className="text-xs px-3 py-1.5 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Terminal</TabsTrigger>
                    </TabsList>
                    <TabsContent value="output" className="flex-grow overflow-auto m-0 p-0">
                      <CodeOutputPanel
                        textOutput={pythonRunOutput}
                        onClose={() => setShowOutputPanel(false)}
                        className="h-full"
                        language={language}
                      />
                    </TabsContent>
                    <TabsContent value="terminal" className="flex-grow overflow-auto m-0 p-0">
                      <PythonTerminal
                        onCommand={handlePythonTerminalCommand}
                        history={pythonTerminalHistory}
                        isLoading={pyodideManager.isInstallingPackages}
                        isDisabled={!pyodideManager.isPyodideReady || pyodideManager.isPyodideLoading}
                        className="h-full"
                      />
                    </TabsContent>
                  </Tabs>
                ) : ( // For HTML/JS/CSS or C++ (preview) or Python not ready
                  <CodeOutputPanel
                    srcDoc={iframeSrcDoc}
                    textOutput={pythonRunOutput} // Handles C++ message or Python loading errors
                    onClose={() => setShowOutputPanel(false)}
                    className="h-full"
                    language={language}
                  />
                )}
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
  );
}
