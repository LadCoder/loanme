import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { db } from "../db";

export const createTRPCContext = async (opts: { req: Request }) => {
    const { userId } = await auth();
    return {
        db,
        userId,
    };
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: {
            userId: ctx.userId,
            db: ctx.db,
        },
    });
});
