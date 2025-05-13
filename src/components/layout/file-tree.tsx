
"use client";

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Folder, FolderOpen, FileText, FileJson, Code, Braces, GitCommit, ChevronRight } from 'lucide-react'; // Import necessary icons
import { cn } from '@/lib/utils';

interface FileTreeProps {
    fileName: string; // Current active file to highlight maybe
    onLoadFile: (content: string, name: string) => void; // Function to call when a file is clicked
    // Add project structure prop later
}

// Mock file structure data
const mockFiles = [
  {
    name: 'test',
    type: 'folder',
    children: [
      { name: 'test-utils.js', type: 'file', lang: 'javascript', content: '// Test utilities\n' },
      { name: 'app.test.js', type: 'file', lang: 'javascript', content: 'describe("App", () => { it("should pass", () => expect(true).toBe(true)); });\n' }
    ]
  },
  { name: '.gitignore', type: 'file', lang: 'gitignore', content: 'node_modules\n.env\n' },
  { name: 'app.ts', type: 'file', lang: 'typescript', content: 'console.log("Hello, TypeScript!");\n' },
  { name: 'calculator.js', type: 'file', lang: 'javascript', content: 'function add(a, b) { return a + b; }\n' },
  { name: 'index.html', type: 'file', lang: 'html', content: '<!DOCTYPE html><html><body><h1>Hello</h1></body></html>\n' },
  { name: 'jest.config.js', type: 'file', lang: 'javascript', content: 'module.exports = {};\n' },
  { name: 'package.json', type: 'file', lang: 'json', content: '{ "name": "my-app", "version": "1.0.0" }\n' }
];

type FileItem = {
    name: string;
    type: 'folder' | 'file';
    lang?: string; // language or type for icon
    content?: string; // File content
    children?: FileItem[];
}

const FileIcon: React.FC<{ type: 'folder' | 'file'; lang?: string; isOpen?: boolean; className?: string }> = ({ type, lang, isOpen, className }) => {
    if (type === 'folder') {
        return isOpen ? <FolderOpen className={cn("w-4 h-4 mr-1.5 text-sky-500", className)} /> : <Folder className={cn("w-4 h-4 mr-1.5 text-sky-500", className)} />;
    }
    switch (lang) {
        case 'javascript':
        case 'typescript':
             return <Braces className={cn("w-4 h-4 mr-1.5 text-yellow-500", className)} />; // Using Braces for JS/TS
        case 'html':
            return <Code className={cn("w-4 h-4 mr-1.5 text-orange-500", className)} />;
        case 'json':
            return <FileJson className={cn("w-4 h-4 mr-1.5 text-yellow-600", className)} />;
        case 'gitignore':
            return <GitCommit className={cn("w-4 h-4 mr-1.5 text-gray-500", className)} />;
        default:
            return <FileText className={cn("w-4 h-4 mr-1.5 text-gray-400", className)} />;
    }
};


export const FileTree: React.FC<FileTreeProps> = ({ fileName, onLoadFile }) => {
  const [openFolders, setOpenFolders] = useState<string[]>(['VSCODE101']); // Keep root open by default

  const handleFolderToggle = (folderName: string) => {
    setOpenFolders(prev =>
      prev.includes(folderName)
        ? prev.filter(name => name !== folderName)
        : [...prev, folderName]
    );
  };

  const renderFileTree = (items: FileItem[], level = 0): React.ReactNode => {
    return items.map((item) => {
      const isFolderOpen = openFolders.includes(item.name);
      const indentStyle = { paddingLeft: `${level * 1}rem` }; // Indentation (adjust multiplier as needed)

      if (item.type === 'folder') {
        return (
          <div key={item.name}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-7 px-2 text-sm font-normal text-foreground hover:bg-muted"
              style={indentStyle}
              onClick={() => handleFolderToggle(item.name)}
            >
               <ChevronRight className={cn("w-3 h-3 mr-1 transition-transform duration-200", isFolderOpen && "rotate-90")} />
               <FileIcon type="folder" isOpen={isFolderOpen} />
               {item.name}
            </Button>
            {isFolderOpen && item.children && (
               <div className="pl-0"> {/* No extra indent on container */}
                 {renderFileTree(item.children, level + 1)}
               </div>
            )}
          </div>
        );
      } else {
        // File item
        return (
          <Button
            key={item.name}
            variant="ghost"
            size="sm"
            className={cn(
                "w-full justify-start h-7 px-2 text-sm font-normal hover:bg-muted",
                fileName === item.name ? 'bg-muted text-foreground' : 'text-muted-foreground' // Highlight active file
            )}
            style={indentStyle}
            onClick={() => onLoadFile(item.content || '', item.name)}
            title={item.name}
          >
            {/* Placeholder for indent guides if needed */}
            <FileIcon type="file" lang={item.lang} className="ml-4" /> {/* Indent file icon */}
            {item.name}
            {/* Add Git status indicator (e.g., 'U') later */}
            {/* <span className="ml-auto text-xs text-green-500">U</span> */}
          </Button>
        );
      }
    });
  };

  return (
     <Accordion type="single" collapsible defaultValue="item-1" className="w-full px-0">
      <AccordionItem value="item-1" className="border-b border-border">
         {/* VSCode style trigger - looks like a button */}
         <AccordionTrigger
            className="px-3 py-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground hover:no-underline [&[data-state=open]>svg]:rotate-90"
            onClick={() => handleFolderToggle('VSCODE101')} // Use the name for state tracking
         >
              <ChevronRight className={cn("w-3 h-3 mr-1 transition-transform duration-200", openFolders.includes('VSCODE101') && "rotate-90")} />
              VSCODE101 {/* Project Name */}
         </AccordionTrigger>
        <AccordionContent className="px-0 pt-1 pb-1">
           {openFolders.includes('VSCODE101') && renderFileTree(mockFiles)}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

    