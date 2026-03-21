
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
      if (!state.projectId) {
        const newId = crypto.randomUUID();
        setProjectId(newId);
        const potentialName = idea.trim().split(' ').slice(0, 3).join(' ') + '...';
        setProjectName(potentialName);
      }

      const result = await aiIdeaValidation({ 
        startupIdea: idea,
        currentStage: state.stage,
        role: state.role
      });
      
      if (!result) throw new Error("AI returned an empty analysis.");

      setRawIdea(idea);
      setValidation(result);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Could not process idea.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8">
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <h2 className="text-2xl sm:text-3xl font-headline font-bold">Validate Your Idea</h2>
          <Badge variant="secondary" className="w-fit bg-accent/10 text-accent border-accent/20 text-[10px]">{state.role} Mode</Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Pitch your idea to your {state.role}. I'll provide an executive perspective and a clear action plan.
        </p>
        <div className="relative group">
          <Textarea 
            placeholder="I want to build a platform that..."
            className="min-h-[150px] sm:min-h-[200px] text-sm sm:text-lg bg-card/40 border-white/10 focus:border-accent p-4 sm:p-6 rounded-xl resize-none shadow-inner"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <Button 
            disabled={loading || !idea.trim()} 
            onClick={handleValidate}
            className="mt-4 sm:mt-0 sm:absolute sm:bottom-4 sm:right-4 w-full sm:w-auto bg-primary hover:bg-primary/90 gap-2 h-10 sm:h-11"
          >
            {loading ? <Zap className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Analyze Idea
          </Button>
        </div>
      </section>

      {state.validation && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
          <FeatureCard title="Executive Analysis" description={`${state.role}'s Feedback`} icon={<ShieldAlert className="text-accent" />} className="md:col-span-2">
            <div className="whitespace-pre-wrap text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              {state.validation.analysis}
            </div>
          </FeatureCard>

          <FeatureCard title="Target Market" description="Audience segments" icon={<Users />}>
            <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed">{state.validation.targetMarket}</p>
          </FeatureCard>

          <FeatureCard title="Problem Solved" description="The core pain" icon={<Target />}>
            <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed">{state.validation.problemSolved}</p>
          </FeatureCard>

          <FeatureCard title="Feasibility" description="Tech & Market" icon={<TrendingUp />}>
            <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed">{state.validation.feasibilityEvaluation}</p>
          </FeatureCard>

          <FeatureCard title="Suggested Improvements" description="Strategic advice" icon={<Zap className="text-amber-400" />}>
            <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed">{state.validation.improvementsSuggested}</p>
          </FeatureCard>

          <div className="md:col-span-2 flex justify-center pt-4 sm:pt-8">
            <Button size="lg" onClick={onComplete} className="w-full sm:w-auto bg-accent text-accent-foreground font-bold px-12 h-12 text-sm">
              Next: Generate Startup Blueprint
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
