'use client';

import React, { useState } from 'react';
import { useStartup } from './startup-context';
import { aiFinancialStrategyGeneration } from '@/ai/flows/ai-financial-strategy-generation';
import { Button } from '@/components/ui/button';
import { FeatureCard } from './feature-card';
import { 
  Banknote, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  ShieldCheck, 
  Sparkles, 
  Wrench, 
  Zap, 
  ArrowUpRight,
  Clock
} from 'lucide-react';
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
        description: `Strategy optimized by ${state.role}.`,
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
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-headline font-bold">Financial Strategy</h2>
          <p className="text-muted-foreground">Budgeting, unit economics, and fundraising guidance from your {state.role}.</p>
        </div>
        {!state.financialStrategy && (
          <Button size="lg" disabled={loading} onClick={handleGenerate} className="gap-2 bg-primary">
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Banknote className="w-4 h-4" />}
            Build Financial Engine
          </Button>
        )}
      </div>

      {state.financialStrategy && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard title="Strategic Insight" description={`CFO Analysis (${state.role})`} icon={<Zap className="text-accent" />} className="lg:col-span-3">
            <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
              {state.financialStrategy.strategicInsight}
            </div>
          </FeatureCard>

          <FeatureCard title="Unit Economics" description="Core growth efficiency" icon={<TrendingUp />}>
             <div className="space-y-4">
               <div className="flex justify-between items-center p-3 rounded bg-white/5">
                 <span className="text-xs">CAC</span>
                 <Badge variant="outline" className="border-accent/30 text-accent">{state.financialStrategy.unitEconomics.cac}</Badge>
               </div>
               <div className="flex justify-between items-center p-3 rounded bg-white/5">
                 <span className="text-xs">LTV</span>
                 <Badge variant="outline" className="border-accent/30 text-accent">{state.financialStrategy.unitEconomics.ltv}</Badge>
               </div>
               <div className="flex justify-between items-center p-3 rounded bg-white/5">
                 <span className="text-xs">Payback</span>
                 <Badge variant="outline" className="border-accent/30 text-accent">{state.financialStrategy.unitEconomics.paybackPeriod}</Badge>
               </div>
             </div>
          </FeatureCard>

          <FeatureCard title="Revenue Forecast" description="12-24 Month Outlook" icon={<ArrowUpRight />}>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              {state.financialStrategy.revenueForecast}
            </p>
          </FeatureCard>

          <FeatureCard title="Burn Rate & Runway" description="Survival Analysis" icon={<Clock />}>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {state.financialStrategy.burnRateAnalysis}
            </p>
          </FeatureCard>

          <div className="lg:col-span-3">
             <Card className="glass-card">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <DollarSign className="text-accent" /> Pricing Models
                 </CardTitle>
               </CardHeader>
               <CardContent className="grid md:grid-cols-2 gap-4">
                 {state.financialStrategy.pricingModels.map((p, idx) => (
                   <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/2 space-y-3">
                     <h4 className="font-bold text-accent">{p.model}</h4>
                     <p className="text-xs text-muted-foreground">{p.description}</p>
                     <div className="grid grid-cols-2 gap-2 text-[10px]">
                       <div className="text-emerald-400">Pros: {p.pros.join(', ')}</div>
                       <div className="text-rose-400">Cons: {p.cons.join(', ')}</div>
                     </div>
                   </div>
                 ))}
               </CardContent>
             </Card>
          </div>

          <FeatureCard title="Cost Estimations" description="Monthly Operating Budget" icon={<BarChart3 />} className="md:col-span-2">
             <div className="space-y-2">
               {state.financialStrategy.costEstimations.map((c, i) => (
                 <div key={i} className="flex justify-between items-center p-3 rounded bg-white/5 border border-white/5">
                   <span className="text-sm font-medium">{c.category}</span>
                   <div className="flex items-center gap-3">
                     <Badge variant="outline" className={c.priority === 'High' ? 'text-rose-400' : 'text-muted-foreground'}>{c.priority}</Badge>
                     <span className="text-accent font-bold">{c.estimatedMonthlyCost}</span>
                   </div>
                 </div>
               ))}
             </div>
          </FeatureCard>

          <FeatureCard title="Funding Plan" description="Fundraising Strategy" icon={<ShieldCheck />}>
            <ul className="space-y-2">
              {state.financialStrategy.fundingPlan.map((s, i) => (
                <li key={i} className="text-xs text-muted-foreground list-disc ml-4">{s}</li>
              ))}
            </ul>
          </FeatureCard>

          {onComplete && (
            <div className="lg:col-span-3 flex justify-center pt-8">
              <Button size="lg" onClick={onComplete} className="bg-accent text-accent-foreground font-bold px-12">
                Continue Building
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}