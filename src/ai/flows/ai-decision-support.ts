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
});
export type DecisionSupportInput = z.infer<typeof DecisionSupportInputSchema>;

const DecisionSupportOutputSchema = z.object({
  recommendation: z.string().describe('The recommended course of action.'),
  options: z.array(z.object({
    title: z.string().describe('The name of the option.'),
    benefits: z.array(z.string()).describe('Analyzed benefits.'),
    risks: z.array(z.string()).describe('Analyzed risks.'),
    effort: z.string().describe('Estimated effort required.'),
  })).describe('Analysis of the options.'),
  frameworkUsed: z.string().describe('The framework used (e.g., Lean Startup, JTBD).'),
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

**Founder Mindset & Long-Term Vision:**
- Weigh every option against: Scalability, Network Effects, Competitive Moats, and Global Potential.
- Pick the best option based on speed, learning, and long-term defensibility.

**Decision Framework:**
1. Identify Options
2. Analyze Benefits
3. Analyze Risks
4. Estimate Effort
5. Recommend

**Startup Frameworks:** Use Lean Startup, Design Thinking, PMF, Jobs-to-be-Done, etc.

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
