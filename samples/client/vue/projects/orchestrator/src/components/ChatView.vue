<!--
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
 -->

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { A2UISurface, useMessageProcessor } from '@a2ui/vue';
import type * as Types from '@a2ui/web_core/types/types';
import { useChatService } from '@/services/chatService';
import type { UiMessage } from '@/types/uiMessage';

const props = defineProps<{
  agentName: string;
}>();

const { history, isStreaming, sendMessage, cancelStream, surfaces } = useChatService();

const inputValue = ref('');
const chatHistoryRef = ref<HTMLElement | null>(null);

const historyByTurn = computed(() => {
  const result: UiMessage[][] = [];
  let currentTurn: UiMessage[] = [];
  
  for (const message of history.value) {
    if (currentTurn.length === 0) {
      currentTurn.push(message);
      continue;
    }
    const lastMessage = currentTurn[currentTurn.length - 1];
    if (message.role.type === 'ui_agent' && lastMessage.role.type === 'ui_user') {
      currentTurn.push(message);
    } else {
      result.push(currentTurn);
      currentTurn = [message];
    }
  }
  if (currentTurn.length > 0) {
    result.push(currentTurn);
  }
  return result;
});

async function handleSubmit(event: Event) {
  event.preventDefault();
  const text = inputValue.value.trim();
  if (!text) return;
  
  inputValue.value = '';
  await sendMessage(text);
  
  await nextTick();
  scrollToBottom();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
    event.preventDefault();
    const form = (event.target as HTMLElement).closest('form');
    form?.requestSubmit();
  }
}

function scrollToBottom() {
  if (chatHistoryRef.value) {
    chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight;
  }
}

function getAgentName(role: UiMessage['role']) {
  if (role.type === 'ui_agent') {
    return role.subagentName ? `${role.name} + ${role.subagentName}` : role.name;
  }
  return 'User';
}
</script>

<template>
  <div class="chat-container">
    <div class="chat">
      <div class="chat-history-container" ref="chatHistoryRef" tabindex="0" role="region">
        <!-- Empty state -->
        <div v-if="history.length === 0" class="empty-history">
          <p>Send a message to start chatting with {{ agentName }}</p>
        </div>

        <!-- Message history -->
        <div v-else class="chat-history">
          <div
            v-for="(turn, turnIndex) in historyByTurn"
            :key="turnIndex"
            class="turn-container"
          >
            <div
              v-for="message in turn"
              :key="message.id"
              class="message"
              :class="{ 'user-message': message.role.type === 'ui_user' }"
            >
              <!-- Agent Header -->
              <div v-if="message.role.type === 'ui_agent'" class="agent-header">
                <div class="avatar">
                  <img
                    v-if="message.role.iconUrl"
                    :src="message.role.iconUrl"
                    :alt="message.role.name"
                  />
                  <span v-else class="material-symbols-outlined">smart_toy</span>
                </div>
                <span class="agent-name">{{ getAgentName(message.role) }}</span>
                <span v-if="message.status === 'pending'" class="loading-indicator">
                  <span class="material-symbols-outlined rotating">progress_activity</span>
                </span>
              </div>

              <!-- Message contents -->
              <div class="message-contents">
                <div
                  v-for="content in message.contents"
                  :key="content.id"
                  class="message-content"
                >
                  <!-- Text content -->
                  <div v-if="content.data && 'kind' in content.data && content.data.kind === 'text'" class="text-content">
                    {{ (content.data as any).text }}
                  </div>
                  <!-- Data content - render via A2UI -->
                  <div v-else-if="content.variant === 'a2ui_data_part'" class="a2ui-content">
                    <A2UISurface
                      v-for="[surfaceId, surface] in surfaces"
                      :key="surfaceId"
                      :surface-id="surfaceId"
                      :surface="surface"
                    />
                  </div>
                </div>
              </div>

              <!-- Message actions -->
              <div v-if="message.role.type === 'ui_agent' && message.status === 'completed'" class="message-actions">
                <button class="action-btn" title="Like">
                  <span class="material-symbols-outlined">thumb_up</span>
                </button>
                <button class="action-btn" title="Dislike">
                  <span class="material-symbols-outlined">thumb_down</span>
                </button>
                <button class="action-btn" title="Copy">
                  <span class="material-symbols-outlined">content_copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input area -->
      <form class="input-area" @submit="handleSubmit">
        <div class="input-container">
          <textarea
            v-model="inputValue"
            placeholder="Type a message..."
            rows="1"
            :disabled="isStreaming"
            @keydown="handleKeydown"
          ></textarea>
          <button
            v-if="isStreaming"
            type="button"
            class="cancel-btn"
            @click="cancelStream"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
          <button
            v-else
            type="submit"
            class="send-btn"
            :disabled="!inputValue.trim()"
          >
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  height: 100%;
  flex-direction: row;
  justify-content: center;
}

.chat {
  display: flex;
  flex-direction: column;
  width: 800px;
  height: 100%;
}

.chat-history-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.empty-history {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--n-50);
}

.chat-history {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.turn-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message.user-message {
  align-items: flex-end;
}

.message.user-message .message-contents {
  background: var(--p-90);
  border-radius: 16px 16px 4px 16px;
  padding: 12px 16px;
  max-width: 80%;
}

.agent-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--p-90);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.agent-name {
  font-weight: 500;
}

.loading-indicator {
  display: flex;
}

.rotating {
  animation: rotate 1s linear infinite;
}

.message-contents {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.text-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.a2ui-content {
  width: 100%;
}

.message-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.message:hover .message-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--n-50);
  border-radius: 4px;
}

.action-btn:hover {
  background: var(--n-95);
  color: var(--n-30);
}

.input-area {
  padding: 16px;
  border-top: 1px solid var(--n-90);
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: var(--n-98);
  border: 1px solid var(--n-90);
  border-radius: 24px;
  padding: 8px 16px;
}

.input-container textarea {
  flex: 1;
  border: none;
  background: none;
  resize: none;
  font-size: 16px;
  line-height: 1.5;
  max-height: 200px;
  font-family: inherit;
}

.input-container textarea:focus {
  outline: none;
}

.send-btn,
.cancel-btn {
  background: var(--p-40);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  background: var(--n-60);
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
