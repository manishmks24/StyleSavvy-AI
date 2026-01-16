'use client';

import Image from 'next/image';
import { useSavedOutfits } from '@/context/saved-outfits-context';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function SavedOutfitsGrid() {
  const { savedOutfits, removeOutfit } = useSavedOutfits();

  if (savedOutfits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-20 text-center">
        <h3 className="text-2xl font-bold tracking-tight">No saved outfits yet</h3>
        <p className="mt-2 text-muted-foreground">
          Go back to the homepage and find some styles you love!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {savedOutfits.map((outfit) => (
        <Card key={outfit.id} className="overflow-hidden group">
          <CardContent className="p-0 relative">
            <Image
              src={outfit.imageUrl}
              alt={outfit.description}
              width={600}
              height={800}
              className="w-full h-auto object-cover aspect-[3/4]"
              data-ai-hint={outfit.imageHint}
            />
             <div className="absolute top-2 right-2">
               <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeOutfit(outfit.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove outfit</span>
              </Button>
             </div>
          </CardContent>
          <CardFooter className="p-3 flex flex-col items-start">
            <p className="text-sm text-foreground flex-1 w-full">{outfit.description}</p>
             <p className="text-xs text-muted-foreground mt-2">
              Saved {formatDistanceToNow(new Date(outfit.savedAt), { addSuffix: true })}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
