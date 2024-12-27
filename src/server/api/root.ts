import { createTRPCRouter } from "~/server/api/trpc";
import { loanRouter } from "~/server/api/routers/loan";
import { agreementRouter } from "~/server/api/routers/agreement";
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const appRouter = createTRPCRouter({
    loan: loanRouter,
    agreement: agreementRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>; 