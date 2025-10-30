export default {
  multipass: true,
  plugins: [
    'removeDimensions',
    'removeStyleElement',
    'removeScriptElement',
    {name: 'removeAttrs', params: {attrs: ['class', 'id', 'data-name']}},
    {name: 'convertPathData', params: {straightCurves: false}},
  ],
};
