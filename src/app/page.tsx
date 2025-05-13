
"use client";

import type { Key, ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { CodeEditor } from '@/components/app/code-editor';
import { SettingsPanel } from '@/components/app/settings-panel';
import { AiToolsPanel } from '@/components/app/ai-tools-panel';
import { PushNotificationsPanel } from '@/components/app/push-notifications-panel';
import { CodeOutputPanel } from '@/components/app/code-output-panel';
import { PythonTerminal, type TerminalHistoryItem } from '@/components/app/python-terminal';
import { DebuggingPanel } from '@/components/app/debugging-panel';
import { FirebaseTestLabPanel } from '@/components/app/test-lab-panel';
import { AndroidEmulatorPanel } from '@/components/app/android-emulator-panel';
import { IosSimulatorPanel } from '@/components/app/ios-simulator-panel';
import { OfflineSyncPanel } from '@/components/app/offline-sync-panel';
import { usePyodide, type PythonExecutionResult } from '@/hooks/use-pyodide';
import { TopBar } from '@/components/layout/top-bar';
import { ActivityBar } from '@/components/layout/activity-bar';
import { ExplorerPanel } from '@/components/layout/explorer-panel';
import { FileTree } from '@/components/layout/file-tree'; // New component
import { SearchPanel } from '@/components/layout/search-panel'; // New component
import { SourceControlPanel } from '@/components/layout/source-control-panel'; // New component
import { ExtensionsPanel } from '@/components/layout/extensions-panel'; // New component
import { RightPanel } from '@/components/layout/right-panel';
import { BottomPanel } from '@/components/layout/bottom-panel';
import { EditorArea } from '@/components/layout/editor-area';
import { StatusBar } from '@/components/layout/status-bar'; // New component
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_FONT_SIZE,
  DEFAULT_EDITOR_THEME,
  DEFAULT_INDENTATION,
  type EditorTheme,
} from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Activity, PanelTab } from '@/lib/enums'; // Updated import


export default function CodeWriteMobilePage() {
  const [code, setCode] = useLocalStorage<string>('codewrite-code', '');
  const [fileName, setFileName] = useLocalStorage<string>('codewrite-filename', 'untitled.txt');
  const [language, setLanguage] = useLocalStorage<string>('codewrite-language', DEFAULT_LANGUAGE);
  const [fontSize, setFontSize] = useLocalStorage<number>('codewrite-fontsize', DEFAULT_FONT_SIZE);
  const [editorTheme, setEditorTheme] = useLocalStorage<EditorTheme>('codewrite-editortheme', DEFAULT_EDITOR_THEME);
  const [indentation, setIndentation] = useLocalStorage<number>('codewrite-indentation', DEFAULT_INDENTATION);
  // Removed projectType state as it wasn't used after previous refactors

  const [primarySidebarOpen, setPrimarySidebarOpen] = useState(true); // Left panel (Explorer, Debug, etc.)
  const [rightPanelOpen, setRightPanelOpen] = useState(false); // Right panel (Web Preview/Gemini) - Start closed
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true); // Bottom panel (Problems, Output, Console, Terminal)

  const [activeActivity, setActiveActivity] = useState<Activity>(Activity.Explorer);
  const [activeRightTab, setActiveRightTab] = useState<PanelTab | null>(null); // Can be null if right panel is closed or no tab selected
  const [activeBottomTab, setActiveBottomTab] = useState<PanelTab>(PanelTab.Terminal); // Default to Terminal

  const { toast } = useToast();
  const pyodideManager = usePyodide();

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Hydration-safe state for filename derived from local storage
  const [hydratedFileName, setHydratedFileName] = useState('untitled.txt');
  useEffect(() => {
    if (hasMounted) {
      setHydratedFileName(fileName);
    }
  }, [hasMounted, fileName]);

  // Hydration-safe state for pyodide loading/error status
  const [pyodideStatus, setPyodideStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    if (hasMounted) {
      if (pyodideManager.pyodideError) {
        setPyodideStatus('error');
      } else if (pyodideManager.isPyodideReady) {
        setPyodideStatus('ready');
      } else {
        setPyodideStatus('loading');
      }
    }
  }, [hasMounted, pyodideManager.isPyodideReady, pyodideManager.pyodideError]);


  // Output states
  const [iframeSrcDoc, setIframeSrcDoc] = useState('');
  const [runOutput, setRunOutput] = useState<PythonExecutionResult | { stdout?: string; stderr?: string; error?: string; } | null>(null); // Generic output for console/output tabs
  const [pythonTerminalHistory, setPythonTerminalHistory] = useState<TerminalHistoryItem[]>([]);
  const [problems, setProblems] = useState<{ id: string; file: string; message: string; severity: 'error' | 'warning' | 'info' }[]>([]); // Placeholder for problems

  useEffect(() => {
    if (hasMounted && pyodideManager.pyodideError) {
      toast({
        title: "Pyodide Error",
        description: `Failed to load Python environment: ${pyodideManager.pyodideError}`,
        variant: "destructive",
      });
      setPythonTerminalHistory(prev => [...prev, { id: Date.now().toString(), type: 'error', content: `Pyodide Error: ${pyodideManager.pyodideError}` }]);
       setRunOutput({stderr: `Pyodide Error: ${pyodideManager.pyodideError}`});
       setActiveBottomTab(PanelTab.DebugConsole); // Show error in console
    }
  }, [hasMounted, pyodideManager.pyodideError, toast]);

   useEffect(() => {
     if (hasMounted && language === 'python' && pyodideManager.isPyodideReady && pythonTerminalHistory.length === 0) {
        setPythonTerminalHistory([{id: 'init-msg', type: 'info', content: 'Python environment ready. Use "pip install <package>" to install packages.'}]);
     }
  }, [hasMounted, language, pyodideManager.isPyodideReady, pythonTerminalHistory.length]);

  // Load file handler remains the same
  const handleLoadFile = (content: string, name: string) => {
    setCode(content);
    setFileName(name);
    const newLang = getFileLanguage(name);
    setLanguage(newLang);
     if (newLang !== 'python') {
        setRunOutput(null); // Clear Python output if language changes
        if (activeBottomTab === PanelTab.Terminal) {
          setActiveBottomTab(PanelTab.DebugConsole); // Switch from terminal if not Python
        }
      }
  };

  // getFileLanguage remains the same
  const getFileLanguage = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js': return 'javascript';
      case 'py': return 'python';
      case 'java': return 'java';
      case 'cs': return 'csharp';
      case 'php': return 'php';
      case 'rb': return 'ruby';
      case 'go': return 'go';
      case 'swift': return 'swift';
      case 'ts': return 'typescript';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'cpp':
      case 'cxx':
      case 'cc': return 'cpp';
      default: return 'plaintext';
    }
  };

  // handleAiGeneratedContentInsert remains the same
  const handleAiGeneratedContentInsert = (content: string, type: 'code' | 'docs' | 'tests') => {
    setCode(prevCode => `${prevCode}\n\n${type === 'docs' ? `/**\n * ${content.split('\n').join('\n * ')}\n */` : content}`);
    toast({
      title: "Content Inserted",
      description: `AI-generated ${type} have been appended to the editor.`,
    });
    setActiveRightTab(null); // Close AI panel after insert
    setRightPanelOpen(false);
  };

  const handleRunCode = async () => {
    setRunOutput(null);
    setIframeSrcDoc('');
    setBottomPanelOpen(true); // Ensure bottom panel is open
    setRightPanelOpen(false); // Close right panel

    if (language === 'python') {
      if (!pyodideManager.isPyodideReady) {
        toast({ title: "Python Not Ready", description: "Python environment is still loading or encountered an error.", variant: "destructive" });
        const errorResult = { stdout: '', stderr: 'Python environment is not ready.'};
        setRunOutput(errorResult);
        setActiveBottomTab(PanelTab.DebugConsole); // Show output in Debug Console tab
        return;
      }
      toast({ title: "Running Python", description: "Executing Python code..." });
      const result = await pyodideManager.runPython(code);
      setRunOutput(result);
      setActiveBottomTab(PanelTab.DebugConsole); // Show output in Debug Console tab
    } else if (language === 'cpp') {
        const result = {
            stdout: '',
            stderr: 'C++ execution in the browser is not supported. This typically requires a server-side compilation and execution environment.',
        };
      setRunOutput(result);
      setActiveBottomTab(PanelTab.DebugConsole); // Show output in Debug Console tab
    } else {
      // Logic for HTML, CSS, JS preview
      let srcDocContent = '';
      // Basic styling and console override script (can be improved)
       const iframeStyle = `<style>body { margin: 10px; font-family: sans-serif; color: hsl(var(--foreground)); background-color: hsl(var(--background)); } .console-log { border-bottom: 1px solid hsl(var(--border)); padding: 4px 0; font-family: monospace; white-space: pre-wrap; word-break: break-all; } .console-error { color: hsl(var(--destructive)); } .console-warn { color: #F1FA8C; } ::-webkit-scrollbar { width: 8px; height: 8px; } ::-webkit-scrollbar-track { background: hsl(var(--background)); } ::-webkit-scrollbar-thumb { background: hsl(var(--secondary)); border-radius: 4px; } ::-webkit-scrollbar-thumb:hover { background: hsl(var(--muted)); }</style>`;
       const consoleOverride = `<script> const originalConsoleLog = console.log; const originalConsoleError = console.error; const originalConsoleWarn = console.warn; const outputDiv = document.body.querySelector('#console-output-container') || document.createElement('div'); outputDiv.id = 'console-output-container'; outputDiv.style.marginTop = '20px'; outputDiv.style.borderTop = '1px dashed hsl(var(--border))'; outputDiv.style.paddingTop = '10px'; if (!document.body.contains(outputDiv)) document.body.appendChild(outputDiv); function formatArg(arg) { try { return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg); } catch (e) { return String(arg); } } const createLogEntry = (className, prefix, ...args) => { const msg = args.map(formatArg).join(' '); const logEntry = document.createElement('div'); logEntry.className = 'console-log ' + className; logEntry.textContent = prefix + msg; outputDiv.appendChild(logEntry); }; console.log = (...args) => { originalConsoleLog.apply(console, args); createLogEntry('', '', ...args); }; console.error = (...args) => { originalConsoleError.apply(console, args); createLogEntry('console-error', 'ERROR: ', ...args); }; console.warn = (...args) => { originalConsoleWarn.apply(console, args); createLogEntry('console-warn', 'WARN: ', ...args); }; window.addEventListener('error', function(event) { console.error(event.message, 'at', event.filename + ':' + event.lineno + ':' + event.colno); }); <\/script>`;

      if (language === 'html') {
        // Simple injection logic, might need refinement
        if (code.includes('</body>')) {
           srcDocContent = code.replace('</body>', `${consoleOverride}</body>`);
           if(srcDocContent.includes('</head>')){
               srcDocContent = srcDocContent.replace('</head>', `${iframeStyle}</head>`);
           } else {
               // Add head if missing
               srcDocContent = `<!DOCTYPE html><html><head>${iframeStyle}</head>${srcDocContent.substring(srcDocContent.indexOf('<body'))}</html>`
           }
        } else {
          srcDocContent = `<!DOCTYPE html><html><head>${iframeStyle}</head><body>${code}${consoleOverride}</body></html>`;
        }
      } else if (language === 'javascript') {
        srcDocContent = `<!DOCTYPE html><html><head>${iframeStyle}</head><body><script>${code}<\/script>${consoleOverride}</body></html>`;
      } else if (language === 'css') {
        srcDocContent = `<!DOCTYPE html><html><head><style>${code}<\/style>${iframeStyle}${consoleOverride}</head><body><p style='color:hsl(var(--foreground));'>CSS styles applied. Add HTML content or inspect this frame.</p></body></html>`;
      } else {
         toast({
          title: "Unsupported Language for Preview",
          description: `Live preview for ${language} is not available. Output appears in the panels below.`,
        });
        srcDocContent = `<!DOCTYPE html><html><head>${iframeStyle}</head><body><p style='color:hsl(var(--foreground));'>Code execution preview is primarily for HTML, CSS, and JavaScript.</p></body></html>`;
      }

      setIframeSrcDoc(srcDocContent);
      setRightPanelOpen(true);
      setActiveRightTab(PanelTab.WebPreview); // Show preview in Web Preview tab
      setActiveBottomTab(PanelTab.DebugConsole); // Show console logs in Debug Console
    }
  };

  // handlePythonTerminalCommand remains similar
   const handlePythonTerminalCommand = async (command: string) => {
    setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString(), type: 'command', content: command}]);
    if (!pyodideManager.isPyodideReady) {
      setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString() + '-err', type: 'error', content: "Pyodide not ready."}]);
      return;
    }

    const parts = command.toLowerCase().split(/\s+/);
    if (parts[0] === 'pip' && parts[1] === 'install' && parts.length > 2) {
      const packagesToInstall = parts.slice(2).filter(pkg => pkg.length > 0);
      if (packagesToInstall.length > 0) {
        const result = await pyodideManager.installPackages(packagesToInstall);
        setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString() + '-res', type: result.success ? 'output' : 'error', content: result.message}]);
      } else {
        setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString() + '-warn', type: 'info', content: "Usage: pip install <package_name>"}]);
      }
    } else if (command.trim()) {
       setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString() + '-info', type: 'info', content: `Running as Python: ${command}`}]);
       const result = await pyodideManager.runPython(command);
       if (result.stdout) setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString() + '-out', type: 'output', content: result.stdout}]);
       if (result.stderr) setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString() + '-err', type: 'error', content: result.stderr}]);
    } else {
        setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString() + '-empty', type: 'info', content: ""}]); // Handle empty command
    }
  };


  // Manage panel visibility based on activity
  const handleActivityChange = (activity: Activity) => {
    setActiveActivity(activity);
    setPrimarySidebarOpen(true); // Always open sidebar when changing activity
    // Potentially close right panel unless it's relevant to the new activity?
    setRightPanelOpen(false);
    setActiveRightTab(null);

     // Logic to open specific panels for certain activities
    if (activity === Activity.Debug) {
      setBottomPanelOpen(true);
      setActiveBottomTab(PanelTab.DebugConsole);
    }
    // Add more logic here if needed for other activities
  };

  // Toggle handlers - kept for potential future use but removing buttons
  const togglePrimarySidebar = () => setPrimarySidebarOpen(!primarySidebarOpen);
  const toggleRightPanel = () => {
      setRightPanelOpen(!rightPanelOpen);
      if (rightPanelOpen) setActiveRightTab(null); // Clear tab when closing
  }
  const toggleBottomPanel = () => setBottomPanelOpen(!bottomPanelOpen);

   // Function to render the correct content in the primary sidebar
  const renderExplorerPanelContent = () => {
    switch (activeActivity) {
      case Activity.Explorer:
        return <FileTree
                  fileName={fileName}
                  onLoadFile={handleLoadFile} // Pass if FileTree handles loading
                />;
      case Activity.Search:
        return <SearchPanel />; // Placeholder
      case Activity.Git:
        return <SourceControlPanel />; // Placeholder
      case Activity.Debug:
         return (
           <div className="p-2 space-y-4">
              <DebuggingPanel />
              {/* Maybe add sections for Watch, Call Stack here later */}
           </div>
         );
      case Activity.Firebase:
        return (
            <div className="p-2 space-y-4">
                 <Accordion type="single" collapsible className="w-full">
                     <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xs py-2">Emulators</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                            <AndroidEmulatorPanel />
                            <IosSimulatorPanel />
                        </AccordionContent>
                     </AccordionItem>
                     <AccordionItem value="item-2">
                        <AccordionTrigger className="text-xs py-2">Testing & Sync</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                            <FirebaseTestLabPanel />
                            <OfflineSyncPanel />
                        </AccordionContent>
                     </AccordionItem>
                     <AccordionItem value="item-3">
                        <AccordionTrigger className="text-xs py-2">Messaging</AccordionTrigger>
                        <AccordionContent>
                            <PushNotificationsPanel />
                        </AccordionContent>
                     </AccordionItem>
                     {/* Add more Firebase service panels here */}
                 </Accordion>
            </div>
        );
      case Activity.Extensions:
        return <ExtensionsPanel />; // Placeholder
      case Activity.Settings:
        return (
            <div className="p-2 space-y-4">
                 <SettingsPanel
                    language={language}
                    onLanguageChange={(lang) => {
                        setLanguage(lang);
                        if (lang !== 'python') {
                            setRunOutput(null); // Clear output if not python
                            if (activeBottomTab === PanelTab.Terminal) {
                                setActiveBottomTab(PanelTab.DebugConsole);
                            }
                        }
                    }}
                    fontSize={fontSize}
                    onFontSizeChange={setFontSize}
                    editorTheme={editorTheme}
                    onEditorThemeChange={setEditorTheme}
                    indentation={indentation}
                    onIndentationChange={setIndentation}
                  />
                  {/* Python Status Indicator */}
                  {hasMounted && (
                     <div className="px-1 pt-2 border-t border-border">
                        <p className="text-xs font-medium mb-1">Environment Status:</p>
                        {language === 'python' ? (
                            <>
                                {pyodideStatus === 'loading' && (
                                    <p className="text-xs text-muted-foreground">Python: Loading...</p>
                                )}
                                {pyodideStatus === 'error' && (
                                    <p className="text-xs text-destructive">Python: Error!</p>
                                )}
                                {pyodideStatus === 'ready' && (
                                    <p className="text-xs text-green-500">Python: Ready.</p>
                                )}
                             </>
                         ) : (
                             <p className="text-xs text-muted-foreground">{language ? `${getFileLanguage(fileName)}: Active` : 'No active environment'}</p>
                         )}
                     </div>
                 )}
            </div>
        );
      default:
        return <FileTree fileName={fileName} onLoadFile={handleLoadFile}/>; // Default to Explorer
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <TopBar
        projectName="CodeWrite Mobile"
        fileName={hydratedFileName} // Use hydrated state
        onRunCode={handleRunCode}
        isRunDisabled={!hasMounted || (pyodideStatus === 'loading' && language === 'python')}
        isLoading={hasMounted && pyodideManager.isInstallingPackages}
      />

      <div className="flex flex-1 overflow-hidden">
        <ActivityBar active={activeActivity} onSelect={handleActivityChange} />

        {primarySidebarOpen && (
          <ExplorerPanel activeActivity={activeActivity}>
             {/* Content is now dynamically rendered based on activeActivity */}
             {renderExplorerPanelContent()}
          </ExplorerPanel>
        )}

        {/* Main Area: Editor + Bottom Panel */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <EditorArea fileName={hydratedFileName}>
             <CodeEditor
                code={code}
                onCodeChange={setCode}
                language={language}
                fontSize={fontSize}
                editorTheme={editorTheme}
                indentation={indentation}
              />
          </EditorArea>

          {bottomPanelOpen && (
            <BottomPanel
              activeTab={activeBottomTab}
              onTabChange={setActiveBottomTab}
              onClose={toggleBottomPanel}
              problemsCount={problems.length} // Pass problems count
            >
               {/* Render content based on activeBottomTab */}
               {activeBottomTab === PanelTab.Problems && (
                    <div className="p-4 text-muted-foreground h-full text-sm">
                        {problems.length === 0 ? "No problems detected." :
                            <ul>
                                {problems.map(p => <li key={p.id}>{p.message} ({p.file})</li>)}
                             </ul>
                        }
                    </div>
               )}
               {activeBottomTab === PanelTab.Output && (
                 <CodeOutputPanel
                    textOutput={runOutput ?? {}} // Show general output here
                    onClose={toggleBottomPanel}
                    className="h-full"
                    language={language}
                    isConsole={false} // Differentiate from Debug Console
                    activeTab={activeBottomTab} // Pass activeTab
                  />
               )}
               {activeBottomTab === PanelTab.DebugConsole && (
                 <CodeOutputPanel
                    textOutput={runOutput ?? {}} // Show console/stderr here
                    onClose={toggleBottomPanel}
                    className="h-full"
                    language={language}
                    isConsole={true} // Indicate this is the console view
                    activeTab={activeBottomTab} // Pass activeTab
                  />
               )}
               {activeBottomTab === PanelTab.Terminal && language === 'python' && (
                   <PythonTerminal
                        onCommand={handlePythonTerminalCommand}
                        history={pythonTerminalHistory}
                        isLoading={hasMounted && pyodideManager.isInstallingPackages}
                        isDisabled={!hasMounted || pyodideStatus !== 'ready'}
                        className="h-full"
                      />
                )}
                 {activeBottomTab === PanelTab.Terminal && language !== 'python' && (
                     <div className="p-4 text-muted-foreground h-full flex items-center justify-center text-sm">
                         Terminal is available for Python projects only.
                     </div>
                 )}
            </BottomPanel>
          )}
        </div>

        {rightPanelOpen && activeRightTab !== null && (
          <RightPanel
            activeTab={activeRightTab}
            onTabChange={setActiveRightTab}
            onClose={toggleRightPanel}
           >
             {/* Render content based on activeRightTab */}
              {activeRightTab === PanelTab.WebPreview && (
                 <CodeOutputPanel
                    srcDoc={iframeSrcDoc} // Web preview goes here
                    onClose={toggleRightPanel}
                    className="h-full"
                    language={language}
                    showQrCodeToggle={!!iframeSrcDoc}
                    activeTab={activeRightTab} // Pass activeTab
                  />
              )}
              {activeRightTab === PanelTab.Gemini && (
                   <AiToolsPanel
                    currentCode={code}
                    currentLanguage={language}
                    onGeneratedContentInsert={handleAiGeneratedContentInsert}
                  />
              )}
           </RightPanel>
        )}

      </div>
      <StatusBar
        language={language}
        fileName={hydratedFileName}
        pyodideStatus={pyodideStatus}
        // Add other status props like line/col, git branch etc. later
      />
    </div>
  );
}

    
