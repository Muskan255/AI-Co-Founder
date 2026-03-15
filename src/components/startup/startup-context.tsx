"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IdeaValidationOutput } from '@/ai/flows/ai-idea-validation';
import { AiStartupBlueprintGenerationOutput } from '@/ai/flows/ai-startup-blueprint-generation';
import { AiProductDevelopmentGuidanceOutput } from '@/ai/flows/ai-product-development-guidance';
import { MarketingStrategyGenerationOutput } from '@/ai/flows/ai-marketing-strategy-generation';
import { AiTaskMilestoneManagementOutput } from '@/ai/flows/ai-task-milestone-management';

export type StartupStage = 'Idea Stage' | 'Validation Stage' | 'MVP Development' | 'Early Traction' | 'Growth Stage' | 'Scaling Stage';

interface StartupState {
  rawIdea: string;
  stage: StartupStage;
  validation: IdeaValidationOutput | null;
  blueprint: AiStartupBlueprintGenerationOutput | null;
  productGuidance: AiProductDevelopmentGuidanceOutput | null;
  marketing: MarketingStrategyGenerationOutput | null;
  tasks: AiTaskMilestoneManagementOutput | null;
}

interface StartupContextType {
  state: StartupState;
  setRawIdea: (idea: string) => void;
  setStage: (stage: StartupStage) => void;
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
        stage: 'Idea Stage',
        validation: null,
        blueprint: null,
        productGuidance: null,
        marketing: null,
        tasks: null
      };
    }
    return {
      rawIdea: '',
      stage: 'Idea Stage',
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
  const setStage = (stage: StartupStage) => setState(prev => ({ ...prev, stage }));
  const setValidation = (v: IdeaValidationOutput) => setState(prev => ({ ...prev, validation: v, stage: 'Validation Stage' }));
  const setBlueprint = (b: AiStartupBlueprintGenerationOutput) => setState(prev => ({ ...prev, blueprint: b, stage: 'MVP Development' }));
  const setProductGuidance = (p: AiProductDevelopmentGuidanceOutput) => setState(prev => ({ ...prev, productGuidance: p, stage: 'Early Traction' }));
  const setMarketing = (m: MarketingStrategyGenerationOutput) => setState(prev => ({ ...prev, marketing: m, stage: 'Growth Stage' }));
  const setTasks = (t: AiTaskMilestoneManagementOutput) => setState(prev => ({ ...prev, tasks: t, stage: 'Scaling Stage' }));
  
  const reset = () => {
    setState({
      rawIdea: '',
      stage: 'Idea Stage',
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
      setStage,
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
