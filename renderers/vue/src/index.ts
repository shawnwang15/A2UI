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

// Core exports
export { provideA2UI, useA2UIConfig } from './config';
export { useMessageProcessor, MessageProcessor } from './data/processor';
export { useMarkdownRenderer } from './data/markdown';
export type { A2AServerPayload, A2TextPayload, A2DataPayload } from './data/types';

// Rendering exports
export { default as A2UiRenderer } from './rendering/A2UIRenderer.vue';
export { useDynamicComponent } from './rendering/useDynamicComponent';
export type { Catalog, CatalogEntry } from './rendering/catalog';
export { DEFAULT_CATALOG } from './catalog/default';

// Component exports
export { default as A2UISurface } from './catalog/A2UISurface.vue';
export { default as A2UIRow } from './catalog/A2UIRow.vue';
export { default as A2UIColumn } from './catalog/A2UIColumn.vue';
export { default as A2UICard } from './catalog/A2UICard.vue';
export { default as A2UIText } from './catalog/A2UIText.vue';
export { default as A2UIButton } from './catalog/A2UIButton.vue';
export { default as A2UIImage } from './catalog/A2UIImage.vue';
export { default as A2UIIcon } from './catalog/A2UIIcon.vue';
export { default as A2UIList } from './catalog/A2UIList.vue';
export { default as A2UIDivider } from './catalog/A2UIDivider.vue';
export { default as A2UITextField } from './catalog/A2UITextField.vue';
export { default as A2UICheckbox } from './catalog/A2UICheckbox.vue';
export { default as A2UISlider } from './catalog/A2UISlider.vue';
export { default as A2UIMultipleChoice } from './catalog/A2UIMultipleChoice.vue';
export { default as A2UIDateTimeInput } from './catalog/A2UIDateTimeInput.vue';
export { default as A2UITabs } from './catalog/A2UITabs.vue';
export { default as A2UIModal } from './catalog/A2UIModal.vue';
export { default as A2UIAudio } from './catalog/A2UIAudio.vue';
export { default as A2UIVideo } from './catalog/A2UIVideo.vue';

// Re-export types from @a2ui/web_core
export type * as Types from '@a2ui/web_core/types/types';
export type * as Primitives from '@a2ui/web_core/types/primitives';
export * as Styles from '@a2ui/web_core/styles/index';
