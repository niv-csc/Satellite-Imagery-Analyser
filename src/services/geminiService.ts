import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface SatelliteAnalysis {
  imageType: "earth" | "astronomy";
  authenticity: {
    status: "authentic" | "suspicious" | "fake";
    confidence: number;
    reason: string;
  };
  geospatial: {
    vegetation: number;
    waterBodies: string;
    urban: number;
    agriculture: number;
    bareSoil: number;
    cloudCover: number;
    landUse: string;
  };
  location: {
    lat: number;
    lng: number;
    name: string;
    country: string;
    inferred: boolean;
  };
  astronomyData?: {
    type: "nebula" | "galaxy" | "star_cluster" | "deep_space" | "planet" | "other";
    title: string;
    description: string;
  };
  metadata: {
    satellite: string;
    description: string;
  };
}

export async function analyzeSatelliteImage(base64Data: string, mimeType: string): Promise<SatelliteAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this image. It could be a satellite image of Earth or an astronomy/space image (nebula, galaxy, stars, etc.).
            
            1. First, determine if it is an "earth" satellite image or an "astronomy" image.
            2. If "earth": Provide a detailed geospatial report including land use, vegetation/water/urban percentages, and geographic location.
            3. If "astronomy": Identify the celestial object type (nebula, galaxy, etc.), provide a title and a scientific description. Set location coordinates to 0,0.
            4. Verify authenticity for both types.
            
            Return the response in this exact JSON structure:
            {
              "imageType": "earth" | "astronomy",
              "authenticity": { "status": "authentic" | "suspicious" | "fake", "confidence": number (0-1), "reason": string },
              "geospatial": { "vegetation": number (0-100), "waterBodies": string, "urban": number (0-100), "agriculture": number (0-100), "bareSoil": number (0-100), "cloudCover": number (0-100), "landUse": string },
              "location": { "lat": number, "lng": number, "name": string, "country": string, "inferred": boolean },
              "astronomyData": { "type": "nebula" | "galaxy" | "star_cluster" | "deep_space" | "planet" | "other", "title": string, "description": string } (optional, only for astronomy),
              "metadata": { "satellite": string, "description": string }
            }`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          imageType: { type: Type.STRING, enum: ["earth", "astronomy"] },
          authenticity: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING, enum: ["authentic", "suspicious", "fake"] },
              confidence: { type: Type.NUMBER },
              reason: { type: Type.STRING },
            },
            required: ["status", "confidence", "reason"],
          },
          geospatial: {
            type: Type.OBJECT,
            properties: {
              vegetation: { type: Type.NUMBER },
              waterBodies: { type: Type.STRING },
              urban: { type: Type.NUMBER },
              agriculture: { type: Type.NUMBER },
              bareSoil: { type: Type.NUMBER },
              cloudCover: { type: Type.NUMBER },
              landUse: { type: Type.STRING },
            },
            required: ["vegetation", "waterBodies", "urban", "agriculture", "bareSoil", "cloudCover", "landUse"],
          },
          location: {
            type: Type.OBJECT,
            properties: {
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
              name: { type: Type.STRING },
              country: { type: Type.STRING },
              inferred: { type: Type.BOOLEAN },
            },
            required: ["lat", "lng", "name", "country", "inferred"],
          },
          astronomyData: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ["nebula", "galaxy", "star_cluster", "deep_space", "planet", "other"] },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["type", "title", "description"],
          },
          metadata: {
            type: Type.OBJECT,
            properties: {
              satellite: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["satellite", "description"],
          },
        },
        required: ["imageType", "authenticity", "geospatial", "location", "metadata"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No analysis received from AI");
  return JSON.parse(text);
}
