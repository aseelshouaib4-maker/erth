import type { Metadata } from "next";
import { SpiderWeb } from "@/components/eye/SpiderWeb";
import { EyeIndex } from "@/components/eye/EyeIndex";

export const metadata: Metadata = { title: "عين" };

export default function EyePage() {
  return (
    <>
      <SpiderWeb />
      <EyeIndex />
    </>
  );
}
