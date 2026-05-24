import { Metadata } from "next";
import AllWork from "@/components/sections/AllWork";
export const metadata: Metadata = {
  title: "Work",
  description:
    "We build digital identities and web experiences for brands that take the long view.",
}

export default function WorkPage() {
  return <AllWork />
}