'use server';

import { generateOutfitRecommendations, type GenerateOutfitRecommendationsInput } from '@/ai/flows/generate-outfit-recommendations';

export async function getOutfitRecommendations(input: GenerateOutfitRecommendationsInput) {
  // Add some basic validation or sanitation if needed
  if (!input.bodyType || !input.skinTone || !input.preferredStyles) {
    throw new Error('Missing required user profile data.');
  }

  try {
    const recommendations = await generateOutfitRecommendations(input);
    return recommendations;
  } catch (error) {
    console.error('Error generating outfit recommendations:', error);
    // Re-throw a generic error to the client
    throw new Error('Failed to get recommendations from AI.');
  }
}
