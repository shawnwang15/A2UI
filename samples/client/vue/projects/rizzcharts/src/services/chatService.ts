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

import { ref, reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { useMessageProcessor } from '@a2ui/vue';
import type * as Types from '@a2ui/web_core/types/types';
import type { UiMessage, UiMessageContent } from '@/types/uiMessage';

const history = ref<UiMessage[]>([]);
const isStreaming = ref(false);
const abortController = ref<AbortController | null>(null);

// Map to store surfaces by ID
const surfaces = reactive(new Map<string, Types.Surface>());

export function useChatService() {
  const { processPart } = useMessageProcessor();

  async function sendMessage(text: string, catalog: string = '') {
    // Add user message
    const userMessage: UiMessage = {
      id: uuidv4(),
      role: { type: 'ui_user' },
      status: 'completed',
      contents: [
        {
          id: uuidv4(),
          variant: 'text',
          data: { kind: 'text', text },
        },
      ],
    };
    history.value.push(userMessage);

    // Add pending agent message
    const agentMessage: UiMessage = {
      id: uuidv4(),
      role: { type: 'ui_agent', name: 'RizzCharts' },
      status: 'pending',
      contents: [],
    };
    history.value.push(agentMessage);

    isStreaming.value = true;
    abortController.value = new AbortController();

    try {
      const response = await fetch('/a2a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parts: [{ kind: 'text', text }],
          component_catalog: catalog,
        }),
        signal: abortController.value.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Process response
      if (data.result) {
        const task = data.result;

        // Process artifacts
        if (task.artifacts && task.artifacts.length > 0) {
          for (const artifact of task.artifacts) {
            if (artifact.parts) {
              for (const part of artifact.parts) {
                await processPartContent(part, agentMessage);
              }
            }
          }
        }

        // Process message parts
        if (task.status?.message?.parts) {
          for (const part of task.status.message.parts) {
            await processPartContent(part, agentMessage);
          }
        }

        // Process final message
        if (task.message?.parts) {
          for (const part of task.message.parts) {
            await processPartContent(part, agentMessage);
          }
        }
      }

      agentMessage.status = 'completed';
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        agentMessage.status = 'completed';
      } else {
        console.error('Error sending message:', error);
        agentMessage.status = 'error';
        agentMessage.contents.push({
          id: uuidv4(),
          variant: 'text',
          data: { kind: 'text', text: `Error: ${(error as Error).message}` },
        });
      }
    } finally {
      isStreaming.value = false;
      abortController.value = null;
    }
  }

  async function processPartContent(part: any, agentMessage: UiMessage) {
    if (part.kind === 'text') {
      agentMessage.contents.push({
        id: uuidv4(),
        variant: 'text',
        data: part as Types.TextPart,
      });
    } else if (part.kind === 'a2ui_data') {
      const surfaceId = uuidv4();
      const surface = part.surface as Types.Surface;
      
      surfaces.set(surfaceId, surface);
      
      agentMessage.contents.push({
        id: uuidv4(),
        variant: 'a2ui_data_part',
        data: part,
        surface,
      });
    }
  }

  function cancelStream() {
    if (abortController.value) {
      abortController.value.abort();
    }
  }

  function clearHistory() {
    history.value = [];
    surfaces.clear();
  }

  return {
    history,
    isStreaming,
    surfaces,
    sendMessage,
    cancelStream,
    clearHistory,
  };
}
