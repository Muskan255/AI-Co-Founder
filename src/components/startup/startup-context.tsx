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
import { aiSmartNotifications } from '@/ai/flows/ai-smart-notifications';
import { aiStartupHealthScore, HealthScoreOutput } from '@/ai/flows/ai-startup-health-score';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export type StartupStage = 'Idea Stage' | 'Validation Stage' | 'MVP Development' | 'Early Traction' | 'Growth Stage' | 'Scaling Stage';
export type StartupRole = 'AI CTO' | 'AI CMO' | 'AI CFO' | 'AI Product Manager' | 'AI Growth Hacker';

export interface StartupBrain {
  startup_idea?: string;
  target_market?: string;
  problem_statement?: string;
  value_proposition?: string;
  revenue_model?: string;
  product_features?: string;
  marketing_strategy?: string;
  financial_forecast?: string;
  competitors?: string;
  tech_stack?: string;
  customer_segments?: string;
  pricing_strategy?: string;
  growth_strategy?: string;
  funding_stage?: string;
}

export interface SmartNotification {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: number;
  read: boolean;
  action: {
    label: string;
    view: string;
  };
}

interface StartupState {
  projectId: string | null;
  projectName: string;
  rawIdea: string;
  stage: StartupStage;
  role: StartupRole;
  brain: StartupBrain;
  validation: IdeaValidationOutput | null;
  blueprint: AiStartupBlueprintGenerationOutput | null;
  productGuidance: AiProductDevelopmentGuidanceOutput | null;
  marketing: MarketingStrategyGenerationOutput | null;
  financialStrategy: FinancialStrategyGenerationOutput | null;
  tasks: AiTaskMilestoneManagementOutput | null;
  lastSimulation: AiStartupSimulationOutput | null;
  workspace: WorkspaceOutput | null;
  notifications: SmartNotification[];
  healthScore: HealthScoreOutput | null;
}

interface StartupContextType {
  state: StartupState;
  setProjectId: (id: string) => void;
  setProjectName: (name: string) => void;
  setRawIdea: (idea: string) => void;
  setStage: (stage: StartupStage) => void;
  setRole: (role: StartupRole) => void;
  updateBrain: (update: Partial<StartupBrain>) => void;
  setValidation: (v: IdeaValidationOutput) => void;
  setBlueprint: (b: AiStartupBlueprintGenerationOutput) => void;
  setProductGuidance: (p: AiProductDevelopmentGuidanceOutput) => void;
  setMarketing: (m: MarketingStrategyGenerationOutput) => void;
  setFinancialStrategy: (f: FinancialStrategyGenerationOutput) => void;
  setTasks: (t: AiTaskMilestoneManagementOutput) => void;
  setSimulation: (s: AiStartupSimulationOutput) => void;
  setWorkspace: (w: WorkspaceOutput) => void;
  loadProject: (project: any) => void;
  refreshSuggestions: () => Promise<void>;
  refreshHealthScore: () => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  reset: () => void;
  isHydrated: boolean;
  isGuestMode: boolean;
}

const StartupContext = createContext<StartupContextType | undefined>(undefined);

const DEFAULT_STATE: StartupState = {
  projectId: null,
  projectName: 'New Venture',
  rawIdea: '',
  stage: 'Idea Stage',
  role: 'AI Product Manager',
  brain: {},
  validation: null,
  blueprint: null,
  productGuidance: null,
  marketing: null,
  financialStrategy: null,
  tasks: null,
  lastSimulation: null,
  workspace: null,
  notifications: [],
  healthScore: null
};

export function StartupProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StartupState>(DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();

  const isGuestMode = !user;

  // Hydration logic: Load from localStorage but clear for guests on refresh if required
  useEffect(() => {
    const saved = localStorage.getItem('ai-founder-startup-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.isGuest && !user) {
          localStorage.removeItem('ai-founder-startup-state');
        } else {
          setState({
            ...DEFAULT_STATE,
            ...parsed,
            brain: parsed.brain || {},
            notifications: parsed.notifications || [],
            healthScore: parsed.healthScore || null
          });
        }
      } catch (error) {
        console.error('Failed to parse saved startup state:', error);
      }
    }
    setIsHydrated(true);
  }, [user]);

  // Persistence logic: Sync to localStorage and Firestore
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('ai-founder-startup-state', JSON.stringify({
        ...state,
        isGuest: isGuestMode
      }));
      
      if (user && firestore) {
        if (!state.projectId && state.rawIdea) {
          setProjectId(crypto.randomUUID());
          return;
        }

        if (state.projectId) {
          const projectRef = doc(firestore, 'users', user.uid, 'projects', state.projectId);
          
          const projectRecord = {
            project_id: state.projectId,
            user_id: user.uid,
            project_name: state.projectName,
            idea_description: state.rawIdea,
            startup_stage: state.stage,
            last_updated: serverTimestamp(),
            startup_brain: state.brain || {},
            fullState: state
          };

          setDoc(projectRef, projectRecord, { merge: true }).catch(err => {
            console.error("Firestore sync error:", err);
          });
        }
      }
    }
  }, [state, isHydrated, user, firestore, isGuestMode]);

  const refreshHealthScore = useCallback(async () => {
    if (!state.rawIdea) return;
    try {
      const response = await aiStartupHealthScore({
        brain: state.brain as any,
        currentStage: state.stage
      });
      setState(prev => ({ ...prev, healthScore: response }));
    } catch (error) {
      console.error('Failed to refresh health score:', error);
    }
  }, [state.brain, state.stage, state.rawIdea]);

  const refreshSuggestions = useCallback(async () => {
    if (!state.rawIdea) return;
    try {
      const response = await aiSmartNotifications({
        brain: state.brain as any,
        currentStage: state.stage
      });

      const newNotifications: SmartNotification[] = response.suggestions.map(s => ({
        ...s,
        timestamp: Date.now(),
        read: false
      }));

      setState(prev => {
        const existingTitles = new Set(prev.notifications.map(n => n.title));
        const uniqueNew = newNotifications.filter(n => !existingTitles.has(n.title));
        
        return {
          ...prev,
          notifications: [...uniqueNew, ...prev.notifications].slice(0, 10)
        };
      });
    } catch (error) {
      console.error('Failed to refresh suggestions:', error);
    }
  }, [state.brain, state.stage, state.rawIdea]);

  // Auto-refresh when brain or stage changes
  useEffect(() => {
    if (state.rawIdea) {
      refreshSuggestions();
      refreshHealthScore();
    }
  }, [state.brain, state.stage, state.rawIdea, refreshSuggestions, refreshHealthScore]);

  const markNotificationAsRead = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  };

  const dismissNotification = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  };

  const setProjectId = (id: string) => setState(prev => ({ ...prev, projectId: id }));
  const setProjectName = (name: string) => setState(prev => ({ ...prev, projectName: name }));
  
  const setRawIdea = (idea: string) => {
    setState(prev => ({ 
      ...prev, 
      rawIdea: idea,
      brain: { ...prev.brain, startup_idea: idea } 
    }));
  };
  
  const updateBrain = (update: Partial<StartupBrain>) => {
    setState(prev => ({
      ...prev,
      brain: { ...prev.brain, ...update }
    }));
  };

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
      return { ...prev, stage, role, brain: { ...prev.brain, funding_stage: stage } };
    });
  };

  const setRole = (role: StartupRole) => setState(prev => ({ ...prev, role }));
  
  const setValidation = (v: IdeaValidationOutput) => {
    setState(prev => {
      const brainUpdate: StartupBrain = {
        target_market: v.target_market,
        problem_statement: v.problemSolved,
        competitors: v.competitors
      };
      return { 
        ...prev, 
        validation: v, 
        stage: 'Validation Stage', 
        role: 'AI CMO',
        brain: { ...prev.brain, ...brainUpdate },
        projectId: prev.projectId || crypto.randomUUID()
      };
    });
  };

  const setBlueprint = (b: AiStartupBlueprintGenerationOutput) => {
    setState(prev => {
      const brainUpdate: StartupBrain = {
        value_proposition: b.value_proposition,
        revenue_model: b.revenueStreams,
        pricing_strategy: b.pricingStrategy
      };
      return { 
        ...prev, 
        blueprint: b, 
        stage: 'MVP Development', 
        role: 'AI CTO',
        brain: { ...prev.brain, ...brainUpdate }
      };
    });
  };

  const setProductGuidance = (p: AiProductDevelopmentGuidanceOutput) => {
    setState(prev => {
      const brainUpdate: StartupBrain = {
        tech_stack: `${p.techStack.frontend}, ${p.techStack.backend}, ${p.techStack.database}`,
        product_features: p.mvpFeatures.join(', ')
      };
      return { 
        ...prev, 
        productGuidance: p, 
        stage: 'Early Traction', 
        role: 'AI Growth Hacker',
        brain: { ...prev.brain, ...brainUpdate }
      };
    });
  };

  const setMarketing = (m: MarketingStrategyGenerationOutput) => {
    setState(prev => {
      const brainUpdate: StartupBrain = {
        marketing_strategy: m.brandPositioning,
        growth_strategy: m.userAcquisition.join(', ')
      };
      return { 
        ...prev, 
        marketing: m, 
        stage: 'Growth Stage', 
        role: 'AI CMO',
        brain: { ...prev.brain, ...brainUpdate }
      };
    });
  };

  const setFinancialStrategy = (f: FinancialStrategyGenerationOutput) => {
    setState(prev => {
      const brainUpdate: StartupBrain = {
        financial_forecast: f.revenueForecast,
        revenue_model: f.pricingModels.map(p => p.model).join(', ')
      };
      return { 
        ...prev, 
        financialStrategy: f,
        brain: { ...prev.brain, ...brainUpdate }
      };
    });
  };

  const setTasks = (t: AiTaskMilestoneManagementOutput) => {
    setState(prev => ({ ...prev, tasks: t, stage: 'Scaling Stage', role: 'AI CFO' }));
  }
  const setSimulation = (s: AiStartupSimulationOutput) => setState(prev => ({ ...prev, lastSimulation: s }));
  
  const setWorkspace = (w: WorkspaceOutput) => {
    setState(prev => {
      const brainUpdate: StartupBrain = {
        marketing_strategy: w.marketingPlan.strategy,
        tech_stack: `${w.productSpecs.techStack.frontend}, ${w.productSpecs.techStack.backend}`,
        product_features: w.productSpecs.mvpFeatures.join(', ')
      };
      return { 
        ...prev, 
        workspace: w,
        brain: { ...prev.brain, ...brainUpdate },
        projectId: prev.projectId || crypto.randomUUID()
      };
    });
  };
  
  const loadProject = (projectData: any) => {
    if (projectData.fullState) {
      setState({
        ...projectData.fullState,
        brain: projectData.fullState.brain || {},
        notifications: projectData.fullState.notifications || [],
        healthScore: projectData.fullState.healthScore || null
      });
    } else {
      setState({
        ...DEFAULT_STATE,
        projectId: projectData.project_id || projectData.id,
        projectName: projectData.project_name || 'Restored Project',
        rawIdea: projectData.idea_description || '',
        stage: (projectData.startup_stage || projectData.progress_status) as StartupStage,
        brain: projectData.startup_brain || {}
      });
    }
  };

  const reset = () => {
    setState(DEFAULT_STATE);
    localStorage.removeItem('ai-founder-startup-state');
  };

  return (
    <StartupContext.Provider value={{ 
      state, 
      setProjectId,
      setProjectName,
      setRawIdea, 
      setStage,
      setRole,
      updateBrain,
      setValidation, 
      setBlueprint, 
      setProductGuidance, 
      setMarketing, 
      setFinancialStrategy,
      setTasks,
      setSimulation,
      setWorkspace,
      loadProject,
      refreshSuggestions,
      refreshHealthScore,
      markNotificationAsRead,
      dismissNotification,
      reset,
      isHydrated,
      isGuestMode
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
