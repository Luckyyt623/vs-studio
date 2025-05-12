"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, WandSparkles, FileText, TestTubeDiagonal, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

import { aiCodeGeneration, type AiCodeGenerationInput } from '@/ai/flows/code-generation';
import { aiDocumentationGeneration, type AiDocumentationGenerationInput } from '@/ai/flows/documentation-generation';
import { aiUnitTestCreation, type AiUnitTestCreationInput } from '@/ai/flows/unit-test-creation';

interface AiToolsPanelProps {
  currentCode: string;
  currentLanguage: string;
  onGeneratedContentInsert: (content: string, type: 'code' | 'docs' | 'tests') => void;
}

export const AiToolsPanel: FC<AiToolsPanelProps> = ({ currentCode, currentLanguage, onGeneratedContentInsert }) => {
  const { toast } = useToast();

  const [codeGenDescription, setCodeGenDescription] = useState('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);
  const [isGeneratingTests, setIsGeneratingTests] = useState(false);
  const [testFramework, setTestFramework] = useState('');

  const [showResultDialog, setShowResultDialog] = useState(false);
  const [resultDialogTitle, setResultDialogTitle] = useState('');
  const [resultDialogContent, setResultDialogContent] = useState('');
  const [resultDialogContentType, setResultDialogContentType] = useState<'code' | 'docs' | 'tests' | null>(null);
  const [copied, setCopied] = useState(false);


  const handleShowResult = (title: string, content: string, type: 'code' | 'docs' | 'tests') => {
    setResultDialogTitle(title);
    setResultDialogContent(content);
    setResultDialogContentType(type);
    setCopied(false);
    setShowResultDialog(true);
  };

  const handleGenerateCode = async () => {
    if (!codeGenDescription.trim()) {
      toast({ title: "Error", description: "Please provide a description for code generation.", variant: "destructive" });
      return;
    }
    setIsGeneratingCode(true);
    try {
      const input: AiCodeGenerationInput = { language: currentLanguage, description: codeGenDescription };
      const result = await aiCodeGeneration(input);
      handleShowResult("Generated Code", result.generatedCode, 'code');
    } catch (error) {
      console.error("Code generation error:", error);
      toast({ title: "Code Generation Failed", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleGenerateDocs = async () => {
    if (!currentCode.trim()) {
      toast({ title: "Error", description: "There is no code in the editor to document.", variant: "destructive" });
      return;
    }
    setIsGeneratingDocs(true);
    try {
      const input: AiDocumentationGenerationInput = { language: currentLanguage, code: currentCode };
      const result = await aiDocumentationGeneration(input);
      handleShowResult("Generated Documentation", result.documentation, 'docs');
    } catch (error) {
      console.error("Documentation generation error:", error);
      toast({ title: "Documentation Generation Failed", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    } finally {
      setIsGeneratingDocs(false);
    }
  };

  const handleGenerateTests = async () => {
    if (!currentCode.trim()) {
      toast({ title: "Error", description: "There is no code in the editor to generate tests for.", variant: "destructive" });
      return;
    }
    setIsGeneratingTests(true);
    try {
      const input: AiUnitTestCreationInput = { language: currentLanguage, code: currentCode, framework: testFramework || undefined };
      const result = await aiUnitTestCreation(input);
      handleShowResult("Generated Unit Tests", result.testCases, 'tests');
    } catch (error) {
      console.error("Unit test generation error:", error);
      toast({ title: "Unit Test Generation Failed", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    } finally {
      setIsGeneratingTests(false);
    }
  };
  
  const handleCopyToClipboard = async () => {
    if (resultDialogContent) {
      await navigator.clipboard.writeText(resultDialogContent);
      setCopied(true);
      toast({ title: "Copied to clipboard!"});
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 p-1">
      <div className="space-y-2">
        <Label htmlFor="code-gen-desc" className="flex items-center text-sm font-medium">
          <WandSparkles className="w-4 h-4 mr-2" /> AI Code Generation
        </Label>
        <Textarea
          id="code-gen-desc"
          placeholder="Describe the code you want to generate (e.g., 'a Python function to sort a list')..."
          value={codeGenDescription}
          onChange={(e) => setCodeGenDescription(e.target.value)}
          rows={3}
          className="bg-background text-foreground placeholder:text-muted-foreground"
        />
        <Button onClick={handleGenerateCode} disabled={isGeneratingCode || !codeGenDescription.trim()} className="w-full">
          {isGeneratingCode ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="w-4 h-4 mr-2" />}
          Generate Code
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center text-sm font-medium">
          <FileText className="w-4 h-4 mr-2" /> AI Documentation Generation
        </Label>
        <p className="text-xs text-muted-foreground">Generates documentation for the code currently in the editor.</p>
        <Button onClick={handleGenerateDocs} disabled={isGeneratingDocs || !currentCode.trim()} className="w-full">
          {isGeneratingDocs ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
          Generate Documentation
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center text-sm font-medium">
          <TestTubeDiagonal className="w-4 h-4 mr-2" /> AI Unit Test Generation
        </Label>
        <p className="text-xs text-muted-foreground">Generates unit tests for the code currently in the editor.</p>
        <Input
          id="test-framework"
          placeholder="Optional: Test framework (e.g., Jest, PyTest)"
          value={testFramework}
          onChange={(e) => setTestFramework(e.target.value)}
          className="bg-background text-foreground placeholder:text-muted-foreground"
        />
        <Button onClick={handleGenerateTests} disabled={isGeneratingTests || !currentCode.trim()} className="w-full">
          {isGeneratingTests ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TestTubeDiagonal className="w-4 h-4 mr-2" />}
          Generate Unit Tests
        </Button>
      </div>

      {showResultDialog && resultDialogContentType && (
        <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
          <DialogContent className="sm:max-w-[600px] bg-popover text-popover-foreground">
            <DialogHeader>
              <DialogTitle>{resultDialogTitle}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Review the generated content. You can copy it or insert it into the editor.
              </DialogDescription>
            </DialogHeader>
            <div className="relative my-4">
              <ScrollArea className="max-h-[60vh] border rounded-md border-border">
                <pre className="p-4 text-sm bg-primary text-primary-foreground whitespace-pre-wrap break-all">{resultDialogContent}</pre>
              </ScrollArea>
              <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:bg-muted"
                  onClick={handleCopyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  <span className="sr-only">Copy to clipboard</span>
              </Button>
            </div>
            <DialogFooter className="sm:justify-between">
                <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                    if(resultDialogContentType) {
                        onGeneratedContentInsert(resultDialogContent, resultDialogContentType);
                        setShowResultDialog(false);
                        toast({title: "Content Inserted", description: `${resultDialogTitle} inserted into the editor.`});
                    }
                    }}
                >
                    Insert into Editor
                </Button>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                    Close
                    </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
