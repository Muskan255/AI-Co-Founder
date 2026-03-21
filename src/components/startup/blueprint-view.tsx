
'use client';

import React, { useState } from 'react';
import { useStartup } from './startup-context';
import { aiStartupBlueprintGeneration } from '@/ai/flows/ai-startup-blueprint-generation';
import { Button } from '@/components/ui/button';
import { FeatureCard } from './feature-card';
import { Map, Briefcase, Coins, Rocket, Trophy, Target, PieChart, Sparkles, Wrench, AlertCircle, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export function BlueprintView({ onComplete }: { onComplete: () => void }) {
  const { state, setBlueprint } = useStartup();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!state.rawIdea) return;
    setLoading(true);
    try {
      const result = await aiStartupBlueprintGeneration({ 
        idea: state.rawIdea,
        currentStage: state.stage,
        role: state.role
      });
      setBlueprint(result);
      toast({
        title: "Blueprint Ready",
        description: `Strategy by ${state.role} complete.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not create blueprint.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!state.validation) {
    return (
      <div className="p-8 sm:p-12 text-center space-y-4">
        <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-destructive mx-auto" />
        <h3 className="text-xl sm:text-2xl font-headline">Validation Required</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">You must validate your idea before we can generate a blueprint.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-headline font-bold">Startup Blueprint</h2>
            <Badge variant="secondary" className="bg-primary/10 text-accent border-primary/20 text-[9px] sm:text-[10px]">{state.role}</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">The foundational architecture of your business.</p>
        </div>
        {!state.blueprint && (
          <Button size="lg" disabled={loading} onClick={handleGenerate} className="w-full sm:w-auto gap-2 bg-primary h-10 sm:h-11 text-xs sm:text-sm">
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4" />}
            Generate Strategy
          </Button>
        )}
      </div>

      {state.blueprint && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-10">
          <FeatureCard title="Strategic Overview" description={`${state.role}'s analysis`} icon={<ShieldAlert className="text-accent" />} className="lg:col-span-3">
             <div className="whitespace-pre-wrap text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              {state.blueprint.strategicOverview}
            </div>
          </FeatureCard>

          <FeatureCard title="Value Proposition" description="Unique offering" icon={<Rocket />}>
            <p className="text-[11px] sm:text-sm text-muted-foreground">{state.blueprint.valueProposition}</p>
          </FeatureCard>
          
          <FeatureCard title="Business Model" description="Core engine" icon={<Briefcase />}>
            <p className="text-[11px] sm:text-sm text-muted-foreground">{state.blueprint.businessModel}</p>
          </FeatureCard>

          <FeatureCard title="Revenue Streams" description="Monetization" icon={<Coins />}>
            <p className="text-[11px] sm:text-sm text-muted-foreground">{state.blueprint.revenueStreams}</p>
          </FeatureCard>

          <FeatureCard title="Competitive Advantage" description="The moat" icon={<Trophy />}>
            <p className="text-[11px] sm:text-sm text-muted-foreground">{state.blueprint.competitiveAdvantage}</p>
          </FeatureCard>

          <div className="lg:col-span-3 flex justify-center pt-4 sm:pt-8">
            <Button size="lg" onClick={onComplete} className="w-full sm:w-auto bg-accent text-accent-foreground font-bold px-12 h-12 text-sm">
              Next: Product Development Guide
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
