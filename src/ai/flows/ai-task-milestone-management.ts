'use server';
/**
 * @fileOverview This file implements an AI flow for breaking down a startup blueprint
 * into actionable tasks, key milestones, and Key Performance Indicators (KPIs).
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
  prompt: `You are an expert startup co-founder specializing in task management and strategic planning.
Your goal is to help an entrepreneur break down their startup blueprint into actionable tasks, key milestones, and Key Performance Indicators (KPIs).

Analyze the following startup blueprint and generate a structured list of tasks, milestones, and KPIs that will help the entrepreneur track progress and stay organized.

Startup Blueprint:
{{{startupBlueprint}}}

Ensure that:
- Tasks are specific, measurable, achievable, relevant, and time-bound (SMART).
- Milestones represent significant achievements or stages in the startup's development.
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
