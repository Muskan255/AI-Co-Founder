'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing AI-driven product development guidance with a focus on MVP speed and long-term scalability.
 * 
 * Specifically adapted for AI CTO, AI Product Manager, and AI Growth Hacker roles.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiProductDevelopmentGuidanceInputSchema = z.object({
  startupIdea: z.string().describe('The core startup idea.'),
  problemStatement: z.string().describe('The problem the startup aims to solve.'),
  targetUsers: z.string().describe('Description of the target user base.'),
  valueProposition: z.string().describe('The unique value the startup offers to its users.'),
  businessModel: z.string().describe('The business model.'),
  revenueStreams: z.string().describe('Primary ways the startup will generate revenue.'),
  pricingStrategy: z.string().describe('Strategy for pricing.'),
  marketSizeEstimation: z.string().describe('Market size estimation.'),
  competitiveAdvantage: z.string().describe('Competitive advantage.'),
  competitors: z.string().describe('Main competitors.'),
  uniqueDifferentiation: z.string().describe('Key differentiating factors.'),
  currentStage: z.string().optional().describe('The current stage of the startup.'),
  role: z.string().optional().describe('The specific co-founder role acting on this request.'),
});
export type AiProductDevelopmentGuidanceInput = z.infer<typeof AiProductDevelopmentGuidanceInputSchema>;

const AiProductDevelopmentGuidanceOutputSchema = z.object({
  mvpFeatures: z.array(z.string()).describe('Essential features for the MVP.'),
  techStack: z.object({
    frontend: z.string().describe('Recommended frontend.'),
    backend: z.string().describe('Recommended backend.'),
    database: z.string().describe('Recommended database.'),
    cloudProvider: z.string().describe('Recommended cloud provider.'),
    otherTools: z.array(z.string()).optional().describe('Other essential tools.'),
  }).describe('Suggested tech stack for speed and future scalability.'),
  systemArchitecture: z.string().describe('High-level design of the system architecture.'),
  developmentRoadmap: z.array(z.string()).describe('Chronological roadmap (Phases/Milestones).'),
  accelerationTools: z.array(z.string()).describe('Tools specifically chosen to save time.'),
  strategicOverview: z.string().describe('A high-level overview organized into: 1. Role Perspective, 2. Strategic Advice, 3. Action Plan.'),
});
export type AiProductDevelopmentGuidanceOutput = z.infer<typeof AiProductDevelopmentGuidanceOutputSchema>;

export async function aiProductDevelopmentGuidance(input: AiProductDevelopmentGuidanceInput): Promise<AiProductDevelopmentGuidanceOutput> {
  return aiProductDevelopmentGuidanceFlow(input);
}

const aiProductDevelopmentGuidancePrompt = ai.definePrompt({
  name: 'aiProductDevelopmentGuidancePrompt',
  input: { schema: AiProductDevelopmentGuidanceInputSchema },
  output: { schema: AiProductDevelopmentGuidanceOutputSchema },
  prompt: `You are acting as the {{{role}}} of the startup.

**Persona Communication Style:**
{{#if (eq role "AI CTO")}} You are technical and structured. Focus on architecture, stack selection, and scalability. {{/if}}
{{#if (eq role "AI Product Manager")}} You are user-focused and practical. Focus on product strategy and roadmap markers. {{/if}}
{{#if (eq role "AI Growth Hacker")}} You are experimental and growth-focused. Focus on building for virality and growth loops. {{/if}}

**Founder Mindset & Long-Term Vision:**
- Build for speed now, but architect for Scalability and Global Potential.
- Prioritize the leanest possible MVP that still allows for a future Moat.

**Response Structure (Mandatory for "strategicOverview" field):**
1. **Role Perspective**: Explain the situation from the viewpoint of the active executive ({{{role}}}).
2. **Strategic Advice**: Provide high-level recommendations.
3. **Action Plan**: List practical steps the founder should take next.

**Current Context:**
The startup is currently in the: {{{currentStage}}}
Idea: {{{startupIdea}}}`,
});

const aiProductDevelopmentGuidanceFlow = ai.defineFlow(
  {
    name: 'aiProductDevelopmentGuidanceFlow',
    inputSchema: AiProductDevelopmentGuidanceInputSchema,
    outputSchema: AiProductDevelopmentGuidanceOutputSchema,
  },
  async (input) => {
    const {output} = await aiProductDevelopmentGuidancePrompt({
      ...input,
      role: input.role || 'AI CTO'
    });
    return output!;
  }
);
