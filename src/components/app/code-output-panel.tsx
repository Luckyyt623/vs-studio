
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle, QrCode, Smartphone, RefreshCw, ArrowLeft, ArrowRight, Home } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";


interface CodeOutputPanelProps {
  srcDoc?: string; // For web preview iframe
  textOutput?: { stdout?: string; stderr?: string; error?: string }; // For console/terminal output
  language?: string;
  onClose: () => void;
  className?: string;
  showQrCodeToggle?: boolean; // Prop to control QR code button visibility in web preview
  isConsole?: boolean; // Differentiates between web preview and console output display
}

export function CodeOutputPanel({
    srcDoc,
    textOutput,
    language,
    onClose,
    className,
    showQrCodeToggle = false,
    isConsole = false
}: CodeOutputPanelProps) {
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [qrDataUri, setQrDataUri] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState('/'); // Simulated URL for preview

  const hasTextOutput = textOutput && (textOutput.stdout || textOutput.stderr || textOutput.error);

  const generateDataUri = (htmlContent: string): string => {
    if (htmlContent.length > 2000) {
      console.warn("HTML content might be too large for a reliable Data URI QR Code.");
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

  // Simulate iframe reload - doesn't actually reload content from server, just resets srcDoc if possible
  const handleRefresh = () => {
      const iframe = document.getElementById('code-preview-iframe') as HTMLIFrameElement | null;
      if (iframe && srcDoc) {
          // Re-setting srcdoc forces a reload of the content
          iframe.srcdoc = srcDoc;
      }
  }

  return (
    <div className={cn("flex flex-col h-full bg-primary text-primary-foreground", className)}>
      {/* Header specific to Web Preview */}
      {!isConsole && (
        <div className="flex items-center space-x-1 p-1 bg-secondary border-b border-border h-10 shrink-0">
          <Button variant="ghost" size="icon" className="w-7 h-7" disabled><ArrowLeft className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="w-7 h-7" disabled><ArrowRight className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={handleRefresh}><RefreshCw className="w-4 h-4" /></Button>
          <Input
            type="text"
            readOnly
            value={previewUrl}
            className="h-7 flex-1 bg-background text-xs rounded-sm px-2"
            aria-label="Preview URL"
          />
          {showQrCodeToggle && srcDoc && (
             <Button variant="ghost" size="icon" onClick={handleToggleQrCode} aria-label="Show QR Code for mobile preview" title="Show QR Code for mobile preview" className="w-7 h-7">
               <QrCode className="w-4 h-4" />
             </Button>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-grow overflow-auto">
        {/* Web Preview iframe */}
        {!isConsole && srcDoc && (
          <iframe
            id="code-preview-iframe"
            srcDoc={srcDoc}
            title="Code Preview"
            sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
            className="w-full h-full border-0"
            aria-label="Code execution preview"
          />
        )}
        {!isConsole && !srcDoc && (
            <div className="p-4 text-muted-foreground h-full flex items-center justify-center">
                Run HTML/JS/CSS code to see the web preview.
            </div>
        )}

        {/* Console Output */}
        {isConsole && hasTextOutput && (
          <ScrollArea className="h-full p-2 font-mono text-xs">
            {textOutput.stdout && (
              <pre className="whitespace-pre-wrap text-primary-foreground">{textOutput.stdout}</pre>
            )}
            {textOutput.stderr && (
              <pre className="whitespace-pre-wrap text-red-400">{textOutput.stderr}</pre>
            )}
            {textOutput.error && !textOutput.stderr?.includes(textOutput.error) && (
              <pre className="whitespace-pre-wrap text-destructive">{`Execution Error: ${textOutput.error}`}</pre>
            )}
             {/* Spacer */}
            <div className="h-4"></div>
          </ScrollArea>
        )}
        {isConsole && !hasTextOutput && (
           <div className="p-4 text-muted-foreground h-full flex items-center justify-center">
            {language === 'python' ? 'Run Python code to see output.' :
             language === 'cpp' ? 'C++ execution output will appear here (if supported).' :
             'Console output (e.g., from console.log) will appear here.'}
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

    