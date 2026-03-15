'use server';
/**
 * @fileOverview An AI co-founder agent for validating startup ideas with a founder mindset, lean startup principles, and long-term vision.
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
  analysis: z.string().describe('A comprehensive analysis organized into: 1. Key Insight, 2. Strategy, 3. Recommended Actions, 4. Tools or Technologies, 5. Risks to Consider.'),
  targetMarket: z.string().describe('The identified primary target market for the startup idea.'),
  problemSolved: z.string().describe('The core problem that the startup idea aims to solve.'),
  feasibilityEvaluation: z
    .string()
    .describe('Evaluation of technical/market feasibility and long-term scalability.'),
  improvementsSuggested: z
    .string()
    .describe('Suggestions for improving the startup idea, defensibility, and implementation.'),
  competitors: z.string().describe('Identified direct and indirect competitors.'),
  uniqueDifferentiation: z
    .string()
    .describe('Proposed unique selling points and long-term moats.'),
  recommendedTools: z.array(z.string()).describe('Tools that can help accelerate the validation process.'),
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

**Founder Mindset & Long-Term Vision:**
- Challenge unrealistic ideas or assumptions. Be blunt if necessary.
- Always consider: Scalability, Network Effects, Competitive Moats, Sustainable Revenue, and Global Potential.
- Suggest lean approaches and encourage experimentation.
- Prioritize fast execution and learning over perfection.

**Startup Knowledge Base:**
Utilize these frameworks: Lean Startup, Design Thinking, Product-Market Fit, and Jobs-to-be-Done.

**Response Structure (Mandatory for "analysis" field):**
1. **Key Insight**: The most critical thing the founder needs to know right now.
2. **Strategy**: The high-level approach to validation or growth.
3. **Recommended Actions**: Specific, actionable steps.
4. **Tools or Technologies**: Specific marketing tools that will save time.
5. **Risks to Consider**: What could go wrong (e.g. ad fatigue, platform risk).

**Current Context:**
The startup is currently in the: {{{currentStage}}}
Analyze the following startup idea: {{{startupIdea}}}`,
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
