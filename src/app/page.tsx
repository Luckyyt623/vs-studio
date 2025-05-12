
"use client";

import type { Key, ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { CodeEditor } from '@/components/app/code-editor';
import { FileControls } from '@/components/app/file-controls';
import { SettingsPanel } from '@/components/app/settings-panel';
import { AiToolsPanel } from '@/components/app/ai-tools-panel';
import { PushNotificationsPanel } from '@/components/app/push-notifications-panel';
import { CodeOutputPanel } from '@/components/app/code-output-panel';
import { PythonTerminal, type TerminalHistoryItem } from '@/components/app/python-terminal';
import { DebuggingPanel } from '@/components/app/debugging-panel';
import { FirebaseTestLabPanel } from '@/components/app/test-lab-panel';
import { usePyodide, type PythonExecutionResult } from '@/hooks/use-pyodide';
import { TopBar } from '@/components/layout/top-bar';
import { ActivityBar } from '@/components/layout/activity-bar';
import { ExplorerPanel } from '@/components/layout/explorer-panel';
import { RightPanel } from '@/components/layout/right-panel';
import { BottomPanel } from '@/components/layout/bottom-panel';
import { EditorArea } from '@/components/layout/editor-area';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_FONT_SIZE,
  DEFAULT_EDITOR_THEME,
  DEFAULT_INDENTATION,
  DEFAULT_PROJECT_TYPE,
  SUPPORTED_PROJECT_TYPES,
  type EditorTheme,
} from '@/lib/constants';
import { Play, Loader2, PanelLeft, Columns, PanelBottom, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Enum for Activity Bar selection
enum Activity {
  Explorer,
  Search,
  Git,
  Debug,
  Extensions,
  Firebase // Example custom icon
}

// Enum for Right/Bottom Panel Tabs
enum PanelTab {
  WebPreview,
  Gemini,
  Console,
  Terminal,
  // Add more as needed
}

export default function CodeWriteMobilePage() {
  const [code, setCode] = useLocalStorage<string>('codewrite-code', '');
  const [fileName, setFileName] = useLocalStorage<string>('codewrite-filename', 'untitled.txt');
  const [language, setLanguage] = useLocalStorage<string>('codewrite-language', DEFAULT_LANGUAGE);
  const [fontSize, setFontSize] = useLocalStorage<number>('codewrite-fontsize', DEFAULT_FONT_SIZE);
  const [editorTheme, setEditorTheme] = useLocalStorage<EditorTheme>('codewrite-editortheme', DEFAULT_EDITOR_THEME);
  const [indentation, setIndentation] = useLocalStorage<number>('codewrite-indentation', DEFAULT_INDENTATION);
  const [projectType, setProjectType] = useLocalStorage<string>('codewrite-projecttype', DEFAULT_PROJECT_TYPE);

  const [explorerOpen, setExplorerOpen] = useState(true); // Left panel
  const [rightPanelOpen, setRightPanelOpen] = useState(true); // Right panel (Web/Gemini)
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true); // Bottom panel (Console/Terminal)

  const [activeActivity, setActiveActivity] = useState<Activity>(Activity.Explorer);
  const [activeRightTab, setActiveRightTab] = useState<PanelTab>(PanelTab.WebPreview);
  const [activeBottomTab, setActiveBottomTab] = useState<PanelTab>(PanelTab.Terminal); // Default to Terminal

  const { toast } = useToast();
  const pyodideManager = usePyodide();

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Output states
  const [iframeSrcDoc, setIframeSrcDoc] = useState('');
  const [pythonRunOutput, setPythonRunOutput] = useState<PythonExecutionResult | null>(null);
  const [pythonTerminalHistory, setPythonTerminalHistory] = useState<TerminalHistoryItem[]>([]);

  useEffect(() => {
    if (hasMounted && pyodideManager.pyodideError) {
      toast({
        title: "Pyodide Error",
        description: `Failed to load Python environment: ${pyodideManager.pyodideError}`,
        variant: "destructive",
      });
      setPythonTerminalHistory(prev => [...prev, { id: Date.now().toString(), type: 'error', content: `Pyodide Error: ${pyodideManager.pyodideError}` }]);
    }
  }, [hasMounted, pyodideManager.pyodideError, toast]);

   useEffect(() => {
     if (hasMounted && language === 'python' && pyodideManager.isPyodideReady && pythonTerminalHistory.length === 0) {
        setPythonTerminalHistory([{id: 'init-msg', type: 'info', content: 'Python environment ready. Use "pip install <package>" to install packages.'}]);
     }
  }, [hasMounted, language, pyodideManager.isPyodideReady, pythonTerminalHistory.length]);


  const handleLoadFile = (content: string, name: string) => {
    setCode(content);
    setFileName(name);
    setLanguage(getFileLanguage(name)); // Auto-detect language
  };

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


  const handleAiGeneratedContentInsert = (content: string, type: 'code' | 'docs' | 'tests') => {
    setCode(prevCode => `${prevCode}\n\n${type === 'docs' ? `/**\n * ${content.split('\n').join('\n * ')}\n */` : content}`);
    toast({
      title: "Content Inserted",
      description: `AI-generated ${type} have been appended to the editor.`,
    });
    // Optionally switch focus back to editor or stay in AI panel
  };

  const handleRunCode = async () => {
    setPythonRunOutput(null);
    setIframeSrcDoc('');
    setRightPanelOpen(true); // Ensure right panel is open
    setBottomPanelOpen(true); // Ensure bottom panel is open

    if (language === 'python') {
      if (!pyodideManager.isPyodideReady) {
        toast({ title: "Python Not Ready", description: "Python environment is still loading or encountered an error.", variant: "destructive" });
        setPythonRunOutput({ stdout: '', stderr: 'Python environment is not ready.'});
         setActiveBottomTab(PanelTab.Console); // Show output in Console tab
        return;
      }
      toast({ title: "Running Python", description: "Executing Python code..." });
      const result = await pyodideManager.runPython(code);
      setPythonRunOutput(result);
      setActiveBottomTab(PanelTab.Console); // Show output in Console tab
    } else if (language === 'cpp') {
      setPythonRunOutput({
        stdout: '',
        stderr: 'C++ execution in the browser is a preview feature and not supported for running code. This typically requires a server-side compilation and execution environment.',
      });
       setActiveBottomTab(PanelTab.Console); // Show output in Console tab
    } else {
      // Logic for HTML, CSS, JS preview
      let srcDocContent = '';
      const iframeStyle = `<style>body { margin: 10px; font-family: sans-serif; color: #EEE; background-color: #282A36; } .console-log { border-bottom: 1px solid #44475A; padding: 4px 0; font-family: monospace; white-space: pre-wrap; word-break: break-all; } .console-error { color: #FF5555; } .console-warn { color: #F1FA8C; } ::-webkit-scrollbar { width: 8px; height: 8px; } ::-webkit-scrollbar-track { background: #282A36; } ::-webkit-scrollbar-thumb { background: #44475A; border-radius: 4px; } ::-webkit-scrollbar-thumb:hover { background: #6272A4; }</style>`;
      const consoleOverride = `<script> const originalConsoleLog = console.log; const originalConsoleError = console.error; const originalConsoleWarn = console.warn; const outputDiv = document.body.querySelector('#console-output-container') || document.createElement('div'); if (!document.body.querySelector('#console-output-container')) { outputDiv.id = 'console-output-container'; outputDiv.style.marginTop = '20px'; outputDiv.style.borderTop = '1px dashed #44475A'; outputDiv.style.paddingTop = '10px'; document.body.appendChild(outputDiv); } function formatArg(arg) { if (typeof arg === 'undefined') return 'undefined'; if (arg === null) return 'null'; if (typeof arg === 'string') return arg; if (typeof arg === 'object' || typeof arg === 'function') { try { return JSON.stringify(arg, null, 2); } catch (e) { return arg.toString(); } } return String(arg); } const createLogEntry = (className, prefix, ...args) => { const msg = args.map(formatArg).join(' '); const logEntry = document.createElement('div'); logEntry.className = 'console-log ' + className; logEntry.textContent = prefix + msg; outputDiv.appendChild(logEntry); }; console.log = (...args) => { originalConsoleLog.apply(console, args); createLogEntry('', '', ...args); }; console.error = (...args) => { originalConsoleError.apply(console, args); createLogEntry('console-error', 'ERROR: ', ...args); }; console.warn = (...args) => { originalConsoleWarn.apply(console, args); createLogEntry('console-warn', 'WARN: ', ...args); }; window.addEventListener('error', function(event) { console.error(event.message, 'at', event.filename + ':' + event.lineno + ':' + event.colno); }); <\/script>`;

      if (language === 'html') {
        if (code.trim().toLowerCase().includes('<html')) {
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
          // Inject console override *after* user scripts might try to redefine console
          srcDocContent = tempCode.replace(SCRIPT_PLACEHOLDER, consoleOverride).replace(STYLE_PLACEHOLDER, iframeStyle);
        } else {
          srcDocContent = `<!DOCTYPE html><html><head>${iframeStyle}</head><body>${code}${consoleOverride}</body></html>`;
        }
      } else if (language === 'javascript') {
        srcDocContent = `<!DOCTYPE html><html><head>${iframeStyle}</head><body><script>${code}<\/script>${consoleOverride}</body></html>`;
      } else if (language === 'css') {
        srcDocContent = `<!DOCTYPE html><html><head><style>${code}<\/style>${iframeStyle}${consoleOverride}</head><body><p>CSS styles applied. Add HTML content or inspect this frame to see results.</p></body></html>`;
      } else {
         toast({
          title: "Unsupported Language for Preview",
          description: `Live preview for ${language} is not available. Previews are supported for HTML, CSS, and JavaScript. Python/C++ output appears in the Console tab.`,
        });
        srcDocContent = `<!DOCTYPE html><html><head>${iframeStyle}</head><body><p>Code execution preview is primarily for HTML, CSS, and JavaScript. Running ${language} code is not directly supported in this preview.</p></body></html>`;
      }

      setIframeSrcDoc(srcDocContent);
      setActiveRightTab(PanelTab.WebPreview); // Show preview in Web Preview tab
      setActiveBottomTab(PanelTab.Console); // Also show console logs here
    }
  };

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
      // Attempt to run other commands as Python code (basic eval)
       setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString() + '-info', type: 'info', content: `Running as Python: ${command}`}]);
       const result = await pyodideManager.runPython(command);
       if (result.stdout) setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString() + '-out', type: 'output', content: result.stdout}]);
       if (result.stderr) setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString() + '-err', type: 'error', content: result.stderr}]);

    } else {
        setPythonTerminalHistory(prev => [...prev, {id: Date.now().toString() + '-empty', type: 'info', content: ""}]); // Handle empty command
    }
  };

   // Render loading state or error if Pyodide is not ready
  // if (!hasMounted || (language === 'python' && !pyodideManager.isPyodideReady && !pyodideManager.pyodideError)) {
  //   return (
  //     <div className="flex h-screen items-center justify-center bg-background text-foreground">
  //       <Loader2 className="w-8 h-8 mr-2 animate-spin" /> Loading Workspace...
  //     </div>
  //   );
  // }
  // if (hasMounted && language === 'python' && pyodideManager.pyodideError) {
  //    return (
  //     <div className="flex h-screen items-center justify-center bg-background text-destructive p-4 text-center">
  //        Error loading Python environment: {pyodideManager.pyodideError}
  //     </div>
  //   );
  // }

  const toggleExplorer = () => setExplorerOpen(!explorerOpen);
  const toggleRightPanel = () => setRightPanelOpen(!rightPanelOpen);
  const toggleBottomPanel = () => setBottomPanelOpen(!bottomPanelOpen);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <TopBar
        projectName="CodeWrite Mobile"
        fileName={fileName}
        onRunCode={handleRunCode}
        isRunDisabled={hasMounted && pyodideManager.isPyodideLoading && language === 'python'}
        isLoading={hasMounted && pyodideManager.isPyodideLoading && language === 'python'}
      />

      <div className="flex flex-1 overflow-hidden">
        <ActivityBar active={activeActivity} onSelect={setActiveActivity} />

        {explorerOpen && (
          <ExplorerPanel
            onLoadFile={handleLoadFile}
            onFileNameChange={setFileName}
            fileName={fileName}
            code={code} // Pass code for saving
            language={language}
            onLanguageChange={(lang) => {
              setLanguage(lang);
               if (lang !== 'python') {
                 setPythonRunOutput(null);
               }
            }}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            editorTheme={editorTheme}
            onEditorThemeChange={setEditorTheme}
            indentation={indentation}
            onIndentationChange={setIndentation}
            projectType={projectType}
            onProjectTypeChange={setProjectType}
          >
            {/* Pass specific components to the explorer panel */}
             <div className="p-2 space-y-4">
                 <FileControls
                    code={code}
                    fileName={fileName}
                    onFileNameChange={setFileName}
                    onLoad={handleLoadFile}
                  />
                 <SettingsPanel
                    language={language}
                    onLanguageChange={(lang) => {
                      setLanguage(lang);
                      if (lang !== 'python') {
                        setPythonRunOutput(null);
                      }
                    }}
                    fontSize={fontSize}
                    onFontSizeChange={setFontSize}
                    editorTheme={editorTheme}
                    onEditorThemeChange={setEditorTheme}
                    indentation={indentation}
                    onIndentationChange={setIndentation}
                  />
                  {/* Add other sidebar items like Debugging, Test Lab etc. here or conditionally based on activeActivity */}
                   <DebuggingPanel />
                   <FirebaseTestLabPanel />
                   <PushNotificationsPanel />
             </div>
          </ExplorerPanel>
        )}

        {/* Main Area: Editor + Bottom Panel */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <EditorArea fileName={fileName}>
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
            >
               {/* Render content based on activeBottomTab */}
               {activeBottomTab === PanelTab.Console && (
                 <CodeOutputPanel
                    textOutput={pythonRunOutput} // Python/C++ output goes here
                    onClose={toggleBottomPanel}
                    className="h-full"
                    language={language}
                    isConsole={true} // Indicate this is the console view
                  />
               )}
                {activeBottomTab === PanelTab.Terminal && language === 'python' && (
                   <PythonTerminal
                        onCommand={handlePythonTerminalCommand}
                        history={pythonTerminalHistory}
                        isLoading={pyodideManager.isInstallingPackages}
                        isDisabled={!pyodideManager.isPyodideReady || pyodideManager.isPyodideLoading}
                        className="h-full"
                      />
                )}
                 {activeBottomTab === PanelTab.Terminal && language !== 'python' && (
                     <div className="p-4 text-muted-foreground h-full flex items-center justify-center">
                         Terminal is available for Python projects.
                     </div>
                 )}
            </BottomPanel>
          )}
        </div>

        {rightPanelOpen && (
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

         {/* Floating Toggle Buttons */}
         <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-50">
             <Button variant="outline" size="icon" onClick={toggleExplorer} title="Toggle Explorer Panel">
                 <PanelLeft className="w-5 h-5"/>
             </Button>
             <Button variant="outline" size="icon" onClick={toggleRightPanel} title="Toggle Right Panel">
                 <Columns className="w-5 h-5"/>
             </Button>
              <Button variant="outline" size="icon" onClick={toggleBottomPanel} title="Toggle Bottom Panel">
                 <PanelBottom className="w-5 h-5"/>
             </Button>
         </div>

      </div>
    </div>
  );
}
 
    