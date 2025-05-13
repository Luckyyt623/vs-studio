
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle, QrCode, Smartphone, RefreshCw, ArrowLeft, ArrowRight, Home, Eraser } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PanelTab } from '@/lib/enums'; // Updated import


interface CodeOutputPanelProps {
  srcDoc?: string; // For web preview iframe
  textOutput?: { stdout?: string; stderr?: string; error?: string } | null; // Allow null
  language?: string;
  onClose: () => void;
  onClear?: () => void; // Optional clear handler for Console/Output
  className?: string;
  showQrCodeToggle?: boolean; // Prop to control QR code button visibility in web preview
  isConsole?: boolean; // Differentiates between web preview and console output display
  activeTab: PanelTab; // Add activeTab to control conditional rendering
}

export function CodeOutputPanel({
    srcDoc,
    textOutput,
    language,
    onClose, // onClose is handled by the parent BottomPanel/RightPanel now
    onClear,
    className,
    showQrCodeToggle = false,
    isConsole = false,
    activeTab,
}: CodeOutputPanelProps) {
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [qrDataUri, setQrDataUri] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState('/'); // Simulated URL for preview
  const iframeRef = useRef<HTMLIFrameElement>(null); // Ref for iframe

  const hasTextOutput = textOutput && (textOutput.stdout || textOutput.stderr || textOutput.error);

  const generateDataUri = (htmlContent: string): string => {
    if (htmlContent.length > 2000) {
      console.warn("HTML content might be too large for a reliable Data URI QR Code.");
      // Consider alternative methods for large previews (e.g., blob URL)
    }
    return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
  }

  const handleToggleQrCode = () => {
    if (srcDoc) {
      const dataUri = generateDataUri(srcDoc);
      setQrDataUri(dataUri);
      setShowQrDialog(true);
    }
  };

  const handleRefresh = () => {
      if (iframeRef.current && srcDoc) {
          // Re-setting srcdoc forces a reload of the content
          iframeRef.current.srcdoc = srcDoc;
      }
  }

  // Effect to update iframe when srcDoc changes
  useEffect(() => {
    if (iframeRef.current && srcDoc !== iframeRef.current.srcdoc) {
      iframeRef.current.srcdoc = srcDoc;
    }
  }, [srcDoc]);

  const panelTitle = isConsole ? "Debug Console" : "Output";

  return (
    <div className={cn("flex flex-col h-full bg-primary text-primary-foreground", className)}>

      {/* Header specific to Web Preview */}
      {activeTab === PanelTab.WebPreview && ( 
        <div className="flex items-center space-x-1 p-1 bg-secondary border-b border-border h-10 shrink-0">
          <Button variant="ghost" size="icon" className="w-7 h-7" disabled><ArrowLeft className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="w-7 h-7" disabled><ArrowRight className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={handleRefresh} title="Reload Preview"><RefreshCw className="w-4 h-4" /></Button>
          <Input
            type="text"
            readOnly
            value={previewUrl} // This is just a placeholder
            className="h-7 flex-1 bg-background text-xs rounded-sm px-2"
            aria-label="Preview URL"
          />
          {showQrCodeToggle && srcDoc && (
             <Button variant="ghost" size="icon" onClick={handleToggleQrCode} aria-label="Show QR Code for mobile preview" title="Show QR Code for mobile preview" className="w-7 h-7">
               <QrCode className="w-4 h-4" />
             </Button>
          )}
           {/* Close button is now handled by RightPanel */}
        </div>
      )}

      {/* Header for Console/Output */}
      {(isConsole || activeTab === PanelTab.Output) && (
         <div className="flex items-center justify-between p-1 bg-secondary border-b border-border h-10 shrink-0">
             <span className="text-xs font-medium px-2">{panelTitle}</span>
             <div className="flex items-center">
                {onClear && (
                   <Button variant="ghost" size="icon" onClick={onClear} className="w-7 h-7" title={`Clear ${panelTitle}`}>
                      <Eraser className="w-4 h-4" />
                   </Button>
                )}
                {/* Close button is handled by BottomPanel */}
             </div>
         </div>
      )}


      {/* Content Area */}
      <div className="flex-grow overflow-auto p-2"> {/* Added padding to content area */}
        {/* Web Preview iframe */}
        {activeTab === PanelTab.WebPreview && (
          <iframe
            ref={iframeRef}
            // srcDoc={srcDoc} // Set via useEffect now
            title="Code Preview"
            sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
            className="w-full h-full border-0 bg-white" // Give iframe a background
            aria-label="Code execution preview"
          />
        )}
         {activeTab === PanelTab.WebPreview && !srcDoc && (
            <div className="text-muted-foreground h-full flex items-center justify-center text-sm">
                Run HTML/JS/CSS code to see the web preview.
            </div>
        )}

        {/* Console/Output Text */}
        {(isConsole || activeTab === PanelTab.Output) && hasTextOutput && (
          <ScrollArea className="h-full font-mono text-xs">
              {/* Combine stdout and stderr for display */}
              {textOutput?.stdout && (
                <pre className="whitespace-pre-wrap text-primary-foreground">{textOutput.stdout}</pre>
              )}
              {textOutput?.stderr && (
                <pre className="whitespace-pre-wrap text-red-400">{textOutput.stderr}</pre>
              )}
              {/* Display error separately only if it's distinct from stderr */}
              {textOutput?.error && (!textOutput.stderr || !textOutput.stderr.includes(textOutput.error)) && (
                 <pre className="whitespace-pre-wrap text-destructive">{`Execution Error: ${textOutput.error}`}</pre>
              )}
              {/* Spacer */}
              <div className="h-4"></div>
          </ScrollArea>
        )}
         {(isConsole || activeTab === PanelTab.Output) && !hasTextOutput && (
           <div className="text-muted-foreground h-full flex items-center justify-center text-sm">
                {language === 'python' ? `Run Python code to see output in ${panelTitle}.` :
                 language === 'cpp' ? `C++ output will appear here (if supported).` :
                 isConsole ? 'Debug output (e.g., from console.log) will appear here.' :
                 'Program output will appear here.'
                }
          </div>
        )}
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="sm:max-w-md bg-popover text-popover-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center"><Smartphone className="w-5 h-5 mr-2"/> Scan for Mobile Preview</DialogTitle>
            <DialogDescription>
              Scan this QR code with your mobile device's camera to preview the web output directly on your phone.
              Ensure your device is on the same network if using local resources.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
             {qrDataUri ? (
                <>
                    <QRCodeSVG value={qrDataUri} size={256} level="L" className="bg-white p-2 rounded-md shadow-md" />
                    <Alert variant="default" className="mt-4 text-xs">
                      <AlertDescription>
                        This QR code links to a self-contained HTML page (Data URI). Previews may fail if the code is too large or relies on external resources not accessible from the data URI context. Level 'L' QR used for smaller size.
                      </AlertDescription>
                    </Alert>
                </>
             ) : (
                <p className="text-muted-foreground">Generating QR code...</p>
             )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
