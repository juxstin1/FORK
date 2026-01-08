import { create } from "zustand";
import type { RorkProject, Stage } from "../types/rork";

interface AppState {
  project: RorkProject | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProject: (project: RorkProject) => void;
  setStage: (stage: Stage) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  project: null,
  isLoading: false,
  error: null,

  setProject: (project) => set({ project }),
  setStage: (stage) =>
    set((state) => ({
      project: state.project ? { ...state.project, stage } : null,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ project: null, isLoading: false, error: null }),
}));
