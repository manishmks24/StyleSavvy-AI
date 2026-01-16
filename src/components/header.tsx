'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useSavedOutfits } from '@/context/saved-outfits-context';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const { savedOutfits } = useSavedOutfits();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-6 w-6" />
          <span className="font-bold font-headline sm:inline-block">
            StyleSavvy AI
          </span>
        </Link>
        <nav className="flex flex-1 items-center justify-end">
          <Button asChild variant="ghost" className="relative">
            <Link href="/saved">
              <Heart className="mr-2 h-4 w-4" />
              Saved Outfits
              {savedOutfits.length > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs h-auto">
                  {savedOutfits.length}
                </Badge>
              )}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
