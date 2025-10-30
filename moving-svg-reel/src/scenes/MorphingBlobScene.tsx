import React, {useMemo} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import * as flubber from 'flubber';
import {brand} from '../tokens/brand';

const SHAPES = [
  'M540,150 C720,160 900,320 900,540 C900,760 720,920 540,930 C360,940 180,780 180,560 C180,340 360,140 540,150 Z',
  'M520,180 C690,220 860,360 880,560 C900,760 740,900 540,910 C340,920 200,780 200,560 C200,340 350,140 520,180 Z',
  'M560,160 C760,200 900,380 880,560 C860,740 700,900 520,920 C340,940 200,800 200,560 C200,320 360,120 560,160 Z',
];

export type MorphingBlobSceneProps = {
  title?: string;
  bgA?: string;
  bgB?: string;
  stroke?: string;
  fill?: string;
};

const dashArray = 1400;

export const MorphingBlobScene: React.FC<MorphingBlobSceneProps> = ({
  title = 'Prime, polished, vector-clean.',
  bgA = brand.colors.bgA,
  bgB = brand.colors.bgB,
  stroke = brand.colors.stroke,
  fill = brand.colors.accent,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps, width, height} = useVideoConfig();

  const angle = interpolate(frame, [0, durationInFrames], [15, 195], {
    easing: Easing.inOut(Easing.cubic),
  });

  const half = durationInFrames / 2;
  const idx = frame < half ? 0 : 1;
  const next = frame < half ? 1 : 2;
  const local = frame < half ? frame / half : (frame - half) / half;

  const morph = useMemo(
    () => flubber.interpolate(SHAPES[idx], SHAPES[next], {maxSegmentLength: 2}),
    [idx, next]
  );
  const blobPath = morph(local);

  const dashPhase = interpolate(frame, [0, fps * 0.3, fps * 1.2], [1, 0.6, 0], {
    easing: Easing.ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const floatY = interpolate(
    Math.sin((frame / fps) * Math.PI * 0.5),
    [-1, 1],
    [-8, 8]
  );

  const titleIn = interpolate(frame, [fps * 0.4, fps * 1.2], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        <linearGradient
          id="bg"
          x1="0"
          y1="0"
          x2={width}
          y2={height}
          gradientTransform={`rotate(${angle}, ${width / 2}, ${height / 2})`}
        >
          <stop offset="0%" stopColor={bgA} />
          <stop offset="100%" stopColor={bgB} />
        </linearGradient>
        <clipPath id="blobClip">
          <path d={blobPath} transform={`translate(0, ${floatY})`} />
        </clipPath>
      </defs>

      <rect width={width} height={height} fill="url(#bg)" />

      <path
        d={blobPath}
        transform={`translate(0, ${floatY})`}
        fill="none"
        stroke={stroke}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashArray * dashPhase,
          opacity: 0.9,
        }}
      />

      <g clipPath="url(#blobClip)">
        <rect
          x={width * 0.15}
          y={height * 0.2}
          rx={32}
          width={width * 0.7}
          height={height * 0.6}
          fill={fill}
          opacity={0.15}
        />
        <rect
          x={width * 0.1}
          y={height * 0.25}
          rx={28}
          width={width * 0.8}
          height={height * 0.5}
          fill="url(#bg)"
          opacity={0.45}
        />
      </g>

      <g transform={`translate(${width / 2}, ${height * 0.82})`}>
        <text
          textAnchor="middle"
          fontFamily={brand.typography.fontFamily}
          fontSize={brand.typography.titleSize + 8 * titleIn}
          letterSpacing={`${(1 - titleIn) * 2}px`}
          fill="none"
          stroke={stroke}
          strokeWidth={2}
          opacity={0.85}
        >
          {title}
        </text>
        <text
          textAnchor="middle"
          fontFamily={brand.typography.fontFamily}
          fontSize={brand.typography.titleSize}
          fill={stroke}
          opacity={titleIn}
        >
          {title}
        </text>
      </g>
    </svg>
  );
};
