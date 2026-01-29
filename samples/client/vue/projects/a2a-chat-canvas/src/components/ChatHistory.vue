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
import { ref, watch, nextTick } from 'vue';
import Message from './Message.vue';
import type { UiMessage } from '../types/uiMessage';
import type { ChatCanvasConfig } from '../config';
import type * as Types from '@a2ui/web_core/types/types';

const props = defineProps<{
  messages: UiMessage[];
  surfaces: Map<string, Types.Surface>;
  config: ChatCanvasConfig;
  agentName: string;
}>();

const containerRef = ref<HTMLElement | null>(null);

// Auto-scroll to bottom when new messages arrive
watch(
  () => props.messages.length,
  async () => {
    await nextTick();
    scrollToBottom();
  }
);

function scrollToBottom() {
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight;
  }
}
</script>

<template>
  <div class="chat-history" ref="containerRef">
    <slot v-if="messages.length === 0" name="empty"></slot>
    
    <div v-else class="messages">
      <Message
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :surfaces="surfaces"
        :config="config"
        :agent-name="agentName"
      />
    </div>
  </div>
</template>

<style scoped>
.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
