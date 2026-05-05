'use server';
/**
 * @fileOverview This file defines the generateOutfitRecommendations flow, which takes user profile data
 * and generates personalized outfit recommendations using a generative AI model enhanced with
 * KNN-based color matching from the Kaggle dataset.
 *
 * - generateOutfitRecommendations - The main function to generate outfit recommendations.
 * - GenerateOutfitRecommendationsInput - The input type for the generateOutfitRecommendations function.
 * - GenerateOutfitRecommendationsOutput - The output type for the generateOutfitRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getColorRecommendations, getFallbackColorRecommendations, checkServiceHealth } from '@/lib/color-api';

const GenerateOutfitRecommendationsInputSchema = z.object({
  gender: z.string().describe("The user's gender (e.g., male, female)."),
  bodyType: z.string().describe('The user\'s body type (e.g., pear-shaped, apple-shaped, hourglass).'),
  skinTone: z.string().describe('The user\'s skin tone (e.g., fair, light, medium, dark).'),
  preferredStyles: z.array(z.string()).describe('The user\'s preferred clothing styles (e.g., casual, formal, bohemian).'),
  occasion: z.string().optional().describe('The occasion for which the outfit is being recommended (e.g., work, party, everyday).'),
  weather: z.string().optional().describe('The current weather conditions (e.g., sunny, rainy, cold).'),
});
export type GenerateOutfitRecommendationsInput = z.infer<typeof GenerateOutfitRecommendationsInputSchema>;

const GenerateOutfitRecommendationsOutputSchema = z.object({
  outfitRecommendations: z.array(z.string()).describe('An array of outfit recommendations based on the user\'s profile data.'),
  styleGuide: z.string().describe('A detailed style guide explaining why the suggested outfits work well for the user\'s features, including color palettes, cuts, and materials.'),
});
export type GenerateOutfitRecommendationsOutput = z.infer<typeof GenerateOutfitRecommendationsOutputSchema>;

export async function generateOutfitRecommendations(input: GenerateOutfitRecommendationsInput): Promise<GenerateOutfitRecommendationsOutput> {
  return generateOutfitRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOutfitRecommendationsPrompt',
  input: {
    schema: GenerateOutfitRecommendationsInputSchema.extend({
      colorRecommendations: z.object({
        shirts: z.array(z.string()),
        pants: z.array(z.string()),
        colors_to_avoid: z.array(z.string()),
      }).optional(),
    })
  },
  output: { schema: GenerateOutfitRecommendationsOutputSchema },
  prompt: `You are a personal stylist AI assistant. Your goal is to generate personalized outfit recommendations based on the user's profile data and data-driven color analysis.

Here is the user's profile data:

Gender: {{{gender}}}
Body Type: {{{bodyType}}}
Skin Tone: {{{skinTone}}}
Preferred Styles: {{#each preferredStyles}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{#if occasion}}Occasion: {{{occasion}}}{{/if}}
{{#if weather}}Weather: {{{weather}}}{{/if}}

{{#if colorRecommendations}}
IMPORTANT - Data-Driven Color Analysis (from KNN algorithm trained on fashion dataset):

Recommended Shirt Colors for this skin tone: {{#each colorRecommendations.shirts}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Recommended Pants Colors for this skin tone: {{#each colorRecommendations.pants}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Colors to Avoid: {{#each colorRecommendations.colors_to_avoid}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Please PRIORITIZE these scientifically-matched colors in your recommendations, as they are based on real fashion data and color theory analysis.
{{/if}}

Generate outfit recommendations that complement their features. Take into account the data-driven color matches above, current trends, and individual preferences.

Also, provide a detailed style guide explaining why the suggested outfits work well for the user's features, including color palettes, cuts, and materials. Reference the data-driven color analysis when explaining color choices.

Output the outfit recommendations in an array of strings. Each string should be a complete outfit description.
Output the style guide as a single string.

Make the outfit recommendations concise and easy to understand.
Make the style guide detailed and informative.

Your output should be in JSON format:

{
  "outfitRecommendations": ["Outfit 1 description", "Outfit 2 description", ...],
  "styleGuide": "Style guide description"
}
`,
});

const generateOutfitRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateOutfitRecommendationsFlow',
    inputSchema: GenerateOutfitRecommendationsInputSchema,
    outputSchema: GenerateOutfitRecommendationsOutputSchema,
  },
  async input => {
    // Try to get color recommendations from the Python backend
    let colorRecs = null;

    try {
      // Check if service is available
      const health = await checkServiceHealth();

      if (health.healthy) {
        // Get color recommendations
        colorRecs = await getColorRecommendations({
          skinTone: input.skinTone,
          bodyType: input.bodyType,
          gender: input.gender,
          occasion: input.occasion,
          weather: input.weather,
        });
      }
    } catch (error) {
      console.log('Color service unavailable, using fallback');
    }

    // If service unavailable, use fallback
    if (!colorRecs) {
      colorRecs = getFallbackColorRecommendations(input.skinTone);
    }

    // Enhance the input with color recommendations
    const enhancedInput = {
      ...input,
      colorRecommendations: colorRecs ? {
        shirts: colorRecs.shirts,
        pants: colorRecs.pants,
        colors_to_avoid: colorRecs.colors_to_avoid,
      } : undefined,
    };

    const { output } = await prompt(enhancedInput);
    return output!;
  }
);
