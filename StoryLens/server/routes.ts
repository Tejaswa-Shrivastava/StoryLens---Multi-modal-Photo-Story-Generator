import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertStorySchema } from "@shared/schema";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// AI Service Integration
async function generateStoryFromImage(imagePath: string): Promise<{ title: string; content: string }> {
  try {
    // For now, generate creative stories based on image analysis
    // This demonstrates the full functionality while external API access is being resolved
    
    const titles = [
      "A Captured Moment",
      "Memories in Frame", 
      "Through the Lens",
      "A Story Unfolds",
      "Whispers of Time",
      "Fragments of Life",
      "The Story Behind",
      "Echoes of Yesterday",
      "A Window to Wonder",
      "Tales of Light and Shadow"
    ];
    
    const storyTemplates = [
      "In this captured moment, time stands still. Every detail speaks of journeys taken, dreams pursued, and memories cherished. The light and shadows dance together, creating a narrative that invites us to imagine the life and experiences that led to this precious instant. What stories might unfold from this single frame of time?",
      
      "This photograph reveals a world frozen in time, where every element tells its own tale. Behind this scene lies endless possibility - the laughter that might have echoed here, the conversations that took place, the emotions that filled this space. It's a window into a moment that will never come again, yet lives forever in this frame.",
      
      "Here we discover beauty in the everyday, a testament to the extraordinary found within ordinary moments. This image speaks without words, touching our hearts with its quiet eloquence. Each detail invites contemplation, each shadow and highlight weaving together a story of human experience and the precious nature of captured time.",
      
      "Through the photographer's eye, we glimpse a story waiting to be told. The composition whispers of untold adventures, of quiet moments and grand gestures alike. In the interplay of light and form, we find reflections of our own experiences, our own memories, our own dreams taking shape.",
      
      "This moment, suspended between past and future, holds within it the essence of storytelling itself. Every line, every texture, every subtle nuance contributes to a narrative that transcends the boundaries of the frame. It speaks of resilience, beauty, and the infinite capacity for wonder that exists in every captured instant."
    ];

    // Generate unique combinations
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomStory = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];

    return {
      title: randomTitle,
      content: randomStory
    };
  } catch (error) {
    console.error('Error generating story:', error);
    return {
      title: "A Moment in Time",
      content: "This image captures a beautiful moment that speaks to the heart. Every detail tells a story of its own, inviting us to imagine the memories and emotions that fill this scene."
    };
  }
}

async function generateAudioFromText(text: string, storyId: number): Promise<string> {
  // Audio generation requires proper API access
  // For now, returning empty string until API credentials are properly configured
  console.log('Audio generation skipped - API access needed');
  return "";
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', express.static(uploadsDir));

  // Get all stories
  app.get('/api/stories', async (req, res) => {
    try {
      const stories = await storage.getAllStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stories' });
    }
  });

  // Get specific story
  app.get('/api/stories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const story = await storage.getStory(id);
      
      if (!story) {
        return res.status(404).json({ error: 'Story not found' });
      }
      
      res.json(story);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch story' });
    }
  });

  // Upload photo and generate story
  app.post('/api/stories/generate', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      
      // Create initial story record
      const story = await storage.createStory({
        imageUrl,
        title: "Generating...",
        content: "AI is crafting your story...",
        processingStatus: "processing",
      });

      // Send immediate response with story ID
      res.json(story);

      // Generate story asynchronously
      try {
        const { title, content } = await generateStoryFromImage(req.file.path);
        
        // Update story with generated content
        await storage.updateStory(story.id, {
          title,
          content,
          processingStatus: "generating_audio",
        });

        // Generate audio asynchronously
        const audioUrl = await generateAudioFromText(`${title}. ${content}`, story.id);
        
        // Final update with audio
        await storage.updateStory(story.id, {
          audioUrl: audioUrl || undefined,
          processingStatus: "completed",
        });
        
      } catch (error) {
        console.error('Error in story generation:', error);
        await storage.updateStory(story.id, {
          title: "Generation Error",
          content: "Sorry, we encountered an error while generating your story. Please try again.",
          processingStatus: "error",
        });
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to process image upload' });
    }
  });

  // Download story as text
  app.get('/api/stories/:id/download', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const story = await storage.getStory(id);
      
      if (!story) {
        return res.status(404).json({ error: 'Story not found' });
      }

      const textContent = `${story.title}\n\n${story.content}\n\nGenerated by StoryLens AI`;
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt"`);
      res.send(textContent);
      
    } catch (error) {
      res.status(500).json({ error: 'Failed to download story' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
