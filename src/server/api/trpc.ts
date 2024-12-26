import { auth } from "@clerk/nextjs/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
    const session = await auth();
    return {
        userId: session.userId,
    };
};
