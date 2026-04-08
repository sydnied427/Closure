import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const closureBoxesTable = pgTable("closure_boxes", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  theme: text("theme").notNull(),
  intention: text("intention").notNull(),
  recipientName: text("recipient_name").notNull(),
  letterContent: text("letter_content").notNull(),
  fate: text("fate").notNull(),
  fateDate: text("fate_date"),
  audioData: text("audio_data"),
  photoData: text("photo_data"),
  videoData: text("video_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClosureBoxSchema = createInsertSchema(closureBoxesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertClosureBox = z.infer<typeof insertClosureBoxSchema>;
export type ClosureBox = typeof closureBoxesTable.$inferSelect;
