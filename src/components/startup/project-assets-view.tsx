
"use client"

import React, { useMemo } from 'react';
import { useStartup } from './startup-context';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Code2, Download, ExternalLink, Library, Clock, Database } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function ProjectAssetsView() {
  const { state } = useStartup();
  const { user } = useUser();
  const firestore = useFirestore();

  const assetsQuery = useMemo(() => {
    if (!user || !firestore || !state.projectId) return null;
    return query(collection(firestore, 'users', user.uid, 'projects', state.projectId, 'assets'), orderBy('created_at', 'desc'));
  }, [user, firestore, state.projectId]);

  const { data: assets, loading } = useCollection(assetsQuery);

  const handleExport = (asset: any) => {
    const blob = new Blob([asset.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${asset.title.toLowerCase().replace(/\s+/g, '-')}.${asset.format === 'code' ? 'ts' : 'md'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 space-y-6">
        <Skeleton className="h-10 w-1/2 sm:w-1/3 bg-white/5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 sm:h-48 bg-white/5 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 sm:space-y-10">
      <header className="space-y-2 sm:space-y-4">
        <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20 text-[9px] sm:text-[10px]">Venture Vault</Badge>
        <h2 className="text-3xl sm:text-4xl font-headline font-bold gradient-text">Library</h2>
        <p className="text-xs sm:text-lg text-muted-foreground">Strategic assets record for <strong>{state.projectName}</strong>.</p>
      </header>

      {assets && assets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-10">
          {assets.map((asset: any) => (
            <Card key={asset.id} className="glass-card hover:border-accent/30 transition-all flex flex-col group">
              <CardHeader className="p-4 sm:p-6 pb-2">
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-white/5 text-accent shrink-0">
                    {asset.format === 'code' ? <Code2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <FileText className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 text-[8px] sm:text-[9px]">{asset.role}</Badge>
                </div>
                <CardTitle className="text-base sm:text-lg font-headline truncate">{asset.title}</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs line-clamp-2 mt-1">{asset.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 flex-1 space-y-4">
                <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] text-muted-foreground font-bold tracking-widest uppercase">
                  <Clock className="w-3 h-3" /> {new Date(asset.created_at).toLocaleDateString()}
                </div>
                <div className="pt-3 border-t border-white/5 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport(asset)} className="flex-1 text-[10px] sm:text-xs h-8 gap-1.5 border-white/10">
                    <Download className="w-3 h-3" /> Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 sm:py-20 bg-white/2 rounded-3xl border border-dashed border-white/10 space-y-4 sm:space-y-6">
          <Library className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/20 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-headline font-bold">Library is empty.</h3>
            <p className="text-[11px] sm:text-sm text-muted-foreground max-w-xs mx-auto">Generate strategic assets in the Executive Studio.</p>
          </div>
        </div>
      )}
    </div>
  );
}
