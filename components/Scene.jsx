"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { Water } from "three/examples/jsm/objects/Water.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  seabedVertex,
  seabedFragment,
  flowFieldVertex,
  flowFieldFragment,
  wormholeVertex,
  wormholeFragment,
  bubbleVertex,
  bubbleFragment,
  portalVortexVertex,
  portalVortexFragment,
  waterCausticsVertex,
  waterCausticsFragment,
} from "../src/Shaders/index";

gsap.registerPlugin(ScrollTrigger);

const eventNodes = [
  {
    id: "event-1",
    num: "01",
    name: "IT Quiz",
    category: "Technical",
    desc: "Test your knowledge on Programming, DBMS, Operating Systems, Networks, and Cyber Security. Battle against top tech minds.",
    date: "9 October 2026",
    time: "10:00 AM",
    venue: "Main Auditorium",
    prize: "₹ 10,000",
    rules: ["Teams of 2 members", "Preliminary written round followed by live stage quiz"],
    pos: { x: -32, y: -110, z: -240 }, // HIGH CLIFF PLATEAU
    bannerPos: { x: -16, y: -103, z: -235, rotY: 0.3 },
    portalPos: { x: -40, y: -105, z: -248 },
    minScroll: 48,
  },
  {
    id: "event-2",
    num: "02",
    name: "IT Manager",
    category: "Management",
    desc: "You are the technology manager of a company. Something goes wrong. Test your leadership, crisis management, and decision-making skills.",
    date: "9 October 2026",
    time: "11:30 AM",
    venue: "MCA Seminar Hall",
    prize: "₹ 15,000",
    rules: ["Individual participation", "Multiple stress rounds & mock press conference"],
    pos: { x: 32, y: -210, z: -330 }, // DEEP OCEAN TRENCH (DOWN)
    bannerPos: { x: 16, y: -203, z: -325, rotY: -0.3 },
    portalPos: { x: 40, y: -205, z: -338 },
    minScroll: 58,
  },
  {
    id: "event-3",
    num: "03",
    name: "Techno Hive",
    category: "Technical",
    desc: "A pure technical and IT-oriented challenge designed to test your core tech competencies, web dev, and adaptability.",
    date: "9 October 2026",
    time: "02:00 PM",
    venue: "Computer Lab 3",
    prize: "₹ 12,000",
    rules: ["Teams of 2 members", "Coding, debugging, and live prototype deployment"],
    pos: { x: -28, y: -160, z: -420 }, // ELEVATED SPIRE (HIGH)
    bannerPos: { x: -12, y: -153, z: -415, rotY: 0.25 },
    portalPos: { x: -36, y: -155, z: -428 },
    minScroll: 68,
  },
  {
    id: "event-4",
    num: "04",
    name: "Hyper Launch",
    category: "Innovation",
    desc: "An innovation, product, and business-oriented challenge. Pitch your startup ideas and show your entrepreneurial spirit.",
    date: "10 October 2026",
    time: "09:30 AM",
    venue: "Incubation Center",
    prize: "₹ 15,000",
    rules: ["Teams of up to 3 members", "5-minute pitch + 3-minute Q&A with judges"],
    pos: { x: 28, y: -310, z: -510 }, // ULTRA-DEEP ABYSS (DOWN)
    bannerPos: { x: 14, y: -303, z: -505, rotY: -0.25 },
    portalPos: { x: 36, y: -305, z: -518 },
    minScroll: 78,
  },
  {
    id: "event-5",
    num: "05",
    name: "Gaming & Treasure Hunt",
    category: "E-Sports & Fun",
    desc: "Survive intense gaming trenches (BGMI & Valorant) and solve cryptic tech clues across campus to unearth the hidden treasure.",
    date: "10 October 2026",
    time: "01:30 PM",
    venue: "E-Sports Arena & Campus Grounds",
    prize: "₹ 20,000",
    rules: ["Squads of 4 members", "Time-bound physical & digital clues"],
    pos: { x: 0, y: -260, z: -600 }, // SEABED CITADEL (MID)
    bannerPos: { x: 16, y: -253, z: -595, rotY: -0.2 },
    portalPos: { x: -18, y: -255, z: -608 },
    minScroll: 88,
  },
];

// Helper function to dynamically draw futuristic 3D Event Banners onto a Canvas Texture
function createEventBannerTexture(node) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // Dark metallic cyber background gradient
  const grad = ctx.createLinearGradient(0, 0, 1024, 512);
  grad.addColorStop(0, "#011326");
  grad.addColorStop(0.5, "#032847");
  grad.addColorStop(1, "#010e1c");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Hexagon / Cyber Grid Pattern
  ctx.strokeStyle = "rgba(0, 240, 255, 0.09)";
  ctx.lineWidth = 1;
  for (let x = 0; x < 1024; x += 32) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
  }
  for (let y = 0; y < 512; y += 32) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
  }

  // Glowing Outer Neon Frame
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 24;
  ctx.strokeStyle = "#00f0ff";
  ctx.lineWidth = 10;
  ctx.strokeRect(16, 16, 992, 480);

  // Inner Accent Frame
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(0, 240, 255, 0.5)";
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, 964, 452);

  // Corner Brackets (White)
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(22, 55); ctx.lineTo(22, 22); ctx.lineTo(55, 22); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(969, 22); ctx.lineTo(1002, 22); ctx.lineTo(1002, 55); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(22, 457); ctx.lineTo(22, 490); ctx.lineTo(55, 490); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(969, 490); ctx.lineTo(1002, 490); ctx.lineTo(1002, 457); ctx.stroke();

  // Top Header Bar Background
  const headerGrad = ctx.createLinearGradient(0, 0, 1024, 0);
  headerGrad.addColorStop(0, "rgba(0, 240, 255, 0.25)");
  headerGrad.addColorStop(1, "rgba(2, 132, 199, 0.15)");
  ctx.fillStyle = headerGrad;
  ctx.fillRect(32, 32, 960, 90);

  // Large Event Index Number (e.g. EVENT 01)
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 15;
  ctx.font = "bold 64px monospace";
  ctx.fillStyle = "#00f0ff";
  ctx.fillText(`EVENT // ${node.num}`, 60, 98);

  // Category Badge Pill
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(0, 240, 255, 0.2)";
  ctx.strokeStyle = "#00f0ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(640, 48, 320, 58, 29);
  ctx.fill();
  ctx.stroke();

  ctx.font = "bold 24px monospace";
  ctx.fillStyle = "#a5f3fc";
  ctx.textAlign = "center";
  ctx.fillText(node.category.toUpperCase(), 800, 85);
  ctx.textAlign = "left";

  // Event Name Title
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = 20;
  ctx.font = "900 60px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(node.name.toUpperCase(), 60, 205);

  // Date & Venue Subtitle
  ctx.shadowBlur = 0;
  ctx.font = "bold 22px monospace";
  ctx.fillStyle = "#67e8f9";
  ctx.fillText(`📅 ${node.date} @ ${node.time}   📍 ${node.venue.toUpperCase()}`, 60, 255);

  // Prize Pool Pill Badge
  ctx.fillStyle = "rgba(234, 179, 8, 0.2)";
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(60, 295, 380, 60, 18);
  ctx.fill();
  ctx.stroke();

  ctx.shadowColor = "#eab308";
  ctx.shadowBlur = 10;
  ctx.font = "bold 26px monospace";
  ctx.fillStyle = "#fef08a";
  ctx.fillText(`🏆 PRIZE POOL: ${node.prize}`, 85, 335);

  // Register Action Button Prompt
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(0, 240, 255, 0.25)";
  ctx.strokeStyle = "#00f0ff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(60, 385, 904, 68, 18);
  ctx.fill();
  ctx.stroke();

  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 16;
  ctx.font = "bold 28px monospace";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("⚡ CLICK POSTER TO VIEW DETAILS & REGISTER ⚡", 110, 430);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function Scene() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const audioRef = useRef(null);
  const pinRefs = useRef([]);
  const activeEventRef = useRef("event-1");
  const userMutedRef = useRef(false);
  const [activeEvent, setActiveEvent] = useState("event-1");

  const [progress, setProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [stats, setStats] = useState({
    depth: 2,
    speed: "2.0",
    coords: "X:0 Y:0 Z:0",
    fps: 60,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const bgm = new Audio("/assets/audio/bgm.mp3");
      bgm.loop = true;
      bgm.volume = 0.5;
      bgm.preload = "auto";
      audioRef.current = bgm;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Automatically play audio by default when first entering the ocean on user scroll gesture, and pause outside ocean
  useEffect(() => {
    if (!audioRef.current) return;

    const handleInitialOceanScroll = () => {
      if (scrollProgress >= 4 && !userMutedRef.current && audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => setIsAudioPlaying(true))
          .catch(() => {});
      }
    };

    if (scrollProgress >= 4) {
      handleInitialOceanScroll();
      window.addEventListener("wheel", handleInitialOceanScroll, { passive: true });
      window.addEventListener("scroll", handleInitialOceanScroll, { passive: true });
      window.addEventListener("touchmove", handleInitialOceanScroll, { passive: true });
    } else {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      }
    }

    return () => {
      window.removeEventListener("wheel", handleInitialOceanScroll);
      window.removeEventListener("scroll", handleInitialOceanScroll);
      window.removeEventListener("touchmove", handleInitialOceanScroll);
    };
  }, [scrollProgress]);

  const toggleAudio = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!audioRef.current) {
      const bgm = new Audio("/assets/audio/bgm.mp3");
      bgm.loop = true;
      bgm.volume = 0.5;
      audioRef.current = bgm;
    }

    const audio = audioRef.current;
    if (audio.paused) {
      userMutedRef.current = false; // User explicitly turned ON audio
      audio
        .play()
        .then(() => {
          setIsAudioPlaying(true);
        })
        .catch((err) => {
          console.warn("Audio play error:", err);
          setIsAudioPlaying(false);
        });
    } else {
      userMutedRef.current = true; // User explicitly turned OFF audio
      audio.pause();
      setIsAudioPlaying(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const manager = new THREE.LoadingManager();
    manager.onProgress = (_url, itemsLoaded, itemsTotal) => {
      setProgress(Math.floor((itemsLoaded / itemsTotal) * 100));
    };
    manager.onLoad = () => {
      setTimeout(() => setLoading(false), 500);
    };

    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      isMobile ? 65 : 75,
      window.innerWidth / window.innerHeight,
      0.1,
      1600
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      powerPreference: isMobile ? "low-power" : "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // --- HDRI SKY ENVIRONMENT (SURFACE OCEAN START) ---
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    let exrEnvironmentTexture = null;
    const exrLoader = new EXRLoader(manager);
    exrLoader.load("/hdri/spiaggia_di_mondello_4k.exr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      const exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
      exrEnvironmentTexture = exrCubeRenderTarget.texture;
      scene.background = exrCubeRenderTarget.texture;
      scene.environment = exrCubeRenderTarget.texture;
      texture.dispose();
    });

    // --- SURFACE OCEAN WATER ---
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    const waterNormals = new THREE.TextureLoader(manager).load(
      "/textures/waternormals.jpg",
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
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

    // --- UNDERWATER CEILING CAUSTICS PLANE (VIEWED FROM BELOW WATER) ---
    const waterCeilingGeo = new THREE.PlaneGeometry(800, 800);
    const waterCeilingMat = new THREE.ShaderMaterial({
      vertexShader: waterCausticsVertex,
      fragmentShader: waterCausticsFragment,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(0x00f0ff) },
        uColor2: { value: new THREE.Color(0x0044aa) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const waterCeilingMesh = new THREE.Mesh(waterCeilingGeo, waterCeilingMat);
    waterCeilingMesh.rotation.x = Math.PI / 2;
    waterCeilingMesh.position.y = -2.05;
    waterCeilingMesh.visible = false;
    scene.add(waterCeilingMesh);

    const waterUnderside = new THREE.Mesh(
      waterGeometry,
      new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.1,
        side: THREE.BackSide,
      })
    );
    waterUnderside.rotation.x = -Math.PI / 2;
    waterUnderside.position.y = -2.01;
    scene.add(waterUnderside);

    // --- SURFACE GLACIAL ICEBERGS & ROCKS ---
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

    const icePlateGeo = new THREE.CylinderGeometry(4, 5, 0.8, 7);
    const icePlate = new THREE.Mesh(icePlateGeo, iceMaterial);
    icePlate.position.set(-24, -4.5, -36);
    icePlate.rotation.y = 0.4;
    scene.add(icePlate);

    const smallIcePositions = [
      { x: 26, y: -4, z: -32, s: 1.6 },
      { x: -35, y: -3.5, z: -42, s: 2.2 },
      { x: 34, y: -4.5, z: -38, s: 1.5 },
      { x: -18, y: -5, z: -50, s: 1.8 },
      { x: 22, y: -3.5, z: -26, s: 1.2 },
    ];
    const smallIceGeos = [];
    for (const p of smallIcePositions) {
      const chunkGeo = new THREE.IcosahedronGeometry(p.s, 2);
      smallIceGeos.push(chunkGeo);
      const chunk = new THREE.Mesh(chunkGeo, iceMaterial);
      chunk.position.set(p.x, p.y, p.z);
      chunk.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(chunk);
    }

    // --- DEEP UNDERGROUND OCEAN LIGHTING ---
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(0, 10, 5);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const tealUnderwaterLight = new THREE.DirectionalLight(0x00d5e8, 2.5);
    tealUnderwaterLight.position.set(0, 50, -100);
    scene.add(tealUnderwaterLight);

    // Glowing Portal Backlight (Positioned deep underwater at y: -110, z: -192)
    const portalBackLight = new THREE.PointLight(0x00f0ff, 8.0, 200);
    portalBackLight.position.set(0, -110, -192);
    scene.add(portalBackLight);



    // --- LEFT & RIGHT JAGGED CLIFF WALLS ---
    const sideCliffGroup = new THREE.Group();
    sideCliffGroup.visible = false;

    const cliffWallMat = new THREE.MeshStandardMaterial({
      color: 0x041c2c,
      roughness: 0.85,
      metalness: 0.2,
      flatShading: true,
    });

    const coralGlowColors = [0x00f0ff, 0xa855f7, 0xec4899, 0x0284c7];

    function createSideCliffWall(xPos, isRight) {
      const cliffWallGeo = new THREE.BoxGeometry(32, 130, 180, 16, 24, 16);
      const pos = cliffWallGeo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const bump =
          Math.sin(v.y * 0.08) * Math.cos(v.z * 0.08) * 6.0 +
          Math.sin(v.y * 0.2 + v.x * 0.1) * 2.5;
        v.x += isRight ? -bump : bump;
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      cliffWallGeo.computeVertexNormals();

      const cliffMesh = new THREE.Mesh(cliffWallGeo, cliffWallMat);
      cliffMesh.position.set(xPos, -95, -160);
      sideCliffGroup.add(cliffMesh);

      // Add glowing corals & sponges along the cliff face shelves
      for (let c = 0; c < 20; c++) {
        const cGeo = new THREE.ConeGeometry(1.0 + Math.random() * 0.6, 4.0 + Math.random() * 3.0, 7);
        const cMat = new THREE.MeshStandardMaterial({
          color: 0x032035,
          emissive: coralGlowColors[c % coralGlowColors.length],
          emissiveIntensity: 0.85,
          roughness: 0.3,
          flatShading: true,
        });
        const coralMesh = new THREE.Mesh(cGeo, cMat);
        const sideOffset = isRight ? -16 + (Math.random() - 0.5) * 5 : 16 + (Math.random() - 0.5) * 5;
        coralMesh.position.set(
          xPos + sideOffset,
          -35 - Math.random() * 90,
          -80 - Math.random() * 140
        );
        coralMesh.rotation.set(
          (Math.random() - 0.5) * 0.4,
          Math.random() * Math.PI,
          isRight ? -0.4 : 0.4
        );
        sideCliffGroup.add(coralMesh);
      }
    }

    createSideCliffWall(-68, false); // Left Cliff Wall
    createSideCliffWall(68, true);   // Right Cliff Wall
    scene.add(sideCliffGroup);

    // --- LAYER 3 & 4: DISTANT UNDERWATER MOUNTAIN PEAKS & CAVERN WALLS ---
    const caveGeometry = new THREE.CylinderGeometry(260, 360, 900, 32, 32, true);
    const cavePos = caveGeometry.attributes.position;
    const caveVec = new THREE.Vector3();
    for (let i = 0; i < cavePos.count; i++) {
      caveVec.fromBufferAttribute(cavePos, i);
      const noise =
        Math.sin(caveVec.x * 0.05) * Math.cos(caveVec.y * 0.05) * Math.sin(caveVec.z * 0.05) * 25.0 +
        Math.sin(caveVec.x * 0.12 + caveVec.y * 0.08) * 10.0;
      caveVec.x += noise;
      caveVec.z += noise;
      cavePos.setXYZ(i, caveVec.x, caveVec.y, caveVec.z);
    }
    caveGeometry.computeVertexNormals();

    const caveMaterial = new THREE.MeshStandardMaterial({
      color: 0x021627,
      roughness: 0.85,
      metalness: 0.15,
      side: THREE.BackSide,
      flatShading: true,
    });
    const caveMesh = new THREE.Mesh(caveGeometry, caveMaterial);
    caveMesh.position.set(0, -220, -380);
    caveMesh.visible = false;
    scene.add(caveMesh);

    // Large Distant Underwater Mountains
    const bgMountainsGroup = new THREE.Group();
    bgMountainsGroup.visible = false;

    const mountainMaterial = new THREE.MeshStandardMaterial({
      color: 0x011322,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    });

    const mountainPositions = [
      { x: -160, y: -100, z: -260, r: 65, h: 180 },
      { x: 160, y: -110, z: -290, r: 75, h: 200 },
      { x: -190, y: -150, z: -380, r: 85, h: 220 },
      { x: 185, y: -160, z: -410, r: 90, h: 240 },
      { x: -120, y: -220, z: -520, r: 105, h: 260 },
      { x: 120, y: -230, z: -540, r: 110, h: 280 },
    ];

    for (const m of mountainPositions) {
      const mGeo = new THREE.ConeGeometry(m.r, m.h, 7);
      const mPos = mGeo.attributes.position;
      const mV = new THREE.Vector3();
      for (let i = 0; i < mPos.count; i++) {
        mV.fromBufferAttribute(mPos, i);
        const detail = Math.sin(mV.x * 0.08) * Math.cos(mV.y * 0.08) * 8.0;
        mV.x += detail;
        mV.z += detail;
        mPos.setXYZ(i, mV.x, mV.y, mV.z);
      }
      mGeo.computeVertexNormals();

      const mMesh = new THREE.Mesh(mGeo, mountainMaterial);
      mMesh.position.set(m.x, m.y + m.h / 2, m.z);
      bgMountainsGroup.add(mMesh);
    }
    scene.add(bgMountainsGroup);

    // --- CENTRAL ANCIENT CIRCULAR PORTAL RING (MAIN ENTRANCE STARGATE AT y: -110, z: -160) ---
    const ruinStoneMat = new THREE.MeshStandardMaterial({
      color: 0x0b2d42,
      roughness: 0.4,
      metalness: 0.6,
      flatShading: true,
    });

    const ruinGlowMat = new THREE.MeshStandardMaterial({
      color: 0x005577,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.4,
    });

    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, -110, -190);

    const archRockMat = new THREE.MeshStandardMaterial({
      color: 0x06283d,
      roughness: 0.85,
      metalness: 0.15,
      flatShading: true,
    });

    // Outer Natural Cavern Rock Arch framing the entire Stargate Structure
    const mainArchGeo = new THREE.TorusGeometry(32, 5.5, 12, 32, Math.PI);
    const archPos = mainArchGeo.attributes.position;
    const aVec = new THREE.Vector3();
    for (let i = 0; i < archPos.count; i++) {
      aVec.fromBufferAttribute(archPos, i);
      const noise = Math.sin(aVec.x * 0.15) * Math.cos(aVec.y * 0.15) * 3.5;
      aVec.x += noise;
      aVec.y += noise;
      archPos.setXYZ(i, aVec.x, aVec.y, aVec.z);
    }
    mainArchGeo.computeVertexNormals();
    const mainArchMesh = new THREE.Mesh(mainArchGeo, archRockMat);
    mainArchMesh.position.set(0, -5, -4);
    portalGroup.add(mainArchMesh);

    // Concentric Glowing Outer Energy Ring around Portal Ring
    const outerRingGeo = new THREE.TorusGeometry(18.5, 0.4, 16, 48);
    const outerRingMesh = new THREE.Mesh(outerRingGeo, ruinGlowMat);
    outerRingMesh.position.set(0, 0, -0.2);
    portalGroup.add(outerRingMesh);

    // Twin Guardian Obelisks / Spires (Left & Right of Portal Ring)
    const obeliskPositions = [
      { x: -26, y: 3, z: 0, rotZ: 0.1 },
      { x: 26, y: 3, z: 0, rotZ: -0.1 },
    ];
    for (const ob of obeliskPositions) {
      const obGroup = new THREE.Group();
      obGroup.position.set(ob.x, ob.y, ob.z);
      obGroup.rotation.z = ob.rotZ;

      const obGeo = new THREE.CylinderGeometry(1.2, 3.2, 32, 6);
      const obMesh = new THREE.Mesh(obGeo, ruinStoneMat);
      obGroup.add(obMesh);

      const obCapGeo = new THREE.OctahedronGeometry(2.2, 1);
      const obCapMat = new THREE.MeshStandardMaterial({
        color: 0x011e30,
        emissive: 0x00f0ff,
        emissiveIntensity: 2.2,
        roughness: 0.1,
      });
      const obCap = new THREE.Mesh(obCapGeo, obCapMat);
      obCap.position.set(0, 17, 0);
      obGroup.add(obCap);

      const obGlyphGeo = new THREE.BoxGeometry(0.5, 22, 0.5);
      const obGlyph = new THREE.Mesh(obGlyphGeo, ruinGlowMat);
      obGlyph.position.set(0, 0, 1.8);
      obGroup.add(obGlyph);

      portalGroup.add(obGroup);
    }

    // Bioluminescent Crystal Clusters surrounding the Stone Pedestal Steps
    const pedestalCrystals = [
      { x: -16, y: -12, z: 6, color: 0x00f0ff, scale: 1.6 },
      { x: 16, y: -12, z: 6, color: 0x00f0ff, scale: 1.5 },
      { x: -19, y: -15, z: 8, color: 0xa855f7, scale: 1.8 },
      { x: 19, y: -15, z: 8, color: 0x38bdf8, scale: 1.7 },
      { x: -22, y: -19, z: 10, color: 0x00e5ff, scale: 2.0 },
      { x: 22, y: -19, z: 10, color: 0xa855f7, scale: 1.9 },
      { x: -12, y: -10, z: -4, color: 0x0284c7, scale: 1.4 },
      { x: 12, y: -10, z: -4, color: 0x00f0ff, scale: 1.4 },
    ];

    for (const c of pedestalCrystals) {
      const cGeo = new THREE.OctahedronGeometry(c.scale, 1);
      const cMat = new THREE.MeshStandardMaterial({
        color: 0x011a28,
        emissive: c.color,
        emissiveIntensity: 2.5,
        roughness: 0.2,
        flatShading: true,
      });
      const cMesh = new THREE.Mesh(cGeo, cMat);
      cMesh.position.set(c.x, c.y, c.z);
      cMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      portalGroup.add(cMesh);
    }

    // Raised Stone Staircase Pedestal
    const stepDimensions = [
      { w: 22, h: 3.0, d: 16, y: -14 },
      { w: 26, h: 3.0, d: 18, y: -17 },
      { w: 30, h: 3.0, d: 20, y: -20 },
      { w: 35, h: 3.0, d: 22, y: -23 },
      { w: 42, h: 3.0, d: 25, y: -26 },
    ];
    const stepGeos = [];
    for (const step of stepDimensions) {
      const stepGeo = new THREE.BoxGeometry(step.w, step.h, step.d);
      stepGeos.push(stepGeo);
      const stepMesh = new THREE.Mesh(stepGeo, ruinStoneMat);
      stepMesh.position.set(0, step.y, 0);
      portalGroup.add(stepMesh);
    }

    // Large Circular Stone Portal Ring (Radius 14, Tube 2.5)
    const portalRingGeo = new THREE.TorusGeometry(14, 2.5, 16, 48);
    const portalRingMesh = new THREE.Mesh(portalRingGeo, ruinStoneMat);
    portalRingMesh.position.set(0, 0, 0);
    portalGroup.add(portalRingMesh);

    // Keystone at top of Portal Ring
    const keystoneGeo = new THREE.BoxGeometry(4.0, 5.0, 3.5);
    const keystone = new THREE.Mesh(keystoneGeo, ruinStoneMat);
    keystone.position.set(0, 14.5, 0);
    portalGroup.add(keystone);

    const keystoneGlyph = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.8, 0.4), ruinGlowMat);
    keystoneGlyph.position.set(0, 14.5, 1.8);
    portalGroup.add(keystoneGlyph);

    // Custom Swirling Energy Vortex Shader Disc inside Portal Ring
    const portalDiscGeo = new THREE.CircleGeometry(11.8, 48);
    const portalDiscMat = new THREE.ShaderMaterial({
      vertexShader: portalVortexVertex,
      fragmentShader: portalVortexFragment,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(0x00f0ff) },
        uColor2: { value: new THREE.Color(0x002266) },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const portalDisc = new THREE.Mesh(portalDiscGeo, portalDiscMat);
    portalDisc.position.set(0, 0, -0.1);
    portalGroup.add(portalDisc);

    // Soft Energy Blur Aura Disc specifically for ONLY the Portal Energy Core
    const portalBlurGeo = new THREE.CircleGeometry(16.5, 48);
    const portalBlurMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          vec2 center = vUv - vec2(0.5);
          float dist = length(center) * 2.0;
          float alpha = smoothstep(1.0, 0.0, dist);
          alpha = pow(alpha, 1.8) * 0.75;
          vec3 blurColor = mix(vec3(0.0, 0.92, 1.0), vec3(0.01, 0.12, 0.35), dist);
          gl_FragColor = vec4(blurColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const portalBlurMesh = new THREE.Mesh(portalBlurGeo, portalBlurMat);
    portalBlurMesh.position.set(0, 0, -0.3);
    portalGroup.add(portalBlurMesh);

    // Swirling Energy Particles Orbiting Main Portal Ring
    const portalParticleCount = 350;
    const portalParticleGeo = new THREE.BufferGeometry();
    const portalParticlePositions = new Float32Array(portalParticleCount * 3);
    const portalParticleAngles = new Float32Array(portalParticleCount);
    const portalParticleSpeeds = new Float32Array(portalParticleCount);

    for (let i = 0; i < portalParticleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 12.0 + Math.random() * 4.0;
      portalParticlePositions[i * 3] = Math.cos(angle) * radius;
      portalParticlePositions[i * 3 + 1] = Math.sin(angle) * radius;
      portalParticlePositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      portalParticleAngles[i] = angle;
      portalParticleSpeeds[i] = 1.0 + Math.random() * 2.0;
    }
    portalParticleGeo.setAttribute("position", new THREE.BufferAttribute(portalParticlePositions, 3));

    const portalParticleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 1.4,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const portalParticleMesh = new THREE.Points(portalParticleGeo, portalParticleMat);
    portalGroup.add(portalParticleMesh);

    scene.add(portalGroup);

    // --- FLOW FIELD WATER PARTICLES ---
    const flowFieldCount = isMobile ? 1800 : 4200;
    const flowFieldPositions = new Float32Array(flowFieldCount * 3);
    const flowFieldVelocities = new Float32Array(flowFieldCount * 3);
    const flowFieldSizes = new Float32Array(flowFieldCount);
    const flowFieldAlphas = new Float32Array(flowFieldCount);
    const flowFieldTypes = new Float32Array(flowFieldCount);

    for (let i = 0; i < flowFieldCount; i++) {
      const i3 = i * 3;
      flowFieldPositions[i3] = (Math.random() - 0.5) * 320;
      flowFieldPositions[i3 + 1] = -380 + Math.random() * 360;
      flowFieldPositions[i3 + 2] = -30 - Math.random() * 620;

      flowFieldVelocities[i3] = (Math.random() - 0.5) * 0.1;
      flowFieldVelocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
      flowFieldVelocities[i3 + 2] = (Math.random() - 0.5) * 0.1;

      flowFieldTypes[i] = Math.random();
      flowFieldSizes[i] = Math.random() < 0.7 ? 1.2 + Math.random() * 2.0 : 3.2 + Math.random() * 3.5;
      flowFieldAlphas[i] = 0.35 + Math.random() * 0.55;
    }

    const flowFieldGeo = new THREE.BufferGeometry();
    flowFieldGeo.setAttribute("position", new THREE.BufferAttribute(flowFieldPositions, 3));
    flowFieldGeo.setAttribute("velocity", new THREE.BufferAttribute(flowFieldVelocities, 3));
    flowFieldGeo.setAttribute("size", new THREE.BufferAttribute(flowFieldSizes, 1));
    flowFieldGeo.setAttribute("alpha", new THREE.BufferAttribute(flowFieldAlphas, 1));
    flowFieldGeo.setAttribute("particleType", new THREE.BufferAttribute(flowFieldTypes, 1));

    const flowFieldMat = new THREE.ShaderMaterial({
      vertexShader: flowFieldVertex,
      fragmentShader: flowFieldFragment,
      uniforms: {
        uColor: { value: new THREE.Color(0x00ddff) },
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const flowFieldMesh = new THREE.Points(flowFieldGeo, flowFieldMat);
    scene.add(flowFieldMesh);

    // --- THE NEW WORLD BEYOND THE MAIN STARGATE: INVISIBLE UNTIL ENTERING STARGATE (z < -155) ---
    // Features 5 DISTINCT DESCENDING ROCK PLATFORMS, PORTALS & 3D EVENT BANNERS
    const newWorldGroup = new THREE.Group();
    newWorldGroup.visible = false; // Strictly hidden until passing inside the stargate (z < -155)!
    scene.add(newWorldGroup);

    const cliffRockMat = new THREE.MeshStandardMaterial({
      color: 0x06283d,
      roughness: 0.85,
      metalness: 0.15,
      flatShading: true,
    });

    const nodeGlowMat = new THREE.MeshStandardMaterial({
      color: 0x006688,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.4,
    });

    const bannerFrameMat = new THREE.MeshStandardMaterial({
      color: 0x092635,
      roughness: 0.3,
      metalness: 0.8,
    });

    const cliffMeshes = [];
    const pinMarkers = [];
    const bannerMeshes = [];
    const caveMeshes = [];
    const eventBannerGroups = {};

    const coralColors = [0x00f0ff, 0xa855f7, 0x0284c7, 0xec4899];

    // Construct each distinct Event Location (Platform + Event Portal + 3D Banner)
    function createEventPlatformAndBanner(node) {
      const { x, y, z } = node.pos;
      const width = 34;
      const depth = 34;
      const seabedY = -385;
      const height = Math.abs(y - seabedY) + 25;

      // 1. Sculpted Natural Cliff Mountain Base with Rocky Crags & Ridges
      const cliffGeo = new THREE.CylinderGeometry(width * 0.5, width * 0.85, height, 20, 32);
      const pos = cliffGeo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const cragNoise =
          Math.sin(v.y * 0.12) * Math.cos(v.x * 0.15) * 5.0 +
          Math.sin(v.z * 0.2 + v.y * 0.08) * 3.5 +
          Math.cos(v.x * 0.25 + v.z * 0.25) * 2.2;
        const rad = Math.sqrt(v.x * v.x + v.z * v.z);
        if (rad > 0.1) {
          v.x += (v.x / rad) * cragNoise;
          v.z += (v.z / rad) * cragNoise;
        }
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      cliffGeo.computeVertexNormals();

      const cliffMesh = new THREE.Mesh(cliffGeo, cliffRockMat);
      cliffMesh.position.set(x, y - height / 2, z);
      newWorldGroup.add(cliffMesh);
      cliffMeshes.push(cliffMesh);

      // Add Bioluminescent Crystal Veins & Glowing Rock Ledges onto Platform Face
      const crystalColors = [0x00f0ff, 0xa855f7, 0x0284c7, 0x38bdf8];
      for (let cr = 0; cr < 12; cr++) {
        const xtalGeo = new THREE.OctahedronGeometry(0.8 + Math.random() * 0.8, 1);
        const xtalMat = new THREE.MeshStandardMaterial({
          color: 0x022538,
          emissive: crystalColors[cr % crystalColors.length],
          emissiveIntensity: 1.0,
          roughness: 0.2,
          flatShading: true,
        });
        const xtalMesh = new THREE.Mesh(xtalGeo, xtalMat);
        const angle = Math.random() * Math.PI * 2;
        const r = (width * 0.45) + (Math.random() - 0.5) * 4;
        xtalMesh.position.set(
          x + Math.cos(angle) * r,
          y - Math.random() * 25,
          z + Math.sin(angle) * r
        );
        xtalMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        newWorldGroup.add(xtalMesh);
      }

      // 2. Event Pin Marker on Top of Rock Platform
      const pinPedestalGeo = new THREE.TorusGeometry(3.2, 0.4, 12, 24);
      const pinPedestal = new THREE.Mesh(pinPedestalGeo, nodeGlowMat);
      pinPedestal.rotation.x = Math.PI / 2;
      pinPedestal.position.set(x, y + 0.3, z);
      newWorldGroup.add(pinPedestal);

      const pinStemGeo = new THREE.CylinderGeometry(0.2, 0.4, 4, 8);
      const pinStem = new THREE.Mesh(pinStemGeo, nodeGlowMat);
      pinStem.position.set(x, y + 2.3, z);
      newWorldGroup.add(pinStem);

      const pinNodeGeo = new THREE.OctahedronGeometry(1.6, 2);
      const pinNode = new THREE.Mesh(pinNodeGeo, nodeGlowMat);
      pinNode.position.set(x, y + 5.0, z);
      pinNode.userData = { eventData: node };
      newWorldGroup.add(pinNode);
      pinMarkers.push(pinNode);

      // 3. Grand Underwater Rock Cave Entrance near each event platform
      const { x: px, y: py, z: pz } = node.portalPos;
      const caveGroup = new THREE.Group();
      // Offset position left & back so it does NOT overlap with the 3D Banner Poster
      caveGroup.position.set(px - 7.0, py + 1.5, pz - 7.0);
      // Rotate cave mouth to directly face the camera/viewer side
      caveGroup.rotation.y = Math.PI * 0.25;

      // A. Large Irregular Rock Cavern Dome / Mound
      const domeGeo = new THREE.SphereGeometry(15.5, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.68);
      const domePos = domeGeo.attributes.position;
      const dVec = new THREE.Vector3();
      for (let i = 0; i < domePos.count; i++) {
        dVec.fromBufferAttribute(domePos, i);
        const rNoise =
          Math.sin(dVec.y * 0.25) * Math.cos(dVec.x * 0.3) * 3.5 +
          Math.cos(dVec.z * 0.4) * 2.5;
        dVec.x += (dVec.x > 0 ? 1 : -1) * rNoise * 0.6;
        dVec.z += rNoise * 0.5;
        dVec.y += Math.sin(dVec.x * 0.2) * 1.5;
        domePos.setXYZ(i, dVec.x, dVec.y, dVec.z);
      }
      domeGeo.computeVertexNormals();

      const caveDomeMesh = new THREE.Mesh(domeGeo, cliffRockMat);
      caveDomeMesh.rotation.x = Math.PI / 2;
      caveDomeMesh.position.set(0, 2.0, 0);
      caveGroup.add(caveDomeMesh);

      // B. Outer Arched Entrance Rim (Large Irregular Rock Ring around Cave Mouth)
      const rimGeo = new THREE.TorusGeometry(11.0, 2.8, 16, 32, Math.PI * 1.85);
      const rimPos = rimGeo.attributes.position;
      for (let i = 0; i < rimPos.count; i++) {
        dVec.fromBufferAttribute(rimPos, i);
        const noise = Math.sin(dVec.x * 0.5) * Math.cos(dVec.y * 0.5) * 1.4;
        dVec.x += noise;
        dVec.y += noise;
        rimPos.setXYZ(i, dVec.x, dVec.y, dVec.z);
      }
      rimGeo.computeVertexNormals();

      const caveRimMesh = new THREE.Mesh(rimGeo, ruinStoneMat);
      caveRimMesh.position.set(0, 1.0, 1.5);
      caveGroup.add(caveRimMesh);

      // C. Dark Interior Background (Deep Cave Tunnel Depth)
      const interiorMat = new THREE.MeshStandardMaterial({
        color: 0x00060d,
        roughness: 0.95,
        metalness: 0.05,
        side: THREE.BackSide,
      });
      const interiorGeo = new THREE.CylinderGeometry(9.8, 8.2, 16, 24, 1, true);
      const interiorMesh = new THREE.Mesh(interiorGeo, interiorMat);
      interiorMesh.rotation.x = Math.PI / 2;
      interiorMesh.position.set(0, 0, -5.0);
      caveGroup.add(interiorMesh);

      // D. Large Stalactites (Hanging from Cave Roof)
      const stalactitePositions = [
        { x: -6.2, y: 6.2, z: 0.8, h: 6.2, r: 1.1 },
        { x: -3.6, y: 7.4, z: 1.2, h: 7.8, r: 1.3 },
        { x: -0.8, y: 8.0, z: 1.0, h: 7.0, r: 1.2 },
        { x: 2.2, y: 7.6, z: 1.4, h: 8.2, r: 1.4 },
        { x: 5.4, y: 6.6, z: 0.9, h: 5.8, r: 1.0 },
        { x: 0.0, y: 6.8, z: -2.2, h: 7.2, r: 1.25 },
        { x: -4.2, y: 6.0, z: -2.8, h: 6.4, r: 1.1 },
      ];

      stalactitePositions.forEach((st) => {
        const stGeo = new THREE.ConeGeometry(st.r, st.h, 7);
        const stMesh = new THREE.Mesh(stGeo, cliffRockMat);
        stMesh.rotation.x = Math.PI;
        stMesh.position.set(st.x, st.y - st.h / 2, st.z);
        caveGroup.add(stMesh);
      });

      // E. Large Stalagmites (Rising from Cave Floor)
      const stalagmitePositions = [
        { x: -7.2, y: -5.8, z: 1.0, h: 5.8, r: 1.3 },
        { x: -4.6, y: -6.2, z: 1.4, h: 7.4, r: 1.5 },
        { x: -1.8, y: -6.8, z: 0.9, h: 5.4, r: 1.2 },
        { x: 1.6, y: -6.5, z: 1.6, h: 7.8, r: 1.6 },
        { x: 4.8, y: -6.2, z: 1.1, h: 6.6, r: 1.3 },
        { x: 7.0, y: -5.8, z: 0.8, h: 5.0, r: 1.1 },
        { x: -1.0, y: -6.2, z: -2.8, h: 6.8, r: 1.4 },
      ];

      stalagmitePositions.forEach((sm) => {
        const smGeo = new THREE.ConeGeometry(sm.r, sm.h, 7);
        const smMesh = new THREE.Mesh(smGeo, cliffRockMat);
        smMesh.position.set(sm.x, sm.y + sm.h / 2, sm.z);
        caveGroup.add(smMesh);
      });

      // F. Subtle Cyan/Blue Bioluminescent Crystals glowing on the Cave Floor
      const caveCrystals = [0x00f0ff, 0x0284c7, 0x38bdf8, 0x00e5ff];
      for (let cr = 0; cr < 10; cr++) {
        const cGeo = new THREE.OctahedronGeometry(1.0 + Math.random() * 0.8, 1);
        const cMat = new THREE.MeshStandardMaterial({
          color: 0x011e30,
          emissive: caveCrystals[cr % caveCrystals.length],
          emissiveIntensity: 2.5,
          roughness: 0.2,
        });
        const cMesh = new THREE.Mesh(cGeo, cMat);
        const angle = (cr / 10) * Math.PI - Math.PI / 2;
        cMesh.position.set(Math.cos(angle) * 5.8, -6.0, Math.sin(angle) * 2.8 - 1.0);
        cMesh.rotation.set(Math.random(), Math.random(), 0);
        caveGroup.add(cMesh);
      }

      // G. Subtle Cyan/Blue Light glowing from deep inside the cave mouth
      const caveGlowLight = new THREE.PointLight(0x00f0ff, 7.5, 45);
      caveGlowLight.position.set(0, -1.0, -4.5);
      caveGroup.add(caveGlowLight);

      caveGroup.userData = { eventData: node };
      newWorldGroup.add(caveGroup);
      caveMeshes.push(caveGroup);

      // 4. 3D Event Banner attached to the Rock Platform (POLE BEHIND THE POSTER)
      const { x: bx, y: by, z: bz, rotY: bRotY } = node.bannerPos;

      const bannerGroup = new THREE.Group();

      // Banner Support Post (Positioned BEHIND the Poster at bz - 0.6)
      const postGeo = new THREE.CylinderGeometry(0.4, 0.5, 16, 12);
      const postMesh = new THREE.Mesh(postGeo, bannerFrameMat);
      postMesh.position.set(bx, by - 4.5, bz - 0.6);
      bannerGroup.add(postMesh);

      // Horizontal Rear Mounting Brackets connecting Pole to Poster
      const bracketGeo = new THREE.BoxGeometry(4.0, 0.4, 0.8);
      const bracket1 = new THREE.Mesh(bracketGeo, bannerFrameMat);
      bracket1.position.set(bx, by + 2.0, bz - 0.3);
      bannerGroup.add(bracket1);

      const bracket2 = new THREE.Mesh(bracketGeo, bannerFrameMat);
      bracket2.position.set(bx, by - 2.0, bz - 0.3);
      bannerGroup.add(bracket2);

      // 3D Event Banner Panel with Front & Back Texture
      const bannerTexture = createEventBannerTexture(node);

      const bannerMat = new THREE.MeshStandardMaterial({
        map: bannerTexture,
        roughness: 0.2,
        metalness: 0.3,
        emissive: 0x003344,
        emissiveIntensity: 0.6,
      });

      const frameBackMat = new THREE.MeshStandardMaterial({
        color: 0x061c2d,
        roughness: 0.4,
        metalness: 0.8,
      });

      const materials = [
        frameBackMat, // right
        frameBackMat, // left
        frameBackMat, // top
        frameBackMat, // bottom
        bannerMat,    // front
        bannerMat,    // back
      ];

      const bannerBoxGeo = new THREE.BoxGeometry(18, 9, 0.4);
      const bannerMesh = new THREE.Mesh(bannerBoxGeo, materials);
      bannerMesh.position.set(bx, by, bz);
      bannerMesh.rotation.y = bRotY;
      bannerMesh.userData = { eventData: node };
      bannerGroup.add(bannerMesh);
      bannerMeshes.push(bannerMesh);

      // Glowing Neon Cyan Bezel Frame around Poster Panel
      const bezelGeo = new THREE.BoxGeometry(18.6, 9.6, 0.2);
      const bezelMat = new THREE.MeshStandardMaterial({
        color: 0x005577,
        emissive: 0x00f0ff,
        emissiveIntensity: 1.5,
        roughness: 0.1,
      });
      const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
      bezelMesh.position.set(bx, by, bz - 0.25);
      bezelMesh.rotation.y = bRotY;
      bannerGroup.add(bezelMesh);

      // Dedicated PointLight illuminating each Event Poster Panel
      const posterLight = new THREE.PointLight(0x00f0ff, 5.0, 45);
      posterLight.position.set(bx, by, bz + 4.0);
      bannerGroup.add(posterLight);

      newWorldGroup.add(bannerGroup);
      eventBannerGroups[node.id] = bannerGroup;

      // Bioluminescent corals on each rock platform plateau
      for (let c = 0; c < 8; c++) {
        const coralGeo = new THREE.ConeGeometry(0.7 + Math.random() * 0.6, 3.5 + Math.random() * 2.5, 6);
        const coralMat = new THREE.MeshStandardMaterial({
          color: 0x042840,
          emissive: coralColors[c % coralColors.length],
          emissiveIntensity: 0.75,
          roughness: 0.4,
          flatShading: true,
        });
        const coral = new THREE.Mesh(coralGeo, coralMat);
        coral.position.set(
          x + (Math.random() - 0.5) * (width * 0.7),
          y + 1.2,
          z + (Math.random() - 0.5) * (depth * 0.7)
        );
        newWorldGroup.add(coral);
      }
    }

    eventNodes.forEach((node) => {
      createEventPlatformAndBanner(node);
    });

    // --- DARK TEAL SEA GRASS / KELP FRONDS ---
    const kelpGroup = new THREE.Group();
    const kelpGeo = new THREE.CylinderGeometry(0.15, 0.45, 18, 8, 8);
    const kelpMat = new THREE.MeshStandardMaterial({
      color: 0x02364c,
      emissive: 0x005577,
      emissiveIntensity: 0.3,
      roughness: 0.6,
      flatShading: true,
    });

    const kelpInstances = [];
    const kelpPositions = [
      { x: -35, z: -230 }, { x: -20, z: -235 }, { x: 35, z: -320 },
      { x: 20, z: -325 }, { x: -35, z: -410 }, { x: -20, z: -415 },
      { x: 35, z: -500 }, { x: 20, z: -505 }, { x: -10, z: -590 }, { x: 10, z: -595 },
    ];

    for (let i = 0; i < kelpPositions.length; i++) {
      const kelp = new THREE.Mesh(kelpGeo, kelpMat);
      const pos = kelpPositions[i];
      const hScale = 0.8 + Math.random() * 0.8;
      kelp.scale.set(1, hScale, 1);
      kelp.position.set(pos.x, -370 + (hScale * 9), pos.z);
      kelpGroup.add(kelp);
      kelpInstances.push({
        mesh: kelp,
        phase: Math.random() * Math.PI * 2,
        speed: 1.0 + Math.random() * 1.2,
      });
    }
    scene.add(kelpGroup);

    // --- UNEVEN OCEAN FLOOR TERRAIN WITH MOUNTAIN GROUND BASES ---
    const terrainGeo = new THREE.PlaneGeometry(800, 1000, 128, 128);
    terrainGeo.rotateX(-Math.PI / 2);
    const terPos = terrainGeo.attributes.position;
    const terVec = new THREE.Vector3();
    for (let i = 0; i < terPos.count; i++) {
      terVec.fromBufferAttribute(terrainGeo.attributes.position, i);
      let height =
        Math.sin(terVec.x * 0.02) * Math.cos(terVec.z * 0.02) * 22.0 +
        Math.sin(terVec.x * 0.06 + terVec.z * 0.05) * 8.0;

      // Add ground mountain mounds under each event platform
      for (const ev of eventNodes) {
        const dx = terVec.x - ev.pos.x;
        const dz = terVec.z - ev.pos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 90) {
          const moundFactor = (1.0 - dist / 90);
          const moundHeight = Math.pow(moundFactor, 1.5) * Math.abs(ev.pos.y - (-385)) * 0.35;
          height += moundHeight;
        }
      }

      terVec.y = height;
      terPos.setXYZ(i, terVec.x, terVec.y, terVec.z);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x031828,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.set(0, -385, -450);
    scene.add(terrainMesh);



    // --- RISING BUBBLES PARTICLE STREAM ---
    const bubbleCount = isMobile ? 3000 : 7500;
    const bubbleGeo = new THREE.BufferGeometry();
    const bubbleInitialPos = new Float32Array(bubbleCount * 3);
    const bubbleSizes = new Float32Array(bubbleCount);
    const bubbleSpeeds = new Float32Array(bubbleCount);
    const bubbleOffsets = new Float32Array(bubbleCount);

    for (let i = 0; i < bubbleCount; i++) {
      bubbleInitialPos[i * 3] = (Math.random() - 0.5) * 450;
      bubbleInitialPos[i * 3 + 1] = -385 + Math.random() * 20;
      bubbleInitialPos[i * 3 + 2] = -20 - Math.random() * 650;

      bubbleSizes[i] = 3.0 + Math.random() * 10.0;
      bubbleSpeeds[i] = 0.4 + Math.random() * 1.4;
      bubbleOffsets[i] = Math.random() * 100.0;
    }

    bubbleGeo.setAttribute("position", new THREE.BufferAttribute(bubbleInitialPos, 3));
    bubbleGeo.setAttribute("aInitialPos", new THREE.BufferAttribute(bubbleInitialPos, 3));
    bubbleGeo.setAttribute("aSize", new THREE.BufferAttribute(bubbleSizes, 1));
    bubbleGeo.setAttribute("aSpeed", new THREE.BufferAttribute(bubbleSpeeds, 1));
    bubbleGeo.setAttribute("aOffset", new THREE.BufferAttribute(bubbleOffsets, 1));

    const bubbleMat = new THREE.ShaderMaterial({
      vertexShader: bubbleVertex,
      fragmentShader: bubbleFragment,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uColor: { value: new THREE.Color(0x67e8f9) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const bubblePoints = new THREE.Points(bubbleGeo, bubbleMat);
    scene.add(bubblePoints);

    // --- FLOATING UNDERWATER DUST & PLANKTON ---
    const dustCount = isMobile ? 800 : 2000;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustVelocities = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);
    const dustAlphas = new Float32Array(dustCount);
    const dustTypes = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 320;
      dustPositions[i * 3 + 1] = -385 + Math.random() * 360;
      dustPositions[i * 3 + 2] = -30 - Math.random() * 620;
      dustVelocities[i * 3] = 0;
      dustVelocities[i * 3 + 1] = 0;
      dustVelocities[i * 3 + 2] = 0;
      dustTypes[i] = Math.random();
      dustSizes[i] = Math.random() < 0.6 ? 1.5 + Math.random() * 2.0 : 3.5 + Math.random() * 3.0;
      dustAlphas[i] = 0.3 + Math.random() * 0.6;
    }

    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute("velocity", new THREE.BufferAttribute(dustVelocities, 3));
    dustGeo.setAttribute("size", new THREE.BufferAttribute(dustSizes, 1));
    dustGeo.setAttribute("alpha", new THREE.BufferAttribute(dustAlphas, 1));
    dustGeo.setAttribute("particleType", new THREE.BufferAttribute(dustTypes, 1));

    const dustMat = new THREE.ShaderMaterial({
      vertexShader: flowFieldVertex,
      fragmentShader: flowFieldFragment,
      uniforms: {
        uColor: { value: new THREE.Color(0x22d3ee) },
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const dustMesh = new THREE.Points(dustGeo, dustMat);
    scene.add(dustMesh);

    // --- FLOATING AQUATIC SMALL WATER BALLS ---
    const ballCount = isMobile ? 3000 : 7000;
    const ballGeo = new THREE.BufferGeometry();
    const ballPositions = new Float32Array(ballCount * 3);
    const ballSizes = new Float32Array(ballCount);
    const ballAlphas = new Float32Array(ballCount);
    const ballTypes = new Float32Array(ballCount);

    for (let i = 0; i < ballCount; i++) {
      ballPositions[i * 3] = (Math.random() - 0.5) * 450;
      ballPositions[i * 3 + 1] = -400 + Math.random() * 420;
      ballPositions[i * 3 + 2] = -20 - Math.random() * 650;
      ballSizes[i] = 2.5 + Math.random() * 6.5;
      ballAlphas[i] = 0.4 + Math.random() * 0.55;
      ballTypes[i] = Math.random();
    }

    ballGeo.setAttribute("position", new THREE.BufferAttribute(ballPositions, 3));
    ballGeo.setAttribute("velocity", new THREE.BufferAttribute(new Float32Array(ballCount * 3), 3));
    ballGeo.setAttribute("size", new THREE.BufferAttribute(ballSizes, 1));
    ballGeo.setAttribute("alpha", new THREE.BufferAttribute(ballAlphas, 1));
    ballGeo.setAttribute("particleType", new THREE.BufferAttribute(ballTypes, 1));

    const ballMat = new THREE.ShaderMaterial({
      vertexShader: flowFieldVertex,
      fragmentShader: flowFieldFragment,
      uniforms: {
        uColor: { value: new THREE.Color(0x38bdf8) },
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const ballMesh = new THREE.Points(ballGeo, ballMat);
    scene.add(ballMesh);

    // --- DISTANT SMALL FISH SCHOOLS ---
    const fishCount = isMobile ? 35 : 75;
    const fishGeo = new THREE.ConeGeometry(0.3, 1.4, 5);
    fishGeo.rotateX(Math.PI / 2);

    const fishMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.6,
    });

    const dummyObj = new THREE.Object3D();
    const fishSwarm = new THREE.InstancedMesh(fishGeo, fishMat, fishCount);
    const fishData = [];
    for (let i = 0; i < fishCount; i++) {
      const s = 0.4 + Math.random() * 0.5;
      dummyObj.scale.set(s, s, s * 1.3);
      const isLeft = i < fishCount / 2;
      const baseX = isLeft ? -40 + (Math.random() - 0.5) * 20 : 40 + (Math.random() - 0.5) * 20;

      dummyObj.position.set(
        baseX,
        -30 - Math.random() * 300,
        -60 - Math.random() * 550
      );
      dummyObj.updateMatrix();
      fishSwarm.setMatrixAt(i, dummyObj.matrix);

      fishData.push({
        speed: 0.5 + Math.random() * 1.0,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        baseY: dummyObj.position.y,
        scale: s,
      });
    }
    scene.add(fishSwarm);

    // --- RAYCASTER FOR PORTAL RING, PIN MARKER & 3D BANNER INTERACTIVITY ---
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    function handlePortalClick(event) {
      mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouseVector, camera);

      const intersects = raycaster.intersectObjects([portalRingMesh, ...pinMarkers, ...bannerMeshes, ...caveMeshes], true);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit === portalRingMesh) {
          const targetY = window.innerHeight * 5;
          window.scrollTo({ top: targetY, behavior: "smooth" });
        } else if (hit.userData && hit.userData.eventData) {
          setSelectedEvent(hit.userData.eventData);
        }
      }
    }
    window.addEventListener("click", handlePortalClick);

    // --- CAMERA & GSAP SCROLL JOURNEY: CONTINUOUS DESCENDING DEEP THROUGH THE STARGATE & EVENT LOCATIONS ---
    camera.position.set(0, 2, 0);
    camera.rotation.order = "YXZ";

    const camState = {
      x: 0,
      y: 2,
      z: 0,
      rx: 0,
      ry: 0,
      fogDensity: 0.0,
    };

    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    function handleMouseMove(event) {
      targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      mouseVector.x = targetMouse.x;
      mouseVector.y = targetMouse.y;
      raycaster.setFromCamera(mouseVector, camera);

      const intersects = raycaster.intersectObjects([portalRingMesh, ...pinMarkers, ...bannerMeshes, ...caveMeshes], true);
      if (intersects.length > 0) {
        document.body.style.cursor = "pointer";
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.eventData) {
          setHoveredNode(hit.userData.eventData.name);
        }
      } else {
        document.body.style.cursor = "default";
        setHoveredNode(null);
      }
    }
    window.addEventListener("mousemove", handleMouseMove);

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

    const snapPoints = [0, 0.15, 0.35, 0.48, 0.60, 0.72, 0.84, 1.0];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: isMobile ? 2.5 : 1.5,
        snap: {
          snapTo: (progress, self) => {
            if (progress > 0 && progress < 0.05) {
              // Smooth direction-based snap: scrolling UP goes smoothly to top (0), scrolling DOWN stops exactly at 0.05 (5% progress view)
              if (self && self.direction === -1) {
                return 0;
              }
              return 0.05;
            }
            // No automatic snapping backward or forward after entering the underground ocean
            return progress;
          },
          duration: { min: 0.4, max: 0.8 },
          delay: 0.04,
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const currentProgress = Math.floor(self.progress * 100);
          setScrollProgress(currentProgress);
        },
      },
    });

    // Phase 1: Surface Ocean View (0 - 15%) - Dive directly down into ocean
    tl.to(
      camState,
      {
        x: 0,
        y: -40,
        z: -35,
        rx: -0.08,
        ry: 0,
        fogDensity: 0.012,
        duration: 1.5,
        ease: "power1.inOut",
      },
      0
    );

    // Phase 2: Align Camera with Deeper Submerged Main Portal Ring Center at y: -110, z: -125 (15% - 40%)
    tl.to(
      camState,
      {
        x: 0,
        y: -110,
        z: -125,
        rx: 0,
        ry: 0,
        fogDensity: 0.016,
        duration: 2.5,
        ease: "power2.inOut",
      },
      1.5
    );

    // Phase 3: Fly DIRECTLY INSIDE the Circular Portal Stargate (40% - 48%)
    tl.to(
      camState,
      {
        x: 0,
        y: -110,
        z: -195,
        rx: 0,
        ry: 0,
        fogDensity: 0.018,
        duration: 1.2,
        ease: "power2.in",
      },
      4.0
    );

    // Phase 4: Event 1 (IT Quiz - High Cliff Plateau at y: -110)
    tl.to(
      camState,
      {
        x: 0,
        y: -105,
        z: -205,
        rx: 0.02,
        ry: 0.08,
        fogDensity: 0.015,
        duration: 2.0,
        ease: "power1.out",
      },
      5.2
    );

    // Phase 5: Event 2 (IT Manager - Deep Ocean Trench at y: -210)
    tl.to(
      camState,
      {
        x: 0,
        y: -205,
        z: -295,
        rx: -0.05,
        ry: -0.08,
        fogDensity: 0.02,
        duration: 2.0,
        ease: "power1.inOut",
      },
      7.2
    );

    // Phase 6: Event 3 (Techno Hive - Elevated Spire at y: -160)
    tl.to(
      camState,
      {
        x: 0,
        y: -155,
        z: -385,
        rx: 0.01,
        ry: 0.06,
        fogDensity: 0.018,
        duration: 2.0,
        ease: "power1.inOut",
      },
      9.2
    );

    // Phase 7: Event 4 (Hyper Launch - Ultra-Deep Abyss at y: -310)
    tl.to(
      camState,
      {
        x: 0,
        y: -305,
        z: -475,
        rx: -0.05,
        ry: -0.06,
        fogDensity: 0.024,
        duration: 2.0,
        ease: "power1.inOut",
      },
      11.2
    );

    // Phase 8: Event 5 (Gaming & Treasure Hunt - Seabed Citadel at y: -260)
    tl.to(
      camState,
      {
        x: 0,
        y: -255,
        z: -565,
        rx: -0.02,
        ry: 0,
        fogDensity: 0.022,
        duration: 2.0,
        ease: "power1.inOut",
      },
      13.2
    );

    tl.to({}, { duration: 1 });

    const clock = new THREE.Clock();
    let animationId;
    let frameCount = 0;
    let lastFpsCheck = performance.now();
    function animate() {
      animationId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const t = clock.elapsedTime;

      frameCount++;
      const now = performance.now();
      if (now - lastFpsCheck >= 1000) {
        const calculatedFps = Math.round((frameCount * 1000) / (now - lastFpsCheck));
        const depthVal = Math.max(2, Math.floor(Math.abs(camState.y)));
        setStats({
          depth: depthVal,
          speed: (2.0 + Math.sin(t * 0.5) * 0.4).toFixed(1),
          coords: `X:${Math.round(camState.x)} Y:${Math.round(camState.y)} Z:${Math.round(
            camState.z
          )}`,
          fps: calculatedFps,
        });
        frameCount = 0;
        lastFpsCheck = now;
      }

      // Animate Water Surface & Underwater Ceiling Caustics
      const waterMat = water.material;
      if (waterMat.uniforms && waterMat.uniforms["time"]) {
        waterMat.uniforms["time"].value += delta * 0.5;
      }
      waterCeilingMat.uniforms.uTime.value = t;

      // Smooth Background & Fog Transition from HDRI Sky to Deep Teal Underground Ocean
      if (camState.y > -4) {
        if (exrEnvironmentTexture) {
          scene.background = exrEnvironmentTexture;
          scene.environment = exrEnvironmentTexture;
        }
        scene.fog = null;
        sunLight.intensity = 2.5;
        ambientLight.color.setHex(0xffffff);
        ambientLight.intensity = 1.0;
        waterCeilingMesh.visible = false;
        caveMesh.visible = false;
        sideCliffGroup.visible = false;
        bgMountainsGroup.visible = false;
      } else {
        // Deepening Fog & Dynamic Lighting Transition with Depth
        const depthFactor = Math.min(1.0, Math.abs(camState.y) / 350);
        const caveFogColor = new THREE.Color(0x031e30).lerp(new THREE.Color(0x010814), depthFactor);
        scene.background = caveFogColor;
        scene.fog = new THREE.FogExp2(caveFogColor, camState.fogDensity);

        sunLight.intensity = Math.max(0.1, 2.5 * (1.0 - depthFactor * 0.9));
        ambientLight.color.setHex(0x0a4b66).lerp(new THREE.Color(0x011220), depthFactor);
        ambientLight.intensity = 1.2;
        waterCeilingMesh.visible = true;
        caveMesh.visible = true;
        sideCliffGroup.visible = true;
        bgMountainsGroup.visible = true;
      }

      // STRICT REQUIREMENT: Event World is STRICTLY INVISIBLE until camera passes inside circular portal ring (camState.z < -185)!
      if (camState.z < -185) {
        newWorldGroup.visible = true;
      } else {
        newWorldGroup.visible = false;
      }

      // Update Portal Vortex Shader and Flow Field Water Particles
      portalDiscMat.uniforms.uTime.value = t;
      outerRingMesh.rotation.z = -t * 0.25;
      flowFieldMat.uniforms.uTime.value = t;

      // Update Flow Field Water Particle position drift in 3D currents
      const ffPositions = flowFieldGeo.attributes.position.array;
      for (let i = 0; i < flowFieldCount; i++) {
        const i3 = i * 3;
        ffPositions[i3] += Math.sin(t * 0.6 + i) * 0.05;
        ffPositions[i3 + 1] += Math.cos(t * 0.4 + i) * 0.04 + 0.02;
        ffPositions[i3 + 2] += Math.sin(t * 0.5 + i * 2) * 0.05;

        if (ffPositions[i3 + 1] > 30) {
          ffPositions[i3 + 1] = -385;
        }
      }
      flowFieldGeo.attributes.position.needsUpdate = true;

      // Update Orbiting Energy Particles around Portal Ring
      const pPositions = portalParticleGeo.attributes.position.array;
      for (let i = 0; i < portalParticleCount; i++) {
        const speed = portalParticleSpeeds[i];
        portalParticleAngles[i] += delta * speed * 0.5;
        const angle = portalParticleAngles[i];
        const radius = 12.0 + (i % 5) * 0.7;
        pPositions[i * 3] = Math.cos(angle) * radius;
        pPositions[i * 3 + 1] = Math.sin(angle) * radius;
      }
      portalParticleGeo.attributes.position.needsUpdate = true;

      // Update Rising Bubbles & Floating Water Balls
      bubbleMat.uniforms.uTime.value = t;
      dustMat.uniforms.uTime.value = t;
      ballMat.uniforms.uTime.value = t;

      // Pulse Portal Ring Backlight
      portalBackLight.intensity = 8.0 + Math.sin(t * 2.5) * 3.0;

      // Rotate Event Pin Marker Nodes and add gentle swaying to 3D Event Banners
      for (const pin of pinMarkers) {
        pin.rotation.y = t * 1.5;
        pin.rotation.z = Math.sin(t * 1.8) * 0.2;
      }

      for (let b = 0; b < bannerMeshes.length; b++) {
        const bMesh = bannerMeshes[b];
        const baseRot = eventNodes[b].bannerPos.rotY;
        bMesh.rotation.z = Math.sin(t * 1.2 + b) * 0.04;
        bMesh.rotation.y = baseRot + Math.cos(t * 0.8 + b) * 0.03;
      }

      // Animate Waving Sea Grass / Kelp Strands in Current
      for (const k of kelpInstances) {
        k.mesh.rotation.z = Math.sin(t * k.speed + k.phase) * 0.18;
        k.mesh.rotation.x = Math.cos(t * k.speed * 0.8 + k.phase) * 0.12;
      }

      // Animate Distant Fish Schools
      for (let i = 0; i < fishCount; i++) {
        fishSwarm.getMatrixAt(i, dummyObj.matrix);
        dummyObj.position.setFromMatrixPosition(dummyObj.matrix);
        const data = fishData[i];

        dummyObj.position.x += Math.sin(t * data.speed * 0.6 + data.phaseX) * 0.08;
        dummyObj.position.y = data.baseY + Math.sin(t * data.speed * 0.4 + data.phaseY) * 1.0;
        dummyObj.position.z += Math.cos(t * data.speed * 0.6 + data.phaseZ) * 0.08;

        const lookX = dummyObj.position.x + Math.sin(t * data.speed * 0.6 + data.phaseX) * 0.4;
        const lookZ = dummyObj.position.z + Math.cos(t * data.speed * 0.6 + data.phaseZ) * 0.4;
        dummyObj.lookAt(lookX, dummyObj.position.y, lookZ);

        dummyObj.scale.set(data.scale, data.scale, data.scale * 1.3);
        dummyObj.updateMatrix();
        fishSwarm.setMatrixAt(i, dummyObj.matrix);
      }
      fishSwarm.instanceMatrix.needsUpdate = true;

      // Natural Subtle Underwater Floating Buoyancy Effect
      const floatY = Math.sin(t * 0.4) * 0.35;
      const floatX = Math.cos(t * 0.3) * 0.25;
      const floatRotZ = Math.sin(t * 0.2) * 0.008;

      // Parallax Mouse/Touch Camera Drifting
      const parallaxEase = isMobile ? 0.03 : 0.05;
      const parallaxStrength = isMobile ? 0.8 : 1.6;
      mouse.x += (targetMouse.x - mouse.x) * parallaxEase;
      mouse.y += (targetMouse.y - mouse.y) * parallaxEase;

      camera.position.set(
        camState.x + mouse.x * parallaxStrength + floatX,
        camState.y + mouse.y * parallaxStrength + floatY,
        camState.z
      );
      camera.rotation.x = camState.rx + mouse.y * (isMobile ? 0.02 : 0.04);
      camera.rotation.y = camState.ry - mouse.x * (isMobile ? 0.02 : 0.04);
      camera.rotation.z = floatRotZ;

      renderer.render(scene, camera);

      // Active Event state determination based on camera Z position depth
      let currentActiveId = null;
      if (camState.z < -140) {
        let minZDist = Infinity;
        eventNodes.forEach((node) => {
          const zDist = Math.abs(camState.z - node.pos.z);
          if (zDist < minZDist) {
            minZDist = zDist;
            currentActiveId = node.id;
          }
        });
      }

      if (currentActiveId && currentActiveId !== activeEventRef.current) {
        activeEventRef.current = currentActiveId;
        setActiveEvent(currentActiveId);
      }

      // Render ONLY the active event 3D banner group, hide all inactive event banners
      eventNodes.forEach((node) => {
        const group = eventBannerGroups[node.id];
        if (group) {
          group.visible = (node.id === currentActiveId);
        }
      });


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
      window.removeEventListener("click", handlePortalClick);
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
      waterCeilingGeo.dispose();
      waterCeilingMat.dispose();
      iceberg.geometry.dispose();
      iceberg2.geometry.dispose();
      icePlateGeo.dispose();
      iceMaterial.dispose();
      for (const g of smallIceGeos) g.dispose();
      caveGeometry.dispose();
      caveMaterial.dispose();
      cliffWallMat.dispose();
      ruinStoneMat.dispose();
      ruinGlowMat.dispose();
      for (const s of stepGeos) s.dispose();
      portalRingGeo.dispose();
      keystoneGeo.dispose();
      portalDiscGeo.dispose();
      portalDiscMat.dispose();
      portalParticleGeo.dispose();
      portalParticleMat.dispose();
      flowFieldGeo.dispose();
      flowFieldMat.dispose();
      cliffRockMat.dispose();
      nodeGlowMat.dispose();
      bannerFrameMat.dispose();
      for (const c of cliffMeshes) c.geometry.dispose();
      for (const b of bannerMeshes) {
        b.geometry.dispose();
        if (b.material instanceof THREE.MeshStandardMaterial && b.material.map) {
          b.material.map.dispose();
          b.material.dispose();
        }
      }
      terrainGeo.dispose();
      terrainMat.dispose();
      bubbleGeo.dispose();
      bubbleMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      ballGeo.dispose();
      ballMat.dispose();
      kelpGeo.dispose();
      kelpMat.dispose();
      fishGeo.dispose();
      fishMat.dispose();
    };
  }, []);

  const hudVisible = scrollProgress > 15;
  const isInsideNewWorld = scrollProgress > 48;

  return (
    <div ref={wrapperRef} style={{ height: "1600vh", position: "relative", backgroundColor: "#000" }}>
      {/* Compass Loading Screen */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#020914] transition-opacity duration-1000 ${loading ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="relative w-48 h-48 md:w-64 md:h-64 mb-10">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(0,200,255,0.15)]" />
          <div className="absolute inset-2 rounded-full border border-cyan-400/20">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div key={deg} className="absolute w-full h-full" style={{ transform: `rotate(${deg}deg)` }}>
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 ${deg % 90 === 0 ? "w-0.5 h-4 bg-cyan-400" : "w-px h-2 bg-cyan-600/60"
                    }`}
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 font-mono text-[10px] md:text-xs font-bold tracking-widest text-cyan-300">
            <span className="absolute top-5 left-1/2 -translate-x-1/2 text-cyan-400 text-sm">N</span>
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-cyan-600">S</span>
            <span className="absolute top-1/2 right-5 -translate-y-1/2 text-cyan-600">E</span>
            <span className="absolute top-1/2 left-5 -translate-y-1/2 text-cyan-600">W</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center animate-[spin_3s_ease-in-out_infinite]">
            <div className="w-1 h-1/2 origin-bottom">
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[40px] md:border-b-[55px] border-l-transparent border-r-transparent border-b-cyan-400 mx-auto drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "rotate(180deg)" }}>
            <div className="w-1 h-1/2 origin-bottom animate-[spin_3s_ease-in-out_infinite]">
              <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[35px] md:border-b-[45px] border-l-transparent border-r-transparent border-b-red-500/70 mx-auto" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.8)]" />
          </div>
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="46%" fill="none" stroke="rgba(0,200,255,0.1)" strokeWidth="2" />
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              fill="none"
              stroke="rgba(0,200,255,0.6)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.88} 288`}
              className="transition-all duration-300 ease-out drop-shadow-[0_0_6px_rgba(0,255,255,0.5)]"
            />
          </svg>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-[0.3em] uppercase mb-4">
          NAVIGATING
        </h1>
        <p className="text-cyan-300/60 font-mono text-xs tracking-[0.4em] uppercase mb-6">
          Entering Deep Submerged Cavern
        </p>
        <p className="text-cyan-400 font-mono text-lg font-bold">{progress}%</p>
      </div>

      {/* 3D Canvas Container */}
      <div ref={containerRef} style={{ position: "sticky", top: 0, width: "100vw", height: "100vh", overflow: "hidden" }}>
        <div className="pointer-events-none fixed inset-0 z-50 border-[2px] border-cyan-500/20 opacity-90" />

        {/* Hovered Event Tooltip in 3D View */}
        {hoveredNode && (
          <div className="pointer-events-none fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-black/80 border border-cyan-400/80 px-6 py-2 rounded-full backdrop-blur-md shadow-[0_0_25px_rgba(0,255,255,0.4)] animate-pulse">
            <span className="font-mono text-xs md:text-sm font-bold text-cyan-300 tracking-widest uppercase">
              CLICK TO ENTER PORTAL // {hoveredNode}
            </span>
          </div>
        )}



        {/* Surface Semaphore 2K26 Hero UI */}
        <div
          className={`pointer-events-none fixed inset-0 z-40 flex flex-col justify-between p-6 md:p-12 text-white transition-opacity duration-700 ${!hudVisible ? "opacity-100" : "opacity-0"
            }`}
        >
          <header className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-cyan-400/80 flex items-center justify-center bg-cyan-950/40 backdrop-blur-md shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                <div className="w-3 h-3 rounded-full border border-cyan-300 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-white">SEMAPHORE</span>
                <span className="font-mono text-[9px] tracking-[0.3em] text-cyan-300/70">FOUNDATION</span>
              </div>
            </div>
            {/* <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-[0.25em] text-cyan-100/80">
              <span className="hover:text-cyan-300 cursor-pointer transition-colors">JOURNEYS</span>
              <span className="hover:text-cyan-300 cursor-pointer transition-colors">ABOUT</span>
              <span className="hover:text-cyan-300 cursor-pointer transition-colors">GET INVOLVED</span>
              <span className="hover:text-cyan-300 cursor-pointer transition-colors">EDUCATION</span>
              <span className="hover:text-cyan-300 cursor-pointer transition-colors">SHARE +</span>
              <span className="text-cyan-400 font-bold">EN v</span>
            </nav> */}
          </header>

          <main className="flex flex-col items-center justify-center text-center my-auto">
            <h2 className="font-mono text-4xl md:text-8xl font-extrabold tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] select-none">
              SEMAPHORE
            </h2>
            <h1 className="font-mono text-6xl md:text-9xl font-black tracking-[0.25em] text-white drop-shadow-[0_0_40px_rgba(0,200,255,0.6)] my-2 select-none">
              2 K 2 6
            </h1>
            <span className="font-mono text-xs md:text-sm tracking-[0.35em] text-cyan-200 uppercase font-bold">
              NATIONAL LEVEL IT & CULTURAL FEST
            </span>
          </main>

          <footer className="flex justify-between items-end w-full">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border border-cyan-400/40 flex items-center justify-center bg-cyan-950/30 backdrop-blur-md">
                <div className="w-0.5 h-6 bg-cyan-400 origin-bottom transform -rotate-45" />
              </div>
              <div className="flex flex-col font-mono text-[10px] md:text-xs">
                <span className="font-bold text-cyan-300 tracking-[0.2em]">DEEP TRENCH</span>
                <span className="text-cyan-100/70 tracking-widest">DISCOVERY PROGRESS: {scrollProgress}%</span>
                <span className="text-cyan-400/60 text-[9px] tracking-wider mt-0.5">DEPTH: {stats.depth}M | TEMP: 28.0°C</span>
              </div>
            </div>

            <div className="hidden lg:flex flex-col text-right font-mono text-[9px] text-cyan-200/60 tracking-widest leading-relaxed">
              <span>9-10 OCTOBER 2026</span>
              <span>NMAM INSTITUTE OF TECHNOLOGY</span>
              <span>ALL RIGHTS RESERVED</span>
            </div>
          </footer>
        </div>

        {/* Main Cyber Ocean HUD Overlay */}
        <div className={`ui-layer ${hudVisible ? "visible" : ""}`} id="ui-layer">
          <div className="grid-overlay" />
          <div className="vignette" />
          <div className="hud-frame" />

          <div className="corner tl" />
          <div className="corner tr" />
          <div className="corner bl" />
          <div className="corner br" />

          {/* Top Bar */}
          <div className="top-bar">
            <div className="logo">{isInsideNewWorld ? "NEW WORLD // DESCENDING EVENTS REALM" : "CYBER OCEAN"}</div>
          </div>

          {/* Animated Scroll Down Mouse Logo (Visible only at beginning surface view, scrollProgress < 10) */}
          <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none transition-all duration-500 font-mono select-none ${scrollProgress < 10 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
          >
            <div className="relative w-6 h-10 rounded-full border-2 border-cyan-400/80 shadow-[0_0_15px_rgba(0,255,255,0.4)] flex justify-center pt-2 bg-[#010c18]/60 backdrop-blur-sm">
              <div className="w-1.5 h-3 rounded-full bg-cyan-300 animate-bounce shadow-[0_0_8px_rgba(0,255,255,0.9)]" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold tracking-[0.25em] text-cyan-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] uppercase">
              <span>SCROLL TO DIVE</span>
              <span className="text-cyan-400 text-xs animate-bounce">↓</span>
            </div>
          </div>

          {/* Right-Side Down Telemetry HUD Readout (Clean Panel-less design) */}
          <div className="fixed bottom-20 right-6 md:right-10 z-50 flex flex-col items-end gap-1.5 font-mono text-right select-none pointer-events-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">

            <div className="flex items-baseline gap-2 text-cyan-100 font-bold text-sm tracking-wider">
              <span className="text-[10px] text-cyan-400/70 font-semibold uppercase">DEPTH:</span>
              <span className="text-cyan-300 font-extrabold text-base">{stats.depth}</span>
              <span className="text-[10px] text-cyan-400/80">M</span>
            </div>

            <div className="flex items-baseline gap-2 text-cyan-100 font-bold text-sm tracking-wider">
              <span className="text-[10px] text-cyan-400/70 font-semibold uppercase">SPEED:</span>
              <span className="text-cyan-300 font-extrabold text-base">{stats.speed}</span>
              <span className="text-[10px] text-cyan-400/80">M/S</span>
            </div>
          </div>

        </div>
      </div>

      {/* Minimal Top-Right Speaker Audio Toggle Icon (Panel-less bare icon design) */}
      <button
        onClick={toggleAudio}
        className={`fixed top-6 right-6 md:top-8 md:right-10 z-[80] p-1 text-cyan-300 hover:text-white transition-all duration-500 cursor-pointer pointer-events-auto hover:scale-110 active:scale-95 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)] ${
          scrollProgress >= 4 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        aria-label="Toggle Audio"
        title={isAudioPlaying ? "Mute Audio" : "Play Audio"}
      >
        {isAudioPlaying ? (
          <svg className="w-6 h-6 fill-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 fill-cyan-400/50 hover:fill-cyan-300" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        )}
      </button>

      {/* Interactive Event Detail Modal when clicking on any Event Portal, Pin, or 3D Banner */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
          <div className="relative w-full max-w-xl p-8 rounded-3xl bg-[#021020] border-2 border-cyan-400/80 shadow-[0_0_60px_rgba(0,255,255,0.4)] text-white">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-6 right-6 font-mono text-cyan-400 text-sm font-bold hover:text-white"
            >
              [ CLOSE ✕ ]
            </button>

            <span className="inline-block px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-wider mb-4">
              EVENT {selectedEvent.num} // {selectedEvent.category}
            </span>

            <h3 className="text-3xl font-black font-mono text-white mb-2">{selectedEvent.name}</h3>
            <p className="text-cyan-200/80 text-sm mb-6 leading-relaxed">{selectedEvent.desc}</p>

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/20 font-mono text-xs">
              <div>
                <span className="text-cyan-400/60 block">DATE & TIME</span>
                <span className="text-cyan-200 font-bold">{selectedEvent.date} @ {selectedEvent.time}</span>
              </div>
              <div>
                <span className="text-cyan-400/60 block">VENUE</span>
                <span className="text-cyan-200 font-bold">{selectedEvent.venue}</span>
              </div>
              <div>
                <span className="text-cyan-400/60 block">PRIZE POOL</span>
                <span className="text-cyan-300 font-bold text-sm">{selectedEvent.prize}</span>
              </div>
            </div>

            <h4 className="font-mono text-xs font-bold text-cyan-400 tracking-wider mb-2">EVENT GUIDELINES:</h4>
            <ul className="list-disc list-inside text-xs text-cyan-100/70 space-y-1 mb-8">
              {selectedEvent.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>

            <button
              onClick={() => {
                alert(`Registration for EVENT ${selectedEvent.num}: ${selectedEvent.name} will open soon!`);
                setSelectedEvent(null);
              }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-mono font-bold text-black text-sm tracking-[0.2em] shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:brightness-110 transition-all"
            >
              REGISTER FOR EVENT {selectedEvent.num}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
