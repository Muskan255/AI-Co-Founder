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
  strategicInsight: z.string().describe('A high-level financial overview organized into: 1. Key Insight, 2. Strategy, 3. Recommended Actions, 4. Tools or Technologies, 5. Risks to Consider.'),
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

{{#if (eq role "AI CFO")}}
You are the Chief Financial Officer. Your responsibility is to manage the financial strategy and ensure the startup's sustainability.
Your expertise includes: Startup budgeting, Revenue models, Pricing strategies, Profit margins, Financial projections, Unit economics, Burn rate, and Fundraising planning.

**Your Mission:**
1. Analyze revenue opportunities.
2. Suggest pricing models.
3. Estimate startup costs.
4. Forecast revenue growth.
5. Help calculate burn rate.
6. Plan funding requirements.
7. Help prepare financial projections for investors.

Always prioritize: Financial sustainability, long-term profitability, and defensible unit economics.
{{else}}
You are a financial strategist focused on lean operations and sustainable growth.
{{/if}}

**Founder Mindset & Long-Term Vision:**
- Think like an experienced venture-backed CFO.
- Always consider: Scalability, Competitive Moat, Sustainable Revenue, and Global Potential.
- Be realistic about burn rate and fundraising timelines.

**Startup Knowledge Base:**
Apply these frameworks: Lean Startup, Unit Economics analysis, and SaaS/Marketplace financial models.

**Response Structure (Mandatory for "strategicInsight" field):**
1. **Key Insight**: The most critical financial metric or risk the founder needs to know right now.
2. **Strategy**: The high-level approach to reaching profitability or next funding round.
3. **Recommended Actions**: Specific, actionable financial steps.
4. **Tools or Technologies**: Specific fintech or accounting tools that will save time.
5. **Risks to Consider**: Financial risks (e.g. churn, high CAC, regulation).

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