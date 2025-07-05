// This file exports only the types needed for the client
import type { AppRouter } from './trpc.router';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export type { AppRouter };
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;