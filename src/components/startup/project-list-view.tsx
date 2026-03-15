"use client"

import React, { useMemo } from 'react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Briefcase, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useStartup } from './startup-context';

export function ProjectListView({ onSelect }: { onSelect: () => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { loadProject, reset } = useStartup();
  
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

  if (loading) {
    return (
      <div className="p-20 text-center space-y-4">
        <Sparkles className="w-12 h-12 text-accent mx-auto animate-spin" />
        <h3 className="text-xl font-headline">Loading Ventures...</h3>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-headline font-bold gradient-text">Your Ventures</h2>
          <p className="text-muted-foreground">Select a startup project to continue your journey.</p>
        </div>
        <Button onClick={handleNew} className="bg-primary gap-2">
          <Plus className="w-4 h-4" /> Start New Venture
        </Button>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          onClick={handleNew}
          className="glass-card border-dashed border-white/20 hover:border-accent/50 cursor-pointer flex flex-col items-center justify-center p-8 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="font-headline font-bold">New Project</h3>
          <p className="text-xs text-muted-foreground mt-2">Create a fresh startup blueprint</p>
        </Card>

        {projects?.map((project: any) => (
          <Card 
            key={project.id}
            onClick={() => handleSelect(project)}
            className="glass-card hover:border-accent/50 cursor-pointer transition-all group"
          >
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Briefcase className="w-5 h-5 text-accent" />
                <Badge variant="secondary" className="bg-primary/10 text-accent text-[10px]">
                  {project.progress_status}
                </Badge>
              </div>
              <CardTitle className="text-xl">{project.project_name}</CardTitle>
              <CardDescription className="line-clamp-2 text-xs">
                {project.idea_description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-4">
                <Clock className="w-3 h-3" />
                Last updated: {project.last_updated?.toDate().toLocaleDateString()}
              </div>
              <Button variant="ghost" className="w-full text-accent p-0 justify-between group-hover:px-2 transition-all">
                Resume Building <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}