"use client";

import React, { useState } from "react";
import { STUDENT_SIMULATION_CASES, StudentSimCase } from "@/lib/hospitalData";
import { GraduationCap, HeartPulse, Award, AlertCircle, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";

interface StudentSimulationProps {
  language: "en" | "bn";
}

export default function StudentSimulation({ language }: StudentSimulationProps) {
  const [activeCase, setActiveCase] = useState<StudentSimCase>(STUDENT_SIMULATION_CASES[0]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [score, setScore] = useState(100);
  const [selectedChoices, setSelectedChoices] = useState<{ [stepId: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStep = activeCase.steps[currentStepIdx];

  const handleSelectChoice = (choiceIdx: number) => {
    if (selectedChoices[currentStep.id] !== undefined) return; // already answered

    const choice = currentStep.choices[choiceIdx];
    setSelectedChoices((prev) => ({ ...prev, [currentStep.id]: choiceIdx }));
    setScore((prev) => prev + choice.scoreDelta);
  };

  const handleNextStep = () => {
    if (currentStepIdx < activeCase.steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const resetSimulation = () => {
    setCurrentStepIdx(0);
    setScore(100);
    setSelectedChoices({});
    setIsCompleted(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <span>{language === "bn" ? "মেডিকেল ও নার্সিং সিমুলেশন ল্যাব" : "Medical & Nursing Training Simulation"}</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {language === "bn"
              ? "মেডিকেল শিক্ষার্থীদের জন্য জরুরি চিকিৎসা সিদ্ধান্ত, কেইস স্টাডি ও পারফরম্যান্স স্কোরিং।"
              : "Risk-free clinical case scenarios, Code Blue decision trees, and performance scoring for students."}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
          <Award className="w-5 h-5 text-amber-500" />
          <div>
            <span className="text-[10px] text-slate-500 block font-mono">Clinical Score</span>
            <span className="font-bold text-slate-900 text-base">{score} Pts</span>
          </div>
        </div>
      </div>

      {/* Main Simulation View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Vitals Monitor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Patient Telemetry Vitals</span>
            </h3>
            <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-mono font-bold">
              {activeCase.difficulty}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Heart Rate</span>
              <span className="text-xl font-mono font-bold text-emerald-700">{activeCase.vitals.hr} BPM</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Blood Pressure</span>
              <span className="text-xl font-mono font-bold text-blue-700">{activeCase.vitals.bp} mmHg</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">SpO2 Oxygen</span>
              <span className="text-xl font-mono font-bold text-amber-600">{activeCase.vitals.spo2}%</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Temp</span>
              <span className="text-xl font-mono font-bold text-slate-800">{activeCase.vitals.temp} °C</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Case Scenario</span>
            <p className="text-slate-800 leading-relaxed font-medium">
              {language === "bn" ? activeCase.scenarioBn : activeCase.scenarioEn}
            </p>
          </div>
        </div>

        {/* Clinical Decision Step View */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
          {isCompleted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
                🎉
              </div>
              <h3 className="text-xl font-bold text-slate-900">Case Simulation Completed!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                You scored <span className="font-bold text-blue-700">{score} Points</span>. Great job following clinical practice guidelines!
              </p>

              <button
                onClick={resetSimulation}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 mx-auto shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Case Study</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold uppercase tracking-wider text-blue-700">
                  Decision Step {currentStepIdx + 1} of {activeCase.steps.length}
                </span>
                <span className="font-semibold text-slate-700">Score: {score} Pts</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {language === "bn" ? currentStep.questionBn : currentStep.questionEn}
              </h3>

              <div className="space-y-3">
                {currentStep.choices.map((choice, idx) => {
                  const choiceChosen = selectedChoices[currentStep.id];
                  const isSelected = choiceChosen === idx;

                  return (
                    <div key={idx} className="space-y-2">
                      <button
                        onClick={() => handleSelectChoice(idx)}
                        disabled={choiceChosen !== undefined}
                        className={`w-full p-4 rounded-xl text-left font-semibold text-xs md:text-sm border transition-all ${
                          isSelected
                            ? choice.isCorrect
                              ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                              : "bg-rose-50 border-rose-400 text-rose-900"
                            : "bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                      >
                        {language === "bn" ? choice.textBn : choice.textEn}
                      </button>

                      {isSelected && (
                        <div
                          className={`p-3 rounded-xl text-xs font-semibold border ${
                            choice.isCorrect
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                              : "bg-rose-50 border-rose-300 text-rose-900"
                          }`}
                        >
                          {language === "bn" ? choice.impactBn : choice.impactEn}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {selectedChoices[currentStep.id] !== undefined && (
                <button
                  onClick={handleNextStep}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-colors mt-4 shadow-xs"
                >
                  {currentStepIdx < activeCase.steps.length - 1 ? "Next Decision Step →" : "View Final Score"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
