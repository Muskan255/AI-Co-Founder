'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing AI-driven product development guidance with a founder mindset.
 *
 * - aiProductDevelopmentGuidance - A function that provides suggestions for MVP features, tech stack, and development roadmap.
 * - AiProductDevelopmentGuidanceInput - The input type for the aiProductDevelopmentGuidance function.
 * - AiProductDevelopmentGuidanceOutput - The return type for the aiProductDevelopmentGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiProductDevelopmentGuidanceInputSchema = z.object({
  startupIdea: z.string().describe('The core startup idea.'),
  problemStatement: z.string().describe('The problem the startup aims to solve.'),
  targetUsers: z.string().describe('Description of the target user base.'),
  valueProposition: z.string().describe('The unique value the startup offers to its users.'),
  businessModel: z.string().describe('The business model describing how the startup creates, delivers, and captures value.'),
  revenueStreams: z.string().describe('Primary ways the startup will generate revenue.'),
  pricingStrategy: z.string().describe('Strategy for pricing products or services.'),
  marketSizeEstimation: z.string().describe('Estimated total available market and serviceable available market.'),
  competitiveAdvantage: z.string().describe('What makes the startup superior to competitors.'),
  competitors: z.string().describe('Main competitors in the market.'),
  uniqueDifferentiation: z.string().describe('Key differentiating factors from competitors.'),
  currentStage: z.string().optional().describe('The current stage of the startup.'),
});
export type AiProductDevelopmentGuidanceInput = z.infer<typeof AiProductDevelopmentGuidanceInputSchema>;

const AiProductDevelopmentGuidanceOutputSchema = z.object({
  mvpFeatures: z.array(z.string()).describe('A list of essential features for the Minimum Viable Product.'),
  techStack: z.object({
    frontend: z.string().describe('Recommended frontend technologies (e.g., Next.js, React, Vue).'),
    backend: z.string().describe('Recommended backend technologies (e.g., Node.js, Python/Django, Go).'),
    database: z.string().describe('Recommended database solutions (e.g., PostgreSQL, MongoDB, Firebase Firestore).'),
    cloudProvider: z.string().describe('Recommended cloud infrastructure provider (e.g., Firebase, AWS, GCP, Azure).'),
    otherTools: z.array(z.string()).optional().describe('Other essential development tools or platforms (e.g., Genkit, Vercel, Docker).'),
  }).describe('A suggested basic technology stack for the product.'),
  developmentRoadmap: z.array(z.string()).describe('A high-level chronological roadmap for product development, broken into phases or milestones.'),
});
export type AiProductDevelopmentGuidanceOutput = z.infer<typeof AiProductDevelopmentGuidanceOutputSchema>;

export async function aiProductDevelopmentGuidance(input: AiProductDevelopmentGuidanceInput): Promise<AiProductDevelopmentGuidanceOutput> {
  return aiProductDevelopmentGuidanceFlow(input);
}

const aiProductDevelopmentGuidancePrompt = ai.definePrompt({
  name: 'aiProductDevelopmentGuidancePrompt',
  input: { schema: AiProductDevelopmentGuidanceInputSchema },
  output: { schema: AiProductDevelopmentGuidanceOutputSchema },
  prompt: `You are an AI Co-Founder and technical product lead.

**Founder Mindset & Personality:**
- Behave like an experienced startup founder who builds for speed and scale later.
- Challenge feature-bloat; push for the leanest possible MVP.
- Identify technical and product risks early (e.g., "this feature will take too long to build").
- Suggest lean approaches and encourage building only what is necessary to validate the core value proposition.
- Prioritize fast execution and iterative development.
- If a tech stack choice seems over-engineered for the current stage, explain why and suggest a simpler alternative.

**Current Context:**
The startup is currently in the: {{{currentStage}}}

Adapt your guidance based on this stage:
- Focus on the most critical tasks for this specific stage.
- Avoid unnecessary complexity; prioritize speed and learning.

Based on the provided startup blueprint, suggest core MVP features, a basic tech stack, and a high-level development roadmap.

Startup Idea: {{{startupIdea}}}
Problem Statement: {{{problemStatement}}}
Value Proposition: {{{valueProposition}}}`,
});

const aiProductDevelopmentGuidanceFlow = ai.defineFlow(
  {
    name: 'aiProductDevelopmentGuidanceFlow',
    inputSchema: AiProductDevelopmentGuidanceInputSchema,
    outputSchema: AiProductDevelopmentGuidanceOutputSchema,
  },
  async (input) => {
    const {output} = await aiProductDevelopmentGuidancePrompt(input);
    return output!;
  }
);
