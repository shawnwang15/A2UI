# @a2ui/vue

A Vue 3 renderer for A2UI (Agent-to-UI) protocol.

## Installation

```bash
npm install @a2ui/vue
```

## Usage

```vue
<script setup lang="ts">
import { A2UISurface, useMessageProcessor, provideA2UI, DEFAULT_CATALOG, defaultTheme } from '@a2ui/vue';

// Provide A2UI configuration
provideA2UI({
  catalog: DEFAULT_CATALOG,
  theme: defaultTheme,
});

const processor = useMessageProcessor();

// Process messages from your agent
processor.processMessages(messages);

// Get surfaces to render
const surfaces = processor.getSurfaces();
</script>

<template>
  <A2UISurface
    v-for="[surfaceId, surface] in surfaces"
    :key="surfaceId"
    :surface-id="surfaceId"
    :surface="surface"
  />
</template>
```

## Components

The library provides the following components:

- `A2UISurface` - The main surface component
- `A2UIRenderer` - Dynamic component renderer
- Layout: `A2UIRow`, `A2UIColumn`, `A2UICard`, `A2UIList`
- Content: `A2UIText`, `A2UIImage`, `A2UIIcon`, `A2UIVideo`, `A2UIAudio`
- Input: `A2UIButton`, `A2UITextField`, `A2UICheckbox`, `A2UISlider`, `A2UIMultipleChoice`, `A2UIDateTimeInput`
- Navigation: `A2UITabs`, `A2UIModal`
- Utility: `A2UIDivider`

## Development & Examples

To view interactive examples of all components:

```bash
# Install dependencies
npm install

# Start development server with examples
npm run dev

# Or explicitly run examples
npm run dev:examples
```

The examples will be available at http://localhost:5173

See [src/examples/README.md](src/examples/README.md) for more details about the examples.

### Building

```bash
# Build the library
npm run build

# Build examples for deployment
npm run build:examples
```

## License

Apache License 2.0
