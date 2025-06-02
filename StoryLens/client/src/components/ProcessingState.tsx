import { Card, CardContent } from "@/components/ui/card";
import { Brain, Check } from "lucide-react";

interface ProcessingStateProps {
  currentStep: number;
}

const steps = [
  { id: 1, title: "Analyzing your photo", description: "Understanding image content" },
  { id: 2, title: "Generating creative story", description: "Crafting unique narrative" },
  { id: 3, title: "Creating audio narration", description: "Converting to speech" },
];

export default function ProcessingState({ currentStep }: ProcessingStateProps) {
  return (
    <Card className="h-fit">
      <CardContent className="p-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Brain className="text-secondary mr-3" size={24} />
          Your AI Story
        </h3>

        <div className="text-center py-12">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" size={20} />
          </div>
          
          <p className="text-lg font-medium text-gray-700 mb-2">
            AI is crafting your story...
          </p>
          <p className="text-sm text-gray-500">
            This usually takes 10-30 seconds
          </p>

          <div className="mt-8 space-y-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex items-center justify-center space-x-3 text-sm"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    step.id <= currentStep
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check size={12} />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={
                    step.id <= currentStep
                      ? "text-primary font-medium"
                      : "text-gray-500"
                  }
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
