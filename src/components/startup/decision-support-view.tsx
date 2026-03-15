"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, Sparkles, ThumbsUp, ThumbsDown, ArrowRight, Clock, BookOpen } from 'lucide-react';
import { useStartup } from './startup-context';
import { aiDecisionSupport, type DecisionSupportOutput } from '@/ai/flows/ai-decision-support';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

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
        description: `Framework: ${result.frameworkUsed} by ${state.role}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Decision Hub Error",
        description: "Your co-founder is unavailable to weigh in right now.",
      });
    } finally {
      setDeciding(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header className="space-y-4 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20">{state.role} Perspective</Badge>
        </div>
        <h2 className="text-4xl font-headline font-bold gradient-text">Decision Hub</h2>
        <p className="text-muted-foreground text-lg">
          Stuck on a tough call? Describe your situation and your {state.role} will use proven frameworks to help you choose the best path.
        </p>
      </header>

      <div className="space-y-4">
        <Textarea 
          placeholder="Should we build our own payment system or use Stripe? What are the trade-offs of switching to a subscription model now? Should we focus on B2B or B2C for our launch?"
          className="min-h-[150px] bg-card/40 border-white/10 p-6 rounded-xl text-lg resize-none shadow-inner"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleAsk} disabled={deciding || !query} className="w-full bg-primary h-14 text-lg font-bold gap-2">
          {deciding ? <Sparkles className="animate-spin w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
          Ask {state.role}
        </Button>
      </div>

      {decision && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <Card className="border-accent/30 bg-accent/5 overflow-hidden">
            <div className="bg-accent/10 px-6 py-2 flex justify-between items-center border-b border-accent/20">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Framework: {decision.frameworkUsed}
              </span>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="w-6 h-6 text-accent" />
                {state.role}&apos;s Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-medium leading-relaxed">{decision.recommendation}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {decision.options.map((opt, i) => (
              <Card key={i} className="glass-card flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-accent" />
                    {opt.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      <ThumbsUp className="w-4 h-4" /> Benefits
                    </div>
                    <ul className="space-y-2">
                      {opt.benefits.map((p, pi) => (
                        <li key={pi} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-emerald-500/50">•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                      <ThumbsDown className="w-4 h-4" /> Risks
                    </div>
                    <ul className="space-y-2">
                      {opt.risks.map((c, ci) => (
                        <li key={ci} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-rose-500/50">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <div className="p-6 pt-0 border-t border-white/5 mt-auto">
                   <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
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
