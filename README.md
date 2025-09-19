# Marble Race 3D 

A 3D marble racing game built with **React Three Fiber**, **Rapier Physics**, and **@react-three/drei**.  
Guide your marble through procedurally generated obstacles, score as far as you can, and try to beat your high score.  
Supports **keyboard controls** (desktop) and **touch controls** (mobile).

---

## Features

- Procedural level generation with a seed.
- Physics-based gameplay (Rapier).
- Keyboard + touch controls.
- Multiple obstacle types:
  - Spinner  
  - Limbo  
  - Axe  
  - Walls  
- Local storage high score persistence.
- Restart system when the game ends.

---

## Controls 

**Desktop:**
- `↑ / W` → Move Forward  
- `↓ / S` → Move Backward  
- `← / A` → Move Left  
- `→ / D` → Move Right  
- `Space` → Jump  

**Mobile / Touch:**  
- On-screen D-pad and jump button simulate keyboard controls.

---

## Project Structure 

src/
│── components/
│ ├── Level.jsx # Level & procedural obstacle logic
│ ├── Obstacles.jsx # Obstacle types (Spinner, Limbo, Axe, etc.)
│ ├── UI.jsx # Scoreboard, restart button, on-screen controls
│── store/
│ ├── useGame.js # Zustand store for game state (phase, restart, etc.)
│── App.jsx # Main entry point with Canvas & Physics
│── style.css # UI styling


---

## Getting Started 

### Prerequisites
- Node.js 18+
- npm or yarn

### Install
```bash
npm install
```

## Run Dev Server
```
npm run dev
```