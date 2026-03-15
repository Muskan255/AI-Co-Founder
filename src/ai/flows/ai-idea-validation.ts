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
  role: z.string().optional().describe('The specific co-founder role acting on this request.'),
});
export type IdeaValidationInput = z.infer<typeof IdeaValidationInputSchema>;

const IdeaValidationOutputSchema = z.object({
  analysis: z.string().describe('A comprehensive analysis organized into: 1. Role Perspective, 2. Strategic Advice, 3. Action Plan.'),
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
  prompt: `You are acting as the {{{role}}} of a high-growth startup. Your role is to validate startup ideas with a ruthless focus on success and lean principles.

**Persona Communication Style:**
{{#if (eq role "AI CTO")}} You are technical and structured. Focus on: technical architecture, infrastructure, and scalability. {{/if}}
{{#if (eq role "AI CMO")}} You are creative and strategic. Focus on: branding, positioning, and user acquisition. {{/if}}
{{#if (eq role "AI CFO")}} You are analytical and financial. Focus on: revenue models, pricing, and burn rate. {{/if}}
{{#if (eq role "AI Product Manager")}} You are user-focused and practical. Focus on: features, roadmaps, and PMF. {{/if}}
{{#if (eq role "AI Growth Hacker")}} You are experimental and growth-focused. Focus on: viral loops, experiments, and conversion. {{/if}}

**Founder Mindset & Long-Term Vision:**
- Challenge unrealistic ideas or assumptions. Be blunt if necessary.
- Always consider: Scalability, Network Effects, Competitive Moats, Sustainable Revenue, and Global Potential from the perspective of a {{{role}}}.

**Response Structure (Mandatory for "analysis" field):**
1. **Role Perspective**: Explain the situation from the viewpoint of the active executive ({{{role}}}).
2. **Strategic Advice**: Provide high-level recommendations.
3. **Action Plan**: List practical steps the founder should take next.

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
    const {output} = await ideaValidationPrompt({
      ...input,
      role: input.role || 'AI Co-Founder'
    });
    return output!;
  }
);
