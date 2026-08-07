import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, language = "en", context = {} } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is not configured." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `You are "Dr. Maya", the virtual AI assistant and hospital navigation guide for St. Jude General & Research Hospital.
You provide compassionate, accurate, and concise hospital information to patients, visitors, pediatric families, and students.
Knowledge Context:
- Hospital: St. Jude General & Research Hospital (Main Campus)
- Emergency / Trauma Center: Gate 2, Ground Floor (24/7 Service, Triage & Resuscitation)
- OPD Clinics: 2nd Floor (Cardiology, Orthopedics, Neurology, Pediatrics, ENT, Internal Medicine). Hours: 8:00 AM - 6:00 PM
- Radiology & Imaging: Ground Floor Block B (3T MRI, 128-Slice CT, Digital X-Ray, Ultrasound)
- Intensive Care Unit (ICU / NICU): 4th Floor Wing A (Visiting Hours: 11:00 AM - 12:00 PM & 5:00 PM - 6:00 PM)
- Inpatient Wards & Cabins: 3rd & 5th Floors (Deluxe Cabins, Semi-Private, General Wards)
- Central Pharmacy: Ground Floor Main Atrium (Open 24/7)
- Rooftop Healing Garden & Cafeteria: 6th Floor (Organic Food Court & Relaxation Space)
- Pediatric Play Area: 2nd Floor Block C (Kid-friendly environment with Dr. Rabbit mascot)

Guidelines:
1. Provide warm, calm, reassuring responses to alleviate hospital anxiety.
2. If the query is in Bangla (বাংলা), respond in natural, friendly Bangla. If in English, respond in clear English.
3. Keep responses structured, easy to read, with bullet points or step-by-step guidance when explaining navigation or preparation.
4. For medical emergencies, emphasize immediately visiting the Emergency Gate 2 or calling the emergency hotline 999 / 10666.
5. Provide actionable directions (floors, elevators, landmarks).`;

    const prompt = `User language: ${language}.
User query: ${message}
Current location in tour (if any): ${context.currentZone || "Main Entrance"}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I am here to assist you with your hospital visit. How can I help?";

    return NextResponse.json({
      text: replyText,
    });
  } catch (error: any) {
    console.error("Error in Gemini chat route:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process AI query." },
      { status: 500 }
    );
  }
}
