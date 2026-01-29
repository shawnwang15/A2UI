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
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { environment } from '@/environment';

const props = defineProps<{
  config: {
    center?: { lat: number; lng: number };
    zoom?: number;
    markers?: Array<{
      position: { lat: number; lng: number };
      title?: string;
      label?: string;
    }>;
    [key: string]: any;
  };
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: google.maps.Map | null = null;
let markers: google.maps.Marker[] = [];

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  // Clean up markers
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
});

watch(
  () => props.config,
  () => {
    if (map) {
      updateMap();
    }
  },
  { deep: true }
);

function initMap() {
  if (!mapContainer.value || typeof google === 'undefined') {
    // Google Maps not loaded yet, retry
    setTimeout(initMap, 500);
    return;
  }

  const center = props.config?.center || { lat: 37.7749, lng: -122.4194 };
  const zoom = props.config?.zoom || 10;

  map = new google.maps.Map(mapContainer.value, {
    center,
    zoom,
    mapId: 'DEMO_MAP_ID',
  });

  updateMarkers();
}

function updateMap() {
  if (!map) return;

  if (props.config?.center) {
    map.setCenter(props.config.center);
  }
  if (props.config?.zoom) {
    map.setZoom(props.config.zoom);
  }
  updateMarkers();
}

function updateMarkers() {
  if (!map) return;

  // Clear existing markers
  markers.forEach((marker) => marker.setMap(null));
  markers = [];

  // Add new markers
  const configMarkers = props.config?.markers || [];
  for (const markerConfig of configMarkers) {
    const marker = new google.maps.Marker({
      position: markerConfig.position,
      map,
      title: markerConfig.title,
      label: markerConfig.label,
    });
    markers.push(marker);
  }
}

// Expose for global callback
declare global {
  interface Window {
    initMap: () => void;
  }
}

window.initMap = initMap;
</script>

<template>
  <div class="google-map-container" ref="mapContainer"></div>
</template>

<style scoped>
.google-map-container {
  width: 100%;
  height: 350px;
  min-height: 250px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
