'use server';
/**
 * @fileOverview An AI agent that generates initial marketing strategies with a founder mindset.
 *
 * - aiMarketingStrategyGeneration - A function that handles the marketing strategy generation process.
 * - MarketingStrategyGenerationInput - The input type for the marketing strategy generation process.
 * - MarketingStrategyGenerationOutput - The return type for the marketing strategy generation process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketingStrategyGenerationInputSchema = z.object({
  productDescription: z
    .string()
    .describe('A detailed description of the product or startup idea.'),
  currentStage: z.string().optional().describe('The current stage of the startup.'),
});
export type MarketingStrategyGenerationInput = z.infer<
  typeof MarketingStrategyGenerationInputSchema
>;

const MarketingStrategyGenerationOutputSchema = z.object({
  productLaunch: z
    .array(z.string())
    .describe('Strategies for launching the product.'),
  socialMediaGrowth: z
    .array(z.string())
    .describe('Strategies for growing on social media platforms.'),
  userAcquisition: z
    .array(z.string())
    .describe('Strategies for acquiring new users.'),
  seoStrategy: z
    .array(z.string())
    .describe('Strategies for Search Engine Optimization.'),
  contentStrategy: z
    .array(z.string())
    .describe('Strategies for content creation and distribution.'),
  viralLoops: z
    .array(z.string())
    .describe('Strategies for creating viral growth loops.'),
  communityBuilding: z
    .array(z.string())
    .describe('Strategies for building and engaging a community.'),
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
  prompt: `You are an AI Co-Founder focused on aggressive growth and lean marketing.

**Founder Mindset & Personality:**
- Behave like an experienced startup founder who knows that marketing is about results, not just "noise".
- Challenge generic or expensive marketing ideas that don't fit the startup's current stage.
- Identify risks in the acquisition funnel early.
- Suggest lean, low-cost marketing approaches and encourage experimentation (A/B testing, rapid iterations).
- Prioritize fast execution and finding scalable user acquisition channels.
- If a growth strategy seems unlikely to work for this specific product, be honest and suggest a better alternative.

**Current Context:**
The startup is currently in the: {{{currentStage}}}

Adapt your guidance based on this stage:
- Focus on the most critical growth tasks for this specific stage.
- Avoid unnecessary complexity; prioritize speed and learning.

Product Description: {{{productDescription}}}

Generate strategies for the following categories:
- Product Launch
- Social Media Growth
- User Acquisition
- SEO Strategy
- Content Strategy
- Viral Loops
- Community Building

Ensure the output is a JSON object matching the MarketingStrategyGenerationOutputSchema.`,
});

const aiMarketingStrategyGenerationFlow = ai.defineFlow(
  {
    name: 'aiMarketingStrategyGenerationFlow',
    inputSchema: MarketingStrategyGenerationInputSchema,
    outputSchema: MarketingStrategyGenerationOutputSchema,
  },
  async input => {
    const {output} = await marketingStrategyPrompt(input);
    return output!;
  }
);
