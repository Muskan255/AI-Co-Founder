'use server';
/**
 * @fileOverview AI Executive Action flow for practical startup tasks.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExecutiveActionInputSchema = z.object({
  role: z.string().describe('The active executive role (CTO, CMO, etc.)'),
  taskType: z.string().describe('The specific tool or task being performed'),
  startupIdea: z.string().describe('The core startup idea'),
  stage: z.string().describe('Current startup stage'),
  userPrompt: z.string().optional().describe('Optional additional context from user'),
});
export type ExecutiveActionInput = z.infer<typeof ExecutiveActionInputSchema>;

const ExecutiveActionOutputSchema = z.object({
  title: z.string(),
  description: z.string(),
  content: z.string().describe('The primary output (markdown, code, or structured text)'),
  format: z.enum(['markdown', 'code', 'text']).default('markdown'),
  language: z.string().optional().describe('Programming language if format is code'),
  additionalInsights: z.array(z.string()).optional(),
});
export type ExecutiveActionOutput = z.infer<typeof ExecutiveActionOutputSchema>;

export async function aiExecutiveAction(input: ExecutiveActionInput): Promise<ExecutiveActionOutput> {
  return aiExecutiveActionFlow(input);
}

const executiveActionPrompt = ai.definePrompt({
  name: 'executiveActionPrompt',
  input: {schema: ExecutiveActionInputSchema},
  output: {schema: ExecutiveActionOutputSchema},
  prompt: `You are the {{{role}}} of the startup: "{{{startupIdea}}}".
Current Stage: {{{stage}}}

Perform the following executive task: **{{{taskType}}}**
{{#if userPrompt}}Specific User Request: {{{userPrompt}}}{{/if}}

**Operational Guidelines:**
- If you are the **AI CTO**: Provide technically accurate, scalable, and modern solutions. For code, use production-grade standards (e.g., TypeScript, NextJS, React).
- If you are the **AI CMO**: Be creative, brand-focused, and strategic. Focus on narrative and positioning.
- If you are the **AI CFO**: Be analytical, realistic, and financially prudent. Focus on unit economics and burn rate.
- If you are the **AI Product Manager**: Be user-centric and practical. Focus on the "Job to be Done" and MVP feasibility.
- If you are the **AI Growth Hacker**: Be aggressive, experimental, and growth-obsessed. Focus on loops and conversion.

**Response Requirements:**
1. **title**: A concise title for the generated asset.
2. **description**: A short explanation of what was created.
3. **content**: The main body of work. 
   - If generating code, ensure it is clean and commented.
   - If generating a strategy, use clear headers and bullet points.
4. **format**: Set to 'code' ONLY if the main content is a code block. Otherwise 'markdown'.
5. **language**: If format is 'code', specify the language (e.g., 'typescript', 'sql', 'json').`,
});

const aiExecutiveActionFlow = ai.defineFlow(
  {
    name: 'aiExecutiveActionFlow',
    inputSchema: ExecutiveActionInputSchema,
    outputSchema: ExecutiveActionOutputSchema,
  },
  async input => {
    const {output} = await executiveActionPrompt(input);
    if (!output) throw new Error('Executive action failed.');
    return output!;
  }
);
