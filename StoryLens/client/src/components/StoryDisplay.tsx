import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Download, Share, Plus, Clock, Palette, Heart } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import type { Story } from "@/lib/api";

interface StoryDisplayProps {
  story: Story;
  onCreateNew: () => void;
  onDownload: () => void;
  onShare: () => void;
}

export default function StoryDisplay({ story, onCreateNew, onDownload, onShare }: StoryDisplayProps) {
  return (
    <Card className="h-fit">
      <CardContent className="p-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <BookOpen className="text-secondary mr-3" size={24} />
          Your AI Story
        </h3>

        <div className="space-y-6">
          {/* Story Content */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-primary text-lg">"</span>
                <span className="text-sm font-medium text-gray-600">Generated Story</span>
              </div>
              <Badge variant="secondary" className="bg-white">
                ✨ AI Generated
              </Badge>
            </div>

            <div className="prose prose-sm max-w-none">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {story.title}
              </h4>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {story.content}
              </div>
            </div>

            <Separator className="my-4 bg-white/50" />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Clock className="mr-1" size={12} />
                  {Math.ceil(story.content.length / 200)} min read
                </span>
                <span className="flex items-center">
                  <Palette className="mr-1" size={12} />
                  Creative
                </span>
                <span className="flex items-center">
                  <Heart className="mr-1" size={12} />
                  Inspiring
                </span>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          {story.audioUrl && (
            <AudioPlayer audioUrl={story.audioUrl} title={story.title} />
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white"
              onClick={onDownload}
            >
              <Download className="mr-2" size={16} />
              Download Story
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              onClick={onShare}
            >
              <Share className="mr-2" size={16} />
              Share Story
            </Button>
            <Button
              className="bg-accent hover:bg-amber-600"
              onClick={onCreateNew}
            >
              <Plus className="mr-2" size={16} />
              New
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
