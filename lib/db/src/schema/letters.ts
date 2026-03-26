import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const lettersTable = pgTable("letters", {
  id: serial("id").primaryKey(),
  recipient: text("recipient").notNull(),
  body: text("body").notNull(),
  deliveryType: text("delivery_type").notNull(), // 'date' | 'sealed'
  deliveryDate: text("delivery_date"), // ISO date string, nullable
  audioData: text("audio_data"), // base64, nullable
  videoData: text("video_data"), // base64, nullable
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLetterSchema = createInsertSchema(lettersTable).omit({ id: true, createdAt: true });
export type InsertLetter = z.infer<typeof insertLetterSchema>;
export type Letter = typeof lettersTable.$inferSelect;
