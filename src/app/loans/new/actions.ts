"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

export async function createLoan(amount: number, borrowerId: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const loan = await db.insert(loans).values({
        amount,
        lenderId: userId,
        borrowerId,
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning();

    revalidatePath("/");
    return loan[0];
} 