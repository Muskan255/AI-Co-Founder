"use client"

import React, { useState, useMemo } from 'react';
import { StartupProvider, useStartup, StartupStage, StartupRole } from '@/components/startup/startup-context';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarInset, SidebarTrigger, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarFooter } from '@/components/ui/sidebar';
import { 
  Lightbulb, 
  LayoutDashboard, 
  Map, 
  Code2, 
  Rocket, 
  CheckSquare, 
  HelpCircle,
  ChevronRight,
  Sparkles,
  Zap,
  Trash2,
  Activity,
  PlayCircle,
  Flag,
  Cpu,
  Megaphone,
  Banknote,
  Box,
  FastForward,
  LogIn,
  LogOut,
  Library,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { IdeaValidationView } from '@/components/startup/idea-validation-view';
import { BlueprintView } from '@/components/startup/blueprint-view';
import { ProductGuideView } from '@/components/startup/product-guide-view';
import { MarketingView } from '@/components/startup/marketing-view';
import { FinancialView } from '@/components/startup/financial-view';
import { TaskManagerView } from '@/components/startup/task-manager-view';
import { DecisionSupportView } from '@/components/startup/decision-support-view';
import { SimulationView } from '@/components/startup/simulation-view';
import { WorkspaceView } from '@/components/startup/workspace-view';
import { ProjectListView } from '@/components/startup/project-list-view';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, useUser } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

type ViewType = 'projects' | 'dashboard' | 'validation' | 'blueprint' | 'product' | 'marketing' | 'finance' | 'tasks' | 'decisions' | 'simulation' | 'workspace';

function DashboardContent({ setView }: { setView: (v: ViewType) => void }) {
  const { state, reset, setStage } = useStartup();
  
  const progressItems = [
    { id: 'workspace', label: 'Turbo Workspace', icon: <Zap className="text-accent" />, completed: !!state.workspace, description: 'Generate roadmap, pitch deck & specs in one go.' },
    { id: 'validation', label: 'Idea Validation', icon: <Lightbulb />, completed: !!state.validation, description: 'Challenge and stress-test your core concept.' },
    { id: 'blueprint', label: 'Strategy Blueprint', icon: <Map />, completed: !!state.blueprint, description: 'Build your business model and revenue engine.' },
    { id: 'finance', label: 'Financial Plan', icon: <DollarSign className="text-emerald-400" />, completed: !!state.financialStrategy, description: 'Unit economics, burn rate & funding plans.' },
    { id: 'product', label: 'Product Development', icon: <Code2 />, completed: !!state.productGuidance, description: 'MVP specs and architecture recommendations.' },
    { id: 'marketing', label: 'Growth Plan', icon: <Rocket />, completed: !!state.marketing, description: 'Growth loops and acquisition strategy.' },
    { id: 'tasks', label: 'Accountability', icon: <CheckSquare />, completed: !!state.tasks, description: 'Roadmaps, milestones, and daily execution.' },
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
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">
              {state.role} Active
            </Badge>
          </div>
          <h1 className="text-5xl font-headline font-bold gradient-text">
            {state.projectName === 'New Venture' ? 'Welcome back, Founder.' : state.projectName}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {state.rawIdea || "Execution is the only differentiator. Let's build something world-changing."}
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Startup Stage</label>
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
                <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Ready
                </div>
              ) : (
                <div className="bg-white/5 text-muted-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                  Start
                </div>
              )}
            </div>
            <h3 className="text-xl font-headline font-semibold mb-2">{item.label}</h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              {item.description}
            </p>
            <div className="flex items-center text-accent text-sm font-medium">
              Enter Section <ChevronRight className="w-4 h-4 ml-1" />
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
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Clear Local Venture Data</p>
        </div>
      </div>

      {!state.rawIdea ? (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-10 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
          <Zap className="w-12 h-12 text-accent mx-auto animate-pulse" />
          <h2 className="text-3xl font-headline font-bold">Turbo Launch Engine</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Input one idea and get a full workspace: Roadmap, Pitch Deck, Marketing Strategy, and Product Specs instantly.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => setView('workspace')} className="bg-primary hover:bg-primary/90 gap-2 px-8">
              <Sparkles className="w-4 h-4" /> Turbo Generate Workspace
            </Button>
            <Button size="lg" variant="outline" onClick={() => setView('validation')} className="border-accent/20">
              Manual Validation
            </Button>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="flex gap-4 items-center relative z-1">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <Flag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline">Scaling to: {stages[Math.min(stages.indexOf(state.stage) + 1, stages.length - 1)]}</h3>
              <p className="text-sm text-muted-foreground">Don't plan for too long. Build something users love.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setView('finance')} className="border-accent/20 hover:bg-accent/5">
              Financial Analysis
            </Button>
            <Button onClick={() => setView('simulation')} className="bg-accent text-accent-foreground font-bold">
              Run Market Simulation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function MainApp() {
  const { user } = useUser();
  const auth = useAuth();
  const [activeWorkspace, setActiveWorkspace] = useState<ViewType>(user ? 'projects' : 'dashboard');
  const { state, setRole } = useStartup();

  const handleSignIn = async () => {
    if (!auth) return;
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      setActiveWorkspace('projects');
    } catch (error) {
      console.error('Sign in failed', error);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    setActiveWorkspace('dashboard');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'My Ventures', icon: <Library className="w-4 h-4" /> },
    { id: 'workspace', label: 'Turbo Workspace', icon: <Zap className="w-4 h-4 text-accent" /> },
    { id: 'validation', label: 'Idea Validation', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'blueprint', label: 'Strategy Blueprint', icon: <Map className="w-4 h-4" /> },
    { id: 'finance', label: 'Financial Plan', icon: <DollarSign className="w-4 h-4 text-emerald-400" /> },
    { id: 'product', label: 'Product Development', icon: <Code2 className="w-4 h-4" /> },
    { id: 'marketing', label: 'Growth Plan', icon: <Rocket className="w-4 h-4" /> },
    { id: 'tasks', label: 'Accountability', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'simulation', label: 'Simulations', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'decisions', label: 'Decision Hub', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const activeNavItem = useMemo(() => 
    navItems.find(item => item.id === activeWorkspace) || navItems[0], 
  [activeWorkspace]);

  const renderView = () => {
    switch(activeWorkspace) {
      case 'projects': return <ProjectListView onSelect={() => setActiveWorkspace('dashboard')} />;
      case 'dashboard': return <DashboardContent setView={setActiveWorkspace} />;
      case 'validation': return <IdeaValidationView onComplete={() => setActiveWorkspace('blueprint')} />;
      case 'blueprint': return <BlueprintView onComplete={() => setActiveWorkspace('finance')} />;
      case 'finance': return <FinancialView onComplete={() => setActiveWorkspace('product')} />;
      case 'product': return <ProductGuideView onComplete={() => setActiveWorkspace('marketing')} />;
      case 'marketing': return <MarketingView onComplete={() => setActiveWorkspace('tasks')} />;
      case 'tasks': return <TaskManagerView />;
      case 'decisions': return <DecisionSupportView />;
      case 'simulation': return <SimulationView />;
      case 'workspace': return <WorkspaceView />;
      default: return <DashboardContent setView={setActiveWorkspace} />;
    }
  };

  const roles: { id: StartupRole; icon: React.ReactNode; label: string }[] = [
    { id: 'AI CTO', icon: <Cpu className="w-4 h-4" />, label: 'Architect' },
    { id: 'AI CMO', icon: <Megaphone className="w-4 h-4" />, label: 'Marketer' },
    { id: 'AI CFO', icon: <Banknote className="w-4 h-4" />, label: 'Analyst' },
    { id: 'AI Product Manager', icon: <Box className="w-4 h-4" />, label: 'Product Lead' },
    { id: 'AI Growth Hacker', icon: <FastForward className="w-4 h-4" />, label: 'Growth Hacker' },
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
              <span className="font-headline font-bold text-lg leading-none uppercase tracking-tighter">AI Founder</span>
              <span className="text-[10px] text-accent font-bold uppercase tracking-widest mt-1">{state.stage}</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Venture Studio</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      isActive={activeWorkspace === item.id}
                      onClick={() => setActiveWorkspace(item.id as ViewType)}
                      tooltip={item.label}
                      className={activeWorkspace === item.id ? "bg-primary/10 text-accent" : "hover:bg-white/5"}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Executive Persona</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {roles.map((role) => (
                  <SidebarMenuItem key={role.id}>
                    <SidebarMenuButton 
                      isActive={state.role === role.id}
                      onClick={() => setRole(role.id)}
                      tooltip={role.id}
                      className={state.role === role.id ? "bg-accent/10 text-accent" : "hover:bg-white/5"}
                    >
                      {role.icon}
                      <span className="font-medium">{role.id}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-white/5">
          {user ? (
            <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:flex-col">
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-accent">{user.displayName?.charAt(0)}</span>
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold truncate">{user.displayName}</span>
                  <span className="text-[10px] text-muted-foreground truncate">Founder</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={handleSignIn} className="w-full bg-accent text-accent-foreground font-bold gap-2 group-data-[collapsible=icon]:p-0">
              <LogIn className="w-4 h-4" />
              <span className="group-data-[collapsible=icon]:hidden">Sign In</span>
            </Button>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-[#16181C]">
        <header className="h-16 border-b border-white/5 flex items-center px-4 sticky top-0 bg-[#16181C]/80 backdrop-blur-md z-10">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-4 h-4 bg-white/10" />
          
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="text-accent">
              {activeNavItem.icon}
            </div>
            <span className="font-headline font-bold text-sm tracking-tight uppercase">
              {activeNavItem.label}
            </span>
          </div>

          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {state.role} Perspective
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
