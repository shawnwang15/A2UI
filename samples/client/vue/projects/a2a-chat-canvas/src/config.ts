/*
 Copyright 2025 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * Configuration options for the ChatCanvas component.
 */
export interface ChatCanvasConfig {
  /** Whether to show the canvas panel. */
  showCanvas: boolean;
  /** Default agent name to display. */
  defaultAgentName: string;
  /** Placeholder text for the input field. */
  inputPlaceholder: string;
  /** Text to display when chat history is empty. */
  emptyHistoryText: string;
  /** Whether to enable markdown rendering in messages. */
  enableMarkdown: boolean;
  /** Whether to show message timestamps. */
  showTimestamps: boolean;
  /** Whether to show message actions (like, dislike, copy). */
  showMessageActions: boolean;
}

/**
 * Default configuration for the ChatCanvas component.
 */
export const DEFAULT_CONFIG: ChatCanvasConfig = {
  showCanvas: true,
  defaultAgentName: 'AI Agent',
  inputPlaceholder: 'Type a message...',
  emptyHistoryText: 'Send a message to start chatting',
  enableMarkdown: true,
  showTimestamps: false,
  showMessageActions: true,
};
