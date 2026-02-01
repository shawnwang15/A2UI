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
import { computed } from 'vue';
import { A2UISurface } from '@a2ui/vue';
import { useCanvasService } from '../composables/useCanvasService';
import type { UiMessage, UiMessageContent } from '../types/uiMessage';
import type { ChatCanvasConfig } from '../config';
import type * as Types from '@a2ui/web_core/types/types';

const props = defineProps<{
  message: UiMessage;
  surfaces: Map<string, Types.Surface>;
  config: ChatCanvasConfig;
  agentName: string;
}>();

const canvasService = useCanvasService();

const isUser = computed(() => props.message.role.type === 'ui_user');
const isAgent = computed(() => props.message.role.type === 'ui_agent');

const displayName = computed(() => {
  if (isUser.value) return 'You';
  if (isAgent.value) {
    const agent = props.message.role.agent;
    if (agent.subagentName) {
      return `${agent.name} + ${agent.subagentName}`;
    }
    return agent.name;
  }
  return 'Unknown';
});

const avatarUrl = computed(() => {
  if (isAgent.value) {
    return props.message.role.agent.iconUrl;
  }
  return undefined;
});

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function openInCanvas(content: UiMessageContent) {
  if (content.surfaceId && content.surface?.contents) {
    canvasService.openSurface(content.surfaceId, content.surface.contents);
  }
}

function copyText(text: string) {
  navigator.clipboard.writeText(text);
}
</script>

<template>
  <div class="message" :class="{ 'user-message': isUser }">
    <!-- Agent Header -->
    <div v-if="isAgent" class="message-header">
      <div class="avatar">
        <img v-if="avatarUrl" :src="avatarUrl" :alt="displayName" />
        <span v-else class="material-symbols-outlined">smart_toy</span>
      </div>
      <span class="sender-name">{{ displayName }}</span>
      <span v-if="message.status === 'pending'" class="loading-indicator">
        <span class="material-symbols-outlined rotating">progress_activity</span>
      </span>
      <span v-if="config.showTimestamps" class="timestamp">
        {{ formatTimestamp(message.timestamp) }}
      </span>
    </div>

    <!-- Message Contents -->
    <div class="message-body">
      <div
        v-for="content in message.contents"
        :key="content.id"
        class="content-block"
      >
        <!-- Text Content -->
        <div
          v-if="content.variant === 'text' && content.data"
          class="text-content"
        >
          {{ (content.data as any).text }}
        </div>

        <!-- A2UI Content -->
        <div
          v-else-if="content.variant === 'a2ui_data_part' && content.surface"
          class="a2ui-content"
        >
          <A2UISurface
            :surface-id="content.surfaceId!"
            :surface="content.surface"
          />
          <button
            v-if="config.showCanvas"
            class="expand-btn"
            @click="openInCanvas(content)"
            title="Open in canvas"
          >
            <span class="material-symbols-outlined">open_in_full</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Message Actions -->
    <div
      v-if="isAgent && message.status === 'completed' && config.showMessageActions"
      class="message-actions"
    >
      <button class="action-btn" title="Like">
        <span class="material-symbols-outlined">thumb_up</span>
      </button>
      <button class="action-btn" title="Dislike">
        <span class="material-symbols-outlined">thumb_down</span>
      </button>
      <button class="action-btn" title="Copy" @click="copyText(message.contents.map(c => (c.data as any)?.text || '').join('\n'))">
        <span class="material-symbols-outlined">content_copy</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.message {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message.user-message {
  align-items: flex-end;
}

.message.user-message .message-body {
  background: var(--a2a-user-message-bg, #e8f0fe);
  border-radius: 16px 16px 4px 16px;
  padding: 12px 16px;
  max-width: 80%;
}

.message-header {
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
  background: var(--a2a-avatar-bg, #e8f0fe);
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sender-name {
  font-weight: 500;
  font-size: 14px;
}

.timestamp {
  font-size: 12px;
  color: var(--a2a-text-secondary, #5f6368);
}

.loading-indicator {
  display: flex;
}

.rotating {
  animation: rotate 1s linear infinite;
}

.message-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.content-block {
  position: relative;
}

.text-content {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px;
  line-height: 1.5;
}

.a2ui-content {
  position: relative;
}

.expand-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--a2a-surface, #ffffff);
  border: 1px solid var(--a2a-border-color, #dadce0);
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.a2ui-content:hover .expand-btn {
  opacity: 1;
}

.expand-btn:hover {
  background: var(--a2a-hover-bg, #f1f3f4);
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
  color: var(--a2a-text-secondary, #5f6368);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: var(--a2a-hover-bg, #f1f3f4);
  color: var(--a2a-text-primary, #202124);
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
