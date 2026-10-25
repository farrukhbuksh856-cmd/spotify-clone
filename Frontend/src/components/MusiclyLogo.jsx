import { Music } from 'lucide-react';

export default function MusiclyLogo({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: { box: 'w-8 h-8', icon: 'w-4 h-4' },
    md: { box: 'w-9 h-9', icon: 'w-5 h-5' },
    lg: { box: 'w-12 h-12', icon: 'w-6 h-6' },
  };

  const { box, icon } = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`${box} rounded-full bg-[#1db954] flex items-center justify-center text-black font-bold shadow-md shadow-[#1db954]/20 shrink-0 ${className}`}
    >
      <Music className={`${icon} text-black stroke-[2.5]`} />
    </div>
  );
}
