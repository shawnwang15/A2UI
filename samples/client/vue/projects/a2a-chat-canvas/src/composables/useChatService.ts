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

import { ref, computed, type Ref, type InjectionKey, inject, provide, reactive } from 'vue';
import { v4 as uuid } from 'uuid';
import { useMessageProcessor } from '@a2ui/vue';
import type * as Types from '@a2ui/web_core/types/types';
import type { AgentCard } from '@a2a-js/sdk';
import type { UiMessage, UiMessageContent, UiAgent } from '../types/uiMessage';
import type { A2AService } from '../types/a2aService';

/**
 * State interface for the chat service.
 */
export interface ChatServiceState {
  /** The chat history. */
  history: Ref<UiMessage[]>;
  /** Whether a stream is currently open. */
  isStreaming: Ref<boolean>;
  /** The A2UI surfaces. */
  surfaces: Map<string, Types.Surface>;
  /** The current agent card. */
  agentCard: Ref<AgentCard | null>;
  /** The current context ID. */
  contextId: Ref<string | undefined>;
}

/**
 * Actions interface for the chat service.
 */
export interface ChatServiceActions {
  /**
   * Sends a message to the agent.
   * @param text The message text.
   * @param metadata Optional metadata.
   */
  sendMessage: (text: string, metadata?: Record<string, any>) => Promise<void>;
  
  /**
   * Cancels the ongoing stream.
   */
  cancelStream: () => void;
  
  /**
   * Clears the chat history.
   */
  clearHistory: () => void;
  
  /**
   * Fetches the agent card.
   */
  fetchAgentCard: () => Promise<void>;
}

/**
 * Combined type for the chat service.
 */
export type ChatService = ChatServiceState & ChatServiceActions;

/**
 * Injection key for the chat service.
 */
export const CHAT_SERVICE_KEY: InjectionKey<ChatService> = Symbol('chatService');

/**
 * Creates a new chat service instance.
 * @param a2aService The A2A service to use for communication.
 */
export function createChatService(a2aService: A2AService): ChatService {
  const history = ref<UiMessage[]>([]);
  const isStreaming = ref(false);
  const surfaces = reactive(new Map<string, Types.Surface>());
  const agentCard = ref<AgentCard | null>(null);
  const contextId = ref<string | undefined>(undefined);
  
  let abortController: AbortController | null = null;
  const { processPart } = useMessageProcessor();

  async function fetchAgentCard() {
    try {
      agentCard.value = await a2aService.getAgentCard();
    } catch (e) {
      console.error('Failed to fetch agent card:', e);
    }
  }

  async function sendMessage(text: string, metadata?: Record<string, any>) {
    // Add user message
    const userMessage: UiMessage = {
      id: uuid(),
      role: { type: 'ui_user' },
      status: 'completed',
      contents: [
        {
          id: uuid(),
          variant: 'text',
          data: { kind: 'text', text },
        },
      ],
      timestamp: new Date(),
    };
    history.value.push(userMessage);

    // Create agent info from card
    const agent: UiAgent = {
      name: agentCard.value?.name || 'AI Agent',
      iconUrl: agentCard.value?.defaultAgentCard?.avatarUrl,
    };

    // Add pending agent message
    const agentMessage: UiMessage = {
      id: uuid(),
      role: { type: 'ui_agent', agent },
      status: 'pending',
      contents: [],
      timestamp: new Date(),
    };
    history.value.push(agentMessage);

    isStreaming.value = true;
    abortController = new AbortController();

    try {
      const response = await a2aService.sendMessage(
        [{ kind: 'text', text }],
        abortController.signal,
        { ...metadata, contextId: contextId.value }
      );

      // Update context ID if provided
      if (response.result && 'contextId' in response.result) {
        contextId.value = (response.result as any).contextId;
      }

      // Process response parts
      await processResponse(response, agentMessage);
      
      agentMessage.status = 'completed';
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        agentMessage.status = 'completed';
      } else {
        console.error('Error sending message:', error);
        agentMessage.status = 'error';
        agentMessage.contents.push({
          id: uuid(),
          variant: 'text',
          data: { kind: 'text', text: `Error: ${(error as Error).message}` },
        });
      }
    } finally {
      isStreaming.value = false;
      abortController = null;
    }
  }

  async function processResponse(response: any, agentMessage: UiMessage) {
    const result = response.result;
    if (!result) return;

    // Process artifacts
    if (result.artifacts?.length > 0) {
      for (const artifact of result.artifacts) {
        if (artifact.parts) {
          for (const part of artifact.parts) {
            await processPartContent(part, agentMessage);
          }
        }
      }
    }

    // Process message parts
    if (result.status?.message?.parts) {
      for (const part of result.status.message.parts) {
        await processPartContent(part, agentMessage);
      }
    }

    // Process final message
    if (result.message?.parts) {
      for (const part of result.message.parts) {
        await processPartContent(part, agentMessage);
      }
    }
  }

  async function processPartContent(part: any, agentMessage: UiMessage) {
    if (part.kind === 'text') {
      agentMessage.contents.push({
        id: uuid(),
        variant: 'text',
        data: part as Types.TextPart,
      });
    } else if (part.kind === 'a2ui_data') {
      const surfaceId = uuid();
      const surface = part.surface as Types.Surface;
      
      surfaces.set(surfaceId, surface);
      
      agentMessage.contents.push({
        id: uuid(),
        variant: 'a2ui_data_part',
        data: part,
        surface,
        surfaceId,
      });
    }
  }

  function cancelStream() {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  }

  function clearHistory() {
    history.value = [];
    surfaces.clear();
    contextId.value = undefined;
  }

  return {
    history,
    isStreaming,
    surfaces,
    agentCard,
    contextId,
    sendMessage,
    cancelStream,
    clearHistory,
    fetchAgentCard,
  };
}

/**
 * Provides the chat service to child components.
 * @param a2aService The A2A service to use.
 */
export function provideChatService(a2aService: A2AService): ChatService {
  const service = createChatService(a2aService);
  provide(CHAT_SERVICE_KEY, service);
  return service;
}

/**
 * Composable to use the chat service in a component.
 * Must be called within a component that has access to the provided service.
 */
export function useChatService(): ChatService {
  const service = inject(CHAT_SERVICE_KEY);
  if (!service) {
    throw new Error('Chat service not provided. Make sure to call provideChatService() in a parent component.');
  }
  return service;
}
