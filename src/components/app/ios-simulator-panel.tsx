
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Computer, ExternalLink, PlayCircle } from 'lucide-react'; // Using 'Computer' icon for simulator

export function IosSimulatorPanel() {

  const handleOpenSimulator = () => {
    // In a real IDE integration, this would interact with Xcode tools.
    // For this web version, we link to Xcode documentation.
    window.open('https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device', '_blank');
  };

   const handleLaunchSimulator = () => {
    // Placeholder: In a real IDE, trigger simulator launch.
    alert("iOS Simulator launch simulation. Requires Xcode installed locally on macOS.");
  };

  return (
    <Card className="bg-background border-border mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
        <CardTitle className="text-sm font-medium flex items-center">
          <Computer className="h-4 w-4 mr-2" /> iOS Simulator
        </CardTitle>
         <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleOpenSimulator}>
             <ExternalLink className="h-4 w-4 text-muted-foreground" />
             <span className="sr-only">Open iOS Simulator Documentation</span>
         </Button>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xs text-muted-foreground mb-2">
          Test your iOS apps on simulators. Requires Xcode installed locally on macOS. Manage devices via Xcode's Devices and Simulators window.
        </p>
         <Button
          variant="outline"
          size="sm"
          className="w-full text-xs mb-2"
          onClick={handleLaunchSimulator}
        >
           <PlayCircle className="h-3 w-3 mr-1" />
           Launch Selected Simulator (Simulated)
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={handleOpenSimulator}
        >
          Simulator Docs (Xcode)
           <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
         <p className="text-xs text-muted-foreground mt-2">
           Configure simulated devices with different screen sizes, iOS versions, and hardware features.
         </p>
      </CardContent>
    </Card>
  );
}
