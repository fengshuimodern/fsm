"use client";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/VyXWZcGzX31
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageTransition from "../components/PageTransition";
import { UserSettings } from "../components/UserSettings";
import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import TipsAndTricks from './TipsAndTricks';
import UserProfile from './UserProfile';
import { Sparkles, LogOut, Trash2, NotebookIcon, CreditCard as CreditCardIcon, Receipt as ReceiptIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Dashboard() {
  const router = useRouter();
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState({
    displayName: "",
    gender: "",
    dateOfBirth: "",
    isVIP: false,
  });
  const [pendingAnalysisPlans, setPendingAnalysisPlans] = useState([]);
  const [analyzedPlans, setAnalyzedPlans] = useState([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData({
              displayName: userData.displayName || "",
              gender: userData.gender || "",
              dateOfBirth: userData.dateOfBirth || "",
              isVIP: userData.isVIP || false,
            });

            // Fetch all floor plans
            const floorPlansRef = collection(db, "users", user.uid, "floorPlans");
            const floorPlansSnapshot = await getDocs(floorPlansRef);
            const allFloorPlans = floorPlansSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            // Separate pending analysis and analyzed floor plans
            const pendingPlans = allFloorPlans.filter(plan => !plan.analyzed);
            const completedPlans = allFloorPlans.filter(plan => plan.analyzed);

            setPendingAnalysisPlans(pendingPlans);
            setAnalyzedPlans(completedPlans);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // For non-logged-in users, check localStorage
        const localRoomLayout = localStorage.getItem('roomLayout');
        if (localRoomLayout) {
          const savedFloorPlan = JSON.parse(localRoomLayout);
          setPendingAnalysisPlans([{ id: 'incomplete', data: savedFloorPlan, name: 'Saved Floor Plan', analyzed: false }]);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleOpenUserSettings = () => {
    setShowUserSettings(true);
  };

  const handleCloseUserSettings = () => {
    setShowUserSettings(false);
  };

  const handleUpdateProfile = (newName, newGender, newDateOfBirth) => {
    setUserData({
      displayName: newName,
      gender: newGender,
      dateOfBirth: newDateOfBirth,
    });
    handleCloseUserSettings();
  };

  const handleDelete = async (planId) => {
    if (user && planId) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'floorPlans', planId));
        setPendingAnalysisPlans(prev => prev.filter(plan => plan.id !== planId));
        setAnalyzedPlans(prev => prev.filter(plan => plan.id !== planId));
      } catch (error) {
        console.error('Error deleting floor plan:', error);
      }
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-muted">
        <header className="bg-background border-b px-4 sm:px-6 flex items-center h-16">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <NotebookIcon className="w-6 h-6" />
            <span className="text-lg font-semibold">FengShuiModern</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Billing
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link
                    href="#"
                    className="flex items-center gap-2"
                    prefetch={false}
                  >
                    <CreditCardIcon className="w-4 h-4" />
                    <span>Manage Subscription</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="#"
                    className="flex items-center gap-2"
                    prefetch={false}
                  >
                    <ReceiptIcon className="w-4 h-4" />
                    <span>Billing History</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="#"
                    className="flex items-center gap-2"
                    prefetch={false}
                  >
                    <ReceiptIcon className="w-4 h-4" />
                    <span>Update Payment</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Past Paid Analysis
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Tips & Tricks
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Discord Community
            </Link>
            <Link href="/planner" className="mr-4">
              <Button 
                onClick={() => console.log("Analyze New Space clicked")}
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
                  Analyze New Space
                  <Sparkles className="ml-2 w-5 h-5 group-hover:animate-pulse" />
                </span>
              </Button>
            </Link>
            <Avatar
              className={cn(
                "w-8 h-8 border cursor-pointer",
                "transition-all duration-300 ease-in-out",
                "hover:scale-110 hover:shadow-md hover:border-primary"
              )}
              onClick={handleOpenUserSettings}
            >
              <AvatarFallback className="group">
                <span className="transition-transform duration-300 group-hover:scale-110 inline-block">
                  {userData.displayName ? userData.displayName[0].toUpperCase() : "U"}
                </span>
              </AvatarFallback>
            </Avatar>
            {showUserSettings && (
              <UserSettings
                onClose={handleCloseUserSettings}
                onUpdateProfile={handleUpdateProfile}
                currentDisplayName={userData.displayName}
                currentGender={userData.gender}
                currentDateOfBirth={userData.dateOfBirth}
                onLogout={handleLogout}
              />
            )}
          </nav>
        </header>
        {userData.isVIP ? (
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2 px-4 text-center">
            <span className="font-bold">VIP Status Active</span> - Enjoy your
            exclusive benefits!
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-4 text-center">
            <span className="font-bold">Upgrade to VIP</span> - Unlock exclusive
            Feng Shui insights and personalized recommendations!
            <button className="ml-4 bg-white text-blue-700 px-4 py-1 rounded-full text-sm font-bold hover:bg-blue-100 transition-colors">
              Upgrade Now
            </button>
          </div>
        )}
        <div className="flex-1 grid grid-cols-[240px_1fr] gap-8 p-4 sm:p-6">
          <div className="bg-background rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Saved Analyses</h2>
              <p className="text-muted-foreground">Your saved floor plans and analyses</p>
            </div>
            <div className="p-6">
              {[...pendingAnalysisPlans, ...analyzedPlans].length > 0 ? (
                <ul className="space-y-3">
                  {[...pendingAnalysisPlans, ...analyzedPlans].map((plan, index) => (
                    <li key={plan.id} className="relative group">
                      <div
                        className="flex flex-col p-3 bg-muted rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted-foreground/10"
                        onMouseEnter={() => setExpandedId(plan.id)}
                        onMouseLeave={() => setExpandedId(null)}
                        onClick={() => router.push(`/saved-analyses/${plan.id}`)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-base">{`Save ${index + 1}`}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(plan.id);
                            }}
                            className="text-destructive hover:text-destructive/80 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          plan.analyzed ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                        }`}>
                          {plan.analyzed ? 'Analyzed' : 'Pending Analysis'}
                        </span>
                      </div>
                      <div 
                        className={`absolute left-0 top-full mt-2 z-10 bg-background rounded-lg shadow-lg p-2 w-full overflow-hidden transition-all duration-300 ${
                          expandedId === plan.id ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div 
                          className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-md transition-all duration-200 hover:opacity-80"
                        >
                          {plan.lowQualityImage ? (
                            <Image
                              src={plan.lowQualityImage}
                              alt={`Save ${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span>No image available</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground">
                  No saved floor plans found.
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-8">
            <UserProfile displayName={userData.displayName} gender={userData.gender} dateOfBirth={userData.dateOfBirth} />
            <TipsAndTricks />
          </div>
        </div>
        <footer className="bg-background border-t px-4 sm:px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; 2024 FengShuiModern. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Terms of Service
            </Link>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}