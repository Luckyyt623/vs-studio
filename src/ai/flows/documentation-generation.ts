'use server';
/**
 * @fileOverview AI-powered documentation generation flow.
 *
 * - aiDocumentationGeneration - A function that generates documentation for a given code snippet.
 * - AiDocumentationGenerationInput - The input type for the aiDocumentationGeneration function.
 * - AiDocumentationGenerationOutput - The return type for the aiDocumentationGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiDocumentationGenerationInputSchema = z.object({
  language: z.string().describe('The programming language of the code.'),
  code: z.string().describe('The code snippet to document.'),
});
export type AiDocumentationGenerationInput = z.infer<typeof AiDocumentationGenerationInputSchema>;

const AiDocumentationGenerationOutputSchema = z.object({
  documentation: z.string().describe('The generated documentation for the code.'),
});
export type AiDocumentationGenerationOutput = z.infer<typeof AiDocumentationGenerationOutputSchema>;

export async function aiDocumentationGeneration(input: AiDocumentationGenerationInput): Promise<AiDocumentationGenerationOutput> {
  return aiDocumentationGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDocumentationGenerationPrompt',
  input: {schema: AiDocumentationGenerationInputSchema},
  output: {schema: AiDocumentationGenerationOutputSchema},
  prompt: `You are an AI documentation assistant. Generate clear and concise documentation for the following code snippet.
The documentation should be formatted appropriately for the language (e.g., JSDoc for JavaScript, Python docstrings for Python, XML docs for C#).

Language: {{{language}}}
Code:
\`\`\`{{{language}}}
{{{code}}}
\`\`\`

Generate the documentation now. Explain what the code does, its parameters (if any), and its return value (if any). If it's UI code, describe the UI components and their behavior. Only output the documentation itself.`,
});

const aiDocumentationGenerationFlow = ai.defineFlow(
  {
    name: 'aiDocumentationGenerationFlow',
    inputSchema: AiDocumentationGenerationInputSchema,
    outputSchema: AiDocumentationGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
