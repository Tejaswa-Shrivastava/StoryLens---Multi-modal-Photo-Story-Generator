import { stories, type Story, type InsertStory } from "@shared/schema";

export interface IStorage {
  getStory(id: number): Promise<Story | undefined>;
  createStory(story: InsertStory): Promise<Story>;
  updateStory(id: number, updates: Partial<Story>): Promise<Story | undefined>;
  getAllStories(): Promise<Story[]>;
}

export class MemStorage implements IStorage {
  private stories: Map<number, Story>;
  private currentId: number;

  constructor() {
    this.stories = new Map();
    this.currentId = 1;
  }

  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = this.currentId++;
    const story: Story = {
      id,
      title: insertStory.title,
      content: insertStory.content,
      imageUrl: insertStory.imageUrl,
      audioUrl: insertStory.audioUrl || null,
      processingStatus: insertStory.processingStatus || "pending",
      createdAt: new Date(),
    };
    this.stories.set(id, story);
    return story;
  }

  async updateStory(id: number, updates: Partial<Story>): Promise<Story | undefined> {
    const story = this.stories.get(id);
    if (!story) return undefined;

    const updatedStory = { ...story, ...updates };
    this.stories.set(id, updatedStory);
    return updatedStory;
  }

  async getAllStories(): Promise<Story[]> {
    return Array.from(this.stories.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const storage = new MemStorage();
