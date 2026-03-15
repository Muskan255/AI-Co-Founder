"use client"

import React, { useState } from 'react';
import { useStartup } from './startup-context';
import { aiTaskMilestoneManagement } from '@/ai/flows/ai-task-milestone-management';
import { Button } from '@/components/ui/button';
import { FeatureCard } from './feature-card';
import { CheckSquare, Flag, BarChart, Sparkles, AlertCircle, Circle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

export function TaskManagerView() {
  const { state, setTasks } = useStartup();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!state.blueprint) return;
    setLoading(true);
    try {
      // Serialize blueprint for input
      const blueprintString = JSON.stringify(state.blueprint);
      const result = await aiTaskMilestoneManagement({ startupBlueprint: blueprintString });
      setTasks(result);
      toast({
        title: "Action Plan Created",
        description: "Actionable tasks and milestones are ready.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not create tasks.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!state.blueprint) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
        <h3 className="text-2xl font-headline">Strategy Blueprint Required</h3>
        <p className="text-muted-foreground">We need a strategy before we can list out tasks.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-headline font-bold">Tasks & Roadmaps</h2>
          <p className="text-muted-foreground">Breaking the vision down into execution steps.</p>
        </div>
        {!state.tasks && (
          <Button size="lg" disabled={loading} onClick={handleGenerate} className="gap-2 bg-primary">
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
            Generate Roadmap
          </Button>
        )}
      </div>

      {state.tasks && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FeatureCard title="Critical Tasks" description="Next 30-day focus" icon={<CheckSquare />}>
            <div className="space-y-4">
              {state.tasks.tasks.map((t, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/5">
                  <Checkbox id={`task-${i}`} />
                  <label htmlFor={`task-${i}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t}
                  </label>
                </div>
              ))}
            </div>
          </FeatureCard>

          <div className="space-y-8">
            <FeatureCard title="Key Milestones" description="Major goal markers" icon={<Flag />}>
              <div className="space-y-6 relative ml-4">
                <div className="absolute left-[-16px] top-4 bottom-4 w-px bg-white/10" />
                {state.tasks.milestones.map((m, i) => (
                  <div key={i} className="relative">
                    <div className="absolute left-[-21px] top-1 w-2.5 h-2.5 rounded-full bg-accent" />
                    <h4 className="font-bold text-sm">{m.name}</h4>
                    <p className="text-xs text-muted-foreground">{m.description}</p>
                    {m.targetDate && <span className="text-[10px] text-accent mt-1 block">Due: {m.targetDate}</span>}
                  </div>
                ))}
              </div>
            </FeatureCard>

            <FeatureCard title="Success KPIs" description="Metrics that matter" icon={<BarChart />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {state.tasks.kpis.map((k, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-accent font-bold uppercase tracking-wider mb-1">{k.name}</div>
                    <div className="text-sm font-semibold">{k.targetValue || 'Tracking'}</div>
                    <p className="text-[10px] text-muted-foreground mt-1">{k.description}</p>
                  </div>
                ))}
              </div>
            </FeatureCard>
          </div>
        </div>
      )}
    </div>
  );
}
