import type { Category } from "@/lib/types";

export type InitiativeStatus = "in-progress" | "next-up" | "dependent" | "ongoing";

export interface Initiative {
  id: string;
  title: string;
  workstream: 1 | 2 | 3;
  phase: 1 | 2 | 3 | 4;
  status: InitiativeStatus;
  category: Category;
  what: string;
  why: string;
  owner: string;
  dependencies?: string[];
  clientPressureTest?: string;
}

export interface Phase {
  id: 1 | 2 | 3 | 4;
  label: string;
  subtitle: string;
  milestone?: {
    label: string;
    sublabel: string;
  };
}

export interface Workstream {
  id: 1 | 2 | 3;
  label: string;
  owner: string;
}

export const phases: Phase[] = [
  {
    id: 1,
    label: "Phase 1",
    subtitle: "Definition",
    milestone: {
      label: "Day 90",
      sublabel: "Definition complete — story and demo materials exist",
    },
  },
  {
    id: 2,
    label: "Phase 2",
    subtitle: "Foundation Build",
  },
  {
    id: 3,
    label: "Phase 3",
    subtitle: "Integration and Pressure Test",
  },
  {
    id: 4,
    label: "Phase 4",
    subtitle: "Scale and Generalize",
  },
];

export const workstreams: Workstream[] = [
  {
    id: 1,
    label: "Knowledge Architecture and Encoding",
    owner: "Doug Guttenberg · Liz Geil · Shawn Flanagan",
  },
  {
    id: 2,
    label: "Engineering and Infrastructure",
    owner: "Saurav · Harsh · Shawn Flanagan",
  },
  {
    id: 3,
    label: "Design System",
    owner: "Doug Everhart · Patrick Anders · Matthew Ulstead",
  },
];

export const phaseDescriptions: Record<number, string> = {
  1: "Schema, standards, and first encoding. What gets built is defined. What gets stored is specified. The first client nucleus instance is live.",
  2: "Core infrastructure is built and running. The ingestion pipeline exists. The briefing agent is live. The first client pressure test is underway.",
  3: "Workstreams converge. The design token store connects to the nucleus. The QA agent runs against real output. Account knowledge is live. Client feedback shapes the next phase.",
  4: "Second client encoding validates the schema generalizes. The platform handles multiple brands. The commercial model is proven.",
};

export const initiatives: Initiative[] = [
  // Workstream 1 — Knowledge Architecture and Encoding
  {
    id: "ws1-schema",
    title: "Define the nucleus slot schema",
    workstream: 1,
    phase: 1,
    status: "in-progress",
    category: "core",
    what: "Define the complete slot schema for the nucleus — what slots exist, what each holds, and what metadata is required per slot. Metadata includes: confidence level, last updated date, source attribution, and version. This is the standard that all encoding work references.",
    why: "The schema is the foundation everything else is built on. Encoding work cannot begin until there is agreement on the shape of what gets stored. A well-designed schema makes the system extensible — new slot types can be added without restructuring what already exists.",
    owner: "Doug Guttenberg + Shawn Flanagan",
    dependencies: [],
    clientPressureTest:
      "The first client engagement is the first real test of whether the schema holds against a real brand. Gaps in the schema that were invisible in the abstract become obvious when you try to encode a real brand's positioning and the slot structure does not accommodate it.",
  },
  {
    id: "ws1-substrategy",
    title: "Define sub-strategy slot types",
    workstream: 1,
    phase: 1,
    status: "in-progress",
    category: "knowledge",
    what: "Define the structured fields within each discipline-level slot: content strategy, creative intent, social and earned strategy, design system intent, and communications architecture. Each slot needs defined fields, not free-text entry. Media strategy is included as a flagged low-confidence slot — present in the schema, not yet fully encodable.",
    why: "Discipline-level slots are what turn the nucleus from a brand strategy tool into a platform that multiple functions can draw from. A social satellite and a media planning tool need different things from the brand — the sub-strategy slots are how those differences get structured.",
    owner: "Doug Guttenberg + Liz Geil",
    dependencies: ["ws1-schema"],
  },
  {
    id: "ws1-encoding-standard",
    title: "Document the encoding standard",
    workstream: 1,
    phase: 1,
    status: "next-up",
    category: "core",
    what: "A documented standard for how a strategist writes into a slot correctly. What counts as an encoded claim versus an assumption. How sources get attributed. What the difference is between a high-confidence and low-confidence encoding. This standard is what makes the system trustworthy — it ensures that what is in the nucleus is actually known, not inferred.",
    why: "Without an encoding standard, different people encode the same type of knowledge differently. The system becomes inconsistent. The standard is the discipline that keeps the nucleus reliable over time.",
    owner: "Doug Guttenberg + Liz Geil",
    dependencies: ["ws1-schema", "ws1-substrategy"],
  },
  {
    id: "ws1-client-encoding",
    title: "First client brand encoding",
    workstream: 1,
    phase: 1,
    status: "next-up",
    category: "knowledge",
    what: "Extract existing brand knowledge from available client materials and encode the first real nucleus instance against the defined schema. This is the pressure test that surfaces schema gaps, encoding standard gaps, and slot types that need to be added or restructured.",
    why: "Abstract schema design always looks cleaner than it is. Encoding a real brand is how you find out what the schema is missing, what the encoding standard does not cover, and where the system needs to be more flexible. The first client engagement is a design tool, not just a delivery.",
    owner: "Doug Guttenberg + Liz Geil",
    dependencies: ["ws1-encoding-standard"],
    clientPressureTest:
      "The client's head of digital is a willing thought partner. Their feedback on the encoded nucleus — what feels right, what feels missing, what does not match how they think about their brand — is direct product input.",
  },
  {
    id: "ws1-account-protocol",
    title: "Define account knowledge input protocol",
    workstream: 1,
    phase: 2,
    status: "next-up",
    category: "evolving",
    what: "Define the structured protocol for account knowledge inputs: what gets logged, at what cadence, how inputs route to which slots, and what the human review step looks like before an append commits. Covers retrospective feedback, strategic planning decisions, and historical work references.",
    why: "The nucleus goes stale without a mechanism to keep it current. The account knowledge protocol is what makes it a living system rather than a one-time encoding project. The design question is how to make input low-friction enough that account teams actually do it.",
    owner: "Doug Guttenberg",
    dependencies: ["ws1-client-encoding"],
  },
  {
    id: "ws1-km-ui",
    title: "Knowledge management UI spec",
    workstream: 1,
    phase: 2,
    status: "next-up",
    category: "core",
    what: "Design the interface specification for encoding, reviewing, and versioning brand knowledge at the slot level — without editing markdown files. Covers the slot-level editor, the confidence and source metadata fields, the version history view, and the account knowledge input form.",
    why: "The markdown file approach works for a prototype with one strategist. It does not scale to multiple brands, multiple encoders, or client-visible knowledge management. The UI spec is what makes the nucleus accessible to the full team.",
    owner: "Doug Guttenberg + Shawn Flanagan",
    dependencies: ["ws1-encoding-standard", "ws1-account-protocol"],
  },
  {
    id: "ws1-schema-validation",
    title: "Validate schema against second hypothetical brand",
    workstream: 1,
    phase: 2,
    status: "dependent",
    category: "core",
    what: "Test the slot schema and encoding standard against a second brand — either a second client engagement or a synthetic brand constructed to stress-test edge cases. Does the schema generalize or does it reveal assumptions baked in from the first encoding?",
    why: "A schema that works for one brand proves the concept. A schema that works for two proves it generalizes. The second encoding is the test that determines whether what was built is infrastructure or a one-off.",
    owner: "Doug Guttenberg + Liz Geil",
    dependencies: ["ws1-client-encoding", "ws1-encoding-standard"],
  },

  // Workstream 2 — Engineering and Infrastructure
  {
    id: "ws2-multitenant",
    title: "Generalize the nucleus API to multi-tenant",
    workstream: 2,
    phase: 1,
    status: "in-progress",
    category: "core",
    what: "Refactor the nucleus API from the single-brand Hamilton Beach prototype to a brand-agnostic multi-tenant architecture. Per-brand knowledge store isolation, same API shape, different knowledge file per brand. The API code should contain nothing brand-specific.",
    why: "The Hamilton Beach prototype proved the concept with one brand. Multi-tenancy is what makes it a platform. The refactor should be clean — the API was designed to be brand-agnostic from the start, so this is completing the architecture's own intent.",
    owner: "Saurav + Harsh",
    dependencies: ["ws1-schema"],
  },
  {
    id: "ws2-skillmd",
    title: "Define the SKILL.md standard for satellites",
    workstream: 2,
    phase: 1,
    status: "in-progress",
    category: "core",
    what: "Define the SKILL.md file format that every satellite maintains. Required fields: agent identity, what it does, what context it needs from the nucleus, what format it expects the response in, and what it does not need. The nucleus reads this file at request time to calibrate the context package.",
    why: "This is the protocol that makes the agent-nucleus interface self-documenting and extensible. Without a standard, every satellite requires custom integration work. With it, a new satellite can be built by anyone who can write a SKILL.md and call the API.",
    owner: "Shawn Flanagan + Doug Guttenberg",
    dependencies: ["ws2-multitenant"],
  },
  {
    id: "ws2-interpretation",
    title: "Build the interpretation layer formally",
    workstream: 2,
    phase: 1,
    status: "next-up",
    category: "core",
    what: "Formalize the interpretation layer as defined logic: intent parsing from the satellite's SKILL.md, depth calibration by consumer type, and format translation. The Hamilton Beach prototype has a working version for creative satellites — this is the generalization that handles multiple consumer types with different context needs.",
    why: "The interpretation layer is the intelligence of the system. A nucleus that returns a full context package on every request produces drift. A nucleus that calibrates by declared intent produces precision. The difference between the two is the interpretation layer.",
    owner: "Shawn Flanagan + Saurav",
    dependencies: ["ws2-skillmd", "ws1-schema"],
  },
  {
    id: "ws2-client-instance",
    title: "Stand up first client nucleus instance",
    workstream: 2,
    phase: 1,
    status: "next-up",
    category: "knowledge",
    what: "Deploy the first multi-tenant nucleus instance for the client pressure test. This is the engineering delivery that enables the Workstream 1 encoding work to run against real infrastructure rather than a local prototype.",
    why: "The schema and encoding standard work cannot be fully validated until there is a live nucleus instance to encode against. The engineering and knowledge architecture workstreams converge here.",
    owner: "Saurav + Harsh",
    dependencies: ["ws2-multitenant", "ws1-schema"],
    clientPressureTest:
      "First real multi-brand test of the tenant model. The client instance runs alongside the Hamilton Beach instance — both drawing from the same API, each from their own knowledge store.",
  },
  {
    id: "ws2-ingestion",
    title: "Build the ingestion pipeline",
    workstream: 2,
    phase: 2,
    status: "next-up",
    category: "core",
    what: "Build the two-path ingestion pipeline: document parsing for structured assets (decks, briefs, guidelines) and extraction prompting for unstructured content (session notes, qualitative research, feedback logs). The pipeline writes to named slots with confidence levels and source attribution. It flags undocumented claims rather than encoding them silently.",
    why: "Right now encoding is manual. A strategist writes the knowledge file. That is the right approach for a prototype — it forces precision. At scale it is a bottleneck. The ingestion pipeline is what makes the nucleus onboardable for new clients without requiring a senior strategist to hand-write every slot.",
    owner: "Saurav + Harsh",
    dependencies: ["ws2-multitenant", "ws1-encoding-standard"],
  },
  {
    id: "ws2-briefing",
    title: "Build the briefing agent",
    workstream: 2,
    phase: 2,
    status: "next-up",
    category: "agent",
    what: "Build the briefing agent as a satellite: takes a job to be done as input, calls the nucleus with a SKILL.md declaring its context needs, receives a calibrated context package, and produces a holistic brief that then breaks into department-specific versions for strategy, creative, design, social, and account. The agent calls the nucleus — it is not part of it.",
    why: "Brief quality failure is one of the four structural problems Brand Gravity is built to address. The briefing agent is the highest-visibility demonstration of what the nucleus enables — it produces something a real team uses immediately, making the value of the system tangible.",
    owner: "Saurav + Harsh",
    dependencies: ["ws2-skillmd", "ws2-interpretation", "ws2-client-instance"],
  },
  {
    id: "ws2-copywriting",
    title: "Formalize copywriting agent with SKILL.md",
    workstream: 2,
    phase: 2,
    status: "dependent",
    category: "satellite",
    what: "Rebuild the copywriting agent (specced in the Hamilton Beach work) to the SKILL.md standard. Calls the nucleus once per batch, uses the context package as a system prompt, generates structured ad copy output for production pipeline ingestion.",
    why: "The copywriting agent is the first satellite that went to production. Formalizing it to the SKILL.md standard makes it the reference implementation every future satellite is built against.",
    owner: "Saurav + Harsh",
    dependencies: ["ws2-skillmd", "ws2-interpretation"],
  },
  {
    id: "ws2-qa",
    title: "Build the QA coherence agent",
    workstream: 2,
    phase: 3,
    status: "dependent",
    category: "satellite",
    what: "Build the QA coherence agent: checks generated content against the operational copy rules encoded in the nucleus, returns pass/fail per rule with a reasoning trace. Not a subjective quality check — a structured test against documented brand standards that have clear answers.",
    why: "QA coherence is the third structural problem Brand Gravity addresses. The QA agent makes brand compliance testable rather than reviewable — the difference between a gate that scales and one that requires a senior strategist on every piece of work.",
    owner: "Saurav + Harsh",
    dependencies: ["ws2-copywriting", "ws2-interpretation"],
  },
  {
    id: "ws2-versioning",
    title: "Build append-and-version model for account knowledge",
    workstream: 2,
    phase: 3,
    status: "dependent",
    category: "evolving",
    what: "Implement the append-and-version storage model that account knowledge requires. Slot updates preserve history — what was true before is retained, what is new is appended with a timestamp, source, and reviewer attribution. The model must support rollback and show change history at the slot level.",
    why: "Account knowledge is different from foundational brand knowledge — it changes more frequently and accumulates over time. The versioning model is what makes the nucleus a living record rather than a static document.",
    owner: "Shawn Flanagan + Saurav",
    dependencies: ["ws1-account-protocol", "ws2-multitenant"],
  },
  {
    id: "ws2-performance",
    title: "Performance and caching audit",
    workstream: 2,
    phase: 3,
    status: "dependent",
    category: "core",
    what: "Audit prompt caching behavior at multi-brand scale. Benchmark latency across satellite types. Identify where caching windows are misaligned with update frequency. Establish performance baselines for the platform as a commercial offering.",
    why: "Latency and cost at scale are the commercial viability test. A system that works at one brand's volume may behave differently at ten. The audit converts assumptions about performance into documented baselines.",
    owner: "Saurav + Harsh",
    dependencies: ["ws2-client-instance", "ws2-briefing", "ws2-copywriting"],
  },

  // Workstream 3 — Design System
  {
    id: "ws3-audit",
    title: "Audit existing Adobe pipeline work",
    workstream: 3,
    phase: 1,
    status: "in-progress",
    category: "knowledge",
    what: "Inventory the token and style logic already built into the existing InDesign files and Adobe panel implementations across DCP. What design intelligence already exists in a structured form? What is portable and what is bespoke? This is extraction work, not invention — the goal is to understand what can be systematized before deciding what to build.",
    why: "DCP has built powerful tool-specific implementations that work. They are one-offs. The audit is the first step toward making them systematic — understanding what already exists before designing the infrastructure that connects them.",
    owner: "Doug Everhart + Patrick Anders",
    dependencies: [],
  },
  {
    id: "ws3-schema",
    title: "Define the common denominator schema",
    workstream: 3,
    phase: 1,
    status: "next-up",
    category: "core",
    what: "Define what design intent and design tokens need to look like to be interpretable by both Figma and Adobe. This is the hardest design problem in Workstream 3: finding the format that neither tool natively uses but that both can consume. The schema covers design intent (the philosophy and purpose of visual decisions) and design tokens (the actual values — color, typography, spacing, component logic).",
    why: "Without a common schema, the design token store is just another one-off implementation. With it, every future brand can be encoded once and deployed to any tool in the pipeline.",
    owner: "Doug Everhart + Shawn Flanagan + Matthew Ulstead",
    dependencies: ["ws3-audit", "ws1-schema"],
  },
  {
    id: "ws3-json",
    title: "Define format-neutral JSON token structure",
    workstream: 3,
    phase: 2,
    status: "next-up",
    category: "core",
    what: "Define the canonical JSON structure for the design token store: color, typography, spacing, and component logic stored in a format that is not tied to Figma variables or Adobe styles. This is the source that gets translated downstream — not a Figma export, not an Adobe library.",
    why: "Format-neutral means the token store is not dependent on either tool's internal format. If Figma changes how variables work, or if a new production tool gets added, the source JSON does not change — only the translation layer does.",
    owner: "Doug Everhart + Shawn Flanagan",
    dependencies: ["ws3-schema"],
  },
  {
    id: "ws3-intent-standard",
    title: "Document the design intent encoding standard",
    workstream: 3,
    phase: 2,
    status: "next-up",
    category: "knowledge",
    what: "Define how the purpose and philosophy of a visual system gets written into slots — not just the token values but the reasoning behind them. Why this typeface. What the color palette is trying to communicate. What the spatial system is built around. This is what makes the design token store strategically useful rather than just technically correct.",
    why: "A token store with values but no intent is a stylesheet, not a brand intelligence system. The encoding standard is what makes the design layer queryable by the nucleus — a satellite can receive not just the brand's colors but what those colors are supposed to communicate.",
    owner: "Doug Everhart + Doug Guttenberg",
    dependencies: ["ws3-schema", "ws1-encoding-standard"],
  },
  {
    id: "ws3-client-mapping",
    title: "Map first client design system to schema",
    workstream: 3,
    phase: 2,
    status: "dependent",
    category: "knowledge",
    what: "Encode the first client brand's design system against the token store schema. This is the pressure test for whether the schema accommodates a real brand's visual system — the same role the first client nucleus encoding plays for Workstream 1.",
    why: "Abstract schema design always reveals its gaps under real brand complexity. A real brand's design system will have edge cases the schema did not anticipate — this encoding surfaces them early enough to fix rather than late enough to regret.",
    owner: "Doug Everhart + Patrick Anders",
    dependencies: ["ws3-json", "ws2-client-instance"],
    clientPressureTest:
      "A real brand's design system will have edge cases the abstract schema did not anticipate. Typography decisions that do not fit the token model. Color systems with more complexity than the schema accommodates. These failures are design inputs.",
  },
  {
    id: "ws3-adobe",
    title: "Build the Adobe translation layer",
    workstream: 3,
    phase: 3,
    status: "dependent",
    category: "core",
    what: "Build the translation layer that takes the format-neutral JSON token store and outputs Adobe-compatible styles and panel inputs. Builds on the existing Adobe panel work — this is the systematic version of what has already been proven as one-offs.",
    why: "The Adobe pipeline is where DCP's production work happens. The translation layer is what makes brand-accurate design outputs achievable at scale without per-project manual work.",
    owner: "Patrick Anders + Matthew Ulstead",
    dependencies: ["ws3-json", "ws3-client-mapping"],
  },
  {
    id: "ws3-figma",
    title: "Define the Figma translation layer spec",
    workstream: 3,
    phase: 3,
    status: "dependent",
    category: "core",
    what: "Define and build the translation layer from the token store JSON to Figma variables. Scoped to the digital workflows where Figma is already adopted — this is not a universal Figma rollout. The translation layer serves the workflows that exist, not an aspirational adoption state.",
    why: "Figma is the design tool for the digital satellite workflows. A brief satellite that receives a context package should be able to pull brand-accurate token values into Figma without manual setup.",
    owner: "Matthew Ulstead + Shawn Flanagan",
    dependencies: ["ws3-json", "ws3-client-mapping"],
  },
  {
    id: "ws3-nucleus-connection",
    title: "Connect token store to the nucleus",
    workstream: 3,
    phase: 4,
    status: "dependent",
    category: "core",
    what: "Make design tokens retrievable by the nucleus interpretation layer for design-relevant satellite requests. A design brief satellite or a layout generation agent should be able to receive brand-accurate token values in its context package alongside the strategic and creative context.",
    why: "This is the connection that makes the nucleus truly cross-functional. When a design satellite receives a context package that includes both the brand's creative intent and its token values, the output can be both on-strategy and on-brand visually — without a human translating between the two.",
    owner: "Shawn Flanagan + Saurav",
    dependencies: ["ws3-json", "ws2-interpretation", "ws2-skillmd"],
  },
];
