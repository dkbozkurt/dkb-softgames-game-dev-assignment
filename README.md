# Softgames Game Developer Assignment

A game development assignment built with TypeScript and PixiJS v7, demonstrating three interactive demos with responsive design and modular architecture.

**[Live Demo](https://dkbozkurt.github.io/dkb-softgames-game-dev-assignment/)**

## Tasks

### Ace of Shadows
Card deck animation system with 144 sprites stacked and animated between multiple target stacks. Cards move every 1 second with 2-second animation duration, utilizing GSAP for smooth easing and z-index management for proper layering.

### Magic Words
Rich text rendering system that combines text and inline images (emojis). Fetches dialogue data from an external API and displays character conversations with avatars, typewriter effect, and word wrapping. Supports bold text parsing and dynamic emoji insertion.

### Phoenix Flame
Particle system rendering fire effects with exactly 10 sprites. Implements particle pooling, pre-warming, texture frame animation, and properties like velocity, scale decay, alpha fade, and color tinting over lifetime.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| TypeScript | Type-safe development |
| PixiJS 7.4.2 | 2D WebGL rendering |
| GSAP | Animation and tweening |
| Vite | Build tooling and dev server |
| SCSS | Styling |
| gh-pages | Deployment |

## Architecture

```
src/
├── engine/
│   ├── Components/      # Base PIXI wrappers (Container, Sprite, Text, Button)
│   ├── Utils/           # Utilities, math helpers
│   ├── Application.ts   # PIXI Application wrapper
│   ├── Engine.ts        # Singleton engine core
│   ├── EventSystem.ts   # Pub/sub event system
│   ├── Resources.ts     # Asset loading
│   ├── Time.ts          # Delta time management
│   └── Viewport.ts      # Responsive sizing
├── game/
│   ├── Config/          # Centralized configuration values
│   ├── Core/            # Audio, asset sources
│   ├── Scenes/          # Scene management and scene classes
│   ├── UI/              # Menu buttons, FPS counter, back button
│   └── World/           # Task implementations
│       ├── AceOfShadows/
│       ├── MagicWords/
│       └── PhoenixFlame/
└── main.ts
```

## Design Principles

**SOLID**
- Single Responsibility: Each class handles one concern (e.g., `CardDeck` manages cards, `CardStackManager` handles movement logic)
- Open/Closed: Scene base class extended by task scenes
- Dependency Inversion: Components depend on abstractions via EventSystem

**DRY**
- Centralized configuration in `GameConfig.ts`
- Reusable base components in engine layer
- Shared utilities for common operations

**KISS**
- Direct pixel coordinates instead of unit multiplier abstractions
- Simple scene lifecycle (show/hide/destroy)
- Minimal inheritance depth

**YAGNI**
- No premature abstractions
- Features implemented as needed per task requirements

## Key Patterns

- **Singleton**: Engine, SceneManager, AudioManager
- **Factory**: DialogueBubbleFactory, FireParticleFactory
- **Object Pool**: Particle reuse in Phoenix Flame
- **Observer**: EventSystem for decoupled communication
- **Component-based**: Modular scene construction

## Running Locally

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
npm run deploy
```

## Author

Dogukan Kaan Bozkurt