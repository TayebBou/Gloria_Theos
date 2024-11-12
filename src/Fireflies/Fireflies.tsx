import {
  useRef,
  useState,
  useEffect,
  Fragment,
  FC,
  RefObject,
  createRef,
} from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Clock,
  Vector3,
  MathUtils,
  Mesh,
  PointLight,
  BufferGeometry,
  Material,
} from 'three';
import { Sphere } from '@react-three/drei';

const movementSpeed = 0.25; // Speed of movement
const xLimit = 3; // X-axis movement limit
const yLimit = 3; // Y-axis movement limit
const zLimit = 3; // Z-axis movement limit
const numFireflies = 20; // Number of fireflies
const sizeOfFireFlies = 0.03; // Size of every fireFly

const Fireflies: FC = () => {
  const clockRef = useRef(new Clock()); // Reference for tracking time
  const [fireflies, setFireflies] = useState<
    Array<{
      position: [number, number, number]; // Ensure tuple type
      movementPhase: number;
      meshRef: RefObject<Mesh<BufferGeometry, Material>>;
      lightRef: RefObject<PointLight>;
    }>
  >([]);

  useEffect(() => {
    // Initialize fireflies with random positions and phases
    const initialFireflies = Array.from({ length: numFireflies }).map(() => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
      ] as [number, number, number], // Ensure tuple type
      movementPhase: Math.random() * Math.PI * 2,
      meshRef: createRef<Mesh<BufferGeometry, Material>>(),
      lightRef: createRef<PointLight>(),
    }));
    setFireflies(initialFireflies);
  }, []);

  useFrame(() => {
    const time = clockRef.current.getElapsedTime();

    fireflies.forEach((firefly) => {
      const { position, movementPhase, meshRef, lightRef } = firefly;

      // Calculate smooth sinusoidal movement with phase offset for each firefly
      const deltaX = Math.sin(time * movementSpeed + movementPhase) * xLimit;
      const deltaY =
        Math.sin(time * movementSpeed * 0.5 + movementPhase) * yLimit;
      const deltaZ = Math.cos(time * movementSpeed + movementPhase) * zLimit;

      // Calculate new position based on initial position
      const newPosition = new Vector3(
        position[0] + deltaX,
        position[1] + deltaY,
        position[2] + deltaZ
      );

      // Clamp the position within the limits
      newPosition.x = MathUtils.clamp(newPosition.x, -0.5, xLimit);
      newPosition.y = MathUtils.clamp(newPosition.y, 0.15, yLimit);
      newPosition.z = MathUtils.clamp(newPosition.z, -zLimit, zLimit);

      // Smoothly interpolate towards the new position
      if (meshRef.current) {
        meshRef.current.position.lerp(newPosition, 0.1); // Smoother interpolation
        if (lightRef.current) {
          lightRef.current.position.copy(meshRef.current.position);
        }
      }
    });
  });

  return (
    <>
      {fireflies.map((firefly, i) => (
        <Fragment key={i}>
          <Sphere
            args={[sizeOfFireFlies]}
            ref={firefly.meshRef}
            position={firefly.position}
          />
          <pointLight ref={firefly.lightRef} intensity={2.5} distance={2} />
        </Fragment>
      ))}
    </>
  );
};

export default Fireflies;
