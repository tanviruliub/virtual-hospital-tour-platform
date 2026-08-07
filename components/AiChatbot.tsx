"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, User, RefreshCw, AlertCircle } from "lucide-react";

interface AiChatbotProps {
  language: "en" | "bn";
  currentZoneName?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export default function AiChatbot({ language, currentZoneName = "Main Entrance" }: AiChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text:
        language === "bn"
          ? "নমস্কার/হ্যালো! আমি ডঃ মায়া, আপনার এআই ভার্চুয়াল হাসপাতাল সহকারী। আপনার অ্যাপয়েন্টমেন্ট, বিভাগ, অথবা এমআরআই প্রস্তুতি সম্পর্কিত যেকোনো প্রশ্ন জিজ্ঞেস করতে পারেন।"
          : "Hello! I am Dr. Maya, your AI virtual hospital guide. Ask me anything about department locations, visiting hours, or checkup preparation!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Voice Recognition
  const toggleSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = language === "bn" ? "bn-BD" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInput(transcript);
        handleSend(transcript);
      }
    };

    recognition.onerror = () => setIsListening(false);

    recognition.start();
  };

  // Text To Speech
  const speakText = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "bn" ? "bn-BD" : "en-US";
    utterance.rate = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis?.cancel();
    window.speechSynthesis?.speak(utterance);
    setIsSpeaking(true);
  };

  const handleSend = async (userPromptText?: string) => {
    const textToSend = userPromptText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          language,
          context: { currentZone: currentZoneName },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch AI response.");
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text:
            language === "bn"
              ? "দুঃখিত, সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
              : "I apologize, I encountered a temporary connection issue. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestionsEn = [
    "Where is the Cardiology department?",
    "What are the ICU visiting hours?",
    "How do I prepare for an MRI scan?",
    "Where can I find the 24/7 Pharmacy?",
  ];

  const quickQuestionsBn = [
    "কার্ডিওলজি বিভাগ কোথায়?",
    "আইসিইউ দেখার সময় কখন?",
    "এমআরআই পরীক্ষার আগে কী প্রস্তুতি প্রয়োজন?",
    "২৪ ঘণ্টার ফার্মেসি কোথায় অবস্থিত?",
  ];

  const quickQuestions = language === "bn" ? quickQuestionsBn : quickQuestionsEn;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col h-[580px]">
      {/* Header Avatar Bar */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Animated Avatar Icon */}
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>Dr. Maya AI</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                24/7 Assistant
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {language === "bn" ? "ভয়েস ও টেক্সট নির্দেশক" : "Smart Multi-Lingual Medical Concierge"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([])}
            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
            title="Clear Chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-800 font-bold"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-blue-600" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[80%] rounded-2xl p-3.5 space-y-1.5 shadow-2xs ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
              }`}
            >
              <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
              <div className="flex items-center justify-between text-[10px] opacity-75 pt-1">
                <span>{msg.timestamp}</span>
                {msg.sender === "bot" && (
                  <button
                    onClick={() => speakText(msg.text)}
                    className="hover:opacity-100 p-1"
                    title="Read Aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-xs text-blue-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-pulse text-amber-500" />
              <span>{language === "bn" ? "ডঃ মায়া ভাবছেন..." : "Dr. Maya is typing..."}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="p-3 bg-white border-t border-slate-200 overflow-x-auto flex items-center gap-2 no-scrollbar">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="whitespace-nowrap bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2">
        <button
          onClick={toggleSpeechRecognition}
          className={`p-2.5 rounded-xl transition-all ${
            isListening
              ? "bg-red-600 text-white animate-pulse"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
          }`}
          title="Voice Command"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            language === "bn"
              ? "এখানে প্রশ্ন লিখুন (যেমন: রেডিওলজি বিভাগ কোথায়?)"
              : "Type your query here (e.g., Where is the Cardiology ward?)"
          }
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold p-2.5 rounded-xl transition-colors disabled:cursor-not-allowed shadow-xs"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
