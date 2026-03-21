
"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, Sparkles, ThumbsUp, ThumbsDown, ArrowRight, Clock, BookOpen, Users2, ShieldCheck, Megaphone, Banknote, Box, FastForward, Cpu } from 'lucide-react';
import { useStartup } from './startup-context';
import { aiDecisionSupport, type DecisionSupportOutput } from '@/ai/flows/ai-decision-support';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function DecisionSupportView() {
  const { state } = useStartup();
  const [query, setQuery] = useState('');
  const [deciding, setDeciding] = useState(false);
  const [decision, setDecision] = useState<DecisionSupportOutput | null>(null);
  const { toast } = useToast();

  const handleAsk = async () => {
    if (!query.trim()) return;
    setDeciding(true);
    try {
      const result = await aiDecisionSupport({
        query,
        currentStage: state.stage,
        role: state.role
      });
      setDecision(result);
      toast({
        title: "Analysis Complete",
        description: `Framework: ${result.frameworkUsed}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Decision Error",
        description: "The board is busy.",
      });
    } finally {
      setDeciding(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'AI CTO': return <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />;
      case 'AI CMO': return <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" />;
      case 'AI CFO': return <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />;
      case 'AI Product Manager': return <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />;
      case 'AI Growth Hacker': return <FastForward className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />;
      default: return <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />;
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <header className="space-y-3 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20 text-[9px] sm:text-[10px]">Decision Hub</Badge>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 flex gap-1 items-center text-[9px] sm:text-[10px]">
            <Users2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Collaboration Enabled
          </Badge>
        </div>
        <h2 className="text-3xl sm:text-4xl font-headline font-bold gradient-text">Strategic Advisory</h2>
        <p className="text-xs sm:text-lg text-muted-foreground">
          Describe your situation and the boardroom will weigh in.
        </p>
      </header>

      <div className="space-y-4">
        <Textarea 
          placeholder="e.g. Should we pivot to a B2B model? How should we prioritize our next features?"
          className="min-h-[120px] sm:min-h-[150px] bg-card/40 border-white/10 p-4 sm:p-6 rounded-xl text-sm sm:text-lg resize-none shadow-inner"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleAsk} disabled={deciding || !query} className="w-full bg-primary h-12 sm:h-14 text-sm sm:text-lg font-bold gap-2 group">
          {deciding ? <Sparkles className="animate-spin w-5 h-5 sm:w-6 sm:h-6" /> : <Users2 className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />}
          Consult the Board
        </Button>
      </div>

      {decision && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-20">
          <Card className="border-accent/30 bg-accent/5 overflow-hidden">
            <div className="bg-accent/10 px-4 sm:px-6 py-2 flex justify-between items-center border-b border-accent/20">
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-1">
                <BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Framework: {decision.frameworkUsed}
              </span>
            </div>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-2xl">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                Executive Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-base sm:text-xl font-medium leading-relaxed">{decision.recommendation}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {decision.options.map((opt, i) => (
              <Card key={i} className="glass-card flex flex-col">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                    {opt.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6 flex-1">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Benefits
                    </div>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {opt.benefits.map((p, pi) => (
                        <li key={pi} className="text-[11px] sm:text-sm text-muted-foreground flex gap-2">
                          <span className="text-emerald-500/50">•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-rose-400 uppercase tracking-wider">
                      <ThumbsDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Risks
                    </div>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {opt.risks.map((c, ci) => (
                        <li key={ci} className="text-[11px] sm:text-sm text-muted-foreground flex gap-2">
                          <span className="text-rose-500/50">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <div className="p-4 sm:p-6 pt-0 border-t border-white/5 mt-auto">
                   <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <Clock className="w-3 h-3" /> Effort: <span className="text-accent">{opt.effort}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
