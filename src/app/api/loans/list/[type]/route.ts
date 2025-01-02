import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

const ITEMS_PER_PAGE = 10;

export async function GET(
    request: Request,
    context: { params: { type: "lender" | "borrower" } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const params = await context.params;
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page")) || 1;
        const sortField = searchParams.get("sort") || "startDate";
        const sortOrder = searchParams.get("order") || "desc";
        const offset = (page - 1) * ITEMS_PER_PAGE;

        const where = params.type === "lender"
            ? eq(loans.lenderId, userId)
            : eq(loans.borrowerId, userId);

        const fetchedLoans = await db.query.loans.findMany({
            where,
            orderBy: [sortOrder === "desc" ? desc(loans[sortField]) : asc(loans[sortField])],
            offset: offset,
            limit: ITEMS_PER_PAGE,
        });

        // Get user information
        const userIds = fetchedLoans.map(loan =>
            params.type === "lender" ? loan.borrowerId : loan.lenderId
        );
        const clerk = await clerkClient();
        const users = await clerk.users.getUserList({
            userId: userIds,
        });

        return NextResponse.json({
            loans: fetchedLoans,
            users: users.data,
        });
    } catch (error) {
        console.error('Failed to fetch loans:', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
} 