
'use client';

import React, { useState } from 'react';
import { useStartup } from './startup-context';
import { aiStartupSimulation, type AiStartupSimulationInput, type AiStartupSimulationOutput } from '@/ai/flows/ai-startup-simulation';
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
  BarChart3,
  LineChart,
  PieChart as PieChartIcon,
  Filter,
  LayoutGrid,
  CalendarDays
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  Line, 
  LineChart as RechartsLineChart, 
  Bar, 
  BarChart as RechartsBarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

export function SimulationView() {
  const { state, setSimulation } = useStartup();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const simulationTypes: Array<{ type: AiStartupSimulationInput['simulationType'], icon: React.ReactNode, desc: string }> = [
    { type: 'Investor Meeting', icon: <TrendingUp className="w-4 h-4" />, desc: 'Pitch to a Tier-1 VC.' },
    { type: 'Customer Feedback', icon: <Users className="w-4 h-4" />, desc: 'Hear brutal user truths.' },
    { type: 'Market Reaction', icon: <Sparkles className="w-4 h-4" />, desc: 'Simulate launch day.' },
    { type: 'Growth Projection', icon: <LineChart className="w-4 h-4" />, desc: 'Project scalability.' },
  ];

  const handleStartSimulation = async (type: AiStartupSimulationInput['simulationType']) => {
    if (!state.rawIdea) {
      toast({ variant: "destructive", title: "Idea Required", description: "You need an idea first!" });
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
      toast({ title: "Simulation Complete", description: `${type} resolved.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Simulation Failed", description: "The market is too volatile." });
    } finally {
      setLoading(false);
    }
  };

  const sim = state.lastSimulation;

  const renderChart = (visualData: AiStartupSimulationOutput['visualData']) => {
    const { visualization_type, data, x_axis } = visualData;
    const keys = data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'name' && k !== 'label' && k !== x_axis) : [];
    const mainKey = keys[0] || 'value';

    const chartConfig = keys.reduce((acc, key) => {
      acc[key] = { label: key.charAt(0).toUpperCase() + key.slice(1), theme: { light: `hsl(var(--primary))`, dark: `hsl(var(--accent))` } };
      return acc;
    }, {} as any);

    return (
      <ChartContainer config={chartConfig} className="h-[200px] sm:h-[300px] w-full">
        {visualization_type === 'line_chart' ? (
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey={x_axis || Object.keys(data[0])[0]} stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey={mainKey} stroke={`hsl(var(--accent))`} strokeWidth={2} dot={{ fill: 'hsl(var(--accent))' }} />
          </RechartsLineChart>
        ) : (
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey={Object.keys(data[0])[0]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey={mainKey} fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        )}
      </ChartContainer>
    );
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 sm:space-y-10">
      <header className="space-y-3">
        <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20 text-[9px] sm:text-[10px]">Simulation Engine</Badge>
        <h2 className="text-3xl sm:text-4xl font-headline font-bold gradient-text">Simulation Mode</h2>
        <p className="text-xs sm:text-lg text-muted-foreground max-w-2xl">
          Pressure-test your venture with AI-generated visual projections.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {simulationTypes.map((item) => (
          <Card 
            key={item.type}
            className={cn("glass-card hover:border-accent/50 transition-all cursor-pointer group", loading && "opacity-50 pointer-events-none")}
            onClick={() => handleStartSimulation(item.type)}
          >
            <CardHeader className="p-3 sm:p-4">
              <div className="p-1.5 w-fit rounded-lg bg-primary/10 text-accent group-hover:scale-110 transition-transform mb-1 sm:mb-2">
                {item.icon}
              </div>
              <CardTitle className="text-[11px] sm:text-sm font-bold">{item.type}</CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
              <p className="text-[9px] text-muted-foreground mb-3 leading-tight line-clamp-2">{item.desc}</p>
              <Button variant="ghost" size="sm" className="w-full text-accent p-0 justify-start hover:bg-transparent h-fit text-[10px]">
                Run <PlayCircle className="ml-1 w-2.5 h-2.5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 sm:p-20 space-y-4 glass-card rounded-2xl">
          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-accent animate-spin" />
          <h3 className="text-lg sm:text-2xl font-headline font-bold">Simulating...</h3>
        </div>
      )}

      {sim && !loading && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <section className="lg:col-span-2 space-y-6 sm:space-y-8">
              <Card className="glass-card border-accent/20">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base sm:text-xl flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-accent" /> {sim.visualData.title}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-accent/10 text-accent text-[8px] sm:text-[9px]">AI Projection</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  {renderChart(sim.visualData)}
                </CardContent>
              </Card>

              <section className="glass-card p-5 sm:p-8 rounded-2xl border-white/5 bg-white/2">
                <div className="flex items-start gap-3 sm:gap-4 mb-6">
                  <div className="p-2 sm:p-3 rounded-full bg-accent/20 text-accent shrink-0">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-headline font-bold">The Reality Script</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{sim.scenarioDescription}</p>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {sim.simulationDialog.map((msg, i) => (
                    <div key={i} className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-background/40 border border-white/5 group">
                      <Badge variant="outline" className="h-fit py-0.5 sm:py-1 shrink-0 border-accent/30 text-accent text-[8px] sm:text-[10px]">{msg.role}</Badge>
                      <p className="text-[11px] sm:text-sm leading-relaxed italic">"{msg.message}"</p>
                    </div>
                  ))}
                </div>
              </section>
            </section>

            <aside className="space-y-6 sm:space-y-8">
              <Card className="border-destructive/30 bg-destructive/5">
                <CardHeader className="p-4 sm:p-6 pb-2">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-4 h-4" /> Ruthless Truth
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <p className="text-[11px] sm:text-sm leading-relaxed text-destructive-foreground/90 font-medium">{sim.criticalFeedback}</p>
                </CardContent>
              </Card>

              <Card className="border-emerald-500/30 bg-emerald-500/5">
                <CardHeader className="p-4 sm:p-6 pb-2">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-emerald-400">
                    <Lightbulb className="w-4 h-4" /> Strategic Pivot
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <p className="text-[11px] sm:text-sm leading-relaxed text-emerald-100/90">{sim.strategicAdvice}</p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
