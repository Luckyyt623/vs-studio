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
  }, [code, language, debouncedAutocomplete]);


  const applySuggestion = () => {
    if (suggestion) {
      onCodeChange(code + suggestion);
      setSuggestion(null);
    }
  };

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onCodeChange(event.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <Textarea
        value={code}
        onChange={handleTextareaChange}
        placeholder={`Start typing ${language} code...`}
        className={cn(
          "flex-grow w-full p-4 rounded-md resize-none font-mono focus:outline-none focus:ring-2 focus:ring-ring",
          "bg-primary text-primary-foreground border-border",
          editorTheme === 'light' ? 'bg-gray-100 text-gray-900' : '' // Simple theme toggle
        )}
        style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.5}px` }}
        spellCheck="false"
        aria-label="Code Editor"
      />
      {(isSuggesting || suggestion) && (
        <div className="p-2 mt-2 border rounded-md bg-secondary border-border">
          {isSuggesting && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span>Generating suggestion...</span>
            </div>
          )}
          {suggestion && !isSuggesting && (
            <div>
              <p className="text-sm text-muted-foreground">AI Suggestion:</p>
              <pre className="p-2 my-1 overflow-x-auto text-sm rounded-sm bg-primary text-accent max-h-32">{suggestion}</pre>
              <Button onClick={applySuggestion} size="sm" variant="outline">
                <Wand2 className="w-4 h-4 mr-2" /> Apply Suggestion
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
