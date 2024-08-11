"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SparkleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SparkleButton: React.FC<SparkleButtonProps> = ({ children, className, ...props }) => {
  return (
    <Button
      className={cn(
        'relative overflow-hidden transition-all duration-500 ease-in-out',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500',
        'before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500',
        'hover:text-white',
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </Button>
  );
};

export default SparkleButton;
