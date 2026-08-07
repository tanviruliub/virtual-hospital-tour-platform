"use client";

import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { MEDICAL_3D_CASES, MedicalCase } from "@/lib/hospitalData";
import { Layers, Activity, Rotate3d, Info, CheckCircle2, Sparkles, FileText, AlertTriangle } from "lucide-react";

interface Medical3DViewerProps {
  language: "en" | "bn";
}

export default function Medical3DViewer({ language }: Medical3DViewerProps) {
  const [selectedCase, setSelectedCase] = useState<MedicalCase>(MEDICAL_3D_CASES[0]);
  const [currentSlice, setCurrentSlice] = useState(selectedCase.annotatedSlice);
  const [showAnnotation, setShowAnnotation] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  // Initialize Three.js 3D Organ Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 300;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Procedural Mesh based on Organ Type
    let geometry: THREE.BufferGeometry;
    if (selectedCase.organModel === "heart") {
      geometry = new THREE.SphereGeometry(1.2, 32, 32);
    } else if (selectedCase.organModel === "knee") {
      geometry = new THREE.CylinderGeometry(0.8, 0.8, 2.2, 32);
    } else {
      geometry = new THREE.TorusKnotGeometry(0.9, 0.3, 100, 16);
    }

    const material = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.2,
      wireframe: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (mesh) {
        mesh.rotation.y += 0.008;
        mesh.rotation.x += 0.003;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [selectedCase]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Rotate3d className="w-6 h-6 text-blue-600" />
            <span>{language === "bn" ? "৩ডি মেডিকেল রিপোর্ট ভিজ্যুয়ালাইজেশন" : "3D Medical Report Visualization"}</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {language === "bn"
              ? "সিটি স্ক্যান ও এমআরআই রিপোর্টকে ৩ডি মডেলে রূপান্তর করে সমস্যাযুক্ত অঞ্চল চিহ্নিত করুন।"
              : "Explore multi-layer MRI/CT diagnostic scans and interact with 3D pathology models."}
          </p>
        </div>

        {/* Case Select Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {MEDICAL_3D_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCase(c);
                setCurrentSlice(c.annotatedSlice);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                c.id === selectedCase.id
                  ? "bg-blue-600 text-white border-blue-600 font-bold shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
              }`}
            >
              {c.title.split(" ")[0]} ({c.organModel.toUpperCase()})
            </button>
          ))}
        </div>
      </div>

      {/* 3D Model & CT Slice Viewer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D Interactive Canvas Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>{selectedCase.title}</span>
            </h3>
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 font-bold">
              {selectedCase.scanType}
            </span>
          </div>

          {/* Canvas Box */}
          <div className="relative w-full h-64 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Problem Highlight Overlay Pin */}
            {showAnnotation && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white shadow-md flex items-center gap-1.5 animate-bounce">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Pathology Marker</span>
              </div>
            )}

            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-medium text-slate-700">
              Auto-rotating 3D Mesh Mode
            </div>
          </div>

          {/* Layer Slicer Slider */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5 font-semibold">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>{language === "bn" ? "স্ক্যান লেয়ার স্লাইস" : "Scan Layer Slicer"}</span>
              </span>
              <span className="font-mono font-bold text-blue-700">
                Slice {currentSlice} / {selectedCase.layers}
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={selectedCase.layers}
              value={currentSlice}
              onChange={(e) => setCurrentSlice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Clinical Report Summary Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>{language === "bn" ? "রোগীর মেডিকেল রিপোর্ট সমারী" : "Clinical Diagnosis Summary"}</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono font-medium">{selectedCase.patientAgeGender}</span>
          </div>

          <div className="space-y-3 text-xs md:text-sm">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {language === "bn" ? "মূল উপসর্গ (Chief Complaint)" : "Chief Complaint"}
              </span>
              <p className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
                {selectedCase.chiefComplaint}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-1">
                {language === "bn" ? "চিহ্নিত সমস্যা (Identified Problem)" : "Identified Pathology"}
              </span>
              <p className="text-rose-950 bg-rose-50 border border-rose-200 p-3 rounded-xl font-medium">
                {language === "bn" ? selectedCase.problemAreaTextBn : selectedCase.problemAreaText}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                {language === "bn" ? "প্রস্তাবিত চিকিৎসা পরিকল্পনা" : "Recommended Treatment Plan"}
              </span>
              <p className="text-emerald-950 bg-emerald-50 border border-emerald-200 p-3 rounded-xl font-medium">
                {language === "bn" ? selectedCase.treatmentPlanBn : selectedCase.treatmentPlan}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
