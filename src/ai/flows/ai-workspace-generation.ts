'use server';
/**
 * @fileOverview A comprehensive AI agent that generates an entire startup workspace from a single idea.
 *
 * - aiWorkspaceGeneration - Generates roadmap, specs, copy, pitch deck, and marketing plan.
 * - WorkspaceInput - The input type.
 * - WorkspaceOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WorkspaceInputSchema = z.object({
  idea: z.string().describe('The core startup idea.'),
  role: z.string().optional().describe('The co-founder role generating this workspace.'),
  stage: z.string().optional().describe('Current startup stage.'),
});
export type WorkspaceInput = z.infer<typeof WorkspaceInputSchema>;

const WorkspaceOutputSchema = z.object({
  roadmap: z.object({
    milestones: z.array(z.object({
      title: z.string(),
      tasks: z.array(z.string()),
      kpi: z.string(),
    })),
  }),
  productSpecs: z.object({
    mvpFeatures: z.array(z.string()),
    techStack: z.object({
      frontend: z.string(),
      backend: z.string(),
      database: z.string(),
    }),
    userStories: z.array(z.string()),
  }),
  landingPageCopy: z.object({
    hero: z.string(),
    subhero: z.string(),
    benefits: z.array(z.string()),
    cta: z.string(),
  }),
  pitchDeck: z.object({
    slides: z.array(z.object({
      title: z.string(),
      content: z.string(),
    })),
  }),
  marketingPlan: z.object({
    channels: z.array(z.string()),
    strategy: z.string(),
    viralLoop: z.string(),
  }),
});
export type WorkspaceOutput = z.infer<typeof WorkspaceOutputSchema>;

export async function aiWorkspaceGeneration(input: WorkspaceInput): Promise<WorkspaceOutput> {
  return aiWorkspaceGenerationFlow(input);
}

const workspacePrompt = ai.definePrompt({
  name: 'workspacePrompt',
  input: {schema: WorkspaceInputSchema},
  output: {schema: WorkspaceOutputSchema},
  prompt: `You are acting as the {{{role}}} of a high-growth startup. Your goal is to generate a complete Startup Workspace from a single idea.

{{#if (eq role "AI Growth Hacker")}}
You are the AI Growth Hacker. Focus on rapid user acquisition and scalable growth experiments.
{{/if}}

**Founder Mindset & Personality:**
- Be realistic, aggressive, and execution-focused.
- Prioritize lean principles and speed to market.
- Always consider: Scalability, Network Effects, Competitive Moats, and Global Potential from the perspective of a {{{role}}}.

**Idea:** {{{idea}}}
**Current Stage:** {{{stage}}}
**Your Role:** {{{role}}}

Generate a comprehensive workspace including:
1. **Roadmap**: 3 key milestones with specific tasks and KPIs.
2. **Product Specs**: Core MVP features, a fast tech stack, and primary user stories.
3. **Landing Page Copy**: High-conversion copy (Hero, Benefits, CTA).
4. **Pitch Deck**: A 10-slide outline.
5. **Marketing Plan**: Scalable acquisition channels and a viral growth loop.

Apply proven frameworks like Jobs-to-be-Done and Lean Startup.`,
});

const aiWorkspaceGenerationFlow = ai.defineFlow(
  {
    name: 'aiWorkspaceGenerationFlow',
    inputSchema: WorkspaceInputSchema,
    outputSchema: WorkspaceOutputSchema,
  },
  async input => {
    const {output} = await workspacePrompt({
      ...input,
      role: input.role || 'AI CEO'
    });
    if (!output) throw new Error('Workspace generation failed.');
    return output;
  }
);
