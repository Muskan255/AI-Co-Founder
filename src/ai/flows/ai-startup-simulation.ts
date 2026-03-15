'use server';
/**
 * @fileOverview An AI agent that simulates real-world startup scenarios with a focus on testing long-term viability.
 *
 * - aiStartupSimulation - A function that handles the startup simulation process.
 * - AiStartupSimulationInput - The input type for the aiStartupSimulation function.
 * - AiStartupSimulationOutput - The return type for the aiStartupSimulation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulationTypeSchema = z.enum([
  'Investor Meeting',
  'Customer Feedback',
  'Market Reaction',
  'Competitor Response',
]);

const AiStartupSimulationInputSchema = z.object({
  startupIdea: z.string().describe('The core startup idea.'),
  currentStage: z.string().describe('The current stage of the startup.'),
  simulationType: SimulationTypeSchema.describe('The type of scenario to simulate.'),
  blueprint: z.string().optional().describe('The existing startup blueprint for context.'),
});
export type AiStartupSimulationInput = z.infer<typeof AiStartupSimulationInputSchema>;

const AiStartupSimulationOutputSchema = z.object({
  scenarioDescription: z.string().describe('A detailed description of the simulation setting.'),
  simulationDialog: z.array(z.object({
    role: z.string().describe('The role speaking.'),
    message: z.string().describe('The specific feedback or questions.'),
  })).describe('A scripted interaction or set of feedback points.'),
  criticalFeedback: z.string().describe('The most brutal and honest feedback.'),
  strategicAdvice: z.string().describe('Strategic guidance based on the simulation.'),
  recommendedTools: z.array(z.string()).describe('Tools to help address the issues raised.'),
});
export type AiStartupSimulationOutput = z.infer<typeof AiStartupSimulationOutputSchema>;

export async function aiStartupSimulation(
  input: AiStartupSimulationInput
): Promise<AiStartupSimulationOutput> {
  return aiStartupSimulationFlow(input);
}

const simulationPrompt = ai.definePrompt({
  name: 'aiStartupSimulationPrompt',
  input: {schema: AiStartupSimulationInputSchema},
  output: {schema: AiStartupSimulationOutputSchema},
  prompt: `You are an AI Co-Founder running a high-stakes startup simulation.

**Founder Mindset & Long-Term Vision:**
- Be realistic, skeptical, and challenging.
- Press the founder on: Scalability, Network Effects, Moats (Defensibility), and Sustainable Revenue.
- If it's an Investor Meeting, play a Tier-1 VC who demands to see Global Potential and a clear exit path.

**Simulation Type: {{{simulationType}}}**
**Current Stage: {{{currentStage}}}**
**Startup Idea: {{{startupIdea}}}**

Run a simulation focusing on the "ruthless truth" about the idea's viability and long-term defensibility.`,
});

const aiStartupSimulationFlow = ai.defineFlow(
  {
    name: 'aiStartupSimulationFlow',
    inputSchema: AiStartupSimulationInputSchema,
    outputSchema: AiStartupSimulationOutputSchema,
  },
  async input => {
    const {output} = await simulationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate simulation.');
    }
    return output;
  }
);
