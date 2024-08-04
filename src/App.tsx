import { OrbitControls, Stats, useGLTF, Sphere } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { FC } from 'react';
import Fireflies from './Fireflies/Fireflies';
import { Mesh } from 'three';

const App: FC = () => {
  const gltf = useGLTF('/models/scene.glb');

  gltf?.scene?.traverse((model) => {
    if (model instanceof Mesh && model.isMesh) {
      if (model.name !== 'Plane') model.castShadow = true;
      model.receiveShadow = true;
    }
  });

  return (
    <Canvas camera={{ position: [4.68, 2.012, 1.183] }} shadows>
      <directionalLight position={[4.49, 4.49, 3.44]} intensity={5} castShadow>
        <Sphere args={[0.25]} />
      </directionalLight>
      <primitive object={gltf?.scene} />
      <Fireflies />
      <OrbitControls
        target={[0, 1, 0]}
        minPolarAngle={0} // Minimum vertical angle in radians (0 radians = looking straight ahead)
        maxPolarAngle={Math.PI / 2} // Maximum vertical angle in radians (PI/2 radians = looking straight down)
        minDistance={1} // Minimum zoom distance
        maxDistance={6} // Maximum zoom distance
      />
      <Stats />
    </Canvas>
  );
};

export default App;
