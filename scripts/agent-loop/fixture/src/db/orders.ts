import { desc, eq } from "drizzle-orm";
import { db } from "./client.js";
import { orders } from "./schema.js";

export async function getOrdersByCustomer(customerId: number) {
  return db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt)).limit(20);
}

export async function searchOrders(term: string) {
  return db.execute(`select * from orders where status ilike '%${term}%' order by created_at desc`);
}
