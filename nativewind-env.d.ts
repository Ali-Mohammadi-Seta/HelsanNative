/// <reference types="nativewind/types" />

import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }

  interface TextProps {
    className?: string;
  }

  interface ImageProps {
    className?: string;
  }

  interface ScrollViewProps {
    className?: string;
    contentContainerClassName?: string;
  }

  interface TextInputProps {
    className?: string;
  }

  interface TouchableOpacityProps {
    className?: string;
  }

  interface KeyboardAvoidingViewProps {
    className?: string;
  }
}

declare module "*.png" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.jpg" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.jpeg" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.gif" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.svg" {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
