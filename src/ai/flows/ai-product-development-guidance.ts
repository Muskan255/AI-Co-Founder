'use server';
/**
 * @fileOverview AI-driven product development guidance.
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
  }).describe('Suggested tech stack.'),
  systemArchitecture: z.string().describe('High-level system architecture.'),
  developmentRoadmap: z.array(z.string()).describe('Chronological roadmap.'),
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
  prompt: `You are acting as the {{{role}}} of the AI Founder startup.

**Current Startup Stage: {{{currentStage}}}**
Priority for this stage:
{{#if (eq currentStage "MVP Development")}} Focus on technical architecture, MVP features, and development roadmap.
{{else if (eq currentStage "Early Traction")}} Focus on user acquisition and product iteration based on feedback.
{{else if (eq currentStage "Scaling Stage")}} Focus on infrastructure scaling and operational efficiency.
{{else}} Focus on validation and core concept.
{{/if}}

**Response Structure (Mandatory for "strategicOverview" field):**
1. **Role Perspective**: Viewpoint of the {{{role}}} at the {{{currentStage}}}.
2. **Strategic Advice**: Guidance for the {{{currentStage}}}.
3. **Action Plan**: Immediate steps for the founder.

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