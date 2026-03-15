"use client"

import React from 'react';
import { useStartup, SmartNotification } from './startup-context';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  Sparkles, 
  ArrowRight, 
  X, 
  Lightbulb, 
  Rocket, 
  Code2, 
  DollarSign, 
  ShieldAlert,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function NotificationCenter({ onNavigate }: { onNavigate: (view: any) => void }) {
  const { state, markNotificationAsRead, dismissNotification } = useStartup();
  
  const unreadCount = state.notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'Idea Improvement': return <Lightbulb className="w-4 h-4 text-amber-400" />;
      case 'Product Development': return <Code2 className="w-4 h-4 text-blue-400" />;
      case 'Marketing Strategy': return <Rocket className="w-4 h-4 text-pink-400" />;
      case 'Financial Planning': return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'Technical Development': return <ShieldAlert className="w-4 h-4 text-accent" />;
      default: return <Sparkles className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-white/5">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-[#16181C] border-white/10 shadow-2xl" align="end">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-headline font-bold text-sm tracking-tight uppercase">AI Suggestions</h3>
            {unreadCount > 0 && (
              <Badge className="bg-accent text-accent-foreground text-[10px] px-1.5 h-4">
                {unreadCount} New
              </Badge>
            )}
          </div>
          <Sparkles className="w-4 h-4 text-accent animate-pulse" />
        </div>
        
        <ScrollArea className="h-[400px]">
          {state.notifications.length > 0 ? (
            <div className="divide-y divide-white/5">
              {state.notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "p-4 space-y-3 transition-colors hover:bg-white/5 group relative",
                    !notification.read && "bg-accent/5"
                  )}
                  onMouseEnter={() => markNotificationAsRead(notification.id)}
                >
                  <button 
                    onClick={() => dismissNotification(notification.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  <div className="flex gap-3">
                    <div className="mt-1 p-2 rounded-lg bg-white/5 shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold leading-none">{notification.title}</h4>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        {notification.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[8px] text-muted-foreground uppercase font-bold tracking-widest">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(notification.timestamp)} ago
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-[10px] gap-1 px-2 border-accent/20 text-accent hover:bg-accent hover:text-accent-foreground"
                      onClick={() => onNavigate(notification.action.view)}
                    >
                      {notification.action.label} <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground/30">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-xs text-muted-foreground">No strategic suggestions at the moment. Keep building!</p>
            </div>
          )}
        </ScrollArea>
        <div className="p-3 border-t border-white/5 text-center">
          <Button variant="ghost" size="sm" className="w-full text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-accent">
            View All History
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
