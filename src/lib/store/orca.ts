import { create } from 'zustand';

interface OrcaState {
  currentOrcaId: string | null;
  setCurrentOrcaId: (id: string | null) => void;
  syncFromUrl: () => void;
}

export const useOrcaStore = create<OrcaState>((set) => ({
  currentOrcaId: null,
  setCurrentOrcaId: (id) => set({ currentOrcaId: id }),
  syncFromUrl: () => {
    const params = new URLSearchParams(window.location.search);
    const orcaId = params.get('orca');
    if (orcaId) {
      set({ currentOrcaId: orcaId });
    }
  },
})); 