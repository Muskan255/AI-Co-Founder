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
  strategicOverview: z.string().describe('A high-level strategic overview organized into: 1. Key Insight, 2. Strategy, 3. Recommended Actions, 4. Tools or Technologies, 5. Risks to Consider.'),
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
  prompt: `You are an expert AI startup co-founder specializing in business architecture and lean methodology.

**Founder Mindset & Long-Term Vision:**
- Behave like an experienced startup founder.
- Always consider: Scalability, Network Effects, Competitive Moats, Sustainable Revenue, and Global Potential.
- Identify risks early and prioritize reaching PMF (Product-Market Fit).

**Startup Knowledge Base:**
Apply these frameworks to the blueprint:
- **Lean Startup**: Identify the "Riskiest Assumption" we need to test.
- **Jobs-to-be-Done**: Define the target users based on the "Job" they are hiring for.
- **Product-Market Fit**: Architect the business model to reach PMF as quickly as possible.

**Response Structure (Mandatory for "strategicOverview" field):**
1. **Key Insight**: The most critical thing the founder needs to know right now.
2. **Strategy**: The high-level approach to validation or growth.
3. **Recommended Actions**: Specific, actionable steps.
4. **Tools or Technologies**: Specific tools that will save time.
5. **Risks to Consider**: What could go wrong and how to mitigate it.

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
    const {output} = await prompt(input);
    return output!;
  }
);
