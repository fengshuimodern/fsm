"use client";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/VyXWZcGzX31
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React from 'react';

interface BaguaChartProps {
  luckyDirection: string;
}

export default function BaguaChart({ luckyDirection }: BaguaChartProps) {
  const directions = [
    "North",
    "Northeast",
    "East",
    "Southeast",
    "South",
    "Southwest",
    "West",
    "Northwest",
  ];
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon
        points="50,5 95,50 50,95 5,50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <polygon
        points="50,15 85,50 50,85 15,50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      {directions.map((direction, index) => {
        const angle = index * 45;
        const radians = (angle * Math.PI) / 180;
        const x = 50 + 45 * Math.sin(radians);
        const y = 50 - 45 * Math.cos(radians);
        return (
          <text
            key={direction}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fill={direction === luckyDirection ? "green" : "currentColor"}
            fontWeight={direction === luckyDirection ? "bold" : "normal"}
          >
            {direction}
          </text>
        );
      })}
    </svg>
  );
}