"use client"

import React, { useState, useEffect } from 'react';
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
  Info,
  Check,
  Code2,
  Terminal,
  Target,
  TrendingUp,
  Banknote,
  Box,
  FastForward,
  Lock,
  ArrowLeft,
  Lightbulb
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

interface LandingPageProps {
  onStart: () => void;
}

type PublicView = 'home' | 'about' | 'features' | 'pricing' | 'help' | 'contact' | 'community' | 'terms' | 'privacy' | 'cookies';

export function LandingPage({ onStart }: LandingPageProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const [activeView, setActiveView] = useState<PublicView>('home');
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

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
        type: 'contact_inquiry',
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

  const renderHome = () => (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Visual Identity Block from Image */}
          <div className="relative flex flex-col items-center justify-center space-y-12 mb-8">
            <div className="relative group cursor-default">
              {/* Glowing Background Effect */}
              <div className="absolute inset-0 bg-blue-500/20 rounded-[2.5rem] blur-2xl group-hover:bg-blue-400/30 transition-all duration-700 animate-pulse-glow" />
              
              {/* The Blue Box from Image */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-[2.5rem] bg-gradient-to-br from-[#2DBEDE] via-[#1A55B3] to-[#1A55B3] flex items-center justify-center shadow-2xl border border-white/10 transition-transform duration-500 hover:scale-105">
                <AIFounderLogo className="w-20 h-20 md:w-24 md:h-24 text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Tagline Badge from Image */}
            <div className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-teal-500/30 bg-teal-500/5 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="text-teal-400 text-sm font-bold uppercase tracking-[0.25em]">
                An AI Partner for Entrepreneurs
              </span>
            </div>
          </div>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
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
            {[
              { title: "AI Personas", desc: "Work with AI CTO, CMO, CFO, and Growth Hacker co-founders.", icon: <Users2 className="text-pink-400" />, color: "from-pink-500/20 to-transparent" },
              { title: "Startup Brain", desc: "Your venture memory that keeps everything organized and context-aware.", icon: <Brain className="text-accent" />, color: "from-accent/20 to-transparent" },
              { title: "Venture Studio", desc: "Build strategy blueprints, product roadmaps, and detailed growth plans.", icon: <Wrench className="text-blue-400" />, color: "from-blue-500/20 to-transparent" },
              { title: "Startup Simulations", desc: "Test your startup with real-world scenarios and data projections.", icon: <PlayCircle className="text-emerald-400" />, color: "from-emerald-500/20 to-transparent" },
              { title: "AI Suggestions", desc: "Get smart recommendations to improve your startup in real-time.", icon: <Bell className="text-amber-400" />, color: "from-amber-500/20 to-transparent" },
              { title: "Startup Health Score", desc: "Track how strong your startup foundation is across 4 dimensions.", icon: <ShieldCheck className="text-indigo-400" />, color: "from-indigo-500/20 to-transparent" }
            ].map((f, i) => (
              <div key={i} className="group glass-card p-8 rounded-3xl border-white/5 hover:border-accent/30 transition-all duration-500 cursor-default relative overflow-hidden">
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", f.color)} />
                <div className="relative z-10 space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    {React.cloneElement(f.icon as React.ReactElement, { className: "w-6 h-6 " + (f.icon as any).props.className })}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-headline font-bold">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const renderAbout = () => (
    <section className="relative pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-headline font-bold">About AI Founder</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          AI Founder is an AI-powered co-founder platform designed to help entrepreneurs turn ideas into real startups. It combines strategy, product development, marketing, and financial planning into one intelligent workspace.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-headline font-bold text-accent">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our mission is to empower anyone to build a startup, regardless of their background, by providing access to intelligent tools that simulate a full executive team.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-headline font-bold text-pink-400">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            We envision a world where building a startup is no longer limited by knowledge, resources, or technical skills. AI Founder aims to become the operating system for future entrepreneurs.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-center text-3xl font-headline font-bold">What Makes Us Different</h2>
        <div className="grid gap-4">
          {[
            "AI Personas (CTO, CMO, CFO, etc.)",
            "Startup Brain (Shared Memory)",
            "Venture Studio tools",
            "Startup simulations",
            "AI-driven suggestions and scoring"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderFeatures = () => (
    <section className="relative pt-32 pb-20 px-6 max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-headline font-bold">Platform Capabilities</h1>
        <p className="text-xl text-muted-foreground">Deep-dive into the tools that power your venture.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: "AI Personas", desc: "Work with specialized AI roles like CTO, CMO, CFO, Product Manager, and Growth Hacker.", icon: <Users2 className="text-blue-400" /> },
          { title: "Startup Brain", desc: "A centralized memory system that stores your startup’s key data and keeps everything aligned.", icon: <Brain className="text-accent" /> },
          { title: "Venture Studio", desc: "A structured environment to build your startup step-by-step with guided workflows.", icon: <Wrench className="text-emerald-400" /> },
          { title: "Startup Simulations", desc: "Test your startup with investor scenarios, customer feedback, and competitor reactions.", icon: <PlayCircle className="text-amber-400" /> },
          { title: "AI Suggestions", desc: "Get smart recommendations to improve your startup in real time based on active gaps.", icon: <Bell className="text-pink-400" /> },
          { title: "Startup Health Score", desc: "Track your startup’s strength with AI-driven evaluation across 4 key pillars.", icon: <ShieldCheck className="text-indigo-400" /> },
          { title: "Code Generation", desc: "Generate technical architecture and production-grade code for your product MVP.", icon: <Code2 className="text-orange-400" /> },
          { title: "Cloud Vault", desc: "Securely store every document, roadmap, and line of code generated by the executive team.", icon: <Lock className="text-rose-400" /> }
        ].map((f, i) => (
          <Card key={i} className="glass-card border-white/5 group hover:border-accent/30 transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {React.cloneElement(f.icon as React.ReactElement, { className: "w-6 h-6 " + (f.icon as any).props.className })}
              </div>
              <CardTitle className="font-headline font-bold">{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );

  const renderPricing = () => (
    <section className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-headline font-bold">Venture Access</h1>
        <p className="text-xl text-muted-foreground">Start for free, upgrade when you're ready to build for real.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="glass-card border-white/10 p-8 flex flex-col">
          <div className="space-y-4 mb-8">
            <Badge variant="outline">Free Tier</Badge>
            <h3 className="text-3xl font-headline font-bold">Experiment Mode</h3>
            <p className="text-sm text-muted-foreground">Perfect for exploring ideas and testing viability.</p>
            <div className="text-4xl font-bold">$0<span className="text-sm text-muted-foreground font-normal"> / forever</span></div>
          </div>
          <ul className="space-y-4 flex-1">
            {[
              "Access Venture Studio",
              "Use all AI Personas",
              "Generate Startup Strategies",
              "Run Market Simulations",
              "No permanent cloud saving",
              "No document exports"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                {i < 4 ? <Check className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-muted-foreground/30" />}
                {item}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full mt-8 h-12 font-bold" onClick={onStart}>Start Experiment</Button>
        </Card>

        <Card className="glass-card border-accent/30 bg-accent/5 p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">Recommended</div>
          <div className="space-y-4 mb-8">
            <Badge className="bg-accent text-accent-foreground">Pro Tier</Badge>
            <h3 className="text-3xl font-headline font-bold">Founder Cloud</h3>
            <p className="text-sm text-muted-foreground">Everything you need to execute and scale.</p>
            <div className="text-4xl font-bold">$29<span className="text-sm text-muted-foreground font-normal"> / month</span></div>
          </div>
          <ul className="space-y-4 flex-1">
            {[
              "Save Unlimited Ventures",
              "Access Startup Brain Memory",
              "Export Strategies & Assets",
              "Full GitHub Integration",
              "Advanced AI Strategic Suggestions",
              "Persistent Health Score Tracking"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-accent" />
                {item}
              </li>
            ))}
          </ul>
          <Button className="w-full mt-8 h-12 bg-primary hover:bg-primary/90 font-bold" onClick={() => setAuthOpen(true)}>Upgrade to Pro</Button>
        </Card>
      </div>
    </section>
  );

  const renderContact = () => (
    <section className="relative pt-32 pb-20 px-6 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-headline font-bold">Contact Us</h1>
        <p className="text-lg text-muted-foreground">Have feedback, ideas, or issues? We'd love to hear from you.</p>
      </div>

      <Card className="glass-card p-8">
        <form onSubmit={handleContactSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="Founder Name" required className="bg-white/5 border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="name@startup.com" required className="bg-white/5 border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="How can we help your venture?" required className="min-h-[150px] bg-white/5 border-white/10" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-primary hover:bg-primary/90 font-bold gap-2">
            {isSubmitting ? <Sparkles className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
            Send Message
          </Button>
          <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">Typical response time: 24–48 hours</p>
        </form>
      </Card>
    </section>
  );

  const renderHelp = () => (
    <section className="relative pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-headline font-bold">Help Center</h1>
        <p className="text-xl text-muted-foreground">Master the AI Founder platform.</p>
      </div>

      <div className="grid gap-8">
        {[
          { title: "Getting Started Guide", icon: <FastForward className="text-accent" />, items: ["Introduction to AI Founder", "Setting up your first venture", "Understanding the dashboard"] },
          { title: "How to Create a Venture", icon: <Lightbulb className="text-amber-400" />, items: ["Drafting the core idea", "Validating market feasibility", "Generating the initial blueprint"] },
          { title: "How to Use AI Personas", icon: <Users2 className="text-pink-400" />, items: ["Switching between executive roles", "Asking role-specific questions", "Integrating outputs into the Brain"] },
          { title: "Generating Strategies", icon: <Target className="text-emerald-400" />, items: ["Marketing growth plans", "Financial revenue models", "Product roadmaps"] },
          { title: "Saving & Persistence", icon: <Globe className="text-blue-400" />, items: ["Saving your experiment results", "Resuming work later", "Cloud-syncing with Firestore"] }
        ].map((guide, i) => (
          <Card key={i} className="glass-card border-white/5">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 rounded-lg bg-white/5">{guide.icon}</div>
              <CardTitle className="text-xl">{guide.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid md:grid-cols-3 gap-4">
                {guide.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1 h-1 rounded-full bg-accent" /> {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-8 pt-12 border-t border-white/5">
        <h2 className="text-3xl font-headline font-bold text-center">Frequently Asked Questions</h2>
        <div className="grid gap-6">
          {[
            { q: "Do I need to log in?", a: "No, you can start in Experiment Mode immediately. However, login is required to save your progress and access your venture from other devices." },
            { q: "How do I save my startup?", a: "Once you log in, your active experiment is automatically synchronized to your account and stored securely in Firestore." },
            { q: "Can I export my work?", a: "Yes, Pro users can export strategies, roadmaps, and code as Markdown, CSV, or directly to GitHub." }
          ].map((faq, i) => (
            <div key={i} className="space-y-2 p-6 rounded-2xl bg-white/2 border border-white/5">
              <h4 className="font-bold text-foreground">Q: {faq.q}</h4>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderCommunity = () => (
    <section className="relative pt-32 pb-20 px-6 max-w-4xl mx-auto text-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto text-accent mb-8">
          <Globe className="w-10 h-10" />
        </div>
        <h1 className="text-5xl md:text-7xl font-headline font-bold">Join the Community</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Join a growing network of founders and builders sharing ideas, discussing strategies, and scaling ventures together.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 pt-12">
        {[
          { title: "Share Ideas", icon: <Lightbulb /> },
          { title: "Learn from Others", icon: <Info /> },
          { title: "Discuss Strategies", icon: <MessageSquare /> }
        ].map((s, i) => (
          <div key={i} className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto text-accent">
              {React.cloneElement(s.icon as React.ReactElement, { className: "w-6 h-6" })}
            </div>
            <h4 className="font-bold">{s.title}</h4>
          </div>
        ))}
      </div>

      <div className="p-12 rounded-3xl border border-dashed border-white/10 bg-white/2">
        <h3 className="text-2xl font-headline font-bold mb-2">Community Features Coming Soon</h3>
        <p className="text-muted-foreground">We are building a dedicated space for networking and collective intelligence.</p>
      </div>
    </section>
  );

  const renderPolicy = (title: string, content: string[]) => (
    <section className="relative pt-32 pb-20 px-6 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-5xl font-headline font-bold">{title}</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
        {content.map((p, i) => (
          <p key={i} className="leading-relaxed">{p}</p>
        ))}
      </div>
    </section>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'about': return renderAbout();
      case 'features': return renderFeatures();
      case 'pricing': return renderPricing();
      case 'help': return renderHelp();
      case 'contact': return renderContact();
      case 'community': return renderCommunity();
      case 'terms': return renderPolicy("Terms & Conditions", [
        "Welcome to AI Founder. By using our platform, you agree to comply with and be bound by the following terms and conditions of use.",
        "The platform is provided 'as is' for the purpose of startup simulation and strategy assistance. We do not guarantee startup success or financial outcomes.",
        "Users are responsible for the content they input and the startup decisions they make based on AI suggestions.",
        "We reserve the right to limit access to features for guest users and modify pricing tiers at any time.",
        "Limitation of Liability: AI Founder and its creators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the platform."
      ]);
      case 'privacy': return renderPolicy("Privacy Policy", [
        "At AI Founder, we value your privacy and are transparent about how we handle your data.",
        "Data Collection: We collect basic information such as your name and email when you register. We also store your startup idea data to provide persistent workspace functionality.",
        "How Data is Used: Your data is used exclusively to power the AI co-founder experience, save your ventures, and improve platform performance.",
        "Protection: We use standard encryption and Firebase's secure infrastructure to protect your personal and venture information.",
        "User Rights: You have the right to access, modify, or request deletion of your account data at any time."
      ]);
      case 'cookies': return renderPolicy("Cookies Policy", [
        "AI Founder uses essential cookies to manage user sessions and authentication states.",
        "What are cookies? Cookies are small text files stored on your device that help us remember your preferences and keep you logged in.",
        "How we use them: We use cookies to identify your venture workspace and provide a seamless transition between experiment and cloud modes.",
        "Control: You can manage or disable cookies through your browser settings, though this may limit your ability to save venture progress."
      ]);
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] overflow-hidden flex flex-col">
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
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <AIFounderLogo className="w-6 h-6 text-white" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight uppercase text-white">AI Founder</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => setActiveView('about')} className={cn("text-sm font-bold transition-colors", activeView === 'about' ? "text-accent" : "text-muted-foreground hover:text-white")}>About</button>
            <button onClick={() => setActiveView('features')} className={cn("text-sm font-bold transition-colors", activeView === 'features' ? "text-accent" : "text-muted-foreground hover:text-white")}>Features</button>
            <button onClick={() => setActiveView('pricing')} className={cn("text-sm font-bold transition-colors", activeView === 'pricing' ? "text-accent" : "text-muted-foreground hover:text-white")}>Pricing</button>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-sm font-bold text-muted-foreground hover:text-white" onClick={() => setAuthOpen(true)}>Sign In</Button>
            <Button className="bg-primary hover:bg-primary/90 font-bold px-6" onClick={() => setAuthOpen(true)}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        {activeView !== 'home' && (
          <div className="max-w-7xl mx-auto px-6 pt-8">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-accent p-0" onClick={() => setActiveView('home')}>
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </div>
        )}
        {renderContent()}
      </main>

      {/* Global CTA - Show only on home page */}
      {activeView === 'home' && (
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
      )}

      {/* Footer */}
      <footer className="relative z-10 py-20 px-6 border-t border-white/5 bg-[#0A0C10]/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <AIFounderLogo className="w-4 h-4 text-white" />
              </div>
              <span className="font-headline font-bold text-lg tracking-tight uppercase text-white">AI Founder</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering innovators with the intelligence of a full executive team.
            </p>
          </div>
          
          {[
            { title: "Platform", links: [{ l: "About", v: "about" }, { l: "Features", v: "features" }, { l: "Pricing", v: "pricing" }] },
            { title: "Support", links: [{ l: "Help Center", v: "help" }, { l: "Contact", v: "contact" }, { l: "Community", v: "community" }] },
            { title: "Legal", links: [{ l: "Terms", v: "terms" }, { l: "Privacy", v: "privacy" }, { l: "Cookies", v: "cookies" }] }
          ].map((col, idx) => (
            <div key={idx} className="space-y-6">
              <h5 className="font-bold text-xs uppercase tracking-widest text-accent">{col.title}</h5>
              <ul className="space-y-4">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <button 
                      onClick={() => setActiveView(link.v as PublicView)} 
                      className="text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                      {link.l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto pt-20 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 mt-20">
          <p className="text-xs text-muted-foreground/50 italic">© 2026 AI Founder Venture Studio. Built for founders, innovators, and creators.</p>
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
