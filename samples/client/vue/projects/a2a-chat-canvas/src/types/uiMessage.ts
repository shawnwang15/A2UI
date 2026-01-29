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

import type * as Types from '@a2ui/web_core/types/types';

/**
 * Represents the role of a message sender.
 */
export type UiMessageRole =
  | { type: 'ui_user' }
  | { type: 'ui_agent'; agent: UiAgent };

/**
 * Represents the status of a message.
 */
export type UiMessageStatus = 'pending' | 'streaming' | 'completed' | 'error';

/**
 * Represents an AI agent that can participate in the conversation.
 */
export interface UiAgent {
  /** The name of the agent. */
  name: string;
  /** Optional URL to the agent's icon/avatar. */
  iconUrl?: string;
  /** Optional name of a sub-agent (for delegated responses). */
  subagentName?: string;
}

/**
 * Represents a piece of content within a message.
 */
export interface UiMessageContent {
  /** Unique identifier for this content piece. */
  id: string;
  /** The type of content - either text or A2UI data. */
  variant: 'text' | 'a2ui_data_part';
  /** The raw part data (text or a2ui_data). */
  data?: Types.TextPart | Types.A2UIDataPart;
  /** If variant is 'a2ui_data_part', the surface to render. */
  surface?: Types.Surface;
  /** The ID of the surface, used for canvas display. */
  surfaceId?: string;
}

/**
 * Represents a message in the chat history.
 */
export interface UiMessage {
  /** Unique identifier for this message. */
  id: string;
  /** The role of the message sender. */
  role: UiMessageRole;
  /** The current status of the message. */
  status: UiMessageStatus;
  /** The content pieces within this message. */
  contents: UiMessageContent[];
  /** Timestamp when the message was created. */
  timestamp: Date;
}
