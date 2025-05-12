
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WifiOff, Database, ExternalLink } from 'lucide-react';

export function OfflineSyncPanel() {

  const handleOpenDocs = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card className="bg-background border-border mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
        <CardTitle className="text-sm font-medium flex items-center">
          <WifiOff className="h-4 w-4 mr-2" /> Offline Sync (Firebase)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        <p className="text-xs text-muted-foreground">
          Firebase Firestore and Realtime Database offer robust offline persistence. Your app can continue working with local data even when the device is offline, and changes will sync automatically when connectivity is restored.
        </p>
        <div className="flex flex-col space-y-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs justify-start"
              onClick={() => handleOpenDocs('https://firebase.google.com/docs/firestore/manage-data/enable-offline')}
            >
               <Database className="h-3 w-3 mr-1.5" />
               Firestore Offline Docs
               <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
            </Button>
             <Button
              variant="outline"
              size="sm"
              className="w-full text-xs justify-start"
              onClick={() => handleOpenDocs('https://firebase.google.com/docs/database/android/offline-capabilities')} // Example for Android, similar concepts for iOS/Web
            >
               <Database className="h-3 w-3 mr-1.5" />
               Realtime DB Offline Docs
               <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
            </Button>
        </div>
         <p className="text-xs text-muted-foreground mt-2">
           Enable offline persistence in your Firebase SDK initialization code. Handle potential sync conflicts based on your application logic.
         </p>
      </CardContent>
    </Card>
  );
}
