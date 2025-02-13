export interface Config {
  SCRIPT_TYPE: "篆书" | "隶书" | "楷书" | "行书";
  PATHS: string[];
  SOURCES: {
    title: string;
    nestedItem?: boolean;
    url: string;
  }[];
}

export interface ListSelectors {
  PROFILE_NAME: string;
  CARD_WRAPPER: string;
  CARD_TIME: string;
  CARD_LINK: string;
  IMAGES: string;
}

export interface ItemSelectors {
  EXPAND_BUTTON: string;
  TITLE: {
    PRIMARY: string;
    SECONDARY: string;
  };
  IMAGES: {
    PRIMARY: string;
    SECONDARY: string;
  };
}

// 颜色
export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface Dimensions {
  centerX: number;
  centerY: number;
  maxSharpX: number;
  maxSharpY: number;
}

export interface CropDimensions {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface BoundaryResult {
  x?: number;
  y?: number;
  rgb: RGB;
}
