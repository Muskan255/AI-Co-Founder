
"use client"

import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  HelpCircle, 
  Rocket, 
  LayoutDashboard, 
  Brain, 
  Users2, 
  Wrench, 
  Save, 
  FastForward,
  Lightbulb,
  ShieldCheck,
  Cpu,
  Megaphone,
  Banknote,
  Box,
  Map,
  Target
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function HelpCenter({ children }: { children?: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-accent transition-colors uppercase tracking-widest">
            <HelpCircle className="w-4 h-4" /> Startup Guide
          </button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[540px] bg-[#16181C] border-white/10 p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-8 border-b border-white/5">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6 text-accent" />
            </div>
            <SheetTitle className="text-3xl font-headline font-bold">Founder Help Center</SheetTitle>
            <SheetDescription>
              Your step-by-step manual for building world-changing ventures with AI.
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 p-8">
            <Accordion type="single" collapsible className="w-full space-y-4">
              
              <AccordionItem value="getting-started" className="border-white/5">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <FastForward className="w-5 h-5 text-accent" />
                    <span className="font-headline font-bold">Getting Started</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4">
                  <p>
                    This platform provides an <strong>AI Co-Founder</strong> that helps you turn startup ideas into real businesses. 
                    Unlike simple chat bots, this system is designed to execute specific startup work across technical, marketing, and financial domains.
                  </p>
                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                    <p className="text-xs font-bold text-accent uppercase mb-2">Pro Tip</p>
                    <p className="text-xs italic">Start with "Idea Validation" to stress-test your concept before moving to deep strategy.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="dashboard" className="border-white/5">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-5 h-5 text-accent" />
                    <span className="font-headline font-bold">Understanding the Dashboard</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4">
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="p-1.5 h-fit rounded-lg bg-white/5"><LayoutDashboard className="w-4 h-4" /></div>
                      <div>
                        <p className="font-bold text-foreground text-sm">Dashboard Overview</p>
                        <p className="text-xs">Your central mission control showing current progress and next steps.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="p-1.5 h-fit rounded-lg bg-white/5"><Brain className="w-4 h-4" /></div>
                      <div>
                        <p className="font-bold text-foreground text-sm">Startup Brain</p>
                        <p className="text-xs">The shared memory storing all key data about your venture.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="p-1.5 h-fit rounded-lg bg-white/5"><Wrench className="w-4 h-4" /></div>
                      <div>
                        <p className="font-bold text-foreground text-sm">Venture Studio</p>
                        <p className="text-xs">A collection of specialized tools to build your business model and roadmap.</p>
                      </div>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="creating" className="border-white/5">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-accent" />
                    <span className="font-headline font-bold">Creating a Venture</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4">
                  <p>Follow these steps to launch a new project:</p>
                  <ol className="space-y-3 list-decimal ml-4 text-sm">
                    <li>Go to <strong>My Ventures</strong> in the sidebar.</li>
                    <li>Click the <strong>New Venture</strong> button.</li>
                    <li>Enter your raw idea in the <strong>Idea Validation</strong> view.</li>
                    <li>Let the AI analyze feasibility and problem-market fit.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="personas" className="border-white/5">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Users2 className="w-5 h-5 text-accent" />
                    <span className="font-headline font-bold">Using AI Personas</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-blue-400 border-blue-400/20 gap-1"><Cpu className="w-3 h-3"/> AI CTO</Badge>
                      <p className="text-xs">Technical advisor for code, architecture, and dev roadmaps.</p>
                    </div>
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-pink-400 border-pink-400/20 gap-1"><Megaphone className="w-3 h-3"/> AI CMO</Badge>
                      <p className="text-xs">Marketing strategist for branding, SEO, and social launch.</p>
                    </div>
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 gap-1"><Banknote className="w-3 h-3"/> AI CFO</Badge>
                      <p className="text-xs">Financial lead for revenue models, burn rate, and funding.</p>
                    </div>
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-orange-400 border-orange-400/20 gap-1"><Box className="w-3 h-3"/> AI Product Manager</Badge>
                      <p className="text-xs">Product expert for MVP feature specs and user stories.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="studio-tools" className="border-white/5">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-accent" />
                    <span className="font-headline font-bold">Venture Studio Tools</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4">
                  <ul className="space-y-4">
                    <li className="space-y-1">
                      <p className="text-sm font-bold text-foreground">Idea Validation</p>
                      <p className="text-xs">Stress-tests your concept against market realities.</p>
                    </li>
                    <li className="space-y-1">
                      <p className="text-sm font-bold text-foreground">Strategy Blueprint</p>
                      <p className="text-xs">Builds your business model, moats, and IP strategy.</p>
                    </li>
                    <li className="space-y-1">
                      <p className="text-sm font-bold text-foreground">Financial Plan</p>
                      <p className="text-xs">Calculates CAC, LTV, and projected runway.</p>
                    </li>
                    <li className="space-y-1">
                      <p className="text-sm font-bold text-foreground">Startup Simulations</p>
                      <p className="text-xs">Simulates investor meetings and competitor responses.</p>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="saving" className="border-white/5">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Save className="w-5 h-5 text-accent" />
                    <span className="font-headline font-bold">Saving & Exporting Work</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5" />
                      <strong>Save to Project:</strong> Persists AI output to your venture's cloud storage.
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5" />
                      <strong>Export Document:</strong> Downloads content as Markdown or PDF.
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5" />
                      <strong>Push to GitHub:</strong> Deploys CTO-generated code directly to your repo.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
