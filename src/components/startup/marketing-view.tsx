
'use client';

import React, { useState } from 'react';
import { useStartup } from './startup-context';
import { aiMarketingStrategyGeneration } from '@/ai/flows/ai-marketing-strategy-generation';
import { Button } from '@/components/ui/button';
import { FeatureCard } from './feature-card';
import { Rocket, Share2, Users, Search, FileText, Infinity, Heart, Sparkles, Wrench, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export function MarketingView({ onComplete }: { onComplete: () => void }) {
  const { state, setMarketing } = useStartup();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!state.rawIdea) return;
    setLoading(true);
    try {
      const result = await aiMarketingStrategyGeneration({ 
        productDescription: state.rawIdea,
        currentStage: state.stage,
        role: state.role
      });
      setMarketing(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not create marketing plan.",
      });
    } finally {
      setLoading(false);
    }
  };

  const marketingSections = state.marketing ? [
    { title: "Product Launch", icon: <Rocket />, strategies: state.marketing.productLaunch },
    { title: "Social Media", icon: <Share2 />, strategies: state.marketing.socialMediaGrowth },
    { title: "User Acquisition", icon: <Users />, strategies: state.marketing.userAcquisition },
    { title: "Viral Loops", icon: <Infinity />, strategies: state.marketing.viralLoops },
  ] : [];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-headline font-bold">Marketing & Growth</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Strategic planning from your {state.role}.</p>
        </div>
        {!state.marketing && (
          <Button size="lg" disabled={loading} onClick={handleGenerate} className="w-full sm:w-auto gap-2 bg-primary h-10 sm:h-11 text-xs sm:text-sm">
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            Build Growth Engine
          </Button>
        )}
      </div>

      {state.marketing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-10">
          <FeatureCard title="Growth Insight" description={`Strategic direction`} icon={<Zap className="text-accent" />} className="lg:col-span-3">
            <div className="whitespace-pre-wrap text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              {state.marketing.growthInsight}
            </div>
          </FeatureCard>

          {marketingSections.map((sec, idx) => (
            <FeatureCard key={idx} title={sec.title} description="" icon={sec.icon}>
              <ul className="space-y-1.5 sm:space-y-2">
                {sec.strategies.map((s, i) => (
                  <li key={i} className="text-[11px] sm:text-xs text-muted-foreground list-disc ml-4">{s}</li>
                ))}
              </ul>
            </FeatureCard>
          ))}

          <div className="lg:col-span-3 flex justify-center pt-4 sm:pt-8">
            <Button size="lg" onClick={onComplete} className="w-full sm:w-auto bg-accent text-accent-foreground font-bold px-12 h-12 text-sm">
              Next: Tasks & Milestones
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
