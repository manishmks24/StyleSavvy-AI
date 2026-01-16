import SavedOutfitsGrid from "./saved-outfits-grid";

export const metadata = {
  title: "Saved Outfits | StyleSavvy AI",
};

export default function SavedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Your Saved Outfits
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Here are all the amazing looks you've saved. Revisit your favorites anytime!
        </p>
      </div>
      <SavedOutfitsGrid />
    </div>
  );
}
