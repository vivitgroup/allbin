'use client';

import { useEffect, useRef } from 'react';

interface Props {
  size?: number;
  animate?: boolean;
  className?: string;
}

export default function BsLogoAnimated({ size = 120, animate = true, className = '' }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      aria-label="Bin Siddiq Fabric Logo"
    >
      <defs>
        {/* Deep red gradient for B */}
        <linearGradient id="grad-B" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B0000" />
          <stop offset="60%" stopColor="#A31515" />
          <stop offset="100%" stopColor="#6B0000" />
        </linearGradient>
        {/* Silver gradient for S */}
        <linearGradient id="grad-S" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0E0E0" />
          <stop offset="40%" stopColor="#C0C0C0" />
          <stop offset="100%" stopColor="#A0A0A0" />
        </linearGradient>
        {/* Red gradient for scissors/ribbon */}
        <linearGradient id="grad-scissors" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#CC0000" />
          <stop offset="50%" stopColor="#FF1A1A" />
          <stop offset="100%" stopColor="#CC0000" />
        </linearGradient>

        {/* Scissors cut animation */}
        <clipPath id="cut-reveal">
          <rect x="0" y="0" width="200" height="200">
            {animate && (
              <animate
                attributeName="width"
                from="0"
                to="200"
                dur="1.2s"
                begin="0.3s"
                fill="freeze"
                calcMode="spline"
                keySplines="0.4 0 0.2 1"
              />
            )}
          </rect>
        </clipPath>

        {/* Drop shadow */}
        <filter id="logo-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#00000033" />
        </filter>
      </defs>

      {/* ─── B Letter ─── */}
      <g filter="url(#logo-shadow)">
        {/* Main B shape */}
        <path
          d="M30,20 L30,180 L30,180 L75,180
             Q105,180 115,165 Q125,150 125,135
             Q125,118 112,108 Q100,98 85,96
             Q100,94 110,84 Q120,74 120,58
             Q120,42 108,31 Q96,20 75,20 Z
             M55,45 L72,45 Q85,45 92,52 Q99,59 99,72
             Q99,85 92,91 Q85,97 72,97 L55,97 Z
             M55,120 L75,120 Q90,120 98,128 Q106,136 106,150
             Q106,164 98,172 Q90,180 75,180 L55,180 Z"
          fill="url(#grad-B)"
          opacity={animate ? "0" : "1"}
        >
          {animate && (
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="0.6s"
              begin="0s"
              fill="freeze"
            />
          )}
        </path>

        {/* B ribbon/loop detail */}
        <path
          d="M28,90 Q50,70 80,90 Q50,110 28,90 Z"
          fill="none"
          stroke="#8B0000"
          strokeWidth="2"
          opacity="0.5"
        />
      </g>

      {/* ─── S Letter ─── */}
      <g opacity={animate ? "0" : "1"} clipPath="url(#cut-reveal)">
        <animate
          attributeName="opacity"
          from="0"
          to="1"
          dur="0.5s"
          begin="0.2s"
          fill="freeze"
        />
        <path
          d="M125,55 Q135,30 160,30 Q185,30 192,50 Q199,70 185,82
             Q175,92 155,100 Q135,108 128,120 Q120,132 128,148
             Q136,164 158,168 Q180,172 192,158"
          fill="none"
          stroke="url(#grad-S)"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#logo-shadow)"
        />
      </g>

      {/* ─── Scissors ─── */}
      <g>
        {/* Scissors blade top */}
        <g opacity={animate ? "0" : "1"}>
          {animate && (
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="0.4s"
              begin="0.6s"
              fill="freeze"
            />
          )}
          {/* Blade */}
          <path
            d="M40,110 L155,85"
            stroke="url(#grad-scissors)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#logo-shadow)"
          >
            {animate && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="-8 95 98"
                to="0 95 98"
                dur="0.5s"
                begin="0.6s"
                fill="freeze"
                calcMode="spline"
                keySplines="0.34 1.56 0.64 1"
              />
            )}
          </path>

          {/* Blade bottom */}
          <path
            d="M40,118 L155,143"
            stroke="url(#grad-scissors)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#logo-shadow)"
          >
            {animate && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="8 95 130"
                to="0 95 130"
                dur="0.5s"
                begin="0.6s"
                fill="freeze"
                calcMode="spline"
                keySplines="0.34 1.56 0.64 1"
              />
            )}
          </path>

          {/* Pivot screw */}
          <circle cx="95" cy="113" r="7" fill="#CC0000" stroke="#FF4444" strokeWidth="1.5" />
          <circle cx="95" cy="113" r="2.5" fill="#FF6666" />

          {/* Left handle ring top */}
          <ellipse cx="47" cy="100" rx="16" ry="11"
            fill="none" stroke="url(#grad-scissors)" strokeWidth="7"
            transform="rotate(-12 47 100)" />

          {/* Left handle ring bottom */}
          <ellipse cx="47" cy="128" rx="16" ry="11"
            fill="none" stroke="url(#grad-scissors)" strokeWidth="7"
            transform="rotate(12 47 128)" />
        </g>
      </g>

      {/* ─── Scissors snip animation (ongoing) ─── */}
      {animate && (
        <g>
          {/* Sparkle after cut */}
          <g opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="0.4s" begin="1.2s" fill="freeze" />
            <circle cx="155" cy="95" r="3" fill="#FF1A1A" />
            <circle cx="162" cy="88" r="2" fill="#FFD700" />
            <circle cx="160" cy="102" r="2" fill="#FF1A1A" />
            <circle cx="148" cy="86" r="1.5" fill="#FFD700" />
          </g>
        </g>
      )}
    </svg>
  );
}
