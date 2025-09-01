# 🧱 Brick Crush

> A modern, tactile puzzle game combining Tetris-like polyominoes with strategic line-clearing gameplay

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Platform](https://img.shields.io/badge/platform-web%20%7C%20android-blue)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](#)
[![React](https://img.shields.io/badge/React-19.1.1-blue)](#)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF)](#)

## 🎮 Game Overview

Brick Crush is a relaxing, strategic puzzle game perfect for short sessions. Place Tetris-like pieces on an 8×8 board to clear rows and columns, manage piece bags, and aim for high scores through smart placement and combo chains.

### ✨ Key Features

- **8×8 Strategic Board**: Compact grid for focused, tactical gameplay
- **Tetris-like Polyominoes**: 12 unique piece shapes with weighted generation
- **Line Clearing Mechanics**: Complete rows and columns to score points
- **Bag Management System**: 3 pieces at a time with strategic planning
- **Combo System**: Chain clears for massive score multipliers (up to 25x!)
- **Native Audio**: Low-latency sound effects with dynamic intensity
- **Particle Effects**: Atmospheric background and celebratory confetti
- **Cross-Platform**: Smooth 60 FPS on web and Android
- **Persistent Progress**: High scores and session persistence

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Android Studio** (for Android builds)
- Modern web browser with ES2020 support

### Development Setup

```bash
# Clone the repository
git clone https://github.com/hnguima/brick_crush.git
cd brick_crush

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to play the game locally.

### Building for Production

```bash
# Web build
npm run build

# Android build
npm run build:android
```

## 🎯 How to Play

### Basic Rules

1. **Drag & Drop**: Drag pieces from the tray to the 8×8 board
2. **Line Clearing**: Complete full rows or columns to clear them
3. **Bag Management**: Place all 3 pieces to get a new bag
4. **Game Over**: Game ends when no remaining pieces fit on the board

### Advanced Strategy

- **Combo Building**: Clear multiple lines in sequence for exponential scoring
- **Space Management**: Keep the board organized to maintain placement options
- **Piece Planning**: Consider upcoming pieces when making placements
- **Line Setup**: Create multiple completable lines for massive combo potential

### Scoring System

| Achievement | Base Points | Combo Multiplier |
|-------------|-------------|------------------|
| Single Line Clear | 100 | 1x - 25x |
| Multi-Line Clear | 100 × lines² | 1x - 25x |

## 🛠️ Technical Architecture

### Core Technologies

- **Frontend**: React 19.1 + TypeScript 5.8
- **Build Tool**: Vite 7.1 with HMR and optimized bundling
- **UI Framework**: Material-UI 7.3 with custom theme system
- **Mobile**: Capacitor 7.4 for native Android deployment
- **State Management**: Custom hooks with reactive patterns
- **Audio**: Capacitor Native Audio for low-latency sound
- **Animations**: CSS keyframes + tsparticles for effects

### Project Structure

```
src/
├── components/          # React UI components
│   ├── Board.tsx       # Game board with 8×8 grid
│   ├── Tray.tsx        # Piece tray with drag/drop
│   ├── GameOverDialog.tsx  # End game modal
│   └── ...
├── game/               # Core game logic
│   ├── GameEngine.ts   # Main game state management
│   ├── PieceSet.ts     # Tetris-like piece definitions
│   ├── BagManager.ts   # Piece bag generation
│   └── SoundEngine.ts  # Native audio integration
├── hooks/              # Custom React hooks
│   ├── useGameState.ts # Game state management
│   └── useGameLogic.ts # Game logic orchestration
├── styles/             # Centralized styling system
│   └── textStyles.ts   # Gradient text effects
└── ui/                 # UI rendering utilities
    └── BoardRenderer.tsx  # Reactive board rendering
```

### Performance Optimizations

- **Reactive Rendering**: Material-UI components with selective updates
- **Drag Optimization**: Pixel-level granularity with hardware acceleration
- **Audio Streaming**: Native audio buffers for instant sound feedback
- **Bundle Splitting**: Dynamic imports for development tools
- **Memory Management**: Efficient state updates and garbage collection

## 🎨 Visual Features

### Dynamic Text Styling
- **Combo-Based Colors**: Score display changes with combo level
- **Gradient Effects**: Animated rainbow, fire, and green gradients
- **Heartbeat Animation**: Pulsing effects for dramatic moments

### Particle Systems
- **Background Particles**: Subtle animated links for atmosphere  
- **Confetti Effects**: Celebratory particles scaled by achievement level
- **Board Animations**: Smooth line clearing with sequential delays

### Responsive Design
- **Mobile-First**: Touch-optimized with proper safe areas
- **Adaptive Layout**: Scales from 320px to 4K displays
- **Performance Scaling**: 60 FPS across all device tiers

## 📱 Mobile Features

### Android Support
- **Native Audio**: Zero-latency sound using Capacitor Native Audio
- **Touch Optimization**: Hardware-accelerated drag and drop
- **Safe Areas**: Proper edge-to-edge display handling
- **Performance**: Optimized rendering for mobile GPUs

### Cross-Platform
- **Capacitor Integration**: Single codebase for web and mobile
- **Platform Detection**: Automatic platform-specific optimizations
- **Build Pipeline**: Streamlined deployment to both platforms

## 🧪 Development Tools

### Testing Utilities (Dev Mode Only)
```javascript
// Browser console commands for testing
showTestGameOverDialog({ score: 1500, bestScore: 1000, isNewBest: true })
showTestNewBestDialog({ score: 2500, previousBest: 1800 })
showTestRegularGameOver({ score: 800, bestScore: 1500 })

// Line clearing test scenarios
runLineClearTest('singleLine')
runAllLineClearTests()
applyTestCaseToGame('quadLineClear')
```

### Debug Features
- **Game State Inspection**: Live state monitoring in dev tools
- **Audio Testing**: Individual sound effect triggers
- **Performance Metrics**: FPS monitoring and bottleneck detection
- **Combo Visualization**: Real-time combo system analysis

## 📊 Game Statistics

### Piece Distribution
- **12 Unique Shapes**: From single dots to complex polyominoes
- **Weighted Generation**: Balanced difficulty progression
- **Bag Strategy**: 3-piece sets with strategic variety

### Achievement Tracking
- **High Scores**: Persistent local storage with session recovery
- **Combo Records**: Track maximum combo achievements
- **Statistics**: Games played, lines cleared, perfect placements

## 🤝 Contributing

We welcome contributions! Please see our [Game Plan](docs/GAME_PLAN.md) for development guidelines and current roadmap.

### Development Guidelines
1. Follow conventional commit format: `type(scope): description`
2. Maintain TypeScript strict mode compliance
3. Add tests for new game logic features
4. Update documentation for user-facing changes

### Quick Development Commands
```bash
npm run dev          # Start development server
npm run build        # Production web build
npm run build:android # Android APK build
npm run lint         # Code quality checking
```

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🎮 Play Now

- **Web Version**: [Play Brick Crush](https://your-deployment-url.com)
- **Android**: Download from releases or build locally

---

**Developed with ❤️ using React, TypeScript, and Capacitor**

*Enjoy the satisfying puzzle experience of Brick Crush!*
