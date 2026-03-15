'use client';

import React, { useState } from 'react';
import { useStartup } from './startup-context';
import { aiStartupSimulation, type AiStartupSimulationInput } from '@/ai/flows/ai-startup-simulation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  MessageSquare, 
  Sparkles, 
  PlayCircle,
  AlertTriangle,
  Lightbulb,
  Wrench,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function SimulationView() {
  const { state, setSimulation } = useStartup();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const simulationTypes: Array<{ type: AiStartupSimulationInput['simulationType'], icon: React.ReactNode, desc: string }> = [
    { type: 'Investor Meeting', icon: <TrendingUp />, desc: 'Pitch to a skeptical Tier-1 VC.' },
    { type: 'Customer Feedback', icon: <Users />, desc: 'Hear brutal truths from target users.' },
    { type: 'Market Reaction', icon: <Sparkles />, desc: 'Simulate launch day and market buzz.' },
    { type: 'Competitor Response', icon: <ShieldAlert />, desc: 'How will the big players fight back?' },
  ];

  const handleStartSimulation = async (type: AiStartupSimulationInput['simulationType']) => {
    if (!state.rawIdea) {
      toast({
        variant: "destructive",
        title: "Simulation Impossible",
        description: "You need an idea first!",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await aiStartupSimulation({
        startupIdea: state.rawIdea,
        currentStage: state.stage,
        simulationType: type,
        blueprint: state.blueprint ? JSON.stringify(state.blueprint) : undefined
      });
      setSimulation(result);
      toast({
        title: "Simulation Complete",
        description: `Scenario: ${type} resolved.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Simulation Failed",
        description: "The market is too volatile right now. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const sim = state.lastSimulation;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20">Powerful Simulation Engine</Badge>
        </div>
        <h2 className="text-4xl font-headline font-bold gradient-text">Simulation Mode</h2>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Pressure-test your venture. Choose a scenario to see how your idea survives real-world forces.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {simulationTypes.map((item) => (
          <Card 
            key={item.type}
            className={cn(
              "glass-card hover:border-accent/50 transition-all cursor-pointer group",
              loading && "opacity-50 pointer-events-none"
            )}
            onClick={() => handleStartSimulation(item.type)}
          >
            <CardHeader>
              <div className="p-3 w-fit rounded-lg bg-primary/10 text-accent group-hover:scale-110 transition-transform mb-2">
                {item.icon}
              </div>
              <CardTitle className="text-lg">{item.type}</CardTitle>
              <CardDescription>{item.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full text-accent p-0 justify-start hover:bg-transparent">
                Run Simulation <PlayCircle className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-20 space-y-4 glass-card rounded-2xl">
          <Sparkles className="w-12 h-12 text-accent animate-spin" />
          <h3 className="text-2xl font-headline font-bold">Simulating Reality...</h3>
          <p className="text-muted-foreground">Gathering data, market trends, and stakeholder personas.</p>
        </div>
      )}

      {sim && !loading && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <section className="glass-card p-8 rounded-2xl border-accent/20 bg-accent/5">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-full bg-accent/20 text-accent">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-headline font-bold">The Scenario</h3>
                <p className="text-muted-foreground">{sim.scenarioDescription}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {sim.simulationDialog.map((msg, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-background/40 border border-white/5">
                  <Badge variant="secondary" className="h-fit py-1">{msg.role}</Badge>
                  <p className="text-sm leading-relaxed italic">"{msg.message}"</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" /> Ruthless Truth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-destructive-foreground/90 font-medium">
                  {sim.criticalFeedback}
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-400">
                  <Lightbulb className="w-5 h-5" /> Strategic Pivot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-emerald-100/90">
                  {sim.strategicAdvice}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-accent" /> Recommended Mitigation Tools
              </CardTitle>
              <CardDescription>Tools to help you address the risks identified above.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {sim.recommendedTools.map((tool, idx) => (
                  <Badge key={idx} variant="outline" className="border-accent/30 text-accent">{tool}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
