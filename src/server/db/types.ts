import { type PgTableWithColumns } from "drizzle-orm/pg-core";
import { type agreements } from "./schema";

export type AgreementTable = PgTableWithColumns<typeof agreements>; 