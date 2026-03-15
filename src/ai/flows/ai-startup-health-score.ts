'use server';
/**
 * @fileOverview AI Startup Health Score Engine.
 * Evaluates the venture across 4 dimensions and provides a score out of 100.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HealthScoreInputSchema = z.object({
  brain: z.record(z.any()).describe('The current Startup Brain data.'),
  currentStage: z.string().optional(),
});
export type HealthScoreInput = z.infer<typeof HealthScoreInputSchema>;

const HealthScoreOutputSchema = z.object({
  totalScore: z.number().min(0).max(100),
  breakdown: z.object({
    ideaQuality: z.number().min(0).max(25),
    marketClarity: z.number().min(0).max(25),
    productReadiness: z.number().min(0).max(25),
    revenueModel: z.number().min(0).max(25),
  }),
  suggestions: z.array(z.string()).describe('Actionable improvements.'),
  analysis: z.string().describe('Short executive summary of the health score.'),
});
export type HealthScoreOutput = z.infer<typeof HealthScoreOutputSchema>;

export async function aiStartupHealthScore(input: HealthScoreInput): Promise<HealthScoreOutput> {
  return aiStartupHealthScoreFlow(input);
}

const healthScorePrompt = ai.definePrompt({
  name: 'healthScorePrompt',
  input: { schema: HealthScoreInputSchema },
  output: { schema: HealthScoreOutputSchema },
  prompt: `You are the AI Co-Founder Chief Auditor. 
Your task is to ruthlessly evaluate the "health" and "readiness" of a startup venture based on its shared memory (Startup Brain).

**Startup Brain Data:**
{{#each brain}}
- {{ @key }}: {{ this }}
{{/each}}

**Scoring Criteria (Each out of 25, Total 100):**
1. **Idea Quality**: Is the problem clear? Is the solution unique? (Score 0-25)
2. **Market Clarity**: Are target users, segments, and competitors clearly defined? (Score 0-25)
3. **Product Readiness**: Are MVP features, tech stack, and roadmap detailed? (Score 0-25)
4. **Revenue Model**: Is there a monetization strategy, pricing, and financial forecast? (Score 0-25)

**Operational Guidelines:**
- Be objective. If fields like 'revenue_model' or 'tech_stack' are empty, that category score should be very low (0-5).
- If information is vague, give partial credit (10-15).
- High scores (20+) require specific, actionable details.
- Provide 3-4 specific suggestions to improve the score.`,
});

const aiStartupHealthScoreFlow = ai.defineFlow(
  {
    name: 'aiStartupHealthScoreFlow',
    inputSchema: HealthScoreInputSchema,
    outputSchema: HealthScoreOutputSchema,
  },
  async (input) => {
    const { output } = await healthScorePrompt(input);
    if (!output) throw new Error('Failed to generate health score.');
    return output;
  }
);
