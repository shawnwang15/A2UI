# Vue A2A Chat Canvas

A Vue 3 reusable library for building chat interfaces with A2UI rendering and canvas support. This is the Vue equivalent of the Angular `a2a-chat-canvas` library.

## Features

- **Chat Interface**: Complete chat UI with message history, input, and message actions
- **Canvas Panel**: Side panel for displaying expanded A2UI surfaces
- **A2UI Integration**: Seamless rendering of A2UI components from agent responses
- **Customizable**: Configurable theme, actions, and behavior
- **TypeScript Support**: Full TypeScript definitions

## Installation

```bash
npm install @a2ui/vue-chat-canvas
```

## Usage

### Basic Usage

```vue
<script setup lang="ts">
import { A2aChatCanvas } from '@a2ui/vue-chat-canvas';
import { provideA2UI, DEFAULT_CATALOG } from '@a2ui/vue';
import type { A2AService } from '@a2ui/vue-chat-canvas';

// Create your A2A service implementation
const a2aService: A2AService = {
  async getAgentCard() {
    const response = await fetch('/a2a/agent-card');
    return response.json();
  },
  async sendMessage(parts, signal, metadata) {
    const response = await fetch('/a2a', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parts, ...metadata }),
      signal,
    });
    return response.json();
  },
};

// Provide A2UI configuration
provideA2UI({
  catalog: DEFAULT_CATALOG,
  theme: { /* your theme */ },
});
</script>

<template>
  <A2aChatCanvas :a2a-service="a2aService" />
</template>
```

### With Custom Configuration

```vue
<script setup lang="ts">
import { A2aChatCanvas } from '@a2ui/vue-chat-canvas';

const config = {
  showCanvas: true,
  defaultAgentName: 'My AI Assistant',
  inputPlaceholder: 'Ask me anything...',
  emptyHistoryText: 'Start a conversation',
  showTimestamps: true,
  showMessageActions: true,
};
</script>

<template>
  <A2aChatCanvas 
    :a2a-service="a2aService" 
    :config="config"
  >
    <template #empty>
      <div class="custom-empty-state">
        <h2>Welcome!</h2>
        <p>Ask me anything to get started.</p>
      </div>
    </template>
  </A2aChatCanvas>
</template>
```

### Using Individual Components

You can also use the individual components if you need more control:

```vue
<script setup lang="ts">
import { 
  Chat, 
  Canvas, 
  ChatHistory, 
  ChatInput,
  useChatService,
  useCanvasService,
  provideCanvasService,
  provideChatService,
} from '@a2ui/vue-chat-canvas';

// Set up services
const canvasService = provideCanvasService();
const chatService = provideChatService(a2aService);
</script>

<template>
  <div class="my-layout">
    <Chat :config="config" />
    <Canvas v-if="canvasService.isOpen.value" />
  </div>
</template>
```

## API

### Components

#### `A2aChatCanvas`

The main component that combines Chat and Canvas.

| Prop | Type | Description |
|------|------|-------------|
| `a2aService` | `A2AService` | Required. The A2A service for agent communication. |
| `config` | `Partial<ChatCanvasConfig>` | Optional. Configuration overrides. |

#### `Chat`

The chat interface component.

| Prop | Type | Description |
|------|------|-------------|
| `config` | `ChatCanvasConfig` | Required. Configuration options. |

#### `Canvas`

The canvas panel for displaying expanded A2UI surfaces.

### Composables

#### `useChatService()`

Access the chat service for managing messages and agent communication.

```typescript
const { 
  history,      // Ref<UiMessage[]>
  isStreaming,  // Ref<boolean>
  surfaces,     // Map<string, Surface>
  agentCard,    // Ref<AgentCard | null>
  sendMessage,  // (text: string, metadata?: any) => Promise<void>
  cancelStream, // () => void
  clearHistory, // () => void
} = useChatService();
```

#### `useCanvasService()`

Access the canvas service for managing the canvas panel.

```typescript
const {
  surfaceId,   // Ref<string | null>
  contents,    // Ref<AnyComponentNode[] | null>
  isOpen,      // ComputedRef<boolean>
  openSurface, // (id: string, contents: AnyComponentNode[]) => void
  closeCanvas, // () => void
} = useCanvasService();
```

### Types

#### `A2AService`

Interface for the A2A service that communicates with agents.

```typescript
interface A2AService {
  getAgentCard(): Promise<AgentCard | null>;
  sendMessage(
    parts: Part[],
    signal?: AbortSignal,
    metadata?: Record<string, any>
  ): Promise<SendMessageSuccessResponse>;
}
```

#### `ChatCanvasConfig`

Configuration options for the ChatCanvas component.

```typescript
interface ChatCanvasConfig {
  showCanvas: boolean;
  defaultAgentName: string;
  inputPlaceholder: string;
  emptyHistoryText: string;
  enableMarkdown: boolean;
  showTimestamps: boolean;
  showMessageActions: boolean;
}
```

## Styling

The library uses CSS custom properties for theming. Override these in your app:

```css
:root {
  --a2a-primary: #4285f4;
  --a2a-text-primary: #202124;
  --a2a-text-secondary: #5f6368;
  --a2a-border-color: #dadce0;
  --a2a-surface: #ffffff;
  --a2a-input-bg: #f8f9fa;
  --a2a-hover-bg: #f1f3f4;
  --a2a-user-message-bg: #e8f0fe;
  --a2a-avatar-bg: #e8f0fe;
}
```

## License

Apache License 2.0
