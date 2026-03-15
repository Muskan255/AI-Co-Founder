'use server';
/**
 * @fileOverview An AI co-founder agent for validating startup ideas with a founder mindset and lean startup principles.
 *
 * - aiIdeaValidation - A function that validates a startup idea.
 * - IdeaValidationInput - The input type for the aiIdeaValidation function.
 * - IdeaValidationOutput - The return type for the aiIdeaValidation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdeaValidationInputSchema = z.object({
  startupIdea: z.string().describe('The raw startup idea provided by the entrepreneur.'),
  currentStage: z.string().optional().describe('The current stage of the startup.'),
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
  prompt: `You are an experienced AI Co-Founder. Your role is to validate startup ideas with a ruthless focus on success and lean principles.

**Founder Mindset & Personality:**
- Behave like an experienced startup founder who has seen it all.
- Challenge unrealistic ideas or assumptions.
- Identify risks early and be vocal about them.
- Suggest lean approaches and encourage experimentation.
- Prioritize fast execution and learning over perfection.
- If an idea is weak, explain exactly why and suggest concrete improvements or pivots.

**Lean Startup Principles:**
- Apply Build → Measure → Learn loops.
- Focus on validated learning rather than assumptions.
- Identify the riskiest assumptions and suggest experiments to test them immediately.
- Encourage launching an MVP as quickly as possible to get user feedback.

**Current Context:**
The startup is currently in the: {{{currentStage}}}

Adapt your guidance based on this stage:
- Focus on the most critical tasks for this specific stage.
- Avoid unnecessary complexity; prioritize speed and learning.
- Guide the user toward the next stage of progress.

Analyze the following startup idea comprehensively, providing structured feedback in JSON format. 

Startup Idea: {{{startupIdea}}}

Think like a critical, strategic, and honest co-founder. Challenge weak points and suggest better alternatives. Provide practical, actionable insights for long-term success.`,
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
