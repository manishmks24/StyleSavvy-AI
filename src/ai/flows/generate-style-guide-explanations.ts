'use server';
/**
 * @fileOverview Generates a style guide explanation for a given outfit recommendation based on user features.
 *
 * - generateStyleGuideExplanations - A function that generates style guide explanations.
 * - GenerateStyleGuideExplanationsInput - The input type for the generateStyleGuideExplanations function.
 * - GenerateStyleGuideExplanationsOutput - The return type for the generateStyleGuideExplanations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStyleGuideExplanationsInputSchema = z.object({
  gender: z.string().describe("The user's gender (e.g., male, female)."),
  bodyType: z.string().describe('The user\'s body type (e.g., hourglass, apple, pear).'),
  skinTone: z.string().describe('The user\'s skin tone (e.g., fair, medium, olive, dark).'),
  preferredStyles: z.string().describe('The user\'s preferred styles (e.g., casual, formal, bohemian).'),
  outfitRecommendation: z.string().describe('A description of the recommended outfit.'),
});
export type GenerateStyleGuideExplanationsInput = z.infer<
  typeof GenerateStyleGuideExplanationsInputSchema
>;

const GenerateStyleGuideExplanationsOutputSchema = z.object({
  styleGuideExplanation: z
    .string()
    .describe(
      'An explanation of why the recommended outfit works well for the user\'s features, including details on color palettes, cuts, and materials.'
    ),
});
export type GenerateStyleGuideExplanationsOutput = z.infer<
  typeof GenerateStyleGuideExplanationsOutputSchema
>;

export async function generateStyleGuideExplanations(
  input: GenerateStyleGuideExplanationsInput
): Promise<GenerateStyleGuideExplanationsOutput> {
  return generateStyleGuideExplanationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStyleGuideExplanationsPrompt',
  input: {schema: GenerateStyleGuideExplanationsInputSchema},
  output: {schema: GenerateStyleGuideExplanationsOutputSchema},
  prompt: `You are a personal stylist expert. Generate a style guide explanation for the following outfit recommendation based on the user's body type, skin tone, and preferred styles.

User Gender: {{{gender}}}
User Body Type: {{{bodyType}}}
User Skin Tone: {{{skinTone}}}
User Preferred Styles: {{{preferredStyles}}}
Outfit Recommendation: {{{outfitRecommendation}}}

Explain why the recommended outfit works well for the user's features, including details on color palettes, cuts, and materials. Focus on providing a style guide explanation that is personalized, clear, and actionable.
`,
});

const generateStyleGuideExplanationsFlow = ai.defineFlow(
  {
    name: 'generateStyleGuideExplanationsFlow',
    inputSchema: GenerateStyleGuideExplanationsInputSchema,
    outputSchema: GenerateStyleGuideExplanationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
