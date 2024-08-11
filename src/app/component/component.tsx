"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PageTransition from "../components/PageTransition";
import dynamic from "next/dynamic";
import { PersonalInfoModal } from "../components/PersonalInfoModal";
import FabricCanvas from "../components/FabricCanvas";
import FurnitureLibrary from "../components/FurnitureLibrary";
import { Tooltip } from "../components/Tooltip";
import { InfoIcon } from "lucide-react";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Make sure you have this utility function
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/lib/firebase"; // Make sure to export 'app' from your firebase.ts file

const GRID_SIZE = 20;
const SIDEBAR_WIDTH = 256;
const CANVAS_PADDING = 5;
const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 30;
const CANVAS_SCALE_FACTOR = 0.9;

const compressImage = (dataUrl: string, quality: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};

export const RoomPlanner = () => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [fabricModule, setFabricModule] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    import("fabric").then((fabric) => setFabricModule(fabric));
  }, []);

  useEffect(() => {
    const updateCanvasSize = () => {
      const availableWidth =
        window.innerWidth - SIDEBAR_WIDTH - CANVAS_PADDING * 2;
      const availableHeight =
        window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT - CANVAS_PADDING * 2;

      const width =
        Math.floor((availableWidth * CANVAS_SCALE_FACTOR) / GRID_SIZE) *
        GRID_SIZE;
      const height =
        Math.floor((availableHeight * CANVAS_SCALE_FACTOR) / GRID_SIZE) *
        GRID_SIZE;

      setCanvasSize({ width, height });
    };

    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  const handleNextClick = async () => {
    setIsLoading(true);
    try {
      const result = fabricCanvasRef.current?.takeScreenshot();
      if (result) {
        const { screenshot, metadata } = result;
        const highQualityImage = screenshot;
        const lowQualityImage = await compressImage(screenshot, 0.1);

        await saveFloorPlan(highQualityImage, lowQualityImage, metadata);
        console.log("Floor plan saved successfully");
      } else {
        throw new Error("Failed to take screenshot");
      }
      console.log("Opening personal info modal");
      setIsPersonalInfoModalOpen(true);
    } catch (error) {
      console.error("Error preparing data:", error);
      if (error instanceof Error) {
        alert(`Error preparing data: ${error.message}`);
      } else {
        alert("Error preparing data. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsPersonalInfoModalOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    // Handle form submission logic here
    console.log(formData);
    setIsPersonalInfoModalOpen(false);
  };

  const saveFloorPlan = async (
    highQualityImage: string,
    lowQualityImage: string,
    metadata: any[]
  ) => {
    if (!user) {
      console.error("No user logged in");
      return;
    }

    try {
      console.log("Starting to save floor plan");
      const storage = getStorage(app);
      console.log("Storage object:", storage);
      console.log("Storage bucket:", storage.app.options.storageBucket);

      if (!storage) {
        throw new Error("Firebase Storage is not initialized");
      }

      if (!storage.app.options.storageBucket) {
        throw new Error("Firebase Storage bucket is not configured");
      }

      // Create a root reference
      const storageRef = ref(storage);
      console.log("Root storage reference created:", storageRef);

      // Create a reference to the file location
      const fileRef = ref(
        storageRef,
        `floorPlans/${user.uid}/${Date.now()}_low.jpg`
      );
      console.log("File reference created:", fileRef);

      // Upload the file
      await uploadString(fileRef, lowQualityImage, "data_url");
      console.log("Image uploaded to Storage");

      const lowQualityImageUrl = await getDownloadURL(fileRef);
      console.log("Download URL obtained:", lowQualityImageUrl);

      const floorPlanData = {
        highQualityImage,
        lowQualityImage: lowQualityImageUrl,
        createdAt: new Date().toISOString(),
        name: `Floor Plan ${Date.now()}`, // Add a name for the floor plan
        analyzed: false, // Add this field to indicate if it's analyzed or not
        metadata: JSON.stringify(metadata), // Add this line
      };

      const docRef = await addDoc(
        collection(db, "users", user.uid, "floorPlans"),
        floorPlanData
      );
      console.log("Floor plan saved with ID: ", docRef.id);
    } catch (error) {
      console.error("Error saving floor plan:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = fabricCanvasRef.current?.takeScreenshot();
      if (result) {
        const { screenshot, metadata } = result;
        const highQualityImage = screenshot;
        const lowQualityImage = await compressImage(screenshot, 0.1);
        await saveFloorPlan(highQualityImage, lowQualityImage, metadata);
        setShowSavePopup(true);
      } else {
        throw new Error("Failed to take screenshot");
      }
    } catch (error) {
      console.error("Error saving floor plan:", error);
      if (error instanceof Error) {
        alert(`Failed to save floor plan: ${error.message}`);
      } else {
        alert("Failed to save floor plan. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex h-screen overflow-hidden">
        <FurnitureLibrary
          addFurniture={(type) => fabricCanvasRef.current?.addFurniture(type)}
        />
        <div className="flex-1 flex flex-col h-full">
          <header className="bg-background p-4 shadow-md relative z-40">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold">FengShuiModern Planner</h1>
                  <p className="text-sm text-muted-foreground">
                    Optimize your space with AI-powered Fengshui analysis
                  </p>
                </div>
                <Tooltip content="Use ⌫ key to remove furniture">
                  <InfoIcon className="text-muted-foreground cursor-help" />
                </Tooltip>
              </div>
              <div className="flex space-x-4">
                <Button
                  onClick={handleSave}
                  variant="outline"
                  disabled={isLoading}
                  className={cn(
                    "group relative overflow-hidden",
                    "bg-green-500 hover:bg-green-600",
                    "text-white font-semibold",
                    "transition-all duration-300 ease-in-out",
                    "transform hover:scale-105 hover:shadow-lg",
                    "focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                  )}
                >
                  <span className="flex items-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>Save</>
                    )}
                  </span>
                </Button>
                <Button
                  onClick={handleNextClick}
                  variant="default"
                  disabled={isLoading}
                  className={cn(
                    "group relative overflow-hidden",
                    "bg-blue-500 hover:bg-blue-600",
                    "text-white font-semibold",
                    "transition-all duration-300 ease-in-out",
                    "transform hover:scale-105 hover:shadow-lg",
                    "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                  )}
                >
                  <span className="flex items-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Next
                        <Sparkles className="ml-2 w-5 h-5 group-hover:animate-pulse" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </div>
          </header>
          <FabricCanvas
            ref={fabricCanvasRef}
            canvasRef={canvasRef}
            fabricCanvasRef={fabricCanvasRef}
            canvasSize={canvasSize}
            fabricModule={fabricModule}
          />
        </div>
      </div>
      <PersonalInfoModal
        isOpen={isPersonalInfoModalOpen}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
      />
      {showSavePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              Floor plan saved successfully!
            </h3>
            <p className="mb-4">
              You can view your saved floor plans in the Dashboard.
            </p>
            <Button
              onClick={() => {
                setShowSavePopup(false);
                router.push("/dashboard");
              }}
            >
              See your saves
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowSavePopup(false)}
              className="ml-2"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

const DynamicRoomPlanner = dynamic(() => Promise.resolve(RoomPlanner), {
  ssr: false,
});

export default function RoomPlannerWithDndProvider() {
  return (
    <DndProvider backend={HTML5Backend}>
      <DynamicRoomPlanner />
    </DndProvider>
  );
}