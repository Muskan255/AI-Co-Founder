
'use client';

import React, { useState } from 'react';
import { useStartup } from './startup-context';
import { aiTaskMilestoneManagement } from '@/ai/flows/ai-task-milestone-management';
import { Button } from '@/components/ui/button';
import { FeatureCard } from './feature-card';
import { CheckSquare, Flag, BarChart, Sparkles, AlertCircle, Wrench, Zap, Trophy, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function TaskManagerView() {
  const { state, setTasks } = useStartup();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!state.blueprint) return;
    setLoading(true);
    try {
      const blueprintString = JSON.stringify(state.blueprint);
      const result = await aiTaskMilestoneManagement({ 
        startupBlueprint: blueprintString,
        currentStage: state.stage
      });
      setTasks(result);
      toast({
        title: "Roadmap Active",
        description: "Execution plan live.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not create execution plan.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!state.blueprint) {
    return (
      <div className="p-8 sm:p-12 text-center space-y-4">
        <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-destructive mx-auto" />
        <h3 className="text-xl sm:text-2xl font-headline font-bold">Blueprint Required</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">Build your blueprint first.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 sm:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20 text-[9px] sm:text-[10px]">Accountability System</Badge>
          <h2 className="text-2xl sm:text-4xl font-headline font-bold gradient-text">Execution</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Roadmap to product-market fit.</p>
        </div>
        {!state.tasks && (
          <Button size="lg" disabled={loading} onClick={handleGenerate} className="w-full sm:w-auto gap-2 bg-primary h-10 sm:h-11 text-xs sm:text-sm">
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Generate Execution Plan
          </Button>
        )}
      </div>

      {state.tasks && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pb-10">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <FeatureCard title="Execution Path" description="Next 30 days" icon={<CheckSquare className="text-accent" />}>
              <div className="space-y-3 sm:space-y-4 pt-2">
                {state.tasks.tasks.map((t, i) => (
                  <div key={i} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent/30 transition-colors group">
                    <Checkbox id={`task-${i}`} className="mt-1" />
                    <div className="space-y-1">
                      <label htmlFor={`task-${i}`} className="text-[11px] sm:text-sm font-semibold leading-none cursor-pointer group-hover:text-accent transition-colors">
                        {t}
                      </label>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground italic">Critical Path</p>
                    </div>
                  </div>
                ))}
              </div>
            </FeatureCard>

            <FeatureCard title="Success KPIs" description="Viability metrics" icon={<BarChart className="text-accent" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                {state.tasks.kpis.map((k, i) => (
                  <div key={i} className="p-4 sm:p-5 rounded-2xl bg-background/50 border border-white/5 space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="text-[9px] text-accent font-bold uppercase tracking-widest">{k.name}</div>
                      <Target className="w-3.5 h-3.5 text-accent/50" />
                    </div>
                    <div className="text-xl sm:text-2xl font-headline font-bold text-foreground">{k.targetValue || 'TBD'}</div>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{k.description}</p>
                    <Progress value={20} className="h-1 bg-white/5" />
                  </div>
                ))}
              </div>
            </FeatureCard>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <FeatureCard title="Milestones" description="Win markers" icon={<Flag className="text-accent" />}>
              <div className="space-y-6 sm:space-y-8 relative ml-3 sm:ml-4 pt-4 sm:pt-6 border-l border-accent/20 pl-4 sm:pl-6">
                {state.tasks.milestones.map((m, i) => (
                  <div key={i} className="relative">
                    <div className="absolute left-[-21px] sm:left-[-27px] top-1 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(45,190,222,0.5)]" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs sm:text-sm">{m.name}</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FeatureCard>

            <div className="p-4 sm:p-6 rounded-2xl bg-accent/5 border border-accent/20 flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-full bg-accent/20 text-accent">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold font-headline">Road to Traction</h4>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Keep building to stay on track.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
