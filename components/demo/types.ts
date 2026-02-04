// Demo mode types

export interface DemoMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  typing?: boolean;
}

export interface ExampleConversation {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'productivity' | 'email' | 'coding' | 'research' | 'creative';
  messages: Omit<DemoMessage, 'id' | 'timestamp'>[];
}

export interface DemoState {
  messages: DemoMessage[];
  messageCount: number;
  maxMessages: number;
  isLimitReached: boolean;
  isTyping: boolean;
}

export const DEMO_MESSAGE_LIMIT = 5;
