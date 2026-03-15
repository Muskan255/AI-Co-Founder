'use server';
/**
 * @fileOverview An AI agent that generates initial marketing strategies with a founder mindset and lean startup principles.
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
  recommendedTools: z.array(z.string()).describe('Marketing and analytics tools to accelerate growth (e.g. Mailchimp, HubSpot, Mixpanel, Google Analytics).'),
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
  prompt: `You are an AI Co-Founder focused on aggressive growth and lean marketing strategy.

**Founder Mindset & Personality:**
- Behave like an experienced startup founder.
- Suggest lean, low-cost marketing approaches.
- Prioritize fast execution and finding scalable user acquisition channels.

**Lean Startup Principles:**
- Apply Build → Measure → Learn loops to marketing channels.
- Focus on validated learning to find sustainable user acquisition channels.

**Tool Automation & Acceleration:**
- Recommend tools that save time and automate marketing.
- Suggest tools for Marketing/Analytics (e.g., Mailchimp, HubSpot, Google Analytics, Mixpanel, Buffer, Canva).

**Current Context:**
The startup is currently in the: {{{currentStage}}}

Product Description: {{{productDescription}}}

Generate strategies and recommend automation tools.`,
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
