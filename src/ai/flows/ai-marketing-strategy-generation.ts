'use server';
/**
 * @fileOverview An AI agent that generates marketing strategies with a founder mindset, lean principles, and long-term growth loops.
 * 
 * Specifically adapted for the AI CMO and AI Growth Hacker roles.
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

**Persona Communication Style:**
{{#if (eq role "AI CMO")}} You are creative and strategic. Focus on branding, positioning, and high-level marketing strategy. {{/if}}
{{#if (eq role "AI Growth Hacker")}} You are experimental and growth-focused. Focus on viral loops, experiments, and rapid user acquisition. {{/if}}

**Founder Mindset & Long-Term Vision:**
- Suggest lean, low-cost marketing approaches initially.
- Always consider: Scalability, Network Effects (Growth Loops), and Global Potential.

**Response Structure (Mandatory for "growthInsight" field):**
1. **Role Perspective**: Explain the situation from the viewpoint of the active executive ({{{role}}}).
2. **Strategic Advice**: Provide high-level recommendations.
3. **Action Plan**: List practical steps the founder should take next.

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
