import { useState, useEffect } from 'react';
import { useRestaurant, GalleryImage } from '@/context/RestaurantContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';

const GalleryManagement = () => {
    const { galleryImages, setGalleryImages, heroTexts, setHeroText, heroImages, setHeroImage } = useRestaurant();
    const { toast } = useToast();

    // Hero Section
    const [heroTitle, setHeroTitle] = useState(heroTexts?.gallery?.title || 'Gallery');
    const [heroSubtitle, setHeroSubtitle] = useState(heroTexts?.gallery?.subtitle || '');
    const [heroImagesArray, setHeroImagesArray] = useState<string[]>(heroImages?.gallery || ['']);

    // Gallery Images
    const [images, setImages] = useState<GalleryImage[]>(galleryImages || []);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newImage, setNewImage] = useState({ src: '', alt: '', category: 'Dishes' });

    useEffect(() => {
        if (heroTexts?.gallery) {
            setHeroTitle(heroTexts.gallery.title || 'Gallery');
            setHeroSubtitle(heroTexts.gallery.subtitle || '');
        }
    }, [heroTexts]);

    useEffect(() => {
        if (heroImages?.gallery) {
            setHeroImagesArray(heroImages.gallery);
        }
    }, [heroImages]);

    useEffect(() => {
        setImages(galleryImages || []);
    }, [galleryImages]);

    const handleAddHeroImage = () => {
        setHeroImagesArray([...heroImagesArray, '']);
    };

    const handleHeroImageChange = (index: number, url: string) => {
        const newArr = [...heroImagesArray];
        newArr[index] = url;
        setHeroImagesArray(newArr);
    };

    const handleSaveHero = () => {
        setHeroText('gallery', { title: heroTitle, subtitle: heroSubtitle });
        // Filter out empty strings before saving
        const cleanImages = heroImagesArray.filter(url => url && url.trim() !== '');
        if (cleanImages.length > 0) {
            setHeroImage('gallery', cleanImages);
        }
        toast({ title: '✨ Success', description: 'Hero section updated successfully' });
    };

    const handleAddImage = () => {
        if (!newImage.src || !newImage.alt) {
            toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
            return;
        }

        const newId = images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : 1;
        const updatedImages = [...images, { ...newImage, id: newId }];
        setImages(updatedImages);
        setGalleryImages(updatedImages);
        setNewImage({ src: '', alt: '', category: 'Dishes' });
        setDialogOpen(false);
        toast({ title: '✨ Success', description: 'Image added successfully' });
    };

    const handleDeleteImage = (id: number) => {
        if (confirm('Are you sure you want to delete this image?')) {
            const updatedImages = images.filter(img => img.id !== id);
            setImages(updatedImages);
            setGalleryImages(updatedImages);
            toast({ title: '✨ Success', description: 'Image deleted successfully' });
        }
    };

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-8 border border-border/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <ImageIcon className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Gallery Management
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg ml-[60px]">Manage gallery images and page content</p>
                </div>
            </div>

            <Tabs defaultValue="hero" className="w-full space-y-6">
                <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-muted/50 rounded-xl">
                    <TabsTrigger value="hero" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Hero Section
                    </TabsTrigger>
                    <TabsTrigger value="images" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-accent data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Gallery Images
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="hero" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <CardTitle className="text-2xl">Hero Content</CardTitle>
                            <CardDescription className="text-base">Edit the hero section of the gallery page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-3">
                                <Label htmlFor="hero-title" className="text-base font-semibold">Title</Label>
                                <Input
                                    id="hero-title"
                                    value={heroTitle}
                                    onChange={(e) => setHeroTitle(e.target.value)}
                                    placeholder="Gallery"
                                    className="h-12 text-base border-border/50 focus:border-primary/50"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="hero-subtitle" className="text-base font-semibold">Subtitle</Label>
                                <Textarea
                                    id="hero-subtitle"
                                    value={heroSubtitle}
                                    onChange={(e) => setHeroSubtitle(e.target.value)}
                                    placeholder="Experience the vibrant atmosphere and authentic Ghanaian cuisine"
                                    rows={2}
                                    className="text-base border-border/50 focus:border-primary/50 resize-none"
                                />
                            </div>

                            {/* Hero Images */}
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Hero Background Images</Label>
                                <p className="text-sm text-muted-foreground">Add multiple images for a slideshow effect</p>
                                {heroImagesArray.map((url, idx) => (
                                    <div key={idx} className="relative">
                                        <ImageUpload
                                            label={`Hero Image ${idx + 1}`}
                                            value={url}
                                            onChange={newUrl => handleHeroImageChange(idx, newUrl)}
                                        />
                                        {heroImagesArray.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="mt-2"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newArr = heroImagesArray.filter((_, i) => i !== idx);
                                                    setHeroImagesArray(newArr);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Remove Image {idx + 1}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAddHeroImage();
                                    }}
                                    variant="outline"
                                    className="w-full h-12 text-base font-semibold"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Add Hero Image
                                </Button>
                            </div>

                            <Button onClick={handleSaveHero} className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all" variant="premium">
                                <Save className="h-5 w-5 mr-2" />
                                Save Hero Section
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="images" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-2xl">Gallery Images</CardTitle>
                                    <CardDescription className="text-base">Manage images displayed in the gallery</CardDescription>
                                </div>
                                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="premium" className="shadow-md">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Image
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl">Add Gallery Image</DialogTitle>
                                            <DialogDescription>Upload a new image to the gallery</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-6 py-4">
                                            <ImageUpload
                                                label="Image"
                                                value={newImage.src}
                                                onChange={(url) => setNewImage({ ...newImage, src: url })}
                                            />

                                            <div className="space-y-3">
                                                <Label className="font-semibold">Alt Text</Label>
                                                <Input
                                                    value={newImage.alt}
                                                    onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                                                    placeholder="Image description"
                                                    className="h-10"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="font-semibold">Category</Label>
                                                <select
                                                    className="w-full h-10 px-3 py-2 border rounded-md bg-background border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                    value={newImage.category}
                                                    onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                                                >
                                                    <option value="Dishes">Dishes</option>
                                                    <option value="Ambiance">Ambiance</option>
                                                    <option value="Events">Events</option>
                                                    <option value="Team">Team</option>
                                                </select>
                                            </div>

                                            <Button onClick={handleAddImage} className="w-full h-12 text-base font-semibold" variant="premium">
                                                <Save className="h-5 w-5 mr-2" />
                                                Add Image
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {images.map((image) => (
                                    <div key={image.id} className="group relative border-2 border-border/50 rounded-xl p-2 bg-gradient-to-br from-muted/20 to-background hover:border-primary/30 transition-all shadow-sm hover:shadow-md">
                                        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-8 w-8 shadow-md"
                                                onClick={() => handleDeleteImage(image.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="aspect-video w-full overflow-hidden rounded-lg mb-3 bg-muted">
                                            <img
                                                src={image.src}
                                                alt={image.alt}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="px-2 pb-2">
                                            <p className="font-semibold truncate">{image.alt}</p>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mt-1">
                                                {image.category}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {images.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border">
                                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                                    <p>No images yet. Add your first image!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default GalleryManagement;
