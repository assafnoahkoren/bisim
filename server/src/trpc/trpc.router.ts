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
});

export type AppRouter = typeof appRouter;