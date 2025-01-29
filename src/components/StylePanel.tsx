import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { LogoLayer } from '../types';
import { Droplet, Palette, Layers, RotateCw } from 'lucide-react';

type StylePanelProps = {
  layer: LogoLayer;
  onUpdateStyle: (id: string, style: Partial<LogoLayer['style']>) => void;
};

export function StylePanel({ layer, onUpdateStyle }: StylePanelProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-4">Style</h2>
      <div className="space-y-4">
        {/* Color */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Droplet size={16} />
            Color
          </label>
          <HexColorPicker
            color={layer.style.color}
            onChange={(color) => onUpdateStyle(layer.id, { color })}
          />
        </div>

        {/* Opacity */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Layers size={16} />
            Opacity
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={(layer.style.opacity || 1) * 100}
            onChange={(e) => onUpdateStyle(layer.id, { opacity: Number(e.target.value) / 100 })}
            className="w-full"
          />
        </div>

        {/* Rotation */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <RotateCw size={16} />
            Rotation
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={layer.style.rotation || 0}
            onChange={(e) => onUpdateStyle(layer.id, { rotation: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Shadow */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            Shadow
          </label>
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={layer.style.shadow}
              onChange={(e) => onUpdateStyle(layer.id, { shadow: e.target.checked })}
            />
            {layer.style.shadow && (
              <>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={layer.style.shadowBlur || 5}
                  onChange={(e) => onUpdateStyle(layer.id, { shadowBlur: Number(e.target.value) })}
                  className="w-full"
                />
                <HexColorPicker
                  color={layer.style.shadowColor || '#000000'}
                  onChange={(color) => onUpdateStyle(layer.id, { shadowColor: color })}
                />
              </>
            )}
          </div>
        </div>

        {/* Gradient */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Palette size={16} />
            Gradient
          </label>
          <input
            type="checkbox"
            checked={layer.style.gradient}
            onChange={(e) => onUpdateStyle(layer.id, { gradient: e.target.checked })}
          />
          {layer.style.gradient && (
            <div className="flex gap-2 mt-2">
              <HexColorPicker
                color={layer.style.gradientColors?.[0] || '#000000'}
                onChange={(color) =>
                  onUpdateStyle(layer.id, {
                    gradientColors: [color, layer.style.gradientColors?.[1] || '#ffffff'],
                  })
                }
              />
              <HexColorPicker
                color={layer.style.gradientColors?.[1] || '#ffffff'}
                onChange={(color) =>
                  onUpdateStyle(layer.id, {
                    gradientColors: [layer.style.gradientColors?.[0] || '#000000', color],
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}