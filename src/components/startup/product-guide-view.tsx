'use client';

import React, { useState } from 'react';
import { useStartup } from './startup-context';
import { aiProductDevelopmentGuidance } from '@/ai/flows/ai-product-development-guidance';
import { Button } from '@/components/ui/button';
import { FeatureCard } from './feature-card';
import { Code2, Database, Cloud, Terminal, Boxes, Milestone, Layout, Sparkles, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export function ProductGuideView({ onComplete }: { onComplete: () => void }) {
  const { state, setProductGuidance } = useStartup();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!state.blueprint || !state.validation) return;
    setLoading(true);
    try {
      const result = await aiProductDevelopmentGuidance({
        startupIdea: state.rawIdea,
        problemStatement: state.blueprint.problemStatement,
        targetUsers: state.blueprint.targetUsers,
        valueProposition: state.blueprint.valueProposition,
        businessModel: state.blueprint.businessModel,
        revenueStreams: state.blueprint.revenueStreams,
        pricingStrategy: state.blueprint.pricingStrategy,
        marketSizeEstimation: state.blueprint.marketSizeEstimation,
        competitiveAdvantage: state.blueprint.competitiveAdvantage,
        competitors: state.validation.competitors,
        uniqueDifferentiation: state.validation.uniqueDifferentiation,
        currentStage: state.stage,
        role: state.role
      });
      setProductGuidance(result);
      toast({
        title: "Development Guide Created",
        description: `Architecture optimized by ${state.role}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not create guide at this time.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!state.blueprint) {
    return (
      <div className="p-12 text-center space-y-4">
        <Milestone className="w-12 h-12 text-destructive mx-auto" />
        <h3 className="text-2xl font-headline">Blueprint Required</h3>
        <p className="text-muted-foreground">You must complete your blueprint before moving to product development.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-headline font-bold">Product Development</h2>
            <Badge variant="outline" className="border-accent/30 text-accent">{state.role}</Badge>
          </div>
          <p className="text-muted-foreground">Architecting your solution with focus on speed and essential features.</p>
        </div>
        {!state.productGuidance && (
          <Button size="lg" disabled={loading} onClick={handleGenerate} className="gap-2 bg-primary">
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Code2 className="w-4 h-4" />}
            Architect MVP
          </Button>
        )}
      </div>

      {state.productGuidance && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FeatureCard title="MVP Features" description="The essential core" icon={<Boxes />}>
            <ul className="space-y-3">
              {state.productGuidance.mvpFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 text-accent text-[10px] mt-0.5">{i+1}</div>
                  {f}
                </li>
              ))}
            </ul>
          </FeatureCard>

          <FeatureCard title="Recommended Tech Stack" description={`Speed meets performance (${state.role})`} icon={<Terminal />}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold">Frontend</span>
                </div>
                <Badge variant="secondary" className="bg-primary/20">{state.productGuidance.techStack.frontend}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold">Backend</span>
                </div>
                <Badge variant="secondary" className="bg-primary/20">{state.productGuidance.techStack.backend}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold">Database</span>
                </div>
                <Badge variant="secondary" className="bg-primary/20">{state.productGuidance.techStack.database}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold">Cloud</span>
                </div>
                <Badge variant="secondary" className="bg-primary/20">{state.productGuidance.techStack.cloudProvider}</Badge>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard title="Development Roadmap" description="Phase-by-phase execution" icon={<Milestone />} className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.productGuidance.developmentRoadmap.map((r, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 relative">
                  <div className="absolute top-0 right-4 transform -translate-y-1/2 text-4xl font-headline font-bold text-white/5 italic">Phase {i+1}</div>
                  <p className="text-sm text-muted-foreground mt-2">{r}</p>
                </div>
              ))}
            </div>
          </FeatureCard>

          {state.productGuidance.accelerationTools && (
            <FeatureCard title="Acceleration Tools" description="Accelerate development & design" icon={<Wrench className="text-accent" />} className="lg:col-span-2">
              <div className="flex flex-wrap gap-2">
                {state.productGuidance.accelerationTools.map((tool, idx) => (
                  <Badge key={idx} variant="outline" className="border-accent/30 text-accent">{tool}</Badge>
                ))}
              </div>
            </FeatureCard>
          )}

          <div className="lg:col-span-2 flex justify-center pt-8">
            <Button size="lg" onClick={onComplete} className="bg-accent text-accent-foreground font-bold px-12">
              Next: Marketing Strategy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
