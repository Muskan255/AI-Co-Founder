
"use client"

import React, { useState, useMemo, useEffect } from 'react';
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
  DollarSign,
  ShieldAlert,
  Terminal,
  Brain,
  Info,
  Bell,
  ArrowRight,
  ShieldCheck,
  Target,
  Database,
  HeartPulse
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { PersonaWorkspaceView } from '@/components/startup/persona-workspace-view';
import { StartupBrainView } from '@/components/startup/startup-brain-view';
import { ProjectAssetsView } from '@/components/startup/project-assets-view';
import { NotificationCenter } from '@/components/startup/notification-center';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { AuthModal } from '@/components/auth/auth-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AIFounderLogo } from '@/components/ui/logo';
import { LandingPage } from '@/components/landing/landing-page';

type ViewType = 'landing' | 'projects' | 'dashboard' | 'validation' | 'blueprint' | 'product' | 'marketing' | 'finance' | 'tasks' | 'decisions' | 'simulation' | 'workspace' | 'persona-workspace' | 'brain' | 'health' | 'assets';

function HealthScoreCard() {
  const { state } = useStartup();
  if (!state.healthScore) return null;
  const { totalScore, analysis } = state.healthScore;

  return (
    <Card className="glass-card border-accent/20 bg-accent/5 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-headline">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            Health Score
          </CardTitle>
          <div className="text-2xl sm:text-3xl font-bold text-accent">
            {totalScore}<span className="text-xs text-muted-foreground font-normal">/100</span>
          </div>
        </div>
        <Progress value={totalScore} className="h-1.5 sm:h-2 bg-white/5" />
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-[10px] sm:text-xs text-muted-foreground italic line-clamp-2">"{analysis}"</p>
      </CardContent>
    </Card>
  );
}

function HealthScoreView() {
  const { state } = useStartup();
  
  if (!state.healthScore) {
    return (
      <div className="p-8 sm:p-12 text-center space-y-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
          <HeartPulse className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/30 animate-pulse" />
        </div>
        <h2 className="text-xl sm:text-2xl font-headline font-bold">Awaiting Audit</h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
          Start building your venture to receive a real-time health score from the AI Chief Auditor.
        </p>
      </div>
    );
  }

  const { totalScore, breakdown, suggestions, analysis } = state.healthScore;
  const scoreColor = totalScore > 75 ? 'text-emerald-400' : totalScore > 40 ? 'text-accent' : 'text-rose-400';

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 sm:space-y-10">
      <header className="space-y-2 sm:space-y-4">
        <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20 text-[10px]">Venture Diagnostic</Badge>
        <h2 className="text-3xl sm:text-5xl font-headline font-bold gradient-text">Venture Health</h2>
        <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl">
          A ruthless audit based on the intelligence in the Startup Brain.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <Card className="lg:col-span-2 glass-card border-accent/20 bg-accent/5 p-6 sm:p-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-36 h-32 sm:w-48 sm:h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="44%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                <circle cx="50%" cy="50%" r="44%" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="276" strokeDashoffset={276 - (276 * totalScore) / 100} className={scoreColor} />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={cn("text-4xl sm:text-6xl font-bold", scoreColor)}>{totalScore}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Readiness</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg sm:text-2xl font-headline font-bold">Maturity: {totalScore > 75 ? 'Exceptional' : totalScore > 40 ? 'Developing' : 'Critical'}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic max-w-md mx-auto">"{analysis}"</p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Pillar Breakdown</h3>
          <div className="grid gap-3 sm:gap-4">
            {[
              { label: 'Idea Quality', score: breakdown.ideaQuality, icon: <Lightbulb className="w-4 h-4" /> },
              { label: 'Market Clarity', score: breakdown.marketClarity, icon: <Target className="w-4 h-4" /> },
              { label: 'Product Readiness', score: breakdown.productReadiness, icon: <Code2 className="w-4 h-4" /> },
              { label: 'Revenue Model', score: breakdown.revenueModel, icon: <DollarSign className="w-4 h-4" /> },
            ].map((item, i) => (
              <Card key={i} className="glass-card p-3 sm:p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/5 text-accent">{item.icon}</div>
                    <span className="text-[10px] sm:text-xs font-bold">{item.label}</span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-accent">{item.score}/25</span>
                </div>
                <Progress value={(item.score / 25) * 100} className="h-1 bg-white/5" />
              </Card>
            ))}
          </div>
        </div>

        <Card className="lg:col-span-3 glass-card border-accent/30 bg-accent/5">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-accent">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" /> Executive Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {suggestions.map((s, i) => (
                <div key={i} className="p-3 sm:p-4 rounded-xl bg-black/20 border border-white/5 flex items-center gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-[10px] shrink-0">{i+1}</div>
                  <p className="text-[11px] sm:text-sm text-muted-foreground">{s}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardContent({ setView }: { setView: (v: ViewType) => void }) {
  const { state, setStage, isGuestMode } = useStartup();
  const [authOpen, setAuthOpen] = useState(false);
  
  const progressItems = [
    { id: 'validation', label: '1. Idea Validation', icon: <Lightbulb className="w-4 h-4" />, completed: !!state.validation, description: 'Step 1: Challenge your concept.' },
    { id: 'blueprint', label: '2. Strategy Blueprint', icon: <Map className="w-4 h-4" />, completed: !!state.blueprint, description: 'Step 2: Build the engine.' },
    { id: 'product', label: '3. Product Dev', icon: <Code2 className="w-4 h-4" />, completed: !!state.productGuidance, description: 'Step 3: Architect the MVP.' },
    { id: 'marketing', label: '4. Growth Plan', icon: <Rocket className="w-4 h-4" />, completed: !!state.marketing, description: 'Step 4: Launch and grow.' },
    { id: 'finance', label: '5. Financial Strategy', icon: <DollarSign className="w-4 h-4" />, completed: !!state.financialStrategy, description: 'Step 5: Unit economics.' },
    { id: 'tasks', label: '6. Accountability', icon: <CheckSquare className="w-4 h-4" />, completed: !!state.tasks, description: 'Step 6: Execution roadmaps.' },
  ];

  const stages: StartupStage[] = ['Idea Stage', 'Validation Stage', 'MVP Development', 'Early Traction', 'Growth Stage', 'Scaling Stage'];

  return (
    <div className="p-4 sm:p-8 space-y-8 sm:space-y-12 max-w-6xl mx-auto">
      {isGuestMode && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span className="text-[11px] sm:text-sm font-medium text-amber-200 text-center sm:text-left">Experiment Mode: Sign in to save your venture.</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)} className="text-amber-500 text-xs sm:text-sm">Sign In</Button>
          <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3">
            <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20 px-2 py-0.5 text-[9px] sm:text-[10px] flex gap-1.5 items-center">
              <Activity className="w-2.5 h-2.5 sm:w-3 h-3" /> {state.stage}
            </Badge>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-2 py-0.5 text-[9px] sm:text-[10px]">
              {state.role}
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-5xl font-headline font-bold gradient-text">
            {state.projectName === 'New Venture' ? 'Welcome back, Founder.' : state.projectName}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto md:mx-0">
            {state.rawIdea || "Execution is everything. Let's build."}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 items-center md:items-end">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Startup Stage</label>
          <Select value={state.stage} onValueChange={(val) => setStage(val as StartupStage)}>
            <SelectTrigger className="w-[180px] sm:w-[200px] h-9 sm:h-10 text-xs sm:text-sm bg-card border-white/10">
              <SelectValue placeholder="Select Stage" />
            </SelectTrigger>
            <SelectContent>
              {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {progressItems.slice(0, 4).map((item) => (
              <div 
                key={item.id}
                onClick={() => setView(item.id as ViewType)}
                className="group glass-card p-5 sm:p-6 rounded-xl cursor-pointer hover:border-accent/50 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-accent group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  {item.completed ? (
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-[8px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5">Ready</Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-[8px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 border-white/5">Start</Badge>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-headline font-semibold mb-1">{item.label}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                <div className="flex items-center text-accent text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                  Enter <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div onClick={() => setView('health')} className="cursor-pointer">
            <HealthScoreCard />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {progressItems.slice(4).map((item) => (
              <div 
                key={item.id}
                onClick={() => setView(item.id as ViewType)}
                className="group glass-card p-4 sm:p-5 rounded-xl cursor-pointer hover:border-accent/50 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-accent">{item.icon}</div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold font-headline">{item.label}</h4>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const { user } = useUser();
  const auth = useAuth();
  const { state, setRole, isHydrated } = useStartup();
  const [activeWorkspace, setActiveWorkspace] = useState<ViewType>('landing');

  useEffect(() => {
    if (isHydrated) {
      if (state.rawIdea || user) {
        setActiveWorkspace(user && !state.rawIdea ? 'projects' : 'dashboard');
      } else {
        setActiveWorkspace('landing');
      }
    }
  }, [isHydrated, state.rawIdea, user]);

  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    setActiveWorkspace('landing');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'Venture Archive', icon: <Library className="w-4 h-4" /> },
    { id: 'health', label: 'Venture Health', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
    { id: 'assets', label: 'Venture Library', icon: <Database className="w-4 h-4 text-accent" /> },
    { id: 'brain', label: 'Startup Brain', icon: <Brain className="w-4 h-4 text-accent" /> },
    { id: 'workspace', label: 'Turbo Engine', icon: <Zap className="w-4 h-4 text-accent" /> },
    { id: 'validation', label: '1. Idea Validation', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'blueprint', label: '2. Strategy Blueprint', icon: <Map className="w-4 h-4" /> },
    { id: 'product', label: '3. Product Dev', icon: <Code2 className="w-4 h-4" /> },
    { id: 'marketing', label: '4. Growth Plan', icon: <Rocket className="w-4 h-4" /> },
    { id: 'finance', label: '5. Financial Plan', icon: <DollarSign className="w-4 h-4 text-emerald-400" /> },
    { id: 'tasks', label: '6. Accountability', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'simulation', label: 'Simulations', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'decisions', label: 'Decision Hub', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'persona-workspace', label: 'Executive Studio', icon: <Terminal className="w-4 h-4 text-accent" /> },
  ];

  const activeNavItem = useMemo(() => navItems.find(item => item.id === activeWorkspace) || navItems[0], [activeWorkspace]);

  if (!isHydrated) {
    return (
      <div className="h-svh w-full flex flex-col items-center justify-center bg-[#16181C] space-y-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
          <AIFounderLogo className="w-5 h-5 text-white" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent animate-pulse">Restoring...</span>
      </div>
    );
  }

  if (activeWorkspace === 'landing') {
    return <LandingPage onStart={() => setActiveWorkspace('dashboard')} />;
  }

  const renderView = () => {
    switch(activeWorkspace) {
      case 'projects': return <ProjectListView onSelect={() => setActiveWorkspace('dashboard')} onAuthPrompt={() => setAuthModalOpen(true)} />;
      case 'dashboard': return <DashboardContent setView={setActiveWorkspace} />;
      case 'health': return <HealthScoreView />;
      case 'assets': return <ProjectAssetsView />;
      case 'brain': return <StartupBrainView />;
      case 'validation': return <IdeaValidationView onComplete={() => setActiveWorkspace('blueprint')} />;
      case 'blueprint': return <BlueprintView onComplete={() => setActiveWorkspace('product')} />;
      case 'product': return <ProductGuideView onComplete={() => setActiveWorkspace('marketing')} />;
      case 'marketing': return <MarketingView onComplete={() => setActiveWorkspace('finance')} />;
      case 'finance': return <FinancialView onComplete={() => setActiveWorkspace('tasks')} />;
      case 'tasks': return <TaskManagerView />;
      case 'decisions': return <DecisionSupportView />;
      case 'simulation': return <SimulationView />;
      case 'workspace': return <WorkspaceView />;
      case 'persona-workspace': return <PersonaWorkspaceView />;
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
        <SidebarHeader className="p-4 cursor-pointer" onClick={() => setActiveWorkspace('landing')}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <AIFounderLogo className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-headline font-bold text-base leading-none uppercase tracking-tighter">AI Co-Founder</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Studio</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton isActive={activeWorkspace === item.id} onClick={() => setActiveWorkspace(item.id as ViewType)} tooltip={item.label}>
                      {item.icon} <span className="text-xs sm:text-sm">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Executive</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {roles.map((role) => (
                  <SidebarMenuItem key={role.id}>
                    <SidebarMenuButton isActive={state.role === role.id} onClick={() => { setRole(role.id); setActiveWorkspace('persona-workspace'); }} tooltip={role.id}>
                      {role.icon} <span className="text-xs sm:text-sm">{role.id}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-white/5">
          {user ? (
            <div className="flex items-center justify-between gap-2 overflow-hidden">
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="text-[10px]">{user.displayName?.charAt(0) || 'F'}</AvatarFallback>
                </Avatar>
                <span className="text-[10px] font-bold truncate max-w-[80px]">{user.displayName || 'Founder'}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-8 w-8 text-muted-foreground"><LogOut className="w-3.5 h-3.5" /></Button>
            </div>
          ) : (
            <Button onClick={() => setAuthModalOpen(true)} className="w-full bg-accent text-accent-foreground font-bold h-9 text-[10px]">
              <LogIn className="w-3.5 h-3.5 mr-1.5" /> <span className="group-data-[collapsible=icon]:hidden">Sign In</span>
            </Button>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-[#16181C]">
        <header className="h-14 sm:h-16 border-b border-white/5 flex items-center px-3 sm:px-4 sticky top-0 bg-[#16181C]/80 backdrop-blur-md z-10">
          <SidebarTrigger className="h-8 w-8" />
          <Separator orientation="vertical" className="mx-2 sm:mx-4 h-4 bg-white/10" />
          <div className="flex items-center gap-2 truncate">
            <div className="text-accent shrink-0">{activeNavItem.icon}</div>
            <span className="font-headline font-bold text-[10px] sm:text-sm tracking-tight uppercase truncate">{activeNavItem.label}</span>
          </div>
          <div className="flex-1 flex justify-end items-center gap-2">
            <div className="hidden sm:block">
              {state.healthScore && (
                <Badge variant="outline" onClick={() => setActiveWorkspace('health')} className="cursor-pointer border-accent/30 text-[10px] h-6">
                  <ShieldCheck className="w-2.5 h-2.5 mr-1" /> {state.healthScore.totalScore}
                </Badge>
              )}
            </div>
            <NotificationCenter onNavigate={(view) => setActiveWorkspace(view)} />
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
