"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";

export type User = {
    id: string;
    name: string;
    email: string;
};

export async function searchUsers(query: string): Promise<User[]> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const users = await (await clerkClient()).users.getUserList({
        query,
        limit: 5,
    });

    return users.data.map(user => ({
        id: user.id,
        name: user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.emailAddresses[0]?.emailAddress ?? "Unknown User",
        email: user.emailAddresses[0]?.emailAddress ?? "",
    }));
} 