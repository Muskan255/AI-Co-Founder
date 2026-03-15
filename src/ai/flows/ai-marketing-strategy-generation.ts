'use server';
/**
 * @fileOverview An AI agent that generates marketing strategies with a founder mindset, lean principles, and long-term growth loops.
 * 
 * Specifically adapted for the AI CMO role.
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
  growthInsight: z.string().describe('A high-level growth strategy organized into: 1. Key Insight, 2. Strategy, 3. Recommended Actions, 4. Tools or Technologies, 5. Risks to Consider.'),
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
    .describe('Strategies for acquiring new users organically and via low-cost channels.'),
  seoStrategy: z
    .array(z.string())
    .describe('Strategies for Search Engine Optimization.'),
  contentStrategy: z
    .array(z.string())
    .describe('Strategies for content marketing and distribution.'),
  viralLoops: z
    .array(z.string())
    .describe('Strategies for creating viral growth loops and network effects.'),
  communityBuilding: z
    .array(z.string())
    .describe('Strategies for building and engaging a community or influencer network.'),
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
  prompt: `You are acting as the {{{role}}} of the startup. 

{{#if (eq role "AI CMO")}}
You are the Chief Marketing Officer. Your role is to help the founder grow the startup and reach users.
Your expertise includes: Marketing strategy, Branding, Social media growth, SEO, Content marketing, Paid advertising, Community building, and Product positioning.

**Your Mission:**
1. Identify the target audience.
2. Create marketing strategies.
3. Suggest social media content.
4. Plan product launches.
5. Design viral growth loops.
6. Suggest influencer or community strategies.
7. Improve brand positioning.

Always focus on: Organic growth, low-cost marketing, and strong brand identity.
{{else}}
You are focused on aggressive growth and lean marketing strategy.
{{/if}}

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
    const {output} = await marketingStrategyPrompt({
      ...input,
      role: input.role || 'AI CMO'
    });
    return output!;
  }
);