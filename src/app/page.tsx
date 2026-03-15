"use client"

import React, { useState } from 'react';
import { StartupProvider, useStartup, StartupStage } from '@/components/startup/startup-context';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { 
  Lightbulb, 
  LayoutDashboard, 
  Map, 
  Code2, 
  Rocket, 
  CheckSquare, 
  HelpCircle,
  Menu,
  ChevronRight,
  Sparkles,
  Zap,
  Trash2,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { IdeaValidationView } from '@/components/startup/idea-validation-view';
import { BlueprintView } from '@/components/startup/blueprint-view';
import { ProductGuideView } from '@/components/startup/product-guide-view';
import { MarketingView } from '@/components/startup/marketing-view';
import { TaskManagerView } from '@/components/startup/task-manager-view';
import { DecisionSupportView } from '@/components/startup/decision-support-view';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ViewType = 'dashboard' | 'validation' | 'blueprint' | 'product' | 'marketing' | 'tasks' | 'decisions';

function DashboardContent({ setView }: { setView: (v: ViewType) => void }) {
  const { state, reset, setStage } = useStartup();
  
  const progressItems = [
    { id: 'validation', label: 'Idea Validation', icon: <Lightbulb />, completed: !!state.validation },
    { id: 'blueprint', label: 'Startup Blueprint', icon: <Map />, completed: !!state.blueprint },
    { id: 'product', label: 'Product Guidance', icon: <Code2 />, completed: !!state.productGuidance },
    { id: 'marketing', label: 'Marketing Strategy', icon: <Rocket />, completed: !!state.marketing },
    { id: 'tasks', label: 'Task Management', icon: <CheckSquare />, completed: !!state.tasks },
  ];

  const stages: StartupStage[] = [
    'Idea Stage',
    'Validation Stage',
    'MVP Development',
    'Early Traction',
    'Growth Stage',
    'Scaling Stage'
  ];

  return (
    <div className="p-8 space-y-12 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20 px-3 py-1 flex gap-2 items-center">
              <Activity className="w-3 h-3" /> {state.stage}
            </Badge>
          </div>
          <h1 className="text-5xl font-headline font-bold gradient-text">Welcome back, Partner.</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            I'm your AI co-founder. Together, we'll build something remarkable. Current mode: <span className="text-accent">{state.stage}</span>.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Startup Mode</label>
          <Select value={state.stage} onValueChange={(val) => setStage(val as StartupStage)}>
            <SelectTrigger className="w-[200px] bg-card border-white/10">
              <SelectValue placeholder="Select Stage" />
            </SelectTrigger>
            <SelectContent>
              {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {progressItems.map((item) => (
          <div 
            key={item.id}
            onClick={() => setView(item.id as ViewType)}
            className="group glass-card p-6 rounded-xl cursor-pointer hover:border-accent/50 transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-primary/10 text-accent group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              {item.completed ? (
                <div className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Completed
                </div>
              ) : (
                <div className="bg-white/5 text-muted-foreground text-xs px-2 py-1 rounded-full">
                  Pending
                </div>
              )}
            </div>
            <h3 className="text-xl font-headline font-semibold mb-2">{item.label}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {item.completed ? 'Review your results and iterate.' : 'Start this phase to progress your idea.'}
            </p>
            <div className="flex items-center text-accent text-sm font-medium">
              Open Section <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        ))}
        
        <div 
          onClick={reset}
          className="group glass-card p-6 rounded-xl cursor-pointer hover:border-destructive/50 transition-all duration-300 flex flex-col items-center justify-center text-center space-y-3"
        >
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive group-hover:rotate-12 transition-transform">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="font-headline font-semibold">Start Fresh</h3>
          <p className="text-xs text-muted-foreground">Clear all current progress and start a new startup venture.</p>
        </div>
      </div>

      {!state.rawIdea ? (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-10 text-center space-y-6">
          <Zap className="w-12 h-12 text-accent mx-auto animate-pulse" />
          <h2 className="text-3xl font-headline font-bold">Have a new idea?</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Let's put it through the validation engine and see if it has wings.
          </p>
          <Button size="lg" onClick={() => setView('validation')} className="bg-primary hover:bg-primary/90">
            Validate New Idea
          </Button>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline">Road to {stages[Math.min(stages.indexOf(state.stage) + 1, stages.length - 1)]}</h3>
              <p className="text-sm text-muted-foreground">Keep executing the critical tasks to level up your venture.</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setView('tasks')} className="border-accent/20 hover:bg-accent/5">
            View Roadmap
          </Button>
        </div>
      )}
    </div>
  );
}

function MainApp() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const { state } = useStartup();

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <DashboardContent setView={setCurrentView} />;
      case 'validation': return <IdeaValidationView onComplete={() => setCurrentView('blueprint')} />;
      case 'blueprint': return <BlueprintView onComplete={() => setCurrentView('product')} />;
      case 'product': return <ProductGuideView onComplete={() => setCurrentView('marketing')} />;
      case 'marketing': return <MarketingView onComplete={() => setCurrentView('tasks')} />;
      case 'tasks': return <TaskManagerView />;
      case 'decisions': return <DecisionSupportView />;
      default: return <DashboardContent setView={setCurrentView} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'validation', label: 'Idea Validation', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'blueprint', label: 'Blueprint', icon: <Map className="w-4 h-4" /> },
    { id: 'product', label: 'Product Dev', icon: <Code2 className="w-4 h-4" /> },
    { id: 'marketing', label: 'Marketing', icon: <Rocket className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks & Roadmap', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'decisions', label: 'Decision Hub', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-white/5 bg-[#16181C]">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-headline font-bold text-lg leading-none">AI Co-Founder</span>
              <span className="text-[10px] text-accent font-bold uppercase tracking-widest mt-1">{state.stage}</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="px-2 py-4">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton 
                  isActive={currentView === item.id}
                  onClick={() => setCurrentView(item.id as ViewType)}
                  tooltip={item.label}
                  className={currentView === item.id ? "bg-primary/10 text-accent" : "hover:bg-white/5"}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-[#16181C]">
        <header className="h-16 border-b border-white/5 flex items-center px-4 sticky top-0 bg-[#16181C]/80 backdrop-blur-md z-10">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-4 h-4 bg-white/10" />
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {state.stage} Active
            </div>
          </div>
        </header>
        <main className="min-h-[calc(100vh-4rem)]">
          {renderView()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Home() {
  return (
    <StartupProvider>
      <MainApp />
    </StartupProvider>
  );
}
