import React from 'react';

interface ElementIconProps {
  element: string;
}

export default function ElementIcon({ element }: ElementIconProps) {
  switch (element) {
    case "Wood":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50,10 Q60,50 50,90 Q40,50 50,10" fill="green" />
          <path
            d="M30,50 Q40,30 50,50 Q60,70 70,50"
            fill="none"
            stroke="darkgreen"
            strokeWidth="2"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;0,-5;0,0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      );
    case "Fire":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50,90 Q30,50 50,10 Q70,50 50,90" fill="orange" />
          <path d="M50,90 Q40,60 50,30 Q60,60 50,90" fill="red">
            <animate
              attributeName="d"
              values="M50,90 Q40,60 50,30 Q60,60 50,90;M50,90 Q35,55 50,25 Q65,55 50,90;M50,90 Q40,60 50,30 Q60,60 50,90"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      );
    case "Earth":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="20" y="20" width="60" height="60" fill="brown" />
          <circle cx="50" cy="50" r="20" fill="sandybrown">
            <animate
              attributeName="r"
              values="20;22;20"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      );
    case "Metal":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="silver" />
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <animate
              attributeName="r"
              values="30;35;30"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      );
    case "Water":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M30,50 Q50,20 70,50 Q50,80 30,50" fill="blue" />
          <path
            d="M40,50 Q50,30 60,50"
            fill="none"
            stroke="lightblue"
            strokeWidth="2"
          >
            <animate
              attributeName="d"
              values="M40,50 Q50,30 60,50;M40,50 Q50,40 60,50;M40,50 Q50,30 60,50"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      );
    default:
      return null;
  }
}