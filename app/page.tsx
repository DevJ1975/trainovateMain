import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";
import { ProblemSolution } from "@/components/home/ProblemSolution";
import { WhatIsTrainovate } from "@/components/home/WhatIsTrainovate";
import { CoreCapabilities } from "@/components/home/CoreCapabilities";
import { HowItWorks } from "@/components/home/HowItWorks";
import { IndustriesSnapshot } from "@/components/home/IndustriesSnapshot";
import { WhyTrainovate } from "@/components/home/WhyTrainovate";
import { Mission } from "@/components/home/Mission";
import { FinalCTA } from "@/components/home/FinalCTA";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";

const SceneRoot = dynamic(
  () => import("@/components/three/SceneRoot").then((m) => m.SceneRoot),
  { ssr: false }
);

export default function HomePage() {
  return (
    <>
      <SceneRoot />
      <Hero />
      <ProblemSolution />
      <WhatIsTrainovate />
      <MarqueeStrip />
      <CoreCapabilities />
      <HowItWorks />
      <IndustriesSnapshot />
      <WhyTrainovate />
      <Mission />
      <FinalCTA />
    </>
  );
}
