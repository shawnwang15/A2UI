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
const props = defineProps<{
  agentName: string;
  catalogs: string[];
  selectedCatalog: string;
}>();

const emit = defineEmits<{
  (e: 'catalog-change', catalog: string): void;
}>();

function handleSelect(event: Event) {
  const select = event.target as HTMLSelectElement;
  emit('catalog-change', select.value);
}
</script>

<template>
  <header class="toolbar">
    <div class="toolbar-left">
      <h1 class="title">{{ agentName }}</h1>
    </div>
    <div class="toolbar-right">
      <div v-if="catalogs.length > 0" class="catalog-selector">
        <label for="catalog">Catalog:</label>
        <select id="catalog" :value="selectedCatalog" @change="handleSelect">
          <option v-for="catalog in catalogs" :key="catalog" :value="catalog">
            {{ catalog }}
          </option>
        </select>
      </div>
    </div>
  </header>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: var(--p-40);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.catalog-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.catalog-selector label {
  font-size: 14px;
}

.catalog-selector select {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.catalog-selector select:focus {
  outline: 2px solid rgba(255, 255, 255, 0.4);
}

.catalog-selector select option {
  background: white;
  color: var(--n-10);
}
</style>
