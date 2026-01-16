'use server';
/**
 * @fileOverview This file defines the generateOutfitRecommendations flow, which takes user profile data
 * and generates personalized outfit recommendations using a generative AI model.
 *
 * - generateOutfitRecommendations - The main function to generate outfit recommendations.
 * - GenerateOutfitRecommendationsInput - The input type for the generateOutfitRecommendations function.
 * - GenerateOutfitRecommendationsOutput - The output type for the generateOutfitRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOutfitRecommendationsInputSchema = z.object({
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
  input: {schema: GenerateOutfitRecommendationsInputSchema},
  output: {schema: GenerateOutfitRecommendationsOutputSchema},
  prompt: `You are a personal stylist AI assistant. Your goal is to generate personalized outfit recommendations based on the user's profile data.

Here is the user's profile data:

Body Type: {{{bodyType}}}
Skin Tone: {{{skinTone}}}
Preferred Styles: {{#each preferredStyles}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{#if occasion}}Occasion: {{{occasion}}}{{/if}}
{{#if weather}}Weather: {{{weather}}}{{/if}}

Generate outfit recommendations that complement their features. Take into account color theory, current trends, and individual preferences.

Also, provide a detailed style guide explaining why the suggested outfits work well for the user's features, including color palettes, cuts, and materials.

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
    const {output} = await prompt(input);
    return output!;
  }
);
