'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { SavedOutfit, Outfit } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface SavedOutfitsContextType {
  savedOutfits: SavedOutfit[];
  addOutfit: (outfit: Outfit) => void;
  removeOutfit: (outfitId: string) => void;
  isOutfitSaved: (outfitId: string) => boolean;
}

const SavedOutfitsContext = createContext<SavedOutfitsContextType | undefined>(undefined);

export const SavedOutfitsProvider = ({ children }: { children: ReactNode }) => {
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const item = window.localStorage.getItem('savedOutfits');
      if (item) {
        setSavedOutfits(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to read from localStorage', error);
    }
  }, []);

  const updateLocalStorage = (outfits: SavedOutfit[]) => {
    try {
      window.localStorage.setItem('savedOutfits', JSON.stringify(outfits));
    } catch (error) {
      console.error('Failed to write to localStorage', error);
    }
  };

  const addOutfit = (outfit: Outfit) => {
    setSavedOutfits((prevOutfits) => {
      if (prevOutfits.some((o) => o.id === outfit.id)) {
        return prevOutfits; // Already saved
      }
      const newOutfit: SavedOutfit = { ...outfit, savedAt: new Date().toISOString() };
      const newOutfits = [newOutfit, ...prevOutfits];
      updateLocalStorage(newOutfits);
      toast({
        title: "Outfit Saved!",
        description: "You can view your saved outfits on the Saved page.",
      });
      return newOutfits;
    });
  };

  const removeOutfit = (outfitId: string) => {
    setSavedOutfits((prevOutfits) => {
      const newOutfits = prevOutfits.filter((o) => o.id !== outfitId);
      updateLocalStorage(newOutfits);
      toast({
        title: "Outfit Removed",
        variant: "destructive"
      });
      return newOutfits;
    });
  };

  const isOutfitSaved = useCallback((outfitId: string) => {
    return savedOutfits.some((o) => o.id === outfitId);
  }, [savedOutfits]);

  return (
    <SavedOutfitsContext.Provider value={{ savedOutfits, addOutfit, removeOutfit, isOutfitSaved }}>
      {children}
    </SavedOutfitsContext.Provider>
  );
};

export const useSavedOutfits = () => {
  const context = useContext(SavedOutfitsContext);
  if (context === undefined) {
    throw new Error('useSavedOutfits must be used within a SavedOutfitsProvider');
  }
  return context;
};
