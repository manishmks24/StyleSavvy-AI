'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const clothes = PlaceHolderImages.slice(0, 5).map((img) => ({
  ...img,
}));

export function AnimatedClothes() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden blur-sm opacity-30 pointer-events-none">
        <Image
            src={clothes[0].imageUrl}
            alt={clothes[0].description}
            width={150}
            height={200}
            className="absolute object-cover rounded-lg shadow-xl animate-float top-1/4 left-[15%]"
            style={{ animationDuration: '8s' }}
            data-ai-hint={clothes[0].imageHint}
        />
        <Image
            src={clothes[1].imageUrl}
            alt={clothes[1].description}
            width={150}
            height={200}
            className="absolute object-cover rounded-lg shadow-xl animate-float top-10 right-[15%]"
            style={{ animationDuration: '10s', animationDelay: '1s' }}
            data-ai-hint={clothes[1].imageHint}
        />
        <Image
            src={clothes[2].imageUrl}
            alt={clothes[2].description}
            width={150}
            height={200}
            className="absolute object-cover rounded-lg shadow-xl animate-float bottom-10 left-[5%]"
            style={{ animationDuration: '12s', animationDelay: '2s' }}
            data-ai-hint={clothes[2].imageHint}
        />
        <Image
            src={clothes[3].imageUrl}
            alt={clothes[3].description}
            width={150}
            height={200}
            className="absolute object-cover rounded-lg shadow-xl animate-float bottom-1/3 right-[5%]"
            style={{ animationDuration: '7s', animationDelay: '3s' }}
            data-ai-hint={clothes[3].imageHint}
        />
         <Image
            src={clothes[4].imageUrl}
            alt={clothes[4].description}
            width={150}
            height={200}
            className="absolute object-cover rounded-lg shadow-xl animate-float top-20 left-[30%]"
             style={{ animationDuration: '9s', animationDelay: '4s' }}
            data-ai-hint={clothes[4].imageHint}
        />
    </div>
  );
}
