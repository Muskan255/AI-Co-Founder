
"use client"

import React, { useState } from 'react';
import { useStartup } from './startup-context';
import { aiWorkspaceGeneration } from '@/ai/flows/ai-workspace-generation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Map, Code2, Layout, Presentation, Rocket, Check, Zap, Terminal, Globe } from 'lucide-react';
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
      const result = await aiWorkspaceGeneration({ idea, role: state.role, stage: state.stage });
      setRawIdea(idea);
      setWorkspace(result);
      toast({ title: "Workspace Ready", description: "Venture assets generated." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to build workspace." });
    } finally {
      setLoading(false);
    }
  };

  const ws = state.workspace;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 sm:space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20 text-[9px] sm:text-[10px]">Turbo Mode</Badge>
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] sm:text-[10px]">{state.role} Directing</Badge>
        </div>
        <h2 className="text-3xl sm:text-4xl font-headline font-bold gradient-text">Turbo Launch</h2>
        <p className="text-xs sm:text-lg text-muted-foreground max-w-2xl">
          Generate roadmap, specs, copy, and pitch deck in one click.
        </p>
      </header>

      <section className="glass-card p-4 sm:p-6 rounded-2xl space-y-4">
        <Textarea 
          placeholder="Describe your startup idea..."
          className="min-h-[100px] sm:min-h-[120px] bg-background/50 border-white/10 text-sm sm:text-lg resize-none"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />
        <Button 
          disabled={loading || !idea.trim()} 
          onClick={handleGenerate} 
          className="w-full h-12 sm:h-14 bg-primary hover:bg-primary/90 text-sm sm:text-lg font-bold gap-2 group"
        >
          {loading ? <Sparkles className="animate-spin w-5 h-5 sm:w-6 sm:h-6" /> : <Zap className="w-5 h-5 sm:w-6 sm:h-6" />}
          {loading ? "Building Venture..." : "Generate Entire Workspace"}
        </Button>
      </section>

      {ws && (
        <Tabs defaultValue="roadmap" className="space-y-6 pb-10">
          <TabsList className="bg-white/5 p-1 h-auto flex flex-wrap gap-1 sm:gap-2">
            <TabsTrigger value="roadmap" className="gap-1.5 px-2 sm:px-3 text-[10px] sm:text-xs"><Map className="w-3 h-3 sm:w-4 sm:h-4" /> Roadmap</TabsTrigger>
            <TabsTrigger value="specs" className="gap-1.5 px-2 sm:px-3 text-[10px] sm:text-xs"><Code2 className="w-3 h-3 sm:w-4 sm:h-4" /> Specs</TabsTrigger>
            <TabsTrigger value="copy" className="gap-1.5 px-2 sm:px-3 text-[10px] sm:text-xs"><Layout className="w-3 h-3 sm:w-4 sm:h-4" /> Copy</TabsTrigger>
            <TabsTrigger value="pitch" className="gap-1.5 px-2 sm:px-3 text-[10px] sm:text-xs"><Presentation className="w-3 h-3 sm:w-4 sm:h-4" /> Pitch</TabsTrigger>
          </TabsList>

          <TabsContent value="roadmap">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {ws.roadmap.milestones.map((m, i) => (
                <Card key={i} className="glass-card">
                  <CardHeader className="p-4 sm:p-6">
                    <Badge className="w-fit bg-accent/20 text-accent text-[8px] sm:text-[9px]">Milestone {i+1}</Badge>
                    <CardTitle className="mt-2 text-base sm:text-lg">{m.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                    <ul className="space-y-2">
                      {m.tasks.map((t, ti) => (
                        <li key={ti} className="text-[11px] sm:text-sm text-muted-foreground flex gap-2">
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" /> {t}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-3 border-t border-white/5">
                      <p className="text-[8px] sm:text-[9px] uppercase font-bold text-accent tracking-widest">KPI: {m.kpi}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="specs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <Card className="glass-card">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-xl flex items-center gap-2"><Zap className="text-accent w-4 h-4 sm:w-5 sm:h-5" /> MVP Features</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <ul className="space-y-2 sm:space-y-3">
                    {ws.productSpecs.mvpFeatures.map((f, i) => (
                      <li key={i} className="flex gap-2 sm:gap-3 text-[11px] sm:text-sm text-muted-foreground p-2 sm:p-3 rounded-lg bg-white/5 items-center">
                        <Badge variant="outline" className="h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center shrink-0 text-[8px] sm:text-[10px]">{i+1}</Badge>
                        <span className="line-clamp-2">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-[10px] sm:text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" /> Tech Stack
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 grid grid-cols-3 gap-2 sm:gap-4">
                  {[
                    { label: 'Front', val: ws.productSpecs.techStack.frontend },
                    { label: 'Back', val: ws.productSpecs.techStack.backend },
                    { label: 'DB', val: ws.productSpecs.techStack.database },
                  ].map((stack, idx) => (
                    <div key={idx} className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[7px] sm:text-[8px] text-muted-foreground uppercase mb-1">{stack.label}</p>
                      <p className="text-[9px] sm:text-xs font-bold truncate">{stack.val}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
