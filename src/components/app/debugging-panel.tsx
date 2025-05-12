
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug, PlayCircle, History, Repeat } from 'lucide-react';

export function DebuggingPanel() {
  return (
    <div className="space-y-4">
      {/* General Info */}
       <Card className="bg-secondary border-border">
         <CardHeader className="p-3">
           <CardDescription className="text-xs text-muted-foreground">
              Debugging capabilities vary by language and runtime environment.
           </CardDescription>
         </CardHeader>
       </Card>

       {/* JavaScript/Web Debugging */}
       <Card className="bg-background border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-sm font-medium">Web Debugging (JS/HTML/CSS)</CardTitle>
              <PlayCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
           <CardContent className="p-3 pt-0">
                <p className="text-xs text-muted-foreground mb-2">
                   Use your browser's built-in Developer Tools (usually F12) for breakpoints, stepping, console logs, and inspecting elements in the preview pane.
                </p>
                <Button variant="outline" size="sm" className="w-full text-xs" disabled>
                   Open Browser DevTools (F12)
                </Button>
           </CardContent>
       </Card>

       {/* Python Debugging */}
       <Card className="bg-background border-border">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
             <CardTitle className="text-sm font-medium">Python Debugging</CardTitle>
             <Bug className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
          <CardContent className="p-3 pt-0">
               <p className="text-xs text-muted-foreground">
                  Python code runs in a browser environment (Pyodide). Standard output and errors appear in the 'Output' tab. Full step-debugging is not available. Use `print()` statements for basic debugging.
               </p>
          </CardContent>
      </Card>

       {/* Native/Framework Debugging */}
       <Card className="bg-background border-border">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
             <CardTitle className="text-sm font-medium">Native/Framework Debugging</CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
          <CardContent className="p-3 pt-0">
               <p className="text-xs text-muted-foreground mb-2">
                  For C#, Dart (Flutter), Java/Kotlin (Android), Swift (iOS), etc., use the platform's standard IDE (Visual Studio, Android Studio, Xcode) connected to an emulator or device for full debugging features like breakpoints and variable inspection.
               </p>
          </CardContent>
      </Card>

       {/* Hot Reload Info */}
       <Card className="bg-background border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-sm font-medium">Hot Reload</CardTitle>
              <Repeat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
           <CardContent className="p-3 pt-0">
                <p className="text-xs text-muted-foreground">
                   Hot Reload (seeing changes without full restart) is specific to frameworks like Flutter, React Native, .NET MAUI. It's typically triggered via their respective CLIs or IDE extensions, not directly from this editor. The 'Run Code' button for web previews provides a similar fast refresh.
                </p>
           </CardContent>
       </Card>

    </div>
  );
}
