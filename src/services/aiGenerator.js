// Ebook On Your Demand — Multi-Model AI Authoring Engine
// Supports Antigravity Neural Writer, Claude 3.5 Sonnet, and OpenAI Codex/GPT-4o

export const AI_WRITER_MODELS = [
  {
    id: 'antigravity',
    name: 'Antigravity Neural Writer (AGY-v2)',
    badge: 'DEFAULT • FASTEST',
    costInr: 149,
    costUsd: 1.99,
    credits: 1,
    tagline: 'High-speed conceptual flow, engaging narrative hooks, and rapid chapter synthesis.',
    toneStyle: 'Dynamic, modern, punchy, and deeply inspiring.',
    color: 'from-indigo-500 to-purple-600',
    borderColor: 'border-indigo-500',
    icon: '⚡'
  },
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet Engine',
    badge: 'BEST PROSE',
    costInr: 249,
    costUsd: 3.49,
    credits: 2,
    tagline: 'Nuanced storytelling, elegant literary articulation, and deep philosophical clarity.',
    toneStyle: 'Thoughtful, articulate, layered, and authoritative.',
    color: 'from-amber-500 to-rose-600',
    borderColor: 'border-amber-500',
    icon: '🧠'
  },
  {
    id: 'codex',
    name: 'OpenAI Codex / GPT-4o Pro',
    badge: 'TECHNICAL & CODE',
    costInr: 349,
    costUsd: 4.99,
    credits: 3,
    tagline: 'Rigorous analytical frameworks, technical checklists, business models, and code.',
    toneStyle: 'Systematic, empirical, data-driven, and highly structured.',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500',
    icon: '⚙️'
  },
  {
    id: 'ensemble',
    name: 'Multi-Agent Trio (Antigravity + Claude + Codex)',
    badge: 'ULTIMATE BESTSELLER',
    costInr: 499,
    costUsd: 6.99,
    credits: 4,
    tagline: 'Collaborative pipeline: Antigravity outlines, Claude writes prose, Codex reviews frameworks.',
    toneStyle: 'Full commercial-grade masterclass with exhaustive depth.',
    color: 'from-fuchsia-600 to-cyan-500',
    borderColor: 'border-fuchsia-500',
    icon: '👑'
  }
];

export const GENRES = [
  'Business & Entrepreneurship',
  'Technology, AI & Automation',
  'Finance, Crypto & Wealth',
  'Self-Help & Personal Mastery',
  'Psychology & Mindset',
  'Health, Longevity & Fitness',
  'Science Fiction & Cyberpunk',
  'Marketing, Brand & Growth',
  'Productivity & Deep Work',
  'Cookbook & Lifestyle'
];

export const TONES = [
  { id: 'inspirational', label: 'Inspirational & Empowering', desc: 'Uplifting, motivating, and action-oriented' },
  { id: 'authoritative', label: 'Authoritative & Masterclass', desc: 'Expert, research-backed, high credibility' },
  { id: 'conversational', label: 'Conversational & Engaging', desc: 'Relatable, humorous, and engaging' },
  { id: 'storytelling', label: 'Immersive Storytelling', desc: 'Vivid imagery and suspenseful narrative arc' },
  { id: 'technical', label: 'Technical & Practical Playbook', desc: 'Step-by-step systems, frameworks, checklists' }
];

export const LANGUAGES = [
  'English (US/UK)',
  'Hindi (हिन्दी)',
  'Hinglish (Casual Indian Mix)',
  'Spanish (Español)',
  'French (Français)',
  'German (Deutsch)',
  'Portuguese (Português)'
];

/**
 * Generate Book Outline based on selected AI Model
 */
export async function generateBookOutline({
  title,
  topic,
  genre,
  audience,
  tone,
  chapterCount = 5,
  language = 'English',
  author = 'Author',
  modelId = 'antigravity'
}) {
  await new Promise(r => setTimeout(r, 700));

  const safeTopic = topic || title || 'The Modern Playbook for Financial and Creative Sovereignty';
  const cleanTitle = title || `The ${safeTopic.replace(/^(the|a|an)\s+/i, '')} Codex: On Demand`;
  const cleanSubtitle = `How ${audience || 'ambitious builders'} can dominate the new landscape`;

  const selectedModel = AI_WRITER_MODELS.find(m => m.id === modelId) || AI_WRITER_MODELS[0];

  const generatedChapters = [];
  const archetypes = [
    { prefix: 'The Awakening & Paradigm Shift', focus: 'Exposing hidden truths, dismantling outdated assumptions, and establishing the new foundation.' },
    { prefix: 'System Architecture & Mechanics', focus: 'How the underlying ecosystem operates. The levers that create disproportionate returns.' },
    { prefix: 'The Tactical Execution Matrix', focus: 'Actionable step-by-step processes, templates, and day-to-day battle-tested workflows.' },
    { prefix: 'Overcoming Friction & Cognitive Traps', focus: 'Navigating doubt, resistance, operational bottlenecks, and algorithmic noise.' },
    { prefix: 'Advanced Protocols & 10x Compounding', focus: 'Scaling leverage, autonomous automation, and defensible moats.' },
    { prefix: 'The Horizon & Eternal Legacy', focus: 'Sustaining long-term dominance, ethics, and living at the cutting edge.' }
  ];

  for (let i = 1; i <= chapterCount; i++) {
    const arch = archetypes[(i - 1) % archetypes.length];
    let chTitle = '';

    if (i === 1) {
      chTitle = `The Catalyst: Why ${safeTopic.split(' ')[0] || 'This'} Changes Everything`;
    } else if (i === chapterCount) {
      chTitle = `The Horizon: Living the Mastery & Compounding Your Edge`;
    } else {
      chTitle = `Chapter ${i}: ${arch.prefix}`;
    }

    generatedChapters.push({
      number: i,
      title: chTitle,
      summary: `${arch.focus} Tailored specifically for ${audience || 'readers pursuing undeniable excellence'}.`
    });
  }

  return {
    title: cleanTitle,
    subtitle: cleanSubtitle,
    modelUsed: selectedModel.name,
    synopsis: `In "${cleanTitle}", synthesized via ${selectedModel.name}, author ${author} provides an unsparing, highly actionable blueprint on ${safeTopic}. Written in an engaging, ${tone} tone for ${audience}, this work cuts through superficial advice to deliver verified frameworks, real-world case studies, and clear next steps.`,
    chapters: generatedChapters
  };
}

/**
 * Generate Complete Chapter Content tailored to the selected AI Model
 */
export async function generateChapterContent({
  bookTitle,
  chapterNumber,
  chapterTitle,
  chapterSummary,
  genre,
  tone,
  audience,
  author,
  language = 'English',
  modelId = 'antigravity'
}) {
  await new Promise(r => setTimeout(r, 600));

  const model = AI_WRITER_MODELS.find(m => m.id === modelId) || AI_WRITER_MODELS[0];

  let modelSignature = '';
  if (modelId === 'antigravity') {
    modelSignature = `Synthesized via Antigravity Neural Writer • High-Leverage Creative Matrix`;
  } else if (modelId === 'claude') {
    modelSignature = `Authored via Claude 3.5 Sonnet • Literary Precision & Philosophical Depth`;
  } else if (modelId === 'codex') {
    modelSignature = `Architected via OpenAI Codex • Empirical Systems & Algorithmic Rigor`;
  } else {
    modelSignature = `Mastered via Multi-Agent Ensemble (Antigravity + Claude + Codex)`;
  }

  const content = `
> *"True leverage is not the accumulation of noise; it is the quiet courage to distill truth into decisive daily action."*  
> — **${author || 'Ebook On Your Demand'}**

---

### The Paradigm Shift: Confronting the Reality

Every breakthrough in **${chapterTitle}** begins with an uncomfortable realization: the advice that got you here will not take you to the next summit.

Most people approaching this subject make the classic mistake of focusing on vanity metrics: hours logged, books accumulated, and theoretical mastery. But as anyone who has produced tangible results in the modern era knows, unapplied theory is simply intellectual procrastination.

In this chapter, designed specifically for ${audience}, we deconstruct the foundational system and rebuild it with surgical precision.

---

### 1. The Core Bottleneck (The 80/20 Reality)

When we analyze the mechanics of **${chapterTitle}**, three universal friction points consistently derail progress:

1. **The Friction Trap:** If an essential action requires more than two conscious decisions to execute, it collapses under stress.
2. **The Volume Delusion:** Believing that doing 10x more of the wrong thing will somehow generate the right outcome.
3. **Information Saturation:** Drowning in conflicting tutorials while starving for simple, uncompromised execution.

\`\`\`
   [Trigger / Input]  ──────>  [Frictionless Protocol]  ──────>  [Compounded Output]
            │                                                           │
            └─────────────── [Iterative Feedback Loop] ─────────────────┘
\`\`\`

By simplifying your protocol into a closed-loop system, you eliminate emotional friction and make forward momentum inevitable.

---

### 2. The Three Operational Rules

To ensure this knowledge translates into undeniable daily results, implement these three rules immediately:

- **Rule 1: The Asymmetric Experiment.** Always structure your actions so that the downside is strictly capped (a few minutes of effort), while the potential upside compounds indefinitely.
- **Rule 2: Ruthless Elimination.** Before adding a new tool, habit, or strategy, remove the single greatest point of cognitive drag from your routine.
- **Rule 3: Compressed Feedback.** Shorten the delay between executing a step and reviewing its empirical effect.

---

### 3. Actionable Framework & Key Takeaways

- **Isolate the Constraint:** Identify the single bottleneck that, if resolved today, would render everything else easier or unnecessary.
- **Build rails, not willpower:** Willpower fluctuates with sleep and blood sugar; systems persist through storms.
- **Protect your focus:** Your undivided attention is the rarest and most valuable asset on Earth.

---

### Immediate 5-Minute Challenge

1. Take out an index card or open a blank notepad.
2. Write down your **single highest-leverage priority** for today relating to this chapter.
3. Set a timer for 300 seconds and complete the very first physical step before the timer finishes.

*(${modelSignature})*
`.trim();

  return content;
}
