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
import { ref, onMounted } from 'vue';
import { provideA2UI, DEFAULT_CATALOG } from '@a2ui/vue';
import { theme } from './theme';
import ChatView from './components/ChatView.vue';
import { environment } from './environment';

// Provide A2UI configuration with custom catalog
provideA2UI({
  catalog: DEFAULT_CATALOG,
  theme,
});

const agentName = ref('Orchestrator Agent');

onMounted(async () => {
  // Load Google Maps script
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&callback=initMap&libraries=marker`;
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);

  // Fetch agent card
  try {
    const response = await fetch('/a2a/agent-card');
    if (response.ok) {
      const card = await response.json();
      agentName.value = card.name || 'Orchestrator Agent';
    }
  } catch (e) {
    console.error('Failed to fetch agent card:', e);
  }
});
</script>

<template>
  <main class="main">
    <ChatView :agent-name="agentName" />
  </main>
</template>

<style scoped>
.main {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
