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
import { A2UISurface } from '@a2ui/vue';
import { useCanvasService } from '../composables/useCanvasService';

const canvasService = useCanvasService();

function handleClose() {
  canvasService.closeCanvas();
}
</script>

<template>
  <div class="canvas">
    <div class="canvas-header">
      <h3 class="canvas-title">Details</h3>
      <button class="close-btn" @click="handleClose" title="Close">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    
    <div class="canvas-content">
      <A2UISurface
        v-if="canvasService.surfaceId.value && canvasService.contents.value"
        :surface-id="canvasService.surfaceId.value"
        :surface="{ contents: canvasService.contents.value }"
      />
    </div>
  </div>
</template>

<style scoped>
.canvas {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.canvas-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--a2a-border-color, #dadce0);
}

.canvas-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.close-btn {
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

.close-btn:hover {
  background: var(--a2a-hover-bg, #f1f3f4);
}

.canvas-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
}
</style>
