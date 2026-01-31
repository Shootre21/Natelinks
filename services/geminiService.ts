
import { GoogleGenAI, Type } from "@google/genai";
import { ProfileData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const updateProfileWithAI = async (
  currentProfile: ProfileData,
  userInstruction: string
): Promise<ProfileData> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Current Profile: ${JSON.stringify(currentProfile)}
      User Instruction: ${userInstruction}
      
      Instructions:
      1. Update the current profile data based on the user instruction.
      2. If the user asks for a theme change, pick appropriate colors.
      3. Return the FULL updated profile JSON object.
      4. Do not change IDs of existing links unless asked to delete.
      5. Ensure links have valid URLs.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          handle: { type: Type.STRING },
          displayName: { type: Type.STRING },
          avatarUrl: { type: Type.STRING },
          bio: { type: Type.STRING },
          links: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                url: { type: Type.STRING },
                icon: { type: Type.STRING }
              },
              required: ["id", "label", "url"]
            }
          },
          theme: {
            type: Type.OBJECT,
            properties: {
              backgroundGradient: { type: Type.STRING },
              buttonColor: { type: Type.STRING },
              buttonTextColor: { type: Type.STRING }
            },
            required: ["backgroundGradient", "buttonColor", "buttonTextColor"]
          },
          contactInfo: {
            type: Type.OBJECT,
            properties: {
              email: { type: Type.STRING },
              phone: { type: Type.STRING }
            }
          }
        },
        required: ["handle", "displayName", "avatarUrl", "bio", "links", "theme"]
      }
    }
  });

  try {
    const updatedData = JSON.parse(response.text);
    return updatedData as ProfileData;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("The AI returned an invalid profile structure.");
  }
};
