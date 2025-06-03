import { apiRequest } from "./queryClient";

export interface Story {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  audioUrl?: string;
  processingStatus: string;
  createdAt: string;
}

export async function uploadImageAndGenerateStory(file: File): Promise<Story> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiRequest('POST', '/api/stories/generate', formData);
  return response.json();
}

export async function getStory(id: number): Promise<Story> {
  const response = await apiRequest('GET', `/api/stories/${id}`);
  return response.json();
}

export async function getAllStories(): Promise<Story[]> {
  const response = await apiRequest('GET', '/api/stories');
  return response.json();
}

export function getDownloadUrl(storyId: number): string {
  return `/api/stories/${storyId}/download`;
}
