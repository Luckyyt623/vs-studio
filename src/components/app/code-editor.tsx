
"use client";

import type { ChangeEvent } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { aiCodeCompletion } from '@/ai/flows/code-completion';
import type { EditorTheme } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  code: string;
  onCodeChange: (newCode: string) => void;
  language: string;
  fontSize: number;
  editorTheme: EditorTheme;
  indentation: number; // Currently not used for simple textarea, for future enhancements
}

// Debounce function
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};


export function CodeEditor({
  code,
  onCodeChange,
  language,
  fontSize,
  editorTheme,
}: CodeEditorProps) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const handleAutocomplete = useCallback(async (currentCode: string, currentLanguage: string) => {
    if (!currentCode.trim() || !currentLanguage) {
      setSuggestion(null);
      return;
    }
    setIsSuggesting(true);
    setSuggestion(null);
    try {
      const result = await aiCodeCompletion({
        codePrefix: currentCode,
        language: currentLanguage,
      });
      if (result.completion) {
        setSuggestion(result.completion);
      } else {
        setSuggestion(null);
      }
    } catch (error) {
      console.error('Error fetching AI completion:', error);
      toast({
        title: "Autocomplete Error",
        description: "Could not fetch AI suggestion.",
        variant: "destructive",
      });
      setSuggestion(null);
    } finally {
      setIsSuggesting(false);
    }
  }, [toast]);

  const debouncedAutocomplete = useCallback(debounce(handleAutocomplete, 1500), [handleAutocomplete]);

  useEffect(() => {
    if (code.length > 10) { // Trigger autocomplete if code is somewhat substantial
       debouncedAutocomplete(code, language);
    }
     // Cleanup function to clear timeout if component unmounts or dependencies change
    return () => {
       // This part requires access to the timeout variable inside debounce,
       // which isn't directly exposed. A more complex debounce implementation
       // might return a cancel function. For now, this is a limitation.
    };
  }, [code, language, debouncedAutocomplete]);


  const applySuggestion = () => {
    if (suggestion) {
      onCodeChange(code + suggestion);
      setSuggestion(null);
    }
  };

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onCodeChange(event.target.value);
    // Clear suggestion when user types
    setSuggestion(null);
     // Also cancel any pending debounced call
     // See comment in useEffect about debounce cancellation limitation
  };

  return (
    // Removed outer div, Textarea now fills the parent (EditorArea's content div)
    <>
      <Textarea
        value={code}
        onChange={handleTextareaChange}
        placeholder={`Start typing ${language} code...`}
        className={cn(
          "flex-grow w-full h-full p-4 rounded-none resize-none font-mono focus:outline-none border-0", // Removed border, rounded-md, focus ring (handled by parent?)
          "bg-primary text-primary-foreground", // Ensure background/text color
          editorTheme === 'light' ? 'bg-gray-100 text-gray-900' : '' // Simple theme toggle
        )}
        style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.5}px` }}
        spellCheck="false"
        aria-label="Code Editor"
      />
       {(isSuggesting || suggestion) && (
         <div className="absolute bottom-2 left-2 z-10 w-11/12 max-w-md"> {/* Position suggestion overlay */}
           <div className="p-2 border rounded-md bg-secondary border-border shadow-lg">
            {isSuggesting && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Generating suggestion...</span>
              </div>
            )}
            {suggestion && !isSuggesting && (
              <div>
                <p className="text-sm text-muted-foreground">AI Suggestion (Tab to accept):</p>
                {/* Display only first line initially? Or limit height */}
                <pre className="p-2 my-1 overflow-x-auto text-sm rounded-sm bg-primary text-accent max-h-20">{suggestion}</pre>
                <Button onClick={applySuggestion} size="sm" variant="outline">
                  <Wand2 className="w-4 h-4 mr-2" /> Apply Suggestion
                </Button>
              </div>
            )}
           </div>
         </div>
      )}
    </>
  );
}

    