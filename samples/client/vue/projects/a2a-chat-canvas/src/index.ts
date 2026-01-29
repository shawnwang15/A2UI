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

// Components
export { default as A2aChatCanvas } from './components/A2aChatCanvas.vue';
export { default as Chat } from './components/Chat.vue';
export { default as Canvas } from './components/Canvas.vue';
export { default as ChatHistory } from './components/ChatHistory.vue';
export { default as ChatInput } from './components/ChatInput.vue';
export { default as Message } from './components/Message.vue';

// Composables
export { useChatService } from './composables/useChatService';
export { useCanvasService } from './composables/useCanvasService';

// Types
export type {
  UiMessage,
  UiMessageRole,
  UiMessageStatus,
  UiMessageContent,
  UiAgent,
} from './types/uiMessage';

export type {
  A2AService,
  A2AServiceOptions,
} from './types/a2aService';

// Config
export { DEFAULT_CONFIG, type ChatCanvasConfig } from './config';
