import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("Manager"),
  status: text("status").notNull().default("Active"),
});

export const invoices = sqliteTable("invoices", {
  id: text("id").primaryKey(),
  client: text("client").notNull(),
  date: text("date").notNull(),
  amount: real("amount").notNull(),
  status: text("status").notNull(),
});

export const inventory = sqliteTable("inventory", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  stock: integer("stock").notNull(),
  price: real("price").notNull(),
});

export const crm = sqliteTable("crm", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  totalValue: real("total_value").notNull(),
  last: text("last").notNull(),
  status: text("status").notNull(),
});
