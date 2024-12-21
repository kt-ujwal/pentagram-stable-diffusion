import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    const apiKey = request.headers.get("X-API-KEY");
    console.log("apiKey", apiKey);
    if (apiKey !== process.env.API_KEY) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }
    console.log(text);
    const modelUrl = process.env.MODEL_URL;
    const url = new URL(modelUrl || "");
    console.log("Requesting URL:",url.toString());
    url.searchParams.set("prompt", text);
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.API_KEY || "",
        Accept: "image/jpeg",
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error:", errorText);
      throw new Error(
        `HTTP error status: ${response.status}, message: ${errorText}`
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const filename = `${crypto.randomUUID()}.jpg`;

    const blob = await put(filename, imageBuffer, {
      access: "public",
      contentType: "image/jpeg",
    });
    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}