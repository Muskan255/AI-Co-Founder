'use server';
/**
 * @fileOverview This file implements an AI flow for breaking down a startup blueprint
 * into actionable tasks, key milestones, and KPIs with a founder mindset and lean principles.
 *
 * - aiTaskMilestoneManagement - A function that handles the generation of tasks, milestones, and KPIs.
 * - AiTaskMilestoneManagementInput - The input type for the aiTaskMilestoneManagement function.
 * - AiTaskMilestoneManagementOutput - The return type for the aiTaskMilestoneManagement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiTaskMilestoneManagementInputSchema = z
  .object({
    startupBlueprint: z
      .string()
      .describe(
        'A comprehensive description of the startup blueprint, including problem statement, target users, value proposition, business model, etc.'
      ),
    currentStage: z.string().optional().describe('The current stage of the startup.'),
  })
  .describe('Input for the AI task and milestone management flow.');
export type AiTaskMilestoneManagementInput = z.infer<
  typeof AiTaskMilestoneManagementInputSchema
>;

const AiTaskMilestoneManagementOutputSchema = z
  .object({
    tasks: z
      .array(z.string().describe('An actionable task to be completed.'))
      .describe('A list of actionable tasks derived from the startup blueprint.'),
    milestones: z
      .array(
        z
          .object({
            name: z.string().describe('The name of the milestone.'),
            description: z
              .string()
              .describe('A detailed description of the milestone.'),
            targetDate: z
              .string()
              .optional()
              .describe('An optional target completion date for the milestone (e.g., YYYY-MM-DD).'),
          })
          .describe('A key milestone with its details.')
      )
      .describe('A list of key milestones for the startup blueprint.'),
    kpis: z
      .array(
        z
          .object({
            name: z.string().describe('The name of the KPI.'),
            description: z.string().describe('A description of what the KPI measures.'),
            targetValue: z
              .string()
              .optional()
              .describe('An optional target value or range for the KPI (e.g., "10% conversion rate", "500 daily active users").'),
          })
          .describe('A Key Performance Indicator (KPI) with its details.')
      )
      .describe('A list of Key Performance Indicators (KPIs) to track progress.'),
  })
  .describe('Output from the AI task and milestone management flow.');
export type AiTaskMilestoneManagementOutput = z.infer<
  typeof AiTaskMilestoneManagementOutputSchema
>;

export async function aiTaskMilestoneManagement(
  input: AiTaskMilestoneManagementInput
): Promise<AiTaskMilestoneManagementOutput> {
  return aiTaskMilestoneManagementFlow(input);
}

const aiTaskMilestoneManagementPrompt = ai.definePrompt({
  name: 'aiTaskMilestoneManagementPrompt',
  input: {schema: AiTaskMilestoneManagementInputSchema},
  output: {schema: AiTaskMilestoneManagementOutputSchema},
  prompt: `You are an expert AI startup co-founder specializing in lean execution and strategic planning.

**Founder Mindset & Personality:**
- Behave like an experienced startup founder who values execution over planning.
- Challenge busy-work tasks that don't move the needle.
- Identify risks in the execution plan early.
- Suggest lean approaches and encourage experimentation to validate tasks quickly.
- Prioritize fast execution and measurable progress.
- If the blueprint seems to lack clarity, create tasks specifically designed to find that clarity.

**Lean Startup Principles:**
- Apply Build → Measure → Learn loops in task prioritization.
- Focus on validated learning: every milestone should represent a significant lesson learned from users.
- Launch MVPs quickly and iterate based on real feedback.
- Avoid unnecessary development; build only what is required to reach the next learning checkpoint.

**Current Context:**
The startup is currently in the: {{{currentStage}}}

Analyze the following startup blueprint and generate a structured list of tasks, milestones, and KPIs.

Startup Blueprint:
{{{startupBlueprint}}}

Ensure that:
- Tasks are specific, measurable, achievable, relevant, and time-bound (SMART).
- Milestones represent significant achievements or "validated learning" stages.
- KPIs are quantifiable metrics that reflect the health and progress towards strategic goals.
- The output is formatted strictly as a JSON object matching the output schema provided.
`,
});

const aiTaskMilestoneManagementFlow = ai.defineFlow(
  {
    name: 'aiTaskMilestoneManagementFlow',
    inputSchema: AiTaskMilestoneManagementInputSchema,
    outputSchema: AiTaskMilestoneManagementOutputSchema,
  },
  async input => {
    const {output} = await aiTaskMilestoneManagementPrompt(input);
    if (!output) {
      throw new Error('Failed to generate tasks, milestones, and KPIs.');
    }
    return output;
  }
);
