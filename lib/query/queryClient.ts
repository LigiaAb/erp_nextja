// lib/query/queryClient.ts

import { MutationCache, QueryCache, QueryClient, type Mutation, type Query } from "@tanstack/react-query";

import { logQueryEvent, type AppQueryMeta } from "./queryLogger";

type AnyQuery = Query<unknown, unknown, unknown, readonly unknown[]>;
type AnyMutation = Mutation<unknown, unknown, unknown, unknown>;

function getQueryMeta(query: AnyQuery): AppQueryMeta | undefined {
  const q = query as AnyQuery & {
    meta?: unknown;
    options?: { meta?: unknown };
  };

  return (q.meta ?? q.options?.meta ?? undefined) as AppQueryMeta | undefined;
}

function getMutationMeta(mutation: AnyMutation): AppQueryMeta | undefined {
  const m = mutation as AnyMutation & {
    meta?: unknown;
    options?: { meta?: unknown };
  };

  return (m.meta ?? m.options?.meta ?? undefined) as AppQueryMeta | undefined;
}

export function createAppQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onSuccess: async (data, query) => {
        await logQueryEvent({
          kind: "GET",
          status: "SUCCESS",
          queryKey: query.queryKey,
          meta: getQueryMeta(query),
          data,
        });
      },
      onError: async (error, query) => {
        await logQueryEvent({
          kind: "GET",
          status: "ERROR",
          queryKey: query.queryKey,
          meta: getQueryMeta(query),
          error,
        });
      },
    }),

    mutationCache: new MutationCache({
      onSuccess: async (data, variables, _context, mutation) => {
        await logQueryEvent({
          kind: "MUTATE",
          status: "SUCCESS",
          mutationKey: mutation.options.mutationKey,
          meta: getMutationMeta(mutation),
          data,
          variables,
        });
      },
      onError: async (error, variables, _context, mutation) => {
        await logQueryEvent({
          kind: "MUTATE",
          status: "ERROR",
          mutationKey: mutation.options.mutationKey,
          meta: getMutationMeta(mutation),
          error,
          variables,
        });
      },
    }),

    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
