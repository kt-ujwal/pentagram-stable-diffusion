"use server";

import ImageGenerator from "./components/generateImage";
import { generateImage } from "./actions/generateImage";
export default async function Home() {
  return <ImageGenerator generateImage={generateImage} />;
}