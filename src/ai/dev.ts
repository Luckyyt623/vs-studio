import { config } from 'dotenv';
config();

import '@/ai/flows/code-completion.ts';
import '@/ai/flows/code-generation.ts';
import '@/ai/flows/documentation-generation.ts';
import '@/ai/flows/unit-test-creation.ts';
