# WebGL Wind Visualization with MapLibre GL

A real-time wind particle visualization using WebGL2 and MapLibre GL JS. This project demonstrates how to create custom layers in MapLibre GL to visualize wind patterns using particle systems.

## Features

- Real-time wind particle animation using WebGL2
- Custom MapLibre GL layer implementation
- Smooth particle motion with time-based animation
- Configurable particle system parameters
- Interactive map controls
- Wind speed and direction visualization

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern browser with WebGL2 support

## Installation

```bash
# Clone the repository
git clone git@github.com:anup39/webglwind.git

# Navigate to project directory
cd webglwind

# Install dependencies
npm install
```

## Development

```bash
# Start development server
npm run dev
```

The development server will start at `http://localhost:5173`

## Building for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
webglwind/
├── src/
│   ├── main.ts          # Application entry point
│   ├── map.ts           # Map initialization and setup
│   └── windlayer.ts     # WebGL wind particle visualization
├── index.html           # Main HTML file
├── package.json         # Project dependencies
└── vite.config.ts       # Vite configuration
```

## Configuration

To use this project, you'll need to:

1. Get a MapTiler API key
2. Create a `.env` file in the root directory:

```env
VITE_MAPTILER_TOKEN=your_api_key_here
```

## Technical Details

- Built with TypeScript for type safety
- Uses Vite as the build tool
- Implements custom WebGL2 shaders for particle animation
- Integrates with MapLibre GL JS for map rendering
- Uses environment variables for API key management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- MapLibre GL JS team for the excellent mapping library
- WebGL2 documentation and community resources
