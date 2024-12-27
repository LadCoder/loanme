import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { loans } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const loanRouter = createTRPCRouter({
    // Create a new loan
    create: protectedProcedure
        .input(z.object({
            amount: z.number().positive(),
            currency: z.string().length(3).default("AUD"),
            borrowerId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db.insert(loans).values({
                amount: input.amount,
                currency: input.currency,
                lenderId: ctx.userId,
                borrowerId: input.borrowerId,
                status: "PENDING",
                createdAt: new Date(),
            }).returning({ id: loans.id });

            if (!result[0]) throw new Error("Failed to create loan");
            return result[0];
        }),

    // Get a specific loan by ID
    getById: protectedProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            try {
                const loan = await ctx.db.query.loans.findFirst({
                    where: eq(loans.id, parseInt(input)),
                    with: {
                        agreement: true,
                        repayments: true,
                    },
                });

                if (!loan) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: `Loan with ID ${input} not found`,
                    });
                }

                // Check if user has permission to view this loan
                if (loan.lenderId !== ctx.userId && loan.borrowerId !== ctx.userId) {
                    throw new TRPCError({
                        code: 'FORBIDDEN',
                        message: 'You do not have permission to view this loan',
                    });
                }

                return loan;
            } catch (error) {
                if (error instanceof TRPCError) throw error;

                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to fetch loan details',
                    cause: error,
                });
            }
        }),

    // Get all loans where user is lender
    getLentLoans: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.db.query.loans.findMany({
                where: eq(loans.lenderId, ctx.userId),
                with: {
                    agreement: true,
                    repayments: true,
                },
            });
        }),

    // Get all loans where user is borrower
    getBorrowedLoans: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.db.query.loans.findMany({
                where: eq(loans.borrowerId, ctx.userId),
                with: {
                    agreement: true,
                    repayments: true,
                },
            });
        }),
}); 