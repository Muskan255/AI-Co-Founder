'use client';

import React, { useState } from 'react';
import { useStartup } from './startup-context';
import { aiIdeaValidation } from '@/ai/flows/ai-idea-validation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FeatureCard } from './feature-card';
import { Lightbulb, Send, Target, TrendingUp, Users, ShieldCheck, Zap, Wrench, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export function IdeaValidationView({ onComplete }: { onComplete: () => void }) {
  const { state, setRawIdea, setValidation, setProjectId, setProjectName } = useStartup();
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState(state.rawIdea || '');
  const { toast } = useToast();

  const handleValidate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    try {
      // Ensure project identity for persistence
      if (!state.projectId) {
        const newId = crypto.randomUUID();
        setProjectId(newId);
        // Default project name from idea
        const potentialName = idea.trim().split(' ').slice(0, 3).join(' ') + '...';
        setProjectName(potentialName);
      }

      const result = await aiIdeaValidation({ 
        startupIdea: idea,
        currentStage: state.stage,
        role: state.role
      });
      setRawIdea(idea);
      setValidation(result);
      toast({
        title: "Validation Complete",
        description: `Feedback from ${state.role} for ${state.stage}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Validation Failed",
        description: "Could not process your idea at this time.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-headline font-bold">Validate Your Idea</h2>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">{state.role} Mode</Badge>
        </div>
        <p className="text-muted-foreground">
          Pitch your idea to your {state.role}. I'll provide an executive perspective and a clear action plan.
        </p>
        <div className="relative group">
          <Textarea 
            placeholder="I want to build a platform that..."
            className="min-h-[200px] text-lg bg-card/40 border-white/10 focus:border-accent p-6 rounded-xl resize-none shadow-inner"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <Button 
            disabled={loading || !idea.trim()} 
            onClick={handleValidate}
            className="absolute bottom-4 right-4 bg-primary hover:bg-primary/90 gap-2"
          >
            {loading ? <Zap className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Analyze Idea
          </Button>
        </div>
      </section>

      {state.validation && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <FeatureCard title="Executive Analysis" description={`${state.role}'s Direct Feedback`} icon={<ShieldAlert className="text-accent" />} className="md:col-span-2">
            <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
              {state.validation.analysis}
            </div>
          </FeatureCard>

          <FeatureCard title="Target Market" description="Who are we building for?" icon={<Users />}>
            <p className="text-sm text-muted-foreground leading-relaxed">{state.validation.targetMarket}</p>
          </FeatureCard>

          <FeatureCard title="Problem Solved" description="The pain we're addressing" icon={<Target />}>
            <p className="text-sm text-muted-foreground leading-relaxed">{state.validation.problemSolved}</p>
          </FeatureCard>

          <FeatureCard title="Feasibility" description="Technical & Market Analysis" icon={<TrendingUp />}>
            <p className="text-sm text-muted-foreground leading-relaxed">{state.validation.feasibilityEvaluation}</p>
          </FeatureCard>

          <FeatureCard title="Suggested Improvements" description="Strategic Recommendations" icon={<Zap className="text-amber-400" />}>
            <p className="text-sm text-muted-foreground leading-relaxed">{state.validation.improvementsSuggested}</p>
          </FeatureCard>

          <FeatureCard title="Differentiation" description="Our unfair advantage" icon={<ShieldCheck className="text-emerald-400" />}>
            <p className="text-sm text-muted-foreground leading-relaxed">{state.validation.uniqueDifferentiation}</p>
          </FeatureCard>

          {state.validation.recommendedTools && (
            <FeatureCard title="Acceleration Tools" description="Tools to save time" icon={<Wrench className="text-accent" />} className="md:col-span-2">
              <div className="flex flex-wrap gap-2">
                {state.validation.recommendedTools.map((tool, idx) => (
                  <Badge key={idx} variant="outline" className="border-accent/30 text-accent">{tool}</Badge>
                ))}
              </div>
            </FeatureCard>
          )}

          <div className="md:col-span-2 flex justify-center pt-8">
            <Button size="lg" onClick={onComplete} className="bg-accent text-accent-foreground font-bold px-12">
              Next: Generate Startup Blueprint
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
