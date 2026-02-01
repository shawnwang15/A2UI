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
import ChatHistory from './ChatHistory.vue';
import ChatInput from './ChatInput.vue';
import { useChatService } from '../composables/useChatService';
import type { ChatCanvasConfig } from '../config';

const props = defineProps<{
  config: ChatCanvasConfig;
}>();

const chatService = useChatService();

const agentName = computed(() => 
  chatService.agentCard.value?.name || props.config.defaultAgentName
);
</script>

<template>
  <div class="chat">
    <ChatHistory
      :messages="chatService.history.value"
      :surfaces="chatService.surfaces"
      :config="config"
      :agent-name="agentName"
    >
      <template #empty>
        <slot name="empty">
          <div class="empty-state">
            <p>{{ config.emptyHistoryText }}</p>
          </div>
        </slot>
      </template>
    </ChatHistory>
    
    <ChatInput
      :placeholder="config.inputPlaceholder"
      :is-streaming="chatService.isStreaming.value"
      @send="chatService.sendMessage($event)"
      @cancel="chatService.cancelStream()"
    />
  </div>
</template>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--a2a-text-secondary, #5f6368);
  font-size: 14px;
}
</style>
