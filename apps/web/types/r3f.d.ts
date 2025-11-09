/// <reference types="react" />
/// <reference types="react/next" />
/// <reference types="react-dom/next" />

import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      primitive: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
    }
  }
}
