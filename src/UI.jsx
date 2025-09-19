import { useKeyboardControls } from "@react-three/drei";
import "./style.css";
import useGame from "./store/useGame";
import { useEffect, useRef } from "react";
import { addEffect } from "@react-three/fiber";

export function UI() {
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

  useEffect(() => {
    const unsubscribe = addEffect(() => {
      const state = useGame.getState();

      let elpasedTime = 0;
      if (state.phase === "playing") {
        elpasedTime = Date.now() - state.startTime;
      }
      if (state.phase === "ended") {
        elpasedTime = state.endTime - state.startTime;
        localStorage.setItem("high_score", highScore);
      }

      elpasedTime /= 1000;
      elpasedTime = elpasedTime.toFixed(2);

      if (timeRef.current) {
        timeRef.current.textContent = elpasedTime;
      }

      if (highScoreRef.current && highScore < elpasedTime) {
        highScore = elpasedTime;
        highScoreRef.current.textContent = highScore;
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="interface">
      <div className="time" ref={timeRef}>
        0.00
      </div>
      {phase === "ended" && (
        <div className="restart">
          <button onClick={restart}>Restart</button>
        </div>
      )}

      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key ${left ? "active" : ""}`}></div>
          <div className={`key ${backward ? "active" : ""}`}></div>
          <div className={`key ${right ? "active" : ""}`}></div>
        </div>
        <div className={`raw`}>
          <div className={`key large ${jump ? "active" : ""}`}></div>
        </div>
      </div>

      <div className="high-score" ref={highScoreRef}>
        High Score: {highScore}
      </div>
    </div>
  );
}
