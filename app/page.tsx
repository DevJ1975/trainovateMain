import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";
import { Doctrine } from "@/components/home/Doctrine";
import { SoteriaStack } from "@/components/home/SoteriaStack";
import { FieldGallery } from "@/components/home/FieldGallery";
import { FederalPanel } from "@/components/home/FederalPanel";
import { Trajectory } from "@/components/home/Trajectory";
import { HomeContact } from "@/components/home/HomeContact";
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
      <Doctrine />
      <MarqueeStrip />
      <SoteriaStack />
      <FieldGallery />
      <FederalPanel />
      <Trajectory />
      <HomeContact />
    </>
  );
}
