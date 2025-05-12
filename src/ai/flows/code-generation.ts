'use server';
/**
 * @fileOverview AI-powered code generation flow.
 *
 * - aiCodeGeneration - A function that generates code based on a description.
 * - AiCodeGenerationInput - The input type for the aiCodeGeneration function.
 * - AiCodeGenerationOutput - The return type for the aiCodeGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiCodeGenerationInputSchema = z.object({
  language: z.string().describe('The programming language for the code to be generated.'),
  description: z.string().describe('A natural language description of the code to generate.'),
});
export type AiCodeGenerationInput = z.infer<typeof AiCodeGenerationInputSchema>;

const AiCodeGenerationOutputSchema = z.object({
  generatedCode: z.string().describe('The generated code snippet.'),
});
export type AiCodeGenerationOutput = z.infer<typeof AiCodeGenerationOutputSchema>;

export async function aiCodeGeneration(input: AiCodeGenerationInput): Promise<AiCodeGenerationOutput> {
  return aiCodeGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCodeGenerationPrompt',
  input: {schema: AiCodeGenerationInputSchema},
  output: {schema: AiCodeGenerationOutputSchema},
  prompt: `You are an AI code generation assistant. Generate a code snippet in the specified language based on the provided description.

Language: {{{language}}}
Description: {{{description}}}

Generate the code now. Only output the code itself, without any surrounding text or explanations.`,
});

const aiCodeGenerationFlow = ai.defineFlow(
  {
    name: 'aiCodeGenerationFlow',
    inputSchema: AiCodeGenerationInputSchema,
    outputSchema: AiCodeGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
