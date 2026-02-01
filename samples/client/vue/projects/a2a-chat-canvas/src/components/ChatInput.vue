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
import { ref } from 'vue';

const props = defineProps<{
  placeholder: string;
  isStreaming: boolean;
}>();

const emit = defineEmits<{
  (e: 'send', text: string): void;
  (e: 'cancel'): void;
}>();

const inputValue = ref('');

function handleSubmit(event: Event) {
  event.preventDefault();
  const text = inputValue.value.trim();
  if (!text || props.isStreaming) return;
  
  inputValue.value = '';
  emit('send', text);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
    event.preventDefault();
    const form = (event.target as HTMLElement).closest('form');
    form?.requestSubmit();
  }
}

function handleCancel() {
  emit('cancel');
}
</script>

<template>
  <form class="chat-input" @submit="handleSubmit">
    <div class="input-container">
      <textarea
        v-model="inputValue"
        :placeholder="placeholder"
        rows="1"
        :disabled="isStreaming"
        @keydown="handleKeydown"
      ></textarea>
      
      <button
        v-if="isStreaming"
        type="button"
        class="action-btn cancel-btn"
        @click="handleCancel"
        title="Cancel"
      >
        <span class="material-symbols-outlined">close</span>
      </button>
      
      <button
        v-else
        type="submit"
        class="action-btn send-btn"
        :disabled="!inputValue.trim()"
        title="Send"
      >
        <span class="material-symbols-outlined">send</span>
      </button>
    </div>
  </form>
</template>

<style scoped>
.chat-input {
  padding: 16px;
  border-top: 1px solid var(--a2a-border-color, #dadce0);
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: var(--a2a-input-bg, #f8f9fa);
  border: 1px solid var(--a2a-border-color, #dadce0);
  border-radius: 24px;
  padding: 8px 16px;
}

.input-container textarea {
  flex: 1;
  border: none;
  background: none;
  resize: none;
  font-size: 14px;
  line-height: 1.5;
  max-height: 200px;
  font-family: inherit;
  color: inherit;
}

.input-container textarea:focus {
  outline: none;
}

.action-btn {
  background: var(--a2a-primary, #4285f4);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  background: var(--a2a-text-secondary, #5f6368);
}
</style>
