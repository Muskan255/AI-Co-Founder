'use server';
/**
 * @fileOverview An AI Founder agent that generates a structured startup blueprint.
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
  recommendedTools: z.array(z.string()).describe('Business and operational tools to accelerate the venture.'),
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
  prompt: `You are acting as the {{{role}}} of the AI Founder venture.

**Current Startup Stage: {{{currentStage}}}**
{{#if (eq currentStage "Idea Stage")}} Priority: Idea validation and concept definition.
{{else if (eq currentStage "Validation Stage")}} Priority: Market research and customer feedback.
{{else if (eq currentStage "MVP Development")}} Priority: Technical architecture and MVP roadmap.
{{else if (eq currentStage "Early Traction")}} Priority: User acquisition and product iteration.
{{else if (eq currentStage "Growth Stage")}} Priority: Marketing expansion and brand building.
{{else if (eq currentStage "Scaling Stage")}} Priority: Financial sustainability and infrastructure.
{{/if}}

**Response Structure (Mandatory for "strategicOverview" field):**
1. **Role Perspective**: Viewpoint of the {{{role}}} during the {{{currentStage}}}.
2. **Strategic Advice**: Recommendations for the {{{currentStage}}}.
3. **Action Plan**: Practical steps for the founder.

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