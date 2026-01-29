# Vue Orchestrator Demo

A Vue 3 implementation of the orchestrator client that demonstrates multi-agent conversations with A2UI rendering.

## Features

- **Multi-Agent Chat**: Communicate with an orchestrator agent that coordinates multiple sub-agents
- **A2UI Rendering**: Dynamic UI components rendered based on agent responses
- **Chart Support**: Integrated Chart.js for data visualization
- **Google Maps**: Map integration for location-based data
- **Context Preservation**: Maintains conversation context across messages

## Project Structure

```
orchestrator/
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── server.ts           # Vite middleware for A2A proxy
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── src/
    ├── main.ts         # Application entry point
    ├── App.vue         # Root component
    ├── environment.ts  # Environment configuration
    ├── theme.ts        # A2UI theme
    ├── styles.css      # Global styles
    ├── components/
    │   ├── ChatView.vue    # Chat interface
    │   ├── Chart.vue       # Chart component
    │   └── GoogleMap.vue   # Google Maps component
    ├── services/
    │   └── chatService.ts  # Chat service
    └── types/
        └── uiMessage.ts    # Message types
```

## Prerequisites

- Node.js 18+
- An orchestrator agent running on `localhost:10002`
- Google Maps API key (for map features)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Google Maps API key in `src/environment.ts`:
   ```typescript
   export const environment = {
     googleMapsApiKey: 'YOUR_API_KEY_HERE',
   };
   ```

3. Start the orchestrator agent:
   ```bash
   npm run serve:agent
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Or run both together:
```bash
npm run demo
```

## Usage

1. Open http://localhost:4000 in your browser
2. Type a message in the input field
3. The orchestrator agent will coordinate with sub-agents to provide responses
4. Responses may include text, charts, maps, and other A2UI components

## Custom Components

### Chart Component

Supports multiple chart types via Chart.js:
- Bar charts
- Line charts
- Pie charts
- Doughnut charts
- Polar area charts
- Radar charts

### Google Map Component

Displays Google Maps with:
- Custom center and zoom
- Multiple markers with labels
- Info windows

## A2A Integration

The client communicates with the orchestrator agent via A2A protocol:

1. User messages are sent to `/a2a` endpoint
2. The Vite middleware proxies requests to the agent
3. Agent responses with A2UI data are rendered dynamically
4. Context IDs are preserved for multi-turn conversations

## License

Apache License 2.0
