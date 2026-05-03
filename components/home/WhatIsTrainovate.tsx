import { Eyebrow } from "@/components/ui/Eyebrow";

export function WhatIsTrainovate() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <Eyebrow index="02" label="WHAT IS TRAINOVATE" />
            <h2 className="tnv-h2 mt-6 max-w-md text-balance">
              A workforce training company built for{" "}
              <span className="tnv-italic text-signal">high-stakes work.</span>
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-5 tnv-body text-pretty text-lg">
            <p>
              Trainovate is a veteran-founded workforce training company
              focused on high-risk, high-responsibility industries.
            </p>
            <p>
              We design and build training systems that go beyond compliance
              — helping organizations develop capable, confident teams who
              can perform under real-world conditions.
            </p>
            <p>
              Our work combines technology, instructional design, and
              operational insight into one cohesive system.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
