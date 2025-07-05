import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';

/**
 * We use a generic type parameter here because the actual AppRouter type
 * is defined in the server. In a production app, you would:
 * 
 * 1. Use a monorepo with shared types
 * 2. Generate types from the server and import them
 * 3. Use a separate types package
 * 
 * For now, we're using a generic to avoid complex build setups while
 * still maintaining basic type safety through our api-types definitions.
 */
export const trpc = createTRPCReact<any>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/trpc`,
      headers() {
        const token = localStorage.getItem('token');
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});