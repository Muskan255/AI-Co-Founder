
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
  Network
} from 'lucide-react';
import { AuthModal } from '@/components/auth/auth-modal';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [authOpen, setAuthOpen] = useState(false);

  const networkImage = PlaceHolderImages.find(img => img.id === 'agent-network');

  const features = [
    {
      title: "AI Personas",
      description: "Work with AI CTO, CMO, CFO, and Growth Hacker co-founders.",
      icon: <Users2 className="w-6 h-6 text-pink-400" />,
      color: "from-pink-500/20 to-transparent"
    },
    {
      title: "Startup Brain",
      description: "Your venture memory that keeps everything organized and context-aware.",
      icon: <Brain className="w-6 h-6 text-accent" />,
      color: "from-accent/20 to-transparent"
    },
    {
      title: "Venture Studio",
      description: "Build strategy blueprints, product roadmaps, and detailed growth plans.",
      icon: <Wrench className="w-6 h-6 text-blue-400" />,
      color: "from-blue-500/20 to-transparent"
    },
    {
      title: "Startup Simulations",
      description: "Test your startup with real-world scenarios and data projections.",
      icon: <PlayCircle className="w-6 h-6 text-emerald-400" />,
      color: "from-emerald-500/20 to-transparent"
    },
    {
      title: "AI Suggestions",
      description: "Get smart recommendations to improve your startup in real-time.",
      icon: <Bell className="w-6 h-6 text-amber-400" />,
      color: "from-amber-500/20 to-transparent"
    },
    {
      title: "Startup Health Score",
      description: "Track how strong your startup foundation is across 4 dimensions.",
      icon: <ShieldCheck className="w-6 h-6 text-indigo-400" />,
      color: "from-indigo-500/20 to-transparent"
    }
  ];

  const steps = [
    { id: "01", title: "Enter Startup Idea", desc: "Share your vision with the platform." },
    { id: "02", title: "Use AI Co-Founders", desc: "Consult with specialized executive personas." },
    { id: "03", title: "Generate Strategy", desc: "Create blueprints and financial models." },
    { id: "04", title: "Refine & Iterate", desc: "Run simulations and improve your health score." },
    { id: "05", title: "Save & Execute", desc: "Sync to cloud and start building for real." }
  ];

  return (
    <div className="min-h-screen bg-[#0A0C10] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 landing-accent-pink" />
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-[#0A0C10]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <AIFounderLogo className="w-6 h-6 text-white" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight uppercase">AI Founder</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-sm font-bold text-muted-foreground hover:text-white" onClick={() => setAuthOpen(true)}>Sign In</Button>
            <Button className="bg-primary hover:bg-primary/90 font-bold px-6" onClick={() => setAuthOpen(true)}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Animated Logo */}
          <div className="relative inline-block animate-float">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" />
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-accent/20 border border-white/10">
              <AIFounderLogo className="w-16 h-16 md:w-20 md:h-20 text-white" />
            </div>
          </div>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 px-4 py-1.5 font-bold uppercase tracking-[0.2em] text-[10px]">
              An AI Partner for Entrepreneurs
            </Badge>
            <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tight">
              Build Your Startup <br />
              <span className="gradient-text">From Idea to Exit</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Execution is the only differentiator. Build your venture with an AI Co-Founder that handles strategy, product, marketing, and growth.
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

          <div className="pt-12 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
            Built for founders, students, and innovators
          </div>
        </div>
      </section>

      {/* Synergy Illustration Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-[3rem] p-1 border-accent/20 bg-accent/5 overflow-hidden">
            <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-[2.9rem] overflow-hidden">
              {networkImage && (
                <Image 
                  src={networkImage.imageUrl} 
                  alt={networkImage.description} 
                  fill 
                  className="object-cover opacity-60 mix-blend-screen"
                  data-ai-hint={networkImage.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="p-3 rounded-2xl bg-accent/20 backdrop-blur-xl border border-accent/30 text-accent">
                  <Network className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-5xl font-headline font-bold text-white">The Executive Network</h2>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  A multi-agent intelligence layer where specialized co-founders collaborate in real-time to solve your most complex startup challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-headline font-bold">Comprehensive Venture Studio</h2>
            <p className="text-muted-foreground text-lg">Everything you need to architect a high-growth startup.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="group glass-card p-8 rounded-3xl border-white/5 hover:border-accent/30 transition-all duration-500 cursor-default relative overflow-hidden">
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", f.color)} />
                <div className="relative z-10 space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    {f.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-headline font-bold">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-accent border-accent/20">The Process</Badge>
            <h2 className="text-4xl font-headline font-bold">5 Steps to Launch</h2>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="space-y-6 relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 right-[-20%] w-full h-px bg-gradient-to-r from-accent/20 to-transparent" />
                )}
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold font-code">
                  {s.id}
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-lg">{s.title}</h4>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40 px-6">
        <div className="max-w-4xl mx-auto glass-card p-16 rounded-[3rem] text-center space-y-10 border-accent/20 bg-accent/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="space-y-4">
            <h2 className="text-5xl font-headline font-bold">Start Building Your <br />Startup Today</h2>
            <p className="text-xl text-muted-foreground">Join the next generation of AI-driven founders.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-16 px-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30" onClick={() => setAuthOpen(true)}>
              Get Started Now
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-12 text-lg font-bold border-white/10" onClick={onStart}>
              Try Experiment Mode
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <AIFounderLogo className="w-4 h-4 text-white" />
              </div>
              <span className="font-headline font-bold text-lg tracking-tight uppercase">AI Founder</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering innovators with the intelligence of a full executive team.
            </p>
          </div>
          
          {[
            { title: "Platform", links: ["About", "Features", "Pricing"] },
            { title: "Support", links: ["Help Center", "Contact", "Community"] },
            { title: "Legal", links: ["Terms", "Privacy", "Cookies"] }
          ].map((col, idx) => (
            <div key={idx} className="space-y-6">
              <h5 className="font-bold text-xs uppercase tracking-widest text-accent">{col.title}</h5>
              <ul className="space-y-4">
                {col.links.map((link, i) => (
                  <li key={i}><a href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto pt-20 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 mt-20">
          <p className="text-xs text-muted-foreground/50 italic">© 2024 AI Founder Venture Studio. All rights reserved.</p>
          <div className="flex gap-6">
            {["Twitter", "LinkedIn", "GitHub"].map((s, i) => (
              <a key={i} href="#" className="text-xs font-bold text-muted-foreground/50 hover:text-accent transition-colors uppercase tracking-widest">{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
