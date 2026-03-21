
'use client';

import React, { useState } from 'react';
import { useStartup } from './startup-context';
import { aiFinancialStrategyGeneration } from '@/ai/flows/ai-financial-strategy-generation';
import { Button } from '@/components/ui/button';
import { FeatureCard } from './feature-card';
import { Banknote, TrendingUp, DollarSign, BarChart3, PieChart, ShieldCheck, Sparkles, Wrench, Zap, ArrowUpRight, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function FinancialView({ onComplete }: { onComplete?: () => void }) {
  const { state, setFinancialStrategy } = useStartup();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!state.rawIdea) return;
    setLoading(true);
    try {
      const result = await aiFinancialStrategyGeneration({ 
        startupIdea: state.rawIdea,
        currentStage: state.stage,
        role: state.role
      });
      setFinancialStrategy(result);
      toast({
        title: "Financial Plan Ready",
        description: `Optimized by ${state.role}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not create financial plan.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-headline font-bold">Financial Strategy</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Budgeting and guidance from your {state.role}.</p>
        </div>
        {!state.financialStrategy && (
          <Button size="lg" disabled={loading} onClick={handleGenerate} className="w-full sm:w-auto gap-2 bg-primary h-10 sm:h-11 text-xs sm:text-sm">
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Banknote className="w-4 h-4" />}
            Build Financial Engine
          </Button>
        )}
      </div>

      {state.financialStrategy && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-10">
          <FeatureCard title="Strategic Insight" description={`CFO Analysis`} icon={<Zap className="text-accent" />} className="lg:col-span-3">
            <div className="whitespace-pre-wrap text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              {state.financialStrategy.strategicInsight}
            </div>
          </FeatureCard>

          <FeatureCard title="Unit Economics" description="Efficiency" icon={<TrendingUp />}>
             <div className="space-y-2 sm:space-y-3">
               {[
                 { label: 'CAC', val: state.financialStrategy.unitEconomics.cac },
                 { label: 'LTV', val: state.financialStrategy.unitEconomics.ltv },
                 { label: 'Payback', val: state.financialStrategy.unitEconomics.paybackPeriod },
               ].map((item, idx) => (
                 <div key={idx} className="flex justify-between items-center p-2 sm:p-3 rounded bg-white/5 border border-white/5">
                   <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">{item.label}</span>
                   <Badge variant="outline" className="border-accent/30 text-accent text-[9px] sm:text-[10px]">{item.val}</Badge>
                 </div>
               ))}
             </div>
          </FeatureCard>

          <FeatureCard title="Forecast" description="12-24 Month Outlook" icon={<ArrowUpRight />}>
            <p className="text-[11px] sm:text-sm text-muted-foreground italic leading-relaxed">
              {state.financialStrategy.revenueForecast}
            </p>
          </FeatureCard>

          <FeatureCard title="Survival" description="Burn & Runway" icon={<Clock />}>
            <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              {state.financialStrategy.burnRateAnalysis}
            </p>
          </FeatureCard>

          {onComplete && (
            <div className="lg:col-span-3 flex justify-center pt-4 sm:pt-8">
              <Button size="lg" onClick={onComplete} className="w-full sm:w-auto bg-accent text-accent-foreground font-bold px-12 h-12 text-sm">
                Continue Building
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
