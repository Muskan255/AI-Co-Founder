'use server';
/**
 * @fileOverview An AI agent that generates financial strategies with a founder mindset, focusing on sustainability and fundraising.
 * 
 * Specifically adapted for the AI CFO role.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialStrategyGenerationInputSchema = z.object({
  startupIdea: z.string().describe('The core startup idea or product description.'),
  currentStage: z.string().optional().describe('The current stage of the startup.'),
  role: z.string().optional().describe('The specific co-founder role acting on this request.'),
});
export type FinancialStrategyGenerationInput = z.infer<typeof FinancialStrategyGenerationInputSchema>;

const FinancialStrategyGenerationOutputSchema = z.object({
  strategicInsight: z.string().describe('A high-level financial overview organized into: 1. Role Perspective, 2. Strategic Advice, 3. Action Plan.'),
  revenueOpportunities: z.array(z.string()).describe('Identified primary and secondary revenue streams.'),
  pricingModels: z.array(z.object({
    model: z.string().describe('Name of the pricing model.'),
    description: z.string().describe('Detailed explanation.'),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
  })).describe('Suggested pricing strategies.'),
  costEstimations: z.array(z.object({
    category: z.string(),
    estimatedMonthlyCost: z.string(),
    priority: z.enum(['High', 'Medium', 'Low']),
  })).describe('Estimated startup costs.'),
  revenueForecast: z.string().describe('A narrative or structured forecast of revenue growth over the next 12-24 months.'),
  burnRateAnalysis: z.string().describe('Analysis of the projected burn rate and runway expectations.'),
  fundingPlan: z.array(z.string()).describe('Specific steps for fundraising (e.g., Angel, Seed, Bootstrapping).'),
  unitEconomics: z.object({
    cac: z.string().describe('Estimated Customer Acquisition Cost.'),
    ltv: z.string().describe('Estimated Lifetime Value.'),
    paybackPeriod: z.string().describe('Projected time to recover CAC.'),
  }).describe('Core unit economics assumptions.'),
});
export type FinancialStrategyGenerationOutput = z.infer<typeof FinancialStrategyGenerationOutputSchema>;

export async function aiFinancialStrategyGeneration(input: FinancialStrategyGenerationInput): Promise<FinancialStrategyGenerationOutput> {
  return aiFinancialStrategyGenerationFlow(input);
}

const financialStrategyPrompt = ai.definePrompt({
  name: 'financialStrategyPrompt',
  input: {schema: FinancialStrategyGenerationInputSchema},
  output: {schema: FinancialStrategyGenerationOutputSchema},
  prompt: `You are acting as the {{{role}}} of the startup.

**Persona Communication Style:**
{{#if (eq role "AI CFO")}} You are analytical and financial. Focus on revenue models, pricing strategies, burn rate, and fundraising planning. {{else}} You are a technical/strategic executive helping with financial planning. {{/if}}

**Founder Mindset & Long-Term Vision:**
- Think like an experienced venture-backed CFO.
- Always consider: Scalability, Competitive Moat, Sustainable Revenue, and Global Potential.

**Response Structure (Mandatory for "strategicInsight" field):**
1. **Role Perspective**: Explain the situation from the viewpoint of the active executive ({{{role}}}).
2. **Strategic Advice**: Provide high-level recommendations.
3. **Action Plan**: List practical steps the founder should take next.

**Current Context:**
The startup is in: {{{currentStage}}}
Idea: {{{startupIdea}}}`,
});

const aiFinancialStrategyGenerationFlow = ai.defineFlow(
  {
    name: 'aiFinancialStrategyGenerationFlow',
    inputSchema: FinancialStrategyGenerationInputSchema,
    outputSchema: FinancialStrategyGenerationOutputSchema,
  },
  async input => {
    const {output} = await financialStrategyPrompt({
      ...input,
      role: input.role || 'AI CFO'
    });
    return output!;
  }
);
