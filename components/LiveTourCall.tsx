"use client";

import React, { useState } from "react";
import { Video, Mic, MicOff, PhoneOff, Calendar, Clock, MessageSquare, Send, User, CheckCircle2, ShieldCheck } from "lucide-react";

interface LiveTourCallProps {
  language: "en" | "bn";
}

export default function LiveTourCall({ language }: LiveTourCallProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { sender: "user" | "counselor"; text: string; time: string }[]
  >([
    {
      sender: "counselor",
      text:
        language === "bn"
          ? "শুভ দিন! আমি সেন্ট জুড হাসপাতালের সিনিয়র নার্স কাউন্সিলর সারা। ভার্চুয়াল লাইভ ট্যুরে আপনাকে সাহায্য করতে পেরে আনন্দিত।"
          : "Good day! I am Nurse Sarah, your live hospital counselor. I am sharing my screen to walk you through our facilities.",
      time: "10:30 AM",
    },
  ]);

  const [bookingName, setBookingName] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [isBooked, setIsBooked] = useState(false);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    // Simulated Counselor response after 1 sec
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "counselor",
          text:
            language === "bn"
              ? "ধন্যবাদ প্রশ্নের জন্য। আমি এখনই ট্যুর স্ক্রিনে সেই এলাকাটি জুম করে দেখাচ্ছি।"
              : "Great question! Let me navigate directly to that department on the shared 360 screen.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1200);
  };

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingName && bookingDate && bookingTime) {
      setIsBooked(true);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Video className="w-6 h-6 text-rose-600 animate-pulse" />
            <span>{language === "bn" ? "লাইভ কাউন্সিলর গালফ্রিড ট্যুর" : "Live Guided Tour with Counselor"}</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {language === "bn"
              ? "হাসপাতালের নার্স অথবা কাউন্সিলরের সাথে রিয়েল-টাইম ভিডিও কলে হাসপাতাল ঘুরে দেখুন।"
              : "Connect via real-time video call with a hospital counselor for a personalized guided walkthrough."}
          </p>
        </div>

        {/* Start/End Call Toggle */}
        <button
          onClick={() => setIsInCall(!isInCall)}
          className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold shadow-xs flex items-center gap-2 transition-transform transform active:scale-95 ${
            isInCall
              ? "bg-rose-600 hover:bg-rose-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isInCall ? (
            <>
              <PhoneOff className="w-4 h-4" />
              <span>{language === "bn" ? "কল সমাপ্ত করুন" : "Leave Live Tour"}</span>
            </>
          ) : (
            <>
              <Video className="w-4 h-4" />
              <span>{language === "bn" ? "লাইভ কল শুরু করুন" : "Join Instant Live Call"}</span>
            </>
          )}
        </button>
      </div>

      {isInCall ? (
        /* Video Call Interface Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Stream Container */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-200 rounded-2xl p-4 relative h-[480px] flex flex-col justify-between overflow-hidden shadow-xs">
            {/* Counselor Video Feed */}
            <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
              <div className="relative mb-3">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-emerald-400 p-1 shadow-md overflow-hidden">
                  <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-2xl">
                    👩‍⚕️
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
              </div>

              <h3 className="text-lg font-bold text-white">Nurse Sarah Jenkins</h3>
              <p className="text-xs text-blue-400">Senior Patient Counselor • Live Presenting</p>
            </div>

            {/* Self PIP Camera View */}
            <div className="relative z-10 self-end w-32 h-24 bg-slate-800 border-2 border-slate-700 rounded-xl overflow-hidden shadow-md flex items-center justify-center text-slate-400 text-xs">
              <User className="w-8 h-8 opacity-50" />
              <span className="absolute bottom-1 left-2 text-[9px] text-white bg-black/60 px-1 rounded">You</span>
            </div>

            {/* In-Call Controls Bar */}
            <div className="relative z-10 self-center bg-slate-950/90 backdrop-blur-md border border-slate-700 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-md">
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-3 rounded-xl transition-colors ${
                  isMicMuted ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsInCall(false)}
                className="bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-xl transition-colors"
                title="End Call"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Live Call Q&A Chat Sidebar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col h-[480px] shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>{language === "bn" ? "লাইভ চ্যাট ও প্রশ্নোত্তরি" : "Live Counselor Q&A"}</span>
            </h4>

            <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs">
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl max-w-[85%] ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white ml-auto"
                      : "bg-slate-50 text-slate-800 border border-slate-200"
                  }`}
                >
                  <p>{m.text}</p>
                  <span className="text-[9px] opacity-60 mt-1 block text-right">{m.time}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                placeholder="Ask counselor..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
              />
              <button
                onClick={handleSendChat}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl font-bold shadow-2xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Appointment Booking Form for Live Guided Session */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 text-emerald-700 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>{language === "bn" ? "নির্ধারিত লাইভ ভার্চুয়াল ট্যুর বুক করুন" : "Book Scheduled Live Video Tour"}</span>
            </div>
            <p className="text-xs text-slate-500">
              {language === "bn"
                ? "হাসপাতাল ভিজিটের পূর্বে আমাদের পেশাদার কাউন্সিলরের সাথে ৩০ মিনিটের প্রাইভেট ভিডিও সেশন বুক করুন।"
                : "Schedule a 1-on-1 private 30-minute virtual walkthrough session before your actual hospital appointment."}
            </p>

            {isBooked ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-900 space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-slate-900">
                  {language === "bn" ? "অ্যাপয়েন্টমেন্ট সফলভাবে বুক হয়েছে!" : "Live Tour Session Booked!"}
                </h4>
                <p className="text-xs text-emerald-800 font-semibold">
                  {bookingName}, {bookingDate} @ {bookingTime}
                </p>
                <p className="text-[11px] text-slate-500">
                  Video call link has been generated and sent to your phone number.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookSession} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    {language === "bn" ? "আপনার পূর্ণ নাম" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      {language === "bn" ? "তারিখ" : "Preferred Date"}
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      {language === "bn" ? "সময়" : "Preferred Time"}
                    </label>
                    <input
                      type="time"
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-xs transition-transform transform active:scale-95"
                >
                  {language === "bn" ? "বুকিং নিশ্চিত করুন" : "Confirm Live Session Booking"}
                </button>
              </form>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                {language === "bn" ? "লাইভ কাউন্সিলরদের সেবা সমূহ" : "What to expect in a Live Session"}
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time answers to parking, visiting rules & prep guidelines.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom walkthrough of your exact doctor&apos;s clinic room.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Multi-lingual translation (Bangla, English, Hindi).</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center text-xs text-slate-500 font-medium">
              Free 24/7 Service offered by St. Jude Patient Experience Office.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
