"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

export async function createLoan(data: {
    amount: number;
    currency: string;
    purpose: "PERSONAL" | "BUSINESS" | "EDUCATION" | "OTHER";
    description: string;
    duration: number;
    preferredSchedule: "WEEKLY" | "BIWEEKLY" | "MONTHLY";
    startDate?: Date;
    endDate?: Date;
    borrowerId: string;
}) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    // Don't allow self-loans
    if (data.borrowerId === userId) {
        throw new Error("You cannot assign a loan to yourself");
    }

    const loan = await db.insert(loans).values({
        amount: data.amount,
        currency: data.currency,
        purpose: data.purpose,
        description: data.description,
        duration: data.duration,
        preferredSchedule: data.preferredSchedule,
        startDate: data.startDate,
        endDate: data.endDate,
        lenderId: userId,
        borrowerId: data.borrowerId,
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning();

    revalidatePath("/");
    return loan[0];
} 