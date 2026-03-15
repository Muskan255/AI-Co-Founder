
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
  DollarSign,
  ShieldAlert,
  Terminal,
  Brain,
  Info,
  Bell,
  ArrowRight,
  ShieldCheck,
  Heart,
  Target,
  TrendingUp,
  BarChart3,
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
import { HelpCenter } from '@/components/startup/help-center';
import { NotificationCenter } from '@/components/startup/notification-center';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { AuthModal } from '@/components/auth/auth-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AIFounderLogo } from '@/components/ui/logo';

type ViewType = 'projects' | 'dashboard' | 'validation' | 'blueprint' | 'product' | 'marketing' | 'finance' | 'tasks' | 'decisions' | 'simulation' | 'workspace' | 'persona-workspace' | 'brain' | 'health';

function HealthScoreCard() {
  const { state } = useStartup();
  
  if (!state.healthScore) return null;

  const { totalScore, breakdown, suggestions, analysis } = state.healthScore;

  return (
    <Card className="glass-card border-accent/20 bg-accent/5 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl font-headline">
            <ShieldCheck className="w-5 h-5 text-accent" />
            Startup Health Score
          </CardTitle>
          <div className="text-3xl font-bold text-accent">
            {totalScore}<span className="text-sm text-muted-foreground font-normal">/100</span>
          </div>
        </div>
        <Progress value={totalScore} className="h-2 bg-white/5" />
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
              <Lightbulb className="w-3 h-3" /> Idea
            </p>
            <p className="text-sm font-bold">{breakdown.ideaQuality}<span className="text-[10px] text-muted-foreground/60">/25</span></p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
              <Target className="w-3 h-3" /> Market
            </p>
            <p className="text-sm font-bold">{breakdown.marketClarity}<span className="text-[10px] text-muted-foreground/60">/25</span></p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
              <Code2 className="w-3 h-3" /> Product
            </p>
            <p className="text-sm font-bold">{breakdown.productReadiness}<span className="text-[10px] text-muted-foreground/60">/25</span></p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Revenue
            </p>
            <p className="text-sm font-bold">{breakdown.revenueModel}<span className="text-[10px] text-muted-foreground/60">/25</span></p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed italic">"{analysis}"</p>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Recommended Improvements</p>
            <ul className="space-y-1">
              {suggestions.map((s, i) => (
                <li key={i} className="text-[11px] text-muted-foreground flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-accent/50" /> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HealthScoreView() {
  const { state } = useStartup();
  
  if (!state.healthScore) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
          <HeartPulse className="w-8 h-8 text-muted-foreground/30 animate-pulse" />
        </div>
        <h2 className="text-2xl font-headline font-bold">Awaiting Health Audit</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Start building your venture to receive a real-time health score from the AI Chief Auditor.
        </p>
      </div>
    );
  }

  const { totalScore, breakdown, suggestions, analysis } = state.healthScore;

  const scoreColor = totalScore > 75 ? 'text-emerald-400' : totalScore > 40 ? 'text-accent' : 'text-rose-400';

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <header className="space-y-4">
        <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20">Venture Diagnostic</Badge>
        <h2 className="text-5xl font-headline font-bold gradient-text">Startup Health Report</h2>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A ruthless audit of your venture's viability based on the shared intelligence in the Startup Brain.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card border-accent/20 bg-accent/5 overflow-hidden flex flex-col justify-center p-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/5"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={552.92}
                  strokeDashoffset={552.92 - (552.92 * totalScore) / 100}
                  className={scoreColor}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={cn("text-6xl font-bold", scoreColor)}>{totalScore}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Readiness</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-headline font-bold">Venture Maturity: {totalScore > 75 ? 'Exceptional' : totalScore > 40 ? 'Developing' : 'Critical'}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic max-w-md mx-auto">"{analysis}"</p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Pillar Breakdown</h3>
          </div>
          <div className="grid gap-4">
            {[
              { label: 'Idea Quality', score: breakdown.ideaQuality, icon: <Lightbulb className="w-4 h-4" /> },
              { label: 'Market Clarity', score: breakdown.marketClarity, icon: <Target className="w-4 h-4" /> },
              { label: 'Product Readiness', score: breakdown.productReadiness, icon: <Code2 className="w-4 h-4" /> },
              { label: 'Revenue Model', score: breakdown.revenueModel, icon: <DollarSign className="w-4 h-4" /> },
            ].map((item, i) => (
              <Card key={i} className="glass-card p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/5 text-accent">{item.icon}</div>
                    <span className="text-xs font-bold">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-accent">{item.score}<span className="text-[10px] text-muted-foreground/60">/25</span></span>
                </div>
                <Progress value={(item.score / 25) * 100} className="h-1 bg-white/5" />
              </Card>
            ))}
          </div>
        </div>

        <Card className="lg:col-span-3 glass-card border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-accent">
              <Zap className="w-5 h-5" /> Executive Prescriptions
            </CardTitle>
            <CardDescription>Follow these steps to increase your venture's maturity and viability score.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {suggestions.map((s, i) => (
                <div key={i} className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center gap-3 group hover:border-accent/30 transition-all cursor-default">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-xs shrink-0">{i+1}</div>
                  <p className="text-sm text-muted-foreground">{s}</p>
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
  const { state, reset, setStage, isGuestMode } = useStartup();
  const [authOpen, setAuthOpen] = useState(false);
  
  const progressItems = [
    { id: 'workspace', label: 'Turbo Workspace', icon: <Zap className="text-accent" />, completed: !!state.workspace, description: 'Generate roadmap, pitch deck & specs in one go.' },
    { id: 'brain', label: 'Startup Brain', icon: <Brain className="text-accent" />, completed: Object.keys(state.brain || {}).length > 3, description: 'Manage the shared intelligence of your venture.' },
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
      {isGuestMode && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-200">Experiment Mode: Sign in to save your venture and continue building.</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)} className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10">
            Sign In Now
          </Button>
          <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20 px-3 py-1 flex gap-2 items-center">
              <Activity className="w-3 h-3" /> {state.stage}
            </Badge>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">
              {state.role} Active
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-accent transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">Your AI Co-Founder is currently acting as your <strong>{state.role}</strong> during the <strong>{state.stage}</strong>.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <h1 className="text-5xl font-headline font-bold gradient-text">
            {state.projectName === 'New Venture' ? 'Welcome back, Founder.' : state.projectName}
          </h1>
          <p className="text-sm font-medium text-muted-foreground/60 tracking-wider">An AI Partner for Entrepreneurs</p>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0">
            {state.rawIdea || "Execution is the only differentiator. Let's build something world-changing."}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 items-center md:items-end">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Startup Stage</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Changing the stage shifts the AI's strategic focus and active role.</p>
              </TooltipContent>
            </Tooltip>
          </div>
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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {state.notifications.filter(n => !n.read).length > 0 && (
            <div className="glass-card p-6 rounded-2xl border-accent/30 bg-accent/5 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-right-10 duration-500 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                  <Bell className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-headline font-bold text-lg leading-none">Strategic Opportunity</h3>
                  <p className="text-sm text-muted-foreground">{state.notifications.find(n => !n.read)?.title}</p>
                </div>
              </div>
              <Button 
                onClick={() => setView(state.notifications.find(n => !n.read)?.action.view as ViewType)}
                className="bg-accent text-accent-foreground font-bold gap-2 px-8"
              >
                Explore Suggestion <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6">
            {progressItems.slice(0, 4).map((item) => (
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
          </div>
        </div>

        <div className="space-y-6">
          <div onClick={() => setView('health')} className="cursor-pointer">
            <HealthScoreCard />
          </div>
          <div className="grid grid-cols-1 gap-6">
            {progressItems.slice(4).map((item) => (
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
                <h4 className="text-lg font-headline font-semibold mb-1">{item.label}</h4>
                <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center text-accent text-[10px] font-bold uppercase tracking-widest">
                  Explore <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            ))}
          </div>
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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { state, setRole, isHydrated } = useStartup();

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    setActiveWorkspace('dashboard');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'My Ventures', icon: <Library className="w-4 h-4" /> },
    { id: 'health', label: 'Venture Health', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
    { id: 'brain', label: 'Startup Brain', icon: <Brain className="w-4 h-4 text-accent" /> },
    { id: 'workspace', label: 'Turbo Workspace', icon: <Zap className="w-4 h-4 text-accent" /> },
    { id: 'validation', label: 'Idea Validation', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'blueprint', label: 'Strategy Blueprint', icon: <Map className="w-4 h-4" /> },
    { id: 'finance', label: 'Financial Plan', icon: <DollarSign className="w-4 h-4 text-emerald-400" /> },
    { id: 'product', label: 'Product Dev', icon: <Code2 className="w-4 h-4" /> },
    { id: 'marketing', label: 'Growth Plan', icon: <Rocket className="w-4 h-4" /> },
    { id: 'tasks', label: 'Accountability', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'simulation', label: 'Simulations', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'decisions', label: 'Decision Hub', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'persona-workspace', label: 'Executive Studio', icon: <Terminal className="w-4 h-4 text-accent" /> },
  ];

  const activeNavItem = useMemo(() => 
    navItems.find(item => item.id === activeWorkspace) || navItems[0], 
  [activeWorkspace]);

  const sidebarSubtitle = useMemo(() => {
    if (!state.rawIdea && state.stage === 'Idea Stage' && state.role === 'AI Product Manager') {
      return "Working AI Founder for You";
    }

    const stageMap: Record<StartupStage, string> = {
      'Idea Stage': "Helping shape your idea",
      'Validation Stage': "Validating your idea",
      'MVP Development': "Building your startup product",
      'Early Traction': "Driving early user growth",
      'Growth Stage': "Scaling your startup",
      'Scaling Stage': "Optimizing operations",
    };

    const roleMap: Record<StartupRole, string> = {
      'AI CTO': "AI CTO building tech",
      'AI CMO': "AI CMO growing brand",
      'AI CFO': "AI CFO managing finance",
      'AI Product Manager': "AI PM shaping product",
      'AI Growth Hacker': "AI Growth Hacker driving growth",
    };

    const defaultRoles: Record<StartupStage, StartupRole> = {
      'Idea Stage': 'AI Product Manager',
      'Validation Stage': 'AI CMO',
      'MVP Development': 'AI CTO',
      'Early Traction': 'AI Growth Hacker',
      'Growth Stage': 'AI CMO',
      'Scaling Stage': 'AI CFO'
    };

    if (state.role !== defaultRoles[state.stage]) {
      return roleMap[state.role];
    }

    return stageMap[state.stage];
  }, [state.stage, state.role, state.rawIdea]);

  if (!isHydrated) {
    return (
      <div className="h-svh w-full flex flex-col items-center justify-center bg-[#16181C] space-y-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
          <AIFounderLogo className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent animate-pulse">Restoring Workspace...</span>
      </div>
    );
  }

  const renderView = () => {
    switch(activeWorkspace) {
      case 'projects': return <ProjectListView onSelect={() => setActiveWorkspace('dashboard')} onAuthPrompt={() => setAuthModalOpen(true)} />;
      case 'dashboard': return <DashboardContent setView={setActiveWorkspace} />;
      case 'health': return <HealthScoreView />;
      case 'brain': return <StartupBrainView />;
      case 'validation': return <IdeaValidationView onComplete={() => setActiveWorkspace('blueprint')} />;
      case 'blueprint': return <BlueprintView onComplete={() => setActiveWorkspace('finance')} />;
      case 'finance': return <FinancialView onComplete={() => setActiveWorkspace('product')} />;
      case 'product': return <ProductGuideView onComplete={() => setActiveWorkspace('marketing')} />;
      case 'marketing': return <MarketingView onComplete={() => setActiveWorkspace('tasks')} />;
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
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <AIFounderLogo className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-headline font-bold text-lg leading-none uppercase tracking-tighter">AI Founder</span>
              <div className="mt-1">
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-[8px] px-1.5 py-0 h-4 font-bold uppercase tracking-tight whitespace-nowrap">
                  {sidebarSubtitle}
                </Badge>
              </div>
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
                      onClick={() => {
                        setRole(role.id);
                        setActiveWorkspace('persona-workspace');
                      }}
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
          
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <HelpCenter>
                    <SidebarMenuButton tooltip="Startup Guide" className="hover:bg-white/5 text-muted-foreground hover:text-accent">
                      <HelpCircle className="w-4 h-4" />
                      <span className="font-medium">Startup Guide</span>
                    </SidebarMenuButton>
                  </HelpCenter>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-white/5">
          {user ? (
            <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:flex-col">
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden overflow-hidden">
                <Avatar className="w-8 h-8 border border-accent/20">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="bg-accent/20 text-accent text-[10px] font-bold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold truncate">{user.displayName || 'Founder'}</span>
                  <span className="text-[10px] text-muted-foreground truncate">Venture Lead</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <Button onClick={() => setAuthModalOpen(true)} className="w-full bg-accent text-accent-foreground font-bold gap-2 group-data-[collapsible=icon]:p-0">
                <LogIn className="w-4 h-4" />
                <span className="group-data-[collapsible=icon]:hidden">Sign In</span>
              </Button>
              <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
            </>
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

          <div className="flex-1 flex justify-end items-center gap-2">
            {state.healthScore && (
              <div 
                onClick={() => setActiveWorkspace('health')}
                className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-2 py-1 rounded-md transition-colors"
              >
                <Badge variant="outline" className={cn(
                  "border-accent/30 text-xs gap-1.5",
                  state.healthScore.totalScore > 75 ? "text-emerald-400 border-emerald-400/30" : 
                  state.healthScore.totalScore > 40 ? "text-accent" : "text-rose-400 border-rose-400/30"
                )}>
                  <ShieldCheck className="w-3 h-3" /> {state.healthScore.totalScore}
                </Badge>
              </div>
            )}
            <NotificationCenter onNavigate={(view) => setActiveWorkspace(view)} />
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium ml-2">
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
