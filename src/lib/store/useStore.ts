import { create } from 'zustand';
import { Entry } from '../supabase/types';

interface AppState {
  selectedEntry: Entry | null;
  setSelectedEntry: (entry: Entry | null) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedEntry: null,
  setSelectedEntry: (entry) => set({ selectedEntry: entry }),
  isSubmitting: false,
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
})); 