"use server";

export async function generateImage(text: string) {
  try {
    const response = await fetch("http://localhost:3002/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.API_KEY || "",
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Server Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate image",
    };
  }
}