
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
  Zap, ArrowRight, Code2, Copy, Rocket,
  Save, Download, Github, FileSpreadsheet, FileType, Search, Heart, Infinity, Brain,
  Info, HelpCircle, ShieldAlert
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirestore, useUser } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AuthModal } from '@/components/auth/auth-modal';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export function PersonaWorkspaceView() {
  const { state, updateBrain, isGuestMode } = useStartup();
  const { user } = useUser();
  const firestore = useFirestore();
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExecutiveActionOutput | null>(null);
  const { toast } = useToast();

  const [githubOpen, setGithubOpen] = useState(false);
  const [githubStep, setGithubStep] = useState<'connect' | 'repo' | 'pushing'>('connect');
  const [authOpen, setAuthOpen] = useState(false);

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
          { id: 'marketing-plan', name: 'Marketing Strategy', description: 'Comprehensive strategy for launch & growth.', icon: <Target /> },
          { id: 'launch-campaign', name: 'Launch Campaign', description: 'Plan your Go-To-Market execution.', icon: <Rocket /> },
          { id: 'social-content', name: 'Social Media Content', description: 'Copy for Twitter, LinkedIn, and Instagram.', icon: <Share2 /> },
          { id: 'seo-strategy', name: 'SEO Strategy', description: 'Keywords and content cluster planning.', icon: <Search /> },
          { id: 'brand-positioning', name: 'Brand Positioning', description: 'Define your unique value and voice.', icon: <Heart /> },
          { id: 'audience-targeting', name: 'Audience Targeting', description: 'Identify and profile primary user segments.', icon: <Users /> },
        ];
      case 'AI CFO':
        return [
          { id: 'revenue-model', name: 'Revenue Model', description: 'Define how the startup generates sustainable income.', icon: <Coins /> },
          { id: 'pricing-strategy', name: 'Pricing Strategy', description: 'Optimize your tiers for PMF and LTV.', icon: <Target /> },
          { id: 'financial-projections', name: 'Financial Forecast', description: '12-24 month revenue and cost outlook.', icon: <TrendingUp /> },
          { id: 'burn-rate', name: 'Burn Rate Analysis', description: 'Calculate runway and monthly expenses.', icon: <Banknote /> },
          { id: 'fundraising-plan', name: 'Fundraising Strategy', description: 'Roadmap for Seed, Angel, or VC rounds.', icon: <PieChart /> },
        ];
      case 'AI Product Manager':
        return [
          { id: 'mvp-features', name: 'MVP Feature List', description: 'Prioritized core functionality for V1.', icon: <Boxes /> },
          { id: 'product-roadmap', name: 'Product Roadmap', description: 'Chronological execution timeline.', icon: <Milestone /> },
          { id: 'user-journeys', name: 'User Journeys', description: 'Step-by-step UX flow design.', icon: <Layout /> },
          { id: 'prd-generation', name: 'PRD Generation', description: 'Detailed Product Requirement Documents.', icon: <FileText /> },
          { id: 'feature-prioritization', name: 'Feature Backlog', description: 'Framework-based prioritization.', icon: <Zap /> },
        ];
      case 'AI Growth Hacker':
        return [
          { id: 'growth-experiments', name: 'Growth Experiments', description: 'High-frequency tests for acquisition.', icon: <FastForward /> },
          { id: 'referral-system', name: 'Referral System', description: 'Design viral loops and incentives.', icon: <Users /> },
          { id: 'viral-loops', name: 'Viral Mechanics', description: 'Build product-led growth engines.', icon: <Infinity /> },
          { id: 'acquisition-strategy', name: 'Acquisition Channels', description: 'Find scalable user acquisition loops.', icon: <Rocket /> },
          { id: 'retention-strategy', name: 'Retention Strategy', description: 'Fix the leaky bucket and boost stickiness.', icon: <ShieldCheck /> },
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
        userPrompt,
        startupBrain: state.brain as any
      });
      
      setResult(response);
      
      if (response.brainUpdate) {
        updateBrain(response.brainUpdate);
        toast({ title: "Brain Updated", description: "Shared intelligence has been enriched." });
      }

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
    toast({ title: "Copied", description: "Content copied to clipboard." });
  };

  const handleSaveToProject = async () => {
    if (isGuestMode) {
      setAuthOpen(true);
      return;
    }

    if (!result || !user || !firestore || !state.projectId) {
      toast({ variant: "destructive", title: "Cannot Save", description: "Project context missing." });
      return;
    }

    const assetId = crypto.randomUUID();
    const assetRef = doc(firestore, 'users', user.uid, 'projects', state.projectId, 'assets', assetId);

    try {
      await setDoc(assetRef, {
        asset_id: assetId,
        title: result.title,
        description: result.description,
        content: result.content,
        format: result.format,
        language: result.language || 'text',
        role: state.role,
        created_at: new Date().toISOString()
      });
      toast({ title: "Asset Saved", description: "Added to your project repository." });
    } catch (error) {
      toast({ variant: "destructive", title: "Save Failed", description: "Could not save asset to Firestore." });
    }
  };

  const handleExport = (type: 'text' | 'doc' | 'sheet' | 'pdf' = 'text') => {
    if (isGuestMode) {
      setAuthOpen(true);
      return;
    }

    if (!result) return;
    const blob = new Blob([result.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    let extension = 'txt';
    if (result.format === 'code') {
      extension = result.language === 'typescript' ? 'ts' : result.language === 'javascript' ? 'js' : 'txt';
    } else if (type === 'doc') {
      extension = 'md';
    } else if (type === 'sheet') {
      extension = 'csv';
    }

    a.href = url;
    a.download = `${result.title.toLowerCase().replace(/\s+/g, '-')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Export Started", description: `Your ${extension.toUpperCase()} file is downloading.` });
  };

  const handlePushToGithub = () => {
    if (isGuestMode) {
      setAuthOpen(true);
      return;
    }
    setGithubOpen(true);
    setGithubStep('connect');
  };

  const simulateGithubPush = () => {
    setGithubStep('pushing');
    setTimeout(() => {
      setGithubOpen(false);
      toast({ title: "Pushed to GitHub", description: "Committed as: 'Initial code generated by AI Founder'" });
    }, 2000);
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

  const getRoleDescription = () => {
    switch (state.role) {
      case 'AI CTO': return "Your technical advisor that helps generate code, design system architecture, and define tech stacks.";
      case 'AI CMO': return "Your marketing strategist focusing on brand identity, SEO, social growth, and launch execution.";
      case 'AI CFO': return "Your financial partner modeling unit economics, pricing, burn rate, and fundraising logic.";
      case 'AI Product Manager': return "Your product lead helping define MVP specs, user stories, and development roadmaps.";
      case 'AI Growth Hacker': return "Your aggressive growth partner designing viral loops, referral systems, and acquisition experiments.";
      default: return "";
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      
      {isGuestMode && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-200">Experiment Mode: Sign in to save your executive outputs and code.</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)} className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10">
            Sign In Now
          </Button>
        </div>
      )}

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={cn("px-3 py-1 font-bold uppercase tracking-widest", getRoleTheme())}>
              {state.role} OFFICE
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-muted-foreground hover:text-accent cursor-help">
                  <Info className="w-4 h-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">{getRoleDescription()}</p>
              </TooltipContent>
            </Tooltip>
            <Badge variant="secondary" className="bg-white/5 border-white/10">{state.stage}</Badge>
            <Badge variant="outline" className="border-accent/30 text-accent flex gap-1 items-center bg-accent/5">
              <Brain className="w-3 h-3" /> Shared Intelligence Active
            </Badge>
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
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Available Tools</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Each tool utilizes the AI's deep expertise to generate specific startup assets.</p>
              </TooltipContent>
            </Tooltip>
          </div>
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
                    Provide additional details to customize the output. Your {state.role} is already aware of your <strong>Startup Brain</strong>.
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
                    <div className="flex gap-2">
                       <Button variant="ghost" size="icon" onClick={copyToClipboard} className="text-muted-foreground hover:text-accent">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-6">
                    {result.format === 'code' ? (
                      <div className="space-y-4">
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
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                          <Button variant="outline" size="sm" onClick={handleSaveToProject} className="gap-2 border-white/10 bg-white/5 hover:bg-accent/10 hover:border-accent/30 text-xs">
                            <Save className="w-3 h-3" /> Save to Project
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleExport()} className="gap-2 border-white/10 bg-white/5 hover:bg-accent/10 hover:border-accent/30 text-xs">
                            <Download className="w-3 h-3" /> Export Code
                          </Button>
                          <Button variant="outline" size="sm" onClick={handlePushToGithub} className="gap-2 border-white/10 bg-white/5 hover:bg-accent/10 hover:border-accent/30 text-xs">
                            <Github className="w-3 h-3" /> Push to GitHub
                          </Button>
                          <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2 border-white/10 bg-white/5 hover:bg-accent/10 hover:border-accent/30 text-xs">
                            <Copy className="w-3 h-3" /> Copy Code
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="prose prose-invert max-w-none prose-sm whitespace-pre-wrap text-muted-foreground leading-relaxed border border-white/5 p-6 rounded-xl bg-black/10">
                          {result.content}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-white/5">
                          <Button variant="outline" size="sm" onClick={handleSaveToProject} className="gap-2 border-white/10 bg-white/5 hover:bg-accent/10 hover:border-accent/30 text-xs">
                            <Save className="w-3 h-3" /> Save to Project
                          </Button>
                          
                          {state.role === 'AI CFO' ? (
                            <Button variant="outline" size="sm" onClick={() => handleExport('sheet')} className="gap-2 border-white/10 bg-white/5 hover:bg-accent/10 hover:border-accent/30 text-xs">
                              <FileSpreadsheet className="w-3 h-3" /> Export Sheets
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => handleExport('doc')} className="gap-2 border-white/10 bg-white/5 hover:bg-accent/10 hover:border-accent/30 text-xs">
                              <FileType className="w-3 h-3" /> Export Doc
                            </Button>
                          )}

                          <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2 border-white/10 bg-white/5 hover:bg-accent/10 hover:border-accent/30 text-xs">
                            <Copy className="w-3 h-3" /> Copy Content
                          </Button>
                        </div>
                      </div>
                    )}

                    {result.brainUpdate && (
                      <div className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3">
                        <Brain className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Brain Update Detected</p>
                          <p className="text-xs text-muted-foreground">This session has enriched your startup intelligence with new data on: {Object.keys(result.brainUpdate).join(', ')}.</p>
                        </div>
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

      <Dialog open={githubOpen} onOpenChange={setGithubOpen}>
        <DialogContent className="sm:max-w-[400px] bg-[#16181C] border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" /> GitHub Integration
            </DialogTitle>
            <DialogDescription>
              Deploy your AI-generated code directly to your repositories.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {githubStep === 'connect' ? (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <Github className="w-8 h-8" />
                </div>
                <p className="text-sm text-muted-foreground">Connect your GitHub account to allow AI Founder to push code on your behalf.</p>
                <Button onClick={() => setGithubStep('repo')} className="w-full bg-[#24292f] hover:bg-[#24292f]/90 text-white font-bold">
                  Connect GitHub Account
                </Button>
              </div>
            ) : githubStep === 'repo' ? (
              <div className="space-y-4">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Select Repository</label>
                <div className="space-y-2">
                  {['startup-mvp', 'ai-founder-app', 'project-x'].map(repo => (
                    <div 
                      key={repo} 
                      onClick={simulateGithubPush}
                      className="p-3 rounded-lg border border-white/5 bg-white/5 hover:border-accent/50 cursor-pointer flex justify-between items-center group"
                    >
                      <span className="text-sm font-medium">{repo}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-8">
                <Sparkles className="w-12 h-12 text-accent mx-auto animate-spin" />
                <h4 className="font-bold text-lg">Pushing to main...</h4>
                <p className="text-xs text-muted-foreground">Committing: "Initial code generated by AI Founder"</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
