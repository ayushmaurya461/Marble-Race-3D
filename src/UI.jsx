import { useKeyboardControls } from "@react-three/drei";
import "./style.css";
import useGame from "./store/useGame";
import { useEffect, useRef } from "react";
import { addEffect } from "@react-three/fiber";

export function UI({ playerRef }) {
  const timeRef = useRef();
  const highScoreRef = useRef();

  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const left = useKeyboardControls((state) => state.left);
  const right = useKeyboardControls((state) => state.right);
  const jump = useKeyboardControls((state) => state.jump);

  const restart = useGame((s) => s.restart);
  const phase = useGame((s) => s.phase);

  let highScore = localStorage.getItem("high_score") ?? 0;

  // 🔹 Utility to fake key press/release events
  const triggerKey = (key, type) => {
    const event = new KeyboardEvent(type, { key });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    const unsubscribe = addEffect(() => {
      if (!playerRef.current) return;
      const state = useGame.getState();
      const playerZ = Math.abs(playerRef.current.translation().z - 8).toFixed(
        0
      );

      if (state.phase === "ended") {
        localStorage.setItem("high_score", highScore);
      }

      if (timeRef.current && state.phase === "playing") {
        timeRef.current.textContent = "Score : " + playerZ;
      }
      if (state.phase === "ready") {
        timeRef.current.textContent = "Score : 0";
      }

      if (playerRef.current && highScoreRef.current) {
        if (playerZ > +highScore && state.phase === "playing") {
          highScore = playerZ;
          highScoreRef.current.textContent = "High Score : " + highScore;
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="interface">
      <div className="score">
        <div className="current-score" ref={timeRef}>
          0.00
        </div>
        <div className="high-score" ref={highScoreRef}>
          High Score: {highScore}
        </div>
      </div>

      {phase === "ended" && (
        <div className="restart">
          <button onClick={restart}>Restart</button>
        </div>
      )}

      {/* 🔹 Touch Controls (mapped to fake key events) */}
      <div className="controls">
        <div className="row">
          <div
            className={`key ${forward ? "active" : ""}`}
            onTouchStart={() => triggerKey("ArrowUp", "keydown")}
            onTouchEnd={() => triggerKey("ArrowUp", "keyup")}
            onMouseDown={() => triggerKey("ArrowUp", "keydown")}
            onMouseUp={() => triggerKey("ArrowUp", "keyup")}
          >
            ↑
          </div>
        </div>

        <div className="row">
          <div
            className={`key ${left ? "active" : ""}`}
            onTouchStart={() => triggerKey("ArrowLeft", "keydown")}
            onTouchEnd={() => triggerKey("ArrowLeft", "keyup")}
            onMouseDown={() => triggerKey("ArrowLeft", "keydown")}
            onMouseUp={() => triggerKey("ArrowLeft", "keyup")}
          >
            ←
          </div>

          <div
            className={`key ${backward ? "active" : ""}`}
            onTouchStart={() => triggerKey("ArrowDown", "keydown")}
            onTouchEnd={() => triggerKey("ArrowDown", "keyup")}
            onMouseDown={() => triggerKey("ArrowDown", "keydown")}
            onMouseUp={() => triggerKey("ArrowDown", "keyup")}
          >
            ↓
          </div>

          <div
            className={`key ${right ? "active" : ""}`}
            onTouchStart={() => triggerKey("ArrowRight", "keydown")}
            onTouchEnd={() => triggerKey("ArrowRight", "keyup")}
            onMouseDown={() => triggerKey("ArrowRight", "keydown")}
            onMouseUp={() => triggerKey("ArrowRight", "keyup")}
          >
            →
          </div>
        </div>

        <div className="row">
          <div
            className={`key large ${jump ? "active" : ""}`}
            onTouchStart={() => triggerKey("Space", "keydown")}
            onTouchEnd={() => triggerKey("Space", "keyup")}
            onMouseDown={() => triggerKey("Space", "keydown")}
            onMouseUp={() => triggerKey("Space", "keyup")}
          >
            ⬆ Jump
          </div>
        </div>
      </div>
    </div>
  );
}
