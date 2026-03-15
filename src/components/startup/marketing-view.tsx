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
        currentStage: state.stage
      });
      setMarketing(result);
      toast({
        title: "Growth Plan Ready",
        description: "Strategies for launch and acquisition generated.",
      });
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
    { title: "SEO Strategy", icon: <Search />, strategies: state.marketing.seoStrategy },
    { title: "Content Strategy", icon: <FileText />, strategies: state.marketing.contentStrategy },
    { title: "Viral Loops", icon: <Infinity />, strategies: state.marketing.viralLoops },
    { title: "Community Building", icon: <Heart />, strategies: state.marketing.communityBuilding },
  ] : [];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-headline font-bold">Marketing & Growth</h2>
          <p className="text-muted-foreground">How we'll find our first 1,000 users and beyond.</p>
        </div>
        {!state.marketing && (
          <Button size="lg" disabled={loading} onClick={handleGenerate} className="gap-2 bg-primary">
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            Build Growth Engine
          </Button>
        )}
      </div>

      {state.marketing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard title="Growth Insight" description="Strategic direction" icon={<Zap className="text-accent" />} className="lg:col-span-3">
            <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
              {state.marketing.growthInsight}
            </div>
          </FeatureCard>

          {marketingSections.map((sec, idx) => (
            <FeatureCard key={idx} title={sec.title} description="" icon={sec.icon}>
              <ul className="space-y-2">
                {sec.strategies.map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground list-disc ml-4">{s}</li>
                ))}
              </ul>
            </FeatureCard>
          ))}

          {state.marketing.recommendedTools && (
            <FeatureCard title="Growth & Analytics Tools" description="Automate your marketing stack" icon={<Wrench className="text-accent" />} className="lg:col-span-3">
              <div className="flex flex-wrap gap-2">
                {state.marketing.recommendedTools.map((tool, idx) => (
                  <Badge key={idx} variant="outline" className="border-accent/30 text-accent">{tool}</Badge>
                ))}
              </div>
            </FeatureCard>
          )}

          <div className="lg:col-span-3 flex justify-center pt-8">
            <Button size="lg" onClick={onComplete} className="bg-accent text-accent-foreground font-bold px-12">
              Next: Tasks & Milestones
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
