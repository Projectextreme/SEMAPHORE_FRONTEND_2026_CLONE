"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { Water } from "three/examples/jsm/objects/Water.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    id: "event-iceberg",
    title: "Web Designing",
    category: "Technical",
    desc: "Design and implement a working website within a limited time based on a given theme.",
    date: "9 October 2026",
  },
  {
    id: "event-rocks",
    title: "Coding",
    category: "Programming",
    desc: "Test your logic in competitive programming. Focus on data structures and algorithms.",
    date: "9 October 2026",
  },
  {
    id: "event-shipwreck",
    title: "Rhythm Rock",
    category: "Cultural",
    desc: "The ultimate dance competition! Bring your best moves and dominate the stage.",
    date: "10 October 2026",
  },
];

export default function Scene() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const manager = new THREE.LoadingManager();
    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      setProgress(Math.floor((itemsLoaded / itemsTotal) * 100));
    };
    manager.onLoad = () => {
      setTimeout(() => setLoading(false), 500);
    };

    const gltfLoader = new GLTFLoader(manager);

    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 65 : 75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, powerPreference: isMobile ? 'low-power' : 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    // --- Water ---
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    const waterNormals = new THREE.TextureLoader(manager).load(
      "/textures/waternormals.jpg",
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      },
    );
    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: waterNormals,
      sunDirection: new THREE.Vector3(0.7, 0.5, 0.6).normalize(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false,
    });
    water.rotation.x = -Math.PI / 2;
    water.position.y = -2;
    scene.add(water);

    const waterUnderside = new THREE.Mesh(
      waterGeometry,
      new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.1,
        side: THREE.BackSide,
      }),
    );
    waterUnderside.rotation.x = -Math.PI / 2;
    waterUnderside.position.y = -2.01;
    scene.add(waterUnderside);

    // --- Textures for Realistic Obstacles ---
    const rockTexture = new THREE.TextureLoader(manager).load(
      "https://images.unsplash.com/photo-1525926476831-29c362dd0706?auto=format&fit=crop&w=1024&q=80",
      (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 2);
      },
    );

    const woodTexture = new THREE.TextureLoader(manager).load(
      "https://images.unsplash.com/photo-1550605151-509a25036b13?auto=format&fit=crop&w=1024&q=80",
      (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 4);
      },
    );

    // --- Realistic Glacial Iceberg Cluster ---
    function createIcebergGeometry(radius, heightScale) {
      const geo = new THREE.IcosahedronGeometry(radius, 4);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        if (v.y > 0) {
          v.y = Math.min(v.y, radius * 0.5 + Math.sin(v.x * 0.5) * 1.5);
        } else {
          v.y *= heightScale;
        }
        const noise = Math.sin(v.x * 0.3) * Math.sin(v.y * 0.3) * Math.cos(v.z * 0.3);
        const detail = Math.sin(v.x * 1.2 + v.y * 0.8) * 0.3;
        const dist = 1.0 + (noise + detail) * 0.25;
        v.x *= dist;
        v.y *= dist;
        v.z *= dist;
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      const nonIndexed = geo.toNonIndexed();
      nonIndexed.computeVertexNormals();
      return nonIndexed;
    }

    const iceMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xdff4ff,
      transmission: 0.75,
      opacity: 1,
      roughness: 0.2,
      metalness: 0.05,
      ior: 1.31,
      thickness: 6.0,
      attenuationColor: new THREE.Color(0x0099ee),
      attenuationDistance: 4.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      flatShading: true,
    });

    const iceberg = new THREE.Mesh(createIcebergGeometry(12, 1.8), iceMaterial);
    iceberg.position.set(-20, -5, -48);
    scene.add(iceberg);

    const iceberg2 = new THREE.Mesh(createIcebergGeometry(8, 1.6), iceMaterial);
    iceberg2.position.set(24, -4, -54);
    scene.add(iceberg2);

    // Floating surface ice chunks
    const icePlateGeo = new THREE.CylinderGeometry(4, 5, 0.8, 7);
    const icePlate = new THREE.Mesh(icePlateGeo, iceMaterial);
    icePlate.position.set(-6, -2, -35);
    icePlate.rotation.y = 0.4;
    scene.add(icePlate);

    // --- Small Floating Ice Chunks ---
    const smallIcePositions = [
      { x: 12, y: -3, z: -30, s: 1.8 },
      { x: -35, y: -2.5, z: -42, s: 2.5 },
      { x: 30, y: -3.5, z: -38, s: 1.5 },
      { x: -10, y: -4, z: -55, s: 2.0 },
      { x: 18, y: -2, z: -25, s: 1.2 },
      { x: -28, y: -3, z: -32, s: 1.7 },
      { x: 5, y: -5, z: -60, s: 2.2 },
      { x: -15, y: -6, z: -65, s: 1.4 },
      { x: 35, y: -4, z: -50, s: 1.9 },
      { x: -40, y: -5, z: -58, s: 1.6 },
    ];
    for (const p of smallIcePositions) {
      const chunkGeo = new THREE.IcosahedronGeometry(p.s, 2);
      const posC = chunkGeo.attributes.position;
      const vC = new THREE.Vector3();
      for (let j = 0; j < posC.count; j++) {
        vC.fromBufferAttribute(posC, j);
        const n = Math.sin(vC.x * 1.5) * Math.cos(vC.z * 1.5) * 0.3;
        vC.multiplyScalar(1 + n);
        posC.setXYZ(j, vC.x, vC.y, vC.z);
      }
      chunkGeo.computeVertexNormals();
      const chunk = new THREE.Mesh(chunkGeo, iceMaterial);
      chunk.position.set(p.x, p.y, p.z);
      chunk.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(chunk);
    }

    // --- Shipwreck (GLB Loader + Fallback) ---
    gltfLoader.load(
      "/glbs/ship.glb",
      (gltf) => {
        const shipwreck = gltf.scene;
        shipwreck.position.set(0, -10, -50);
        shipwreck.rotation.set(0.2, 0.5, -0.3);
        shipwreck.scale.set(5, 5, 5);
        scene.add(shipwreck);
      },
      undefined,
      (error) => {
        console.warn(
          "Ship model not found. Using procedural underwater assets.",
          error,
        );
      }
    );

    // --- Realistic Deep Trench Rocks ---
    const rockGroup = new THREE.Group();
    for (let i = 0; i < 10; i++) {
      const rockGeo = new THREE.DodecahedronGeometry(Math.random() * 6 + 6, 2);
      const posR = rockGeo.attributes.position;
      const vR = new THREE.Vector3();
      for (let j = 0; j < posR.count; j++) {
        vR.fromBufferAttribute(posR, j);
        const noise = Math.sin(vR.x * 0.8) * Math.cos(vR.y * 0.8) * 0.3;
        vR.multiplyScalar(1 + noise);
        posR.setXYZ(j, vR.x, vR.y, vR.z);
      }
      rockGeo.computeVertexNormals();

      const rockMaterial = new THREE.MeshStandardMaterial({
        map: rockTexture,
        color: 0x3d4a54,
        roughness: 0.9,
        metalness: 0.2,
        flatShading: true,
      });
      const rock = new THREE.Mesh(rockGeo, rockMaterial);
      rock.position.set(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 35,
      );
      rock.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );
      rockGroup.add(rock);
    }
    rockGroup.position.set(-30, -35, -70);
    scene.add(rockGroup);

    // --- Coding Particles around Rocks (Matrix Effect) ---
    const codingParticleCount = 400;
    const codingGeo = new THREE.BufferGeometry();
    const codingPos = new Float32Array(codingParticleCount * 3);
    const codingPhases = new Float32Array(codingParticleCount);
    for (let i = 0; i < codingParticleCount; i++) {
      codingPos[i * 3] = -30 + (Math.random() - 0.5) * 60;
      codingPos[i * 3 + 1] = -35 + (Math.random() - 0.5) * 40;
      codingPos[i * 3 + 2] = -70 + (Math.random() - 0.5) * 60;
      codingPhases[i] = Math.random() * Math.PI * 2;
    }
    codingGeo.setAttribute('position', new THREE.BufferAttribute(codingPos, 3));
    codingGeo.setAttribute('phase', new THREE.BufferAttribute(codingPhases, 1));

    const codingMat = new THREE.PointsMaterial({
      color: 0x00ff88,
      size: 1.2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const codingParticles = new THREE.Points(codingGeo, codingMat);
    scene.add(codingParticles);

    const codingLight = new THREE.PointLight(0x00ff88, 50, 40);
    codingLight.position.set(-30, -35, -70);
    scene.add(codingLight);

    // --- Detailed Realistic Submarine Ruins ---
    const subGroup = new THREE.Group();
    const subHullMat = new THREE.MeshStandardMaterial({
      color: 0x1c242b,
      metalness: 0.8,
      roughness: 0.4,
      flatShading: true,
    });

    // Main hull cylinder
    const subHull = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 22, 16), subHullMat);
    subHull.rotation.x = Math.PI / 2;
    subGroup.add(subHull);

    // Nose cone
    const subNose = new THREE.Mesh(new THREE.SphereGeometry(3.2, 16, 16), subHullMat);
    subNose.position.z = 11;
    subGroup.add(subNose);

    // Stern cone
    const subStern = new THREE.Mesh(new THREE.ConeGeometry(3.2, 6, 16), subHullMat);
    subStern.rotation.x = -Math.PI / 2;
    subStern.position.z = -14;
    subGroup.add(subStern);

    // Conning tower (sail)
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x141b20, metalness: 0.9, roughness: 0.3 });
    const subTower = new THREE.Mesh(new THREE.BoxGeometry(2, 3.5, 6), towerMat);
    subTower.position.set(0, 3.5, 2);
    subGroup.add(subTower);

    // Submarine Floodlight
    const subLight = new THREE.SpotLight(0x00d8ff, 200, 60, Math.PI / 5, 0.4);
    subLight.position.set(0, 1, 12);
    subLight.target.position.set(0, -10, 30);
    subGroup.add(subLight);
    subGroup.add(subLight.target);

    subGroup.rotation.set(0.3, 0.6, -0.4);
    subGroup.position.set(20, -55, -100);
    scene.add(subGroup);

    const wreckLight = new THREE.PointLight(0x00e1ff, 200, 35);
    wreckLight.position.set(20, -53, -95);
    scene.add(wreckLight);

    // --- Ocean Floor ---
    const floorGeometry = new THREE.PlaneGeometry(400, 400, 150, 150);
    const posFloor = floorGeometry.attributes.position;
    for (let i = 0; i < posFloor.count; i++) {
      const x = posFloor.getX(i);
      const y = posFloor.getY(i);
      let z = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 3.0;
      z += Math.sin(x * 0.4) * Math.cos(y * 0.3) * 1.5;
      z += (Math.random() - 0.5) * 1.0;
      posFloor.setZ(i, z);
    }
    floorGeometry.computeVertexNormals();
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x092636,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -65;
    scene.add(floor);

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(0, 10, 5);
    scene.add(dirLight);
    const underWaterLight = new THREE.DirectionalLight(0x0088ff, 2);
    underWaterLight.position.set(0, -20, 0);
    scene.add(underWaterLight);

    // --- Soft Volumetric God Rays ---
    const rayGroup = new THREE.Group();
    const rayGeo = new THREE.CylinderGeometry(2, 10, 80, 16, 1, true);
    const colors = [];
    const positionsRay = rayGeo.attributes.position;
    for (let i = 0; i < positionsRay.count; i++) {
      const y = positionsRay.getY(i);
      if (y > 0) {
        colors.push(0.5, 0.8, 1.0);
      } else {
        colors.push(0.0, 0.0, 0.0);
      }
    }
    rayGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    for (let i = 0; i < 6; i++) {
      const ray = new THREE.Mesh(rayGeo, rayMat);
      ray.position.set(
        (Math.random() - 0.5) * 60,
        -43,
        -40 - Math.random() * 60,
      );
      ray.rotation.x = (Math.random() - 0.5) * 0.2;
      ray.rotation.z = (Math.random() - 0.5) * 0.2;
      rayGroup.add(ray);
    }
    scene.add(rayGroup);

    // --- Bubbles Particle System ---
    const bubbleCount = isMobile ? 300 : 800;
    const bubbleGeo = new THREE.BufferGeometry();
    const bubblePos = new Float32Array(bubbleCount * 3);
    for (let i = 0; i < bubbleCount; i++) {
      bubblePos[i * 3] = (Math.random() - 0.5) * 150;
      bubblePos[i * 3 + 1] = -100 + Math.random() * 100;
      bubblePos[i * 3 + 2] = (Math.random() - 0.5) * 150;
    }
    bubbleGeo.setAttribute("position", new THREE.BufferAttribute(bubblePos, 3));
    const bubbleMat = new THREE.PointsMaterial({
      color: 0xaaffff,
      size: 0.6,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const bubbles = new THREE.Points(bubbleGeo, bubbleMat);
    scene.add(bubbles);

    // --- Realistic Tropical Fish Swarm ---
    function createRealisticFishGeometry() {
      const geo = new THREE.SphereGeometry(1, 24, 16);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        let x = v.x * 0.35;
        let y = v.y * 0.75;
        let z = v.z * 1.8;
        
        if (z > 0) {
          const headFactor = 1.0 - (z / 1.8) * 0.55;
          x *= headFactor;
          y *= headFactor;
        } else {
          const t = -z / 1.8;
          if (t > 0.45) {
            x *= Math.max(0.08, 1.0 - t * 0.88);
            const finFlare = (t - 0.45) * 2.0;
            const fork = Math.abs(y) > 0.18 ? 1.0 : 0.55;
            y *= (1.0 + finFlare * 1.8) * fork;
          }
        }
        
        // Dorsal Fin
        if (y > 0.3 && z < 0.4 && z > -0.7) {
          y += (0.7 - Math.abs(z + 0.15)) * 0.55;
          x *= 0.25;
        }
        
        // Ventral Fin
        if (y < -0.3 && z < 0.1 && z > -0.6) {
          y -= (0.5 - Math.abs(z + 0.25)) * 0.4;
          x *= 0.25;
        }

        pos.setXYZ(i, x, y, z);
      }
      geo.computeVertexNormals();
      return geo;
    }

    function createFishTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");

      const grad = ctx.createLinearGradient(0, 0, 256, 128);
      grad.addColorStop(0, "#00f0ff");
      grad.addColorStop(0.35, "#0072ff");
      grad.addColorStop(0.7, "#0030a0");
      grad.addColorStop(1.0, "#ffbf00");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 128);

      ctx.fillStyle = "rgba(0, 15, 60, 0.75)";
      ctx.beginPath();
      ctx.ellipse(130, 16, 110, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(220, 250, 255, 0.85)";
      ctx.beginPath();
      ctx.ellipse(100, 112, 80, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fish Eye
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(45, 52, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0c111e";
      ctx.beginPath();
      ctx.arc(45, 52, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#00f0ff";
      ctx.beginPath();
      ctx.arc(43, 50, 2, 0, Math.PI * 2);
      ctx.fill();

      // Gill Arc
      ctx.strokeStyle = "rgba(0, 40, 120, 0.7)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(75, 64, 25, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();

      // Scale Shimmer
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      for (let x = 70; x < 210; x += 12) {
        for (let y = 30; y < 100; y += 9) {
          ctx.beginPath();
          ctx.arc(x + ((y % 18) ? 6 : 0), y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      return new THREE.CanvasTexture(canvas);
    }

    const fishCount = isMobile ? 30 : 80;
    const fishGeo = createRealisticFishGeometry();
    const fishTex = createFishTexture();
    const fishMat = new THREE.MeshPhysicalMaterial({
      map: fishTex,
      roughness: 0.25,
      metalness: 0.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const fishSwarm = new THREE.InstancedMesh(fishGeo, fishMat, fishCount);
    const dummy = new THREE.Object3D();
    const fishData = [];
    for (let i = 0; i < fishCount; i++) {
      const s = 0.15 + Math.random() * 0.35; // Much smaller fish
      dummy.scale.set(s, s * (0.8 + Math.random() * 0.4), s * (0.9 + Math.random() * 0.2)); // Non-uniform scale
      dummy.position.set(
        (Math.random() - 0.5) * 110,
        -8 - Math.random() * 32,
        -15 - Math.random() * 65,
      );
      dummy.updateMatrix();
      fishSwarm.setMatrixAt(i, dummy.matrix);
      fishData.push({
        speed: 0.6 + Math.random() * 1.4,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        baseY: dummy.position.y,
        scale: s,
      });
    }
    scene.add(fishSwarm);

    // --- Sharks ---
    let sharkMixer = null;
    gltfLoader.load("/glbs/Shark by Quaternius - YYsK3gRCBZ.glb", (gltf) => {
      const shark = gltf.scene;
      shark.scale.set(4, 4, 4);
      shark.position.set(-20, -15, -35);
      scene.add(shark);
      if (gltf.animations?.length > 0) {
        sharkMixer = new THREE.AnimationMixer(shark);
        sharkMixer.clipAction(gltf.animations[0]).play();
      }
    });

    // --- Shark Fin ---
    gltfLoader.load("/glbs/Shark fin by Poly by Google - 1L9OjE5KOlC.glb", (gltf) => {
      const fin = gltf.scene;
      fin.scale.set(0.08, 0.08, 0.08);
      fin.position.set(15, -2, -25);
      fin.rotation.y = -Math.PI / 2;
      scene.add(fin);
    });

    // --- HDRI ---
    const loader = new EXRLoader(manager);
    loader.load("/hdri/spiaggia_di_mondello_4k.exr", (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = envMap;
      scene.background = envMap;
      texture.dispose();
      pmremGenerator.dispose();
    });

    const fogColor = new THREE.Color(0x001122);
    scene.fog = new THREE.FogExp2(fogColor, 0.0);

    // --- Camera & GSAP Journey ---
    camera.position.set(0, 2, 0);
    camera.rotation.order = "YXZ";

    const camState = {
      x: 0,
      y: 2,
      z: 0,
      rx: 0,
      ry: 0,
      fogDensity: 0,
      blur: 0,
    };

    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    function handleMouseMove(event) {
      targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener("mousemove", handleMouseMove);

    // Touch support for mobile parallax
    function handleTouchMove(event) {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        targetMouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
      }
    }
    function handleTouchEnd() {
      targetMouse.x = 0;
      targetMouse.y = 0;
    }
    if (isMobile) {
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleTouchEnd);
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: isMobile ? 2.5 : 1.5,
        onUpdate: (self) => {
          setScrollProgress(Math.floor(self.progress * 100));
        },
      },
    });

    // Fade out Hero UI immediately on scroll
    tl.to(
      "#hero-ui",
      { opacity: 0, y: -50, scale: 1.05, duration: 0.5, ease: "power2.inOut" },
      0,
    );

    // Phase 1: Dive & Iceberg (0 - 25%) - Dives in front/side of iceberg showing the outer layer
    tl.to(
      camState,
      {
        x: 6,
        y: -9,
        z: -32,
        rx: 0.08,
        ry: -0.22,
        fogDensity: 0.035,
        blur: 0.7,
        duration: 2,
        ease: "power1.inOut",
      },
      0,
    );
    tl.to(
      "#event-iceberg",
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      1.2,
    );
    tl.to(
      "#event-iceberg",
      { opacity: 0, y: -20, duration: 1, ease: "power2.in" },
      2.5,
    );

    // Phase 2: Turn to Trench Rocks (25% - 60%) - Glides safely across open water to the rocks
    tl.to(
      camState,
      {
        x: -18,
        y: -26,
        z: -55,
        rx: 0.12,
        ry: 0.45,
        fogDensity: 0.055,
        duration: 3,
        ease: "power2.inOut",
      },
      2.5,
    );
    tl.to(
      "#event-rocks",
      { opacity: 1, x: 0, duration: 1, ease: "power2.out" },
      4.0,
    );
    tl.to(
      "#event-rocks",
      { opacity: 0, x: -20, duration: 1, ease: "power2.in" },
      5.5,
    );

    // Phase 3: Descend to Submarine (60% - 90%) - Descends towards the submarine ruins
    tl.to(
      camState,
      {
        x: 10,
        y: -46,
        z: -84,
        rx: -0.15,
        ry: -0.32,
        fogDensity: 0.075,
        duration: 3,
        ease: "power2.inOut",
      },
      5.5,
    );
    tl.to(
      "#event-shipwreck",
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      7.5,
    );

    tl.to({}, { duration: 1 });

    const clock = new THREE.Clock();
    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      if (sharkMixer) {
        sharkMixer.update(delta);
      }

      const waterMat = water.material;
      if (waterMat.uniforms && waterMat.uniforms["time"]) {
        waterMat.uniforms["time"].value += delta * 0.5;
      }
      const t = clock.elapsedTime;
      
      const positions = bubbles.geometry.attributes.position.array;
      for (let i = 0; i < bubbleCount; i++) {
        positions[i * 3 + 1] += delta * (2 + Math.random() * 2);
        if (positions[i * 3 + 1] > -2) positions[i * 3 + 1] = -100;
      }
      bubbles.geometry.attributes.position.needsUpdate = true;

      const codePos = codingParticles.geometry.attributes.position.array;
      const codePhases = codingParticles.geometry.attributes.phase.array;
      for (let i = 0; i < codingParticleCount; i++) {
        codePhases[i] += delta * 0.5;
        const radius = 25 + Math.sin(codePhases[i] * 2) * 5;
        codePos[i * 3] = -30 + Math.cos(codePhases[i] + i) * radius;
        codePos[i * 3 + 1] += Math.sin(t * 2 + i) * 0.05;
        codePos[i * 3 + 2] = -70 + Math.sin(codePhases[i] + i) * radius;
      }
      codingParticles.geometry.attributes.position.needsUpdate = true;
      codingLight.intensity = 50 + Math.sin(t * 5) * 20;

      // Animate Realistic Schooling Fishes
      for (let i = 0; i < fishCount; i++) {
        fishSwarm.getMatrixAt(i, dummy.matrix);
        dummy.position.setFromMatrixPosition(dummy.matrix);
        const data = fishData[i];
        
        // Fluid swimming trajectory
        dummy.position.x += Math.sin(t * data.speed * 0.7 + data.phaseX) * 0.12;
        dummy.position.y = data.baseY + Math.sin(t * data.speed * 0.5 + data.phaseY) * 1.4;
        dummy.position.z += Math.cos(t * data.speed * 0.7 + data.phaseZ) * 0.12;

        const lookTargetX = dummy.position.x + Math.sin(t * data.speed * 0.7 + data.phaseX) * 0.4;
        const lookTargetZ = dummy.position.z + Math.cos(t * data.speed * 0.7 + data.phaseZ) * 0.4;

        dummy.lookAt(lookTargetX, dummy.position.y, lookTargetZ);

        // Banking roll when turning
        dummy.rotation.z = Math.cos(t * data.speed * 0.7 + data.phaseX) * 0.22;
        // Tail swimming wiggle
        dummy.rotation.y += Math.sin(t * data.speed * 6.0 + i) * 0.1;
        dummy.scale.set(data.scale, data.scale, data.scale);

        dummy.updateMatrix();
        fishSwarm.setMatrixAt(i, dummy.matrix);
      }
      fishSwarm.instanceMatrix.needsUpdate = true;

      // Mouse/Touch Parallax easing
      const parallaxEase = isMobile ? 0.03 : 0.05;
      const parallaxStrength = isMobile ? 0.8 : 1.5;
      mouse.x += (targetMouse.x - mouse.x) * parallaxEase;
      mouse.y += (targetMouse.y - mouse.y) * parallaxEase;

      camera.position.set(
        camState.x + mouse.x * parallaxStrength,
        camState.y + mouse.y * parallaxStrength,
        camState.z,
      );
      camera.rotation.x = camState.rx + mouse.y * (isMobile ? 0.02 : 0.05);
      camera.rotation.y = camState.ry - mouse.x * (isMobile ? 0.02 : 0.05);

      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.density = camState.fogDensity;
      }

      if (scene.backgroundBlurriness !== undefined) {
        scene.backgroundBlurriness = camState.blur;
      }

      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (isMobile) {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      }
      cancelAnimationFrame(animationId);
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      container.removeChild(renderer.domElement);
      renderer.dispose();
      waterGeometry.dispose();
      floorGeometry.dispose();
      iceberg.geometry.dispose();
      iceberg2.geometry.dispose();
      iceMaterial.dispose();
      bubbleGeo.dispose();
      bubbleMat.dispose();
      fishGeo.dispose();
      fishMat.dispose();
      fishTex.dispose();
      codingGeo.dispose();
      codingMat.dispose();
      rayGeo.dispose();
      rayMat.dispose();
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: "1000vh", position: "relative", backgroundColor: "#000" }}>
      {/* Compass Loading Screen */}
      <div className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#020a14] transition-opacity duration-1000 ${loading ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {/* Compass Container */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 mb-10">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(0,200,255,0.15)]" />
          {/* Tick Marks Ring */}
          <div className="absolute inset-2 rounded-full border border-cyan-400/20">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div key={deg} className="absolute w-full h-full" style={{ transform: `rotate(${deg}deg)` }}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${deg % 90 === 0 ? 'w-0.5 h-4 bg-cyan-400' : 'w-px h-2 bg-cyan-600/60'}`} />
              </div>
            ))}
          </div>
          {/* Cardinal Directions */}
          <div className="absolute inset-0 font-mono text-[10px] md:text-xs font-bold tracking-widest text-cyan-300">
            <span className="absolute top-5 left-1/2 -translate-x-1/2 text-cyan-400 text-sm">N</span>
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-cyan-600">S</span>
            <span className="absolute top-1/2 right-5 -translate-y-1/2 text-cyan-600">E</span>
            <span className="absolute top-1/2 left-5 -translate-y-1/2 text-cyan-600">W</span>
          </div>
          {/* Spinning Needle */}
          <div className="absolute inset-0 flex items-center justify-center animate-[spin_3s_ease-in-out_infinite]">
            <div className="w-1 h-1/2 origin-bottom">
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[40px] md:border-b-[55px] border-l-transparent border-r-transparent border-b-cyan-400 mx-auto drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'rotate(180deg)' }}>
            <div className="w-1 h-1/2 origin-bottom animate-[spin_3s_ease-in-out_infinite]">
              <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[35px] md:border-b-[45px] border-l-transparent border-r-transparent border-b-red-500/70 mx-auto" />
            </div>
          </div>
          {/* Center Dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.8)]" />
          </div>
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="46%" fill="none" stroke="rgba(0,200,255,0.1)" strokeWidth="2" />
            <circle cx="50%" cy="50%" r="46%" fill="none" stroke="rgba(0,200,255,0.6)" strokeWidth="2" strokeLinecap="round"
              strokeDasharray={`${progress * 2.88} 288`}
              className="transition-all duration-300 ease-out drop-shadow-[0_0_6px_rgba(0,255,255,0.5)]" />
          </svg>
        </div>
        {/* Text */}
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-[0.3em] uppercase mb-4">NAVIGATING</h1>
        <p className="text-cyan-300/60 font-mono text-xs tracking-[0.4em] uppercase mb-6">Charting the Deep</p>
        <p className="text-cyan-400 font-mono text-lg font-bold">{progress}%</p>
      </div>

      {/* 3D Canvas Container */}
      <div ref={containerRef} style={{ position: "sticky", top: 0, width: "100vw", height: "100vh", overflow: "hidden" }}>
        {/* Full-screen border */}
        <div className="pointer-events-none fixed inset-0 z-50 border-[2px] border-cyan-500/20 opacity-90" />

        {/* Global HUD Overlay */}
        <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between p-6 md:p-10 text-white font-mono text-[10px] md:text-xs tracking-widest">
          <div className="flex justify-between items-start w-full">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
              </div>
              <div className="font-black tracking-[0.2em] text-cyan-50 leading-tight">
                <span className="text-cyan-400">SEMAPHORE</span> <br/> FOUNDATION
              </div>
            </div>
            <div className="hidden md:flex gap-8 text-cyan-100/70 font-bold pointer-events-auto">
              {["JOURNEYS", "ABOUT", "GET INVOLVED", "EDUCATION", "SHARE +", "EN ˅"].map(item => <a key={item} href="#" className="hover:text-cyan-300 transition-colors">{item}</a>)}
            </div>
          </div>

          <div className="flex justify-between items-end w-full">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full border border-cyan-500/30 flex items-center justify-center bg-blue-900/20 backdrop-blur-sm">
                <div className="absolute inset-2 rounded-full border border-cyan-400/50 border-dashed animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full bg-cyan-900/40" />
                <div className="w-1 h-full absolute bg-gradient-to-b from-cyan-400/0 via-cyan-400 to-cyan-400/0 animate-[spin_4s_linear_infinite]" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-cyan-300 text-sm tracking-[0.2em]">DEEP TRENCH</span>
                <span className="text-cyan-100/70">DISCOVERY PROGRESS: {scrollProgress}%</span>
                <div className="flex gap-2 mt-1 pt-1 border-t border-cyan-500/30 text-[9px] text-cyan-200/70">
                  <span>DEPTH: {Math.max(2, Math.floor(scrollProgress * 0.9))}M</span>
                  <span>|</span>
                  <span>TEMP: {Math.max(4, (28 - scrollProgress * 0.24)).toFixed(1)}°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero UI Overlay */}
        <div id="hero-ui" className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none text-white selection:bg-cyan-900/50">
          <div className="text-center px-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[0.2em] md:tracking-[0.3em] text-transparent uppercase opacity-90" style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.9)" }}>
              SEMAPHORE
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[0.2em] md:tracking-[0.3em] text-white mt-1 md:mt-2 shadow-black drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] uppercase">
              2K26
            </h1>
            <p className="text-cyan-100/80 tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-xs font-medium uppercase mt-8 md:mt-10 bg-black/20 backdrop-blur-sm inline-block px-6 py-2 border border-cyan-100/10">
              National Level IT & Cultural Fest
            </p>
          </div>

          {/* Bottom Center Button */}
          <div 
            className="absolute bottom-20 md:bottom-24 flex flex-col items-center pointer-events-auto cursor-pointer group"
            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <div className="flex gap-4 items-center">
              <div className="border border-white/20 px-8 py-3 flex items-center gap-4 group-hover:bg-white/10 group-hover:border-cyan-400/50 transition-all duration-300">
                <div className="w-2 h-2 border-t border-l border-white/50 group-hover:border-cyan-400 transition-colors" />
                <span className="text-white tracking-[0.3em] text-[10px] md:text-xs font-bold group-hover:text-cyan-200 transition-colors">
                  SCROLL TO DIVE
                </span>
                <div className="w-2 h-2 border-b border-r border-white/50 group-hover:border-cyan-400 transition-colors" />
              </div>
            </div>
          </div>

          {/* Bottom Right Copyright */}
          <div className="absolute bottom-8 md:bottom-12 right-8 md:right-12 text-right text-cyan-100/50 font-mono text-[9px] md:text-[10px] tracking-widest leading-relaxed uppercase">
            <p>9-10 OCTOBER 2026</p>
            <p>NMAM INSTITUTE OF TECHNOLOGY</p>
            <p>ALL RIGHTS RESERVED</p>
          </div>
        </div>

        {/* Minimal Event Labels (replaces square card boxes) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {events.map((ev) => (
            <div
              key={ev.id}
              id={ev.id}
              className="absolute opacity-0 left-1/2 -translate-x-1/2 text-center"
              style={{ top: "50%", marginTop: "-40px" }}
            >
              <span className="text-cyan-400 text-xs font-mono tracking-[0.3em] uppercase block mb-2">{ev.category}</span>
              <h4 className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_4px_20px_rgba(0,200,255,0.4)] tracking-wider uppercase">{ev.title}</h4>
              <p className="text-cyan-100/60 text-sm md:text-base mt-3 max-w-md mx-auto">{ev.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
