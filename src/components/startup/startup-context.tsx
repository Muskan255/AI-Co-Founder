"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IdeaValidationOutput } from '@/ai/flows/ai-idea-validation';
import { AiStartupBlueprintGenerationOutput } from '@/ai/flows/ai-startup-blueprint-generation';
import { AiProductDevelopmentGuidanceOutput } from '@/ai/flows/ai-product-development-guidance';
import { MarketingStrategyGenerationOutput } from '@/ai/flows/ai-marketing-strategy-generation';
import { AiTaskMilestoneManagementOutput } from '@/ai/flows/ai-task-milestone-management';
import { AiStartupSimulationOutput } from '@/ai/flows/ai-startup-simulation';

export type StartupStage = 'Idea Stage' | 'Validation Stage' | 'MVP Development' | 'Early Traction' | 'Growth Stage' | 'Scaling Stage';
export type StartupRole = 'AI CTO' | 'AI CMO' | 'AI CFO' | 'AI Product Manager' | 'AI Growth Hacker';

interface StartupState {
  rawIdea: string;
  stage: StartupStage;
  role: StartupRole;
  validation: IdeaValidationOutput | null;
  blueprint: AiStartupBlueprintGenerationOutput | null;
  productGuidance: AiProductDevelopmentGuidanceOutput | null;
  marketing: MarketingStrategyGenerationOutput | null;
  tasks: AiTaskMilestoneManagementOutput | null;
  lastSimulation: AiStartupSimulationOutput | null;
}

interface StartupContextType {
  state: StartupState;
  setRawIdea: (idea: string) => void;
  setStage: (stage: StartupStage) => void;
  setRole: (role: StartupRole) => void;
  setValidation: (v: IdeaValidationOutput) => void;
  setBlueprint: (b: AiStartupBlueprintGenerationOutput) => void;
  setProductGuidance: (p: AiProductDevelopmentGuidanceOutput) => void;
  setMarketing: (m: MarketingStrategyGenerationOutput) => void;
  setTasks: (t: AiTaskMilestoneManagementOutput) => void;
  setSimulation: (s: AiStartupSimulationOutput) => void;
  reset: () => void;
  isHydrated: boolean;
}

const StartupContext = createContext<StartupContextType | undefined>(undefined);

const DEFAULT_STATE: StartupState = {
  rawIdea: '',
  stage: 'Idea Stage',
  role: 'AI Product Manager',
  validation: null,
  blueprint: null,
  productGuidance: null,
  marketing: null,
  tasks: null,
  lastSimulation: null
};

export function StartupProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StartupState>(DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('co-pilot-startup-state');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved startup state:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('co-pilot-startup-state', JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const setRawIdea = (idea: string) => setState(prev => ({ ...prev, rawIdea: idea }));
  const setStage = (stage: StartupStage) => setState(prev => ({ ...prev, stage }));
  const setRole = (role: StartupRole) => setState(prev => ({ ...prev, role }));
  const setValidation = (v: IdeaValidationOutput) => setState(prev => ({ ...prev, validation: v, stage: 'Validation Stage' }));
  const setBlueprint = (b: AiStartupBlueprintGenerationOutput) => setState(prev => ({ ...prev, blueprint: b, stage: 'MVP Development' }));
  const setProductGuidance = (p: AiProductDevelopmentGuidanceOutput) => setState(prev => ({ ...prev, productGuidance: p, stage: 'Early Traction' }));
  const setMarketing = (m: MarketingStrategyGenerationOutput) => setState(prev => ({ ...prev, marketing: m, stage: 'Growth Stage' }));
  const setTasks = (t: AiTaskMilestoneManagementOutput) => setState(prev => ({ ...prev, tasks: t, stage: 'Scaling Stage' }));
  const setSimulation = (s: AiStartupSimulationOutput) => setState(prev => ({ ...prev, lastSimulation: s }));
  
  const reset = () => {
    setState(DEFAULT_STATE);
  };

  return (
    <StartupContext.Provider value={{ 
      state, 
      setRawIdea, 
      setStage,
      setRole,
      setValidation, 
      setBlueprint, 
      setProductGuidance, 
      setMarketing, 
      setTasks,
      setSimulation,
      reset,
      isHydrated
    }}>
      {children}
    </StartupContext.Provider>
  );
}

export function useStartup() {
  const context = useContext(StartupContext);
  if (!context) throw new Error('useStartup must be used within StartupProvider');
  return context;
}
