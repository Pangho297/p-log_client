import { create } from "zustand";

interface OwnerStore {
  isOwner: boolean;
  setIsOwner: (isOwner: boolean) => void;
}

export const useOwnerStore = create<OwnerStore>((set) => ({
  isOwner: false,
  setIsOwner: (isOwner) => set({ isOwner }),
}));
