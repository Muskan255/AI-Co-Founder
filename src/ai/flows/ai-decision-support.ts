'use server';
/**
 * @fileOverview An AI agent for structured startup decision making.
 *
 * - aiDecisionSupport - A function that evaluates startup choices using a structured framework.
 * - DecisionSupportInput - The input type for the decision support function.
 * - DecisionSupportOutput - The return type for the decision support function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DecisionSupportInputSchema = z.object({
  query: z.string().describe('The decision situation or question the founder is facing.'),
  currentStage: z.string().optional().describe('The current stage of the startup.'),
});
export type DecisionSupportInput = z.infer<typeof DecisionSupportInputSchema>;

const DecisionSupportOutputSchema = z.object({
  recommendation: z.string().describe('The AI Co-Founder\'s final recommended course of action.'),
  options: z.array(z.object({
    title: z.string().describe('The name of the option.'),
    benefits: z.array(z.string()).describe('List of analyzed benefits.'),
    risks: z.array(z.string()).describe('List of analyzed risks.'),
    effort: z.string().describe('Estimated effort required (Low, Medium, High) with brief explanation.'),
  })).describe('Analysis of the available options.'),
  frameworkUsed: z.string().describe('The startup framework used to evaluate this decision (e.g., Lean Startup, Design Thinking).'),
});
export type DecisionSupportOutput = z.infer<typeof DecisionSupportOutputSchema>;

export async function aiDecisionSupport(input: DecisionSupportInput): Promise<DecisionSupportOutput> {
  return aiDecisionSupportFlow(input);
}

const decisionPrompt = ai.definePrompt({
  name: 'decisionPrompt',
  input: {schema: DecisionSupportInputSchema},
  output: {schema: DecisionSupportOutputSchema},
  prompt: `You are an AI Co-Founder helping make a critical startup decision.

**Decision Framework:**
1. **Identify Options**: Brainstorm or clarify the realistic choices.
2. **Analyze Benefits**: What do we gain?
3. **Analyze Risks**: What could go wrong?
4. **Estimate Effort**: How much time/resource does this take?
5. **Recommend**: Pick the best option based on speed and learning.

**Startup Frameworks Knowledge Base:**
Apply these when relevant and explain them simply:
- **Lean Startup**: Build-Measure-Learn, MVP focus.
- **Design Thinking**: Empathy for the user, iterative prototyping.
- **Product-Market Fit (PMF)**: Solving a problem for a large enough market.
- **Growth Hacking**: Scalable, low-cost user acquisition.
- **Jobs-to-be-Done**: Understanding the underlying "job" users hire your product for.

**Context:**
The startup is in: {{{currentStage}}}
Situation: {{{query}}}

Provide a structured evaluation and a clear recommendation.`,
});

const aiDecisionSupportFlow = ai.defineFlow(
  {
    name: 'aiDecisionSupportFlow',
    inputSchema: DecisionSupportInputSchema,
    outputSchema: DecisionSupportOutputSchema,
  },
  async input => {
    const {output} = await decisionPrompt(input);
    if (!output) throw new Error('Failed to analyze decision.');
    return output;
  }
);
