# A-Frame Pet Simulator 🐶

An interactive 3D pet simulator built with A-Frame 1.7.0 and Vite.

## Features

- 🐾 **Interactive Pet** - A cute 3D dog that you can feed and play with
- 📊 **Live Stats** - Track your pet's happiness and hunger levels
- 🎮 **Interactive Objects** - Click on food bowls and toys to interact
- 🎨 **3D Environment** - Fully rendered room with decorations
- 🚀 **Vite** - Fast development server and build tool
- 🥽 **A-Frame 1.7.0** - WebVR framework for building VR experiences
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

## How to Play

### Controls
- **Mouse/Touch**: Look around the room
- **Click/Tap**: Interact with objects (food bowl, toy ball)
- **WASD Keys**: Move around (optional)

### Interactions

#### 🍖 Feed Your Pet
Click on the **red food bowl** to feed your pet:
- Increases hunger by 30%
- Increases happiness by 10%
- Pet will jump with joy!
- Food refills after 3 seconds

#### 🎾 Play with Your Pet
Click on the **golden toy ball** to play:
- Increases happiness by 25%
- Decreases hunger by 10% (playing is tiring!)
- Pet will spin around happily
- Ball bounces when clicked

### Pet Needs
Your pet's needs change over time:
- **Hunger** decreases every 10 seconds
- **Happiness** decreases every 15 seconds
- Keep both stats high to have a happy pet!

## Scene Contents

The pet simulator includes:
- 🐶 **Animated Pet Dog** - Constantly rotating with a wagging tail
- 🏠 **Room Environment** - Wooden floor and walls
- 🍖 **Food Bowl** - Red bowl with clickable food
- 🎾 **Toy Ball** - Golden bouncing ball
- 💧 **Water Bowl** - Blue water bowl (decorative)
- 🛏️ **Pet Bed** - Purple cushioned bed
- 🖼️ **Decorations** - Picture frame and window on the wall

## Customization

### Adding New Interactions
Edit `main.js` to add new interactive components:
```javascript
AFRAME.registerComponent('your-component', {
  init: function() {
    this.el.addEventListener('click', () => {
      // Your interaction logic
    });
  }
});
```

### Modifying the Pet
Edit the pet entity in `index.html` to change its appearance or add new animations.

### Adjusting Game Balance
In `main.js`, modify the `petState` object and interaction functions to adjust:
- Initial stats
- Stat increase/decrease rates
- Animation speeds

## Resources

- [A-Frame Documentation](https://aframe.io/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [A-Frame Community](https://aframe.io/community/)

## License

ISC

