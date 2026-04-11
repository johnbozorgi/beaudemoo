export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  birthday: string;
  gender: "Male" | "Female" | "Other";
  weight: string;
  healthScore: number;
  lastVetVisit: string;
  color: string;
  microchipId?: string;
  isSpayedNeutered: boolean;
  image?: string;
}

export type UnitSystem = "Metric" | "Imperial";

export interface Symptom {
  id: string;
  name: string;
  severity: "Low" | "Medium" | "High";
  date: string;
  notes?: string;
}

export interface Insurance {
  id: string;
  type: "Health" | "Vision" | "Dental" | "Life" | "Other";
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  phoneNumber?: string;
  cardFront?: string;
  cardBack?: string;
  holderName: string;
  expirationDate?: string;
  memberId: string;
  userId?: string; // Optional, to link to a specific user/family member
}

export interface BioDigitalIdentity {
  // 1. Core Demographic Data
  identity: {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    genderIdentity?: string;
    ethnicity: string;
    eyeColor?: string;
    occupation?: string;
    dateOfBirth: string;
    profilePhoto?: string;
    bloodType?: string;
  };
  contact: {
    address: string;
    city: string;
    country: string;
    phone: string;
    email: string;
  };

  // 2. Medical History
  medicalHistory: {
    diagnosedConditions: string[];
    surgeries: string[];
    hospitalizations: string[];
    allergies: string[];
    chronicDiseases: string[];
  };

  // 3. Biological & Genetic (Biomarkers)
  biological: {
    height: number; // stored in cm internally
    weight: number; // stored in kg internally
    eyeMovement: string; // Placeholder for eye movement data
    dnaDataUrl?: string;
    familyHistory: string[];
    bloodType: string;
    geneticRiskMarkers: string[];
    visualBiomarkers?: { id: string; url: string; date: string; label: string }[];
  };

  // 4. Lifestyle
  lifestyle: {
    dietType: string;
    activityLevel: "Sedentary" | "Active" | "Very Active";
    activity: {
      steps: number;
      exerciseType: string;
      frequency: string;
    };
    sleep: {
      duration: number;
      quality: string;
      circadianRhythm: string;
    };
    nutrition: {
      dietType: string;
      foodLogs: string[];
      hydration: number;
    };
    habits: {
      smoking: string;
      alcohol: string;
      caffeine: string;
      drugUse: string;
    };
    sleepHabits: string;
    smokingStatus: string;
    alcoholUse: string;
    stressLevel: number; // 1-10
    hobbies: string[];
    socialLife: string;
  };

  // 5. Behavioral & Digital
  behavioral: {
    wearableDevice: string;
    screenTime: string;
    dailyRoutines: string[];
    engagementPatterns: string;
    digitalFootprint: string;
  };

  // 6. Cognitive & Psychological
  cognitive: {
    personalityTraits: string[];
    motivationType: string;
    healthMindset: "Preventive" | "Reactive";
    riskTolerance: string;
    mentalWellbeing: string;
  };

  // 7. Psychology
  psychology: {
    stressLevels: number;
    moodTracking: string;
    anxietyDepressionHistory: string;
    cognitivePerformance: string;
    focusProductivity: string;
    emotionalRegulation: string;
  };

  // 8. Location (Environmental)
  location: {
    currentLocation: string;
    airQualityExposure: string;
    uvExposure: string;
    temperature: string;
    noise: string;
    occupationalHazards: string;
    travelPatterns: string;
  };

  // 9. Medical Devices
  medicalDevices: {
    appleHealthGoogleFit: boolean;
    wearables: string[];
    smartScales: string;
    labProviders: string[];
    ehrIntegrations: string[];
  };

  // 10. Health Goals
  healthGoals: {
    fitnessGoals: string[];
    weightGoals: string;
    longevityGoals: string[];
    diseasePreventionFocus: string[];
    sleepOptimization: string;
    mentalHealthImprovement: string;
  };

  // 11. Family & Network
  network: {
    linkedAccounts: string[];
    relationships: string[];
    sharedRiskFactors: string[];
    householdEnvironment: string;
    emergencyContact: string;
  };

  // 12. Privacy & Research
  privacy: {
    isPrivate: boolean;
    sharedWithFamily: boolean;
    sharedWithDoctors: boolean;
    usedForResearch: boolean;
  };
  research: {
    willingnessToJoinStudies: boolean;
    conditionsOfInterest: string[];
    locationForInPerson: string;
    compensationPreference: string;
    dataDonation: boolean;
  };
}
