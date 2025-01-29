import React from 'react';
import { LogoLayer } from '../types';
import { Eye, EyeOff, Lock, Unlock, Trash2, MoveUp, MoveDown } from 'lucide-react';

type LayerPanelProps = {
  layers: LogoLayer[];
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
  onSelectLayer: (id: string) => void;
  selectedLayerId: string | null;
};

export function LayerPanel({
  layers,
  onToggleVisibility,
  onToggleLock,
  onDeleteLayer,
  onMoveLayer,
  onSelectLayer,
  selectedLayerId,
}: LayerPanelProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-4">Layers</h2>
      <div className="space-y-2">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`flex items-center justify-between p-2 rounded ${
              selectedLayerId === layer.id ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelectLayer(layer.id)}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility(layer.id);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLock(layer.id);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {layer.locked ? <Lock size={16} /> : <Unlock size={16} />}
              </button>
              <span className="text-sm">{layer.type}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveLayer(layer.id, 'up');
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <MoveUp size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveLayer(layer.id, 'down');
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <MoveDown size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteLayer(layer.id);
                }}
                className="p-1 hover:bg-gray-100 rounded text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}