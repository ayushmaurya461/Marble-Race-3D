import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { forwardRef, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useGame from "./store/useGame";

export const Player = forwardRef((_, body) => {
  // const body = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const [smoothCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10));
  const [smoothCameraTarget] = useState(() => new THREE.Vector3());
  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();
  const start = useGame((state) => state.start);
  const end = useGame((state) => state.end);
  // const restart = useGame((state) => state.restart);
  // const phase = useGame((state) => state.phase);
  // const blocksCount = useGame((state) => state.blocksCount);

  const jump = () => {
    const origin = body.current?.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 0.1, true);

    if (hit.toi < 0.1) {
      body.current?.applyImpulse({ x: 0, y: 0.5, z: 0 });
    }
  };

  const reset = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 8 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  useEffect(() => {
    const unsubscribeGame = useGame.subscribe(
      (state) => {
        return state.phase;
      },
      (value) => {
        if (value === "ready") reset();
      }
    );

    const unsubscribe = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) {
          jump();
        }
      }
    );

    const unsubscrbeAny = subscribeKeys(() => {
      start();
    });

    return () => {
      unsubscribe();
      unsubscribeGame();
      unsubscrbeAny();
    };
  });

  useFrame((state, delta) => {
    const { forward, backward, left, right } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torqueImpulse = { x: 0, y: 0, z: 0 };

    const impulseStrength = 1 * delta;
    const torqueImpulseStrength = 1 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torqueImpulse.x -= torqueImpulseStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torqueImpulse.x += torqueImpulseStrength;
    }
    if (left) {
      impulse.x -= torqueImpulseStrength;
      torqueImpulse.z += torqueImpulseStrength;
    }
    if (right) {
      impulse.x += torqueImpulseStrength;
      torqueImpulse.z -= torqueImpulseStrength;
    }
    body.current?.applyImpulse(impulse);
    body.current?.applyTorqueImpulse(torqueImpulse);

    const bodyPosition = body.current.translation();
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.5;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothCameraPosition.lerp(cameraPosition, 0.1);
    smoothCameraTarget.lerp(cameraTarget, 0.1);

    state.camera.position.copy(smoothCameraPosition, 5 * delta);
    state.camera.lookAt(smoothCameraTarget, 5 * delta);

    if (bodyPosition.y < -4) {
      end()
    }
  });

  return (
    <RigidBody
      ref={body}
      position={[0, 1, 8]}
      colliders="ball"
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
      restitution={0.2}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color="mediumpurple" flatShading />
      </mesh>
    </RigidBody>
  );
});
