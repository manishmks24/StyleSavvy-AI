import type { GenerateOutfitRecommendationsOutput } from "@/ai/flows/generate-outfit-recommendations";

export type Outfit = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type SavedOutfit = Outfit & {
  savedAt: string;
};

export type RecommendationResult = GenerateOutfitRecommendationsOutput;
