'use server';
/**
 * @fileOverview AI Smart Notification Engine.
 * Analyzes the Startup Brain and generates strategic suggestions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestionTypeSchema = z.enum([
  'Idea Improvement',
  'Product Development',
  'Marketing Strategy',
  'Financial Planning',
  'Technical Development',
]);

const SuggestionActionSchema = z.object({
  label: z.string().describe('Label for the action button.'),
  view: z.string().describe('The view ID to navigate to (e.g., "validation", "blueprint").'),
});

const SuggestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: SuggestionTypeSchema,
  priority: z.enum(['low', 'medium', 'high']),
  action: SuggestionActionSchema,
});

const SmartNotificationsInputSchema = z.object({
  brain: z.record(z.any()).describe('The current Startup Brain data.'),
  currentStage: z.string().optional(),
});
export type SmartNotificationsInput = z.infer<typeof SmartNotificationsInputSchema>;

const SmartNotificationsOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema),
});
export type SmartNotificationsOutput = z.infer<typeof SmartNotificationsOutputSchema>;

export async function aiSmartNotifications(input: SmartNotificationsInput): Promise<SmartNotificationsOutput> {
  return aiSmartNotificationsFlow(input);
}

const notificationsPrompt = ai.definePrompt({
  name: 'notificationsPrompt',
  input: { schema: SmartNotificationsInputSchema },
  output: { schema: SmartNotificationsOutputSchema },
  prompt: `You are the AI Co-Founder Chief Strategist. 
Analyze the current state of the startup based on its "Global Brain" and current stage ({{{currentStage}}}).

**Startup Brain Context:**
{{#each brain}}
- {{ @key }}: {{ this }}
{{/each}}

**Task:**
Identify critical gaps or opportunities for improvement. Generate exactly 2-3 high-impact suggestions.
Each suggestion MUST link to one of the following views:
- 'validation' (Idea Validation)
- 'blueprint' (Strategy Blueprint)
- 'product' (Product Development)
- 'marketing' (Marketing Strategy)
- 'finance' (Financial Plan)
- 'tasks' (Task Management)
- 'simulation' (Market Simulation)
- 'workspace' (Turbo Workspace)

**Prioritization Rules:**
1. If 'startup_idea' is empty, prioritize 'workspace' or 'validation'.
2. If 'revenue_model' is missing, prioritize 'finance' or 'blueprint'.
3. If 'tech_stack' is missing, prioritize 'product'.
4. If 'marketing_strategy' is missing, prioritize 'marketing'.

Provide ruthless but helpful advice.`,
});

const aiSmartNotificationsFlow = ai.defineFlow(
  {
    name: 'aiSmartNotificationsFlow',
    inputSchema: SmartNotificationsInputSchema,
    outputSchema: SmartNotificationsOutputSchema,
  },
  async (input) => {
    const { output } = await notificationsPrompt(input);
    if (!output) throw new Error('Failed to generate notifications.');
    return output;
  }
);
