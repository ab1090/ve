export type ValidationResult = {
  ok: boolean;
  reasons: string[];
};

import {validateSvgString as validateSvgStringImpl} from './validateSvgCore.js';

export const validateSvgString: (svg: string) => ValidationResult =
  validateSvgStringImpl;
