'use server';
/**
 * @fileOverview AI-powered unit test creation flow.
 *
 * - aiUnitTestCreation - A function that generates unit tests for a given code snippet.
 * - AiUnitTestCreationInput - The input type for the aiUnitTestCreation function.
 * - AiUnitTestCreationOutput - The return type for the aiUnitTestCreation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiUnitTestCreationInputSchema = z.object({
  language: z.string().describe('The programming language of the code.'),
  code: z.string().describe('The code snippet to generate unit tests for.'),
  framework: z.string().optional().describe('The testing framework to use (e.g., Jest, PyTest, JUnit).'),
});
export type AiUnitTestCreationInput = z.infer<typeof AiUnitTestCreationInputSchema>;

const AiUnitTestCreationOutputSchema = z.object({
  testCases: z.string().describe('The generated unit test code.'),
});
export type AiUnitTestCreationOutput = z.infer<typeof AiUnitTestCreationOutputSchema>;

export async function aiUnitTestCreation(input: AiUnitTestCreationInput): Promise<AiUnitTestCreationOutput> {
  return aiUnitTestCreationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiUnitTestCreationPrompt',
  input: {schema: AiUnitTestCreationInputSchema},
  output: {schema: AiUnitTestCreationOutputSchema},
  prompt: `You are an AI assistant that generates unit tests.
Given the following code snippet and programming language, write comprehensive unit tests.
{{#if framework}}Use the {{{framework}}} testing framework.{{/if}}
If no framework is specified, use a common and modern testing framework for the language (e.g., Jest for JavaScript/TypeScript, PyTest for Python, JUnit 5 for Java, XUnit or MSTest for C#).

Language: {{{language}}}
Code:
\`\`\`{{{language}}}
{{{code}}}
\`\`\`

Generate the unit tests now. Ensure good coverage of edge cases and typical scenarios. Only output the test code itself, without any surrounding text or explanations.`,
});

const aiUnitTestCreationFlow = ai.defineFlow(
  {
    name: 'aiUnitTestCreationFlow',
    inputSchema: AiUnitTestCreationInputSchema,
    outputSchema: AiUnitTestCreationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
