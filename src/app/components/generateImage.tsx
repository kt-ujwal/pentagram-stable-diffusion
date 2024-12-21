/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
interface ImageGeneratorProps {
  generateImage: (
    text: string
  ) => Promise<{ success: boolean; imageUrl?: string; error?: string }>;
}

export default function ImageGenerator({ generateImage }: ImageGeneratorProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsLoading(true);
    setImageUrl(null);
    setError(null);

    try {
      const result = await generateImage(inputText);

      if (!result.success) {
        throw new Error(result.error || "Failed to generate image");
      }
      if (result.imageUrl) {
        const img = new Image();
        img.onload = () => {
          setImageUrl(result.imageUrl);
        };
        img.src = result.imageUrl;
      }
      setInputText("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-between p-8 bg-gradient-to-br from-white via-gray-500 to-black text-white">
      <main className="flex-1 flex flex-col items-center gap-8">
        {imageUrl && (
          <div className="full max-w-2xl rounded-lg overflow-hidden shadow-lg">
            <img
              src={imageUrl}
              alt="
          generated artwork"
              className="w-full h-auto"
            />
          </div>
        )}
      </main>

      <footer className="w-full max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-black/[.05] dark:bg-white/[.06] text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 border border-black/[.08] dark:border-white/[.15] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="Describe the image you want to generate..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-lg bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}