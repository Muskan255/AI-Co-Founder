"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IdeaValidationOutput } from '@/ai/flows/ai-idea-validation';
import { AiStartupBlueprintGenerationOutput } from '@/ai/flows/ai-startup-blueprint-generation';
import { AiProductDevelopmentGuidanceOutput } from '@/ai/flows/ai-product-development-guidance';
import { MarketingStrategyGenerationOutput } from '@/ai/flows/ai-marketing-strategy-generation';
import { FinancialStrategyGenerationOutput } from '@/ai/flows/ai-financial-strategy-generation';
import { AiTaskMilestoneManagementOutput } from '@/ai/flows/ai-task-milestone-management';
import { AiStartupSimulationOutput } from '@/ai/flows/ai-startup-simulation';
import { WorkspaceOutput } from '@/ai/flows/ai-workspace-generation';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp, getDocs, collection, query, orderBy, limit } from 'firebase/firestore';

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
  financialStrategy: FinancialStrategyGenerationOutput | null;
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
  setFinancialStrategy: (f: FinancialStrategyGenerationOutput) => void;
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
  financialStrategy: null,
  tasks: null,
  lastSimulation: null,
  workspace: null
};

export function StartupProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StartupState>(DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();

  // Load from Local Storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai-founder-startup-state');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved startup state:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Sync to Local Storage and Firestore (Auto-Save)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('ai-founder-startup-state', JSON.stringify(state));
      
      if (user && state.projectId && firestore) {
        const projectRef = doc(firestore, 'users', user.uid, 'projects', state.projectId);
        
        const projectRecord = {
          project_id: state.projectId,
          user_id: user.uid,
          project_name: state.projectName,
          idea_description: state.rawIdea,
          startup_stage: state.stage,
          strategy_blueprint: state.blueprint || null,
          financial_plan: state.financialStrategy || null,
          product_development: state.productGuidance || null,
          growth_plan: state.marketing || null,
          simulations: state.lastSimulation ? [state.lastSimulation] : [],
          last_updated: serverTimestamp(),
          fullState: state
        };

        setDoc(projectRef, projectRecord, { merge: true });
      }
    }
  }, [state, isHydrated, user, firestore]);

  // Session Restore: Fetch latest venture on login if local state is empty
  useEffect(() => {
    if (isHydrated && user && firestore && !state.projectId && state.rawIdea === '') {
      const projectsRef = collection(firestore, 'users', user.uid, 'projects');
      const q = query(projectsRef, orderBy('last_updated', 'desc'), limit(1));
      
      getDocs(q).then((snapshot) => {
        if (!snapshot.empty) {
          const latestProject = snapshot.docs[0].data();
          loadProject(latestProject);
        }
      });
    }
  }, [isHydrated, user, firestore, state.projectId, state.rawIdea]);

  const setProjectId = (id: string) => setState(prev => ({ ...prev, projectId: id }));
  const setProjectName = (name: string) => setState(prev => ({ ...prev, projectName: name }));
  const setRawIdea = (idea: string) => setState(prev => ({ ...prev, rawIdea: idea }));
  
  const setStage = (stage: StartupStage) => {
    setState(prev => {
      let role: StartupRole = prev.role;
      switch (stage) {
        case 'Idea Stage': role = 'AI Product Manager'; break;
        case 'Validation Stage': role = 'AI CMO'; break;
        case 'MVP Development': role = 'AI CTO'; break;
        case 'Early Traction': role = 'AI Growth Hacker'; break;
        case 'Growth Stage': role = 'AI CMO'; break;
        case 'Scaling Stage': role = 'AI CFO'; break;
      }
      return { ...prev, stage, role };
    });
  };

  const setRole = (role: StartupRole) => setState(prev => ({ ...prev, role }));
  const setValidation = (v: IdeaValidationOutput) => setState(prev => ({ ...prev, validation: v, stage: 'Validation Stage', role: 'AI CMO' }));
  const setBlueprint = (b: AiStartupBlueprintGenerationOutput) => setState(prev => ({ ...prev, blueprint: b, stage: 'MVP Development', role: 'AI CTO' }));
  const setProductGuidance = (p: AiProductDevelopmentGuidanceOutput) => setState(prev => ({ ...prev, productGuidance: p, stage: 'Early Traction', role: 'AI Growth Hacker' }));
  const setMarketing = (m: MarketingStrategyGenerationOutput) => setState(prev => ({ ...prev, marketing: m, stage: 'Growth Stage', role: 'AI CMO' }));
  const setFinancialStrategy = (f: FinancialStrategyGenerationOutput) => setState(prev => ({ ...prev, financialStrategy: f }));
  const setTasks = (t: AiTaskMilestoneManagementOutput) => setState(prev => ({ ...prev, tasks: t, stage: 'Scaling Stage', role: 'AI CFO' }));
  const setSimulation = (s: AiStartupSimulationOutput) => setState(prev => ({ ...prev, lastSimulation: s }));
  const setWorkspace = (w: WorkspaceOutput) => setState(prev => ({ ...prev, workspace: w }));
  
  const loadProject = (projectData: any) => {
    if (projectData.fullState) {
      setState(projectData.fullState);
    } else {
      setState({
        ...DEFAULT_STATE,
        projectId: projectData.project_id || projectData.id,
        projectName: projectData.project_name || 'Restored Project',
        rawIdea: projectData.idea_description || '',
        stage: (projectData.startup_stage || projectData.progress_status) as StartupStage,
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
      setFinancialStrategy,
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
