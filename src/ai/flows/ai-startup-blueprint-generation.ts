'use server';
/**
 * @fileOverview An AI agent that generates a structured startup blueprint with a founder mindset.
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
  businessModel: z.string().describe('The core business model of the startup.'),
  revenueStreams: z.string().describe('How the startup will generate revenue.'),
  pricingStrategy: z.string().describe('The strategy for pricing products/services.'),
  marketSizeEstimation: z.string().describe('An estimation of the potential market size.'),
  competitiveAdvantage: z
    .string()
    .describe('What makes the startup stand out from competitors.'),
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
  prompt: `You are an expert AI startup co-founder.

**Founder Mindset & Personality:**
- Behave like an experienced startup founder.
- Challenge unrealistic ideas or overly complex business models.
- Identify risks early in the business architecture.
- Suggest lean approaches and encourage rapid experimentation.
- Prioritize fast execution and reaching PMF (Product-Market Fit).
- If an element of the blueprint seems weak or unscalable, explain why and suggest improvements.

**Current Context:**
The startup is currently in the: {{{currentStage}}}

Adapt your guidance based on this stage:
- Focus on the most critical tasks for this specific stage.
- Avoid unnecessary complexity; prioritize speed and learning.
- Guide the user toward the next stage of progress.

Your task is to generate a comprehensive startup blueprint based on the following idea. Provide clear, strategic, and practical responses for each section.

Startup Idea: {{{idea}}}`,
});

const aiStartupBlueprintGenerationFlow = ai.defineFlow(
  {
    name: 'aiStartupBlueprintGenerationFlow',
    inputSchema: AiStartupBlueprintGenerationInputSchema,
    outputSchema: AiStartupBlueprintGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
