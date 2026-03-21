
"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Users2, Brain, Wrench, PlayCircle, ShieldCheck, 
  Menu, Code2, Lightbulb, Map, Lock,
  Cpu, Megaphone, Banknote, Box, Heart, Zap, Target, Share2, Send, MessageSquare, Bug
} from 'lucide-react';
import { AuthModal } from '@/components/auth/auth-modal';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ParticleSphere } from './particle-sphere';
import { CustomCursor } from './custom-cursor';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface LandingPageProps {
  onStart: () => void;
}

const fadeIn = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.68, ease: [0.19, 1, 0.22, 1] }
};

export function LandingPage({ onStart }: LandingPageProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      toast({ title: "Message Sent", description: "The board has received your inquiry." });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({ variant: "destructive", title: "Submission Error", description: "Transmission failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const NavLinks = () => (
    <>
      {['about', 'capabilities', 'pricing', 'contact'].map((item) => (
        <button 
          key={item} 
          onClick={() => scrollTo(item)} 
          className="text-[0.7rem] font-mono font-medium tracking-[0.12em] uppercase text-[#7166a0] hover:text-white transition-colors py-2 lg:py-0"
        >
          {item}
        </button>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-transparent text-[#ede8ff] overflow-x-hidden font-body selection:bg-primary selection:text-white relative">
      <div className="noise-overlay" />
      <ParticleSphere />
      <CustomCursor />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[200] px-6 lg:px-14 h-20 flex items-center justify-between transition-all duration-400",
        scrolled ? "bg-[#060411]/85 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent border-b border-transparent"
      )}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />
          <span className="font-headline font-extrabold text-[1.05rem] tracking-[0.04em] uppercase text-white">AI Co-Founder</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-9">
          <NavLinks />
        </div>

        <div className="flex items-center gap-3 lg:gap-4">
          <Button variant="ghost" className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[#7166a0] hover:text-white border border-white/[0.06] px-5 h-9 hidden sm:flex" onClick={() => setAuthOpen(true)}>
            Try Free
          </Button>
          <Button className="font-mono bg-primary hover:bg-accent text-black font-bold px-5 h-9 text-[0.68rem] tracking-[0.1em] uppercase transition-all hover:-translate-y-px" onClick={() => setAuthOpen(true)}>
            Get Started →
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/5">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#060411]/95 backdrop-blur-xl border-white/5 text-white p-0">
              <div className="p-8 space-y-8">
                <SheetHeader className="text-left">
                  <SheetTitle className="text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    AI Co-Founder
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-8">
                  <NavLinks />
                  <Separator className="bg-white/5" />
                  <Button variant="outline" className="font-mono w-full border-white/10 text-[0.68rem] tracking-[0.1em] uppercase h-12" onClick={() => setAuthOpen(true)}>Sign In</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-32 pb-20 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/25 bg-secondary/5 mb-9"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <span className="text-secondary font-mono text-[0.66rem] font-medium uppercase tracking-[0.18em]">AI-Powered Executive Team</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="text-[clamp(3rem,7.5vw,7rem)] font-headline font-extrabold leading-[0.93] tracking-[-0.04em] uppercase max-w-[900px]"
        >
          Build your<br />
          <span className="text-outline">Startup</span><br />
          <span className="text-primary">Intelligently.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-8 font-mono text-[0.9rem] leading-[1.9] text-[#7166a0] max-w-[500px]"
        >
          From idea to execution with the intelligence of a full AI-powered executive team — strategy, product, and finance, unified.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-11 flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" className="font-mono bg-white hover:bg-accent text-black font-bold h-14 px-10 text-[0.78rem] tracking-[0.12em] uppercase transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(255,170,0,0.2)]" onClick={() => setAuthOpen(true)}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="font-mono border-white/10 bg-transparent text-[#7166a0] hover:text-white h-14 px-10 text-[0.78rem] tracking-[0.12em] uppercase" onClick={onStart}>
            Try Without Login
          </Button>
        </motion.div>

        <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-50">
          <div className="w-[1px] h-10 bg-gradient-to-b from-primary to-transparent animate-scroll-bar" />
          <span className="font-mono text-[0.58rem] tracking-[0.2em] uppercase text-[#7166a0]">Explore</span>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-24 px-6 lg:px-14 z-10 bg-[#060411]/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div {...fadeIn} className="space-y-6">
            <p className="font-mono text-primary text-[0.65rem] tracking-[0.22em] uppercase">// What is AI Co-Founder</p>
            <h2 className="text-[clamp(2rem,4vw,3.6rem)] font-headline font-extrabold leading-[1.05] uppercase">
              An <span className="text-accent italic">AI Partner</span><br />for Entrepreneurs
            </h2>
            <p className="font-mono text-[0.85rem] leading-[1.9] text-[#7166a0] max-w-[480px]">
              AI Co-Founder is an AI-powered co-founder system designed to help you build startups step by step. It combines strategy, product development, marketing, and financial planning into one intelligent workspace.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              {[
                { title: "Our Mission", content: "Make startup building accessible to everyone, regardless of background, by providing intelligent tools that simulate a full executive team." },
                { title: "Our Vision", content: "Become the operating system for future entrepreneurs — where building a startup is no longer limited by knowledge or technical skills." }
              ].map((item, i) => (
                <div key={i} className="p-7 bg-white/[0.03] backdrop-blur-md border border-white/[0.06] relative overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary to-primary" />
                  <h4 className="font-mono text-secondary text-[0.75rem] tracking-[0.18em] uppercase mb-3 font-bold">{item.title}</h4>
                  <p className="font-mono text-[0.76rem] leading-[1.75] text-[#7166a0]">{item.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeIn} className="flex justify-center">
            <div className="w-[340px] h-[340px] rounded-full border border-white/[0.06] relative flex items-center justify-center">
              <div className="absolute inset-[-1px] rounded-full bg-[conic-gradient(from_180deg,transparent_60%,rgba(255,69,0,0.2),rgba(204,0,255,0.2),transparent)] animate-[spin_8s_linear_infinite]" />
              <div className="text-center">
                <div className="font-mono text-[#7166a0] text-[0.65rem] tracking-[0.18em] uppercase">Ventures Launched</div>
                <div className="text-white text-[3.5rem] font-extrabold leading-none my-2">2.4<span className="text-primary">K+</span></div>
                <div className="font-mono text-[#7166a0] text-[0.65rem] tracking-[0.18em] uppercase">and counting</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="relative py-24 px-6 lg:px-14 z-10 bg-[#09071a]/85 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto">
          <motion.p {...fadeIn} className="font-mono text-primary text-[0.65rem] tracking-[0.22em] uppercase">// Platform Capabilities</motion.p>
          <motion.h2 {...fadeIn} className="text-[clamp(2rem,4vw,3.6rem)] font-headline font-extrabold leading-[1.05] uppercase mt-4">
            Everything to Architect<br />a <span className="text-accent italic">High-Growth</span> Venture.
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-white/[0.06] mt-16 border border-white/[0.06] overflow-hidden">
            {[
              { title: "AI Personas", desc: "Work with specialized AI roles — CTO, CMO, CFO, and Growth Hacker — each delivering expert-level output.", icon: <Users2 /> },
              { title: "Startup Brain", desc: "A centralized, persistent memory system that stores your venture’s key data and keeps agents aligned.", icon: <Brain /> },
              { title: "Venture Studio", desc: "A structured, step-by-step environment to build your startup from idea to execution.", icon: <Wrench /> },
              { title: "Code Generation", desc: "Generate technical architecture and production-grade code for your product MVP.", icon: <Code2 /> },
              { title: "Startup Simulations", desc: "Test your startup with investor scenarios, user feedback, and market reactions.", icon: <PlayCircle /> },
              { title: "Health Score", desc: "Track how strong your startup foundation is across 4 key dimensions in real-time.", icon: <ShieldCheck /> }
            ].map((f, i) => (
              <motion.div key={i} {...fadeIn} className="bg-white/[0.03] backdrop-blur-md p-11 relative group hover:bg-primary/[0.03] transition-all overflow-hidden border border-transparent hover:border-primary/20">
                <div className="w-10 h-10 border border-white/[0.06] flex items-center justify-center text-primary mb-6">
                  {React.cloneElement(f.icon as React.ReactElement, { className: "w-5 h-5" })}
                </div>
                <div className="font-mono text-primary text-[0.58rem] tracking-[0.2em] mb-3">0{i+1}</div>
                <h3 className="text-[1.1rem] font-bold tracking-tight mb-3 text-white">{f.title}</h3>
                <p className="font-mono text-[#7166a0] text-[0.75rem] leading-[1.8]">{f.desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Path Section */}
      <section id="path" className="relative py-24 px-6 lg:px-14 z-10 bg-[#060411]/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto">
          <motion.p {...fadeIn} className="font-mono text-primary text-[0.65rem] tracking-[0.22em] uppercase">// The Path to Exit</motion.p>
          <motion.h2 {...fadeIn} className="text-[clamp(2rem,4vw,3.6rem)] font-headline font-extrabold leading-[1.05] uppercase mt-4">
            A Simple <span className="text-accent italic">5-Step</span> Journey<br />From Idea to Scale.
          </motion.h2>

          <div className="mt-16 relative pl-14">
            <div className="absolute left-7 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary via-secondary to-transparent" />
            <div className="space-y-0">
              {[
                { step: "01", title: "Enter Your Idea", desc: "Pitch your core concept. No detail is too small — AI Co-Founder listens and understands." },
                { step: "02", title: "AI Analyzes and Stores It", desc: "Your idea is integrated into the Startup Brain memory layer, ready for the full executive team." },
                { step: "03", title: "Personas Generate Strategies", desc: "Your CTO, CMO, and CFO deliver custom roadmaps and financial models tailored to your venture." },
                { step: "04", title: "Build and Execute", desc: "Use the generated assets to build your MVP and growth loops. Code, copy, and strategy in one place." },
                { step: "05", title: "Continue and Scale", desc: "Refine your health score and keep building toward exit with proactive AI guidance." }
              ].map((s, i) => (
                <motion.div key={i} {...fadeIn} className={cn(
                  "relative py-9 border-b border-white/[0.06] last:border-0 group",
                )}>
                  <div className="absolute left-[-41px] w-14 h-14 rounded-full border border-white/[0.06] bg-[#060411] flex items-center justify-center text-primary font-mono text-[0.68rem] tracking-[0.1em] font-medium z-10 group-hover:border-primary/30 transition-colors">
                    {s.step}
                  </div>
                  <div className="pl-10">
                    <h3 className="text-[1.25rem] font-bold mb-2 text-white">{s.title}</h3>
                    <p className="font-mono text-[#7166a0] text-[0.78rem] leading-[1.8] max-w-[540px]">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 px-6 lg:px-14 z-10 bg-[#09071a]/85 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto">
          <motion.p {...fadeIn} className="font-mono text-primary text-[0.65rem] tracking-[0.22em] uppercase">// Venture Access</motion.p>
          <motion.h2 {...fadeIn} className="text-[clamp(2rem,4vw,3.6rem)] font-headline font-extrabold leading-[1.05] uppercase mt-4">
            Start Free.<br />Scale <span className="text-accent italic">When Ready.</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-white/[0.06] mt-16 max-w-[800px] mx-auto border border-white/[0.06]">
            <motion.div {...fadeIn} className="bg-white/[0.03] backdrop-blur-md p-12 relative flex flex-col">
              <div className="font-mono text-[#7166a0] text-[0.65rem] tracking-[0.18em] uppercase mb-1">Tier 01</div>
              <h3 className="text-[1.4rem] font-extrabold mb-1">Free Mode</h3>
              <p className="font-mono text-[0.72rem] text-[#7166a0] mb-8 leading-relaxed">Venture Experiment — perfect for exploring ideas.</p>
              <div className="text-[2.8rem] font-extrabold leading-none mb-2">$0</div>
              <div className="font-mono text-[0.68rem] text-[#7166a0] mb-9">/ forever</div>
              <ul className="space-y-3 mb-10 flex-1">
                {["Access Venture Studio", "Use AI Personas", "Generate Strategies", "No Persistent Saving"].map((f, i) => (
                  <li key={i} className={cn("font-mono text-[0.75rem] text-[#7166a0] flex items-center gap-2", i === 3 && "opacity-35")}>
                    <span className={cn("text-primary", i === 3 && "text-[#7166a0]")}>—</span> {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="font-mono w-full border-white/[0.06] text-[0.72rem] tracking-[0.12em] uppercase h-12" onClick={onStart}>
                Start Experiment
              </Button>
            </motion.div>

            <motion.div {...fadeIn} className="bg-primary/[0.04] backdrop-blur-md p-12 relative flex flex-col border border-primary/30">
              <div className="absolute top-[-1px] left-1/2 -translate-x-1/2 bg-primary text-black font-mono text-[0.55rem] tracking-[0.2em] font-bold px-3.5 py-1">RECOMMENDED</div>
              <div className="font-mono text-[#7166a0] text-[0.65rem] tracking-[0.18em] uppercase mb-1">Tier 02</div>
              <h3 className="text-[1.4rem] font-extrabold mb-1">Founder Cloud</h3>
              <p className="font-mono text-[0.72rem] text-[#7166a0] mb-8 leading-relaxed">Everything you need to execute and scale.</p>
              <div className="text-[2.8rem] font-extrabold leading-none mb-2">$29<sub className="text-[1rem] font-normal text-[#7166a0]">/mo</sub></div>
              <div className="font-mono text-[0.68rem] text-[#7166a0] mb-9">billed monthly</div>
              <ul className="space-y-3 mb-10 flex-1">
                {["Save Unlimited Ventures", "Full AI Executive Access", "Access Startup Brain", "GitHub Integrations"].map((f, i) => (
                  <li key={i} className="font-mono text-[0.75rem] text-[#7166a0] flex items-center gap-2">
                    <span className="text-primary">—</span> {f}
                  </li>
                ))}
              </ul>
              <Button className="font-mono w-full bg-primary hover:bg-accent text-black font-bold text-[0.72rem] tracking-[0.12em] uppercase h-12 transition-all hover:scale-[1.02]" onClick={() => setAuthOpen(true)}>
                Upgrade to Pro →
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Agentic Section */}
      <section id="agentic" className="relative py-24 px-6 lg:px-14 z-10 bg-[#09071a]/85 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto">
          <motion.p {...fadeIn} className="font-mono text-primary text-[0.65rem] tracking-[0.22em] uppercase">// How Our Agentic AI Works</motion.p>
          <motion.h2 {...fadeIn} className="text-[clamp(2rem,4vw,3.6rem)] font-headline font-extrabold leading-[1.05] uppercase mt-4">
            A Real Team.<br /><span className="text-secondary italic">Synthetic</span> Intelligence.
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mt-16">
            <motion.div {...fadeIn} className="font-mono text-[0.82rem] leading-[1.95] text-[#7166a0] space-y-6">
              <p>AI Co-Founder is powered by an agentic AI system where multiple specialized agents collaborate to execute tasks like a real startup team. Each agent is responsible for a specific function — product planning, technical development, marketing strategy, or financial analysis.</p>
              <p>Instead of working independently, these agents are connected through a shared intelligence layer. When you provide an idea, the system breaks it down into structured tasks and assigns them to the appropriate agents — building on previous decisions in a continuous workflow.</p>
              <p>The system also maintains persistent memory, ensuring all agents remain aligned with your startup's context, goals, and progress. Rather than reacting to single inputs, it actively coordinates, updates, and suggests next steps.</p>
            </motion.div>
            <div className="grid grid-cols-2 gap-3.5">
              {[
                { role: "Chief Technology Officer", active: true },
                { role: "Chief Marketing Officer", active: true },
                { role: "Chief Financial Officer", active: true },
                { role: "Growth Hacker", active: true }
              ].map((agent, i) => (
                <motion.div key={i} {...fadeIn} className="p-6 border border-white/[0.06] bg-white/[0.03] backdrop-blur-md hover:border-secondary/30 transition-all group">
                  <div className="font-mono text-secondary text-[0.58rem] tracking-[0.2em] uppercase mb-1.5 font-bold">Role</div>
                  <div className="text-[0.95rem] font-bold text-white mb-2.5">{agent.role}</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                    <span className="font-mono text-primary text-[0.58rem] tracking-[0.12em] font-medium uppercase">Active</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section id="founders" className="relative py-24 px-6 lg:px-14 z-10 bg-[#060411]/80 backdrop-blur-md border-t border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.p {...fadeIn} className="font-mono text-primary text-[0.65rem] tracking-[0.22em] uppercase mb-4">// The Architects</motion.p>
          <motion.h2 {...fadeIn} className="text-[3rem] font-headline font-extrabold uppercase mb-16">Meet the Founders</motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1000px] mx-auto">
            {[
              { 
                name: "Muskan", 
                role: "Co-Founder", 
                image: "founder-muskan", 
                desc: "Muskan shapes the vision and UX of AI Co-Founder, transforming complex startup building into structured, intuitive AI workflows." 
              },
              { 
                name: "Navaneeth", 
                role: "Co-Founder", 
                image: "founder-navaneeth", 
                desc: "Navaneeth architects the technical backbone, developing the multi-agent coordination layer and scalable cloud infrastructure." 
              }
            ].map((f, i) => (
              <motion.div key={i} {...fadeIn} className="group relative bg-white/[0.03] backdrop-blur-md border border-white/[0.06] p-8 text-left hover:border-primary/20 transition-all">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                <div className="relative aspect-square w-24 mb-6 grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden border border-white/10">
                  <Image 
                    src={PlaceHolderImages.find(img => img.id === f.image)?.imageUrl || ''} 
                    alt={f.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-tight">{f.name}</h3>
                <div className="font-mono text-primary text-[0.6rem] tracking-[0.2em] font-bold uppercase mb-4">{f.role}</div>
                <p className="font-mono text-[#7166a0] text-[0.75rem] leading-[1.8]">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeIn} className="mt-12 text-[#7166a0] font-mono text-[0.8rem] italic">
            "Built together with a shared vision to create an AI system that doesn’t just assist—but builds alongside you."
          </motion.p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-24 px-6 lg:px-14 z-10 bg-[#09071a]/85 backdrop-blur-md">
        <div className="max-w-[800px] mx-auto">
          <motion.p {...fadeIn} className="font-mono text-primary text-[0.65rem] tracking-[0.22em] uppercase">// FAQ</motion.p>
          <motion.h2 {...fadeIn} className="text-[3rem] font-headline font-extrabold uppercase mt-4 mb-12">Frequently Asked<br /><span className="text-accent italic">Questions.</span></motion.h2>
          
          <div className="space-y-0">
            {[
              { q: "Do I need to log in?", a: "No — you can try AI Co-Founder without logging in. However, logging in enables persistent saving, full access to Startup Brain, and cloud synchronization." },
              { q: "How do I save my work?", a: "Create a free account to save your ventures. With Founder Cloud ($29/mo), you get unlimited saves and full persistent memory across all sessions." },
              { q: "What AI models power the platform?", a: "We use a multi-agent architecture powered by state-of-the-art LLMs specialized for executive functions like product, marketing, and finance." },
              { q: "Can I generate real code?", a: "Yes. The CTO persona generates production-grade code, technical architecture plans, and MVP scaffolding based on your specifications." }
            ].map((item, i) => (
              <motion.div key={i} {...fadeIn} className="border-t border-white/[0.06] last:border-b">
                <Accordion type="single" collapsible>
                  <AccordionItem value={`item-${i}`} className="border-0">
                    <AccordionTrigger className="hover:no-underline py-7 text-[1rem] font-bold text-left tracking-tight text-white group">
                      <div className="flex justify-between items-center w-full pr-4">
                        {item.q}
                        <span className="text-primary text-xl font-normal group-data-[state=open]:rotate-45 transition-transform">+</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="font-mono text-[#7166a0] text-[0.78rem] leading-[1.85] pb-7 max-w-[600px]">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-24 px-6 lg:px-14 z-10 bg-[#060411]/80 backdrop-blur-md">
        <div className="max-w-[640px] mx-auto">
          <motion.p {...fadeIn} className="font-mono text-primary text-[0.65rem] tracking-[0.22em] uppercase">// Contact & Feedback</motion.p>
          <motion.h2 {...fadeIn} className="text-[3rem] font-headline font-extrabold uppercase mt-4 mb-12">We'd Love to<br /><span className="text-accent italic">Hear From You.</span></motion.h2>
          
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="space-y-1.5 flex flex-col">
              <label className="font-mono text-[#7166a0] text-[0.62rem] tracking-[0.16em] uppercase font-bold">Full Name</label>
              <input name="name" type="text" placeholder="Founder Name" className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] p-3 text-[0.78rem] text-white focus:outline-none focus:border-primary/40 transition-colors font-mono" required />
            </div>
            <div className="space-y-1.5 flex flex-col">
              <label className="font-mono text-[#7166a0] text-[0.62rem] tracking-[0.16em] uppercase font-bold">Email Address</label>
              <input name="email" type="email" placeholder="name@startup.com" className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] p-3 text-[0.78rem] text-white focus:outline-none focus:border-primary/40 transition-colors font-mono" required />
            </div>
            <div className="space-y-1.5 flex flex-col">
              <label className="font-mono text-[#7166a0] text-[0.62rem] tracking-[0.16em] uppercase font-bold">Message</label>
              <textarea name="message" placeholder="Share your ideas, feedback, or issues with us." className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] p-3 text-[0.78rem] text-white focus:outline-none focus:border-primary/40 transition-colors min-h-[120px] font-mono" required />
            </div>
            <Button type="submit" disabled={isSubmitting} className="font-mono bg-primary hover:bg-accent text-black font-bold h-14 px-8 text-[0.75rem] tracking-[0.14em] uppercase transition-all hover:-translate-y-0.5 mt-4">
              {isSubmitting ? "Sending..." : "Send Message →"}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#060411]/98 border-t border-white/[0.06] px-6 lg:px-14 pt-16 pb-9 backdrop-blur-xl">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 pb-12 border-b border-white/[0.06] mb-12">
          <div className="space-y-4">
            <div className="text-white text-[1rem] font-extrabold tracking-[0.06em] uppercase">AI <span className="text-primary">Co-Founder</span></div>
            <p className="font-mono text-[#7166a0] text-[0.72rem] leading-[1.8] max-w-[220px]">Empowering innovators with the intelligence of a full executive team. Built for founders and creators.</p>
          </div>
          <div>
            <h5 className="font-mono text-[#7166a0] text-[0.62rem] tracking-[0.2em] uppercase mb-5 font-bold">Legal</h5>
            <ul className="space-y-2.5">
              {["Terms", "Privacy", "Cookies"].map((l) => (
                <li key={l}><a href="#" className="font-mono text-[#7166a0] text-[0.72rem] hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-[#7166a0] text-[0.62rem] tracking-[0.2em] uppercase mb-5 font-bold">Connect</h5>
            <ul className="space-y-2.5">
              <li><a href="#" className="font-mono text-[#7166a0] text-[0.72rem] hover:text-white transition-colors">Twitter</a></li>
              <li><a href="https://www.linkedin.com/in/muskan-843434323?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" className="font-mono text-[#7166a0] text-[0.72rem] hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="font-mono text-[#7166a0] text-[0.72rem] hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-[#7166a0] text-[0.62rem] tracking-[0.2em] uppercase mb-5 font-bold">Product</h5>
            <ul className="space-y-2.5">
              <li><a href="#" className="font-mono text-[#7166a0] text-[0.72rem] hover:text-white transition-colors">Platform</a></li>
              <li><a href="#" className="font-mono text-[#7166a0] text-[0.72rem] hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="font-mono text-[#7166a0] text-[0.72rem] hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[#7166a0] text-[0.65rem] tracking-[0.08em]">
          <div>© 2026 AI Co-Founder Venture Studio. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Secure Cloud Infrastructure
          </div>
        </div>
      </footer>
    </div>
  );
}
