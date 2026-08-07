"use client";

import React, { useState } from "react";
import { HOSPITAL_ZONES } from "@/lib/hospitalData";
import { BarChart3, TrendingUp, Users, HeartHandshake, Eye, MessageSquare, Edit3, CheckCircle, Plus } from "lucide-react";

interface AdminDashboardProps {
  language: "en" | "bn";
}

export default function AdminDashboard({ language }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "content">("analytics");
  const [zoneList, setZoneList] = useState(HOSPITAL_ZONES);
  const [editingHotspotId, setEditingHotspotId] = useState<string | null>(null);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>{language === "bn" ? "হাসপাতাল অ্যাডমিন ও অ্যানালিটিক্স ড্যাশবোর্ড" : "Hospital Admin & Tour Analytics"}</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {language === "bn"
              ? "ভার্চুয়াল ট্যুরের ভিউ সংখ্যা, রোগীর উদ্বেগ হ্রাস সূচক ও কনটেন্ট নিয়ন্ত্রণ কেন্দ্র।"
              : "Track tour viewer metrics, patient anxiety reduction ratings, and update 360° hotspots."}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all ${
              activeTab === "analytics" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Analytics & Impact
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all ${
              activeTab === "content" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Hotspot Content Editor
          </button>
        </div>
      </div>

      {activeTab === "analytics" ? (
        /* Analytics View Grid */
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-blue-600">
                <Eye className="w-5 h-5" />
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-bold">+18% this mo</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 font-mono">18,420</p>
              <p className="text-xs text-slate-500">{language === "bn" ? "মোট ভার্চুয়াল ট্যুর ভিউ" : "Total Virtual Tour Views"}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-emerald-600">
                <HeartHandshake className="w-5 h-5" />
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold">-46% Anxiety</span>
              </div>
              <p className="text-2xl font-bold text-emerald-700 font-mono">4.8 / 5.0</p>
              <p className="text-xs text-slate-500">{language === "bn" ? "রোগীর উদ্বেগ হ্রাস রেটিং" : "Anxiety Reduction Score"}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-amber-600">
                <Users className="w-5 h-5" />
                <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">1,280 Sessions</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 font-mono">3,450</p>
              <p className="text-xs text-slate-500">{language === "bn" ? "লাইভ ড্রিম গাইড বুকিং" : "Live Guided Tour Bookings"}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-indigo-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold">+28% Conversions</span>
              </div>
              <p className="text-2xl font-bold text-indigo-700 font-mono">94.2%</p>
              <p className="text-xs text-slate-500">{language === "bn" ? "অন-টাইম অ্যাপয়েন্টমেন্ট উপস্থিতি" : "On-Time Arrival Rate"}</p>
            </div>
          </div>

          {/* Department Views Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {language === "bn" ? "সর্বাধিক ভিজিট করা বিভাগ সমূহ" : "Most Visited Departments (360° Views)"}
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Cardiology & Diagnostic Imaging</span>
                    <span className="font-bold text-blue-700">34% (6,260 views)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full w-[34%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Emergency & Trauma Center</span>
                    <span className="font-bold text-rose-700">28% (5,150 views)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-600 rounded-full w-[28%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Outpatient Clinics (OPD)</span>
                    <span className="font-bold text-emerald-700">22% (4,050 views)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-[22%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Pediatric Play Care & Wards</span>
                    <span className="font-bold text-amber-700">16% (2,960 views)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[16%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Feedback & Anxiety Survey Log */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>{language === "bn" ? "রোগী প্রতিক্রিয়া ও ভীতি সার্ভে লগ" : "Patient Experience Feedback Log"}</span>
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </h3>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span className="font-bold text-slate-900">Rahim Chowdhury (Cardiology Patient)</span>
                    <span className="text-amber-500 font-bold">★★★★★</span>
                  </div>
                  <p className="text-slate-700 font-medium">
                    &quot;Taking the 360° tour of the MRI room beforehand helped me feel completely relaxed during my actual scan today!&quot;
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span className="font-bold text-slate-900">Anika Parveen (Pediatric Parent)</span>
                    <span className="text-amber-500 font-bold">★★★★★</span>
                  </div>
                  <p className="text-slate-700 font-medium">
                    &quot;My 6yo son loved the Dr. Rabbit game! He walked into the hospital smiling instead of crying.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Hotspot Content Editor View */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span>Virtual Tour Hotspot Manager</span>
            <span className="text-xs font-semibold text-slate-500">{zoneList.length} Total Zones</span>
          </h3>

          <div className="space-y-4">
            {zoneList.map((z) => (
              <div key={z.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{z.name}</h4>
                    <p className="text-xs text-blue-700 font-medium">{z.floor} • {z.hotspots.length} Hotspots</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  {z.hotspots.map((hs) => (
                    <div key={hs.id} className="bg-white border border-slate-200 p-3 rounded-lg text-xs space-y-1 shadow-2xs">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{hs.title}</span>
                        <Edit3 className="w-3.5 h-3.5 text-blue-600 cursor-pointer" />
                      </div>
                      <p className="text-slate-500 line-clamp-2">{hs.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
