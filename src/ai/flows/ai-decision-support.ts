'use server';
/**
 * @fileOverview AI Founder decision support.
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
  insight: z.string().describe('The insight from this role.'),
});

const DecisionSupportOutputSchema = z.object({
  recommendation: z.string().describe('Recommended course of action.'),
  options: z.array(z.object({
    title: z.string().describe('Name of the option.'),
    benefits: z.array(z.string()).describe('Benefits.'),
    risks: z.array(z.string()).describe('Risks.'),
    effort: z.string().describe('Estimated effort.'),
  })).describe('Analysis of options.'),
  frameworkUsed: z.string().describe('Framework used.'),
  collaboration: z.array(ExecutivePerspectiveSchema).describe('Insights from the executive team.'),
});
export type DecisionSupportOutput = z.infer<typeof DecisionSupportOutputSchema>;

export async function aiDecisionSupport(input: DecisionSupportInput): Promise<DecisionSupportOutput> {
  return aiDecisionSupportFlow(input);
}

const decisionPrompt = ai.definePrompt({
  name: 'decisionPrompt',
  input: {schema: DecisionSupportInputSchema},
  output: {schema: DecisionSupportOutputSchema},
  prompt: `You are the {{{role}}} of the AI Founder startup.

**Current Startup Stage: {{{currentStage}}}**
Evaluate the decision in the context of:
{{#if (eq currentStage "Idea Stage")}} Idea validation and problem-market fit.
{{else if (eq currentStage "MVP Development")}} Technical speed and core functionality.
{{else if (eq currentStage "Early Traction")}} User feedback and growth experiments.
{{else if (eq currentStage "Scaling Stage")}} Operational efficiency and long-term sustainability.
{{/if}}

Situation: {{{query}}}`,
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
    return output!;
  }
);