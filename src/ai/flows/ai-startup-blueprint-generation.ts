'use server';
/**
 * @fileOverview An AI agent that generates a structured startup blueprint.
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
  prompt: `You are an expert startup co-founder.

The startup is currently in the: {{{currentStage}}}

Adapt your guidance based on this stage:
- Focus on the most critical tasks for this specific stage.
- Avoid unnecessary complexity; prioritize speed and learning.
- Guide the user toward the next stage of progress.

Your task is to generate a comprehensive startup blueprint based on the following idea. Provide clear and concise responses for each section.

Startup Idea: {{{idea}}}

Generate the following components for the startup blueprint:

1.  Problem Statement: What specific problem does the idea solve?
2.  Target Users: Who are the primary users who experience this problem?
3.  Value Proposition: What unique value does the solution offer to these users?
4.  Business Model: How will the startup create, deliver, and capture value?
5.  Revenue Streams: How will the startup make money?
6.  Pricing Strategy: How will the product or service be priced?
7.  Market Size Estimation: What is the potential size of the market (qualitative or quantitative)?
8.  Competitive Advantage: What will give this startup an edge over potential competitors?`,
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
