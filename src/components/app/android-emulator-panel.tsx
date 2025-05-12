
      
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, ExternalLink, PlayCircle } from 'lucide-react';

export function AndroidEmulatorPanel() {

  const handleOpenEmulatorManager = () => {
    // In a real IDE, this would interact with Android SDK tools.
    // For this web-based version, we link to Android Studio docs.
    window.open('https://developer.android.com/studio/run/managing-avds', '_blank');
  };

   const handleLaunchEmulator = () => {
    // Placeholder: In a real IDE, trigger emulator launch.
    alert("Emulator launch simulation. Requires Android Studio and SDK setup locally.");
  };

  return (
    <Card className="bg-background border-border mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
        <CardTitle className="text-sm font-medium flex items-center">
          <Smartphone className="h-4 w-4 mr-2" /> Android Emulator
        </CardTitle>
         <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleOpenEmulatorManager}>
             <ExternalLink className="h-4 w-4 text-muted-foreground" />
             <span className="sr-only">Open AVD Manager Documentation</span>
         </Button>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xs text-muted-foreground mb-2">
          Test your Android apps on virtual devices. Requires Android Studio and SDK installed locally. Manage devices via the AVD Manager.
        </p>
         <Button
          variant="outline"
          size="sm"
          className="w-full text-xs mb-2"
          onClick={handleLaunchEmulator}
        >
           <PlayCircle className="h-3 w-3 mr-1" />
           Launch Selected Emulator (Simulated)
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={handleOpenEmulatorManager}
        >
          AVD Manager Docs
           <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
         <p className="text-xs text-muted-foreground mt-2">
           Configure virtual devices (AVDs) with different screen sizes, Android versions, and hardware profiles.
         </p>
      </CardContent>
    </Card>
  );
}

    