import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  audioUrl: text("audio_url"),
  processingStatus: text("processing_status").notNull().default("pending"), // pending, processing, completed, error
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
});

export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof stories.$inferSelect;

// API response types
export const generateStoryRequestSchema = z.object({
  imageFile: z.instanceof(File),
});

export const storyResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  imageUrl: z.string(),
  audioUrl: z.string().optional(),
  processingStatus: z.string(),
  createdAt: z.string(),
});

export type GenerateStoryRequest = z.infer<typeof generateStoryRequestSchema>;
export type StoryResponse = z.infer<typeof storyResponseSchema>;
