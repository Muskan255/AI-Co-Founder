"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, Sparkles, ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react';

export function DecisionSupportView() {
  const [query, setQuery] = useState('');
  const [deciding, setDeciding] = useState(false);
  const [decision, setDecision] = useState<{
    recommendation: string;
    options: { title: string; pros: string[]; cons: string[] }[];
  } | null>(null);

  const handleAsk = () => {
    if (!query.trim()) return;
    setDeciding(true);
    // Mocking response logic for the decision hub UI as we don't have a specific flow for this yet, 
    // but the proposal calls for it. We'll use local state to simulate the AI Co-Founder's response pattern.
    setTimeout(() => {
      setDecision({
        recommendation: "Focus on the Freemium model to drive initial user acquisition.",
        options: [
          {
            title: "Freemium Model",
            pros: ["Low barrier to entry", "Viral potential", "Large user base"],
            cons: ["Higher support costs", "Slower monetization", "Low conversion to paid"]
          },
          {
            title: "Direct Sales (B2B)",
            pros: ["Higher ACV", "Predictable revenue", "Closer customer feedback"],
            cons: ["Longer sales cycle", "Expensive sales team", "Harder to scale quickly"]
          }
        ]
      });
      setDeciding(false);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header className="space-y-4">
        <h2 className="text-3xl font-headline font-bold">Decision Hub</h2>
        <p className="text-muted-foreground">
          Stuck on a tough call? Describe the situation and I'll weigh the options with you.
        </p>
      </header>

      <div className="space-y-4">
        <Textarea 
          placeholder="Should we build our own payment system or use Stripe? What are the trade-offs of switching to a subscription model now?"
          className="min-h-[150px] bg-card/40 border-white/10 p-6 rounded-xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleAsk} disabled={deciding || !query} className="w-full bg-primary h-12 gap-2">
          {deciding ? <Sparkles className="animate-spin w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
          Analyze Decision
        </Button>
      </div>

      {decision && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
          <Card className="border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Co-Founder's Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{decision.recommendation}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {decision.options.map((opt, i) => (
              <Card key={i} className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-accent" />
                    Option: {opt.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <ThumbsUp className="w-3 h-3" /> PROS
                    </div>
                    {opt.pros.map((p, pi) => (
                      <div key={pi} className="text-sm text-muted-foreground">• {p}</div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                      <ThumbsDown className="w-3 h-3" /> CONS
                    </div>
                    {opt.cons.map((c, ci) => (
                      <div key={ci} className="text-sm text-muted-foreground">• {c}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
