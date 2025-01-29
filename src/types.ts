export type LogoTemplate = {
  id: number;
  name: string;
  icon: React.ReactNode;
  layout: string;
  category: string;
};

export type Position = {
  x: number;
  y: number;
};

export type LogoLayer = {
  id: string;
  type: 'text' | 'icon' | 'emoji' | 'shape';
  content: string | React.ReactNode;
  position: Position;
  style: {
    color?: string;
    fontSize?: number;
    opacity?: number;
    rotation?: number;
    shadow?: boolean;
    shadowColor?: string;
    shadowBlur?: number;
    gradient?: boolean;
    gradientColors?: string[];
  };
  visible: boolean;
  locked: boolean;
};