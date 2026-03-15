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
    return query(
      collection(firestore, 'users', user.uid, 'projects'),
      orderBy('last_updated', 'desc')
    );
  }, [user, firestore]);

  const { data: projects, loading } = useCollection(projectsQuery);

  const handleSelect = (project: any) => {
    loadProject(project);
    onSelect();
  };

  const handleNew = () => {
    reset();
    onSelect();
  };

  const calculateProgress = (project: any) => {
    const fields = ['validation', 'blueprint', 'productGuidance', 'marketing', 'financialStrategy', 'tasks'];
    const stateData = project.fullState || {};
    const completed = fields.filter(f => !!stateData[f]).length;
    return (completed / fields.length) * 100;
  };

  if (isGuestMode) {
    return (
      <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-headline font-bold">Cloud Storage Disabled</h2>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            You are currently in Experiment Mode. Login to save your ventures and access them from any device.
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={onAuthPrompt} size="lg" className="bg-accent text-accent-foreground font-bold px-8 h-14 gap-2">
            <LogIn className="w-5 h-5" /> Sign In to Save
          </Button>
          <Button onClick={handleNew} variant="outline" size="lg" className="h-14 px-8 border-white/10 hover:bg-white/5">
            Experiment as Guest
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-20 text-center space-y-4">
        <Sparkles className="w-12 h-12 text-accent mx-auto animate-spin" />
        <h3 className="text-xl font-headline font-bold">Retrieving Your Ventures...</h3>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20 px-3 py-1">Venture Archive</Badge>
          <h2 className="text-5xl font-headline font-bold gradient-text leading-tight">Your Business Portfolio</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Select an active venture to resume execution or start a new high-growth experiment.
          </p>
        </div>
        <Button onClick={handleNew} className="bg-primary hover:bg-primary/90 gap-2 h-14 px-8 text-lg font-bold shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" /> New Venture
        </Button>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card 
          onClick={handleNew}
          className="glass-card border-dashed border-white/20 hover:border-accent/50 cursor-pointer flex flex-col items-center justify-center p-12 transition-all group min-h-[350px]"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-headline font-bold">Start Fresh</h3>
          <p className="text-sm text-muted-foreground mt-2 text-center">Architect a new startup blueprint from scratch.</p>
        </Card>

        {projects?.map((project: any) => {
          const progress = calculateProgress(project);
          return (
            <Card 
              key={project.id}
              onClick={() => handleSelect(project)}
              className="glass-card hover:border-accent/50 cursor-pointer transition-all group flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                  {project.startup_stage || project.progress_status}
                </Badge>
              </div>
              
              <CardHeader className="pt-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-accent flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6" />
                </div>
                <CardTitle className="text-2xl font-headline">{project.project_name}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm leading-relaxed mt-2">
                  {project.idea_description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Venture Maturity</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5 bg-white/5" />
                </div>

                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium bg-white/5 w-fit px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  Updated: {project.last_updated?.toDate().toLocaleDateString()}
                </div>
              </CardContent>

              <div className="p-6 pt-0 mt-auto">
                <Button className="w-full bg-secondary hover:bg-accent hover:text-accent-foreground group-hover:shadow-lg transition-all justify-between px-6 font-bold">
                  Resume Building <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {!projects?.length && !loading && (
        <div className="text-center py-20 bg-white/2 rounded-3xl border border-dashed border-white/10">
          <Target className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
          <h3 className="text-xl font-headline font-bold">No ventures found.</h3>
          <p className="text-muted-foreground max-w-xs mx-auto mt-2">
            Your startup ideas deserve execution. Start your first one now.
          </p>
          <Button onClick={handleNew} variant="outline" className="mt-8 border-accent/20 text-accent">
            Generate First Idea
          </Button>
        </div>
      )}
    </div>
  );
}
