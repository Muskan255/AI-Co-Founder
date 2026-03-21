
"use client"

import React, { useMemo } from 'react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Briefcase, Clock, ArrowRight, Sparkles, Target, LogIn, ShieldAlert } from 'lucide-react';
import { useStartup } from './startup-context';
import { Progress } from '@/components/ui/progress';

interface ProjectListViewProps {
  onSelect: () => void;
  onAuthPrompt: () => void;
}

export function ProjectListView({ onSelect, onAuthPrompt }: ProjectListViewProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { loadProject, reset, isGuestMode } = useStartup();
  
  const projectsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'projects'), orderBy('last_updated', 'desc'));
  }, [user, firestore]);

  const { data: projects, loading } = useCollection(projectsQuery);

  const calculateProgress = (project: any) => {
    const fields = ['validation', 'blueprint', 'productGuidance', 'marketing'];
    const stateData = project.fullState || {};
    const completed = fields.filter(f => !!stateData[f]).length;
    return (completed / fields.length) * 100;
  };

  if (isGuestMode) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh] text-center space-y-6 sm:space-y-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500">
          <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-4xl font-headline font-bold">Cloud Storage Disabled</h2>
          <p className="text-sm sm:text-xl text-muted-foreground max-w-md mx-auto">Login to save your ventures and access them anywhere.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <Button onClick={onAuthPrompt} size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground font-bold px-8 h-12 sm:h-14 gap-2 text-sm">
            <LogIn className="w-4 h-4 sm:w-5 sm:h-5" /> Sign In to Save
          </Button>
          <Button onClick={() => { reset(); onSelect(); }} variant="outline" size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-8 border-white/10 text-sm">
            Experiment as Guest
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-20 text-center space-y-4">
        <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-accent mx-auto animate-spin" />
        <h3 className="text-base sm:text-xl font-headline font-bold">Retrieving Ventures...</h3>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 sm:space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20 px-2 py-0.5 text-[9px] sm:text-[10px]">Venture Archive</Badge>
          <h2 className="text-3xl sm:text-5xl font-headline font-bold gradient-text">Portfolio</h2>
          <p className="text-xs sm:text-lg text-muted-foreground max-w-2xl">Resume execution or start a new experiment.</p>
        </div>
        <Button onClick={() => { reset(); onSelect(); }} className="w-full sm:w-auto bg-primary h-12 sm:h-14 px-8 text-sm sm:text-lg font-bold">
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> New Venture
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 pb-10">
        <Card onClick={() => { reset(); onSelect(); }} className="glass-card border-dashed border-white/20 hover:border-accent/50 cursor-pointer flex flex-col items-center justify-center p-8 sm:p-12 transition-all group min-h-[250px] sm:min-h-[350px]">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-lg sm:text-2xl font-headline font-bold">Start Fresh</h3>
        </Card>

        {projects?.map((project: any) => {
          const progress = calculateProgress(project);
          return (
            <Card key={project.id} onClick={() => { loadProject(project); onSelect(); }} className="glass-card hover:border-accent/50 cursor-pointer transition-all flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 sm:p-4">
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 text-[8px] sm:text-[9px]">{project.startup_stage}</Badge>
              </div>
              <CardHeader className="pt-8 sm:pt-10">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-accent mb-3 sm:mb-4" />
                <CardTitle className="text-xl sm:text-2xl font-headline truncate">{project.project_name}</CardTitle>
                <CardDescription className="line-clamp-2 text-[11px] sm:text-sm mt-1 sm:mt-2">{project.idea_description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Maturity</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1 bg-white/5" />
                </div>
                <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] text-muted-foreground bg-white/5 w-fit px-2 py-0.5 rounded-full">
                  <Clock className="w-2.5 h-2.5" /> Updated: {project.last_updated?.toDate().toLocaleDateString()}
                </div>
              </CardContent>
              <div className="p-4 sm:p-6 pt-0 mt-auto">
                <Button className="w-full bg-secondary h-9 sm:h-10 text-[11px] sm:text-xs font-bold justify-between">Resume <ArrowRight className="w-3.5 h-3.5" /></Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
