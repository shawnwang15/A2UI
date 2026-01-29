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
import Chat from './Chat.vue';
import Canvas from './Canvas.vue';
import { provideCanvasService } from '../composables/useCanvasService';
import { provideChatService } from '../composables/useChatService';
import type { A2AService } from '../types/a2aService';
import { DEFAULT_CONFIG, type ChatCanvasConfig } from '../config';

const props = withDefaults(
  defineProps<{
    /** The A2A service for agent communication. */
    a2aService: A2AService;
    /** Optional configuration overrides. */
    config?: Partial<ChatCanvasConfig>;
  }>(),
  {
    config: () => ({}),
  }
);

// Merge config with defaults
const mergedConfig = computed<ChatCanvasConfig>(() => ({
  ...DEFAULT_CONFIG,
  ...props.config,
}));

// Provide services
const canvasService = provideCanvasService();
const chatService = provideChatService(props.a2aService);

// Fetch agent card on mount
chatService.fetchAgentCard();
</script>

<template>
  <div class="a2a-chat-canvas" :class="{ 'canvas-open': canvasService.isOpen.value }">
    <div class="chat-panel">
      <Chat :config="mergedConfig" />
    </div>
    <div v-if="mergedConfig.showCanvas && canvasService.isOpen.value" class="canvas-panel">
      <Canvas />
    </div>
  </div>
</template>

<style scoped>
.a2a-chat-canvas {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.chat-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  transition: flex 0.3s ease;
}

.canvas-open .chat-panel {
  flex: 0 0 50%;
}

.canvas-panel {
  flex: 0 0 50%;
  border-left: 1px solid var(--a2a-border-color, #dadce0);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
