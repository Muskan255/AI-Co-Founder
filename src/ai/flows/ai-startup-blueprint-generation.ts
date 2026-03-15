'use server';
/**
 * @fileOverview An AI agent that generates a structured startup blueprint with a founder mindset, lean principles, and long-term vision.
 *
 * - aiStartupBlueprintGeneration - A function that handles the generation of a startup blueprint.
 * - AiStartupBlueprintGenerationInput - The input type for the aiStartupBlueprintGeneration function.
 * - AiStartupBlueprintGenerationOutput - The return type for the aiStartupBlueprintGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiStartupBlueprintGenerationInputSchema = z.object({
  idea: z.string().describe('The startup idea to generate a blueprint for.'),
  currentStage: z.string().optional().describe('The current stage of the startup.'),
  role: z.string().optional().describe('The specific co-founder role acting on this request.'),
});
export type AiStartupBlueprintGenerationInput = z.infer<
  typeof AiStartupBlueprintGenerationInputSchema
>;

const AiStartupBlueprintGenerationOutputSchema = z.object({
  problemStatement: z.string().describe('A clear problem statement the startup aims to solve.'),
  targetUsers: z.string().describe('Description of the ideal target users.'),
  valueProposition: z
    .string()
    .describe('The unique value the startup offers to its target users.'),
  strategicOverview: z.string().describe('A high-level strategic overview organized into: 1. Role Perspective, 2. Strategic Advice, 3. Action Plan.'),
  businessModel: z.string().describe('The core business model of the startup.'),
  revenueStreams: z.string().describe('How the startup will generate revenue.'),
  pricingStrategy: z.string().describe('The strategy for pricing products/services.'),
  marketSizeEstimation: z.string().describe('An estimation of the potential market size.'),
  competitiveAdvantage: z
    .string()
    .describe('What makes the startup stand out from competitors (Moat, IP, Network Effects).'),
  recommendedTools: z.array(z.string()).describe('Business and operational tools to accelerate the venture (e.g. Stripe, Slack, Notion).'),
});
export type AiStartupBlueprintGenerationOutput = z.infer<
  typeof AiStartupBlueprintGenerationOutputSchema
>;

export async function aiStartupBlueprintGeneration(
  input: AiStartupBlueprintGenerationInput
): Promise<AiStartupBlueprintGenerationOutput> {
  return aiStartupBlueprintGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiStartupBlueprintGenerationPrompt',
  input: {schema: AiStartupBlueprintGenerationInputSchema},
  output: {schema: AiStartupBlueprintGenerationOutputSchema},
  prompt: `You are acting as the {{{role}}} of the startup. You are an expert founder specializing in business architecture and lean methodology.

**Persona Communication Style:**
{{#if (eq role "AI CTO")}} You are technical and structured. Focus on: technical architecture, infrastructure, and scalability. {{/if}}
{{#if (eq role "AI CMO")}} You are creative and strategic. Focus on: branding, positioning, and user acquisition. {{/if}}
{{#if (eq role "AI CFO")}} You are analytical and financial. Focus on: revenue models, pricing, and burn rate. {{/if}}
{{#if (eq role "AI Product Manager")}} You are user-focused and practical. Focus on: features, roadmaps, and PMF. {{/if}}
{{#if (eq role "AI Growth Hacker")}} You are experimental and growth-focused. Focus on: viral loops, experiments, and conversion. {{/if}}

**Founder Mindset & Long-Term Vision:**
- Behave like an experienced startup founder.
- Always consider: Scalability, Network Effects, Competitive Moats, Sustainable Revenue, and Global Potential from your perspective as {{{role}}}.

**Response Structure (Mandatory for "strategicOverview" field):**
1. **Role Perspective**: Explain the situation from the viewpoint of the active executive ({{{role}}}).
2. **Strategic Advice**: Provide high-level recommendations.
3. **Action Plan**: List practical steps the founder should take next.

**Current Context:**
The startup is currently in the: {{{currentStage}}}
Idea: {{{idea}}}`,
});

const aiStartupBlueprintGenerationFlow = ai.defineFlow(
  {
    name: 'aiStartupBlueprintGenerationFlow',
    inputSchema: AiStartupBlueprintGenerationInputSchema,
    outputSchema: AiStartupBlueprintGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
      role: input.role || 'AI Founder'
    });
    return output!;
  }
);
