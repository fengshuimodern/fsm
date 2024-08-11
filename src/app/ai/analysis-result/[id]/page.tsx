"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import PageTransition from "@/app/components/PageTransition";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CompassRose from "@/app/components/CompassRose";

interface Analysis {
  id: string;
  name: string;
  createdAt: Date | null;
  floorPlanImage: string;
  analysis: string;
  userName: string;
  age: string;
  gender: string;
  element: string;
  luckyDirection: string;
  uploadedFiles: any[];
}

const SkeletonLoader = () => (
  <div className="container mx-auto p-4">
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-40" />
    </div>
    <div className="bg-background rounded-lg shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="w-full h-64 rounded-lg mb-4" />
          <Skeleton className="h-6 w-1/3 mb-2" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-12 w-12 rounded" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-10 w-32 self-end" />
        </div>
      </div>
    </div>
  </div>
);

export default function AnalysisResult() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (user && id) {
        try {
          const analysisRef = doc(db, "users", user.uid, "analyses", id);
          const analysisDoc = await getDoc(analysisRef);
          if (analysisDoc.exists()) {
            const data = analysisDoc.data();
            setAnalysis({
              id: analysisDoc.id,
              name: data.name,
              createdAt: data.createdAt?.toDate() || null,
              floorPlanImage: data.floorPlanImage,
              analysis: data.analysis,
              userName: data.userName,
              age: data.age,
              gender: data.gender,
              element: data.element,
              luckyDirection: data.luckyDirection,
              uploadedFiles: data.uploadedFiles || [],
            });
          } else {
            setError("Analysis not found");
          }
        } catch (err) {
          setError("Failed to fetch analysis");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAnalysis();
  }, [user, id]);

  if (isLoading) {
    return (
      <PageTransition>
        <SkeletonLoader />
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-red-500">{error}</p>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </PageTransition>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <PageTransition>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Analysis Result</h1>
          <div>
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="mr-2"
            >
              Print Analysis
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="mr-2"
            >
              {isCopied ? "Copied!" : "Share"}
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            {analysis.name || `Analysis ${analysis.id}`}
          </h2>
          <p className="text-muted-foreground mb-4">
            Created on:{" "}
            {analysis.createdAt ? formatDate(analysis.createdAt) : "Unknown"}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Personal Information
              </h3>
              <p>
                <strong>Name:</strong> {analysis.userName}
              </p>
              <p>
                <strong>Age:</strong> {analysis.age}
              </p>
              <p>
                <strong>Gender:</strong> {analysis.gender}
              </p>
              <p>
                <strong>Feng Shui Element:</strong> {analysis.element}
              </p>
              <div>
                <p>
                  <strong>Lucky Direction:</strong> {analysis.luckyDirection}
                </p>
                <CompassRose luckyDirection={analysis.luckyDirection} />
              </div>
            </div>

            {analysis.floorPlanImage && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Floor Plan</h3>
                <Dialog
                  open={isImageModalOpen}
                  onOpenChange={setIsImageModalOpen}
                >
                  <DialogTrigger>
                    <Image
                      src={analysis.floorPlanImage}
                      alt="Floor Plan"
                      width={400}
                      height={300}
                      className="rounded-lg shadow-md cursor-pointer"
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <Image
                      src={analysis.floorPlanImage}
                      alt="Floor Plan"
                      width={1000}
                      height={750}
                      className="rounded-lg"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {analysis.analysis && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">
                  Feng Shui Analysis
                </h3>
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                  {analysis.analysis.split("Recommendations:")[0]}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                  {analysis.analysis.split("Recommendations:")[1] ||
                    "No specific recommendations provided."}
                </div>
              </div>
            </>
          )}

          {analysis.uploadedFiles && analysis.uploadedFiles.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Uploaded Files</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analysis.uploadedFiles.map((file, index) => (
                  <div key={index} className="bg-muted p-4 rounded-lg">
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
        </div>
      </div>
    </PageTransition>
  );
}