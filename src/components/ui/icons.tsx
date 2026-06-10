// Iconos del prototipo (hivo-design/ui.jsx:7-32 + home.jsx:655-661), paths literales.
// Stroke-based, viewBox 24, color por prop.
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';

export type IconProps = {
  size?: number;
  color?: string;
};

type StrokeIconDef = {
  paths: string[];
  circles?: { cx: number; cy: number; r: number }[];
  strokeWidth?: number;
};

function strokeIcon({ paths, circles, strokeWidth = 1.6 }: StrokeIconDef) {
  return function StrokeIcon({ size = 24, color = colors.fg }: IconProps) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {circles?.map((c, i) => (
          <Circle
            key={i}
            cx={c.cx}
            cy={c.cy}
            r={c.r}
            stroke={color}
            strokeWidth={strokeWidth}
          />
        ))}
        {paths.map((d, i) => (
          <Path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </Svg>
    );
  };
}

function fillIcon(paths: string[]) {
  return function FillIcon({ size = 24, color = colors.fg }: IconProps) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {paths.map((d, i) => (
          <Path key={i} d={d} fill={color} />
        ))}
      </Svg>
    );
  };
}

export const Icon = {
  home: strokeIcon({
    paths: ['M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z'],
  }),
  dumb: strokeIcon({ paths: ['M6 9v6M3 11v2M18 9v6M21 11v2M6 12h12'] }),
  squad: strokeIcon({
    paths: ['M3 19c0-3 2.5-5 6-5s6 2 6 5M15 19c0-2 1.5-3.5 4-3.5s2 1.5 2 3.5'],
    circles: [
      { cx: 9, cy: 8, r: 3 },
      { cx: 17, cy: 10, r: 2.2 },
    ],
  }),
  chart: strokeIcon({ paths: ['M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-6'] }),
  user: strokeIcon({
    paths: ['M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5'],
    circles: [{ cx: 12, cy: 8, r: 4 }],
  }),
  bell: strokeIcon({
    paths: ['M6 16V11a6 6 0 0112 0v5l1.5 2h-15L6 16z', 'M10 20a2 2 0 004 0'],
  }),
  plus: strokeIcon({ paths: ['M12 5v14M5 12h14'], strokeWidth: 1.8 }),
  check: strokeIcon({ paths: ['M4 12l5 5L20 6'], strokeWidth: 2 }),
  arrow: strokeIcon({ paths: ['M5 12h14M13 5l7 7-7 7'] }),
  back: strokeIcon({ paths: ['M15 5l-7 7 7 7'], strokeWidth: 1.8 }),
  more: function More({ size = 24, color = colors.fg }: IconProps) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx={6} cy={12} r={1.6} fill={color} />
        <Circle cx={12} cy={12} r={1.6} fill={color} />
        <Circle cx={18} cy={12} r={1.6} fill={color} />
      </Svg>
    );
  },
  flame: fillIcon([
    'M12 2s4 4 4 8c0 1.5-1 3-2 3s-1-2-3-2c-3 0-5 2.5-5 5.5C6 20 9 22 12 22s7-2.5 7-7c0-7-7-13-7-13z',
  ]),
  shield: strokeIcon({
    paths: ['M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z'],
  }),
  timer: strokeIcon({
    paths: ['M12 9v4l2.5 2.5M9 3h6M12 5v-2'],
    circles: [{ cx: 12, cy: 13, r: 8 }],
  }),
  play: fillIcon(['M7 5l12 7-12 7V5z']),
  pause: function Pause({ size = 24, color = colors.fg }: IconProps) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Rect x={6} y={5} width={4} height={14} rx={1} fill={color} />
        <Rect x={14} y={5} width={4} height={14} rx={1} fill={color} />
      </Svg>
    );
  },
  swap: strokeIcon({ paths: ['M7 7h13l-3-3M17 17H4l3 3'] }),
  bolt: fillIcon(['M13 2L4 14h6l-1 8 9-12h-6l1-8z']),
  warn: strokeIcon({ paths: ['M12 3l10 18H2L12 3zM12 10v5M12 18v.5'] }),
  info: strokeIcon({
    paths: ['M12 11v6M12 7.5v.5'],
    circles: [{ cx: 12, cy: 12, r: 9 }],
  }),
  pin: strokeIcon({
    paths: ['M12 21v-7M5 9c0-2 1.5-4 3-4h8c1.5 0 3 2 3 4 0 3-3 5-3 5H8s-3-2-3-5z'],
  }),
  close: strokeIcon({ paths: ['M6 6l12 12M18 6L6 18'], strokeWidth: 1.8 }),
  heart: fillIcon([
    'M12 21s-7-4.5-9.5-9C0.5 7.5 4 4 7.5 5.5 9 6 11 7 12 9c1-2 3-3 4.5-3.5C20 4 23.5 7.5 21.5 12 19 16.5 12 21 12 21z',
  ]),
  trophy: strokeIcon({
    paths: [
      'M8 4h8v5a4 4 0 01-8 0V4z',
      'M8 6H5v2a3 3 0 003 3M16 6h3v2a3 3 0 01-3 3M9 14h6M10 14l-1 6h6l-1-6',
    ],
  }),
  // Iconos del carrusel de warmups (home.jsx:655-661)
  wuShoulders: strokeIcon({
    paths: ['M12 4a3 3 0 100 6 3 3 0 000-6z', 'M5 13c1.5-2 4-3 7-3s5.5 1 7 3M5 13v6M19 13v6'],
  }),
  wuChest: strokeIcon({
    paths: ['M4 8c2-2 5-3 8-3s6 1 8 3M4 8v4c0 4 3.5 7 8 7s8-3 8-7V8M9 12h6'],
  }),
  wuBack: strokeIcon({ paths: ['M12 2v20M7 6l5-4 5 4M7 18l5 4 5-4M5 12h14'] }),
  wuLegs: strokeIcon({ paths: ['M9 4v8l-1 8M15 4v8l1 8M9 4h6M8 20h2M14 20h2'] }),
  wuFullBody: strokeIcon({
    paths: ['M9 22l1-9-2-4 4-2 4 2-2 4 1 9M7 11l-2 2M17 11l2 2'],
    circles: [{ cx: 12, cy: 5, r: 2.5 }],
  }),
  // Hoja del rest day (home.jsx:241-243)
  leaf: strokeIcon({
    paths: ['M20 12c-.8 4-4.4 7-8.5 7C7 19 3 15 3 10c2.5 0 7-1 9-6.5C13 7 16 10 20 12z'],
  }),
};

export type IconName = keyof typeof Icon;
