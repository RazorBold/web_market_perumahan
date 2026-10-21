'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { Sun, Moon, Eye, Layers, RotateCcw, ChevronDown, ChevronUp, Sparkles, MapPin, Maximize2, Box } from 'lucide-react';

interface ThreeHouseViewerProps {
  modelName?: string;
  /** .glb of the real building (see public/models). Without it a simplified procedural house is shown. */
  modelUrl?: string;
  className?: string;
  autoRotateSpeed?: number;
}

interface Hotspot {
  id: string;
  short: string;
  name: string;
  desc: string;
  pos: THREE.Vector3;
  /** Scene units the pin rises at 100% exploded view, so it stays on its floor */
  lift: number;
}

interface CameraPreset {
  id: string;
  label: string;
  position: THREE.Vector3;
  target: THREE.Vector3;
}

interface ExplodeLayer {
  object: THREE.Object3D;
  baseY: number;
  lift: number;
}

const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

const PROCEDURAL_HOTSPOTS: Hotspot[] = [
  { id: 'living', short: 'Living', name: 'Living Room & Inner Courtyard', pos: v3(0, 1.2, 0), lift: 0, desc: 'Ceiling 4.2m dengan bukaan kaca penuh ke taman dalam.' },
  { id: 'master', short: 'Master', name: 'Master Bedroom Suite', pos: v3(0.5, 3.2, 0.5), lift: 1.8, desc: 'Kamar tidur utama dengan en-suite bathroom & balkon privat.' },
  { id: 'carport', short: 'Carport', name: 'Double Carport Canopy', pos: v3(-2.2, 0.8, 2.0), lift: 0, desc: 'Kapasitas 2 mobil dengan lantai batu sikat alam.' },
  { id: 'roof', short: 'Atap', name: 'Atap Joglo Eco-Thermal', pos: v3(0, 4.6, 0), lift: 3.6, desc: 'Insulasi penahan panas dan saluran air hujan terintegrasi.' },
];

const PROCEDURAL_PRESETS: CameraPreset[] = [
  { id: 'isometric', label: 'Isometric', position: v3(9, 6, 11), target: v3(0, 1.8, 0) },
  { id: 'front', label: 'Fasad Depan', position: v3(0.5, 3.2, 11), target: v3(0, 1.8, 0) },
  { id: 'balcony', label: 'Balkon', position: v3(3, 4, 4), target: v3(0.5, 3.1, 0.5) },
  { id: 'top', label: 'Denah Atas', position: v3(0.1, 14, 0.1), target: v3(0, 0, 0) },
];

/** A loaded .glb is scaled so its longest horizontal side spans this many scene units */
const GLB_FOOTPRINT = 13;

/**
 * Exploded view for the .glb, by node name. Lifts are in model meters and relative to the parent node:
 * everything above the ground-floor ceiling rises first, then the upper-floor ceiling rises further.
 */
const GLB_EXPLODE_GROUPS = [
  {
    lift: 4.5,
    nodes: [
      'upper_floor',
      'furniture_upper',
      'ground_floor_ceiling',
      'ground_floor_downlights',
      'ground_floor_roof_planter',
      'terrace_roof_slab',
      'terrace_roof_fascia',
      'terrace_soffit',
      'terrace_downlights',
      'terrace_ceiling_fan',
      'landscape_roof_plants',
    ],
  },
  {
    lift: 3.5,
    nodes: ['upper_floor_interior_ceiling', 'upper_floor_interior_lights', 'upper_floor_white_volume_cap', 'upper_floor_facade_lights'],
  },
];

/** Hotspots for the .glb, anchored to the bounding box of a named node */
const GLB_HOTSPOTS: (Omit<Hotspot, 'pos' | 'lift'> & { node: string; upperFloor: boolean })[] = [
  { id: 'living', short: 'Keluarga', name: 'Ruang Keluarga', node: 'furniture_ground_sofa', upperFloor: false, desc: 'Sofa modular di ruang keluarga, terbuka lewat dinding kaca ke teras dan taman.' },
  { id: 'kitchen', short: 'Dapur', name: 'Dapur', node: 'ground_floor_kitchen_joinery', upperFloor: false, desc: 'Kitchen set kayu hangat dengan meja batu alam.' },
  { id: 'terrace', short: 'Teras', name: 'Teras & Dapur Outdoor', node: 'terrace_deck_boards', upperFloor: false, desc: 'Dek kayu beratap dengan meja makan, dapur outdoor, dan pemanggang yang menyatu dengan taman.' },
  { id: 'master', short: 'Kamar Utama', name: 'Kamar Tidur Utama', node: 'furniture_upper_bed_linen', upperFloor: true, desc: 'Kamar di lantai atas dengan jendela lebar menghadap kanopi pepohonan.' },
];

/** Remounts the scene whenever the model file changes, so each model starts from a clean renderer */
export const ThreeHouseViewer: React.FC<ThreeHouseViewerProps> = (props) => (
  <ThreeHouseViewerScene key={props.modelUrl ?? 'procedural'} {...props} />
);

const ThreeHouseViewerScene: React.FC<ThreeHouseViewerProps> = ({
  modelName = 'Townhouse 115 - Modern Tropical Eco Villa',
  modelUrl,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('sunset');
  const [explodedRatio, setExplodedRatio] = useState<number>(0);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hotspots, setHotspots] = useState<Hotspot[]>(modelUrl ? [] : PROCEDURAL_HOTSPOTS);
  const [cameraPresets, setCameraPresets] = useState<CameraPreset[]>(PROCEDURAL_PRESETS);
  const [loadState, setLoadState] = useState<'loading' | 'ready'>(modelUrl ? 'loading' : 'ready');
  const [loadProgress, setLoadProgress] = useState(0);
  // Bumped once the scene content exists, so lighting / exploded effects re-apply to it
  const [modelVersion, setModelVersion] = useState(0);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const explodeLayersRef = useRef<ExplodeLayer[]>([]);
  const pinLayersRef = useRef<ExplodeLayer[]>([]);
  const glowMaterialsRef = useRef<{ material: THREE.MeshStandardMaterial; base: number }[]>([]);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const interiorLightsRef = useRef<THREE.PointLight[]>([]);
  const requestRenderRef = useRef<() => void>(() => {});


  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x131a15);
    scene.fog = new THREE.FogExp2(0x131a15, 0.025);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(9, 6, 11);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // don't go below ground
    controls.minDistance = 4;
    controls.maxDistance = 25;
    controls.target.set(0, 1.8, 0);

    // Studio Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting Setup
    const hemiLight = new THREE.HemisphereLight(0xfff3e0, 0x1b2820, 0.8);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const sunLight = new THREE.DirectionalLight(0xffecd2, 1.8);
    sunLight.position.set(12, 15, 8);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 40;
    const d = 10;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0xd4e2d4, 0.35);
    scene.add(ambientLight);

    // Interior warm lights
    const interiorLight1 = new THREE.PointLight(0xffaa44, 2.5, 6);
    interiorLight1.position.set(0, 1.2, 0);
    scene.add(interiorLight1);

    const interiorLight2 = new THREE.PointLight(0xffb866, 2.2, 6);
    interiorLight2.position.set(0.5, 3.0, 0.5);
    scene.add(interiorLight2);

    const carportLight = new THREE.PointLight(0xffcc88, 1.5, 5);
    carportLight.position.set(-2.2, 1.8, 1.8);
    scene.add(carportLight);

    interiorLightsRef.current = [interiorLight1, interiorLight2, carportLight];

    // ==================== PROCEDURAL MATERIALS ====================
    const woodMaterial = new THREE.MeshStandardMaterial({
      color: 0x5a3d28,
      roughness: 0.65,
      metalness: 0.1,
    });

    const teakSlatMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.5,
      metalness: 0.05,
    });

    const concreteWallMaterial = new THREE.MeshStandardMaterial({
      color: 0xded8ce,
      roughness: 0.85,
      metalness: 0.05,
    });

    const darkAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x222624,
      roughness: 0.4,
      metalness: 0.4,
    });

    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x595d58,
      roughness: 0.9,
      metalness: 0.1,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x88c2b5,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1,
      transmission: isSoftwareGl ? 0 : 0.85,
      ior: 1.5,
    });

    const roofTileMaterial = new THREE.MeshStandardMaterial({
      color: 0x3e3734,
      roughness: 0.75,
      metalness: 0.2,
    });

    const roofRidgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xa87342,
      roughness: 0.4,
      metalness: 0.6,
    });

    const lawnMaterial = new THREE.MeshStandardMaterial({
      color: 0x2e4a29,
      roughness: 0.95,
      metalness: 0.0,
    });

    const poolWaterMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f7a8c,
      roughness: 0.15,
      metalness: 0.2,
      transparent: true,
      opacity: 0.75,
    });

    // ==================== ENVIRONMENT BASE ====================
    // Main terrain plate
    const groundGeo = new THREE.CylinderGeometry(14, 15, 0.4, 48);
    const groundMesh = new THREE.Mesh(groundGeo, lawnMaterial);
    groundMesh.position.y = -0.2;
    groundMesh.receiveShadow = !isSoftwareGl;
    scene.add(groundMesh);

    // Simplified stand-in house, used when no .glb is given (or it fails to load)
    const buildProceduralHouse = () => {
      // Stone terrace pavers
      const terraceGeo = new THREE.BoxGeometry(9, 0.1, 9);
      const terraceMesh = new THREE.Mesh(terraceGeo, stoneMaterial);
      terraceMesh.position.set(0, 0.05, 0);
      terraceMesh.receiveShadow = !isSoftwareGl;
      scene.add(terraceMesh);

      // Reflecting pool / plunge pool at side
      const poolGeo = new THREE.BoxGeometry(2.4, 0.15, 4.2);
      const poolMesh = new THREE.Mesh(poolGeo, poolWaterMaterial);
      poolMesh.position.set(3.4, 0.08, -1.0);
      scene.add(poolMesh);

      const poolBorderGeo = new THREE.BoxGeometry(2.6, 0.2, 4.4);
      const poolBorder = new THREE.Mesh(poolBorderGeo, stoneMaterial);
      poolBorder.position.set(3.4, 0.04, -1.0);
      scene.add(poolBorder);

      // ==================== HIERARCHICAL HOUSE GROUPS ====================
      const floor1Group = new THREE.Group();
      const floor2Group = new THREE.Group();
      const roofGroup = new THREE.Group();

      scene.add(floor1Group);
      scene.add(floor2Group);
      scene.add(roofGroup);

      // ---------------- FLOOR 1 ----------------
      // Foundation plinth
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.2, 6.2), concreteWallMaterial);
      plinth.position.set(0, 0.1, 0);
      plinth.receiveShadow = true;
      floor1Group.add(plinth);

      // Living room main core (Level 1)
      const f1Core = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.0, 4.2), concreteWallMaterial);
      f1Core.position.set(0.3, 1.1, -0.6);
      f1Core.castShadow = true;
      f1Core.receiveShadow = true;
      floor1Group.add(f1Core);

      // Glass sliding facade on front
      const f1GlassFront = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.8, 0.08), glassMaterial);
      f1GlassFront.position.set(0.3, 1.1, 1.51);
      floor1Group.add(f1GlassFront);

      // Glass frames (Dark mullions)
      for (let i = -1.5; i <= 1.5; i += 1.0) {
        const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.8, 0.1), darkAccentMaterial);
        mullion.position.set(0.3 + i, 1.1, 1.52);
        floor1Group.add(mullion);
      }

      // Carport Column & Slab (Level 1)
      const carportPillar1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.2, 0.2), darkAccentMaterial);
      carportPillar1.position.set(-2.4, 1.1, 2.4);
      carportPillar1.castShadow = true;
      floor1Group.add(carportPillar1);

      const carportPillar2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.2, 0.2), darkAccentMaterial);
      carportPillar2.position.set(-2.4, 1.1, 0.2);
      carportPillar2.castShadow = true;
      floor1Group.add(carportPillar2);

      const carportRoof = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.15, 3.2), woodMaterial);
      carportRoof.position.set(-1.8, 2.2, 1.3);
      carportRoof.castShadow = true;
      floor1Group.add(carportRoof);

      // Carport Floor Paver
      const carportFloor = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.05, 3.0), stoneMaterial);
      carportFloor.position.set(-1.8, 0.08, 1.3);
      carportFloor.receiveShadow = true;
      floor1Group.add(carportFloor);

      // Minimalist Luxury Car in Carport
      const carBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.55, 2.2), darkAccentMaterial);
      carBody.position.set(-1.8, 0.45, 1.3);
      carBody.castShadow = true;
      floor1Group.add(carBody);

      const carCabin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 1.2), glassMaterial);
      carCabin.position.set(-1.8, 0.85, 1.1);
      floor1Group.add(carCabin);

      // Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.12, 16);
      wheelGeo.rotateZ(Math.PI / 2);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
      [
        [-2.45, 0.22, 0.6],
        [-1.15, 0.22, 0.6],
        [-2.45, 0.22, 2.0],
        [-1.15, 0.22, 2.0],
      ].forEach(([x, y, z]) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.position.set(x, y, z);
        floor1Group.add(wheel);
      });

      // ---------------- FLOOR 2 ----------------
      // Second floor cantilevered body
      const f2Core = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.0, 4.6), concreteWallMaterial);
      f2Core.position.set(0.1, 3.1, -0.4);
      f2Core.castShadow = true;
      f2Core.receiveShadow = true;
      floor2Group.add(f2Core);

      // Wood Slat Louvers (Javanese Modern Tropical screen)
      for (let j = -1.2; j <= 1.2; j += 0.25) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.8, 0.08), teakSlatMaterial);
        slat.position.set(2.45, 3.1, j);
        slat.castShadow = true;
        floor2Group.add(slat);
      }

      // Front Bedroom Window & Glass Balcony
      const f2Glass = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.6, 0.08), glassMaterial);
      f2Glass.position.set(0.6, 3.1, 1.91);
      floor2Group.add(f2Glass);

      // Balcony Railing
      const balconyGlass = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.7, 0.05), glassMaterial);
      balconyGlass.position.set(0.6, 2.45, 2.3);
      floor2Group.add(balconyGlass);

      const balconyRailTop = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.06, 0.08), darkAccentMaterial);
      balconyRailTop.position.set(0.6, 2.8, 2.3);
      floor2Group.add(balconyRailTop);

      // ---------------- ROOF (JOGLO INSPIRED CONTEMPORARY) ----------------
      // High-pitched traditional Joglo silhouette with contemporary clean angles
      const roofBaseGeo = new THREE.ConeGeometry(4.2, 1.8, 4);
      roofBaseGeo.rotateY(Math.PI / 4);
      const roofBase = new THREE.Mesh(roofBaseGeo, roofTileMaterial);
      roofBase.position.set(0.1, 5.0, -0.4);
      roofBase.scale.set(1.4, 0.8, 1.2);
      roofBase.castShadow = true;
      roofGroup.add(roofBase);

      // Roof Crest / Ridge Accent
      const roofRidge = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 0.25), roofRidgeMaterial);
      roofRidge.position.set(0.1, 5.75, -0.4);
      roofGroup.add(roofRidge);

      // Roof Overhang Eaves
      const eaveGeo = new THREE.BoxGeometry(6.4, 0.12, 5.8);
      const eaveMesh = new THREE.Mesh(eaveGeo, woodMaterial);
      eaveMesh.position.set(0.1, 4.15, -0.4);
      roofGroup.add(eaveMesh);

      // ==================== LANDSCAPE & TROPICAL VEGETATION ====================
      // Frangipani / Palm Trees around the property
      const createTree = (x: number, z: number, scale = 1.0) => {
        const treeGroup = new THREE.Group();
        treeGroup.position.set(x, 0, z);
        treeGroup.scale.set(scale, scale, scale);

        // Trunk
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 2.4, 8), trunkMat);
        trunk.position.y = 1.2;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        // Lush Tropical Canopy (stacked organic spheres)
        const leafMat = new THREE.MeshStandardMaterial({
          color: 0x245426,
          roughness: 0.8,
          flatShading: true,
        });

        const foliage1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 1), leafMat);
        foliage1.position.set(0, 2.6, 0);
        foliage1.castShadow = true;
        treeGroup.add(foliage1);

        const foliage2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 1), leafMat);
        foliage2.position.set(0.4, 3.1, 0.2);
        foliage2.castShadow = true;
        treeGroup.add(foliage2);

        const foliage3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8, 1), leafMat);
        foliage3.position.set(-0.3, 2.8, -0.3);
        foliage3.castShadow = true;
        treeGroup.add(foliage3);

        return treeGroup;
      };

      scene.add(createTree(4.2, 3.2, 1.1));
      scene.add(createTree(-3.8, -2.5, 1.3));
      scene.add(createTree(-4.2, 3.5, 0.85));
      scene.add(createTree(4.5, -3.2, 1.2));

      explodeLayersRef.current = [
        { object: floor2Group, baseY: 0, lift: 1.8 },
        { object: roofGroup, baseY: 0, lift: 3.6 },
      ];
    };

    // Hotspot pins draw on top of the building so they stay visible from any angle
    const pinGroup = new THREE.Group();
    scene.add(pinGroup);
    const pinMaterial = new THREE.MeshStandardMaterial({
      color: 0xc88242,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x442200,
      depthTest: false,
    });
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x222624, roughness: 0.4, metalness: 0.4, depthTest: false });

    const addHotspotPins = (list: Hotspot[]) => {
      pinLayersRef.current = list.map((hs) => {
        const pin = new THREE.Group();
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), pinMaterial);
        head.position.copy(hs.pos);
        head.name = hs.id;
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3), stemMaterial);
        stem.position.set(hs.pos.x, hs.pos.y - 0.2, hs.pos.z);
        head.renderOrder = stem.renderOrder = 10;
        pin.add(head, stem);
        pinGroup.add(pin);
        return { object: pin, baseY: 0, lift: hs.lift };
      });
    };

    const proceduralLights = [interiorLight1, interiorLight2, carportLight];
    if (modelUrl) {
      // The .glb carries its own emissive lamps; these point lights are placed for the stand-in house
      proceduralLights.forEach((light) => scene.remove(light));
      interiorLightsRef.current = [];
    } else {
      buildProceduralHouse();
      addHotspotPins(PROCEDURAL_HOTSPOTS);
    }

    // ==================== RENDER LOOP & PACING ====================
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const requestRender = () => {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        renderDirty = false;
        controls.update();
        renderer.render(scene, camera);
        const done = () => {
          renderBusy = false;
          if (renderDirty) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };
    requestRenderRef.current = requestRender;

    controls.addEventListener('change', requestRender);

    // Initial render
    requestRender();

    // ==================== REAL BUILDING (.glb) ====================
    let disposed = false;

    const showProceduralFallback = () => {
      proceduralLights.forEach((light) => scene.add(light));
      interiorLightsRef.current = proceduralLights;
      buildProceduralHouse();
      addHotspotPins(PROCEDURAL_HOTSPOTS);
      setHotspots(PROCEDURAL_HOTSPOTS);
      setCameraPresets(PROCEDURAL_PRESETS);
      setLoadState('ready');
      setModelVersion((n) => n + 1);
      requestRender();
    };

    if (modelUrl) {
      const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
      loader.load(
        modelUrl,
        (gltf) => {
          if (disposed) return;
          const root = gltf.scene;

          // Fit: scale to the scene footprint, centre on the origin, rest on the ground
          const rawSize = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
          const scale = GLB_FOOTPRINT / Math.max(rawSize.x, rawSize.z);
          root.scale.setScalar(scale);
          root.updateMatrixWorld(true);
          const scaledBox = new THREE.Box3().setFromObject(root);
          const center = scaledBox.getCenter(new THREE.Vector3());
          root.position.set(-center.x, -scaledBox.min.y, -center.z);
          root.updateMatrixWorld(true);

          const glow: { material: THREE.MeshStandardMaterial; base: number }[] = [];
          root.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            if (!mesh.isMesh) return;
            const material = mesh.material as THREE.MeshStandardMaterial;
            mesh.castShadow = !isSoftwareGl && !material.transparent;
            mesh.receiveShadow = !isSoftwareGl;
            if (material.name === 'warm_light' && !glow.some((g) => g.material === material)) {
              glow.push({ material, base: material.emissiveIntensity });
            }
          });
          glowMaterialsRef.current = glow;
          scene.add(root);

          explodeLayersRef.current = GLB_EXPLODE_GROUPS.flatMap(({ lift, nodes }) =>
            nodes
              .map((name) => root.getObjectByName(name))
              .filter((object): object is THREE.Object3D => Boolean(object))
              .map((object) => ({ object, baseY: object.position.y, lift }))
          );

          const boxOf = (name: string) => {
            const object = root.getObjectByName(name);
            return object ? new THREE.Box3().setFromObject(object) : null;
          };

          const upperFloorLift = GLB_EXPLODE_GROUPS[0].lift * scale;
          const spots: Hotspot[] = GLB_HOTSPOTS.flatMap(({ node, upperFloor, ...hotspot }) => {
            const box = boxOf(node);
            if (!box) return [];
            const c = box.getCenter(new THREE.Vector3());
            return [{ ...hotspot, pos: v3(c.x, box.max.y + 0.3, c.z), lift: upperFloor ? upperFloorLift : 0 }];
          });
          addHotspotPins(spots);
          setHotspots(spots);

          const fitted = new THREE.Box3().setFromObject(root);
          const midY = fitted.max.y * 0.4;
          const deck = boxOf('terrace_deck_boards')?.getCenter(new THREE.Vector3()) ?? v3(0, 0, 0);
          const presets: CameraPreset[] = [
            { id: 'isometric', label: 'Isometrik', position: v3(9, 6, 11), target: v3(0, midY, 0) },
            { id: 'front', label: 'Fasad Depan', position: v3(0, midY + 1.2, fitted.max.z + 8), target: v3(0, midY, 0) },
            { id: 'terrace', label: 'Teras', position: deck.clone().add(v3(3.2, 1.8, 4.2)), target: deck.clone().add(v3(0, 0.6, 0)) },
            // Straight down, front (+z) at the bottom of the screen
            { id: 'top', label: 'Denah Atas', position: v3(0, 22, 0.01), target: v3(0, 0, 0) },
          ];
          setCameraPresets(presets);
          camera.position.copy(presets[0].position);
          controls.target.copy(presets[0].target);
          controls.update();

          setLoadState('ready');
          setModelVersion((n) => n + 1);
          requestRender();
        },
        (event) => {
          if (event.total) setLoadProgress(Math.round((event.loaded / event.total) * 100));
        },
        (error) => {
          if (disposed) return;
          console.warn('Model 3D gagal dimuat, menampilkan model sederhana.', error);
          showProceduralFallback();
        }
      );
    }

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      // Free GPU memory: geometries, materials and textures of everything in the scene
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((material) => {
          Object.values(material).forEach((value) => {
            if (value instanceof THREE.Texture) value.dispose();
          });
          material.dispose();
        });
      });
      scene.environment?.dispose();
      renderer.dispose();
    };
    // The scene is built once per model; ThreeHouseViewer remounts this component when modelUrl changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Time of Day effect update
  useEffect(() => {
    if (!sceneRef.current || !sunLightRef.current || !hemiLightRef.current) return;
    const scene = sceneRef.current;
    const sun = sunLightRef.current;
    const hemi = hemiLightRef.current;

    if (timeOfDay === 'sunset') {
      scene.background = new THREE.Color(0x281e24);
      scene.fog = new THREE.FogExp2(0x281e24, 0.02);
      sun.color.setHex(0xffaa55);
      sun.intensity = 1.9;
      sun.position.set(14, 6, 8);
      hemi.color.setHex(0xffbb88);
      hemi.groundColor.setHex(0x221122);
      interiorLightsRef.current.forEach((l) => (l.intensity = 2.8));
    } else if (timeOfDay === 'day') {
      scene.background = new THREE.Color(0xbcd6e8);
      scene.fog = new THREE.FogExp2(0xbcd6e8, 0.018);
      sun.color.setHex(0xffffff);
      sun.intensity = 2.4;
      sun.position.set(10, 18, 10);
      hemi.color.setHex(0xeef6ff);
      hemi.groundColor.setHex(0x334433);
      interiorLightsRef.current.forEach((l) => (l.intensity = 1.2));
    } else {
      // Night
      scene.background = new THREE.Color(0x0c1310);
      scene.fog = new THREE.FogExp2(0x0c1310, 0.03);
      sun.color.setHex(0x6080aa);
      sun.intensity = 0.5;
      sun.position.set(-8, 12, -6);
      hemi.color.setHex(0x203040);
      hemi.groundColor.setHex(0x050a08);
      interiorLightsRef.current.forEach((l) => (l.intensity = 3.6));
    }

    // Dim the studio reflections at dusk and night so the warm lamps carry the scene
    scene.environmentIntensity = timeOfDay === 'day' ? 1 : timeOfDay === 'sunset' ? 0.75 : 0.2;

    // Lit windows and lamps of the .glb glow brighter as it gets darker
    const glowScale = timeOfDay === 'day' ? 0.35 : timeOfDay === 'sunset' ? 1 : 1.6;
    glowMaterialsRef.current.forEach(({ material, base }) => (material.emissiveIntensity = base * glowScale));

    requestRenderRef.current();
  }, [timeOfDay, modelVersion]);

  // Exploded view separation update
  useEffect(() => {
    [...explodeLayersRef.current, ...pinLayersRef.current].forEach(({ object, baseY, lift }) => {
      object.position.y = baseY + explodedRatio * lift;
    });
    requestRenderRef.current();
  }, [explodedRatio, modelVersion]);

  // Camera presets
  const setCameraView = (id: string) => {
    const preset = cameraPresets.find((p) => p.id === id);
    if (!preset || !cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.copy(preset.position);
    controlsRef.current.target.copy(preset.target);
    controlsRef.current.update();
    requestRenderRef.current();
  };

  const resetView = () => {
    setExplodedRatio(0);
    setTimeOfDay('sunset');
    setSelectedHotspot(null);
    setCameraView('isometric');
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-[#d6ccb8]/60 shadow-2xl bg-[#131a15] ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full h-[520px] md:h-[620px]'
      } ${className}`}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing three-canvas-container" />

      {loadState === 'loading' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#131a15] text-[#a2b3a3]" role="status">
          <Box className="w-8 h-8 text-[#d4a373] animate-pulse" />
          <span className="text-xs tracking-wide">Memuat model 3D {modelName}… {loadProgress}%</span>
          <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-[#d4a373] transition-[width] duration-200" style={{ width: `${loadProgress}%` }} />
          </div>
        </div>
      )}

      {/* Top Header Badge & Model Tag */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-[#1b261f]/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg text-white">
          <Sparkles className="w-4 h-4 text-[#d4a373] animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-[#e2d5c3]">
            3D Interactive Eco-Villa
          </span>
          <span className="text-xs text-white/40">|</span>
          <span className="text-xs text-white/80 hidden sm:inline">{modelName}</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-full bg-[#1b261f]/85 backdrop-blur-md text-white/80 hover:text-white hover:bg-[#25362b] border border-white/10 transition-all shadow-md"
            title={isFullscreen ? 'Keluar Fullscreen' : 'Fullscreen'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 rounded-full bg-[#1b261f]/85 backdrop-blur-md text-white/80 hover:text-white hover:bg-[#25362b] border border-white/10 transition-all shadow-md"
            title="Reset Sudut Pandang"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected Hotspot Card (Overlay) */}
      {selectedHotspot && (
        <div className="absolute top-16 left-4 max-w-xs bg-[#1a251e]/95 backdrop-blur-md p-4 rounded-2xl border border-[#d4a373]/40 shadow-2xl text-white animate-fade-in z-20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#d4a373] tracking-wide uppercase flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Highlight Ruang
            </span>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="text-xs text-white/50 hover:text-white px-1.5 py-0.5 rounded-full"
            >
              ✕
            </button>
          </div>
          {hotspots
            .filter((h) => h.id === selectedHotspot)
            .map((h) => (
              <div key={h.id}>
                <h4 className="font-semibold text-sm text-[#f8f5ee]">{h.name}</h4>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">{h.desc}</p>
              </div>
            ))}
        </div>
      )}

      {/* Ergonomic Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-3xl z-20 transition-all duration-300">
        {/* Toggle Collapse Button */}
        <div className="flex justify-center -mb-2">
          <button
            onClick={() => setIsControlsOpen(!isControlsOpen)}
            className="flex items-center gap-1.5 px-4 py-1 rounded-t-xl bg-[#1b261f]/90 text-xs font-medium text-[#d4a373] border-t border-x border-white/10 hover:text-white transition-colors backdrop-blur-md shadow-md"
          >
            {isControlsOpen ? (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Sembunyikan Kontrol
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Eksplor Kontrol 3D
              </>
            )}
          </button>
        </div>

        {isControlsOpen && (
          <div className="bg-[#18231c]/90 backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl shadow-2xl text-white space-y-3">
            {/* Top row: View presets & Lighting */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-white/50 flex items-center gap-1 font-medium mr-1">
                  <Eye className="w-3.5 h-3.5 text-[#d4a373]" /> Sudut:
                </span>
                {cameraPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setCameraView(preset.id)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/90 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Lighting / Ambience Modes */}
              <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setTimeOfDay('day')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                    timeOfDay === 'day' ? 'bg-[#d4a373] text-[#131a15] font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" /> Pagi
                </button>
                <button
                  onClick={() => setTimeOfDay('sunset')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                    timeOfDay === 'sunset' ? 'bg-[#d4a373] text-[#131a15] font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Senja
                </button>
                <button
                  onClick={() => setTimeOfDay('night')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                    timeOfDay === 'night' ? 'bg-[#d4a373] text-[#131a15] font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" /> Malam
                </button>
              </div>
            </div>

            {/* Bottom row: Exploded Floor Slider & Hotspots */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              {/* Exploded slider */}
              <div className="flex items-center gap-3 flex-1">
                <span className="text-white/70 flex items-center gap-1 whitespace-nowrap">
                  <Layers className="w-3.5 h-3.5 text-[#d4a373]" /> Pisah Lantai (Exploded):
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={explodedRatio}
                  onChange={(e) => setExplodedRatio(parseFloat(e.target.value))}
                  className="w-full accent-[#d4a373] h-1.5 bg-white/20 rounded-lg cursor-pointer"
                />
                <span className="font-mono text-white/50 w-8 text-right">
                  {Math.round(explodedRatio * 100)}%
                </span>
              </div>

              {/* Inspect Hotspots */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-white/50 whitespace-nowrap">Titik Ruang:</span>
                {hotspots.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      setSelectedHotspot(h.id);
                      if (cameraRef.current && controlsRef.current) {
                        controlsRef.current.target.copy(h.pos).add(v3(0, explodedRatio * h.lift, 0));
                        controlsRef.current.update();
                        requestRenderRef.current();
                      }
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                      selectedHotspot === h.id
                        ? 'bg-[#d4a373] text-black font-semibold'
                        : 'bg-white/5 hover:bg-white/15 text-white/80'
                    }`}
                  >
                    {h.short}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
