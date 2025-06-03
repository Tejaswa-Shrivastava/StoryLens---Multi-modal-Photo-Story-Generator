import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Camera, Brain, Mic, Share2 } from "lucide-react";
import PhotoUpload from "@/components/PhotoUpload";
import ProcessingState from "@/components/ProcessingState";
import StoryDisplay from "@/components/StoryDisplay";
import { uploadImageAndGenerateStory, getStory, getDownloadUrl, type Story } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [currentStoryId, setCurrentStoryId] = useState<number | null>(null);
  const [processingStep, setProcessingStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for current story
  const { data: story, isLoading: isLoadingStory } = useQuery({
    queryKey: ['/api/stories', currentStoryId],
    queryFn: () => currentStoryId ? getStory(currentStoryId) : null,
    enabled: !!currentStoryId,
    refetchInterval: (data) => {
      // Refetch every 2 seconds if still processing
      return data?.processingStatus === 'processing' || data?.processingStatus === 'generating_audio' ? 2000 : false;
    },
  });

  // Mutation for uploading image and generating story
  const generateStoryMutation = useMutation({
    mutationFn: uploadImageAndGenerateStory,
    onSuccess: (newStory: Story) => {
      setCurrentStoryId(newStory.id);
      setProcessingStep(1);
      toast({
        title: "Upload successful!",
        description: "AI is now generating your story...",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update processing step based on story status
  useState(() => {
    if (story?.processingStatus === 'processing') {
      setProcessingStep(1);
    } else if (story?.processingStatus === 'generating_audio') {
      setProcessingStep(2);
    } else if (story?.processingStatus === 'completed') {
      setProcessingStep(3);
    }
  });

  const handleImageSelect = (file: File) => {
    generateStoryMutation.mutate(file);
  };

  const handleCreateNew = () => {
    setCurrentStoryId(null);
    setProcessingStep(1);
  };

  const handleDownload = () => {
    if (currentStoryId) {
      window.open(getDownloadUrl(currentStoryId), '_blank');
    }
  };

  const handleShare = () => {
    if (story) {
      if (navigator.share) {
        navigator.share({
          title: story.title,
          text: story.content,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(`${story.title}\n\n${story.content}`);
        toast({
          title: "Copied to clipboard!",
          description: "Story text has been copied to your clipboard.",
        });
      }
    }
  };

  const isGenerating = generateStoryMutation.isPending;
  const isProcessing = story?.processingStatus === 'processing' || story?.processingStatus === 'generating_audio';
  const isCompleted = story?.processingStatus === 'completed';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Camera className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">StoryLens</h1>
                <p className="text-xs text-gray-500">AI Photo Story Generator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Photos Into{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Magical Stories
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Upload any photo and watch as AI creates captivating stories and poems, complete with natural voice narration. Turn your memories into shareable experiences.
            </p>
          </div>
        </section>

        {/* Main Workflow */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <PhotoUpload 
            onImageSelect={handleImageSelect} 
            isGenerating={isGenerating}
          />

          {isProcessing ? (
            <ProcessingState currentStep={processingStep} />
          ) : isCompleted && story ? (
            <StoryDisplay
              story={story}
              onCreateNew={handleCreateNew}
              onDownload={handleDownload}
              onShare={handleShare}
            />
          ) : (
            <Card className="h-fit">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Brain className="text-secondary mr-3" size={24} />
                  Your AI Story
                </h3>
                <div className="text-center py-12 text-gray-500">
                  <Brain className="mx-auto mb-4 text-gray-300" size={48} />
                  <p>Upload a photo to get started!</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Features Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Why Choose StoryLens?
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="text-primary" size={28} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                AI-Powered Creativity
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Advanced Microsoft Kosmos-2 model analyzes your photos and creates unique, engaging stories tailored to your memories.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mic className="text-secondary" size={28} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Natural Voice Narration
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                High-quality text-to-speech with Coqui XTTS-v2 brings your stories to life with human-like voice narration.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Share2 className="text-accent" size={28} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Easy Sharing
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Download your stories as text or audio files, perfect for social media, greeting cards, or personal keepsakes.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Camera className="text-white" size={16} />
              </div>
              <span className="text-lg font-semibold text-gray-900">StoryLens</span>
            </div>
            <p className="text-gray-600 mb-4">Transform your photos into magical stories with AI</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
