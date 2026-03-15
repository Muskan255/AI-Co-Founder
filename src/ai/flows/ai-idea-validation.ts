'use server';
/**
 * @fileOverview An AI co-founder agent for validating startup ideas.
 *
 * - aiIdeaValidation - A function that validates a startup idea.
 * - IdeaValidationInput - The input type for the aiIdeaValidation function.
 * - IdeaValidationOutput - The return type for the aiIdeaValidation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdeaValidationInputSchema = z.object({
  startupIdea: z.string().describe('The raw startup idea provided by the entrepreneur.'),
});
export type IdeaValidationInput = z.infer<typeof IdeaValidationInputSchema>;

const IdeaValidationOutputSchema = z.object({
  analysis: z.string().describe('A comprehensive analysis of the startup idea.'),
  targetMarket: z.string().describe('The identified primary target market for the startup idea.'),
  problemSolved: z.string().describe('The core problem that the startup idea aims to solve.'),
  feasibilityEvaluation: z
    .string()
    .describe('An evaluation of the technical and market feasibility of the idea.'),
  improvementsSuggested: z
    .string()
    .describe('Suggestions for improving the startup idea or its implementation.'),
  competitors: z.string().describe('Identified direct and indirect competitors.'),
  uniqueDifferentiation: z
    .string()
    .describe('Proposed unique selling points or differentiation strategies.'),
});
export type IdeaValidationOutput = z.infer<typeof IdeaValidationOutputSchema>;

export async function aiIdeaValidation(input: IdeaValidationInput): Promise<IdeaValidationOutput> {
  return aiIdeaValidationFlow(input);
}

const ideaValidationPrompt = ai.definePrompt({
  name: 'ideaValidationPrompt',
  input: {schema: IdeaValidationInputSchema},
  output: {schema: IdeaValidationOutputSchema},
  prompt: `You are an AI Co-Founder. Your role is to validate startup ideas.

Analyze the following startup idea comprehensively, providing structured feedback in JSON format. Your evaluation should cover:
1. Idea Analysis: Provide a general analysis of the idea, its core concept, and potential.
2. Target Market: Identify the primary target market(s).
3. Problem Solved: Clearly define the problem this idea solves for its target market.
4. Feasibility Evaluation: Assess its technical and market feasibility. Consider resources, current technology, and market readiness.
5. Improvements Suggested: Suggest concrete improvements or pivots to strengthen the idea.
6. Competitors: Identify potential direct and indirect competitors.
7. Unique Differentiation: Suggest how this idea can uniquely differentiate itself in the market.

Startup Idea: {{{startupIdea}}}

Think like a critical, strategic, and honest co-founder. Challenge weak points and suggest better alternatives. Provide practical, actionable insights for long-term success.
`,
});

const aiIdeaValidationFlow = ai.defineFlow(
  {
    name: 'aiIdeaValidationFlow',
    inputSchema: IdeaValidationInputSchema,
    outputSchema: IdeaValidationOutputSchema,
  },
  async input => {
    const {output} = await ideaValidationPrompt(input);
    return output!;
  }
);
