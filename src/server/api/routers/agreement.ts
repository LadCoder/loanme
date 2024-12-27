import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { agreements, scheduleEnum } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const agreementRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            loanId: z.number(),
            interestRate: z.number().min(0),
            paymentSchedule: z.enum(scheduleEnum.enumValues),
            terms: z.string().min(1),
        }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.insert(agreements).values({
                loanId: input.loanId,
                interestRate: input.interestRate,
                paymentSchedule: input.paymentSchedule,
                terms: input.terms,
                signedByLender: false,
                signedByBorrower: false,
            });
        }),

    getByLoanId: protectedProcedure
        .input(z.number())
        .query(async ({ ctx, input }) => {
            return ctx.db.query.agreements.findFirst({
                where: eq(agreements.loanId, input),
            });
        }),
}); 