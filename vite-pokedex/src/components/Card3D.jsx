import React, { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, Text3D } from "@react-three/drei";
import backsideImg from "../assets/pokemon_card_backside.png";
import "./Card3D.css";

/**
 * Mapa de color por tipo principal.
 */
const TYPE_COLORS = {
  normal: ["#ECECEC", "#CFCFCF"],
  fighting: ["#A75543", "#8B3F36"],
  flying: ["#78A2FF", "#4F86FF"],
  poison: ["#A95CA0", "#8B458F"],
  ground: ["#EECC55", "#D4B24A"],
  rock: ["#CCBD72", "#B29E5F"],
  bug: ["#C2D21E", "#9FB712"],
  ghost: ["#7975D7", "#5F56C0"],
  steel: ["#C4C2DB", "#AFAFCF"],
  fire: ["#FA5643", "#D93B22"],
  water: ["#56ADFF", "#2E90FF"],
  grass: ["#8CD750", "#6FB036"],
  electric: ["#FDE139", "#F6D017"],
  psychic: ["#FA65B4", "#E5529E"],
  ice: ["#96F1FF", "#5FD1E6"],
  dragon: ["#8673FF", "#6B4FF0"],
  dark: ["#8D6855", "#6f4f3d"],
  fairy: ["#F9AEFF", "#E28FE0"],
};

const RIGHT_SCREEN_BLUE = "#43B0F2";

/**
 * Crea y devuelve un canvas que dibuja
 */
function createCardCanvas(
  image = null,
  colorBase = null,
  width = 512,
  height = 768
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const topColor = (colorBase && colorBase[0]) || "#fff9f0";
  const bottomColor = (colorBase && colorBase[1]) || "#ffdfe0";
  const g = ctx.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, topColor);
  g.addColorStop(1, bottomColor);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);

  const cx = width / 2;
  const cy = 260;
  const r = 120;
  if (!image) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 0);
    ctx.fillStyle = "#E71D23";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 36, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#000";
    ctx.stroke();
  } else {
    // dibujar el sprite centrado
    const maxSpriteW = width * 0.8;
    const maxSpriteH = height * 0.55;
    let iw = image.width || maxSpriteW;
    let ih = image.height || maxSpriteH;
    const ratio = Math.min(maxSpriteW / iw, maxSpriteH / ih, 1);
    iw = iw * ratio;
    ih = ih * ratio;
    const ix = (width - iw) / 2;
    const iy = cy - ih / 2 - 10;
    ctx.drawImage(image, ix, iy, iw, ih);
  }

  return canvas;
}

function TypeEmblem({ type, position = [-0.35, 0.6, 0.02] }) {
  // Common sizes (tweak as needed)
  const color = (() => {
    switch (type) {
      case "fire":
        return "#FF8A33";
      case "water":
        return "#2EA6FF";
      case "grass":
        return "#4CC24A";
      case "electric":
        return "#FFD23F";
      case "ice":
        return "#AEEBFF";
      default:
        return "#ffffff";
    }
  })();

  switch ((type || "").toLowerCase()) {
    case "fire":
      return (
        <mesh position={position} rotation={[Math.PI * 1.1, 0.3, 0]}>
          <coneGeometry args={[0.18, 0.36, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={"#FF6A00"}
            emissiveIntensity={0.25}
            metalness={0.1}
            roughness={0.45}
          />
        </mesh>
      );

    case "water":
      return (
        <mesh position={position} rotation={[0, 0.2, 0]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color={color}
            metalness={0.2}
            roughness={0.2}
            transparent
            opacity={0.95}
          />
          <mesh scale={[1.0, 1.4, 0.8]} />
        </mesh>
      );

    case "grass":
      return (
        <mesh position={position} rotation={[-0.6, 0, -0.35]}>
          <planeGeometry args={[0.48, 0.26, 1, 1]} />
          <meshStandardMaterial
            color={color}
            metalness={0.05}
            roughness={0.5}
          />
        </mesh>
      );

    case "electric":
      return (
        <mesh position={position} rotation={[0, 0, 0.0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.36, 3]} />
          <meshStandardMaterial
            color={color}
            emissive={"#FFD23F"}
            emissiveIntensity={0.35}
            metalness={0.15}
            roughness={0.35}
          />
        </mesh>
      );

    case "ice":
      return (
        <mesh position={position} rotation={[0.4, 0.2, 0]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color={color}
            metalness={0.05}
            roughness={0.05}
            transparent
            opacity={0.95}
          />
        </mesh>
      );

    default:
      return null;
  }
}

/**
 * CardMesh: construye la carta y el texto 3D centrado.
 */
function CardMesh({
  pokemon,
  useRightBlueBackground = false,
  rotationSpeed = 0.25,
}) {
  const cardWidth = 1.4;
  const cardHeight = 1.9;
  const cardDepth = 0.03;

  const primaryType = pokemon?.types?.[0]?.type?.name || null;
  const colorBase = primaryType ? TYPE_COLORS[primaryType] : null;

  const spriteUrl = pokemon?.sprites?.front_default || null;

  const spriteTextures = useLoader(
    THREE.TextureLoader,
    spriteUrl ? [spriteUrl] : []
  );
  const spriteTexture =
    Array.isArray(spriteTextures) && spriteTextures.length
      ? spriteTextures[0]
      : null;
  const spriteImage = spriteTexture?.image || null;

  const backsideTextures = useLoader(
    THREE.TextureLoader,
    backsideImg ? [backsideImg] : []
  );
  const backsideTexture =
    Array.isArray(backsideTextures) && backsideTextures.length
      ? backsideTextures[0]
      : null;
  if (backsideTexture) backsideTexture.encoding = THREE.sRGBEncoding;

  const canvasColorBase = useRightBlueBackground
    ? [RIGHT_SCREEN_BLUE, RIGHT_SCREEN_BLUE]
    : colorBase;

  const canvasTexture = useMemo(() => {
    const canvas = createCardCanvas(spriteImage, canvasColorBase, 512, 768);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    tex.encoding = THREE.sRGBEncoding;
    return { tex, canvas };
  }, [spriteImage, primaryType, useRightBlueBackground]);

  useEffect(() => {
    return () => {
      if (canvasTexture && canvasTexture.tex && canvasTexture.tex.dispose) {
        try {
          canvasTexture.tex.dispose();
        } catch (e) {}
      }
    };
  }, [canvasTexture]);

  // Ajustes de texto 3D
  const textSize = 0.12;
  const textHeight = 0.02;
  const textY = -cardHeight / 2 + 0.22;
  const textZ = cardDepth / 2 + 0.0025;

  const textRef = useRef();

  useEffect(() => {
    const mesh = textRef.current;
    if (!mesh) return;
    const geom = mesh.geometry;
    if (!geom) return;
    if (typeof geom.center === "function") {
      geom.center();
    } else {
      geom.computeBoundingBox && geom.computeBoundingBox();
      const bbox = geom.boundingBox;
      if (bbox) {
        const w = bbox.max.x - bbox.min.x;
        const h = bbox.max.y - bbox.min.y;
        const offsetX = -(bbox.min.x + w / 2);
        const offsetY = -(bbox.min.y + h / 2);
        geom.translate(offsetX, offsetY, 0);
      }
    }
    mesh.renderOrder = 1;
  }, [pokemon?.name]);

  const emblemX = -cardWidth / 2 + 0.28;
  const emblemY = cardHeight / 2 - 0.36;
  const emblemZ = cardDepth / 2 + 0.01;

  const groupRef = useRef();

  // Rotacion animada
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * rotationSpeed;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.25) * 0.02;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
        <meshStandardMaterial
          color={0xc62828}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      <mesh position={[0, 0, cardDepth / 2 + 0.001]}>
        <planeGeometry args={[cardWidth - 0.02, cardHeight - 0.02]} />
        <meshStandardMaterial map={canvasTexture.tex} />
      </mesh>

      {primaryType && (
        <group position={[emblemX, emblemY, emblemZ]}>
          <TypeEmblem type={primaryType} position={[0, 0, 0]} />
        </group>
      )}

      {backsideTexture && (
        <mesh
          position={[0, 0, -(cardDepth / 2 + 0.001)]}
          rotation={[0, Math.PI, 0]}
        >
          <planeGeometry args={[cardWidth - 0.02, cardHeight - 0.02]} />
          <meshStandardMaterial map={backsideTexture} />
        </mesh>
      )}

      <group position={[0, textY, textZ]}>
        <Text3D
          ref={textRef}
          font={
            "https://unpkg.com/three@0.152.2/examples/fonts/helvetiker_regular.typeface.json"
          }
          size={textSize}
          height={textHeight}
          curveSegments={8}
          bevelEnabled={false}
        >
          {(pokemon?.name || "POKÉMON").toUpperCase()}
          <meshStandardMaterial
            color={"#222222"}
            metalness={0.1}
            roughness={0.4}
          />
        </Text3D>
      </group>
    </group>
  );
}

/**
 * Componente principal Card3D
 */
export default function Card3D({
  pokemon = null,
  useRightBlueBackground = true,
  rotationSpeed = 0.8,
}) {
  const sceneBg = RIGHT_SCREEN_BLUE;

  return (
    <div className="card3d-container">
      <Canvas camera={{ position: [0, 0.4, 2.6], fov: 45 }}>
        <color attach="background" args={[sceneBg]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <Suspense fallback={null}>
          <CardMesh
            pokemon={pokemon}
            useRightBlueBackground={useRightBlueBackground}
            rotationSpeed={rotationSpeed}
          />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>
    </div>
  );
}
