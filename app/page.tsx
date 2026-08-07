"use client";

import React, { useState } from "react";
import { HOSPITAL_ZONES, HospitalZone, Hotspot } from "@/lib/hospitalData";
import PanoramaViewer from "@/components/PanoramaViewer";
import RoutePlanner from "@/components/RoutePlanner";
import AiChatbot from "@/components/AiChatbot";
import KidsAdventure from "@/components/KidsAdventure";
import Medical3DViewer from "@/components/Medical3DViewer";
import LiveTourCall from "@/components/LiveTourCall";
import StudentSimulation from "@/components/StudentSimulation";
import AdminDashboard from "@/components/AdminDashboard";

import {
  Compass,
  Navigation,
  Bot,
  Smile,
  Rotate3d,
  Video,
  GraduationCap,
  BarChart3,
  Globe,
  Sun,
  Moon,
  Volume2,
  Siren,
  Sparkles,
  Info,
  X,
  Stethoscope,
  Building2,
  Calendar,
  CheckCircle2,
  Share2,
} from "lucide-react";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<
    "360tour" | "route" | "ai" | "kids" | "3d" | "live" | "sim" | "admin"
  >("360tour");

  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [selectedZone, setSelectedZone] = useState<HospitalZone>(HOSPITAL_ZONES[0]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  const handleNavigateZone = (zoneId: string) => {
    const found = HOSPITAL_ZONES.find((z) => z.id === zoneId);
    if (found) {
      setSelectedZone(found);
      setCurrentTab("360tour");
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors font-sans flex flex-col ${
        isHighContrast
          ? "bg-black text-yellow-300"
          : "bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white"
      }`}
    >
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
        {/* Brand Logo & Hospital Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xl shadow-md shadow-blue-200">
            🏥
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
              <span>CarePath Virtual</span>
              <span className="hidden sm:inline-block text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold">
                St. Jude General Hospital
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              {language === "bn"
                ? "ভার্চুয়াল হাসপাতাল ট্যুর ও রিয়েল-টাইম নেভিগেশন"
                : "Interactive Hospital Exploration & Patient Experience"}
            </p>
          </div>
        </div>

        {/* Global Control Utilities */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Toggle Language"
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span>{language === "en" ? "বাংলা (BN)" : "English (EN)"}</span>
          </button>

          {/* High Contrast Mode Toggle */}
          <button
            onClick={() => setIsHighContrast(!isHighContrast)}
            className={`p-2 rounded-full text-xs font-semibold border transition-colors shadow-2xs ${
              isHighContrast
                ? "bg-yellow-400 text-slate-950 border-yellow-300"
                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:text-slate-900"
            }`}
            title="High Contrast Mode for Accessibility"
          >
            {isHighContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Emergency Hotline Button */}
          <a
            href="tel:999"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <Siren className="w-4 h-4 animate-pulse" />
            <span className="hidden md:inline">Emergency 999</span>
          </a>
        </div>
      </header>

      {/* Primary Sub-Header Mode Tabs */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-2.5 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
          <button
            onClick={() => setCurrentTab("360tour")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              currentTab === "360tour"
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{language === "bn" ? "৩৬০° ইন্টারেক্টিভ ট্যুর" : "360° Interactive Tour"}</span>
          </button>

          <button
            onClick={() => setCurrentTab("route")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              currentTab === "route"
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80"
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>{language === "bn" ? "রুট প্ল্যানার" : "Route Planner"}</span>
          </button>

          <button
            onClick={() => setCurrentTab("ai")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              currentTab === "ai"
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80"
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>{language === "bn" ? "ডঃ মায়া AI অ্যাসিস্ট্যান্ট" : "Dr. Maya AI Guide"}</span>
          </button>

          <button
            onClick={() => setCurrentTab("kids")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              currentTab === "kids"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80"
            }`}
          >
            <Smile className="w-4 h-4 text-amber-600" />
            <span>{language === "bn" ? "ছোট্ট ডাক্তার গেম" : "Kids Adventure"}</span>
          </button>

          <button
            onClick={() => setCurrentTab("3d")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              currentTab === "3d"
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80"
            }`}
          >
            <Rotate3d className="w-4 h-4" />
            <span>{language === "bn" ? "৩ডি মেডিকেল রিপোর্ট" : "3D Scan Viewer"}</span>
          </button>

          <button
            onClick={() => setCurrentTab("live")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              currentTab === "live"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{language === "bn" ? "লাইভ ড্রিম ট্যুর" : "Live Guided Tour"}</span>
          </button>

          <button
            onClick={() => setCurrentTab("sim")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              currentTab === "sim"
                ? "bg-blue-700 text-white shadow-md shadow-blue-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{language === "bn" ? "স্টুডেন্ট ল্যাব" : "Student Lab"}</span>
          </button>

          <button
            onClick={() => setCurrentTab("admin")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              currentTab === "admin"
                ? "bg-slate-900 text-white shadow-md shadow-slate-300"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{language === "bn" ? "অ্যাডমিন ড্যাশবোর্ড" : "Admin Panel"}</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Tab 1: 360° Interactive Tour */}
        {currentTab === "360tour" && (
          <div className="space-y-6">
            {/* Zone Selector Strip */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs overflow-x-auto no-scrollbar flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 px-2">
                {language === "bn" ? "বিভাগ সমূহ" : "Hospital Zones"}:
              </span>
              {HOSPITAL_ZONES.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all shrink-0 ${
                    selectedZone.id === z.id
                      ? "bg-blue-600 text-white border-blue-600 font-bold shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-200"
                  }`}
                >
                  {language === "bn" ? z.nameBn : z.name}
                </button>
              ))}
            </div>

            {/* Three.js 360 WebGL Panorama Viewer */}
            <PanoramaViewer
              zone={selectedZone}
              language={language}
              onSelectHotspot={(hotspot) => setSelectedHotspot(hotspot)}
              onNavigateZone={handleNavigateZone}
              isHighContrast={isHighContrast}
            />

            {/* Zone Information Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full border border-blue-200">
                    {selectedZone.floor}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {language === "bn" ? selectedZone.nameBn : selectedZone.name}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {language === "bn" ? selectedZone.descriptionBn : selectedZone.description}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                    Hotspot Information Points
                  </span>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {selectedZone.hotspots.length} Interactive points pinned in 360 view. Click on glowing icons to view equipment specs or doctor profiles.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentTab("route")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl border border-blue-700 flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions to this Zone</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Personalized Route Planner */}
        {currentTab === "route" && (
          <RoutePlanner language={language} onNavigateToZone={handleNavigateZone} />
        )}

        {/* Tab 3: Dr. Maya AI Guide */}
        {currentTab === "ai" && (
          <AiChatbot language={language} currentZoneName={selectedZone.name} />
        )}

        {/* Tab 4: Kids Adventure */}
        {currentTab === "kids" && <KidsAdventure language={language} />}

        {/* Tab 5: 3D Scan Viewer */}
        {currentTab === "3d" && <Medical3DViewer language={language} />}

        {/* Tab 6: Live Guided Tour */}
        {currentTab === "live" && <LiveTourCall language={language} />}

        {/* Tab 7: Student Simulation */}
        {currentTab === "sim" && <StudentSimulation language={language} />}

        {/* Tab 8: Admin Panel */}
        {currentTab === "admin" && <AdminDashboard language={language} />}
      </main>

      {/* Hotspot Detail Modal */}
      {selectedHotspot && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 relative shadow-2xl animate-in zoom-in-95 text-slate-900">
            <button
              onClick={() => setSelectedHotspot(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === "bn" ? selectedHotspot.titleBn : selectedHotspot.title}
                </h3>
                <span className="text-xs text-blue-600 uppercase font-semibold">
                  {selectedHotspot.category}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {language === "bn" ? selectedHotspot.descriptionBn : selectedHotspot.description}
            </p>

            {selectedHotspot.details && (
              <div className="space-y-2 text-xs text-slate-700">
                {selectedHotspot.details.doctorName && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-blue-700 block mb-0.5">Primary Specialist:</span>
                    <p className="text-slate-900 font-bold">{selectedHotspot.details.doctorName}</p>
                    <p className="text-slate-500">{selectedHotspot.details.doctorRole}</p>
                  </div>
                )}

                {selectedHotspot.details.prepInstructions && (
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-900">
                    <span className="font-bold block mb-0.5">Preparation Guidelines:</span>
                    <p>{selectedHotspot.details.prepInstructions}</p>
                  </div>
                )}

                {selectedHotspot.details.specs && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-500 block mb-1">Key Specifications:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {selectedHotspot.details.specs.map((sp, idx) => (
                        <li key={idx}>{sp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setSelectedHotspot(null)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition-colors"
            >
              {language === "bn" ? "ঠিক আছে" : "Close Details"}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-4 md:px-8 py-6 text-center text-xs text-slate-500 space-y-2">
        <p>© 2026 St. Jude General & Research Hospital • Virtual Hospital Tour Platform</p>
        <p className="text-[11px] text-slate-400">
          Designed for accessibility, anxiety reduction, medical education, and patient convenience.
        </p>
      </footer>
    </div>
  );
}
