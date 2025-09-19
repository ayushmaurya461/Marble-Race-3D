import { Float, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

THREE.ColorManagement.legacyMode = false;

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floorMaterial = new THREE.MeshStandardMaterial({ color: "#6ab90e" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "#fbff00" });
const axeMaterial = new THREE.MeshStandardMaterial({ color: "#701368" });
const crusherMaterial = new THREE.MeshStandardMaterial({ color: "#b90606" });
const pusherMaterial = new THREE.MeshStandardMaterial({ color: "#ffbb00" });
const pendulumMaterial = new THREE.MeshStandardMaterial({ color: "#006eff" });
const limboMaterial = new THREE.MeshStandardMaterial({ color: "#006eff" });
const spinnerMaterial = new THREE.MeshStandardMaterial({ color: "#006eff" });

export function Level({
  count = 15,
  types = [
    BlockSpinner,
    BlockLimbo,
    BlockAxe,
    BlockCrusher,
    BlockPendulum,
    BlockPusher,
  ],
  seed = 0,
  playerRef,
}) {
  const [blocks, setBlocks] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      type: types[Math.floor(Math.random() * types.length)],
      position: [0, 0, 4 - i * 4],
      id: i,
    }))
  );

  useEffect(() => {
    setBlocks(
      Array.from({ length: count }, (_, i) => ({
        type: types[Math.floor(Math.random() * types.length)],
        position: [0, 0, 4 - i * 4],
        id: i,
      }))
    );
  }, [seed, count]);

  useFrame(() => {
    if (!playerRef.current) return;

    const playerZ = playerRef.current.translation().z;
    const firstBlock = blocks[0];

    if (playerZ < firstBlock?.position[2] - 4) {
      setBlocks((prev) => {
        const newBlocks = [...prev.slice(1)];
        const lastBlock = prev[prev.length - 1];
        const newId = lastBlock.id + 1;
        const newType = types[Math.floor(Math.random() * types.length)];

        newBlocks.push({
          id: newId,
          type: newType,
          position: [0, 0, lastBlock.position[2] - 4],
        });

        return newBlocks;
      });
    }
  });

  return (
    <>
      <BlockStart position={[0, 0, 8]} />
      {blocks.map(({ type: Block, position, id }) => (
        <Block key={id} position={position} />
      ))}
      {/* <BlockEnd position={[0, 0, -(count - 1) * 4]} /> */}
      <BlockWall length={count} playerRef={playerRef} />
    </>
  );
}

export function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Float>
        <Text
          font="/bebas-neue-v9-latin-regular.woff"
          scale={0.2}
          textAlign="center"
          lineHeight={0.75}
          maxWidth={0.25}
          rotation-y={-0.25}
          position={[0, 1, 0]}
        >
          Roll On
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <mesh
        position={[0, -0.1, 0]}
        receiveShadow
        material={floorMaterial}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
      ></mesh>
    </group>
  );
}

export function BlockEnd({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Float>
        <Text
          font="/bebas-neue-v9-latin-regular.woff"
          scale={0.6}
          textAlign="right"
          lineHeight={0.75}
          color={"#ff0000"}
          maxWidth={0.25}
          position={[1, 0.65, -1]}
        >
          Finish
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <mesh
        position={[0, 0, 0]}
        receiveShadow
        material={floorMaterial}
        geometry={boxGeometry}
        scale={[4, 0.01, 4]}
      ></mesh>
    </group>
  );
}

export function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [speed] = useState(
    () => (Math.random() + 1) * (Math.random() < 0.5 ? -1 : 1)
  );

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, elapsedTime * speed, 0));
    obstacle.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      <mesh
        position={[0, -0.1, 0]}
        receiveShadow
        material={floor2Material}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        friction={0}
        restitution={0.2}
      >
        <mesh
          material={spinnerMaterial}
          geometry={boxGeometry}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

export function BlockLimbo({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [speed] = useState(
    () => (Math.random() + 1) * (Math.random() < 0.5 ? -1 : 1)
  );

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: Math.sin(elapsedTime * speed) + position[1] + 1.5,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        position={[0, -0.1, 0]}
        receiveShadow
        material={floor2Material}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        friction={0}
        restitution={0.2}
      >
        <mesh
          material={limboMaterial}
          geometry={boxGeometry}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

function BlockAxe({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [speed] = useState(
    () => (Math.random() + 1) * (Math.random() < 0.5 ? -1 : 1)
  );

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + Math.sin(elapsedTime * speed),
      y: position[1] + 0.8,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        position={[0, -0.1, 0]}
        receiveShadow
        material={floor2Material}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        friction={0}
        restitution={0.2}
      >
        <mesh
          material={axeMaterial}
          geometry={boxGeometry}
          scale={[1.5, 1.5, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

function BlockPendulum({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [speed] = useState(() => Math.random() + 0.5);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + Math.sin(elapsedTime * speed) * 1.5,
      y: position[1] + 1,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        position={[0, -0.1, 0]}
        receiveShadow
        material={floor2Material}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
      />
      <RigidBody ref={obstacle} type="kinematicPosition" restitution={0.2}>
        <mesh
          material={pendulumMaterial}
          geometry={boxGeometry}
          scale={[0.5, 2, 0.5]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

function BlockCrusher({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [speed] = useState(() => Math.random() + 0.8);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    const y = Math.abs(Math.sin(elapsedTime * speed)) * 2 + 0.5; // goes up & down
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        position={[0, -0.1, 0]}
        receiveShadow
        material={floor2Material}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
      />
      <RigidBody ref={obstacle} type="kinematicPosition" restitution={0.2}>
        <mesh
          material={crusherMaterial}
          geometry={boxGeometry}
          scale={[2, 0.5, 2]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

function BlockPusher({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [speed] = useState(() => Math.random() + 1);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    const x = Math.sin(elapsedTime * speed) * 1.5; // side-to-side
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.8,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        position={[0, -0.1, 0]}
        receiveShadow
        material={floor2Material}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
      />
      <RigidBody ref={obstacle} type="kinematicPosition" restitution={0.2}>
        <mesh
          material={pusherMaterial}
          geometry={boxGeometry}
          scale={[0.5, 1, 3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

function BlockWall({ position = [0, 0, 0], length = 4, playerRef }) {
  const colliderRef = useRef();

  useFrame(() => {
    if (!colliderRef.current || !playerRef.current) return;

    const playerZ = playerRef.current.translation().z;

    colliderRef.current.setTranslation({
      x: 0,
      y: 0,
      z: playerZ,
    });
  });

  return (
    <>
      <RigidBody ref={colliderRef} type="fixed" friction={1} restitution={0.2}>
        {/* <mesh
          position={[2.15, 0.75, -length * 2 + 6]}
          receiveShadow
          material={wallMaterial}
          geometry={boxGeometry}
          castShadow
          scale={[0.3, 1.5, length * 4 + 8]}
        ></mesh>
        <mesh
          position={[-2.15, 0.75, -length * 2 + 6]}
          receiveShadow
          material={wallMaterial}
          geometry={boxGeometry}
          scale={[0.3, 1.5, length * 4 + 8]}
          ></mesh>
        <mesh
          position={[0, 0.75, -length * 4 + 2]}
          scale={[4.3, 1.5, 0.3]}
          receiveShadow
          material={wallMaterial}
          geometry={boxGeometry}
        ></mesh>
          */}
        <CuboidCollider
          args={[2, 0.1, 2 * length + 4]}
          position={[0, -0.1, -(length * 2) + 6]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  );
}
