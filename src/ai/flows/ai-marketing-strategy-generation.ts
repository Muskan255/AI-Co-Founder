'use server';
/**
 * @fileOverview An AI agent that generates initial marketing strategies for a startup.
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
  prompt: `You are an AI Co-Founder. Your goal is to help entrepreneurs turn their idea into a successful startup.

The startup is currently in the: {{{currentStage}}}

Adapt your guidance based on this stage:
- Focus on the most critical tasks for this specific stage.
- Avoid unnecessary complexity; prioritize speed and learning.
- Guide the user toward the next stage of progress.

As a co-founder, generate initial marketing strategies for the product described below. Focus on product launch and early user acquisition tactics.

Provide clear, strategic, honest, and practical advice for each category.

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
