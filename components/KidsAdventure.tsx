"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { KIDS_MISSIONS, KidMission } from "@/lib/hospitalData";
import { Sparkles, Trophy, Award, CheckCircle, ArrowRight, Star, Heart, Volume2 } from "lucide-react";

interface KidsAdventureProps {
  language: "en" | "bn";
}

export default function KidsAdventure({ language }: KidsAdventureProps) {
  const [activeMission, setActiveMission] = useState<KidMission>(KIDS_MISSIONS[0]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [badgesEarned, setBadgesEarned] = useState<string[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleSelectOption = (idx: number) => {
    setSelectedOptionIndex(idx);
    const option = activeMission.options[idx];

    if (option.isCorrect) {
      // Trigger confetti reward
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (!badgesEarned.includes(activeMission.badgeReward)) {
        setBadgesEarned((prev) => [...prev, activeMission.badgeReward]);
      }
    }
  };

  const handleSpeakStory = () => {
    const text = language === "bn" ? activeMission.storyBn : activeMission.storyEn;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "bn" ? "bn-BD" : "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis?.cancel();
    window.speechSynthesis?.speak(utterance);
  };

  return (
    <div className="w-full space-y-6">
      {/* Banner Header with Cartoon Mascot */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Dr. Rabbit Mascot Badge */}
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 font-black flex flex-col items-center justify-center shadow-sm border-2 border-amber-300 shrink-0 transform -rotate-2">
              <span className="text-2xl">🐰</span>
              <span className="text-[9px] font-bold uppercase tracking-wider">Dr. Rabbit</span>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span>{language === "bn" ? "ছোট্ট ডাক্তার অ্যাডভেঞ্চার" : "Little Doctor Adventure"}</span>
                <Sparkles className="w-5 h-5 text-amber-500" />
              </h2>
              <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-xl">
                {language === "bn"
                  ? "ভয় নেই বন্ধু! ডক্টর র‌্যাবিটের সাথে হাসপাতালের জাদুকরী সব কক্ষ আবিষ্কার করো এবং হিরো ব্যাজ জয় করো!"
                  : "Hospital checkups are super fun! Join Dr. Rabbit to solve medical puzzles, turn scary rooms into space rocket missions, and win Junior Doctor Badges!"}
              </p>
            </div>
          </div>

          {/* Badge Rack */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 text-center">
            <Trophy className="w-6 h-6 text-amber-500 shrink-0" />
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-slate-500">
                {language === "bn" ? "অর্জিত ব্যাজ" : "Badges Collected"}
              </p>
              <p className="text-lg font-black text-slate-900">
                {badgesEarned.length} / {KIDS_MISSIONS.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mission Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mission List Selector */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {language === "bn" ? "মিশন নির্বাচন করুন" : "Select Your Adventure"}
          </h3>

          <div className="space-y-2.5">
            {KIDS_MISSIONS.map((mission) => {
              const isSelected = mission.id === activeMission.id;
              const isCompleted = badgesEarned.includes(mission.badgeReward);

              return (
                <div
                  key={mission.id}
                  onClick={() => {
                    setActiveMission(mission);
                    setSelectedOptionIndex(null);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-amber-50 border-amber-300 shadow-2xs"
                      : "bg-white border-slate-200 hover:border-amber-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold ${
                        isCompleted ? "bg-amber-400 text-slate-950" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {isCompleted ? "⭐" : "🚀"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {language === "bn" ? mission.titleBn : mission.titleEn}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {language === "bn" ? mission.badgeReward : mission.badgeReward}
                      </p>
                    </div>
                  </div>

                  {isCompleted && <CheckCircle className="w-5 h-5 text-amber-500" />}
                </div>
              );
            })}
          </div>

          {/* Certificate Claim Button */}
          {badgesEarned.length > 0 && (
            <button
              onClick={() => setShowCertificate(true)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-transform transform active:scale-95 mt-4"
            >
              <Award className="w-5 h-5" />
              <span>{language === "bn" ? "জুনিয়র ডাক্তার সার্টিফিকেট দেখুন" : "View Junior Doctor Certificate"}</span>
            </button>
          )}
        </div>

        {/* Active Mission Interactive Area */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs relative">
          {/* Fear Transformation Concept Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-900">
              <span className="text-[10px] uppercase font-bold text-rose-700">
                {language === "bn" ? "ভয়ের ধারণা" : "What it looks like"}
              </span>
              <p className="text-sm font-semibold mt-1">
                ❌ {language === "bn" ? activeMission.scaryConceptBn : activeMission.scaryConceptEn}
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900">
              <span className="text-[10px] uppercase font-bold text-emerald-700">
                {language === "bn" ? "ম্যাজিক রূপান্তর" : "Magic Transformation!"}
              </span>
              <p className="text-sm font-semibold mt-1">
                ✨ {language === "bn" ? activeMission.friendlyConceptBn : activeMission.friendlyConceptEn}
              </p>
            </div>
          </div>

          {/* Story Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{language === "bn" ? "ডক্টর র‌্যাবিটের গল্প" : "Dr. Rabbit's Story"}</span>
              </h4>
              <button
                onClick={handleSpeakStory}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors text-xs flex items-center gap-1 font-semibold"
              >
                <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Listen</span>
              </button>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {language === "bn" ? activeMission.storyBn : activeMission.storyEn}
            </p>
          </div>

          {/* Interactive Question */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>{language === "bn" ? activeMission.taskPromptBn : activeMission.taskPromptEn}</span>
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {activeMission.options.map((opt, idx) => {
                const isSelected = selectedOptionIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl text-left font-bold text-sm border transition-all flex items-center justify-between ${
                      isSelected
                        ? opt.isCorrect
                          ? "bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs"
                          : "bg-rose-50 border-rose-400 text-rose-900"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/30"
                    }`}
                  >
                    <span>{language === "bn" ? opt.textBn : opt.textEn}</span>
                    {isSelected && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200">
                        {opt.isCorrect ? "Correct! 🎉" : "Try Again!"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback Message */}
            {selectedOptionIndex !== null && (
              <div
                className={`p-4 rounded-xl text-xs md:text-sm font-semibold border ${
                  activeMission.options[selectedOptionIndex].isCorrect
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "bg-rose-50 border-rose-300 text-rose-900"
                }`}
              >
                {language === "bn"
                  ? activeMission.options[selectedOptionIndex].feedbackBn
                  : activeMission.options[selectedOptionIndex].feedbackEn}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Junior Doctor Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-amber-400 rounded-2xl max-w-lg w-full p-8 text-center space-y-5 relative shadow-2xl animate-in zoom-in-95 text-slate-900">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mx-auto font-black text-2xl shadow-md">
              🎓
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                Official Award Certificate
              </span>
              <h3 className="text-2xl font-black text-slate-900">Junior Doctor Hero</h3>
              <p className="text-xs text-slate-500">Presented by St. Jude Pediatric Health World</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700">
              <p>
                This certifies that our brave young explorer has successfully mastered hospital environments and earned{" "}
                <span className="font-bold text-amber-600">{badgesEarned.length} Badges</span> with Dr. Rabbit!
              </p>
            </div>

            <button
              onClick={() => setShowCertificate(false)}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
