"use client"

import React, { useState } from 'react';
import { useStartup } from './startup-context';
import { aiWorkspaceGeneration } from '@/ai/flows/ai-workspace-generation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Map, 
  Code2, 
  Layout, 
  Presentation, 
  Rocket, 
  Copy, 
  Check, 
  Zap,
  ArrowRight,
  Database,
  Terminal,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

export function WorkspaceView() {
  const { state, setWorkspace, setRawIdea } = useStartup();
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState(state.rawIdea || '');
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    try {
      const result = await aiWorkspaceGeneration({
        idea,
        role: state.role,
        stage: state.stage
      });
      setRawIdea(idea);
      setWorkspace(result);
      toast({
        title: "Workspace Built",
        description: "Your complete startup assets are ready.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Error",
        description: "Failed to build workspace. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Copied to clipboard." });
  };

  const ws = state.workspace;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20">Turbo Mode</Badge>
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{state.role} Directing</Badge>
        </div>
        <h2 className="text-4xl font-headline font-bold gradient-text">Startup Workspace Generator</h2>
        <p className="text-xl text-muted-foreground max-w-2xl">
          One idea. Infinite execution. Generate your roadmap, product specs, copy, and pitch deck in one click.
        </p>
      </header>

      <section className="glass-card p-6 rounded-2xl space-y-4">
        <Textarea 
          placeholder="Describe your startup idea in detail..."
          className="min-h-[120px] bg-background/50 border-white/10 text-lg resize-none"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />
        <Button 
          disabled={loading || !idea.trim()} 
          onClick={handleGenerate} 
          className="w-full h-14 bg-primary hover:bg-primary/90 text-lg font-bold gap-2 group"
        >
          {loading ? <Sparkles className="animate-spin" /> : <Zap className="group-hover:animate-pulse" />}
          {loading ? "Building Your Venture..." : "Generate Entire Workspace"}
        </Button>
      </section>

      {ws && (
        <Tabs defaultValue="roadmap" className="space-y-6">
          <TabsList className="bg-white/5 p-1 h-auto flex flex-wrap gap-2">
            <TabsTrigger value="roadmap" className="gap-2"><Map className="w-4 h-4" /> Roadmap</TabsTrigger>
            <TabsTrigger value="specs" className="gap-2"><Code2 className="w-4 h-4" /> Product Specs</TabsTrigger>
            <TabsTrigger value="copy" className="gap-2"><Layout className="w-4 h-4" /> Landing Copy</TabsTrigger>
            <TabsTrigger value="pitch" className="gap-2"><Presentation className="w-4 h-4" /> Pitch Deck</TabsTrigger>
            <TabsTrigger value="marketing" className="gap-2"><Rocket className="w-4 h-4" /> Marketing</TabsTrigger>
          </TabsList>

          <TabsContent value="roadmap">
            <div className="grid md:grid-cols-3 gap-6">
              {ws.roadmap.milestones.map((m, i) => (
                <Card key={i} className="glass-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge className="bg-accent/20 text-accent">Milestone {i+1}</Badge>
                      <Map className="w-4 h-4 text-accent/50" />
                    </div>
                    <CardTitle className="mt-2">{m.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {m.tasks.map((t, ti) => (
                        <li key={ti} className="text-sm text-muted-foreground flex gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" /> {t}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[10px] uppercase font-bold text-accent tracking-widest">Target KPI</p>
                      <p className="text-sm font-medium">{m.kpi}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="specs">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="text-accent" /> MVP Core Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {ws.productSpecs.mvpFeatures.map((f, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground p-3 rounded-lg bg-white/5">
                        <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center shrink-0">{i+1}</Badge>
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-accent" /> Tech Stack
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[8px] text-muted-foreground uppercase mb-1">Frontend</p>
                      <p className="text-xs font-bold">{ws.productSpecs.techStack.frontend}</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[8px] text-muted-foreground uppercase mb-1">Backend</p>
                      <p className="text-xs font-bold">{ws.productSpecs.techStack.backend}</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[8px] text-muted-foreground uppercase mb-1">Database</p>
                      <p className="text-xs font-bold">{ws.productSpecs.techStack.database}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent" /> User Stories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {ws.productSpecs.userStories.map((s, i) => (
                      <p key={i} className="text-xs italic text-muted-foreground leading-relaxed border-l-2 border-accent/20 pl-4 py-1">
                        "{s}"
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="copy">
            <Card className="glass-card overflow-hidden">
              <div className="bg-primary/10 p-4 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Globe className="w-4 h-4 text-accent" /> Landing Page Assets
                </span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`${ws.landingPageCopy.hero}\n${ws.landingPageCopy.subhero}`)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-8 space-y-12">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-headline font-bold text-foreground">{ws.landingPageCopy.hero}</h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{ws.landingPageCopy.subhero}</p>
                  <Button size="lg" className="bg-accent text-accent-foreground font-bold">{ws.landingPageCopy.cta}</Button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {ws.landingPageCopy.benefits.map((b, i) => (
                    <div key={i} className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent mx-auto mb-4">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold">{b.split(':')[0]}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{b.split(':')[1] || b}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pitch">
            <div className="space-y-4">
              {ws.pitchDeck.slides.map((slide, i) => (
                <Card key={i} className="glass-card hover:border-accent/30 transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4 py-4">
                    <Badge variant="outline" className="w-10 h-10 flex items-center justify-center rounded-lg border-accent/20 text-accent font-bold text-lg">
                      {i+1}
                    </Badge>
                    <CardTitle className="text-lg">{slide.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{slide.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="marketing">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="text-accent" /> Acquisition Channels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {ws.marketingPlan.channels.map((c, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1">{c}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest">Growth Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ws.marketingPlan.strategy}</p>
                  </CardContent>
                </Card>

                <Card className="border-accent/30 bg-accent/5">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-accent">
                      <Sparkles className="w-4 h-4" /> Viral Growth Loop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium italic">"{ws.marketingPlan.viralLoop}"</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
