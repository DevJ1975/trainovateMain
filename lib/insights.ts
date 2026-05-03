export type InsightPost = {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  draft: boolean;
  excerpt: string;
  body: string[];
  topic: string;
};

export const insights: InsightPost[] = [
  {
    slug: "why-most-safety-training-is-theater",
    title: "Why most safety training is theater",
    date: "2026-04-12",
    readTime: "6 min",
    draft: true,
    topic: "DOCTRINE",
    excerpt:
      "Compliance is a verb the industry conjugates badly. The slide deck is not the program. The signature is not the proof.",
    body: [
      "There is a category of safety training that exists almost entirely to generate signatures. The crew sits in a trailer. Someone reads a deck. A roster is signed. The roster is filed. The auditor sees the roster. The auditor goes home. The hazard the training was supposed to address is unchanged.",
      "This is not training. This is paperwork wearing a high-visibility vest.",
      "The reason this persists is that, until very recently, the industry had no instrument for distinguishing real training from theater. The roster was the only evidence the auditor could ask for, so the roster was the only evidence the operator generated. Compliance optimized for what compliance could measure.",
      "xAPI changes the floor of what is measurable. Every action, every interaction, every assessed competency is a statement in a Learning Record Store. Time to first competency. Drift between modules. Cross-site clustering of failed checks. The roster is no longer the only artifact — it is the least interesting one.",
      "Trainovate's posture is that the next decade of EHS belongs to the operators who treat training the way modern engineering teams treat deployments. Instrumented. Versioned. Observable. Reversible.",
      "The deck is fine. The deck was never the problem. The problem is treating the deck as the program.",
    ],
  },
  {
    slug: "what-xapi-changes-about-ehs-evidence",
    title: "What xAPI changes about EHS evidence",
    date: "2026-03-21",
    readTime: "7 min",
    draft: true,
    topic: "TECHNICAL",
    excerpt:
      "The Experience API turns training from a closed system into an open one. Here is what that means for compliance, audits, and capital allocation.",
    body: [
      "SCORM is a closed loop. A learner takes a course inside a Learning Management System. The LMS records completion, optionally a score. The data does not leave the system. The data does not interoperate with the inspection tool, the incident tool, the operations tool. The data is, functionally, a tombstone.",
      "xAPI inverts the topology. Anything can emit a statement. Statements are open, structured records of the form actor → verb → object. They live in a Learning Record Store. The LRS is a database, not a course player.",
      "This sounds like plumbing. It is plumbing. Plumbing decides what civilizations can do.",
      "Three things become possible the moment your EHS function is xAPI-native.",
      "First, training and operations are joined. The fact that a worker completed a confined-space module on Tuesday and the fact that the same worker performed a confined-space entry on Wednesday are queryable in a single SQL.",
      "Second, evidence is forensic. When an incident occurs, the chain of training, refresher, and assessed competency is reconstructible to the second. The corrective action loop closes faster because the data is already there.",
      "Third, capital allocation gets honest. The relationship between training spend and incident reduction stops being a vibe and starts being a regression. Programs that work get funded. Programs that don't get killed.",
      "This is the work.",
    ],
  },
  {
    slug: "sdvosbs-in-the-ehs-marketplace-2026-outlook",
    title: "SDVOSBs in the EHS marketplace: a 2026 outlook",
    date: "2026-02-09",
    readTime: "5 min",
    draft: true,
    topic: "MARKET",
    excerpt:
      "Federal procurement preferences for veteran-owned small business have widened. The EHS category is one of the few where the supply side has not yet caught up.",
    body: [
      "Service-Disabled Veteran-Owned Small Business set-aside contracting has grown materially over the last three years. The supply side, in most categories, has grown to meet it. EHS is a notable exception.",
      "The reason is structural. Most SDVOSBs in adjacent categories — IT services, facilities, logistics — were founded by veterans with directly transferable skills. The EHS category requires a less common stack: regulatory craft, training production, and increasingly, software platform capability.",
      "Trainovate's bet is that the SDVOSBs that will win EHS work in 2026 and beyond will look less like single-discipline consultancies and more like vertically integrated product companies. The agency does not want to manage four subcontractors. The agency wants one capable prime.",
      "This is, of course, an opinion shaped by who we are. We are also right.",
    ],
  },
];

export function getInsight(slug: string): InsightPost | undefined {
  return insights.find((p) => p.slug === slug);
}
