import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { toPng, toSvg } from 'html-to-image';
import { v4 as uuidv4 } from 'uuid';
import { 
  Type, 
  Smile,
  Palette, 
  Download,
  Layout,
  CircleDot,
  Square,
  Triangle,
  Heart,
  Star,
  Building2,
  Utensils,
  Shirt,
  ShoppingBag,
  Laptop
} from 'lucide-react';
import { LogoLayer, LogoTemplate, Position } from './types';
import { LayerPanel } from './components/LayerPanel';
import { StylePanel } from './components/StylePanel';

function App() {
  const [businessName, setBusinessName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState(32);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [layers, setLayers] = useState<LogoLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const logoRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef(null);

  const templates: LogoTemplate[] = [
    { id: 1, name: 'Simple Icon', icon: <CircleDot size={32} />, layout: 'icon-top', category: 'general' },
    { id: 2, name: 'Modern Square', icon: <Square size={32} />, layout: 'icon-left', category: 'general' },
    { id: 3, name: 'Triangle Brand', icon: <Triangle size={32} />, layout: 'icon-right', category: 'general' },
    { id: 4, name: 'Lovely Heart', icon: <Heart size={32} />, layout: 'icon-bottom', category: 'general' },
    { id: 5, name: 'Star Business', icon: <Star size={32} />, layout: 'icon-center', category: 'general' },
    { id: 6, name: 'Corporate', icon: <Building2 size={32} />, layout: 'icon-left', category: 'business' },
    { id: 7, name: 'Restaurant', icon: <Utensils size={32} />, layout: 'icon-left', category: 'food' },
    { id: 8, name: 'Fashion', icon: <Shirt size={32} />, layout: 'icon-top', category: 'fashion' },
    { id: 9, name: 'Retail', icon: <ShoppingBag size={32} />, layout: 'icon-left', category: 'retail' },
    { id: 10, name: 'Tech', icon: <Laptop size={32} />, layout: 'icon-right', category: 'tech' },
  ];

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'general', name: 'General' },
    { id: 'business', name: 'Corporate' },
    { id: 'food', name: 'Restaurant' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'retail', name: 'Retail' },
    { id: 'tech', name: 'Technology' },
  ];

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const newLayer: LogoLayer = {
      id: uuidv4(),
      type: 'emoji',
      content: emojiData.emoji,
      position: { x: 0, y: 0 },
      style: {
        fontSize: 32,
        opacity: 1,
        rotation: 0,
      },
      visible: true,
      locked: false,
    };
    setLayers([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
    setShowEmojiPicker(false);
  };

  const handleTemplateSelect = (templateId: number) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      const newLayer: LogoLayer = {
        id: uuidv4(),
        type: 'icon',
        content: template.icon,
        position: { x: 0, y: 0 },
        style: {
          color: selectedColor,
          fontSize: 32,
          opacity: 1,
          rotation: 0,
        },
        visible: true,
        locked: false,
      };
      setLayers([...layers, newLayer]);
      setSelectedLayerId(newLayer.id);
      setSelectedTemplate(templateId);
    }
  };

  const handleTextChange = (text: string) => {
    setBusinessName(text);
    const existingTextLayer = layers.find((layer) => layer.type === 'text');
    if (text && !existingTextLayer) {
      const newLayer: LogoLayer = {
        id: uuidv4(),
        type: 'text',
        content: text,
        position: { x: 0, y: 0 },
        style: {
          color: selectedColor,
          fontSize,
          opacity: 1,
          rotation: 0,
        },
        visible: true,
        locked: false,
      };
      setLayers([...layers, newLayer]);
      setSelectedLayerId(newLayer.id);
    } else if (existingTextLayer) {
      setLayers(
        layers.map((layer) =>
          layer.id === existingTextLayer.id
            ? { ...layer, content: text }
            : layer
        )
      );
    }
  };

  const handleLayerMove = (id: string, position: Position) => {
    setLayers(
      layers.map((layer) =>
        layer.id === id ? { ...layer, position } : layer
      )
    );
  };

  const handleLayerStyleUpdate = (id: string, style: Partial<LogoLayer['style']>) => {
    setLayers(
      layers.map((layer) =>
        layer.id === id ? { ...layer, style: { ...layer.style, ...style } } : layer
      )
    );
  };

  const handleToggleVisibility = (id: string) => {
    setLayers(
      layers.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const handleToggleLock = (id: string) => {
    setLayers(
      layers.map((layer) =>
        layer.id === id ? { ...layer, locked: !layer.locked } : layer
      )
    );
  };

  const handleDeleteLayer = (id: string) => {
    setLayers(layers.filter((layer) => layer.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  const handleMoveLayer = (id: string, direction: 'up' | 'down') => {
    const index = layers.findIndex((layer) => layer.id === id);
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < layers.length - 1)
    ) {
      const newLayers = [...layers];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newLayers[index], newLayers[targetIndex]] = [
        newLayers[targetIndex],
        newLayers[index],
      ];
      setLayers(newLayers);
    }
  };

  const exportLogo = async (format: 'png' | 'svg') => {
    if (!logoRef.current) return;
    
    try {
      let dataUrl;
      if (format === 'png') {
        dataUrl = await toPng(logoRef.current, { quality: 1.0 });
      } else {
        dataUrl = await toSvg(logoRef.current);
      }
      
      const link = document.createElement('a');
      link.download = `logo.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const filteredTemplates = templates.filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Logo Maker</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => exportLogo('png')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PNG
              </button>
              <button
                onClick={() => exportLogo('svg')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export SVG
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <Type className="h-5 w-5 mr-2" />
                Business Name
              </h2>
              <input
                type="text"
                value={businessName}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your business name"
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <Smile className="h-5 w-5 mr-2" />
                Emoji
              </h2>
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left"
              >
                Select an emoji
              </button>
              {showEmojiPicker && (
                <div className="mt-2">
                  <EmojiPicker onEmojiClick={onEmojiClick} width="100%" />
                </div>
              )}
            </div>

            <LayerPanel
              layers={layers}
              onToggleVisibility={handleToggleVisibility}
              onToggleLock={handleToggleLock}
              onDeleteLayer={handleDeleteLayer}
              onMoveLayer={handleMoveLayer}
              onSelectLayer={setSelectedLayerId}
              selectedLayerId={selectedLayerId}
            />

            {selectedLayerId && (
              <StylePanel
                layer={layers.find((l) => l.id === selectedLayerId)!}
                onUpdateStyle={handleLayerStyleUpdate}
              />
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-sm min-h-[400px]">
              <div 
                ref={logoRef}
                className="w-full h-[400px] relative bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden"
              >
                {layers.map((layer) => (
                  <Draggable
                    key={layer.id}
                    nodeRef={nodeRef}
                    position={layer.position}
                    onStop={(e, data) => handleLayerMove(layer.id, { x: data.x, y: data.y })}
                    disabled={layer.locked}
                  >
                    <div
                      ref={nodeRef}
                      className={`cursor-move absolute ${
                        !layer.visible ? 'opacity-50' : ''
                      } ${selectedLayerId === layer.id ? 'ring-2 ring-blue-500' : ''}`}
                      style={{
                        ...layer.style,
                        transform: `rotate(${layer.style.rotation || 0}deg)`,
                        filter: layer.style.shadow
                          ? `drop-shadow(${layer.style.shadowBlur}px ${layer.style.shadowBlur}px ${
                              layer.style.shadowBlur
                            }px ${layer.style.shadowColor || '#000000'})`
                          : undefined,
                        background: layer.style.gradient
                          ? `linear-gradient(45deg, ${layer.style.gradientColors?.[0] || '#000000'}, ${
                              layer.style.gradientColors?.[1] || '#ffffff'
                            })`
                          : undefined,
                      }}
                      onClick={() => setSelectedLayerId(layer.id)}
                    >
                      {layer.content}
                    </div>
                  </Draggable>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <Layout className="h-5 w-5 mr-2" />
                Categories
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {template.icon}
                    <span className="text-sm text-gray-600">{template.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;