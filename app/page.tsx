import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";
import { TrustValueStrip } from "@/components/home/TrustValueStrip";
import { ProblemSolution } from "@/components/home/ProblemSolution";
import { WhatIsTrainovate } from "@/components/home/WhatIsTrainovate";
import { CoreCapabilities } from "@/components/home/CoreCapabilities";
import { CinematicBanner } from "@/components/home/CinematicBanner";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LiveProductCallout } from "@/components/home/LiveProductCallout";
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
      <ProblemSolution />
      <WhatIsTrainovate />
      <CoreCapabilities />
      <CinematicBanner />
      <HowItWorks />
      <LiveProductCallout />
      <IndustriesSnapshot />
      <WhyTrainovate />
      <Mission />
      <FinalCTA />
    </>
  );
}
