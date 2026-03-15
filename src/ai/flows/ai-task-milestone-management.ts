'use server';
/**
 * @fileOverview AI Founder task and milestone management.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiTaskMilestoneManagementInputSchema = z
  .object({
    startupBlueprint: z
      .string()
      .describe(
        'A comprehensive description of the startup blueprint.'
      ),
    currentStage: z.string().optional().describe('The current stage of the startup.'),
    role: z.string().optional().describe('The specific co-founder role acting on this request.'),
  });
export type AiTaskMilestoneManagementInput = z.infer<
  typeof AiTaskMilestoneManagementInputSchema
>;

const AiTaskMilestoneManagementOutputSchema = z
  .object({
    tasks: z
      .array(z.string().describe('An actionable task.'))
      .describe('Actionable tasks.'),
    milestones: z
      .array(
        z
          .object({
            name: z.string().describe('Name of the milestone.'),
            description: z
              .string()
              .describe('Description of the milestone.'),
            targetDate: z
              .string()
              .optional()
              .describe('Optional target completion date.'),
          })
      )
      .describe('Key milestones.'),
    kpis: z
      .array(
        z
          .object({
            name: z.string().describe('Name of the KPI.'),
            description: z.string().describe('Description of the KPI.'),
            targetValue: z
              .string()
              .optional()
              .describe('Optional target value.'),
          })
      )
      .describe('Key Performance Indicators.'),
    recommendedTools: z.array(z.string()).describe('Productivity tools.'),
  });
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
  prompt: `You are the {{{role}}} of an AI Founder venture.

**Current Startup Stage: {{{currentStage}}}**
Priority for this stage:
{{#if (eq currentStage "Idea Stage")}} Focus on validation, problem definition, and concept.
{{else if (eq currentStage "Validation Stage")}} Focus on market research and demand testing.
{{else if (eq currentStage "MVP Development")}} Focus on technical architecture and MVP features.
{{else if (eq currentStage "Early Traction")}} Focus on user acquisition and rapid iteration.
{{else if (eq currentStage "Growth Stage")}} Focus on marketing scaling and brand building.
{{else if (eq currentStage "Scaling Stage")}} Focus on sustainability and operational efficiency.
{{/if}}

Generate an aggressive, stage-appropriate execution roadmap from your perspective as {{{role}}}.

Blueprint: {{{startupBlueprint}}}`,
});

const aiTaskMilestoneManagementFlow = ai.defineFlow(
  {
    name: 'aiTaskMilestoneManagementFlow',
    inputSchema: AiTaskMilestoneManagementInputSchema,
    outputSchema: AiTaskMilestoneManagementOutputSchema,
  },
  async input => {
    const {output} = await aiTaskMilestoneManagementPrompt({
      ...input,
      role: input.role || 'AI Founder'
    });
    return output!;
  }
);