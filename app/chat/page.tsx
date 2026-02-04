'use client';

import { ChatInterface } from '@/components/chat';
import { ChatMessageData } from '@/components/chat/ChatMessage';

export default function ChatPage() {
  // Example initial messages (optional - for demo purposes)
  const demoMessages: ChatMessageData[] = [];

  // In a real implementation, this would connect to your API
  const handleSendMessage = async (message: string): Promise<ChatMessageData | void> => {
    // This is where you'd call your AI backend
    // For now, returning void lets the demo mode handle it
    return;
  };

  return (
    <main className="h-screen h-[100dvh]">
      <ChatInterface
        userName="You"
        initialMessages={demoMessages}
        onSendMessage={handleSendMessage}
        showSkillSuggestions={true}
        showHeader={true}
      />
    </main>
  );
}
