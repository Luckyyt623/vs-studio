
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle, QrCode, Smartphone } from "lucide-react";
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
  srcDoc?: string;
  textOutput?: { stdout?: string; stderr?: string; error?: string };
  language?: string;
  onClose: () => void;
  className?: string;
  showQrCodeToggle?: boolean; // New prop to control QR code button visibility
}

export function CodeOutputPanel({ srcDoc, textOutput, language, onClose, className, showQrCodeToggle = false }: CodeOutputPanelProps) {
  const hasTextOutput = textOutput && (textOutput.stdout || textOutput.stderr || textOutput.error);
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [qrDataUri, setQrDataUri] = useState<string | null>(null);

  const generateDataUri = (htmlContent: string): string => {
    // Basic check for size, might need refinement
    if (htmlContent.length > 2000) { // Arbitrary limit, data URIs can get very long
      console.warn("HTML content might be too large for a reliable Data URI QR Code.");
      // Potentially truncate or show a warning in the UI
    }
    return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
  }

  const handleToggleQrCode = () => {
    if (srcDoc) {
      // Generate data URI on demand to avoid storing large URIs in state unnecessarily long
      const dataUri = generateDataUri(srcDoc);
      setQrDataUri(dataUri);
      setShowQrDialog(true);
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-primary text-primary-foreground", className)}>
      <div className="flex items-center justify-between p-2 bg-secondary border-b border-border">
        <h3 className="text-sm font-semibold">Output / Preview</h3>
        <div className="flex items-center space-x-1">
          {showQrCodeToggle && srcDoc && (
             <Button variant="ghost" size="icon" onClick={handleToggleQrCode} aria-label="Show QR Code for mobile preview" title="Show QR Code for mobile preview">
               <QrCode className="w-5 h-5" />
             </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close output panel">
            <XCircle className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {srcDoc && !hasTextOutput && language !== 'python' && language !== 'cpp' && (
        <iframe
          srcDoc={srcDoc}
          title="Code Preview"
          sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
          className="flex-grow w-full h-full border-0"
          aria-label="Code execution preview"
        />
      )}

      {hasTextOutput && (language === 'python' || language === 'cpp') && (
        <ScrollArea className="flex-grow p-4 font-mono text-sm">
          {textOutput.stdout && (
            <pre className="whitespace-pre-wrap text-primary-foreground">{textOutput.stdout}</pre>
          )}
          {textOutput.stderr && (
            <pre className="whitespace-pre-wrap text-red-400">{textOutput.stderr}</pre>
          )}
          {textOutput.error && !textOutput.stderr?.includes(textOutput.error) && (
             <pre className="whitespace-pre-wrap text-destructive">{`Execution Error: ${textOutput.error}`}</pre>
          )}
        </ScrollArea>
      )}

      {!srcDoc && !hasTextOutput && (
         <div className="flex-grow p-4 text-muted-foreground">
           {language === 'python' ? 'Run Python code to see output.' :
            language === 'cpp' ? 'C++ execution in browser is a preview and not supported for running.' :
            'Run code to see output or preview.'}
         </div>
      )}

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
                    <QRCodeSVG value={qrDataUri} size={256} className="bg-white p-2 rounded-md shadow-md" />
                    <Alert variant="default" className="mt-4 text-xs">
                      <AlertDescription>
                        This QR code links to a self-contained HTML page (Data URI). Previews may fail if the code is too large or relies on external resources not accessible from the data URI context.
                      </AlertDescription>
                    </Alert>
                </>
             ) : (
                <p className="text-muted-foreground">Generating QR code...</p>
                // Optionally show a loader here
             )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
