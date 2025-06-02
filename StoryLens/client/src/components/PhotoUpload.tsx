import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, X, Sparkles } from "lucide-react";

interface PhotoUploadProps {
  onImageSelect: (file: File) => void;
  isGenerating: boolean;
}

export default function PhotoUpload({ onImageSelect, isGenerating }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file (JPG, PNG)",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback((file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
  };

  const generateStory = () => {
    if (selectedFile) {
      onImageSelect(selectedFile);
    }
  };

  return (
    <Card className="h-fit">
      <CardContent className="p-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <CloudUpload className="text-primary mr-3" size={24} />
          Upload Your Photo
        </h3>

        {!previewUrl ? (
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-primary hover:bg-primary/5"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('photo-input')?.click()}
          >
            <CloudUpload 
              className={`mx-auto mb-4 transition-colors ${
                isDragOver ? "text-primary" : "text-gray-400"
              }`} 
              size={48} 
            />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">
                Drag & drop your photo here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse files
              </p>
              <p className="text-xs text-gray-400">
                Supports JPG, PNG up to 10MB
              </p>
            </div>

            <input
              id="photo-input"
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png"
              onChange={handleInputChange}
            />

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-600 mt-2">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
                onClick={removeImage}
              >
                <X size={16} />
              </Button>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-blue-600 hover:to-purple-600 transition-all transform hover:-translate-y-0.5"
              onClick={generateStory}
              disabled={isGenerating}
              size="lg"
            >
              <Sparkles className="mr-2" size={20} />
              {isGenerating ? "Generating..." : "Generate Story"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
