"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

export async function createLoan(amount: number, borrowerEmail: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    // Look up the user by email
    const users = await (await clerkClient()).users.getUserList({
        emailAddress: [borrowerEmail],
    });

    if (users.totalCount === 0) {
        throw new Error("No user found with this email address");
    }

    const borrowerId = users.data[0]?.id;
    if (!borrowerId) {
        throw new Error("No user found with this email address");
    }

    // Don't allow self-loans
    if (borrowerId === userId) {
        throw new Error("You cannot assign a loan to yourself");
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