'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/chat';
import { ChatMessageData } from '@/components/chat/ChatMessage';

export default function ChatPage() {
  const [conversationHistory, setConversationHistory] = useState<{role: string, content: string}[]>([]);
  
  const demoMessages: ChatMessageData[] = [];

  // REAL API connection
  const handleSendMessage = async (message: string): Promise<ChatMessageData | void> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          conversationHistory 
        })
      });

      const data = await response.json();
      
      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: data.reply }
      ]);

      // Return the assistant's response
      return {
        id: data.messageId || `msg_${Date.now()}`,
        content: data.reply,
        role: 'ally',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Chat error:', error);
      return {
        id: `err_${Date.now()}`,
        content: "Sorry, I couldn't connect. Please try again.",
        role: 'ally',
        timestamp: new Date()
      };
    }
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
