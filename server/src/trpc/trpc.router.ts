import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';

export interface Context {
  req?: any;
  res?: any;
  authService?: AuthService;
  prisma?: PrismaService;
  user?: { userId: string; email: string; role: string };
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware to check if user is authenticated
const isAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Middleware to check if user is admin
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuth);
export const adminProcedure = t.procedure.use(isAdmin);

// Auth router
const authRouter = router({
  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.authService) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
      return ctx.authService.register(input.email, input.password, input.name);
    }),

  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.authService) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
      return ctx.authService.login(input.email, input.password);
    }),

  me: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.authService || !ctx.user) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
      return ctx.authService.getUserById(ctx.user.userId);
    }),

  logout: protectedProcedure
    .mutation(async () => {
      // In a real app, you might invalidate the token here
      return { success: true };
    }),
});

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        message: `Hello ${input.name || 'World'}!`,
      };
    }),
  
  auth: authRouter,
});

export type AppRouter = typeof appRouter;