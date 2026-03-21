"use client"

import React, { useState } from 'react';
import Image from 'next/image';
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
  ChevronRight,
  ShieldAlert,
  Network,
  Mail,
  Send,
  HelpCircle,
  MessageSquare,
  Globe,
  Check,
  Code2,
  Terminal,
  Target,
  TrendingUp,
  Banknote,
  Box,
  FastForward,
  Lock,
  Lightbulb,
  Heart,
  Info,
  Map
} from 'lucide-react';
import { AuthModal } from '@/components/auth/auth-modal';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const networkImage = PlaceHolderImages.find(img => img.id === 'agent-network');

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
        description: "We've received your inquiry and will respond within 24-48 hours.",
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Failed to send message. Please try again later.",
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

  return (
    <div className="min-h-screen bg-[#0A0C10] overflow-x-hidden flex flex-col selection:bg-accent selection:text-accent-foreground">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 landing-accent-pink opacity-20" />
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#0A0C10]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <AIFounderLogo className="w-6 h-6 text-white" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight uppercase text-white hidden sm:block">AI Founder</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollTo('about')} className="text-sm font-bold text-muted-foreground hover:text-white transition-colors">About</button>
            <button onClick={() => scrollTo('features')} className="text-sm font-bold text-muted-foreground hover:text-white transition-colors">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-sm font-bold text-muted-foreground hover:text-white transition-colors">How It Works</button>
            <button onClick={() => scrollTo('pricing')} className="text-sm font-bold text-muted-foreground hover:text-white transition-colors">Pricing</button>
            <button onClick={() => scrollTo('help')} className="text-sm font-bold text-muted-foreground hover:text-white transition-colors">Help</button>
            <button onClick={() => scrollTo('contact')} className="text-sm font-bold text-muted-foreground hover:text-white transition-colors">Contact</button>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-sm font-bold text-muted-foreground hover:text-white hidden sm:flex" onClick={() => setAuthOpen(true)}>Sign In</Button>
            <Button className="bg-primary hover:bg-primary/90 font-bold px-6 shadow-lg shadow-primary/20" onClick={() => setAuthOpen(true)}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-24 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="relative flex flex-col items-center justify-center space-y-12 mb-8">
            <div className="relative group cursor-default">
              <div className="absolute inset-0 bg-blue-500/20 rounded-[2.5rem] blur-2xl group-hover:bg-blue-400/30 transition-all duration-700 animate-pulse-glow" />
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-[2.5rem] bg-gradient-to-br from-[#2DBEDE] via-[#1A55B3] to-[#1A55B3] flex items-center justify-center shadow-2xl border border-white/10 transition-transform duration-500 hover:scale-105">
                <AIFounderLogo className="w-20 h-20 md:w-24 md:h-24 text-white drop-shadow-lg" />
              </div>
            </div>

            <div className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-teal-500/30 bg-teal-500/5 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="text-teal-400 text-sm font-bold uppercase tracking-[0.25em]">
                An AI Partner for Entrepreneurs
              </span>
            </div>
          </div>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tight">
              AI Founder
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Empowering innovators with the intelligence of a full executive team. Build your startup from idea to execution with structured AI guidance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <Button size="lg" className="h-16 px-10 text-lg font-bold bg-primary hover:bg-primary/90 gap-2 shadow-xl shadow-primary/20 group" onClick={() => setAuthOpen(true)}>
              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold border-white/10 bg-white/5 hover:bg-white/10" onClick={onStart}>
              Try Without Login
            </Button>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="relative py-32 px-6 z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="bg-primary/5 text-accent border-accent/20 px-4 py-1 uppercase tracking-widest text-[10px] font-bold">Venture Vision</Badge>
            <h2 className="text-4xl md:text-6xl font-headline font-bold">What is AI Founder?</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              AI Founder is an AI-powered co-founder system designed to help you build startups step by step. It combines strategy, product development, marketing, and financial planning into one intelligent workspace.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-[2rem] bg-white/2 border border-white/5 space-y-4 hover:border-accent/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-headline font-bold">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To make startup building accessible to everyone, regardless of technical background or financial resources.
              </p>
            </div>
            <div className="p-8 rounded-[2rem] bg-white/2 border border-white/5 space-y-4 hover:border-pink-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-headline font-bold">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become the operating system for future entrepreneurs, where every idea has a path to reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="relative py-32 px-6 z-10 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-headline font-bold">Platform Capabilities</h2>
            <p className="text-muted-foreground text-lg">A comprehensive suite of tools to architect your high-growth venture.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "AI Personas", desc: "Work with specialized AI roles like CTO, CMO, CFO, and Growth Hacker.", icon: <Users2 className="text-pink-400" />, color: "from-pink-500/20 to-transparent" },
              { title: "Startup Brain", desc: "A centralized, persistent memory system that stores your venture’s key data.", icon: <Brain className="text-accent" />, color: "from-accent/20 to-transparent" },
              { title: "Venture Studio", desc: "A structured, step-by-step environment to build your startup from idea to execution.", icon: <Wrench className="text-blue-400" />, color: "from-blue-500/20 to-transparent" },
              { title: "Code Generation", desc: "Generate technical architecture and production-grade code for your product MVP.", icon: <Code2 className="text-orange-400" />, color: "from-orange-500/20 to-transparent" },
              { title: "Startup Simulations", desc: "Test your startup with investor scenarios, user feedback, and market reactions.", icon: <PlayCircle className="text-emerald-400" />, color: "from-emerald-500/20 to-transparent" },
              { title: "AI Suggestions", desc: "Get smart, proactive recommendations to improve your startup in real-time.", icon: <Bell className="text-amber-400" />, color: "from-amber-500/20 to-transparent" },
              { title: "Startup Health Score", desc: "Track how strong your startup foundation is across 4 key dimensions.", icon: <ShieldCheck className="text-indigo-400" />, color: "from-indigo-500/20 to-transparent" }
            ].map((f, i) => (
              <div key={i} className="group glass-card p-8 rounded-[2rem] border-white/5 hover:border-accent/30 transition-all duration-500 cursor-default relative overflow-hidden">
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", f.color)} />
                <div className="relative z-10 space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    {React.cloneElement(f.icon as React.ReactElement, { className: "w-6 h-6 " + (f.icon as any).props.className })}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-headline font-bold">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="relative py-32 px-6 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-6xl font-headline font-bold">The Path to Exit</h2>
            <p className="text-muted-foreground text-lg">Five steps from your raw idea to a scalable startup.</p>
          </div>

          <div className="space-y-12 relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
            
            {[
              { step: "01", title: "Enter your idea", desc: "Pitch your core concept to the platform. No detail is too small.", icon: <Lightbulb /> },
              { step: "02", title: "AI analyzes and stores it", desc: "Your idea is processed and integrated into the Startup Brain memory layer.", icon: <Brain /> },
              { step: "03", title: "Personas generate strategies", desc: "Your CTO, CMO, and CFO deliver custom roadmaps, tech stacks, and financial models.", icon: <Users2 /> },
              { step: "04", title: "Build product, marketing, and finance", desc: "Use the generated assets to execute on your MVP and growth loops.", icon: <Zap /> },
              { step: "05", title: "Continue and scale your startup", desc: "Refine your health score, run simulations, and keep building toward exit.", icon: <TrendingUp /> }
            ].map((s, i) => (
              <div key={i} className="flex flex-col md:flex-row items-start gap-8 relative group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-accent flex items-center justify-center font-headline font-bold text-xl shrink-0 z-10 group-hover:bg-primary group-hover:text-white transition-colors">
                  {s.step}
                </div>
                <div className="pt-2 space-y-2">
                  <h3 className="text-2xl font-headline font-bold flex items-center gap-3">
                    {s.title}
                    {React.cloneElement(s.icon as React.ReactElement, { className: "w-5 h-5 text-accent/50" })}
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-2xl">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="relative py-32 px-6 z-10 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-headline font-bold">Venture Access</h2>
            <p className="text-xl text-muted-foreground">Start for free, upgrade when you're ready to build for real.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-card border-white/10 p-8 flex flex-col rounded-[2.5rem]">
              <div className="space-y-4 mb-8">
                <Badge variant="outline" className="border-white/20">Free Mode</Badge>
                <h3 className="text-3xl font-headline font-bold">Venture Experiment</h3>
                <p className="text-sm text-muted-foreground">Perfect for exploring ideas and testing viability.</p>
                <div className="text-4xl font-bold">$0<span className="text-sm text-muted-foreground font-normal"> / forever</span></div>
              </div>
              <ul className="space-y-4 flex-1 mb-8">
                {[
                  "Access Venture Studio",
                  "Use all AI Personas",
                  "Generate Startup Strategies",
                  "No persistent saving",
                  "Limited usage tiers"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    {i < 3 ? <Check className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-muted-foreground/30" />}
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full h-14 font-bold rounded-xl" onClick={onStart}>Start Experiment</Button>
            </Card>

            <Card className="glass-card border-accent/30 bg-accent/5 p-8 flex flex-col relative overflow-hidden rounded-[2.5rem]">
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">Recommended</div>
              <div className="space-y-4 mb-8">
                <Badge className="bg-accent text-accent-foreground">Pro Mode</Badge>
                <h3 className="text-3xl font-headline font-bold">Founder Cloud</h3>
                <p className="text-sm text-muted-foreground">Everything you need to execute and scale.</p>
                <div className="text-4xl font-bold">$29<span className="text-sm text-muted-foreground font-normal"> / month</span></div>
              </div>
              <ul className="space-y-4 flex-1 mb-8">
                {[
                  "Save Unlimited Ventures",
                  "Full AI Executive Access",
                  "Access Startup Brain Memory",
                  "Export Strategies & Assets",
                  "GitHub & External Integrations"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full h-14 bg-primary hover:bg-primary/90 font-bold rounded-xl" onClick={() => setAuthOpen(true)}>Upgrade to Pro</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. HELP SECTION */}
      <section id="help" className="relative py-32 px-6 z-10">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-headline font-bold">How to Use</h2>
            <p className="text-xl text-muted-foreground">Master the AI Founder platform in minutes.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Create a startup", icon: <Lightbulb />, desc: "Use the validation tool to pitch your first idea." },
              { title: "Use AI personas", icon: <Users2 />, desc: "Switch roles in the sidebar to get different perspectives." },
              { title: "Generate strategies", icon: <Map />, desc: "Ask the board for blueprints, marketing plans, and tech stacks." },
              { title: "Save and continue", icon: <Lock />, desc: "Log in to ensure your Venture Archive is synced to the cloud." }
            ].map((g, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 flex gap-4">
                <div className="p-3 rounded-xl bg-white/5 text-accent shrink-0 h-fit">{g.icon}</div>
                <div className="space-y-1">
                  <h4 className="font-bold">{g.title}</h4>
                  <p className="text-sm text-muted-foreground">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-8 pt-12 border-t border-white/5">
            <h3 className="text-3xl font-headline font-bold text-center">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border-white/5">
                <AccordionTrigger className="hover:no-underline font-bold">Do I need to log in?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  No, you can start in "Experiment Mode" immediately. However, login is required to save your progress permanently and access your ventures from other devices.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-white/5">
                <AccordionTrigger className="hover:no-underline font-bold">How do I save my work?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Once you sign in, any active experiment is automatically synchronized to your Founder Cloud account and stored securely in Firestore.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* 7. COMMUNITY SECTION */}
      <section id="community" className="relative py-32 px-6 z-10 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto text-accent mb-8">
            <Globe className="w-10 h-10" />
          </div>
          <h2 className="text-4xl md:text-6xl font-headline font-bold">Community</h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Join a growing community of founders and builders. Share startup ideas, learn from others, and collaborate on world-changing ventures.
          </p>
          <div className="p-12 rounded-[3rem] border border-dashed border-white/10 bg-white/2 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-accent/10 text-accent px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">Planned</div>
            <h3 className="text-2xl font-headline font-bold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">We are building dedicated founder groups, strategy discussion boards, and investor matching features.</p>
          </div>
        </div>
      </section>

      {/* 8. CONTACT SECTION */}
      <section id="contact" className="relative py-32 px-6 z-10">
        <div className="max-w-xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-headline font-bold">Contact & Feedback</h2>
            <p className="text-lg text-muted-foreground">Have feedback, ideas, or issues? We'd love to hear from you.</p>
          </div>

          <Card className="glass-card p-8 rounded-[2.5rem] border-white/10">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="Founder Name" required className="bg-white/5 border-white/10 h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="name@startup.com" required className="bg-white/5 border-white/10 h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Share your ideas, feedback, or issues with us." required className="min-h-[150px] bg-white/5 border-white/10 resize-none" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-primary hover:bg-primary/90 font-bold gap-2 rounded-xl">
                {isSubmitting ? <Sparkles className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                Send Message
              </Button>
              <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Typical response time: 24–48 hours</p>
            </form>
          </Card>
        </div>
      </section>

      {/* 9. LEGAL SECTION & FOOTER */}
      <footer className="relative z-10 py-20 px-6 border-t border-white/5 bg-[#0A0C10]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <AIFounderLogo className="w-4 h-4 text-white" />
              </div>
              <span className="font-headline font-bold text-lg tracking-tight uppercase text-white">AI Founder</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Empowering innovators with the intelligence of a full executive team. Built for founders, creators, and students.
            </p>
          </div>
          
          <div className="space-y-6">
            <h5 className="font-bold text-xs uppercase tracking-widest text-accent">Legal</h5>
            <ul className="space-y-4">
              {["Terms", "Privacy", "Cookies"].map((l, i) => (
                <li key={i}>
                  <button className="text-sm text-muted-foreground hover:text-white transition-colors">{l}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="font-bold text-xs uppercase tracking-widest text-accent">Connect</h5>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "GitHub"].map((s, i) => (
                <a key={i} href="#" className="text-xs font-bold text-muted-foreground hover:text-accent transition-colors uppercase tracking-widest">{s}</a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-20 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 mt-20">
          <p className="text-xs text-muted-foreground/50 italic">© 2026 AI Founder Venture Studio. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/30">
            <ShieldCheck className="w-3 h-3" /> Secure Cloud Infrastructure
          </div>
        </div>
      </footer>
    </div>
  );
}
