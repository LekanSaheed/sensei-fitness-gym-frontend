import React, { ReactNode } from "react";

/** Circular progress in the brand colour. `value` is 0 - 1. */
const ProgressRing = ({
  value,
  size = 120,
  stroke = 10,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
}) => {
  const radius = (size - stroke) / 2;

  const circumference = 2 * Math.PI * radius;

  const clamped = Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));

  return (
    <div
      className="relative shrink-0 inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-default/15"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          className="stroke-default transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
};

export default ProgressRing;
