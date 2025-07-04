import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export interface Context {
  req?: any;
  res?: any;
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        message: `Hello ${input.name || 'World'}!`,
      };
    }),
  
  getUsers: publicProcedure.query(() => {
    return {
      users: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ],
    };
  }),
});

export type AppRouter = typeof appRouter;