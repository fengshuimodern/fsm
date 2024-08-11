import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisPreviewProps {
  userName: string;
  age: number;
  gender: string;
  element: string;
  luckyDirection: string;
  floorPlanImage: string;
  uploadedFiles: { name: string; preview: string }[];
}

export default function AnalysisPreview({
  userName,
  age,
  gender,
  element,
  luckyDirection,
  floorPlanImage,
  uploadedFiles
}: AnalysisPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          age,
          gender,
          element,
          luckyDirection,
          floorPlanImage,
          uploadedFiles
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      router.push(`/analysis-result/${result.analysisId}`);
    } catch (error) {
      console.error('Error during analysis:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analysis Preview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <p><strong>Name:</strong> {userName}</p>
          <p><strong>Age:</strong> {age}</p>
          <p><strong>Gender:</strong> {gender}</p>
          <p><strong>Feng Shui Element:</strong> {element}</p>
          <p><strong>Lucky Direction:</strong> {luckyDirection}</p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Floor Plan</h2>
          <Image 
            src={floorPlanImage} 
            alt="Floor Plan" 
            width={400} 
            height={300} 
            className="rounded-lg shadow-md"
          />
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Uploaded Files</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg">
                <Image 
                  src={file.preview} 
                  alt={file.name} 
                  width={100} 
                  height={100} 
                  className="rounded-md mb-2"
                />
                <p className="text-sm truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Button
          onClick={handleAnalyze}
          disabled={isLoading}
          className={cn(
            "group relative overflow-hidden",
            "bg-blue-500 hover:bg-blue-600",
            "text-white font-semibold",
            "transition-all duration-300 ease-in-out",
            "transform hover:scale-105 hover:shadow-lg",
            "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50",
            "py-3 px-6 text-lg"
          )}
        >
          <span className="flex items-center">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Now
                <Sparkles className="ml-2 w-5 h-5 group-hover:animate-pulse" />
              </>
            )}
          </span>
        </Button>
      </div>
    </div>
  );
}