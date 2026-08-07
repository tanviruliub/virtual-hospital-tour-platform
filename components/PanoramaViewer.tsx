"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HospitalZone, Hotspot, HOSPITAL_ZONES } from "@/lib/hospitalData";
import { Compass, ZoomIn, ZoomOut, RotateCcw, Info, ArrowUpRight, Sparkles, Volume2, VolumeX } from "lucide-react";

interface PanoramaViewerProps {
  zone: HospitalZone;
  language: "en" | "bn";
  onSelectHotspot: (hotspot: Hotspot) => void;
  onNavigateZone: (zoneId: string) => void;
  isHighContrast?: boolean;
}

interface HotspotScreenPos {
  id: string;
  visible: boolean;
  x: number;
  y: number;
}

export default function PanoramaViewer({
  zone,
  language,
  onSelectHotspot,
  onNavigateZone,
  isHighContrast = false,
}: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);

  // Interaction State
  const isUserInteracting = useRef(false);
  const onPointerDownPointerX = useRef(0);
  const onPointerDownPointerY = useRef(0);
  const onPointerDownLon = useRef(0);
  const onPointerDownLat = useRef(0);
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const fovRef = useRef(75);

  const [lonState, setLonState] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [loadingTexture, setLoadingTexture] = useState(true);
  const [hotspotPositions, setHotspotPositions] = useState<Record<string, HotspotScreenPos>>({});

  // Initialize Three.js Scene & Animation Loop
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(fovRef.current, width / height, 1, 1100);
    cameraRef.current = camera;
    const targetVector = new THREE.Vector3(0, 0, 0);

    // Geometry (Sphere mapped inside)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // invert sphere so texture faces inside

    // Texture Loader
    setLoadingTexture(true);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      zone.panoramaUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial({ map: texture });
        if (sphereMeshRef.current) {
          scene.remove(sphereMeshRef.current);
        }
        const mesh = new THREE.Mesh(geometry, material);
        sphereMeshRef.current = mesh;
        scene.add(mesh);
        setLoadingTexture(false);
      },
      undefined,
      (err) => {
        console.error("Error loading panorama texture:", err);
        const material = new THREE.MeshBasicMaterial({ color: 0x1e293b, wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);
        sphereMeshRef.current = mesh;
        scene.add(mesh);
        setLoadingTexture(false);
      }
    );

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      latRef.current = Math.max(-85, Math.min(85, latRef.current));

      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      if (cameraRef.current) {
        targetVector.x = 500 * Math.sin(phi) * Math.cos(theta);
        targetVector.y = 500 * Math.cos(phi);
        targetVector.z = 500 * Math.sin(phi) * Math.sin(theta);

        cameraRef.current.lookAt(targetVector);
        cameraRef.current.fov = fovRef.current;
        cameraRef.current.updateProjectionMatrix();

        renderer.render(scene, cameraRef.current);

        // Update Hotspot Positions in state
        if (containerRef.current && zone.hotspots.length > 0) {
          const newPosMap: Record<string, HotspotScreenPos> = {};
          const cWidth = containerRef.current.clientWidth;
          const cHeight = containerRef.current.clientHeight;

          zone.hotspots.forEach((hotspot) => {
            const hPhi = THREE.MathUtils.degToRad(90 - hotspot.pitchDeg);
            const hTheta = THREE.MathUtils.degToRad(hotspot.yawDeg);

            const targetVec = new THREE.Vector3(
              500 * Math.sin(hPhi) * Math.cos(hTheta),
              500 * Math.cos(hPhi),
              500 * Math.sin(hPhi) * Math.sin(hTheta)
            );

            const projected = targetVec.clone().project(camera);
            const isBehind = projected.z > 1;

            const px = ((projected.x + 1) * cWidth) / 2;
            const py = ((-projected.y + 1) * cHeight) / 2;

            newPosMap[hotspot.id] = {
              id: hotspot.id,
              visible: !isBehind && projected.x >= -1.1 && projected.x <= 1.1 && projected.y >= -1.1 && projected.y <= 1.1,
              x: px,
              y: py,
            };
          });

          setHotspotPositions(newPosMap);
        }
      }
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [zone]);

  // Handle Drag & Pointer Navigation
  const handlePointerDown = (e: React.PointerEvent) => {
    isUserInteracting.current = true;
    onPointerDownPointerX.current = e.clientX;
    onPointerDownPointerY.current = e.clientY;
    onPointerDownLon.current = lonRef.current;
    onPointerDownLat.current = latRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isUserInteracting.current) return;
    lonRef.current = (onPointerDownPointerX.current - e.clientX) * 0.15 + onPointerDownLon.current;
    latRef.current = (e.clientY - onPointerDownPointerY.current) * 0.15 + onPointerDownLat.current;

    setLonState(Math.round(lonRef.current % 360));
  };

  const handlePointerUp = () => {
    isUserInteracting.current = false;
  };

  const handleZoom = (delta: number) => {
    fovRef.current = Math.max(35, Math.min(90, fovRef.current + delta));
  };

  const resetCamera = () => {
    lonRef.current = 0;
    latRef.current = 0;
    fovRef.current = 75;
    setLonState(0);
  };

  // Audio Narration TTS
  const toggleAudioNarration = () => {
    if (isAudioPlaying) {
      window.speechSynthesis?.cancel();
      setIsAudioPlaying(false);
    } else {
      const textToSpeak = language === "bn" ? zone.audioNarrationBn : zone.audioNarrationEn;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.lang = language === "bn" ? "bn-BD" : "en-US";

      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);

      window.speechSynthesis?.cancel();
      window.speechSynthesis?.speak(utterance);
      setIsAudioPlaying(true);
    }
  };

  // Connected zones helper
  const connectedZoneObjects = zone.connectedZones
    .map((id) => HOSPITAL_ZONES.find((z) => z.id === id))
    .filter(Boolean) as HospitalZone[];

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[520px] md:h-[620px] rounded-2xl overflow-hidden select-none shadow-md border transition-all ${
        isHighContrast
          ? "border-yellow-400 bg-black text-white"
          : "border-slate-200 bg-slate-900 text-slate-900"
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing block" />

      {/* Loading Overlay */}
      {loadingTexture && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center z-30 text-blue-400 gap-3">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm font-medium tracking-wide text-white">
            {language === "bn" ? "৩৬০° ভিউ লোড হচ্ছে..." : "Loading 360° Panorama Environment..."}
          </p>
        </div>
      )}

      {/* Top Floating Zone Header Banner */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 z-20 pointer-events-none">
        <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md border border-slate-200/90 px-4 py-2.5 rounded-2xl shadow-xl pointer-events-auto">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {zone.floorLevel}F
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
              {language === "bn" ? zone.nameBn : zone.name}
            </h2>
            <p className="text-xs text-blue-600 font-semibold">
              {zone.floor} • 360° Interactive Tour
            </p>
          </div>
        </div>

        {/* Audio Narration Button */}
        <button
          onClick={toggleAudioNarration}
          className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-xl transition-all ${
            isAudioPlaying
              ? "bg-amber-500 text-slate-950 animate-pulse"
              : "bg-white/95 backdrop-blur-md text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          {isAudioPlaying ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>{language === "bn" ? "অডিও থামান" : "Stop Voice Guide"}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>{language === "bn" ? "ভয়েস গাইড শুনুন" : "Listen Voice Guide"}</span>
            </>
          )}
        </button>
      </div>

      {/* Render 3D Hotspot Markers over Canvas */}
      {zone.hotspots.map((hotspot) => {
        const screenPos = hotspotPositions[hotspot.id];
        if (!screenPos || !screenPos.visible) return null;

        return (
          <div
            key={hotspot.id}
            style={{
              left: `${screenPos.x}px`,
              top: `${screenPos.y}px`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              onSelectHotspot(hotspot);
            }}
          >
            {/* Glowing Ring */}
            <div className="relative flex items-center justify-center">
              <span className="absolute w-10 h-10 rounded-full bg-blue-500/40 animate-ping" />
              <div className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 border-2 border-white text-white shadow-xl flex items-center justify-center transition-transform transform group-hover:scale-125">
                <Info className="w-4 h-4" />
              </div>
            </div>

            {/* Label Tooltip */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl border border-slate-700 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === "bn" ? hotspot.titleBn : hotspot.title}</span>
            </div>
          </div>
        );
      })}

      {/* Connected Zone Quick Navigators (Arrows on sides) */}
      <div className="absolute bottom-16 left-4 right-4 flex flex-wrap items-center justify-center gap-2 z-20 pointer-events-none">
        {connectedZoneObjects.map((connZone) => (
          <button
            key={connZone.id}
            onClick={(e) => {
              e.stopPropagation();
              onNavigateZone(connZone.id);
            }}
            className="pointer-events-auto bg-white/95 hover:bg-blue-600 text-slate-800 hover:text-white border border-slate-200 hover:border-blue-600 backdrop-blur-md text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xl transition-all group transform hover:-translate-y-0.5"
          >
            <ArrowUpRight className="w-4 h-4 text-blue-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>
              {language === "bn" ? connZone.nameBn : connZone.name} ({connZone.floor})
            </span>
          </button>
        ))}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 z-20 pointer-events-none">
        {/* Orientation & Angle Info */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 pointer-events-auto shadow-xl">
          <Compass className="w-4 h-4 text-blue-600" />
          <span>
            {language === "bn" ? "কোণ" : "Yaw"}: {lonState}°
          </span>
        </div>

        {/* View Controls: Zoom, Reset */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200 p-1.5 rounded-xl pointer-events-auto shadow-xl">
          <button
            onClick={() => handleZoom(-10)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(10)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetCamera}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
