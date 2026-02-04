// Chat Interface Components
// The core conversational experience for Ally

export { ChatInterface, EmbeddedChat } from './ChatInterface';
export { ChatThread } from './ChatThread';
export { ChatInput } from './ChatInput';
export { ChatMessage } from './ChatMessage';
export { TypingIndicator, ActionTypingIndicator } from './TypingIndicator';
export { VoiceInputButton } from './VoiceInputButton';
export { 
  SkillSuggestions, 
  defaultSkillSuggestions, 
  getContextualSuggestions 
} from './SkillSuggestions';

// Types
export type { ChatMessageData, MessageRole, MessageStatus, ActionInfo } from './ChatMessage';
export type { SkillSuggestion } from './SkillSuggestions';
