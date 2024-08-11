"use client";

import React from 'react';

interface FurnitureLibraryProps {
  addFurniture: (type: string) => void;
}

const FurnitureLibrary: React.FC<FurnitureLibraryProps> = ({ addFurniture }) => {
  const furnitureTypes = [
    'sofa', 'chair', 'table', 'bed', 'dresser', 'bookshelf',
    'desk', 'nightstand', 'wardrobe', 'dining table', 'coffee table',
    'armchair', 'ottoman', 'tv stand', 'plant', 'rug', 'lamp'
  ];

  return (
    <div className="w-64 flex-shrink-0 border-r bg-background p-4 overflow-y-auto">
      <div className="mb-4 text-lg font-semibold">Furniture Library</div>
      <div className="grid grid-cols-2 gap-4">
        {furnitureTypes.map((item) => (
          <button 
            key={item} 
            onClick={() => addFurniture(item)} 
            className="p-2 border rounded hover:bg-gray-100 text-sm capitalize"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FurnitureLibrary;