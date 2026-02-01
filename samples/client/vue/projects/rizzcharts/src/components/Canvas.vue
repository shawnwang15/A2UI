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
import { ref, watch } from 'vue';

const props = defineProps<{
  content: string | { [key: string]: any };
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

watch(
  () => props.content,
  () => {
    renderContent();
  },
  { immediate: true, deep: true }
);

function renderContent() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set background
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render content
  const content = typeof props.content === 'string' 
    ? props.content 
    : JSON.stringify(props.content, null, 2);

  ctx.fillStyle = '#202124';
  ctx.font = '14px Roboto, sans-serif';
  
  const lines = content.split('\n');
  const lineHeight = 20;
  const padding = 16;
  
  lines.forEach((line, index) => {
    ctx.fillText(line, padding, padding + lineHeight * (index + 1));
  });
}
</script>

<template>
  <div class="canvas-container">
    <canvas ref="canvasRef" width="600" height="400"></canvas>
  </div>
</template>

<style scoped>
.canvas-container {
  width: 100%;
  overflow: auto;
  border-radius: 8px;
  border: 1px solid var(--n-90);
}

canvas {
  display: block;
  max-width: 100%;
}
</style>
