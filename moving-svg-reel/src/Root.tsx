import React from 'react';
import { Composition } from 'remotion';
import { MorphingBlobScene } from './scenes/MorphingBlobScene';
import { brand } from './tokens/brand';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="MorphingBlobReel"
      component={MorphingBlobScene}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        title: 'Your Hook Here',
        bgA: brand.colors.bgA,
        bgB: brand.colors.bgB,
        stroke: brand.colors.stroke,
        fill: brand.colors.accent,
      }}
    />
  </>
);

