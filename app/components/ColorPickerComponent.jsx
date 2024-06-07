import React, { useState, useEffect } from 'react';
import { ColorPicker } from '@shopify/polaris';
import { hexToHsb } from "~/utils/colorUtils";

const ColorPickerComponent = ({color, onColorChange}) => {
  const initialHsbColor = hexToHsb(color);

  const [hsbColor, setHsbColor] = useState(initialHsbColor);

  useEffect(() => {
    setHsbColor(hexToHsb(color));
  }, [color]);

  const handleColorChange = (newColor) => {
    setHsbColor(newColor);
    onColorChange({
      hue: newColor.hue,
      saturation: newColor.saturation,
      brightness: newColor.brightness,
    });
  };


  return (
    <div>
      <ColorPicker onChange={handleColorChange} color={hsbColor}/>
    </div>
  );
};

export default ColorPickerComponent;
