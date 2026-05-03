import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";
import { TrustValueStrip } from "@/components/home/TrustValueStrip";
import { PhotoStrip } from "@/components/home/PhotoStrip";
import { ProblemSolution } from "@/components/home/ProblemSolution";
import { WhatIsTrainovate } from "@/components/home/WhatIsTrainovate";
import { CoreCapabilities } from "@/components/home/CoreCapabilities";
import { HowItWorks } from "@/components/home/HowItWorks";
import { IndustriesSnapshot } from "@/components/home/IndustriesSnapshot";
import { WhyTrainovate } from "@/components/home/WhyTrainovate";
import { Mission } from "@/components/home/Mission";
import { FinalCTA } from "@/components/home/FinalCTA";

const SceneRoot = dynamic(
  () => import("@/components/three/SceneRoot").then((m) => m.SceneRoot),
  { ssr: false }
);

export default function HomePage() {
  return (
    <>
      <SceneRoot />
      <Hero />
      <TrustValueStrip />
      <PhotoStrip />
      <ProblemSolution />
      <WhatIsTrainovate />
      <CoreCapabilities />
      <HowItWorks />
      <IndustriesSnapshot />
      <WhyTrainovate />
      <Mission />
      <FinalCTA />
    </>
  );
}
