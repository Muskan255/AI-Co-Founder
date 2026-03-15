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
        title: "Accountability System Active",
        description: "Your execution roadmap and KPIs are now live.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "The co-founder is busy fighting fires. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!state.blueprint) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
        <h3 className="text-2xl font-headline font-bold">Strategy Blueprint Required</h3>
        <p className="text-muted-foreground">We can't execute in a vacuum. Build your blueprint first.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20">Founder Accountability System</Badge>
          </div>
          <h2 className="text-4xl font-headline font-bold gradient-text">Execution & Accountability</h2>
          <p className="text-muted-foreground">Stop planning, start doing. Here is your roadmap to PMF.</p>
        </div>
        {!state.tasks && (
          <Button size="lg" disabled={loading} onClick={handleGenerate} className="gap-2 bg-primary">
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Generate Execution Plan
          </Button>
        )}
      </div>

      {state.tasks && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Action Column */}
          <div className="lg:col-span-2 space-y-8">
            <FeatureCard 
              title="Critical Execution Path" 
              description="High-impact tasks for the next 30 days" 
              icon={<CheckSquare className="text-accent" />}
            >
              <div className="space-y-4 pt-4">
                {state.tasks.tasks.map((t, i) => (
                  <div key={i} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent/30 transition-colors group">
                    <Checkbox id={`task-${i}`} className="mt-1 border-white/20 data-[state=checked]:bg-accent data-[state=checked]:border-accent" />
                    <div className="space-y-1">
                      <label htmlFor={`task-${i}`} className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group-hover:text-accent transition-colors">
                        {t}
                      </label>
                      <p className="text-xs text-muted-foreground italic">Priority: Critical</p>
                    </div>
                  </div>
                ))}
              </div>
            </FeatureCard>

            <FeatureCard title="Success KPIs" description="Metrics that prove viability" icon={<BarChart className="text-accent" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {state.tasks.kpis.map((k, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-background/50 border border-white/5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="text-[10px] text-accent font-bold uppercase tracking-widest">{k.name}</div>
                      <Target className="w-4 h-4 text-accent/50" />
                    </div>
                    <div className="text-2xl font-headline font-bold text-foreground">{k.targetValue || 'TBD'}</div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{k.description}</p>
                    <Progress value={Math.random() * 40} className="h-1 bg-white/5" />
                  </div>
                ))}
              </div>
            </FeatureCard>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <FeatureCard title="Strategic Milestones" description="Major win markers" icon={<Flag className="text-accent" />}>
              <div className="space-y-8 relative ml-4 pt-6">
                <div className="absolute left-[-16px] top-0 bottom-0 w-px bg-gradient-to-b from-accent to-transparent" />
                {state.tasks.milestones.map((m, i) => (
                  <div key={i} className="relative">
                    <div className="absolute left-[-21px] top-1 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(45,190,222,0.5)]" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm flex items-center gap-2">
                        {m.name}
                        {i === 0 && <Badge className="bg-accent/20 text-accent text-[8px] h-4">Current Focus</Badge>}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
                      {m.targetDate && (
                        <div className="flex items-center gap-1 text-[10px] text-accent font-medium mt-2">
                          <Zap className="w-3 h-3" /> Due: {m.targetDate}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </FeatureCard>

            <FeatureCard title="Execution Stack" description="Speed through automation" icon={<Wrench className="text-accent" />}>
              <div className="flex flex-wrap gap-2 pt-2">
                {state.tasks.recommendedTools.map((tool, idx) => (
                  <Badge key={idx} variant="outline" className="border-accent/30 text-accent bg-accent/5 hover:bg-accent/10 transition-colors cursor-default">
                    {tool}
                  </Badge>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-4">
                Pro-tip: Don't spend more than 2 hours setting up tools. Get back to building.
              </p>
            </FeatureCard>

            <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20 flex items-center gap-4">
              <div className="p-3 rounded-full bg-accent/20 text-accent">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-headline">Road to Traction</h4>
                <p className="text-xs text-muted-foreground">Complete 3 critical tasks this week to stay on track.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
