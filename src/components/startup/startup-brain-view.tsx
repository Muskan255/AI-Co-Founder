
"use client"

import React, { useState } from 'react';
import { useStartup, StartupBrain } from './startup-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Save, Sparkles, Lightbulb, Target, TrendingUp, Users, ShieldCheck, Zap, Globe, Coins, Code2, Rocket, Landmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function StartupBrainView() {
  const { state, updateBrain } = useStartup();
  const [localBrain, setLocalBrain] = useState<StartupBrain>(state.brain);
  const { toast } = useToast();

  const handleSave = () => {
    updateBrain(localBrain);
    toast({
      title: "Brain Synchronized",
      description: "Venture intelligence updated for all AI personas.",
    });
  };

  const updateField = (field: keyof StartupBrain, value: string) => {
    setLocalBrain(prev => ({ ...prev, [field]: value }));
  };

  const brainFields: { id: keyof StartupBrain; label: string; icon: React.ReactNode; placeholder: string }[] = [
    { id: 'startup_idea', label: 'Startup Idea', icon: <Lightbulb className="w-4 h-4" />, placeholder: 'The core concept...' },
    { id: 'target_market', label: 'Target Market', icon: <Target className="w-4 h-4" />, placeholder: 'Primary audience...' },
    { id: 'problem_statement', label: 'Problem Statement', icon: <ShieldCheck className="w-4 h-4" />, placeholder: 'What pain are we solving?' },
    { id: 'value_proposition', label: 'Value Proposition', icon: <Sparkles className="w-4 h-4" />, placeholder: 'Our unique offering...' },
    { id: 'revenue_model', label: 'Revenue Model', icon: <Coins className="w-4 h-4" />, placeholder: 'How we make money...' },
    { id: 'product_features', label: 'Product Features', icon: <Zap className="w-4 h-4" />, placeholder: 'Core functionality...' },
    { id: 'marketing_strategy', label: 'Marketing Strategy', icon: <Rocket className="w-4 h-4" />, placeholder: 'GTM plan...' },
    { id: 'financial_forecast', label: 'Financial Forecast', icon: <TrendingUp className="w-4 h-4" />, placeholder: 'Revenue projections...' },
    { id: 'competitors', label: 'Competitors', icon: <Globe className="w-4 h-4" />, placeholder: 'Market rivals...' },
    { id: 'tech_stack', label: 'Tech Stack', icon: <Code2 className="w-4 h-4" />, placeholder: 'Frameworks, DBs, Cloud...' },
    { id: 'customer_segments', label: 'Customer Segments', icon: <Users className="w-4 h-4" />, placeholder: 'Detailed user personas...' },
    { id: 'pricing_strategy', label: 'Pricing Strategy', icon: <Landmark className="w-4 h-4" />, placeholder: 'Tiers and model...' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20 px-3 py-1 flex gap-2 items-center">
              <Brain className="w-3 h-3" /> Shared Intelligence Layer
            </Badge>
          </div>
          <h2 className="text-5xl font-headline font-bold gradient-text leading-tight">Startup Brain</h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            This shared memory is accessible to all AI executives. Updates here will influence future strategies and task outputs.
          </p>
        </div>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 gap-2 h-14 px-8 text-lg font-bold shadow-lg shadow-primary/20">
          <Save className="w-5 h-5" /> Sync Brain
        </Button>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brainFields.map((field) => (
          <Card key={field.id} className="glass-card hover:border-accent/30 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-accent">
                  {field.icon}
                </div>
                <Label htmlFor={field.id} className="text-sm font-bold uppercase tracking-wider">{field.label}</Label>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea 
                id={field.id}
                placeholder={field.placeholder}
                className="min-h-[100px] bg-background/50 border-white/5 resize-none text-sm"
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
