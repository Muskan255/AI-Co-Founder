'use server';
/**
 * @fileOverview AI Founder marketing strategies.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketingStrategyGenerationInputSchema = z.object({
  productDescription: z
    .string()
    .describe('A detailed description of the product or startup idea.'),
  currentStage: z.string().optional().describe('The current stage of the startup.'),
  role: z.string().optional().describe('The specific co-founder role acting on this request.'),
});
export type MarketingStrategyGenerationInput = z.infer<
  typeof MarketingStrategyGenerationInputSchema
>;

const MarketingStrategyGenerationOutputSchema = z.object({
  growthInsight: z.string().describe('A high-level growth strategy organized into: 1. Role Perspective, 2. Strategic Advice, 3. Action Plan.'),
  targetAudience: z.string().describe('Detailed identification of the primary target audience.'),
  brandPositioning: z.string().describe('How the brand should be positioned in the market.'),
  productLaunch: z
    .array(z.string())
    .describe('Strategies for launching the product.'),
  socialMediaGrowth: z
    .array(z.string())
    .describe('Strategies for growing on social media platforms.'),
  userAcquisition: z
    .array(z.string())
    .describe('Strategies for acquiring new users organically.'),
  seoStrategy: z
    .array(z.string())
    .describe('Strategies for Search Engine Optimization.'),
  contentStrategy: z
    .array(z.string())
    .describe('Strategies for content marketing.'),
  viralLoops: z
    .array(z.string())
    .describe('Strategies for creating viral growth loops.'),
  communityBuilding: z
    .array(z.string())
    .describe('Strategies for building and engaging a community.'),
  recommendedTools: z.array(z.string()).describe('Marketing and analytics tools.'),
});
export type MarketingStrategyGenerationOutput = z.infer<
  typeof MarketingStrategyGenerationOutputSchema
>;

export async function aiMarketingStrategyGeneration(
  input: MarketingStrategyGenerationInput
): Promise<MarketingStrategyGenerationOutput> {
  return aiMarketingStrategyGenerationFlow(input);
}

const marketingStrategyPrompt = ai.definePrompt({
  name: 'marketingStrategyPrompt',
  input: {schema: MarketingStrategyGenerationInputSchema},
  output: {schema: MarketingStrategyGenerationOutputSchema},
  prompt: `You are acting as the {{{role}}} of the AI Founder startup.

**Current Startup Stage: {{{currentStage}}}**
Priority for this stage:
{{#if (eq currentStage "Validation Stage")}} Focus on market research, customer feedback, and testing demand.
{{else if (eq currentStage "Growth Stage")}} Focus on marketing expansion, scaling channels, and brand building.
{{else if (eq currentStage "Early Traction")}} Focus on user acquisition and early experiment optimization.
{{/if}}

**Response Structure (Mandatory for "growthInsight" field):**
1. **Role Perspective**: Viewpoint of the {{{role}}} at the {{{currentStage}}}.
2. **Strategic Advice**: Growth recommendations for the {{{currentStage}}}.
3. **Action Plan**: Immediate marketing steps.

Product: {{{productDescription}}}`,
});

const aiMarketingStrategyGenerationFlow = ai.defineFlow(
  {
    name: 'aiMarketingStrategyGenerationFlow',
    inputSchema: MarketingStrategyGenerationInputSchema,
    outputSchema: MarketingStrategyGenerationOutputSchema,
  },
  async input => {
    const {output} = await marketingStrategyPrompt({
      ...input,
      role: input.role || 'AI CMO'
    });
    return output!;
  }
);