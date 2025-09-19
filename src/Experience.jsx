import { Lights } from "./Lights.jsx";
import { Level } from "./level.jsx";
import { Physics } from "@react-three/rapier";
import { Player } from "./Player.jsx";
import useGame from "./store/useGame.js";
import { useRef } from "react";

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blockSeed = useGame((state) => state.blockSeed);
  const playerRef = useRef();

  return (
    <>
      <color args={["#5bd6fc"]} attach="background" />
      <Physics>
        <Lights />
        {/* <Debug /> */}
        <Level count={blocksCount} seed={blockSeed} playerRef={playerRef} />
        <Player ref={playerRef} />
      </Physics>
    </>
  );
}
