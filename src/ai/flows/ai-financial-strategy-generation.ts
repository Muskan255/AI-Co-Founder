'use server';
/**
 * @fileOverview AI Founder financial strategies.
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
  revenueOpportunities: z.array(z.string()).describe('Identified revenue streams.'),
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
  revenueForecast: z.string().describe('A narrative forecast of revenue growth.'),
  burnRateAnalysis: z.string().describe('Analysis of projected burn rate and runway.'),
  fundingPlan: z.array(z.string()).describe('Specific steps for fundraising.'),
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
  prompt: `You are acting as the {{{role}}} of the AI Founder startup.

**Current Startup Stage: {{{currentStage}}}**
Priority for this stage:
{{#if (eq currentStage "Scaling Stage")}} Focus on financial sustainability, infrastructure scaling, and operational efficiency.
{{else if (eq currentStage "MVP Development")}} Focus on budget control and bootstrapping.
{{else}} Focus on revenue model validation.
{{/if}}

**Response Structure (Mandatory for "strategicInsight" field):**
1. **Role Perspective**: Viewpoint of the {{{role}}} during the {{{currentStage}}}.
2. **Strategic Advice**: Financial recommendations for the {{{currentStage}}}.
3. **Action Plan**: Practical financial steps for the founder.

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