import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';
import dishJollof from '@/assets/dish-jollof.jpg';
import dishWaakye from '@/assets/dish-waakye.jpg';
import dishBanku from '@/assets/dish-banku.jpg';
import heroRestaurant from '@/assets/hero-restaurant.jpg';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

const GalleryManagement = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([
    { id: 1, src: heroRestaurant, alt: 'Restaurant Interior', category: 'Ambiance' },
    { id: 2, src: dishJollof, alt: 'Jollof Rice', category: 'Dishes' },
    { id: 3, src: dishWaakye, alt: 'Waakye', category: 'Dishes' },
    { id: 4, src: dishBanku, alt: 'Banku', category: 'Dishes' },
    { id: 5, src: heroRestaurant, alt: 'Dining Experience', category: 'Ambiance' },
    { id: 6, src: dishJollof, alt: 'Signature Dish', category: 'Dishes' },
  ]);

  const handleAddImage = () => {
    const newImage: GalleryImage = {
      id: Date.now(),
      src: heroRestaurant,
      alt: 'New Image',
      category: 'Dishes',
    };
    setImages([...images, newImage]);
    toast({
      title: 'Image added!',
      description: 'New image slot created. Update the details below.',
    });
  };

  const handleDeleteImage = (id: number) => {
    setImages(images.filter((img) => img.id !== id));
    toast({
      title: 'Image deleted!',
      description: 'The image has been removed from the gallery.',
    });
  };

  const handleSave = () => {
    toast({
      title: 'Changes saved!',
      description: 'Gallery has been updated successfully.',
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative -mx-6 -mt-6 mb-8 overflow-hidden rounded-b-xl">
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroRestaurant})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-10">
            <h1 className="text-4xl font-bold text-white mb-2">Gallery Management</h1>
            <p className="text-white/90">Manage images displayed in the gallery</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleAddImage} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Image
        </Button>
      </div>

      <div className="grid gap-6">
        {images.map((image, index) => (
          <Card key={image.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Image {index + 1}</CardTitle>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteImage(image.id)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full aspect-square object-cover rounded-lg border"
                  />
                </div>
                <div className="md:col-span-3 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`image-url-${image.id}`}>Image URL</Label>
                    <Input
                      id={`image-url-${image.id}`}
                      value={image.src}
                      onChange={(e) => {
                        const newImages = [...images];
                        const idx = newImages.findIndex((img) => img.id === image.id);
                        newImages[idx].src = e.target.value;
                        setImages(newImages);
                      }}
                      placeholder="Enter image URL"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`image-alt-${image.id}`}>Alt Text</Label>
                      <Input
                        id={`image-alt-${image.id}`}
                        value={image.alt}
                        onChange={(e) => {
                          const newImages = [...images];
                          const idx = newImages.findIndex((img) => img.id === image.id);
                          newImages[idx].alt = e.target.value;
                          setImages(newImages);
                        }}
                        placeholder="Description for accessibility"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`image-category-${image.id}`}>Category</Label>
                      <Select
                        value={image.category}
                        onValueChange={(value) => {
                          const newImages = [...images];
                          const idx = newImages.findIndex((img) => img.id === image.id);
                          newImages[idx].category = value;
                          setImages(newImages);
                        }}
                      >
                        <SelectTrigger id={`image-category-${image.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dishes">Dishes</SelectItem>
                          <SelectItem value="Ambiance">Ambiance</SelectItem>
                          <SelectItem value="Events">Events</SelectItem>
                          <SelectItem value="Team">Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default GalleryManagement;
