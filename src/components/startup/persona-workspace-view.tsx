
"use client"

import React, { useState, useMemo } from 'react';
import { useStartup } from './startup-context';
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
  Zap, Code2, Rocket, Save, Download, Search, Heart, Infinity, Brain,
  Info, HelpCircle, ShieldAlert
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirestore, useUser } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
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
  const [authOpen, setAuthOpen] = useState(false);

  const roleTools = useMemo((): Tool[] => {
    switch (state.role) {
      case 'AI CTO':
        return [
          { id: 'generate-code', name: 'MVP Code', description: 'Describe feature → get code.', icon: <Terminal className="w-4 h-4" /> },
          { id: 'db-schema', name: 'DB Schema', description: 'Architect data structure.', icon: <Database className="w-4 h-4" /> },
          { id: 'system-arch', name: 'System Arch', description: 'Design scalable backends.', icon: <Cpu className="w-4 h-4" /> },
        ];
      case 'AI CMO':
        return [
          { id: 'marketing-plan', name: 'Strategy', description: 'GTM execution.', icon: <Target className="w-4 h-4" /> },
          { id: 'social-content', name: 'Social Copy', description: 'Ad and post copy.', icon: <Share2 className="w-4 h-4" /> },
          { id: 'brand-positioning', name: 'Branding', description: 'Define value and voice.', icon: <Heart className="w-4 h-4" /> },
        ];
      case 'AI CFO':
        return [
          { id: 'revenue-model', name: 'Revenue Model', description: 'Sustainable income.', icon: <Coins className="w-4 h-4" /> },
          { id: 'burn-rate', name: 'Burn Rate', description: 'Calculate runway.', icon: <Banknote className="w-4 h-4" /> },
          { id: 'fundraising', name: 'Fundraising', description: 'Round planning.', icon: <PieChart className="w-4 h-4" /> },
        ];
      default: return [];
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
      if (response.brainUpdate) updateBrain(response.brainUpdate);
    } catch (error) {
      toast({ variant: "destructive", title: "Task Failed", description: "Try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToProject = async () => {
    if (isGuestMode) { setAuthOpen(true); return; }
    if (!result || !user || !firestore || !state.projectId) return;
    const assetId = crypto.randomUUID();
    const assetRef = doc(firestore, 'users', user.uid, 'projects', state.projectId, 'assets', assetId);
    try {
      await setDoc(assetRef, {
        asset_id: assetId,
        title: result.title,
        description: result.description,
        content: result.content,
        format: result.format,
        role: state.role,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Save Failed", description: "Error saving asset." });
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 sm:space-y-10">
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-accent bg-accent/10 border-accent/20 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest">{state.role} OFFICE</Badge>
          <Badge variant="secondary" className="bg-white/5 border-white/10 text-[9px] sm:text-[10px]">{state.stage}</Badge>
        </div>
        <h2 className="text-3xl sm:text-5xl font-headline font-bold gradient-text">{state.role}&apos;s Studio</h2>
        <p className="text-xs sm:text-lg text-muted-foreground">Execute high-impact tasks with your executive.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Studio Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {roleTools.map((tool) => (
              <Card key={tool.id} onClick={() => { setActiveTool(tool.id); setResult(null); }} className={cn("cursor-pointer transition-all hover:border-accent/50", activeTool === tool.id ? "border-accent bg-accent/5" : "glass-card")}>
                <CardHeader className="p-3 sm:p-4 flex flex-row items-center gap-3 space-y-0">
                  <div className={cn("p-2 rounded-lg shrink-0", activeTool === tool.id ? "bg-accent text-accent-foreground" : "bg-white/5 text-accent")}>{tool.icon}</div>
                  <div className="min-w-0">
                    <CardTitle className="text-[11px] sm:text-sm font-bold truncate">{tool.name}</CardTitle>
                    <CardDescription className="text-[9px] truncate">{tool.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {activeTool ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
              <Card className="glass-card">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-xl flex items-center gap-2">{roleTools.find(t => t.id === activeTool)?.name}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Provide context for the {state.role}.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                  <Textarea placeholder="e.g. Focus on subscription model, target Gen Z..." className="min-h-[100px] bg-background/50 border-white/10 text-xs sm:text-sm" value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} />
                  <Button disabled={loading} onClick={handleRunTask} className="w-full bg-primary h-10 sm:h-12 font-bold text-xs sm:text-sm gap-2">
                    {loading ? <Sparkles className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                    Execute Task
                  </Button>
                </CardContent>
              </Card>

              {result && (
                <Card className="glass-card overflow-hidden animate-in zoom-in-95 duration-500">
                  <div className="bg-white/5 px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 flex justify-between items-center">
                    <h4 className="font-bold text-accent text-xs sm:text-sm">{result.title}</h4>
                    <Button variant="outline" size="sm" onClick={handleSaveToProject} className="h-7 sm:h-8 text-[9px] sm:text-[10px] gap-1.5 border-white/10">
                      <Save className="w-3 h-3" /> Save to Library
                    </Button>
                  </div>
                  <CardContent className="p-4 sm:p-6">
                    <div className={cn("rounded-xl border border-white/5 p-4 sm:p-6 bg-black/10 text-[11px] sm:text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap", result.format === 'code' && "font-code bg-black/40")}>
                      {result.content}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] sm:min-h-[400px] text-center space-y-4 glass-card rounded-2xl border-dashed border-white/10 p-6">
              <Box className="w-10 h-10 sm:w-16 sm:h-16 text-muted-foreground/20 animate-pulse" />
              <h3 className="text-base sm:text-xl font-headline font-bold">Select a Tool</h3>
              <p className="text-[11px] sm:text-sm text-muted-foreground max-w-xs">Pick a studio tool on the left to start generating assets.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
