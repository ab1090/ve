import React, {useMemo} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import * as flubber from 'flubber';
import {brand} from '../tokens/brand';

const SHAPES = [
  'M540,120 C740,120 930,300 930,520 C930,750 760,950 540,960 C320,970 150,760 150,540 C150,320 340,120 540,120 Z',
  'M520,150 C710,190 900,360 900,560 C900,760 720,930 520,940 C320,950 160,790 170,560 C180,330 330,120 520,150 Z',
  'M560,140 C760,200 940,390 890,590 C840,790 670,940 500,940 C330,940 180,780 200,560 C220,340 370,120 560,140 Z',
  'M520,130 C710,120 930,320 930,540 C930,760 730,950 530,960 C330,970 150,800 170,560 C190,320 330,140 520,130 Z',
];

type Insight = {
  label: string;
  detail: string;
  start: number;
};

const dashArray = 1480;

export type MorphingBlobSceneProps = {
  title?: string;
  subtitle?: string;
  highlight?: string;
  cta?: string;
  ctaNote?: string;
  bgA?: string;
  bgB?: string;
  stroke?: string;
  fill?: string;
};

export const MorphingBlobScene: React.FC<MorphingBlobSceneProps> = ({
  title = 'Design your second brain scenes.',
  subtitle = 'Storyboard • Script • Shoot • Ship',
  highlight = 'Ali Abdaal energy in 6 seconds',
  cta = 'Build the reel blueprint',
  ctaNote = 'Modular, swappable, ready for remixes',
  bgA = brand.colors.bgA,
  bgB = brand.colors.bgB,
  stroke = brand.colors.stroke,
  fill = brand.colors.accent,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps, width, height} = useVideoConfig();

  const segment = durationInFrames / SHAPES.length;
  const stage = Math.floor(frame / segment) % SHAPES.length;
  const nextIndex = (stage + 1) % SHAPES.length;
  const local = (frame % segment) / segment;
  const easedLocal = Easing.inOut(Easing.cubic)(local);

  const morph = useMemo(
    () => flubber.interpolate(SHAPES[stage], SHAPES[nextIndex], {maxSegmentLength: 1.8}),
    [stage, nextIndex]
  );
  const blobPath = morph(easedLocal);

  const gradientAngle = interpolate(frame, [0, durationInFrames], [8, 192], {
    easing: Easing.inOut(Easing.quad),
  });

  const gradientShift = interpolate(frame, [0, durationInFrames], [0, width * 0.08], {
    easing: Easing.inOut(Easing.cubic),
  });

  const floatY = interpolate(
    Math.sin((frame / fps) * Math.PI * 0.5),
    [-1, 1],
    [-20, 16]
  );

  const floatX = interpolate(
    Math.cos((frame / fps) * Math.PI * 0.33),
    [-1, 1],
    [-18, 18]
  );

  const perimeterPulse = 0.75 + 0.25 * Math.sin((frame / fps) * Math.PI * 0.8);
  const dashPhase = interpolate(frame, [0, fps * 0.8, fps * 1.6, durationInFrames], [1, 0.32, 0.12, 0.45], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sheenX = interpolate(frame % (fps * 4), [0, fps * 2, fps * 4], [-width * 0.3, width * 1.1, width * 1.5]);
  const glowOpacity = 0.35 + 0.25 * Math.sin((frame / fps) * Math.PI * 1.2);

  const gridShift = interpolate(frame, [0, durationInFrames], [0, 160], {
    easing: Easing.inOut(Easing.quad),
  });

  const titleReveal = interpolate(frame, [fps * 0.3, fps * 1.4], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtitleReveal = interpolate(frame, [fps * 0.8, fps * 1.8], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const highlightReveal = interpolate(frame, [fps * 1.2, fps * 2.4], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ctaReveal = interpolate(frame, [durationInFrames - fps * 1.8, durationInFrames - fps * 0.4], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const insights: Insight[] = [
    {
      label: 'Capture curiosity',
      detail: 'Hook viewers with a kinetic cold open',
      start: fps * 0.9,
    },
    {
      label: 'Design depth',
      detail: 'Layer gradients, grids, and glow for premium polish',
      start: fps * 1.6,
    },
    {
      label: 'Ship consistently',
      detail: 'Parametrize scenes so every upload stays on brand',
      start: fps * 2.3,
    },
  ];

  const insightOriginX = width * 0.18;
  const insightOriginY = height * 0.65;
  const insightSpacing = 88;

  const orbs = [
    {radius: 90, offset: 0, phase: 0},
    {radius: 56, offset: width * 0.18, phase: Math.PI / 2},
    {radius: 70, offset: -width * 0.22, phase: Math.PI},
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        <linearGradient
          id="bg"
          x1={0}
          y1={0}
          x2={width}
          y2={height}
          gradientTransform={`translate(${gradientShift}, ${-gradientShift * 0.6}) rotate(${gradientAngle}, ${width / 2}, ${height / 2})`}
        >
          <stop offset="0%" stopColor={bgA} />
          <stop offset="65%" stopColor={bgB} />
          <stop offset="100%" stopColor={bgA} />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor={fill} stopOpacity={0.45} />
          <stop offset="55%" stopColor={fill} stopOpacity={0.1} />
          <stop offset="100%" stopColor={fill} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="sheen" x1="0%" x2="100%">
          <stop offset="0%" stopColor={stroke} stopOpacity={0} />
          <stop offset="45%" stopColor={stroke} stopOpacity={0.3} />
          <stop offset="55%" stopColor={stroke} stopOpacity={0.5} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
        <pattern
          id="grid"
          width={160}
          height={160}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${gridShift}, ${gridShift * 0.5}) rotate(-12)`}
        >
          <path d="M0 0 H160" stroke={stroke} strokeOpacity={0.06} strokeWidth={2} />
          <path d="M0 80 H160" stroke={stroke} strokeOpacity={0.04} strokeWidth={1.5} />
          <path d="M0 160 H160" stroke={stroke} strokeOpacity={0.06} strokeWidth={2} />
          <path d="M0 0 V160" stroke={stroke} strokeOpacity={0.06} strokeWidth={2} />
          <path d="M80 0 V160" stroke={stroke} strokeOpacity={0.04} strokeWidth={1.5} />
          <path d="M160 0 V160" stroke={stroke} strokeOpacity={0.06} strokeWidth={2} />
        </pattern>
        <clipPath id="blobClip">
          <path d={blobPath} transform={`translate(${floatX}, ${floatY})`} />
        </clipPath>
        <mask id="softFade">
          <rect width={width} height={height} fill="url(#glow)" opacity={glowOpacity} />
        </mask>
      </defs>

      <rect width={width} height={height} fill="url(#bg)" />
      <rect width={width} height={height} fill="url(#glow)" opacity={glowOpacity} />

      {orbs.map((orb, index) => {
        const orbProgress = (frame / fps) * 0.6 + orb.phase;
        const x = width / 2 + orb.offset + Math.cos(orbProgress) * 36;
        const y = height * 0.45 + Math.sin(orbProgress * 1.4) * 40;
        const scale = 0.9 + 0.1 * Math.sin(orbProgress * 1.2 + index);
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={orb.radius * scale}
            fill={fill}
            opacity={0.06 + index * 0.04}
          />
        );
      })}

      <path
        d={blobPath}
        transform={`translate(${floatX}, ${floatY})`}
        fill="none"
        stroke={stroke}
        strokeWidth={6 * perimeterPulse}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashArray * dashPhase,
          opacity: 0.85,
        }}
      />

      <g clipPath="url(#blobClip)">
        <rect
          x={width * 0.08}
          y={height * 0.18}
          width={width * 0.84}
          height={height * 0.64}
          rx={44}
          fill={fill}
          opacity={0.12}
        />
        <rect
          x={width * 0.1}
          y={height * 0.24}
          width={width * 0.8}
          height={height * 0.5}
          rx={38}
          fill="url(#grid)"
          opacity={0.75}
        />
        <rect
          x={sheenX}
          y={height * 0.2}
          width={width * 0.4}
          height={height * 0.65}
          fill="url(#sheen)"
          opacity={0.45}
        />
        <rect
          x={width * 0.14}
          y={height * 0.28}
          width={width * 0.72}
          height={height * 0.42}
          rx={32}
          fill={bgB}
          opacity={0.35}
        />
      </g>

      <g mask="url(#softFade)">
        <path
          d={blobPath}
          transform={`translate(${floatX}, ${floatY})`}
          fill="none"
          stroke={fill}
          strokeOpacity={0.4}
          strokeWidth={1.8}
          strokeDasharray={420}
          strokeDashoffset={420 - (frame % 420)}
        />
      </g>

      <g transform={`translate(${width * 0.16}, ${height * 0.22})`} opacity={titleReveal}>
        <text
          x={0}
          y={0}
          textAnchor="start"
          fontFamily={brand.typography.fontFamily}
          fontSize={18}
          fill={fill}
          letterSpacing="0.4em"
          opacity={0.75}
        >
          CREATOR PLAYBOOK
        </text>
        <text
          x={0}
          y={brand.typography.titleSize}
          textAnchor="start"
          fontFamily={brand.typography.fontFamily}
          fontWeight={600}
          fontSize={brand.typography.titleSize}
          fill={stroke}
          letterSpacing={`${(1 - titleReveal) * 8}px`}
        >
          {title}
        </text>
      </g>

      <text
        x={width * 0.16}
        y={height * 0.22 + brand.typography.titleSize + 52}
        textAnchor="start"
        fontFamily={brand.typography.fontFamily}
        fontSize={30}
        fill={stroke}
        opacity={subtitleReveal}
      >
        {subtitle}
      </text>

      <g transform={`translate(${width * 0.16}, ${height * 0.22 + brand.typography.titleSize + 100})`} opacity={highlightReveal}>
        <rect x={0} y={-36} width={width * 0.38} height={56} rx={28} fill={fill} opacity={0.18} />
        <text
          x={28}
          y={0}
          textAnchor="start"
          fontFamily={brand.typography.fontFamily}
          fontSize={26}
          fill={stroke}
        >
          {highlight}
        </text>
      </g>

      <g>
        {insights.map((insight, index) => {
          const appear = interpolate(frame, [insight.start, insight.start + fps * 0.6], [0, 1], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = insightOriginY + index * insightSpacing;
          return (
            <g key={insight.label} transform={`translate(${insightOriginX}, ${y})`} opacity={appear}>
              <circle cx={0} cy={0} r={12} fill={fill} opacity={0.4 + 0.2 * appear} />
              <circle cx={0} cy={0} r={20} stroke={fill} strokeOpacity={0.35} strokeWidth={2} fill="none" />
              <text
                x={36}
                y={0}
                textAnchor="start"
                fontFamily={brand.typography.fontFamily}
                fontSize={30}
                fill={stroke}
                fontWeight={600}
              >
                {insight.label}
              </text>
              <text
                x={36}
                y={32}
                textAnchor="start"
                fontFamily={brand.typography.fontFamily}
                fontSize={22}
                fill={stroke}
                opacity={0.72}
              >
                {insight.detail}
              </text>
            </g>
          );
        })}
      </g>

      <g transform={`translate(${width * 0.5}, ${height * 0.88})`} opacity={ctaReveal}>
        <rect
          x={-width * 0.24}
          y={-60}
          width={width * 0.48}
          height={110}
          rx={36}
          fill={fill}
          opacity={0.24}
        />
        <text
          textAnchor="middle"
          fontFamily={brand.typography.fontFamily}
          fontSize={34}
          fill={stroke}
          fontWeight={600}
        >
          {cta}
        </text>
        <text
          y={34}
          textAnchor="middle"
          fontFamily={brand.typography.fontFamily}
          fontSize={22}
          fill={stroke}
          opacity={0.75}
        >
          {ctaNote}
        </text>
      </g>
    </svg>
  );
};
