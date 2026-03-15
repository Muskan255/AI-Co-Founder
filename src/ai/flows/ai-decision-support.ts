'use server';
/**
 * @fileOverview An AI agent for structured startup decision making with a long-term vision.
 *
 * - aiDecisionSupport - A function that evaluates startup choices using a structured framework.
 * - DecisionSupportInput - The input type for the decision support function.
 * - DecisionSupportOutput - The return type for the decision support function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DecisionSupportInputSchema = z.object({
  query: z.string().describe('The decision situation or question.'),
  currentStage: z.string().optional().describe('The current stage of the startup.'),
  role: z.string().optional().describe('The specific co-founder role acting on this request.'),
});
export type DecisionSupportInput = z.infer<typeof DecisionSupportInputSchema>;

const ExecutivePerspectiveSchema = z.object({
  role: z.string().describe('The role providing the perspective.'),
  insight: z.string().describe('The specific perspective or consideration from this role.'),
});

const DecisionSupportOutputSchema = z.object({
  recommendation: z.string().describe('The recommended course of action.'),
  options: z.array(z.object({
    title: z.string().describe('The name of the option.'),
    benefits: z.array(z.string()).describe('Analyzed benefits.'),
    risks: z.array(z.string()).describe('Analyzed risks.'),
    effort: z.string().describe('Estimated effort required.'),
  })).describe('Analysis of the options.'),
  frameworkUsed: z.string().describe('The framework used (e.g., Lean Startup, JTBD).'),
  collaboration: z.array(ExecutivePerspectiveSchema).describe('Insights from the full executive team.'),
});
export type DecisionSupportOutput = z.infer<typeof DecisionSupportOutputSchema>;

export async function aiDecisionSupport(input: DecisionSupportInput): Promise<DecisionSupportOutput> {
  return aiDecisionSupportFlow(input);
}

const decisionPrompt = ai.definePrompt({
  name: 'decisionPrompt',
  input: {schema: DecisionSupportInputSchema},
  output: {schema: DecisionSupportOutputSchema},
  prompt: `You are acting as the {{{role}}} of the startup, helping make a critical decision.

**Founder Mindset & Long-Term Vision:**
- Weigh every option against: Scalability, Network Effects, Competitive Moats, and Global Potential.
- Pick the best option based on speed, learning, and long-term defensibility.

**Decision Framework:**
1. Identify Options
2. Analyze Benefits
3. Analyze Risks
4. Estimate Effort
5. Recommend

**Executive Collaboration Mode:**
Regardless of your primary active role ({{{role}}}), you must also provide a brief, high-impact perspective from each member of the executive team:
- AI CTO: Technical considerations (architecture, stack, scalability).
- AI CMO: Marketing implications (branding, positioning, user reach).
- AI CFO: Financial impact (burn rate, revenue, sustainability).
- AI Product Manager: Product strategy (UX, features, PMF).
- AI Growth Hacker: Growth opportunities (viral loops, acquisition experiments).

**Context:**
The startup is in: {{{currentStage}}}
Situation: {{{query}}}

Provide a structured evaluation, a clear recommendation, and the collaborative executive insights.`,
});

const aiDecisionSupportFlow = ai.defineFlow(
  {
    name: 'aiDecisionSupportFlow',
    inputSchema: DecisionSupportInputSchema,
    outputSchema: DecisionSupportOutputSchema,
  },
  async input => {
    const {output} = await decisionPrompt({
      ...input,
      role: input.role || 'AI Founder'
    });
    if (!output) throw new Error('Failed to analyze decision.');
    return output;
  }
);
