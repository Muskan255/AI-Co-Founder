"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  status?: 'empty' | 'loading' | 'completed';
}

export function FeatureCard({ title, description, icon, children, className, status = 'completed' }: FeatureCardProps) {
  return (
    <Card className={cn("glass-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10", className)}>
      <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
        <div className="p-2 rounded-lg bg-primary/10 text-accent">
          {icon}
        </div>
        <div>
          <CardTitle className="text-xl font-headline">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {status === 'loading' ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-white/5 rounded w-3/4" />
            <div className="h-4 bg-white/5 rounded w-full" />
            <div className="h-4 bg-white/5 rounded w-5/6" />
          </div>
        ) : children}
      </CardContent>
    </Card>
  );
}
