# Vue RizzCharts Demo

A Vue 3 implementation of the RizzCharts client that demonstrates sales data visualization with A2UI rendering.

## Features

- **Sales Data Visualization**: Interactive charts and maps for sales analytics
- **A2UI Rendering**: Dynamic UI components rendered based on agent responses
- **Multiple Catalogs**: Switch between different data catalogs
- **Chart Support**: Integrated Chart.js for data visualization (Bar, Line, Pie, etc.)
- **Google Maps**: Map integration for location-based sales data
- **Canvas Rendering**: Custom canvas component for flexible content display

## Project Structure

```
rizzcharts/
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
    │   ├── Toolbar.vue     # Toolbar with catalog selector
    │   ├── ChatView.vue    # Chat interface
    │   ├── Chart.vue       # Chart component
    │   ├── GoogleMap.vue   # Google Maps component
    │   └── Canvas.vue      # Canvas rendering component
    ├── services/
    │   └── chatService.ts  # Chat service
    └── types/
        └── uiMessage.ts    # Message types
```

## Prerequisites

- Node.js 18+
- A RizzCharts agent running on `localhost:10003`
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

3. Start the RizzCharts agent:
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

1. Open http://localhost:4001 in your browser
2. Select a data catalog from the toolbar dropdown
3. Ask questions about sales data:
   - "Show me sales by region"
   - "What are the top selling products?"
   - "Display monthly revenue trends"
   - "Map of store locations with sales volume"

## Custom Components

### Chart Component

Supports multiple chart types via Chart.js:
- Bar charts - for category comparisons
- Line charts - for trends over time
- Pie/Doughnut charts - for proportions
- Polar area charts - for multi-variable data
- Radar charts - for comparative analysis

### Google Map Component

Displays Google Maps with:
- Sales data by location
- Store markers with labels
- Custom zoom and center

### Canvas Component

Renders custom content:
- Text-based summaries
- Custom drawings
- Data exports

## A2A Integration

The client communicates with the RizzCharts agent via A2A protocol:

1. User messages are sent to `/a2a` endpoint with catalog metadata
2. The Vite middleware proxies requests to the agent
3. Agent responses with A2UI data (charts, maps) are rendered dynamically
4. Context IDs are preserved for follow-up questions

## License

Apache License 2.0
