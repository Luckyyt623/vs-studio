
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical, ExternalLink } from 'lucide-react';

export function FirebaseTestLabPanel() {

  const handleOpenTestLab = () => {
    // In a real app integrated with Firebase project context,
    // this could link directly to the project's Test Lab console.
    window.open('https://console.firebase.google.com/u/0/project/_/testlab/histories', '_blank');
  };

  return (
    <Card className="bg-background border-border mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
        <CardTitle className="text-sm font-medium flex items-center">
          <FlaskConical className="h-4 w-4 mr-2" /> Firebase Test Lab
        </CardTitle>
         <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleOpenTestLab}>
             <ExternalLink className="h-4 w-4 text-muted-foreground" />
             <span className="sr-only">Open Firebase Test Lab Console</span>
         </Button>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xs text-muted-foreground mb-2">
          Test your Android and iOS apps on a wide range of real and virtual devices hosted by Google. Upload your app package (APK, AAB, IPA) to the Firebase Console to run tests.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={handleOpenTestLab}
        >
          Go to Firebase Test Lab Console
           <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
         <p className="text-xs text-muted-foreground mt-2">
           Supports Robo tests (automated crawling), Game Loop tests, and custom tests using Espresso (Android) or XCTest (iOS).
         </p>
      </CardContent>
    </Card>
  );
}
