
"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AIFounderLogo } from '@/components/ui/logo';
import { 
  Users2, 
  Brain, 
  Wrench, 
  PlayCircle, 
  Bell, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Zap,
  Menu,
  X,
  Mail,
  Send,
  Globe,
  Check,
  Code2,
  Target,
  Lock,
  Lightbulb,
  Map,
  ChevronRight,
  Info
} from 'lucide-react';
import { AuthModal } from '@/components/auth/auth-modal';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await addDoc(collection(firestore, 'feedback'), {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        type: 'landing_contact',
        userId: user?.uid || 'guest',
        timestamp: serverTimestamp(),
      });
      
      toast({
        title: "Message Sent",
        description: "We've received your inquiry.",
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Failed to send message.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const NavLinks = () => (
    <>
      <button onClick={() => scrollTo('about')} className="text-sm font-bold text-muted-foreground hover:text-white transition-colors py-2 text-left lg:py-0">About</button>
      <button onClick={() => scrollTo('features')} className="text-sm font-bold text-muted-foreground hover:text-white transition-colors py-2 text-left lg:py-0">Features</button>
      <button onClick={() => scrollTo('how-it-works')} className="text-sm font-bold text-muted-foreground hover:text-white transition-colors py-2 text-left lg:py-0">How It Works</button>
      <button onClick={() => scrollTo('pricing')} className="text-sm font-bold text-muted-foreground hover:text-white transition-colors py-2 text-left lg:py-0">Pricing</button>
      <button onClick={() => scrollTo('contact')} className="text-sm font-bold text-muted-foreground hover:text-white transition-colors py-2 text-left lg:py-0">Contact</button>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0A0C10] overflow-x-hidden flex flex-col selection:bg-accent selection:text-accent-foreground">
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#0A0C10]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <AIFounderLogo className="w-5 h-5 text-white" />
            </div>
            <span className="font-headline font-bold text-base sm:text-lg tracking-tight uppercase text-white">AI Founder</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <NavLinks />
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" className="text-sm font-bold text-muted-foreground hover:text-white hidden sm:flex" onClick={() => setAuthOpen(true)}>Sign In</Button>
            <Button className="bg-primary hover:bg-primary/90 font-bold px-4 sm:px-6 shadow-lg shadow-primary/20 text-xs sm:text-sm" onClick={() => setAuthOpen(true)}>Get Started</Button>
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-white">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0A0C10] border-white/5 text-white">
                <SheetHeader className="text-left">
                  <SheetTitle className="text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                      <AIFounderLogo className="w-4 h-4 text-white" />
                    </div>
                    AI Founder
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <NavLinks />
                  <Separator className="bg-white/5 my-2" />
                  <Button variant="outline" className="w-full border-white/10" onClick={() => setAuthOpen(true)}>Sign In</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-48 pb-20 sm:pb-32 px-4 sm:px-6 z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-10">
          <div className="inline-flex items-center justify-center px-3 sm:px-4 py-1 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm">
            <span className="text-accent text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> An AI Partner for Entrepreneurs
            </span>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-headline font-bold tracking-tight text-white">
              AI Founder
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              Build your startup from idea to execution with the intelligence of a full AI-powered executive team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
            <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-10 text-sm sm:text-base font-bold bg-primary hover:bg-primary/90 gap-2 group shadow-xl shadow-primary/20" onClick={() => setAuthOpen(true)}>
              Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-10 text-sm sm:text-base font-bold border-white/10 bg-white/5 hover:bg-white/10" onClick={onStart}>
              Try Without Login
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-16 sm:py-24 px-4 sm:px-6 z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
          <div className="text-center space-y-4 sm:space-y-6">
            <h2 className="text-3xl sm:text-5xl font-headline font-bold text-white">What is AI Founder?</h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              AI Founder is an AI-powered co-founder system designed to help you build startups step by step. It combines strategy, product development, marketing, and financial planning into one intelligent workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <h3 className="text-xl font-headline font-bold text-white">Our Mission</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To make startup building accessible to everyone, regardless of background, by providing access to intelligent tools that simulate a full executive team.
              </p>
            </div>
            <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <h3 className="text-xl font-headline font-bold text-white">Our Vision</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To become the operating system for future entrepreneurs, where building a startup is no longer limited by knowledge or technical skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative py-16 sm:py-24 px-4 sm:px-6 z-10 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-headline font-bold text-white">Platform Capabilities</h2>
            <p className="text-muted-foreground text-base sm:text-lg">Everything you need to architect a high-growth venture.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: "AI Personas", desc: "Work with specialized AI roles like CTO, CMO, CFO, and Growth Hacker.", icon: <Users2 className="text-accent" /> },
              { title: "Startup Brain", desc: "A centralized, persistent memory system that stores your venture’s key data.", icon: <Brain className="text-accent" /> },
              { title: "Venture Studio", desc: "A structured, step-by-step environment to build your startup from idea to execution.", icon: <Wrench className="text-accent" /> },
              { title: "Code Generation", desc: "Generate technical architecture and production-grade code for your product MVP.", icon: <Code2 className="text-accent" /> },
              { title: "Startup Simulations", desc: "Test your startup with investor scenarios, user feedback, and market reactions.", icon: <PlayCircle className="text-accent" /> },
              { title: "AI Suggestions", desc: "Get smart, proactive recommendations to improve your startup in real-time.", icon: <Bell className="text-accent" /> },
              { title: "Health Score", desc: "Track how strong your startup foundation is across 4 key dimensions.", icon: <ShieldCheck className="text-accent" /> }
            ].map((f, i) => (
              <div key={i} className="group glass-card p-6 sm:p-8 rounded-2xl border-white/5 hover:border-accent/30 transition-all duration-500">
                <div className="space-y-4 sm:space-y-6">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                    {React.cloneElement(f.icon as React.ReactElement, { className: "w-5 h-5" })}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-headline font-bold text-white">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative py-16 sm:py-24 px-4 sm:px-6 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-headline font-bold text-white">The Path to Exit</h2>
            <p className="text-muted-foreground text-base sm:text-lg">A simple 5-step journey from idea to scale.</p>
          </div>

          <div className="space-y-8 sm:space-y-10">
            {[
              { step: "01", title: "Enter your idea", desc: "Pitch your core concept. No detail is too small." },
              { step: "02", title: "AI analyzes and stores it", desc: "Your idea is integrated into the Startup Brain memory layer." },
              { step: "03", title: "Personas generate strategies", desc: "Your CTO, CMO, and CFO deliver custom roadmaps and financial models." },
              { step: "04", title: "Build and execute", desc: "Use the generated assets to build your MVP and growth loops." },
              { step: "05", title: "Continue and scale", desc: "Refine your health score and keep building toward exit." }
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-4 sm:gap-6 group">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-primary/10 text-accent flex items-center justify-center font-headline font-bold shrink-0 group-hover:bg-primary group-hover:text-white transition-colors text-sm sm:text-base">
                  {s.step}
                </div>
                <div className="pt-1 sm:pt-1.5 space-y-1">
                  <h3 className="text-lg sm:text-xl font-headline font-bold text-white">{s.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-16 sm:py-24 px-4 sm:px-6 z-10 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-headline font-bold text-white">Venture Access</h2>
            <p className="text-muted-foreground text-base sm:text-lg">Start for free, upgrade when you're ready to build for real.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <Card className="glass-card border-white/10 p-6 sm:p-8 flex flex-col rounded-2xl">
              <div className="space-y-4 mb-6 sm:mb-8">
                <Badge variant="outline" className="border-white/20 uppercase tracking-widest text-[8px] sm:text-[10px]">Free Mode</Badge>
                <h3 className="text-xl sm:text-2xl font-headline font-bold text-white">Venture Experiment</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Perfect for exploring ideas and testing viability.</p>
                <div className="text-2xl sm:text-3xl font-bold text-white">$0<span className="text-sm text-muted-foreground font-normal"> / forever</span></div>
              </div>
              <ul className="space-y-3 sm:space-y-4 flex-1 mb-6 sm:mb-8">
                {["Access Venture Studio", "Use AI Personas", "Generate Strategies", "No persistent saving"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                    <Check className={cn("w-4 h-4", i < 3 ? "text-emerald-400" : "text-white/10")} />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full font-bold h-10 sm:h-12" onClick={onStart}>Start Experiment</Button>
            </Card>

            <Card className="glass-card border-accent/30 bg-accent/5 p-6 sm:p-8 flex flex-col relative overflow-hidden rounded-2xl">
              <div className="space-y-4 mb-6 sm:mb-8">
                <Badge className="bg-accent text-accent-foreground uppercase tracking-widest text-[8px] sm:text-[10px]">Recommended</Badge>
                <h3 className="text-xl sm:text-2xl font-headline font-bold text-white">Founder Cloud</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Everything you need to execute and scale.</p>
                <div className="text-2xl sm:text-3xl font-bold text-white">$29<span className="text-sm text-muted-foreground font-normal"> / mo</span></div>
              </div>
              <ul className="space-y-3 sm:space-y-4 flex-1 mb-6 sm:mb-8">
                {["Save Unlimited Ventures", "Full AI Executive Access", "Access Startup Brain", "GitHub Integrations"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-white">
                    <Check className="w-4 h-4 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 font-bold h-10 sm:h-12" onClick={() => setAuthOpen(true)}>Upgrade to Pro</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Help & FAQ */}
      <section id="help" className="relative py-16 sm:py-24 px-4 sm:px-6 z-10">
        <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-headline font-bold text-white">How to Use</h2>
            <p className="text-muted-foreground text-base sm:text-lg">Master the platform in minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              { title: "Create a startup", icon: <Lightbulb />, desc: "Use the validation tool to pitch your first idea." },
              { title: "Use AI personas", icon: <Users2 />, desc: "Switch roles in the sidebar to get different perspectives." },
              { title: "Generate strategies", icon: <Map />, desc: "Ask the board for blueprints and plans." },
              { title: "Save and continue", icon: <Lock />, desc: "Log in to sync your Venture Archive to the cloud." }
            ].map((g, i) => (
              <div key={i} className="p-5 sm:p-6 rounded-xl bg-white/5 border border-white/5 flex gap-4">
                <div className="p-3 rounded-lg bg-white/5 text-accent shrink-0 h-fit">
                  {React.cloneElement(g.icon as React.ReactElement, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">{g.title}</h4>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6 sm:space-y-8 pt-8 sm:pt-12 border-t border-white/5">
            <h3 className="text-xl sm:text-2xl font-headline font-bold text-center text-white">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full space-y-2">
              <AccordionItem value="item-1" className="border-white/5">
                <AccordionTrigger className="hover:no-underline font-bold text-white text-xs sm:text-sm">Do I need to log in?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-[11px] sm:text-xs">
                  No, you can start in "Experiment Mode" immediately. However, login is required to save progress permanently.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-white/5">
                <AccordionTrigger className="hover:no-underline font-bold text-white text-xs sm:text-sm">How do I save my work?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-[11px] sm:text-xs">
                  Once you sign in, any active experiment is automatically synchronized to your Founder Cloud account.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Community */}
      <section id="community" className="relative py-16 sm:py-24 px-4 sm:px-6 z-10 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-3xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Users2 className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-headline font-bold text-white">Founder Community</h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Join a growing network of builders and entrepreneurs. Share ideas, learn from others, and collaborate on the next big thing.
          </p>
          <div className="pt-4">
            <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-widest text-[8px] sm:text-[10px] px-4 py-1">Community Features Coming Soon</Badge>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative py-16 sm:py-24 px-4 sm:px-6 z-10">
        <div className="max-w-xl mx-auto space-y-10 sm:space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-headline font-bold text-white">Contact & Feedback</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Have feedback or issues? We'd love to hear from you.</p>
          </div>

          <Card className="glass-card p-6 sm:p-8 rounded-2xl border-white/10">
            <form onSubmit={handleContactSubmit} className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Full Name</Label>
                <Input id="name" name="name" placeholder="Founder Name" required className="bg-white/5 border-white/10 h-10 sm:h-12 text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="name@startup.com" required className="bg-white/5 border-white/10 h-10 sm:h-12 text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Message</Label>
                <Textarea id="message" name="message" placeholder="Share your ideas, feedback, or issues with us." required className="min-h-[100px] sm:min-h-[120px] bg-white/5 border-white/10 resize-none text-sm" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 font-bold gap-2 text-sm">
                {isSubmitting ? <Sparkles className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Agentic AI Section */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-headline font-bold text-white">How Our Agentic AI Works</h2>
          </div>
          <div className="space-y-6 text-center max-w-3xl mx-auto">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              AI Founder is powered by an agentic AI system where multiple specialized agents collaborate to execute tasks like a real startup team. Each agent is responsible for a specific function—such as product planning, technical development, marketing strategy, or financial analysis.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Instead of working independently, these agents are connected through a shared intelligence layer. When a user provides an idea, the system breaks it down into structured tasks and assigns them to the appropriate agents. Each agent processes its part, passes the output forward, and builds on previous decisions. This creates a continuous workflow where ideas evolve into structured plans, and plans turn into execution.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              The system also maintains a persistent memory, ensuring that all agents remain aligned with the startup’s context, goals, and progress. Rather than reacting to single inputs, the system actively coordinates, updates, and suggests next steps—making it a working system, not just a response-based tool.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 border-t border-white/5 bg-[#0A0C10]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 sm:gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <AIFounderLogo className="w-4 h-4 text-white" />
              </div>
              <span className="font-headline font-bold text-sm sm:text-base tracking-tight uppercase text-white">AI Founder</span>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed max-w-xs">
              Empowering innovators with the intelligence of a full executive team. Built for founders, creators, and students.
            </p>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-bold text-[10px] uppercase tracking-widest text-accent">Legal</h5>
            <ul className="space-y-2">
              {["Terms", "Privacy", "Cookies"].map((l, i) => (
                <li key={i}>
                  <button className="text-[11px] sm:text-xs text-muted-foreground hover:text-white transition-colors">{l}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-bold text-[10px] uppercase tracking-widest text-accent">Connect</h5>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "GitHub"].map((s, i) => (
                <a key={i} href="#" className="text-[10px] font-bold text-muted-foreground hover:text-accent transition-colors uppercase tracking-widest">{s}</a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-12 sm:pt-16 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 mt-12 sm:mt-16">
          <p className="text-[10px] text-muted-foreground/50 italic text-center md:text-left">© 2026 AI Founder Venture Studio. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/30 font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" /> Secure Cloud Infrastructure
          </div>
        </div>
      </footer>
    </div>
  );
}
