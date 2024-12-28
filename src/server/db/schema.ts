// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  text,
  boolean,
  real,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `loanme_${name}`);

// Enums
export const loanStatusEnum = pgEnum("loan_status", [
  "PENDING",
  "ACTIVE",
  "COMPLETED",
  "DEFAULTED",
  "CANCELLED",
]);

export const loanPurposeEnum = pgEnum("loan_purpose", [
  "PERSONAL",
  "BUSINESS",
  "EDUCATION",
  "OTHER",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "PAID",
  "LATE",
  "MISSED",
]);

export const scheduleEnum = pgEnum("schedule", [
  "WEEKLY",
  "BIWEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
]);

export const moodEnum = pgEnum("mood", ["HAPPY", "NEUTRAL", "SAD", "ANGRY"]);

// Tables
export const users = createTable("user", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id", { length: 256 }).notNull(), // Clerk user id
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const loans = createTable("loan", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  amount: real("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default("AUD").notNull(),
  status: loanStatusEnum("status").default("PENDING").notNull(),
  purpose: loanPurposeEnum("purpose").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // Duration in months
  preferredSchedule: scheduleEnum("preferred_schedule").default("MONTHLY"),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),

  lenderId: varchar("lender_id", { length: 256 }).notNull(),
  borrowerId: varchar("borrower_id", { length: 256 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  lenderIdx: index("lender_idx").on(table.lenderId),
  borrowerIdx: index("borrower_idx").on(table.borrowerId),
  statusIdx: index("status_idx").on(table.status),
  purposeIdx: index("purpose_idx").on(table.purpose),
}));

export const agreements = createTable("agreement", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  loanId: integer("loan_id").notNull().references(() => loans.id),
  interestRate: real("interest_rate").default(0).notNull(),
  paymentSchedule: scheduleEnum("payment_schedule").default("MONTHLY").notNull(),
  terms: text("terms").notNull(),
  signedByLender: boolean("signed_by_lender").default(false).notNull(),
  signedByBorrower: boolean("signed_by_borrower").default(false).notNull(),
  signedAt: timestamp("signed_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  loanIdx: index("agreement_loan_idx").on(table.loanId),
  signedIdx: index("agreement_signed_idx").on(table.signedByLender, table.signedByBorrower),
}));

export const repayments = createTable("repayment", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  loanId: integer("loan_id").notNull().references(() => loans.id),
  amount: real("amount").notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  paidDate: timestamp("paid_date", { withTimezone: true }),
  status: paymentStatusEnum("status").default("PENDING").notNull(),
  mood: moodEnum("mood"),
  note: text("note"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
}, (table) => ({
  loanIdx: index("repayment_loan_idx").on(table.loanId),
  statusIdx: index("repayment_status_idx").on(table.status),
  dueDateIdx: index("repayment_due_date_idx").on(table.dueDate),
}));

// Relations
export const loansRelations = relations(loans, ({ one, many }) => ({
  agreement: one(agreements, {
    fields: [loans.id],
    references: [agreements.loanId],
  }),
  repayments: many(repayments),
}));

export const agreementsRelations = relations(agreements, ({ one }) => ({
  loan: one(loans, {
    fields: [agreements.loanId],
    references: [loans.id],
  }),
}));

export const repaymentsRelations = relations(repayments, ({ one }) => ({
  loan: one(loans, {
    fields: [repayments.loanId],
    references: [loans.id],
  }),
}));
