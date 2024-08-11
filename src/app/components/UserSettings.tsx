import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { auth } from '@/lib/firebase';
import { updateProfile, updatePassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LogOut } from "lucide-react";
import { Loader2 } from "lucide-react";

interface UserSettingsProps {
  onClose: () => void;
  onUpdateProfile: (displayName: string, gender: string, dateOfBirth: string) => void;
  currentDisplayName: string | null;
  currentGender: string | null;
  currentDateOfBirth: string | null;
  onLogout: () => void;
}

export function UserSettings({
  onClose,
  onUpdateProfile,
  currentDisplayName,
  currentGender,
  currentDateOfBirth,
  onLogout,
}: UserSettingsProps) {
  const [preferredName, setPreferredName] = useState(currentDisplayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(currentDateOfBirth || '');
  const [gender, setGender] = useState(currentGender || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { 
          displayName: preferredName,
          photoURL: JSON.stringify({ gender, dateOfBirth })
        });
        
        // Store additional user data in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          displayName: preferredName,
          gender,
          dateOfBirth,
        }, { merge: true });

        onUpdateProfile(preferredName, gender, dateOfBirth);
        console.log('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false)
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        console.log('Password changed successfully');
      }
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false)
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: 'update' | 'password') => {
    if (e.key === 'Enter') {
      if (action === 'update') {
        handleUpdateProfile(e);
      } else if (action === 'password') {
        handleChangePassword(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">User Settings</h2>
        <div className="space-y-4">
          <form onSubmit={handleUpdateProfile} onKeyPress={(e) => handleKeyPress(e, 'update')}>
            <div>
              <label className="block mb-1">Preferred Name</label>
              <input
                type="text"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </Button>
          </form>
          <form onSubmit={handleChangePassword} onKeyPress={(e) => handleKeyPress(e, 'password')}>
            <div>
              <label className="block mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </form>
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
        <Button variant="ghost" onClick={onClose} className="mt-4">Close</Button>
      </div>
    </div>
  );
}