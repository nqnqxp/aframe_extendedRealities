# A-Frame Extended Realities

A modern A-Frame project built with Vite.

## Features

- 🚀 **Vite** - Fast development server and build tool
- 🥽 **A-Frame 1.7.0** - WebVR framework for building VR experiences
- 🎨 **Modern CSS** - Clean, responsive styling
- 📦 **ES Modules** - Modern JavaScript module system

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The application will automatically open in your browser at `http://localhost:3000`.

### Building for Production

```bash
# Build the project
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
# Preview the production build
npm run preview
```

## Project Structure

```
aframe_extendedrealities/
├── index.html          # Main HTML file with A-Frame scene
├── main.js            # JavaScript entry point
├── style.css          # Global styles
├── vite.config.js     # Vite configuration
├── package.json       # Project dependencies
└── README.md          # This file
```

## A-Frame Scene

The default scene includes:
- A colored sky
- A ground plane
- Three geometric shapes (box, sphere, cylinder)
- A camera with look and WASD controls

You can navigate the scene using:
- **Mouse/Touch**: Look around
- **WASD Keys**: Move around
- **Arrow Keys**: Alternative movement controls

## Customization

Edit `index.html` to modify the A-Frame scene by adding or removing entities, components, and attributes. You can also add custom A-Frame components in `main.js`.

## Resources

- [A-Frame Documentation](https://aframe.io/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [A-Frame Community](https://aframe.io/community/)

## License

ISC

