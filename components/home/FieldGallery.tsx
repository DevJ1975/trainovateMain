import { Eyebrow } from "@/components/ui/Eyebrow";
import { StockImage } from "@/components/ui/StockImage";

const fields = [
  { key: "field.manufacturing", vertical: "Manufacturing", stat: "700+ LOTO placards · multi-site CPG" },
  { key: "field.warehouse", vertical: "Warehousing / Distribution", stat: "Inspection cycles instrumented end-to-end" },
  { key: "field.aviation", vertical: "Aviation MRO", stat: "Tooling control + program governance" },
  { key: "field.cannabis", vertical: "Cannabis Cultivation", stat: "GMP-aligned EHS programs" },
  { key: "field.energy", vertical: "Oil & Gas · SIMOPS", stat: "High-consequence training in production" },
  { key: "field.food", vertical: "Food Processing", stat: "USDA / SQF-aligned compliance flows" },
];

export function FieldGallery() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <Eyebrow index="03" label="IN THE FIELD" />
            <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
              Where the <span className="tnv-italic text-signal">work</span> happens.
            </h2>
          </div>
          <p className="tnv-body max-w-md text-pretty">
            Trainovate ships in the industries that don't tolerate prototype-grade
            tooling. Below: representative verticals with active or production deployments.
          </p>
        </div>
      </div>

      {/* Horizontal scroll gallery */}
      <div className="mt-16 overflow-x-auto pb-8 scroll-smooth snap-x snap-mandatory" style={{ scrollbarWidth: "thin" }}>
        <ul className="flex gap-6 px-6 md:px-10 lg:px-16">
          {fields.map((f, i) => (
            <li
              key={f.key}
              className="flex-shrink-0 w-[78vw] sm:w-[60vw] md:w-[44vw] lg:w-[32vw] snap-start group"
            >
              <div className="relative aspect-[4/5]">
                <StockImage
                  stockKey={f.key}
                  className="absolute inset-0 w-full h-full"
                  sizes="(min-width: 1024px) 32vw, 78vw"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 z-10">
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-signal">
                    {String(i + 1).padStart(2, "0")} / {String(fields.length).padStart(2, "0")}
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl text-bone mt-2 tracking-tight">
                    {f.vertical}
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-eyebrow text-bone/80 mt-2">
                    {f.stat}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
