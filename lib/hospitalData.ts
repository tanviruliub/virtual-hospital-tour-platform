export interface Hotspot {
  id: string;
  title: string;
  titleBn: string;
  category: "info" | "equipment" | "doctor" | "prep" | "accessible";
  xPercent: number; // position on 360 canvas (0-100)
  yPercent: number; // position on 360 canvas (0-100)
  yawDeg: number;   // 3D sphere yaw angle
  pitchDeg: number; // 3D sphere pitch angle
  description: string;
  descriptionBn: string;
  details?: {
    specs?: string[];
    doctorName?: string;
    doctorRole?: string;
    visitingHours?: string;
    prepInstructions?: string;
  };
}

export interface HospitalZone {
  id: string;
  name: string;
  nameBn: string;
  floor: string;
  floorLevel: number;
  iconName: string;
  panoramaUrl: string;
  panoramaType: "equirectangular" | "procedural";
  gradientBg: string;
  description: string;
  descriptionBn: string;
  audioNarrationEn: string;
  audioNarrationBn: string;
  hotspots: Hotspot[];
  connectedZones: string[];
}

export interface RouteStep {
  stepNumber: number;
  instructionEn: string;
  instructionBn: string;
  landmarkEn: string;
  landmarkBn: string;
  iconType: "walk" | "elevator" | "ramp" | "door" | "turn-left" | "turn-right" | "destination";
  zoneId: string;
  distanceMeters: number;
  accessibleFriendly: boolean;
}

export interface DepartmentRoute {
  id: string;
  deptNameEn: string;
  deptNameBn: string;
  category: string;
  floor: string;
  estimatedMinutes: number;
  totalDistanceMeters: number;
  wheelchairAccessible: boolean;
  steps: RouteStep[];
  qrCodeData: string;
}

export interface KidMission {
  id: string;
  titleEn: string;
  titleBn: string;
  zoneId: string;
  storyEn: string;
  storyBn: string;
  scaryConceptEn: string;
  scaryConceptBn: string;
  friendlyConceptEn: string;
  friendlyConceptBn: string;
  taskPromptEn: string;
  taskPromptBn: string;
  badgeReward: string;
  badgeIcon: string;
  options: {
    textEn: string;
    textBn: string;
    isCorrect: boolean;
    feedbackEn: string;
    feedbackBn: string;
  }[];
}

export interface MedicalCase {
  id: string;
  title: string;
  patientAgeGender: string;
  chiefComplaint: string;
  organModel: "heart" | "brain" | "knee" | "spine";
  scanType: "3D Model" | "128-Slice CT" | "3T MRI Scan";
  layers: number;
  annotatedSlice: number;
  problemAreaText: string;
  problemAreaTextBn: string;
  treatmentPlan: string;
  treatmentPlanBn: string;
}

export interface StudentSimCase {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  department: string;
  vitals: {
    hr: number;
    bp: string;
    spo2: number;
    temp: number;
  };
  scenarioEn: string;
  scenarioBn: string;
  steps: {
    id: number;
    questionEn: string;
    questionBn: string;
    choices: {
      textEn: string;
      textBn: string;
      isCorrect: boolean;
      impactEn: string;
      impactBn: string;
      scoreDelta: number;
    }[];
  }[];
}

export const HOSPITAL_ZONES: HospitalZone[] = [
  {
    id: "entrance",
    name: "Main Entrance & Welcome Atrium",
    nameBn: "প্রধান প্রবেশদ্বার ও অভ্যর্থনা কেন্দ্র",
    floor: "Ground Floor",
    floorLevel: 0,
    iconName: "Building2",
    gradientBg: "from-sky-900 via-indigo-950 to-slate-900",
    panoramaUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop",
    panoramaType: "equirectangular",
    description: "Bright, airy central entrance with digital reception kiosks, wheel-chair assistance station, and information concierges.",
    descriptionBn: "ডিজিটাল তথ্য কেন্দ্র, হুইলচেয়ার সহায়তা ডেক্স এবং প্রশান্ত অভ্যর্থনা কক্ষ।",
    audioNarrationEn: "Welcome to St. Jude General Hospital. You are currently standing at the Main Atrium. Ahead of you are the main elevators, registration desks, and central pharmacy.",
    audioNarrationBn: "সেন্ট জুড হাসপাতালে আপনাকে স্বাগতম। আপনি এখন মূল অভ্যর্থনা কেন্দ্রে অবস্থান করছেন। আপনার সামনে লিফট, তথ্য কেন্দ্র ও ফার্মেসি রয়েছে।",
    connectedZones: ["emergency", "opd", "pharmacy", "radiology"],
    hotspots: [
      {
        id: "hotspot-atrium-kiosk",
        title: "Self-Check In & Navigation Kiosk",
        titleBn: "ডিজিটাল রেজিস্ট্রেশন ও পথপ্রদর্শক কিওস্ক",
        category: "accessible",
        xPercent: 32,
        yPercent: 55,
        yawDeg: -45,
        pitchDeg: -5,
        description: "Scan appointment QR codes here for instant wristbands and digital map sync.",
        descriptionBn: "অ্যাপয়েন্টমেন্ট কিউআর কোড স্ক্যান করে ডিজিটাল ম্যাপ ও পাস গ্রহণ করুন।",
        details: {
          specs: ["Touchscreen & Braille Enabled", "Multi-lingual Voice Prompts", "Zero-contact QR Scanner"]
        }
      },
      {
        id: "hotspot-wheelchair-desk",
        title: "Accessibility Assistance Station",
        titleBn: "হুইলচেয়ার ও প্রতিবন্ধী সহায়তা কেন্দ্র",
        category: "accessible",
        xPercent: 68,
        yPercent: 60,
        yawDeg: 55,
        pitchDeg: -10,
        description: "Free motor-assisted wheelchairs and patient escort service available 24/7.",
        descriptionBn: "বিনামূল্যে মোটর-চালিত হুইলচেয়ার ও সহকারী সেবা চব্বিশ ঘণ্টা উপলব্ধ।",
        details: {
          visitingHours: "24 Hours Service",
          specs: ["Ramp connected to all blocks", "Dedicated elevator priority access"]
        }
      },
      {
        id: "hotspot-concierge-doc",
        title: "Dr. Sarah Lin - Medical Director Desk",
        titleBn: "ডঃ সারাহ লিন - সিনিয়র মেডিকেল ডিরেক্টর ডেক্স",
        category: "doctor",
        xPercent: 50,
        yPercent: 48,
        yawDeg: 0,
        pitchDeg: 0,
        description: "Senior Medical Concierge helping patients find the right specialist and clinic.",
        descriptionBn: "রোগীদের সঠিক বিশেষজ্ঞ ও বিভাগে নির্দেশনায় সহায়তা প্রদানকারী তথ্য ডেক্স।",
        details: {
          doctorName: "Dr. Sarah Lin, MD",
          doctorRole: "Chief Medical Officer & Patient Experience Director",
          visitingHours: "Mon - Sat: 8:00 AM - 5:00 PM"
        }
      }
    ]
  },
  {
    id: "emergency",
    name: "Emergency & Trauma Center",
    nameBn: "জরুরী ও ট্রমা সেন্টার (২৪/৭)",
    floor: "Ground Floor Block E",
    floorLevel: 0,
    iconName: "Siren",
    gradientBg: "from-rose-950 via-red-950 to-slate-950",
    panoramaUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000&auto=format&fit=crop",
    panoramaType: "equirectangular",
    description: "Level-1 Trauma & Rapid Resuscitation Bay equipped with life support systems and rapid ambulance dock.",
    descriptionBn: "২৪ ঘণ্টা খোলা লেভেল-১ ট্রমা ও জরুরি চিকিৎসা ইউনিট, অ্যাডভান্স লাইফ সাপোর্ট সমৃদ্ধ।",
    audioNarrationEn: "This is the Emergency and Trauma Response Bay. Our emergency physicians and trauma nurses operate around the clock with rapid triage protocols.",
    audioNarrationBn: "এটি জরুরি ও ট্রমা সেন্টার। আমাদের চিকিৎসক ও নার্সরা চব্বিশ ঘণ্টা জীবনরক্ষাকারী তাৎক্ষণিক চিকিৎসায় নিয়োজিত।",
    connectedZones: ["entrance", "radiology", "icu", "ot"],
    hotspots: [
      {
        id: "hotspot-triage-bay",
        title: "Rapid Triage & Resuscitation Station",
        titleBn: "ট্রায়াজ ও তাৎক্ষণিক পুনরুজ্জীবন কেন্দ্র",
        category: "equipment",
        xPercent: 28,
        yPercent: 50,
        yawDeg: -60,
        pitchDeg: 0,
        description: "Automated cardiac defibrillators, central vitals monitors, and rapid infusion lines.",
        descriptionBn: "স্বয়ংক্রিয় হৃৎস্পন্দন উদ্দীপক ও তাৎক্ষণিক ভাইটাল ট্র্যাকিং মনিটর।",
        details: {
          specs: ["Monitors HR, BP, SpO2, ECG in real-time", "Direct line to Cardiac Cath Lab"]
        }
      },
      {
        id: "hotspot-trauma-doc",
        title: "Dr. Rahul Amin - Emergency Chief",
        titleBn: "ডঃ রাহুল আমিন - হেড অব ইমার্জেন্সি",
        category: "doctor",
        xPercent: 72,
        yPercent: 48,
        yawDeg: 75,
        pitchDeg: -2,
        description: "Specialist in acute trauma resuscitation and critical care emergency protocol.",
        descriptionBn: "জরুরি দুর্ঘটনা ও লাইফ সাপোর্ট বিশেষজ্ঞ।",
        details: {
          doctorName: "Dr. Rahul Amin, FCPS (Emergency Medicine)",
          doctorRole: "Head of Emergency & Critical Care",
          visitingHours: "24/7 On-Call Emergency Staff"
        }
      }
    ]
  },
  {
    id: "opd",
    name: "Outpatient Clinics (OPD)",
    nameBn: "বহির্বিভাগ ক্লিনিক (OPD)",
    floor: "2nd Floor Block A",
    floorLevel: 2,
    iconName: "Stethoscope",
    gradientBg: "from-teal-950 via-slate-900 to-cyan-950",
    panoramaUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2000&auto=format&fit=crop",
    panoramaType: "equirectangular",
    description: "Spacious consultation suits for Cardiology, Orthopedics, Neurology, Internal Medicine, and ENT.",
    descriptionBn: "কার্ডিওলজি, অর্থোপেডিকস, নিউরোলজি ও মেডিসিন চিকিৎসকদের পরামর্শ কক্ষ।",
    audioNarrationEn: "Welcome to the 2nd Floor Outpatient Department. Comfortable waiting lounge with real-time digital call display screens.",
    audioNarrationBn: "দ্বিতীয় তলার বহির্বিভাগে স্বাগতম। ডিজিটাল স্ক্রিন ও আরামদায়ক ওয়েটিং লাউঞ্জ রয়েছে।",
    connectedZones: ["entrance", "pediatrics", "pharmacy"],
    hotspots: [
      {
        id: "hotspot-cardio-clinic",
        title: "Cardiology & ECG Diagnostic Suite",
        titleBn: "হৃদরোগ ও ইসিজি পরীক্ষা কেন্দ্র",
        category: "info",
        xPercent: 40,
        yPercent: 52,
        yawDeg: -20,
        pitchDeg: -3,
        description: "Echocardiogram, Stress ECG, and Holter monitoring suites.",
        descriptionBn: "ইকোকার্ডিওগ্রাম, ট্রেডমিল ইসিজি ও হার্ট স্পন্দনের সর্বাধুনিক কেন্দ্র।",
        details: {
          doctorName: "Prof. Dr. Nusrat Jahan",
          doctorRole: "Senior Interventional Cardiologist",
          visitingHours: "Mon - Thu: 9:00 AM - 4:00 PM"
        }
      },
      {
        id: "hotspot-opd-prep",
        title: "Pre-Consultation Vitals Check Desk",
        titleBn: "পরামর্শ-পূর্ব প্রাথমিক স্বাস্থ্য পরীক্ষা",
        category: "prep",
        xPercent: 65,
        yPercent: 58,
        yawDeg: 40,
        pitchDeg: -8,
        description: "Blood pressure, weight, oxygen saturation check before seeing your doctor.",
        descriptionBn: "ডাক্তার দেখানোর পূর্বে রক্তচাপ, ওজন ও অক্সিজেন পরীক্ষা কেন্দ্র।",
        details: {
          prepInstructions: "Please keep your appointment ticket and medical history file ready."
        }
      }
    ]
  },
  {
    id: "radiology",
    name: "Radiology & Diagnostic Imaging",
    nameBn: "রেডিওলজি, সিটি স্ক্যান ও এমআরআই ইউনিট",
    floor: "Ground Floor Block B",
    floorLevel: 0,
    iconName: "ScanLine",
    gradientBg: "from-indigo-950 via-slate-950 to-blue-950",
    panoramaUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop",
    panoramaType: "equirectangular",
    description: "Advanced diagnostic wing featuring 3T Silent MRI, 128-Slice CT Scan, Digital X-Ray, and Ultrasound.",
    descriptionBn: "সর্বাধুনিক ৩-টেসলা নিরব এমআরআই, ১২৮-স্লাইস সিটি স্ক্যান ও ডিজিটাল এক্স-রে।",
    audioNarrationEn: "You are inside the Diagnostic Radiology Wing. Our 3T Silent MRI scanner uses soothing ambient lighting and noise-reduction technology.",
    audioNarrationBn: "এটি রেডিওলজি ডায়াগনস্টিক ব্লক। এখানে শান্ত পরিবেশ ও শব্দহীন এমআরআই সুবিধা বিদ্যমান।",
    connectedZones: ["entrance", "emergency", "ot"],
    hotspots: [
      {
        id: "hotspot-mri-machine",
        title: "3T Silent Ambient MRI Suite",
        titleBn: "৩-টেসলা সাইলেন্ট এমআরআই স্ক্যানার",
        category: "equipment",
        xPercent: 50,
        yPercent: 50,
        yawDeg: 0,
        pitchDeg: 0,
        description: "Ultra-high resolution MRI scanner with soft ambient mood lighting and music headphones.",
        descriptionBn: "উচ্চ স্পষ্টতার এমআরআই স্ক্যানার, মনোরম হেডফোন মিউজিক ও হেড লাইট ব্যবস্থা সহ।",
        details: {
          specs: ["70cm Wide Bore (No claustrophobia)", "90% Noise Reduction Tech", "15-minute quick scans"],
          prepInstructions: "Remove all metallic objects, watches, belts, and jewelry prior to entering the MRI zone."
        }
      },
      {
        id: "hotspot-ct-scan",
        title: "128-Slice Low-Dose CT Scanner",
        titleBn: "১২৮-স্লাইস লো-ডোজ সিটি স্ক্যানার",
        category: "equipment",
        xPercent: 20,
        yPercent: 54,
        yawDeg: -80,
        pitchDeg: -5,
        description: "Ultra-fast cardiac and neuro CT imaging with 80% reduced radiation exposure.",
        descriptionBn: "৮০% কম রেডিয়েশনে অত্যন্ত দ্রুত হৃৎপিন্ড ও ব্রেইন সিটি স্ক্যান সম্পন্ন করে।",
        details: {
          prepInstructions: "Fast for 4 hours if receiving IV contrast dye."
        }
      }
    ]
  },
  {
    id: "ot",
    name: "Operation Theater (OT Clean Room)",
    nameBn: "অপারেশন থিয়েটার (ওটি ক্লিন রুম)",
    floor: "3rd Floor Block C",
    floorLevel: 3,
    iconName: "Activity",
    gradientBg: "from-emerald-950 via-slate-900 to-teal-950",
    panoramaUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop",
    panoramaType: "equirectangular",
    description: "Modular ultra-clean laminar airflow surgery theater with robotic arm systems and 4K surgical monitors.",
    descriptionBn: "রোবোটিক সার্জারি সমৃদ্ধ ও জীবাণুমুক্ত আল্ট্রা-ক্লিন এরিয়া অপারেশন থিয়েটার।",
    audioNarrationEn: "This is OT Suite 4, equipped with laminar positive-pressure air filtration to ensure 99.99% sterile environment.",
    audioNarrationBn: "এটি ৩ নম্বর অপারেশন থিয়েটার। সম্পূর্ণ জীবাণুমুক্ত বায়ু শোধন ব্যবস্থা এখানে সার্বক্ষণিক চালু থাকে।",
    connectedZones: ["icu", "radiology", "emergency"],
    hotspots: [
      {
        id: "hotspot-robot-arm",
        title: "Da Vinci Robotic Surgical Console",
        titleBn: "দা ভিঞ্চি রোবোটিক সার্জারি কনসোল",
        category: "equipment",
        xPercent: 35,
        yPercent: 48,
        yawDeg: -40,
        pitchDeg: -2,
        description: "Minimal access laparoscopic robotic surgery arm allowing sub-millimeter precision.",
        descriptionBn: "অতি ক্ষুদ্র কাটাছেঁড়ার মাধ্যমে নিখুঁত রোবোটিক সার্জারি সম্পন্ন করার প্রযুক্তি।",
        details: {
          specs: ["3D High-Definition Optics", "360-degree wrist movement arms", "Faster patient recovery time"]
        }
      },
      {
        id: "hotspot-anesth-station",
        title: "Digital Anesthesia & Life Support Console",
        titleBn: "ডিজিটাল অ্যানাস্থেসিয়া ও ভাইটাল কনসোল",
        category: "equipment",
        xPercent: 70,
        yPercent: 52,
        yawDeg: 60,
        pitchDeg: -5,
        description: "Monitors oxygenation, anesthetic gas concentration, and cardiac rhythm continuously.",
        descriptionBn: "অপারেশন চলাকালীন রোগীর গভীর ঘুম, অক্সিজেন ও পালস নিয়ন্ত্রণে রাখে।",
        details: {
          doctorName: "Dr. Farhana Ahmed",
          doctorRole: "Lead Consultant Anesthesiologist"
        }
      }
    ]
  },
  {
    id: "icu",
    name: "Intensive Care Unit (ICU & NICU)",
    nameBn: "নিবিড় পর্যবেক্ষণ কেন্দ্র (ICU)",
    floor: "4th Floor Wing A",
    floorLevel: 4,
    iconName: "HeartPulse",
    gradientBg: "from-blue-950 via-slate-900 to-indigo-950",
    panoramaUrl: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=2000&auto=format&fit=crop",
    panoramaType: "equirectangular",
    description: "1-to-1 nurse-to-patient critical care unit with dedicated ventilators, dialysis support, and quiet environment.",
    descriptionBn: "১:১ নার্স-রোগী অনুপাতের বিশেষায়িত আইসিইউ, নিরবচ্ছিন্ন পর্যবেক্ষণে সজ্জিত।",
    audioNarrationEn: "Welcome to the ICU. Every bed is equipped with advanced telemetry and 24/7 intensivist doctor supervision.",
    audioNarrationBn: "আইসিইউ ব্লকে স্বাগতম। প্রতিটি বেডে বিশেষায়িত নার্সিং ও চিকিৎসকের নিয়মিত পর্যবেক্ষণ চালু রয়েছে।",
    connectedZones: ["ot", "emergency", "ward"],
    hotspots: [
      {
        id: "hotspot-vent-sys",
        title: "Smart Mechanical Ventilator & Dialysis Port",
        titleBn: "স্মার্ট মেকানিক্যাল ভেন্টিলেটর",
        category: "equipment",
        xPercent: 45,
        yPercent: 52,
        yawDeg: -10,
        pitchDeg: -4,
        description: "Advanced lung protective ventilation with artificial intelligence breath sync.",
        descriptionBn: "রোগীর শ্বাস-প্রশ্বাসে সহায়তাকারী কৃত্রিম বুদ্ধিমত্তা চালিত ভেন্টিলেটর।",
        details: {
          visitingHours: "Strict Visiting Hours: 11:30 AM - 12:30 PM & 5:00 PM - 6:00 PM (1 visitor per patient)"
        }
      }
    ]
  },
  {
    id: "pediatrics",
    name: "Pediatric Play Care & Ward",
    nameBn: "শিশু বিভাগ ও প্লে-কেয়ার সেন্টার",
    floor: "2nd Floor Block C",
    floorLevel: 2,
    iconName: "Smile",
    gradientBg: "from-amber-950 via-purple-950 to-pink-950",
    panoramaUrl: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2000&auto=format&fit=crop",
    panoramaType: "equirectangular",
    description: "Colorful, cheerful ward designed to eliminate fear for young children, featuring games, toys, and Dr. Rabbit mascot.",
    descriptionBn: "শিশুদের ভীতি দূরীকরণে কার্টুন থিম, খেলনা ও ডক্টর র‌্যাবিট দিয়ে সাজানো প্লে এরিয়া।",
    audioNarrationEn: "Hi little explorers! Welcome to the Pediatric Play World. Dr. Rabbit and friends are here to make your visit fun!",
    audioNarrationBn: "ছোট্ট বন্ধুদের স্বাগতম! ডক্টর র‌্যাবিট ও তার বন্ধুরা তোমাদের হাসিখুশি স্বাগত জানাচ্ছে।",
    connectedZones: ["opd", "entrance"],
    hotspots: [
      {
        id: "hotspot-rabbit-corner",
        title: "Dr. Rabbit's Magic Health Shield Corner",
        titleBn: "ডক্টর র‌্যাবিটের ম্যাজিক শিল্ড কর্নার",
        category: "accessible",
        xPercent: 30,
        yPercent: 50,
        yawDeg: -50,
        pitchDeg: -2,
        description: "Interactive wall with glowing lights and stories to calm nervous children before checkups.",
        descriptionBn: "শিশুদের নার্ভাসনেস দূর করতে লাইট, কার্টুন ও মজার কমিক কর্নার।",
        details: {
          prepInstructions: "Children receive cool sticker hero badges after every doctor consultation!"
        }
      }
    ]
  },
  {
    id: "pharmacy",
    name: "24/7 Automated Pharmacy & Diagnostics",
    nameBn: "২৪/৭ ফার্মেসি ও নমুনা সংগ্রহ কেন্দ্র",
    floor: "Ground Floor Atrium",
    floorLevel: 0,
    iconName: "Pill",
    gradientBg: "from-slate-900 via-emerald-950 to-teal-950",
    panoramaUrl: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=2000&auto=format&fit=crop",
    panoramaType: "equirectangular",
    description: "Robot-assisted medication dispensing system ensuring zero prescription errors and fast delivery.",
    descriptionBn: "রোবোটিক ঔষধ বণ্টন ব্যবস্থা যা শতভাগ সঠিক ও দ্রুত ঔষধ প্রদান নিশ্চিত করে।",
    audioNarrationEn: "The 24/7 Central Pharmacy dispenses verified medications directly linked to your digital electronic medical record.",
    audioNarrationBn: "কেন্দ্রীয় ফার্মেসি চব্বিশ ঘণ্টা খোলা থাকে। প্রেসক্রিপশন স্ক্যান করে দ্রুত ঔষধ বুঝে নিন।",
    connectedZones: ["entrance", "opd"],
    hotspots: [
      {
        id: "hotspot-pharma-dispense",
        title: "Robotic Pill Sorting & Counter",
        titleBn: "রোবোটিক ঔষধ শর্টিং কাউন্টার",
        category: "equipment",
        xPercent: 55,
        yPercent: 55,
        yawDeg: 20,
        pitchDeg: -8,
        description: "Barcoded verification technology to prevent medication mix-ups.",
        descriptionBn: "বারকোড স্ক্যানিং এর মাধ্যমে সঠিক ঔষধ যাচাইকরণ প্রযুক্তি।"
      }
    ]
  },
  {
    id: "garden",
    name: "Rooftop Healing Garden & Cafeteria",
    nameBn: "ছাদ বাগান ও ক্যাফেটেরিয়া",
    floor: "6th Floor Roof",
    floorLevel: 6,
    iconName: "Sun",
    gradientBg: "from-amber-950 via-emerald-950 to-sky-950",
    panoramaUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=2000&auto=format&fit=crop",
    panoramaType: "equirectangular",
    description: "Open-air therapeutic flora garden with organic juice bar, quiet seating, and panorama city view.",
    descriptionBn: "প্রাকৃতিক আলো-বাতাস ও সবুজে ঘেরা ছাদ বাগান, অর্গানিক জুস বার ও খাবারের ঘর।",
    audioNarrationEn: "Take a deep breath! The Rooftop Healing Garden offers fresh air, sunlight, and healthy organic meals for patients and families.",
    audioNarrationBn: "মনোরম ছাদ বাগানে স্বাগতম। বিশুদ্ধ বাতাস ও পুষ্টিকর খাবার উপভোগ করুন।",
    connectedZones: ["entrance", "ward"],
    hotspots: [
      {
        id: "hotspot-zen-pond",
        title: "Therapeutic Flora Walkway",
        titleBn: "প্রাকৃতিক সবুজ ওয়াকওয়ে",
        category: "accessible",
        xPercent: 50,
        yPercent: 60,
        yawDeg: 0,
        pitchDeg: -12,
        description: "Sensory garden designed to reduce blood pressure and cortisol stress levels.",
        descriptionBn: "মানসিক প্রশান্তি বৃদ্ধিতে বিশেষভাবে পরিকল্পিত ফুল ও গাছের বাগান।"
      }
    ]
  }
];

export const DEPARTMENT_ROUTES: DepartmentRoute[] = [
  {
    id: "route-cardiology",
    deptNameEn: "Cardiology & Heart Clinic",
    deptNameBn: "কার্ডিওলজি ও হৃদরোগ বিভাগ",
    category: "Specialty Clinic",
    floor: "2nd Floor Block A",
    estimatedMinutes: 3,
    totalDistanceMeters: 140,
    wheelchairAccessible: true,
    qrCodeData: "STJUDE-NAV-CARDIO-F2A",
    steps: [
      {
        stepNumber: 1,
        instructionEn: "Enter through Main Entrance Gate 1 into the Welcome Atrium.",
        instructionBn: "প্রধান প্রবেশদ্বার ১ দিয়ে মূল অভ্যর্থনা অাট্রিয়ামে প্রবেশ করুন।",
        landmarkEn: "Main Reception Desk",
        landmarkBn: "প্রধান অভ্যর্থনা কাউন্টার",
        iconType: "walk",
        zoneId: "entrance",
        distanceMeters: 30,
        accessibleFriendly: true
      },
      {
        stepNumber: 2,
        instructionEn: "Take Elevator Bank B on your right up to the 2nd Floor.",
        instructionBn: "আপনার ডানদিকের লিফট বি ব্যবহার করে ২য় তলায় উঠুন।",
        landmarkEn: "Elevator B (Wheelchair priority)",
        landmarkBn: "লিফট বি (হুইলচেয়ার অগ্রাধিকার)",
        iconType: "elevator",
        zoneId: "entrance",
        distanceMeters: 25,
        accessibleFriendly: true
      },
      {
        stepNumber: 3,
        instructionEn: "Exit elevator and follow the Blue Cardiology line on the floor.",
        instructionBn: "লিফট থেকে বের হয়ে মেঝের নীল স্ট্রিপ অনুসরণ করে এগিয়ে যান।",
        landmarkEn: "Block A Corridor",
        landmarkBn: "ব্লক এ করিডোর",
        iconType: "turn-right",
        zoneId: "opd",
        distanceMeters: 50,
        accessibleFriendly: true
      },
      {
        stepNumber: 4,
        instructionEn: "Arrive at Consultation Room 204 (Cardiology Reception).",
        instructionBn: "রুম ২০৪ (কার্ডিওলজি কাউন্টারে) পৌঁছে গিয়েছেন।",
        landmarkEn: "Room 204 - Cardiology",
        landmarkBn: "রুম ২০৪ - হৃদরোগ বিভাগ",
        iconType: "destination",
        zoneId: "opd",
        distanceMeters: 35,
        accessibleFriendly: true
      }
    ]
  },
  {
    id: "route-radiology",
    deptNameEn: "MRI & CT Scan Suite",
    deptNameBn: "এমআরআই ও সিটি স্ক্যান বিভাগ",
    category: "Diagnostics",
    floor: "Ground Floor Block B",
    estimatedMinutes: 2,
    totalDistanceMeters: 80,
    wheelchairAccessible: true,
    qrCodeData: "STJUDE-NAV-RADIO-GFB",
    steps: [
      {
        stepNumber: 1,
        instructionEn: "From Main Entrance, turn left towards Block B Corridor.",
        instructionBn: "প্রধান প্রবেশদ্বার থেকে বামে ঘুরে ব্লক বি করিডোরে হাঁটুন।",
        landmarkEn: "Information Concierge",
        landmarkBn: "তথ্য কেন্দ্র",
        iconType: "turn-left",
        zoneId: "entrance",
        distanceMeters: 35,
        accessibleFriendly: true
      },
      {
        stepNumber: 2,
        instructionEn: "Pass through the smooth automated double glass doors with ramp access.",
        instructionBn: "স্বয়ংক্রিয় কাচের দরজা ও রাম্প পথ পেরিয়ে এগিয়ে চলুন।",
        landmarkEn: "Block B Ramp Entrance",
        landmarkBn: "ব্লক বি রাম্প প্রবেশদ্বার",
        iconType: "ramp",
        zoneId: "radiology",
        distanceMeters: 25,
        accessibleFriendly: true
      },
      {
        stepNumber: 3,
        instructionEn: "Arrive at Radiology Reporting Desk & MRI Suite 2.",
        instructionBn: "রেডিওলজি অভ্যর্থনা ও এমআরআই স্ক্যান কক্ষ ২ এ পৌঁছান।",
        landmarkEn: "Radiology Desk B-12",
        landmarkBn: "রেডিওলজি কাউন্টার বি-১২",
        iconType: "destination",
        zoneId: "radiology",
        distanceMeters: 20,
        accessibleFriendly: true
      }
    ]
  },
  {
    id: "route-emergency",
    deptNameEn: "Emergency & Trauma Bay",
    deptNameBn: "জরুরী বিভাগ (২৪ ঘণ্টা)",
    category: "Emergency",
    floor: "Ground Floor Gate 2",
    estimatedMinutes: 1,
    totalDistanceMeters: 45,
    wheelchairAccessible: true,
    qrCodeData: "STJUDE-NAV-EMERGENCY-GF",
    steps: [
      {
        stepNumber: 1,
        instructionEn: "Drive or walk directly to Emergency Red Gate 2 Entrance.",
        instructionBn: "জরুরী গাড়ি অথবা পায়ে হেঁটে গেইট ২ এর লাল সংকেত ধরে সরাসরি আসুন।",
        landmarkEn: "Ambulance Bay Gate 2",
        landmarkBn: "অ্যাম্বুলেন্স বে গেইট ২",
        iconType: "walk",
        zoneId: "emergency",
        distanceMeters: 25,
        accessibleFriendly: true
      },
      {
        stepNumber: 2,
        instructionEn: "Triage desk is immediately inside on the left with instant medical attention.",
        instructionBn: "ভেতরে ঢুকেই বামে তাৎক্ষণিক ট্রায়াজ ডেক্স অবস্থান করছে।",
        landmarkEn: "Emergency Triage Station",
        landmarkBn: "ইমার্জেন্সি ট্রায়াজ কেন্দ্র",
        iconType: "destination",
        zoneId: "emergency",
        distanceMeters: 20,
        accessibleFriendly: true
      }
    ]
  }
];

export const KIDS_MISSIONS: KidMission[] = [
  {
    id: "mission-mri",
    titleEn: "The Space Explorer MRI Mission",
    titleBn: "স্পেস এক্সপ্লোরার এমআরআই মিশন",
    zoneId: "radiology",
    storyEn: "Dr. Rabbit needs to check Captain Johnny's space helmet before launching into orbit! But the space scanner machine looks big and makes funny noises.",
    storyBn: "মহাকাশে রকেট উৎক্ষেপণের আগে ডক্টর র‌্যাবিট জনির স্পেস হেলমেট পরীক্ষা করতে চায়! কিন্তু মহাকাশ স্ক্যানার মেশিনটি দেখতে বেশ বড়।",
    scaryConceptEn: "Scary MRI Machine & Loud Thumping Noises",
    scaryConceptBn: "ভীতিজনক বড় এমআরআই এবং বিকট শব্দ",
    friendlyConceptEn: "Magic Astronaut Tunnel with Music Headphones",
    friendlyConceptBn: "সুরময় হেডফোন সহ জাদুকরী মহাকাশ রকেট টানেল",
    taskPromptEn: "What special gear does Captain Johnny wear inside the magic Space Tunnel to listen to his favorite cartoon song?",
    taskPromptBn: "মহাকাশ টানেলে প্রিয় কার্টুন গান শুনতে জনিকে কী দেওয়া হয়?",
    badgeReward: "Space Explorer MRI Badge",
    badgeIcon: "Rocket",
    options: [
      {
        textEn: "Cool Magic Sound Headphones!",
        textBn: "মজাদার ম্যাজিক হেডফোন!",
        isCorrect: true,
        feedbackEn: "Correct! The headphones block out loud noises and play your favorite music while you lie cozy!",
        feedbackBn: "একদম সঠিক! এই হেডফোন তোমাকে মিষ্টি গান শুনিয়ে শুয়ে রাখতে সাহায্য করে!"
      },
      {
        textEn: "Heavy iron armor",
        textBn: "ভারী লোহার বর্ম",
        isCorrect: false,
        feedbackEn: "No metals allowed in space! Magic headphones are way cozier!",
        feedbackBn: "মহাকাশে কোনো ধাতু চলে না! হেডফোনই সেরা!"
      }
    ]
  },
  {
    id: "mission-injection",
    titleEn: "The Magic Shield Vaccine Booster",
    titleBn: "ম্যাজিক শিল্ড ভ্যাকসিন বুস্টার",
    zoneId: "opd",
    storyEn: "To get your Super Hero Power Shield, the friendly nurse puts a tiny magic drop that protects your body from invisible monster bugs!",
    storyBn: "তোমার শরীরে সুপারহিরো পাওয়ার শিল্ড তৈরি করতে নার্স একটি জাদুকরী ফোটা প্রয়োগ করবেন যা জীবাণু তাড়ায়!",
    scaryConceptEn: "Needle Pinch / Injection Fear",
    scaryConceptBn: "সুই ফোটানোর ভয়",
    friendlyConceptEn: "1-Second Superhero Power Sticker Touch",
    friendlyConceptBn: "১ সেকেণ্ডের সুপারহিরো স্টিকার ছোঁয়া",
    taskPromptEn: "How long does it take for the magic booster to give you superhero powers?",
    taskPromptBn: "ম্যাজিক বুস্টার তোমাকে কত দ্রুত ক্ষমতা দেয়?",
    badgeReward: "Brave Hero Shield Badge",
    badgeIcon: "ShieldCheck",
    options: [
      {
        textEn: "Just 1 quick count of '3-2-1 POOF!' with a cool sticker!",
        textBn: "মাত্র ৩ সেকেণ্ড গুণেই বাহবা স্টিকার পেয়ে যাবে!",
        isCorrect: true,
        feedbackEn: "Super! Just take a deep breath, blow out like birthday candles, and it's all done!",
        feedbackBn: "সাবাস! মোমবাতি নেভানোর মতো ফু দিলেই কাজ শেষ!"
      },
      {
        textEn: "An entire hour of waiting",
        textBn: "এক ঘণ্টার অপেক্ষা",
        isCorrect: false,
        feedbackEn: "Nope! It's over in a blink of an eye!",
        feedbackBn: "না! এটি চোখের নিমিষেই শেষ হয়!"
      }
    ]
  }
];

export const MEDICAL_3D_CASES: MedicalCase[] = [
  {
    id: "case-heart",
    title: "Coronary Artery Atherosclerosis & Stent Placement",
    patientAgeGender: "58-year-old Male",
    chiefComplaint: "Exertional chest tightness radiating to left arm",
    organModel: "heart",
    scanType: "3D Model",
    layers: 5,
    annotatedSlice: 3,
    problemAreaText: "75% stenosis identified in Left Anterior Descending (LAD) coronary artery.",
    problemAreaTextBn: "এলএডি দমনীর হৃদপিণ্ড রক্তনালীতে ৭৫% রক্তপ্রবাহ বাধা চিহ্নিত।",
    treatmentPlan: "Drug-eluting stent (DES) placement via radial artery catheterization.",
    treatmentPlanBn: "ক্যাথেটার ড্রাগ-এলুটিং স্টেন্ট (রেনাল রিং) স্থাপন।"
  },
  {
    id: "case-knee",
    title: "Medial Meniscus Tear & ACL Ligament Strain",
    patientAgeGender: "32-year-old Female",
    chiefComplaint: "Knee instability and popping sensation after sports injury",
    organModel: "knee",
    scanType: "3T MRI Scan",
    layers: 8,
    annotatedSlice: 4,
    problemAreaText: "Grade-II hyperintensity in posterior horn of medial meniscus; partial ACL fibers tear.",
    problemAreaTextBn: "হাঁটুর লিগামেন্টে মধ্যম মাত্রার ইনজুরি ও আংশিক টিয়ার দেখায়।",
    treatmentPlan: "Arthroscopic meniscus repair and physical rehab therapy.",
    treatmentPlanBn: "আর্থ্রোস্কোপিক লেজার চিকিৎসা ও ফিজিক্যাল থেরাপি।"
  },
  {
    id: "case-spine",
    title: "L4-L5 Lumbar Disc Herniation with Sciatica",
    patientAgeGender: "45-year-old Male",
    chiefComplaint: "Lower back pain radiating down right leg",
    organModel: "spine",
    scanType: "128-Slice CT",
    layers: 6,
    annotatedSlice: 2,
    problemAreaText: "Posterolateral protrusion compressing L5 nerve root.",
    problemAreaTextBn: "কোমরের এল৪-এল৫ স্পাইনাল ডিস্ক নার্ভে চাপ সৃষ্টি করছে।",
    treatmentPlan: "Microdiscectomy or targeted epidural steroid injection.",
    treatmentPlanBn: "টার্গেটেড এপিডিউরাল ইনজেকশন অথবা ক্ষুদ্র মাইক্রোডিস্কেক্টমি।"
  }
];

export const STUDENT_SIMULATION_CASES: StudentSimCase[] = [
  {
    id: "student-sim-1",
    title: "Acute Coronary Syndrome Emergency Protocol",
    difficulty: "Intermediate",
    department: "Emergency & Cardiology",
    vitals: { hr: 112, bp: "155/95", spo2: 92, temp: 36.8 },
    scenarioEn: "54yo male presents to ER with crushing substernal chest pain, diaphoresis, and nausea lasting 45 minutes. ECG shows 2.5mm ST-elevation in V1-V4.",
    scenarioBn: "৫৪ বছর বয়সী ব্যক্তি বুকে তীব্র চাপ ও ঘাম নিয়ে ইমার্জেন্সিতে এসেছেন। ইসিজিতে এসটি-ইলেভেশন ধরা পড়েছে।",
    steps: [
      {
        id: 1,
        questionEn: "What is your immediate priority initial triage order?",
        questionBn: "আপনার প্রথম জরুরি চিকিৎসা পদক্ষেপ কী হবে?",
        choices: [
          {
            textEn: "High-flow Oxygen + Aspirin 300mg + STAT 12-lead ECG + Nitroglycerin sublingual",
            textBn: "হাই-ফ্লো অক্সিজেন + অ্যাসপিরিন ৩০০ মিগ্রা + ১২-লিড ইসিজি + নাইট্রোগ্লিসারিন",
            isCorrect: true,
            impactEn: "Optimal protocol! Pain relieved within 3 mins and cardiac team alerted.",
            impactBn: "চমৎকার চিকিৎসা! ব্যথা ৩ মিনিটে উপশম হলো ও টিমে অ্যালার্ট জারি হলো।",
            scoreDelta: 25
          },
          {
            textEn: "Send patient for full body CT scan first",
            textBn: "প্রথমে ফুল বডি সিটি স্ক্যান করতে পাঠান",
            isCorrect: false,
            impactEn: "Delay in ACS protocol causes ischemic myocardium damage (-15 pts)",
            impactBn: "দেরি করার কারণে হৃদপিণ্ডের ক্ষতি হচ্ছে (-১৫ পয়েন্ট)",
            scoreDelta: -15
          }
        ]
      },
      {
        id: 2,
        questionEn: "ECG confirms STEMI. What is the target door-to-balloon Cath Lab time?",
        questionBn: "STEMI নিশ্চিত হওয়ার পর ক্যাথ ল্যাবে এনজিওপ্লাস্টির টার্গেট সময় কত?",
        choices: [
          {
            textEn: "Within < 90 minutes",
            textBn: "৯০ মিনিটের মধ্যে",
            isCorrect: true,
            impactEn: "Guideline compliant! Rapid balloon inflation restores coronary flow.",
            impactBn: "নির্দেশিকা অনুসরণ করেছেন! দ্রুত রক্তপ্রবাহ পুনরুদ্ধার হলো।",
            scoreDelta: 25
          },
          {
            textEn: "Within 24 hours after bed rest",
            textBn: "২৪ ঘণ্টার মধ্যে রেস্টের পর",
            isCorrect: false,
            impactEn: "Exceeds window! Myocardial necrosis risks severe heart failure (-20 pts)",
            impactBn: "সময়সীমা অতিক্রম করার কারণে রোগীর জীবন ঝুঁকিপূর্ণ (-২০ পয়েন্ট)",
            scoreDelta: -20
          }
        ]
      }
    ]
  }
];
