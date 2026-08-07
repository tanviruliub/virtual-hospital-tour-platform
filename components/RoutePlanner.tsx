"use client";

import React, { useState } from "react";
import { DEPARTMENT_ROUTES, DepartmentRoute, RouteStep } from "@/lib/hospitalData";
import {
  MapPin,
  Navigation,
  Clock,
  Footprints,
  Accessibility,
  QrCode,
  Download,
  Share2,
  CheckCircle2,
  ChevronRight,
  Volume2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface RoutePlannerProps {
  language: "en" | "bn";
  onNavigateToZone?: (zoneId: string) => void;
}

export default function RoutePlanner({ language, onNavigateToZone }: RoutePlannerProps) {
  const [selectedRoute, setSelectedRoute] = useState<DepartmentRoute>(DEPARTMENT_ROUTES[0]);
  const [startPoint, setStartPoint] = useState("Main Entrance Gate 1");
  const [accessibleOnly, setAccessibleOnly] = useState(true);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isSpeakingStep, setIsSpeakingStep] = useState(false);

  const handleSpeakStep = (step: RouteStep) => {
    const text = language === "bn" ? step.instructionBn : step.instructionEn;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "bn" ? "bn-BD" : "en-US";
    utterance.onend = () => setIsSpeakingStep(false);
    utterance.onerror = () => setIsSpeakingStep(false);

    window.speechSynthesis?.cancel();
    window.speechSynthesis?.speak(utterance);
    setIsSpeakingStep(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* Search & Selector Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Navigation className="w-6 h-6 text-blue-600" />
              <span>{language === "bn" ? "ব্যক্তিগত রুট প্ল্যানার" : "Personalized Route Planner"}</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {language === "bn"
                ? "আপনার গন্তব্য নির্বাচন করুন এবং সংক্ষিপ্ত সুগম পথ খুঁজুন।"
                : "Select your destination to view the shortest wheelchair-accessible indoor pathway."}
            </p>
          </div>

          {/* QR Code Pass Button */}
          <button
            onClick={() => setShowQrModal(true)}
            className="self-start md:self-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs md:text-sm px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-transform transform active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>{language === "bn" ? "অ্যাপয়েন্টমেন্ট পাস QR কোড" : "Appointment QR Pass"}</span>
          </button>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Destination Dept */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {language === "bn" ? "গন্তব্য বিভাগ (Department)" : "Select Destination Department"}
            </label>
            <select
              value={selectedRoute.id}
              onChange={(e) => {
                const found = DEPARTMENT_ROUTES.find((r) => r.id === e.target.value);
                if (found) {
                  setSelectedRoute(found);
                  setActiveStepIndex(0);
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none"
            >
              {DEPARTMENT_ROUTES.map((route) => (
                <option key={route.id} value={route.id}>
                  {language === "bn" ? route.deptNameBn : route.deptNameEn} ({route.floor})
                </option>
              ))}
            </select>
          </div>

          {/* Starting Point */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {language === "bn" ? "শুরু করার স্থান (Starting Point)" : "Starting Point"}
            </label>
            <select
              value={startPoint}
              onChange={(e) => setStartPoint(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none"
            >
              <option value="Main Entrance Gate 1">Main Entrance Gate 1</option>
              <option value="Underground Parking B2">Underground Parking B2</option>
              <option value="Emergency Gate 2">Emergency Gate 2</option>
              <option value="Central Pharmacy">Central Pharmacy</option>
            </select>
          </div>

          {/* Accessibility Option */}
          <div className="flex items-end">
            <label className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 w-full cursor-pointer hover:border-slate-300 transition-colors">
              <input
                type="checkbox"
                checked={accessibleOnly}
                onChange={(e) => setAccessibleOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 bg-white"
              />
              <div className="flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-emerald-600" />
                <span className="text-xs md:text-sm text-slate-800 font-medium">
                  {language === "bn" ? "হুইলচেয়ার ও রাম্প অগ্রাধিকার" : "Wheelchair & Ramp Priority"}
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Route Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-slate-500 text-[10px]">{language === "bn" ? "আনুমানিক সময়" : "Est. Time"}</p>
              <p className="font-bold text-slate-900">{selectedRoute.estimatedMinutes} Mins</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Footprints className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="text-slate-500 text-[10px]">{language === "bn" ? "মোট দূরত্ব" : "Distance"}</p>
              <p className="font-bold text-slate-900">{selectedRoute.totalDistanceMeters} Meters</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-slate-500 text-[10px]">{language === "bn" ? "অবস্থান" : "Location"}</p>
              <p className="font-bold text-slate-900">{selectedRoute.floor}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Accessibility className="w-4 h-4 text-indigo-600" />
            <div>
              <p className="text-slate-500 text-[10px]">{language === "bn" ? "এক্সেস" : "Accessibility"}</p>
              <p className="font-bold text-emerald-600">100% Ramp Friendly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-step Interactive Journey Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step Cards List */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span>{language === "bn" ? "ধাপভিত্তিক পথনির্দেশ" : "Step-by-Step Wayfinding Guidance"}</span>
            <span className="text-xs font-semibold text-blue-600">
              {activeStepIndex + 1} of {selectedRoute.steps.length} {language === "bn" ? "ধাপ" : "Steps"}
            </span>
          </h3>

          <div className="space-y-3">
            {selectedRoute.steps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <div
                  key={step.stepNumber}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isActive
                      ? "bg-blue-50/80 border-blue-300 shadow-sm shadow-blue-100"
                      : "bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Step badge */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {step.stepNumber}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                          {language === "bn" ? step.landmarkBn : step.landmarkEn}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {step.distanceMeters}m
                        </span>
                      </div>

                      <p className="text-sm font-medium text-slate-800 leading-relaxed">
                        {language === "bn" ? step.instructionBn : step.instructionEn}
                      </p>

                      {/* Accessible tag */}
                      {step.accessibleFriendly && (
                        <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 pt-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{language === "bn" ? "হুইলচেয়ার সুগম পথ" : "Accessible Corridor"}</span>
                        </div>
                      )}
                    </div>

                    {/* Speech audio button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeakStep(step);
                      }}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
                      title="Read Aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indoor Map Graphic Preview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{language === "bn" ? "ইন্ডোর ফ্লোর ম্যাপ প্রিভিউ" : "Indoor Map Path Preview"}</span>
            </h4>
            <p className="text-xs text-slate-500">
              {language === "bn"
                ? "বর্তমান নির্বাচিত ধাপের অবস্থান দেখুন।"
                : "Interactive view of current floor pathway."}
            </p>
          </div>

          {/* Visual Floor Schema Graphic */}
          <div className="relative w-full h-56 bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center overflow-hidden">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-60" />

            {/* Path Nodes */}
            <div className="relative z-10 w-full flex items-center justify-between px-4">
              {selectedRoute.steps.map((st, i) => (
                <div key={st.stepNumber} className="flex items-center">
                  <div
                    onClick={() => setActiveStepIndex(i)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition-transform transform ${
                      i === activeStepIndex
                        ? "bg-blue-600 text-white scale-110 ring-4 ring-blue-100 font-black shadow-md"
                        : i < activeStepIndex
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {st.stepNumber}
                  </div>
                  {i < selectedRoute.steps.length - 1 && (
                    <div
                      className={`h-1 w-10 md:w-16 transition-colors ${
                        i < activeStepIndex ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Current Step Focus Box */}
            <div className="relative z-10 mt-6 bg-white border border-blue-200 rounded-xl p-3 text-center max-w-xs shadow-xs">
              <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                Current Step {activeStepIndex + 1}
              </span>
              <p className="text-xs text-slate-800 font-medium mt-0.5 line-clamp-2">
                {language === "bn"
                  ? selectedRoute.steps[activeStepIndex]?.instructionBn
                  : selectedRoute.steps[activeStepIndex]?.instructionEn}
              </p>
            </div>
          </div>

          {/* Jump to 360 Tour View */}
          {onNavigateToZone && (
            <button
              onClick={() => onNavigateToZone(selectedRoute.steps[activeStepIndex]?.zoneId || "entrance")}
              className="w-full bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-bold text-xs py-2.5 rounded-xl border border-slate-200 hover:border-blue-200 flex items-center justify-center gap-2 transition-colors"
            >
              <span>{language === "bn" ? "এই স্থানের ৩৬০° ভিউতে যান" : "Explore 360° View of this Step"}</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </button>
          )}
        </div>
      </div>

      {/* QR Code Pass Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 space-y-4 text-center relative shadow-2xl animate-in fade-in zoom-in-95 text-slate-900">
            <h3 className="text-lg font-bold text-slate-900">
              {language === "bn" ? "ডিজিটাল নেভিগেশন পাস" : "Digital Navigation Pass"}
            </h3>
            <p className="text-xs text-slate-500">
              {language === "bn"
                ? "আপনার ফোনে সরাসরি পথনির্দেশ লোড করতে কিউআর কোড স্ক্যান করুন।"
                : "Scan this QR code on hospital kiosks to immediately open your navigation route."}
            </p>

            {/* Simulated QR Code Box */}
            <div className="bg-slate-50 p-4 rounded-xl inline-block border border-slate-200">
              <div className="w-44 h-44 bg-white p-2 rounded-lg flex flex-col items-center justify-center text-blue-600 relative border border-slate-200 shadow-xs">
                <QrCode className="w-32 h-32 text-slate-800" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-blue-600 text-white font-black text-xs px-2.5 py-1 rounded shadow-sm">
                    ST. JUDE NAV
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              Pass ID: {selectedRoute.qrCodeData}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowQrModal(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-xl border border-slate-200"
              >
                {language === "bn" ? "বন্ধ করুন" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
