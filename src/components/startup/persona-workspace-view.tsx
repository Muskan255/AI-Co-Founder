"use client"

import React, { useState, useMemo } from 'react';
import { useStartup, StartupRole } from './startup-context';
import { aiExecutiveAction, type ExecutiveActionOutput } from '@/ai/flows/ai-executive-action';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Cpu, Megaphone, Banknote, Box, FastForward, 
  Terminal, Database, Layout, Sparkles, Send, 
  Target, TrendingUp, Users, Share2, FileText,
  Boxes, Milestone, PieChart, Coins, ShieldCheck,
  Zap, ArrowRight, Code2, Copy, Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export function PersonaWorkspaceView() {
  const { state } = useStartup();
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExecutiveActionOutput | null>(null);
  const { toast } = useToast();

  const roleTools = useMemo((): Tool[] => {
    switch (state.role) {
      case 'AI CTO':
        return [
          { id: 'generate-code', name: 'Generate MVP Code', description: 'Describe a feature and get code.', icon: <Terminal /> },
          { id: 'db-schema', name: 'Design DB Schema', description: 'Architect your data structure.', icon: <Database /> },
          { id: 'system-arch', name: 'System Architecture', description: 'Design scalable backends.', icon: <Cpu /> },
          { id: 'api-spec', name: 'API Specification', description: 'Define endpoints and contracts.', icon: <Code2 /> },
        ];
      case 'AI CMO':
        return [
          { id: 'marketing-plan', name: 'Marketing Plan', description: 'Strategy for launch & growth.', icon: <Target /> },
          { id: 'social-content', name: 'Social Content', description: 'Copy for Twitter, LinkedIn, etc.', icon: <Share2 /> },
          { id: 'launch-campaign', name: 'Launch Campaign', description: 'Plan your Product Hunt day.', icon: <Rocket /> },
          { id: 'brand-position', name: 'Brand Positioning', description: 'Define your unique voice.', icon: <Users /> },
        ];
      case 'AI CFO':
        return [
          { id: 'revenue-model', name: 'Revenue Model', description: 'How the startup makes money.', icon: <Coins /> },
          { id: 'burn-rate', name: 'Burn Rate Calc', description: 'Calculate runway and costs.', icon: <TrendingUp /> },
          { id: 'fundraising', name: 'Fundraising Plan', description: 'Steps for Seed or Series A.', icon: <Banknote /> },
          { id: 'pricing', name: 'Pricing Strategy', description: 'Optimized pricing tiers.', icon: <PieChart /> },
        ];
      case 'AI Product Manager':
        return [
          { id: 'mvp-features', name: 'MVP Features', description: 'What to build (and what not to).', icon: <Boxes /> },
          { id: 'roadmap', name: 'Product Roadmap', description: 'The journey to version 1.0.', icon: <Milestone /> },
          { id: 'user-flow', name: 'User Journey', description: 'Design the ideal UX flow.', icon: <Layout /> },
          { id: 'prioritization', name: 'Prioritize Backlog', description: 'Focus on high-impact work.', icon: <Zap /> },
        ];
      case 'AI Growth Hacker':
        return [
          { id: 'growth-loops', name: 'Growth Loops', description: 'Design viral mechanics.', icon: <Sparkles /> },
          { id: 'referral-system', name: 'Referral System', description: 'Turn users into advocates.', icon: <Users /> },
          { id: 'acquisition', name: 'User Acquisition', description: 'Aggressive growth experiments.', icon: <FastForward /> },
          { id: 'conversion', name: 'Conversion Audit', description: 'Fix leaks in your signup funnel.', icon: <Zap /> },
        ];
      default:
        return [];
    }
  }, [state.role]);

  const handleRunTask = async () => {
    if (!activeTool || !state.rawIdea) return;
    setLoading(true);
    try {
      const toolName = roleTools.find(t => t.id === activeTool)?.name || activeTool;
      const response = await aiExecutiveAction({
        role: state.role,
        taskType: toolName,
        startupIdea: state.rawIdea,
        stage: state.stage,
        userPrompt
      });
      setResult(response);
      toast({ title: "Task Complete", description: `The ${state.role} has delivered the asset.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Task Failed", description: "The executive is tied up. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.content);
    toast({ title: "Copied", description: "Asset copied to clipboard." });
  };

  const getRoleTheme = () => {
    switch (state.role) {
      case 'AI CTO': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'AI CMO': return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
      case 'AI CFO': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'AI Product Manager': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'AI Growth Hacker': return 'text-accent bg-accent/10 border-accent/20';
      default: return 'text-accent bg-accent/10 border-accent/20';
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={cn("px-3 py-1 font-bold uppercase tracking-widest", getRoleTheme())}>
              {state.role} OFFICE
            </Badge>
            <Badge variant="secondary" className="bg-white/5 border-white/10">{state.stage}</Badge>
          </div>
          <h2 className="text-5xl font-headline font-bold gradient-text leading-tight">
            {state.role}&apos;s Studio
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Execute high-impact tasks directly with your active executive.
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Tool Sidebar */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Available Tools</h3>
          {roleTools.map((tool) => (
            <Card 
              key={tool.id} 
              onClick={() => { setActiveTool(tool.id); setResult(null); }}
              className={cn(
                "cursor-pointer transition-all hover:border-accent/50",
                activeTool === tool.id ? "border-accent bg-accent/5" : "glass-card"
              )}
            >
              <CardHeader className="p-4 flex flex-row items-center gap-4 space-y-0">
                <div className={cn("p-2 rounded-lg", activeTool === tool.id ? "bg-accent text-accent-foreground" : "bg-white/5 text-accent")}>
                  {tool.icon}
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">{tool.name}</CardTitle>
                  <CardDescription className="text-[10px] leading-tight">{tool.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Workspace Area */}
        <div className="lg:col-span-2 space-y-6">
          {activeTool ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {roleTools.find(t => t.id === activeTool)?.icon}
                    {roleTools.find(t => t.id === activeTool)?.name}
                  </CardTitle>
                  <CardDescription>
                    Provide additional details to customize the output, or leave blank for a standard approach.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea 
                    placeholder="e.g. Focus on serverless deployment, target Gen Z users, use a subscription model..."
                    className="min-h-[100px] bg-background/50 border-white/10"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                  />
                  <Button 
                    disabled={loading} 
                    onClick={handleRunTask} 
                    className="w-full bg-primary hover:bg-primary/90 font-bold gap-2"
                  >
                    {loading ? <Sparkles className="animate-spin" /> : <Send className="w-4 h-4" />}
                    Execute {state.role} Task
                  </Button>
                </CardContent>
              </Card>

              {result && (
                <Card className="glass-card overflow-hidden animate-in zoom-in-95 duration-500">
                  <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex justify-between items-center">
                    <div className="space-y-1">
                      <h4 className="font-bold text-accent">{result.title}</h4>
                      <p className="text-[10px] text-muted-foreground">{result.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={copyToClipboard} className="text-muted-foreground hover:text-accent">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardContent className="p-6">
                    {result.format === 'code' ? (
                      <div className="relative group">
                        <pre className="p-6 rounded-xl bg-black/40 font-code text-sm overflow-x-auto border border-white/5">
                          <code className={`language-${result.language || 'text'}`}>
                            {result.content}
                          </code>
                        </pre>
                        <Badge variant="outline" className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border-white/10 text-xs">
                          {result.language?.toUpperCase() || 'CODE'}
                        </Badge>
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none prose-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
                        {result.content}
                      </div>
                    )}

                    {result.additionalInsights && result.additionalInsights.length > 0 && (
                      <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-accent">Founder Insights</h5>
                        <div className="grid gap-3">
                          {result.additionalInsights.map((insight, i) => (
                            <div key={i} className="flex gap-3 text-xs italic text-muted-foreground">
                              <span className="text-accent">•</span> {insight}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-6 glass-card rounded-2xl border-dashed border-white/10">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-muted-foreground/30 animate-pulse">
                <Box className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-headline font-bold">Select a Tool</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Pick one of the {state.role} tools on the left to start generating practical startup assets.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
