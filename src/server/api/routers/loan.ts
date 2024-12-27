import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { loans } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const loanRouter = createTRPCRouter({
    // Create a new loan
    create: protectedProcedure
        .input(z.object({
            amount: z.number().positive(),
            currency: z.string().length(3).default("AUD"),
            borrowerId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {

            return ctx.db.insert(loans).values({
                amount: input.amount,
                currency: input.currency,
                lenderId: ctx.userId,
                borrowerId: input.borrowerId,
                status: "PENDING",
                createdAt: new Date(),
            });
        }),

    // Get all loans where user is lender
    getLentLoans: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.db.query.loans.findMany({
                where: eq(loans.lenderId, ctx.userId),
                with: {
                    borrower: true,
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
                    lender: true,
                    agreement: true,
                    repayments: true,
                },
            });
        }),

    // Get a specific loan by ID
    getById: protectedProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            return ctx.db.query.loans.findFirst({
                where: eq(loans.id, parseInt(input)),
                with: {
                    lender: true,
                    borrower: true,
                    agreement: true,
                    repayments: true,
                },
            });
        }),
}); 