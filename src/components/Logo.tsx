import React from "react";

export const Logo = ({ className = "h-10 w-10", color = "currentColor" }: { className?: string; color?: string }) => {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* DNA Helix */}
      <path
        d="M35 110C35 110 45 100 50 90C55 80 65 70 65 70M65 110C65 110 55 100 50 90C45 80 35 70 35 70"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M35 70C35 70 45 60 50 50C55 40 65 30 65 30M65 70C65 70 55 60 50 50C45 40 35 30 35 30"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Rungs */}
      <line x1="42" y1="103" x2="58" y2="103" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="45" y1="80" x2="55" y2="80" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="37" x2="58" y2="37" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="45" y1="60" x2="55" y2="60" stroke={color} strokeWidth="2" strokeLinecap="round" />

      {/* Leaves on top */}
      {/* Center Leaf */}
      <path
        d="M50 30C50 30 42 20 42 10C42 0 50 -5 50 -5C50 -5 58 0 58 10C58 20 50 30 50 30Z"
        stroke={color}
        strokeWidth="3"
        fill="none"
      />
      <line x1="50" y1="30" x2="50" y2="5" stroke={color} strokeWidth="2" />

      {/* Left Leaf */}
      <path
        d="M42 40C42 40 32 35 25 35C18 35 12 40 12 40C12 40 18 48 25 48C32 48 42 40 42 40Z"
        stroke={color}
        strokeWidth="3"
        fill="none"
      />
      <line x1="42" y1="40" x2="20" y2="40" stroke={color} strokeWidth="2" />

      {/* Right Leaf */}
      <path
        d="M58 40C58 40 68 35 75 35C82 35 88 40 88 40C88 40 82 48 75 48C68 48 58 40 58 40Z"
        stroke={color}
        strokeWidth="3"
        fill="none"
      />
      <line x1="58" y1="40" x2="80" y2="40" stroke={color} strokeWidth="2" />
    </svg>
  );
};
