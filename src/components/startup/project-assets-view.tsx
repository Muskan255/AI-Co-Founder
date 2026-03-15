
"use client"

import React, { useMemo } from 'react';
import { useStartup } from './startup-context';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Code2, 
  Terminal, 
  Download, 
  ExternalLink, 
  Search,
  Library,
  Clock,
  Sparkles,
  Database
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function ProjectAssetsView() {
  const { state } = useStartup();
  const { user } = useUser();
  const firestore = useFirestore();

  const assetsQuery = useMemo(() => {
    if (!user || !firestore || !state.projectId) return null;
    return query(
      collection(firestore, 'users', user.uid, 'projects', state.projectId, 'assets'),
      orderBy('created_at', 'desc')
    );
  }, [user, firestore, state.projectId]);

  const { data: assets, loading } = useCollection(assetsQuery);

  const handleExport = (asset: any) => {
    const blob = new Blob([asset.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${asset.title.toLowerCase().replace(/\s+/g, '-')}.${asset.format === 'code' ? (asset.language === 'typescript' ? 'ts' : 'js') : 'md'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-12 w-1/3 bg-white/5" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 bg-white/5 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20">Venture Vault</Badge>
        </div>
        <h2 className="text-4xl font-headline font-bold gradient-text">Venture Library</h2>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A permanent record of all strategic assets generated for <strong>{state.projectName}</strong>.
        </p>
      </header>

      {assets && assets.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset: any) => (
            <Card key={asset.id} className="glass-card hover:border-accent/30 transition-all flex flex-col group">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-white/5 text-accent">
                    {asset.format === 'code' ? <Code2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 text-[10px]">
                    {asset.role}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-headline">{asset.title}</CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">{asset.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  <Clock className="w-3 h-3" />
                  Generated: {new Date(asset.created_at).toLocaleDateString()}
                </div>
                
                <div className="pt-4 border-t border-white/5 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport(asset)} className="flex-1 text-xs gap-2 border-white/10 hover:bg-accent/10">
                    <Download className="w-3 h-3" /> Export
                  </Button>
                  <Button variant="ghost" size="sm" className="px-2 text-muted-foreground hover:text-accent">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/2 rounded-3xl border border-dashed border-white/10 space-y-6">
          <Library className="w-16 h-16 text-muted-foreground/30 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-headline font-bold">Your library is empty.</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Use the Executive Studio to generate strategic assets like code, marketing plans, and financial models.
            </p>
          </div>
          <Button variant="outline" className="border-accent/30 text-accent">
            Go to Executive Studio
          </Button>
        </div>
      )}
    </div>
  );
}
