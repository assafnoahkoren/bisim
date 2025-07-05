// This script generates TypeScript types for the tRPC router
const fs = require('fs');
const path = require('path');

const routerTypeDefinition = `// Auto-generated file - DO NOT EDIT
// Generated from server tRPC router

import type { Procedure, Router } from '@trpc/server';

export type AppRouter = Router<{
  hello: Procedure<'query', {
    input: { name?: string };
    output: { message: string };
  }>;
  
  auth: Router<{
    register: Procedure<'mutation', {
      input: { email: string; password: string; name?: string };
      output: { token: string; user: { id: string; email: string; name: string | null; role: 'USER' | 'ADMIN' } };
    }>;
    
    login: Procedure<'mutation', {
      input: { email: string; password: string };
      output: { token: string; user: { id: string; email: string; name: string | null; role: 'USER' | 'ADMIN' } };
    }>;
    
    me: Procedure<'query', {
      input: void;
      output: { id: string; email: string; name: string | null; role: 'USER' | 'ADMIN' };
    }>;
    
    logout: Procedure<'mutation', {
      input: void;
      output: { success: boolean };
    }>;
  }>;
}>;
`;

// Ensure the directory exists
const outputDir = path.join(__dirname, '../webapp/src/types/generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the type definition
fs.writeFileSync(
  path.join(outputDir, 'router.d.ts'),
  routerTypeDefinition
);

console.log('Router types generated successfully!');