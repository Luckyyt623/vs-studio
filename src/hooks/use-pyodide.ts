// src/hooks/use-pyodide.ts
"use client";

import type { PyodideInterface, PyodideReadyPromise } from 'pyodide';
import { useState, useEffect, useCallback } from 'react';

// Load Pyodide type dynamically to avoid build issues if @types/pyodide is not available
type LoadPyodideType = (options?: { indexURL: string }) => PyodideReadyPromise;

declare global {
  interface Window {
    loadPyodide: LoadPyodideType;
  }
}

export interface PythonExecutionResult {
  stdout: string;
  stderr: string;
  error?: string;
}

export interface PackageInstallResult {
  success: boolean;
  message: string;
}

const PYODIDE_CDN_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/";

export function usePyodide() {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState<boolean>(true);
  const [pyodideError, setPyodideError] = useState<string | null>(null);
  const [isInstallingPackages, setIsInstallingPackages] = useState<boolean>(false);

  useEffect(() => {
    const loadPyodideInstance = async () => {
      if (typeof window.loadPyodide === 'undefined') {
        const script = document.createElement('script');
        script.src = `${PYODIDE_CDN_URL}pyodide.js`;
        script.onload = async () => {
          try {
            const pyodideInstance = await window.loadPyodide({
              indexURL: PYODIDE_CDN_URL,
            });
            setPyodide(pyodideInstance);
            // Pre-load micropip for package installation
            await pyodideInstance.loadPackage('micropip');
            setPyodideError(null);
          } catch (error) {
            console.error("Error loading Pyodide:", error);
            setPyodideError(error instanceof Error ? error.message : String(error));
          } finally {
            setIsPyodideLoading(false);
          }
        };
        script.onerror = (error) => {
          console.error("Error loading Pyodide script:", error);
          setPyodideError("Failed to load Pyodide script.");
          setIsPyodideLoading(false);
        };
        document.body.appendChild(script);
        return () => {
          document.body.removeChild(script);
        };
      } else {
         try {
            const pyodideInstance = await window.loadPyodide({
              indexURL: PYODIDE_CDN_URL,
            });
            setPyodide(pyodideInstance);
            await pyodideInstance.loadPackage('micropip');
            setPyodideError(null);
          } catch (error) {
            console.error("Error loading Pyodide (already loaded script):", error);
            setPyodideError(error instanceof Error ? error.message : String(error));
          } finally {
            setIsPyodideLoading(false);
          }
      }
    };

    loadPyodideInstance();
  }, []);

  const runPython = useCallback(async (code: string): Promise<PythonExecutionResult> => {
    if (!pyodide) {
      return { stdout: '', stderr: '', error: 'Pyodide is not loaded yet.' };
    }

    let stdout = "";
    let stderr = "";
    
    pyodide.setStdout({ batched: (s: string) => { stdout += s + "\n"; } });
    pyodide.setStderr({ batched: (s: string) => { stderr += s + "\n"; } });

    try {
      await pyodide.runPythonAsync(code);
      return { stdout, stderr };
    } catch (e) {
      console.error("Error running Python code:", e);
      const errorMsg = e instanceof Error ? e.message : String(e);
      stderr += errorMsg + "\n"; // Append actual error to stderr
      return { stdout, stderr, error: errorMsg };
    } finally {
        // Reset stdout/stderr to default or other handlers if necessary
        pyodide.setStdout({ batched: () => {} }); // No-op or restore previous
        pyodide.setStderr({ batched: () => {} });
    }
  }, [pyodide]);

  const installPackages = useCallback(async (packages: string[]): Promise<PackageInstallResult> => {
    if (!pyodide) {
      return { success: false, message: 'Pyodide is not loaded yet.' };
    }
    if (packages.length === 0) {
      return { success: true, message: 'No packages to install.' };
    }

    setIsInstallingPackages(true);
    try {
      const micropip = pyodide.pyimport('micropip');
      await micropip.install(packages);
      return { success: true, message: `Successfully installed: ${packages.join(', ')}` };
    } catch (e) {
      console.error("Error installing packages:", e);
      const errorMsg = e instanceof Error ? e.message : String(e);
      return { success: false, message: `Failed to install packages: ${errorMsg}` };
    } finally {
      setIsInstallingPackages(false);
    }
  }, [pyodide]);

  return {
    pyodide,
    isPyodideLoading,
    isPyodideReady: !!pyodide && !isPyodideLoading && !pyodideError,
    pyodideError,
    runPython,
    installPackages,
    isInstallingPackages,
  };
}
