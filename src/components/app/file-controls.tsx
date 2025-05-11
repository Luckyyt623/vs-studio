"use client";

import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, UploadCloud, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileControlsProps {
  code: string;
  fileName: string;
  onFileNameChange: (name: string) => void;
  onLoad: (content: string, name: string) => void;
}

export function FileControls({ code, fileName, onFileNameChange, onLoad }: FileControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSave = () => {
    if (!code.trim()) {
      toast({
        title: "Cannot Save Empty File",
        description: "Please write some code before saving.",
        variant: "destructive"
      });
      return;
    }
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'untitled.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "File Saved",
      description: `${a.download} has been saved.`,
    });
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileLoad = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onLoad(content, file.name);
        toast({
          title: "File Loaded",
          description: `${file.name} has been loaded into the editor.`,
        });
      };
      reader.readAsText(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input for same file selection
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fileName" className="text-sm font-medium">File Name</Label>
        <Input
          id="fileName"
          type="text"
          value={fileName}
          onChange={(e) => onFileNameChange(e.target.value)}
          placeholder="untitled.txt"
          className="mt-1"
        />
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button onClick={handleSave} className="w-full sm:w-auto">
          <Save className="w-4 h-4 mr-2" /> Save File
        </Button>
        <Button onClick={handleLoadClick} variant="outline" className="w-full sm:w-auto">
          <UploadCloud className="w-4 h-4 mr-2" /> Load File
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileLoad}
        accept=".txt,.js,.py,.html,.css,.ts,.java,.rb,.go,.php,.swift,text/*"
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
