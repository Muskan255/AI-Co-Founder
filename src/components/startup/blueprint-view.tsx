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
        description: `Strategic roadmap by ${state.role} complete.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not create blueprint at this time.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!state.validation) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
        <h3 className="text-2xl font-headline">Idea Validation Required</h3>
        <p className="text-muted-foreground">You must validate your idea before we can generate a blueprint.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-headline font-bold">Startup Blueprint</h2>
            <Badge variant="secondary" className="bg-primary/10 text-accent border-primary/20">{state.role}</Badge>
          </div>
          <p className="text-muted-foreground">The foundational architecture of your business, adapted for speed.</p>
        </div>
        {!state.blueprint && (
          <Button size="lg" disabled={loading} onClick={handleGenerate} className="gap-2 bg-primary">
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4" />}
            Generate Strategy
          </Button>
        )}
      </div>

      {state.blueprint && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard title="Strategic Overview" description={`${state.role}'s breakdown`} icon={<ShieldAlert className="text-accent" />} className="lg:col-span-3">
             <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
              {state.blueprint.strategicOverview}
            </div>
          </FeatureCard>

          <FeatureCard title="Value Proposition" description="What makes us special" icon={<Rocket />}>
            <p className="text-sm text-muted-foreground">{state.blueprint.valueProposition}</p>
          </FeatureCard>
          
          <FeatureCard title="Business Model" description="Our core engine" icon={<Briefcase />}>
            <p className="text-sm text-muted-foreground">{state.blueprint.businessModel}</p>
          </FeatureCard>

          <FeatureCard title="Revenue Streams" description="How we make money" icon={<Coins />}>
            <p className="text-sm text-muted-foreground">{state.blueprint.revenueStreams}</p>
          </FeatureCard>

          <FeatureCard title="Pricing Strategy" description="Market positioning" icon={<Target />}>
            <p className="text-sm text-muted-foreground">{state.blueprint.pricingStrategy}</p>
          </FeatureCard>

          <FeatureCard title="Market Size" description="The opportunity" icon={<PieChart />}>
            <p className="text-sm text-muted-foreground">{state.blueprint.marketSizeEstimation}</p>
          </FeatureCard>

          <FeatureCard title="Competitive Advantage" description="Our moat" icon={<Trophy />}>
            <p className="text-sm text-muted-foreground">{state.blueprint.competitiveAdvantage}</p>
          </FeatureCard>

          {state.blueprint.recommendedTools && (
            <FeatureCard title="Operational Tools" description="Streamlining your setup" icon={<Wrench className="text-accent" />} className="lg:col-span-3">
              <div className="flex flex-wrap gap-2">
                {state.blueprint.recommendedTools.map((tool, idx) => (
                  <Badge key={idx} variant="outline" className="border-accent/30 text-accent">{tool}</Badge>
                ))}
              </div>
            </FeatureCard>
          )}

          <div className="lg:col-span-3 flex justify-center pt-8">
            <Button size="lg" onClick={onComplete} className="bg-accent text-accent-foreground font-bold px-12">
              Next: Product Development Guide
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
