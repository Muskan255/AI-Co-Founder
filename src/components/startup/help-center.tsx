
"use client"

import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  HelpCircle, 
  Users2, 
  Save, 
  FastForward,
  Cpu,
  Megaphone,
  Banknote,
  MessageSquare,
  Bug,
  Sparkles,
  LogOut,
  User,
  Send
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function HelpCenter({ children }: { children?: React.ReactNode }) {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [feedbackType, setFeedbackType] = useState<'feedback' | 'bug' | 'feature'>('feedback');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    window.location.reload();
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !feedbackMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'feedback'), {
        userId: user?.uid || 'guest',
        userEmail: user?.email || 'anonymous',
        type: feedbackType,
        message: feedbackMessage,
        timestamp: serverTimestamp(),
      });
      
      toast({
        title: "Feedback Received",
        description: "Thank you for helping us improve AI Co-Founder!",
      });
      setFeedbackMessage('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send feedback. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-accent transition-colors uppercase tracking-widest">
            <HelpCircle className="w-4 h-4" /> Help & Support
          </button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[540px] bg-[#16181C] border-white/10 p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-8 pb-4 border-b border-white/5">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6 text-accent" />
            </div>
            <SheetTitle className="text-3xl font-headline font-bold">Help & Support</SheetTitle>
            <SheetDescription>
              Your personal assistant for building world-changing ventures.
            </SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="guide" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="mx-8 mt-4 bg-white/5 p-1 h-auto grid grid-cols-3">
              <TabsTrigger value="guide" className="text-xs font-bold">Startup Guide</TabsTrigger>
              <TabsTrigger value="contact" className="text-xs font-bold">Contact & Feedback</TabsTrigger>
              <TabsTrigger value="account" className="text-xs font-bold">Account</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 p-8 pt-4">
              <TabsContent value="guide" className="mt-0 space-y-4">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  
                  <AccordionItem value="getting-started" className="border-white/5">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <FastForward className="w-5 h-5 text-accent" />
                        <span className="font-headline font-bold">Getting Started</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-4">
                      <p>
                        <strong>AI Co-Founder</strong> is an end-to-end platform that provides an AI Co-Founder to help you turn startup ideas into real, viable businesses.
                      </p>
                      <p className="text-sm">
                        Follow our 6-step roadmap: Idea Validation, Strategy Blueprint, Product Dev, Growth Plan, Financial Strategy, and Accountability.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="personas" className="border-white/5">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <Users2 className="w-5 h-5 text-accent" />
                        <span className="font-headline font-bold">Using AI Personas</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-4">
                      <p className="text-sm">Switch roles in the sidebar to access specialized toolkits:</p>
                      <div className="grid gap-4 mt-2">
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-blue-400 border-blue-400/20 gap-1"><Cpu className="w-3 h-3"/> AI CTO</Badge>
                          <p className="text-xs italic">Generates code, designs DB schemas, and architects system scaling.</p>
                        </div>
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-pink-400 border-pink-400/20 gap-1"><Megaphone className="w-3 h-3"/> AI CMO</Badge>
                          <p className="text-xs italic">Handles branding, SEO strategy, and social media launch plans.</p>
                        </div>
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 gap-1"><Banknote className="w-3 h-3"/> AI CFO</Badge>
                          <p className="text-xs italic">Models revenue streams, burn rates, and fundraising logic.</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="saving" className="border-white/5">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <Save className="w-5 h-5 text-accent" />
                        <span className="font-headline font-bold">Saving & Persistence</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-4">
                      <p className="text-sm">
                        While in Experiment Mode, your work is temporary. Log in to sync your <strong>Startup Brain</strong> and <strong>Venture Archive</strong> to the cloud securely via Firestore.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                </Accordion>
              </TabsContent>

              <TabsContent value="contact" className="mt-0 space-y-6">
                <form onSubmit={handleSubmitFeedback} className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Inquiry Type</Label>
                    <RadioGroup 
                      value={feedbackType} 
                      onValueChange={(val) => setFeedbackType(val as any)}
                      className="grid grid-cols-1 gap-2"
                    >
                      <div className={cn(
                        "flex items-center space-x-2 rounded-xl p-4 border transition-all cursor-pointer",
                        feedbackType === 'feedback' ? "bg-accent/10 border-accent/30" : "bg-white/5 border-white/5"
                      )}>
                        <RadioGroupItem value="feedback" id="feedback" className="border-accent" />
                        <Label htmlFor="feedback" className="flex-1 cursor-pointer flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-accent" /> Send Feedback
                        </Label>
                      </div>
                      <div className={cn(
                        "flex items-center space-x-2 rounded-xl p-4 border transition-all cursor-pointer",
                        feedbackType === 'bug' ? "bg-rose-500/10 border-rose-500/30" : "bg-white/5 border-white/5"
                      )}>
                        <RadioGroupItem value="bug" id="bug" className="border-rose-500" />
                        <Label htmlFor="bug" className="flex-1 cursor-pointer flex items-center gap-2">
                          <Bug className="w-4 h-4 text-rose-500" /> Report a Bug
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</Label>
                    <Textarea 
                      id="message"
                      placeholder="Share your ideas or issues..."
                      className="min-h-[150px] bg-white/5 border-white/5 focus:border-accent"
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-bold gap-2" disabled={isSubmitting}>
                    {isSubmitting ? <Sparkles className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                    Submit Report
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="account" className="mt-0 space-y-6">
                <div className="animate-in fade-in slide-in-from-right-4">
                  {user ? (
                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xl font-bold">
                            {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-headline font-bold text-lg">{user.displayName || 'Founder'}</h4>
                            <p className="text-xs text-muted-foreground">Verified Venture Lead</p>
                          </div>
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        className="w-full border-rose-500/20 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 font-bold gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center p-12 space-y-4 glass-card rounded-2xl border-dashed border-white/10">
                      <User className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                      <h3 className="text-xl font-headline font-bold">Not Signed In</h3>
                      <Button onClick={() => window.location.reload()} className="bg-accent text-accent-foreground font-bold">
                        Return to Dashboard
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
