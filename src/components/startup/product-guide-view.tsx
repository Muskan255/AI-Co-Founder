
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not create guide.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!state.blueprint) {
    return (
      <div className="p-8 sm:p-12 text-center space-y-4">
        <Milestone className="w-10 h-10 sm:w-12 sm:h-12 text-destructive mx-auto" />
        <h3 className="text-xl sm:text-2xl font-headline">Blueprint Required</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">Complete your blueprint before moving to product development.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-headline font-bold">Product Development</h2>
            <Badge variant="outline" className="border-accent/30 text-accent text-[9px] sm:text-[10px]">{state.role}</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Architecting your solution for speed.</p>
        </div>
        {!state.productGuidance && (
          <Button size="lg" disabled={loading} onClick={handleGenerate} className="w-full sm:w-auto gap-2 bg-primary h-10 sm:h-11 text-xs sm:text-sm">
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Code2 className="w-4 h-4" />}
            Architect MVP
          </Button>
        )}
      </div>

      {state.productGuidance && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pb-10">
          <FeatureCard title="MVP Features" description="The core essence" icon={<Boxes />}>
            <ul className="space-y-2 sm:space-y-3">
              {state.productGuidance.mvpFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] sm:text-sm text-muted-foreground">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 text-accent text-[8px] sm:text-[10px] mt-0.5">{i+1}</div>
                  {f}
                </li>
              ))}
            </ul>
          </FeatureCard>

          <FeatureCard title="Tech Stack" description={`Speed meets performance`} icon={<Terminal />}>
            <div className="space-y-2 sm:space-y-4">
              {[
                { label: 'Frontend', val: state.productGuidance.techStack.frontend, icon: <Layout className="w-3 h-3 sm:w-4 sm:h-4 text-accent" /> },
                { label: 'Backend', val: state.productGuidance.techStack.backend, icon: <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-accent" /> },
                { label: 'Database', val: state.productGuidance.techStack.database, icon: <Database className="w-3 h-3 sm:w-4 sm:h-4 text-accent" /> },
              ].map((stack, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 sm:p-3 rounded bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2">
                    {stack.icon}
                    <span className="text-[10px] sm:text-xs font-semibold">{stack.label}</span>
                  </div>
                  <Badge variant="secondary" className="bg-primary/20 text-[9px] sm:text-[10px]">{stack.val}</Badge>
                </div>
              ))}
            </div>
          </FeatureCard>

          <FeatureCard title="Roadmap" description="Execution phases" icon={<Milestone />} className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {state.productGuidance.developmentRoadmap.map((r, i) => (
                <div key={i} className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5 relative">
                  <div className="absolute top-0 right-4 transform -translate-y-1/2 text-2xl sm:text-4xl font-headline font-bold text-white/5 italic">P{i+1}</div>
                  <p className="text-[11px] sm:text-sm text-muted-foreground mt-1 sm:mt-2">{r}</p>
                </div>
              ))}
            </div>
          </FeatureCard>

          <div className="lg:col-span-2 flex justify-center pt-4 sm:pt-8">
            <Button size="lg" onClick={onComplete} className="w-full sm:w-auto bg-accent text-accent-foreground font-bold px-12 h-12 text-sm">
              Next: Marketing Strategy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
