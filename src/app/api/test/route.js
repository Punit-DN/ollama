import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function GET() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: "Say hello to my website chatbot in one short sentence.",
    });

    return NextResponse.json({
      success: true,
      message: response.text,
    });
  } catch (error) {
    console.error("FULL GEMINI ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || String(error),
        status: error?.status || null,
        details: error?.errorDetails || null,
      },
      { status: 500 }
    );
  }
}