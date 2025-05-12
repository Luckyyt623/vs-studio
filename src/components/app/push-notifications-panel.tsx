
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Use Textarea for body
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PushNotificationsPanel() {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [topic, setTopic] = useState(''); // Optional target topic
  const [isSending, setIsSending] = useState(false);

  const handleSendNotification = async () => {
    if (!title || !body) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and body for the notification.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    // Simulate sending notification
    // In a real app, this would involve calling a backend function (e.g., Firebase Function)
    // that uses the Firebase Admin SDK to send the message via FCM.
    console.log("Simulating FCM Send:", { title, body, topic });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    toast({
      title: "Test Notification Sent (Simulated)",
      description: `Title: ${title}, Body: ${body}${topic ? `, Topic: ${topic}` : ''}`,
    });

    setIsSending(false);
    // Optionally clear fields after sending
    // setTitle('');
    // setBody('');
    // setTopic('');
  };

  return (
    <div className="space-y-4 p-1">
      <div>
        <Label htmlFor="notification-title" className="text-sm font-medium">Title</Label>
        <Input
          id="notification-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Notification Title"
          className="mt-1"
          disabled={isSending}
        />
      </div>
      <div>
        <Label htmlFor="notification-body" className="text-sm font-medium">Body</Label>
        <Textarea
          id="notification-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Notification message body..."
          rows={3}
          className="mt-1"
          disabled={isSending}
        />
      </div>
      <div>
        <Label htmlFor="notification-topic" className="text-sm font-medium">Target Topic (Optional)</Label>
        <Input
          id="notification-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., 'news' or leave blank for all"
          className="mt-1"
          disabled={isSending}
        />
         <p className="text-xs text-muted-foreground mt-1">Send to a specific FCM topic.</p>
      </div>
      <Button onClick={handleSendNotification} disabled={isSending || !title || !body} className="w-full">
        <Send className="w-4 h-4 mr-2" />
        {isSending ? 'Sending...' : 'Send Test Notification'}
      </Button>
      <p className="text-xs text-muted-foreground text-center pt-2">
        Note: This simulates sending via FCM. Requires backend setup for actual delivery.
      </p>
    </div>
  );
}
