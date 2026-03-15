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
    { type: 'Investor Meeting', icon: <TrendingUp />, desc: 'Pitch to a skeptical Tier-1 VC.' },
    { type: 'Customer Feedback', icon: <Users />, desc: 'Hear brutal truths from target users.' },
    { type: 'Market Reaction', icon: <Sparkles />, desc: 'Simulate launch day and market buzz.' },
    { type: 'Competitor Response', icon: <ShieldAlert />, desc: 'How will the big players fight back?' },
    { type: 'Growth Projection', icon: <LineChart />, desc: 'Project long-term scalability.' },
    { type: 'Product Adoption', icon: <Filter />, desc: 'Simulate user journey and churn.' },
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

  const renderChart = (visualData: AiStartupSimulationOutput['visualData']) => {
    const { visualization_type, data, title, x_axis, y_axis } = visualData;
    
    // Get all keys except common ones to identify data series
    const keys = data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'name' && k !== 'label' && k !== x_axis) : [];
    const mainKey = keys[0] || 'value';

    const chartConfig = keys.reduce((acc, key, idx) => {
      acc[key] = {
        label: key.charAt(0).toUpperCase() + key.slice(1),
        theme: {
          light: `hsl(var(--primary))`,
          dark: `hsl(var(--accent))`
        }
      };
      return acc;
    }, {} as any);

    switch (visualization_type) {
      case 'line_chart':
        return (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <RechartsLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={x_axis || Object.keys(data[0])[0]} 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              {keys.map((key, i) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={`hsl(var(--accent))`} 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))' }}
                />
              ))}
            </RechartsLineChart>
          </ChartContainer>
        );
      case 'bar_chart':
      case 'funnel_chart': // Recharts funnel is similar to horizontal bar
        return (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <RechartsBarChart data={data} layout={visualization_type === 'funnel_chart' ? 'vertical' : 'horizontal'}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              {visualization_type === 'funnel_chart' ? (
                <>
                  <YAxis dataKey={Object.keys(data[0])[0]} type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={100} />
                  <XAxis type="number" hide />
                </>
              ) : (
                <>
                  <XAxis dataKey={Object.keys(data[0])[0]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                </>
              )}
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey={mainKey} 
                fill="hsl(var(--accent))" 
                radius={[4, 4, 0, 0]} 
                barSize={visualization_type === 'funnel_chart' ? 30 : undefined}
              />
            </RechartsBarChart>
          </ChartContainer>
        );
      case 'pie_chart':
        const COLORS = ['hsl(var(--accent))', 'hsl(var(--primary))', 'hsl(217, 91%, 60%)', 'hsl(188, 73%, 42%)'];
        return (
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey={mainKey}
                  nameKey={Object.keys(data[0])[0]}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">Visualizing data...</div>;
    }
  };

  const getVisualIcon = (type: string) => {
    switch (type) {
      case 'line_chart': return <LineChart className="w-4 h-4" />;
      case 'bar_chart': return <BarChart3 className="w-4 h-4" />;
      case 'pie_chart': return <PieChartIcon className="w-4 h-4" />;
      case 'funnel_chart': return <Filter className="w-4 h-4" />;
      case 'matrix_chart': return <LayoutGrid className="w-4 h-4" />;
      case 'timeline_chart': return <CalendarDays className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20">Data-Driven Simulation Engine</Badge>
        </div>
        <h2 className="text-4xl font-headline font-bold gradient-text">Simulation Mode</h2>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Pressure-test your venture with AI-generated visual projections. Choose a scenario to see the brutal truth in data.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {simulationTypes.map((item) => (
          <Card 
            key={item.type}
            className={cn(
              "glass-card hover:border-accent/50 transition-all cursor-pointer group",
              loading && "opacity-50 pointer-events-none"
            )}
            onClick={() => handleStartSimulation(item.type)}
          >
            <CardHeader className="p-4">
              <div className="p-2 w-fit rounded-lg bg-primary/10 text-accent group-hover:scale-110 transition-transform mb-2">
                {item.icon}
              </div>
              <CardTitle className="text-sm font-bold">{item.type}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-[10px] text-muted-foreground mb-4 leading-tight">{item.desc}</p>
              <Button variant="ghost" size="sm" className="w-full text-accent p-0 justify-start hover:bg-transparent h-fit text-xs">
                Run <PlayCircle className="ml-1 w-3 h-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-20 space-y-4 glass-card rounded-2xl">
          <Sparkles className="w-12 h-12 text-accent animate-spin" />
          <h3 className="text-2xl font-headline font-bold">Processing Scenarios...</h3>
          <p className="text-muted-foreground">Generating data-driven projections and stakeholder feedback.</p>
        </div>
      )}

      {sim && !loading && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="grid lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-8">
               {/* Strategic Visualization */}
              <Card className="glass-card border-accent/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getVisualIcon(sim.visualData.visualization_type)}
                        {sim.visualData.title}
                      </CardTitle>
                      <CardDescription>Strategic projection based on simulation outcomes.</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-accent/10 text-accent">AI Projection</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderChart(sim.visualData)}
                  <div className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/10">
                    <h4 className="text-xs font-bold text-accent uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Lightbulb className="w-3 h-3" /> Data Insight
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      This {sim.visualData.visualization_type.replace('_', ' ')} illustrates the potential {sim.visualData.title.toLowerCase()} trends. 
                      Notice how the {sim.visualData.y_axis || 'outcome'} correlates with our strategic assumptions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <section className="glass-card p-8 rounded-2xl border-white/5 bg-white/2">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-full bg-accent/20 text-accent">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-headline font-bold">The Scripted Reality</h3>
                    <p className="text-muted-foreground">{sim.scenarioDescription}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {sim.simulationDialog.map((msg, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-background/40 border border-white/5 group hover:border-accent/20 transition-colors">
                      <Badge variant="outline" className="h-fit py-1 shrink-0 border-accent/30 text-accent">{msg.role}</Badge>
                      <p className="text-sm leading-relaxed italic">"{msg.message}"</p>
                    </div>
                  ))}
                </div>
              </section>
            </section>

            <aside className="space-y-8">
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

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Wrench className="w-4 h-4 text-accent" /> Recommended Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {sim.recommendedTools.map((tool, idx) => (
                      <Badge key={idx} variant="outline" className="border-accent/30 text-accent text-[10px]">{tool}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
