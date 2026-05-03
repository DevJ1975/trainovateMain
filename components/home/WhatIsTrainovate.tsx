import { Eyebrow } from "@/components/ui/Eyebrow";

export function WhatIsTrainovate() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <Eyebrow index="02" label="WHAT IS TRAINOVATE" />
            <h2 className="tnv-h2 mt-6 max-w-md text-balance">
              A workforce training platform with{" "}
              <span className="tnv-italic text-signal">an operator&rsquo;s mind.</span>
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="tnv-body text-pretty text-lg">
              Trainovate is a veteran-founded workforce training company
              building Soteria — an AI-powered, immersive learning platform
              for industries where the cost of a missed step is real. We
              design programs around the actual work, ship them to the device
              the worker already carries, and instrument every step so
              leadership can see what is landing.
            </p>
            <p className="tnv-body text-pretty text-lg mt-5">
              We serve manufacturing, construction, energy, aviation,
              healthcare, and the federal mission space. SDVOSB.
              Headquartered in Las Vegas, Nevada.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
