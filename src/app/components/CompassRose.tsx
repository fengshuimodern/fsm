import React from 'react';

interface CompassRoseProps {
  luckyDirection: string;
}

const CompassRose: React.FC<CompassRoseProps> = ({ luckyDirection }) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return (
    <div className="relative w-32 h-32 border-2 border-gray-300 rounded-full">
      {directions.map((direction, index) => (
        <div
          key={direction}
          className={`absolute w-8 h-8 flex items-center justify-center
            ${luckyDirection.toUpperCase().includes(direction) ? 'text-green-500 font-bold' : ''}
          `}
          style={{
            top: `${50 + 40 * Math.sin((index * Math.PI) / 4)}%`,
            left: `${50 + 40 * Math.cos((index * Math.PI) / 4)}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {direction}
        </div>
      ))}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  );
};

export default CompassRose;