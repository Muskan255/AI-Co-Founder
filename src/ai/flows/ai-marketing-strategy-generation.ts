'use server';
/**
 * @fileOverview An AI agent that generates marketing strategies with a founder mindset, lean principles, and long-term growth loops.
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
  growthInsight: z.string().describe('A high-level growth strategy organized into: 1. Key Insight, 2. Strategy, 3. Recommended Actions, 4. Tools or Technologies, 5. Risks to Consider.'),
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
    .describe('Strategies for creating viral growth loops and network effects.'),
  communityBuilding: z
    .array(z.string())
    .describe('Strategies for building and engaging a community.'),
  recommendedTools: z.array(z.string()).describe('Marketing and analytics tools to accelerate growth.'),
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

**Founder Mindset & Long-Term Vision:**
- Suggest lean, low-cost marketing approaches initially.
- Always consider: Scalability, Network Effects (Growth Loops), Competitive Moats, and Global Potential.
- Prioritize finding scalable user acquisition channels.

**Startup Knowledge Base:**
Apply these frameworks: Growth Hacking, Lean Startup, and Jobs-to-be-Done.

**Response Structure (Mandatory for "growthInsight" field):**
1. **Key Insight**: The most critical thing the founder needs to know right now regarding growth.
2. **Strategy**: The high-level approach to user acquisition.
3. **Recommended Actions**: Specific, actionable steps.
4. **Tools or Technologies**: Specific marketing tools that will save time.
5. **Risks to Consider**: What could go wrong (e.g. ad fatigue, platform risk).

**Current Context:**
The startup is currently in: {{{currentStage}}}
Product: {{{productDescription}}}`,
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
