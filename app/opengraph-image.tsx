import { OG_SIZE, ogImage } from "@/lib/og";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage("See where your business stands.");
}
