import React from 'react';
import { Button } from "@/components/ui/button";
import BaguaChart from './BaguaChart';
import ElementIcon from './ElementIcon';

const calculateAge = (dateOfBirth: string): number => {
  const birthDate = new Date(dateOfBirth);
  const currentDate = new Date();
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const calculateMonthsAndDays = (dateOfBirth: string): string => {
  const birthDate = new Date(dateOfBirth);
  const currentDate = new Date();
  let months = currentDate.getMonth() - birthDate.getMonth();
  let days = currentDate.getDate() - birthDate.getDate();
  if (days < 0) {
    months--;
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    days += lastMonth.getDate();
  }
  if (months < 0) {
    months += 12;
  }
  return `${months} months, ${days} days`;
};

const calculateFengShuiElement = (dateOfBirth: string): string => {
  if (!dateOfBirth) return "";
  const year = new Date(dateOfBirth).getFullYear();
  const elements = ["Wood", "Fire", "Earth", "Metal", "Water"];
  return elements[(((year - 4) % 10) / 2) | 0];
};

const calculateLuckyDirection = (dateOfBirth: string): string => {
  if (!dateOfBirth) return "";
  const year = new Date(dateOfBirth).getFullYear();
  const directions = ["North", "South", "East", "West", "Northeast", "Northwest", "Southeast", "Southwest"];
  return directions[year % 8];
};

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function UserProfile({ displayName, gender, dateOfBirth }) {
  const age = dateOfBirth ? calculateAge(dateOfBirth) : null;
  const element = dateOfBirth ? calculateFengShuiElement(dateOfBirth) : null;
  const luckyDirection = dateOfBirth ? calculateLuckyDirection(dateOfBirth) : null;

  return (
    <section className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Quick Analysis</h2>
        <p className="text-sm text-muted-foreground">Your personal Feng Shui insights</p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-muted p-3 rounded-lg">
            <h3 className="text-xs font-medium text-muted-foreground mb-1">Name</h3>
            <p className="text-sm font-medium">{displayName || "Not set"}</p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <h3 className="text-xs font-medium text-muted-foreground mb-1">Age</h3>
            <p className="text-sm font-medium">{age !== null ? age : "Not set"}</p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <h3 className="text-xs font-medium text-muted-foreground mb-1">Gender</h3>
            <p className="text-sm font-medium">{gender ? capitalizeFirstLetter(gender) : "Not set"}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Feng Shui Element</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">{element || "Not available"}</p>
              </div>
              <div className="w-24 h-24">{element && <ElementIcon element={element} />}</div>
            </div>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Lucky Direction</h3>
            <div className="w-full aspect-square max-h-40">
              {luckyDirection && <BaguaChart luckyDirection={luckyDirection} />}
            </div>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium text-sm text-muted-foreground">Daily Feng Shui Recommendation</h3>
            <p className="text-lg italic">Coming soon!</p>
          </div>
        </div>
      </div>
    </section>
  );
}