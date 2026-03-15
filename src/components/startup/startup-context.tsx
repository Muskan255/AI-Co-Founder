"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IdeaValidationOutput } from '@/ai/flows/ai-idea-validation';
import { AiStartupBlueprintGenerationOutput } from '@/ai/flows/ai-startup-blueprint-generation';
import { AiProductDevelopmentGuidanceOutput } from '@/ai/flows/ai-product-development-guidance';
import { MarketingStrategyGenerationOutput } from '@/ai/flows/ai-marketing-strategy-generation';
import { AiTaskMilestoneManagementOutput } from '@/ai/flows/ai-task-milestone-management';

interface StartupState {
  rawIdea: string;
  validation: IdeaValidationOutput | null;
  blueprint: AiStartupBlueprintGenerationOutput | null;
  productGuidance: AiProductDevelopmentGuidanceOutput | null;
  marketing: MarketingStrategyGenerationOutput | null;
  tasks: AiTaskMilestoneManagementOutput | null;
}

interface StartupContextType {
  state: StartupState;
  setRawIdea: (idea: string) => void;
  setValidation: (v: IdeaValidationOutput) => void;
  setBlueprint: (b: AiStartupBlueprintGenerationOutput) => void;
  setProductGuidance: (p: AiProductDevelopmentGuidanceOutput) => void;
  setMarketing: (m: MarketingStrategyGenerationOutput) => void;
  setTasks: (t: AiTaskMilestoneManagementOutput) => void;
  reset: () => void;
}

const StartupContext = createContext<StartupContextType | undefined>(undefined);

export function StartupProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StartupState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('co-pilot-startup-state');
      return saved ? JSON.parse(saved) : {
        rawIdea: '',
        validation: null,
        blueprint: null,
        productGuidance: null,
        marketing: null,
        tasks: null
      };
    }
    return {
      rawIdea: '',
      validation: null,
      blueprint: null,
      productGuidance: null,
      marketing: null,
      tasks: null
    };
  });

  useEffect(() => {
    localStorage.setItem('co-pilot-startup-state', JSON.stringify(state));
  }, [state]);

  const setRawIdea = (idea: string) => setState(prev => ({ ...prev, rawIdea: idea }));
  const setValidation = (v: IdeaValidationOutput) => setState(prev => ({ ...prev, validation: v }));
  const setBlueprint = (b: AiStartupBlueprintGenerationOutput) => setState(prev => ({ ...prev, blueprint: b }));
  const setProductGuidance = (p: AiProductDevelopmentGuidanceOutput) => setState(prev => ({ ...prev, productGuidance: p }));
  const setMarketing = (m: MarketingStrategyGenerationOutput) => setState(prev => ({ ...prev, marketing: m }));
  const setTasks = (t: AiTaskMilestoneManagementOutput) => setState(prev => ({ ...prev, tasks: t }));
  const reset = () => {
    setState({
      rawIdea: '',
      validation: null,
      blueprint: null,
      productGuidance: null,
      marketing: null,
      tasks: null
    });
  };

  return (
    <StartupContext.Provider value={{ 
      state, 
      setRawIdea, 
      setValidation, 
      setBlueprint, 
      setProductGuidance, 
      setMarketing, 
      setTasks,
      reset
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
