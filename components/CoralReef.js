import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const coralColors = [
  0x0b6b4c, 0x1f8a4d, 0xd45063, 0x915c83, 0x4842b8, 0xccaf83, 0xe07a5f, 0x3d405b, 0x81b29a, 0xf2cc8f
];

let cachedModelsPromise = null;

async function loadCoralModels() {
  if (cachedModelsPromise) return cachedModelsPromise;

  cachedModelsPromise = (async () => {
    const loader = new GLTFLoader();
    const models = [];
    
    // Load the 7 coral GLBs
    for (let i = 0; i < 7; i++) {
      try {
        const gltf = await loader.loadAsync(`/models/coral/Coral${i}.glb`);
        let mesh = null;
        gltf.scene.traverse((child) => {
          if (child.isMesh && !mesh) {
            mesh = child;
          }
        });
        if (mesh) {
          models.push(mesh.geometry);
        }
      } catch (e) {
        console.warn(`Failed to load Coral${i}.glb`, e);
      }
    }
    return models;
  })();

  return cachedModelsPromise;
}

export async function addCoralReef(scene, parentGroup) {
  const models = await loadCoralModels();
  if (models.length === 0) return;

  const grassGeo = models[4];
  const branchGeo = models[6];
  
  // Fallback if models aren't strictly loaded
  if (!grassGeo || !branchGeo) return;

  const dummy = new THREE.Object3D();
  
  // 1. Green Bushy Grass (Ground layer framing the stairs)
  const greenMat = new THREE.MeshStandardMaterial({
    roughness: 0.9, metalness: 0.1, flatShading: true,
    color: 0x1f8b4c // Vibrant dark green matching the mockup
  });
  const grassCount = 18; // 9 per side (reduced)
  const grassMesh = new THREE.InstancedMesh(grassGeo, greenMat, grassCount);
  
  for (let i = 0; i < grassCount; i++) {
    const isLeft = i % 2 === 0;
    const sideSign = isLeft ? -1 : 1;
    
    // Tightly cluster around the edges of the stairs
    const x = sideSign * (16 + Math.random() * 12);
    const z = -8 - Math.random() * 18;
    const y = -40 + Math.random() * 4;
    
    const scl = 0.25 + Math.random() * 0.2;
    dummy.position.set(x, y, z);
    dummy.rotation.set(
      (Math.random() - 0.5) * 0.2, 
      Math.random() * Math.PI * 2, 
      isLeft ? -0.2 : 0.2 // Tilt outwards slightly
    );
    dummy.scale.set(scl, scl, scl);
    dummy.updateMatrix();
    grassMesh.setMatrixAt(i, dummy.matrix);
  }
  parentGroup.add(grassMesh);

  // 2. Pink/Purple Large Branches (Towering behind the grass and on walls)
  const purpleMat = new THREE.MeshStandardMaterial({
    roughness: 0.9, metalness: 0.1, flatShading: true,
    color: 0x915c83 // Deep purple/pink matching the mockup
  });
  const branchCount = 12; // 6 per side (reduced)
  const branchMesh = new THREE.InstancedMesh(branchGeo, purpleMat, branchCount);
  
  for (let i = 0; i < branchCount; i++) {
    const isLeft = i % 2 === 0;
    const sideSign = isLeft ? -1 : 1;
    
    let x, y, z, scl, rotZ;
    
    if (i < 8) { 
      // Ground framing behind the grass
      x = sideSign * (24 + Math.random() * 12);
      z = -14 - Math.random() * 16;
      y = -39 + Math.random() * 3;
      scl = 0.35 + Math.random() * 0.25;
      rotZ = isLeft ? -0.3 : 0.3;
    } else {
      // Crawling up the cavern walls in the background
      x = sideSign * (38 + Math.random() * 14);
      z = -22 - Math.random() * 20;
      y = -25 + Math.random() * 20;
      scl = 0.2 + Math.random() * 0.15;
      rotZ = isLeft ? -0.8 : 0.8;
    }
    
    dummy.position.set(x, y, z);
    dummy.rotation.set(
      (Math.random() - 0.5) * 0.4, 
      Math.random() * Math.PI * 2, 
      rotZ
    );
    dummy.scale.set(scl, scl, scl);
    dummy.updateMatrix();
    branchMesh.setMatrixAt(i, dummy.matrix);
  }
  parentGroup.add(branchMesh);
}

export async function addCliffCorals(parentGroup, isRight, xPos, yPos, zCenter) {
  const models = await loadCoralModels();
  if (models.length === 0) return;

  const count = 12; // same count as the cones we removed
  
  for (let c = 0; c < count; c++) {
    const modelIndex = c % models.length;
    
    // Skip grass-like models (Coral4 and Coral6) only near the IT Quiz (Left Cliff, zCenter = -600)
    if (xPos === -66 && zCenter === -600 && (modelIndex === 4 || modelIndex === 6)) {
      continue;
    }

    const geometry = models[modelIndex];
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
      color: coralColors[Math.floor(Math.random() * coralColors.length)],
    });
    
    const coralMesh = new THREE.Mesh(geometry, material);
    
    // Scale matching the near-portal corals (0.15 to 0.40)
    const scl = 0.15 + Math.random() * 0.25;
    
    // Position along the cliff face shelves using exact surface fitting
    const coralY = yPos + 40 - Math.random() * 80;
    const coralZ = zCenter + (Math.random() - 0.5) * 140;
    
    // Compute exact local coordinates relative to the cliff center
    const localY = coralY - yPos;
    const localZ = coralZ - zCenter;
    const localX = isRight ? -17 : 17; // Inner face of BoxGeometry
    
    // Compute the exact cliff bump noise value at this Y, Z
    const bump =
      Math.sin(localY * 0.08) * Math.cos(localZ * 0.08) * 5.0 +
      Math.sin(localY * 0.2 + localX * 0.1) * 2.0;
      
    // Left cliff inner face is at X = -49 + bump
    // Right cliff inner face is at X = 49 - bump
    const surfaceX = isRight ? (49 - bump) : (-49 + bump);
    
    // Place the coral on the surface, adding a small outward offset based on its scale
    // Left cliff faces right (+X), so offset is positive. Right cliff faces left (-X), so offset is negative.
    const outwardOffset = (0.5 + Math.random() * 0.4) * scl;
    const coralX = isRight ? (surfaceX - outwardOffset) : (surfaceX + outwardOffset);
    
    coralMesh.position.set(coralX, coralY, coralZ);
    coralMesh.scale.set(scl, scl, scl);
    
    // Rotation tilts slightly inwards towards the center of the canyon
    coralMesh.rotation.set(
      (Math.random() - 0.5) * 0.4,
      Math.random() * Math.PI * 2,
      isRight ? -0.4 : 0.4
    );
    
    parentGroup.add(coralMesh);
  }
}

export async function addEventPlatformGrass(parentGroup, node) {
  const models = await loadCoralModels();
  if (models.length === 0) return;
  
  const count = 12; // 6 per corner
  for (let i = 0; i < count; i++) {
    const geometry = models[Math.floor(Math.random() * models.length)];
    
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
      color: coralColors[Math.floor(Math.random() * coralColors.length)],
    });

    const mesh = new THREE.Mesh(geometry, material);
    
    // Cluster into two corner areas (left and right)
    const isLeftCorner = i % 2 === 0;
    const xOffset = (isLeftCorner ? -1 : 1) * (18 + Math.random() * 6);
    const zOffset = 5 + Math.random() * 10; // Slightly in front
    
    let px = node.pos.x + xOffset;
    let pz = node.pos.z + zOffset;
    
    const py = node.pos.y - 2 - Math.random() * 4;

    mesh.position.set(px, py, pz);
    
    // Reduced size as requested
    const scl = 0.15 + Math.random() * 0.15;
    mesh.scale.set(scl, scl, scl);
    
    mesh.rotation.y = Math.random() * Math.PI * 2;
    mesh.rotation.x = (Math.random() - 0.5) * 0.5;
    mesh.rotation.z = (Math.random() - 0.5) * 0.5;
    
    parentGroup.add(mesh);
  }
}
