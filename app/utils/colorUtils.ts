import convert from 'color-convert';

export const hsbToHex = (hsb: { hue: number, saturation: number, brightness: number }): string => {
  const { hue, saturation, brightness } = hsb;
  const [r, g, b] = convert.hsv.rgb([hue, saturation * 100, brightness * 100]);
  return `#${r.toString(16).padStart(2, '0').toUpperCase()}${g.toString(16).padStart(2, '0').toUpperCase()}${b.toString(16).padStart(2, '0').toUpperCase()}`;
};

export const hexToHsb = (hex: string): { hue: number, saturation: number, brightness: number } => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  const [h, s, v] = convert.rgb.hsv([r, g, b]);
  return {
    hue: h,
    saturation: s / 100,
    brightness: v / 100,
  };
};
