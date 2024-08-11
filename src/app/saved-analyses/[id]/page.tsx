"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from '@/components/ui/button';
import PageTransition from '@/app/components/PageTransition';
import { Trash2, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils'; // Assuming you have a utils file
import SparkleButton from '@/components/ui/SparkleButton';
import { PersonalInfoModal } from '@/app/components/PersonalInfoModal';
import { Skeleton } from "@/components/ui/skeleton";

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

export default function SavedAnalysis() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { id } = useParams();
  const [floorPlan, setFloorPlan] = useState<{
    id: string;
    name?: string;
    updatedAt: Date | null;
    lowQualityImage?: string;
    uploadedFiles?: Array<{ name: string; preview: string; url: string }>;
  } | null>(null);
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);

  useEffect(() => {
    const fetchFloorPlan = async () => {
      if (user && id) {
        // Simulate a delay for testing the loading state
        await new Promise(resolve => setTimeout(resolve, 2000));

        const floorPlanRef = doc(db, 'users', user.uid, 'floorPlans', id);
        const floorPlanDoc = await getDoc(floorPlanRef);
        if (floorPlanDoc.exists()) {
          const data = floorPlanDoc.data();
          setFloorPlan({
            id: floorPlanDoc.id,
            ...data,
            updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
          });
        }
      }
    };

    fetchFloorPlan();
  }, [user, id]);

  const handleDelete = async () => {
    if (user && id) {
      await deleteDoc(doc(db, 'users', user.uid, 'floorPlans', id));
      router.push('/dashboard');
    }
  };

  if (!floorPlan) {
    return (
      <PageTransition>
        <SkeletonLoader />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Saved Analysis</h1>
          <Button onClick={() => router.push('/dashboard')} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>

        <div className="bg-background rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{floorPlan.name || `Save ${floorPlan.id}`}</h2>
              <p className="text-muted-foreground mb-4">
                Last modified: {floorPlan.updatedAt ? formatDate(floorPlan.updatedAt) : 'Unknown'}
              </p>
              {floorPlan.lowQualityImage && (
                <img 
                  src={floorPlan.lowQualityImage} 
                  alt="Floor Plan Thumbnail" 
                  className="w-full h-auto rounded-lg shadow-md mb-4"
                />
              )}
              {floorPlan.uploadedFiles && floorPlan.uploadedFiles.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Uploaded Files</h3>
                  <ul className="space-y-2">
                    {floorPlan.uploadedFiles.map((file, index) => (
                      <li key={index} className="bg-muted p-2 rounded-md flex items-center">
                        <img src={file.preview} alt={file.name} className="w-12 h-12 object-cover rounded mr-2" />
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {file.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <SparkleButton
                onClick={() => setIsPersonalInfoModalOpen(true)}
                className="w-full text-lg py-3 px-6 mb-4"
              >
                Analyze This Plan
              </SparkleButton>
              <Button onClick={handleDelete} variant="destructive" size="sm" className="self-end">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Save
              </Button>
            </div>
          </div>
        </div>
      </div>
      <PersonalInfoModal
        isOpen={isPersonalInfoModalOpen}
        onClose={() => setIsPersonalInfoModalOpen(false)}
        onSubmit={(data) => {
          console.log('Personal info submitted:', data);
          // Here you can handle the submitted data, e.g., save it to Firestore
          router.push(`/analyze/${floorPlan.id}`);
        }}
      />
    </PageTransition>
  );
}