/*
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
 */

import { ref, computed, type Ref, type InjectionKey, inject, provide, reactive } from 'vue';
import type * as Types from '@a2ui/web_core/types/types';

/**
 * State interface for the canvas service.
 */
export interface CanvasServiceState {
  /** The ID of the A2UI surface currently displayed in the canvas. */
  surfaceId: Ref<string | null>;
  /** The root component nodes of the A2UI surface to be rendered. */
  contents: Ref<Types.AnyComponentNode[] | null>;
  /** Whether the canvas is currently open. */
  isOpen: Ref<boolean>;
}

/**
 * Actions interface for the canvas service.
 */
export interface CanvasServiceActions {
  /**
   * Opens a specific A2UI surface in the canvas.
   * @param surfaceId The ID of the surface to open.
   * @param contents The root component nodes of the surface.
   */
  openSurface: (surfaceId: string, contents: Types.AnyComponentNode[]) => void;
  
  /**
   * Closes the canvas.
   */
  closeCanvas: () => void;
}

/**
 * Combined type for the canvas service.
 */
export type CanvasService = CanvasServiceState & CanvasServiceActions;

/**
 * Injection key for the canvas service.
 */
export const CANVAS_SERVICE_KEY: InjectionKey<CanvasService> = Symbol('canvasService');

/**
 * Creates a new canvas service instance.
 */
export function createCanvasService(): CanvasService {
  const surfaceId = ref<string | null>(null);
  const contents = ref<Types.AnyComponentNode[] | null>(null);
  
  const isOpen = computed(() => surfaceId.value !== null);

  function openSurface(id: string, nodes: Types.AnyComponentNode[]) {
    surfaceId.value = id;
    contents.value = [...nodes];
  }

  function closeCanvas() {
    surfaceId.value = null;
    contents.value = null;
  }

  return {
    surfaceId,
    contents,
    isOpen,
    openSurface,
    closeCanvas,
  };
}

/**
 * Provides the canvas service to child components.
 */
export function provideCanvasService(): CanvasService {
  const service = createCanvasService();
  provide(CANVAS_SERVICE_KEY, service);
  return service;
}

/**
 * Composable to use the canvas service in a component.
 * Must be called within a component that has access to the provided service.
 */
export function useCanvasService(): CanvasService {
  const service = inject(CANVAS_SERVICE_KEY);
  if (!service) {
    throw new Error('Canvas service not provided. Make sure to call provideCanvasService() in a parent component.');
  }
  return service;
}
