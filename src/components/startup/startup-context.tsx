"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IdeaValidationOutput } from '@/ai/flows/ai-idea-validation';
import { AiStartupBlueprintGenerationOutput } from '@/ai/flows/ai-startup-blueprint-generation';
import { AiProductDevelopmentGuidanceOutput } from '@/ai/flows/ai-product-development-guidance';
import { MarketingStrategyGenerationOutput } from '@/ai/flows/ai-marketing-strategy-generation';
import { AiTaskMilestoneManagementOutput } from '@/ai/flows/ai-task-milestone-management';
import { AiStartupSimulationOutput } from '@/ai/flows/ai-startup-simulation';
import { WorkspaceOutput } from '@/ai/flows/ai-workspace-generation';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export type StartupStage = 'Idea Stage' | 'Validation Stage' | 'MVP Development' | 'Early Traction' | 'Growth Stage' | 'Scaling Stage';
export type StartupRole = 'AI CTO' | 'AI CMO' | 'AI CFO' | 'AI Product Manager' | 'AI Growth Hacker';

interface StartupState {
  projectId: string | null;
  projectName: string;
  rawIdea: string;
  stage: StartupStage;
  role: StartupRole;
  validation: IdeaValidationOutput | null;
  blueprint: AiStartupBlueprintGenerationOutput | null;
  productGuidance: AiProductDevelopmentGuidanceOutput | null;
  marketing: MarketingStrategyGenerationOutput | null;
  tasks: AiTaskMilestoneManagementOutput | null;
  lastSimulation: AiStartupSimulationOutput | null;
  workspace: WorkspaceOutput | null;
}

interface StartupContextType {
  state: StartupState;
  setProjectId: (id: string) => void;
  setProjectName: (name: string) => void;
  setRawIdea: (idea: string) => void;
  setStage: (stage: StartupStage) => void;
  setRole: (role: StartupRole) => void;
  setValidation: (v: IdeaValidationOutput) => void;
  setBlueprint: (b: AiStartupBlueprintGenerationOutput) => void;
  setProductGuidance: (p: AiProductDevelopmentGuidanceOutput) => void;
  setMarketing: (m: MarketingStrategyGenerationOutput) => void;
  setTasks: (t: AiTaskMilestoneManagementOutput) => void;
  setSimulation: (s: AiStartupSimulationOutput) => void;
  setWorkspace: (w: WorkspaceOutput) => void;
  loadProject: (project: any) => void;
  reset: () => void;
  isHydrated: boolean;
}

const StartupContext = createContext<StartupContextType | undefined>(undefined);

const DEFAULT_STATE: StartupState = {
  projectId: null,
  projectName: 'New Venture',
  rawIdea: '',
  stage: 'Idea Stage',
  role: 'AI Product Manager',
  validation: null,
  blueprint: null,
  productGuidance: null,
  marketing: null,
  tasks: null,
  lastSimulation: null,
  workspace: null
};

export function StartupProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StartupState>(DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();

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

  // Sync to Firestore when state changes and project exists
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('co-pilot-startup-state', JSON.stringify(state));
      
      if (user && state.projectId && firestore) {
        const projectRef = doc(firestore, 'users', user.uid, 'projects', state.projectId);
        
        // Comprehensive record mapping for Startup Memory System
        const projectRecord = {
          project_id: state.projectId,
          project_name: state.projectName,
          idea_description: state.rawIdea,
          target_market: state.validation?.targetMarket || '',
          problem_statement: state.blueprint?.problemStatement || '',
          value_proposition: state.blueprint?.valueProposition || '',
          business_model: state.blueprint?.businessModel || '',
          MVP_features: state.productGuidance?.mvpFeatures || [],
          tech_stack: state.productGuidance?.techStack || {},
          marketing_strategy: state.marketing || {},
          funding_strategy: state.blueprint?.revenueStreams || '', // or a more specific field if added
          roadmap: state.productGuidance?.developmentRoadmap || [],
          progress_status: state.stage,
          created_at: state.projectId ? undefined : serverTimestamp(), // only set on create
          last_updated: serverTimestamp(),
          userId: user.uid,
          fullState: state
        };

        setDoc(projectRef, projectRecord, { merge: true });
      }
    }
  }, [state, isHydrated, user, firestore]);

  const setProjectId = (id: string) => setState(prev => ({ ...prev, projectId: id }));
  const setProjectName = (name: string) => setState(prev => ({ ...prev, projectName: name }));
  const setRawIdea = (idea: string) => setState(prev => ({ ...prev, rawIdea: idea }));
  const setStage = (stage: StartupStage) => setState(prev => ({ ...prev, stage }));
  const setRole = (role: StartupRole) => setState(prev => ({ ...prev, role }));
  const setValidation = (v: IdeaValidationOutput) => setState(prev => ({ ...prev, validation: v, stage: 'Validation Stage' }));
  const setBlueprint = (b: AiStartupBlueprintGenerationOutput) => setState(prev => ({ ...prev, blueprint: b, stage: 'MVP Development' }));
  const setProductGuidance = (p: AiProductDevelopmentGuidanceOutput) => setState(prev => ({ ...prev, productGuidance: p, stage: 'Early Traction' }));
  const setMarketing = (m: MarketingStrategyGenerationOutput) => setState(prev => ({ ...prev, marketing: m, stage: 'Growth Stage' }));
  const setTasks = (t: AiTaskMilestoneManagementOutput) => setState(prev => ({ ...prev, tasks: t, stage: 'Scaling Stage' }));
  const setSimulation = (s: AiStartupSimulationOutput) => setState(prev => ({ ...prev, lastSimulation: s }));
  const setWorkspace = (w: WorkspaceOutput) => setState(prev => ({ ...prev, workspace: w }));
  
  const loadProject = (projectData: any) => {
    if (projectData.fullState) {
      setState(projectData.fullState);
    } else {
      setState({
        ...DEFAULT_STATE,
        projectId: projectData.project_id,
        projectName: projectData.project_name,
        rawIdea: projectData.idea_description,
        stage: projectData.progress_status as StartupStage,
      });
    }
  };

  const reset = () => {
    setState(DEFAULT_STATE);
  };

  return (
    <StartupContext.Provider value={{ 
      state, 
      setProjectId,
      setProjectName,
      setRawIdea, 
      setStage,
      setRole,
      setValidation, 
      setBlueprint, 
      setProductGuidance, 
      setMarketing, 
      setTasks,
      setSimulation,
      setWorkspace,
      loadProject,
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