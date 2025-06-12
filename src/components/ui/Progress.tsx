import React from "react";

interface ProgressProps {
  value: number; // 0~100
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className ?? ''}`}>
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
} 