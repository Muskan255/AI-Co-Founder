
"use client"

import React, { useState } from 'react';
import { useStartup, StartupBrain } from './startup-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Save, Lightbulb, Target, TrendingUp, Users, ShieldCheck, Zap, Globe, Coins, Code2, Rocket, Landmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function StartupBrainView() {
  const { state, updateBrain } = useStartup();
  const [localBrain, setLocalBrain] = useState<StartupBrain>(state.brain);
  const { toast } = useToast();

  const handleSave = () => {
    updateBrain(localBrain);
    toast({ title: "Brain Synchronized", description: "Intelligence updated." });
  };

  const updateField = (field: keyof StartupBrain, value: string) => {
    setLocalBrain(prev => ({ ...prev, [field]: value }));
  };

  const brainFields: { id: keyof StartupBrain; label: string; icon: React.ReactNode }[] = [
    { id: 'startup_idea', label: 'Idea', icon: <Lightbulb className="w-3.5 h-3.5" /> },
    { id: 'target_market', label: 'Market', icon: <Target className="w-3.5 h-3.5" /> },
    { id: 'problem_statement', label: 'Problem', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'value_proposition', label: 'Value Prop', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'revenue_model', label: 'Revenue', icon: <Coins className="w-3.5 h-3.5" /> },
    { id: 'tech_stack', label: 'Tech Stack', icon: <Code2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 sm:space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-3">
          <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20 px-2 py-0.5 text-[9px] sm:text-[10px] flex gap-1.5 items-center w-fit">
            <Brain className="w-3 h-3" /> Shared Intelligence
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-headline font-bold gradient-text">Startup Brain</h2>
          <p className="text-xs sm:text-lg text-muted-foreground">The collective memory of your AI executive team.</p>
        </div>
        <Button onClick={handleSave} className="w-full sm:w-auto h-10 sm:h-12 px-8 font-bold bg-primary text-xs sm:text-sm gap-2">
          <Save className="w-4 h-4" /> Sync Brain
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-10">
        {brainFields.map((field) => (
          <Card key={field.id} className="glass-card hover:border-accent/30 transition-all">
            <CardHeader className="p-4 sm:p-5 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-accent shrink-0">{field.icon}</div>
                <Label htmlFor={field.id} className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">{field.label}</Label>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0">
              <Textarea 
                id={field.id}
                className="min-h-[80px] sm:min-h-[100px] bg-background/50 border-white/5 resize-none text-[11px] sm:text-sm"
                value={localBrain[field.id] || ''}
                onChange={(e) => updateField(field.id, e.target.value)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
