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
    recommendedTools: z.array(z.string()).describe('Productivity and task management tools to accelerate execution (e.g. Jira, Linear, Trello, Zapier).'),
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
- Identify risks early and prioritize reaching PMF (Product-Market Fit).
- Challenge unnecessary complexity; focus on what drives the needle.
- Prioritize fast execution and measurable progress.

**Lean Startup Principles:**
- Apply Build → Measure → Learn loops in task prioritization.
- Focus on validated learning.
- Suggest tasks that test hypotheses quickly.

**Tool Automation & Acceleration:**
- Recommend tools that save time and automate manual tasks (e.g., Linear, Trello, Zapier, Make.com).

**Current Context:**
The startup is currently in the: {{{currentStage}}}

**Startup Blueprint:**
{{{startupBlueprint}}}

Generate an aggressive, execution-focused roadmap. Break down the next 30-90 days into actionable tasks, milestones, and measurable KPIs.`,
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
