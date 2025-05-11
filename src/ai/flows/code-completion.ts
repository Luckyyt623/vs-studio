// file: src/ai/flows/code-completion.ts
'use server';
/**
 * @fileOverview AI-powered code completion flow.
 *
 * - aiCodeCompletion - A function that suggests code completions based on the current context.
 * - AiCodeCompletionInput - The input type for the aiCodeCompletion function.
 * - AiCodeCompletionOutput - The return type for the aiCodeCompletion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiCodeCompletionInputSchema = z.object({
  language: z.string().describe('The programming language of the code.'),
  codePrefix: z.string().describe('The existing code snippet to complete.'),
});
export type AiCodeCompletionInput = z.infer<typeof AiCodeCompletionInputSchema>;

const AiCodeCompletionOutputSchema = z.object({
  completion: z.string().describe('The suggested code completion.'),
});
export type AiCodeCompletionOutput = z.infer<typeof AiCodeCompletionOutputSchema>;

export async function aiCodeCompletion(input: AiCodeCompletionInput): Promise<AiCodeCompletionOutput> {
  return aiCodeCompletionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCodeCompletionPrompt',
  input: {schema: AiCodeCompletionInputSchema},
  output: {schema: AiCodeCompletionOutputSchema},
  prompt: `You are an AI code completion assistant. You will suggest the most likely code to follow the given prefix, in the given language.

Language: {{{language}}}
Code Prefix:
{{codePrefix}}`,
});

const aiCodeCompletionFlow = ai.defineFlow(
  {
    name: 'aiCodeCompletionFlow',
    inputSchema: AiCodeCompletionInputSchema,
    outputSchema: AiCodeCompletionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
